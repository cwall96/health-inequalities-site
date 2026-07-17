/**
 * Fetches team publications from OpenAlex (free, no key).
 * Each person is looked up by ORCID (preferred), OpenAlex author ID, or name (fallback).
 * The `mailto` comes from the OPENALEX_MAILTO env var — change it in one place.
 */
const BASE = "https://api.openalex.org/works";
const MAILTO = import.meta.env.OPENALEX_MAILTO ?? "";

// Only keep real research outputs. This drops OpenAlex noise like
// "supplementary-materials" ("Additional file 1/2"), datasets, and paratext.
const KEEP_TYPES = new Set([
  "article",
  "review",
  "book-chapter",
  "book",
  "report",
  "preprint",
  "dissertation",
]);

export type Pub = {
  title: string;
  year: number | null;
  doi: string | null;
  venue: string;
  citations: number;
  authors: string;
  url: string | null;
};

/** Reduce any DOI form to a bare, lowercase key: "10.1234/abc". */
export function normDoi(doi?: string | null): string | null {
  if (!doi) return null;
  const bare = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim().toLowerCase();
  return bare || null;
}

/** Normalise a title into a dedupe key. */
function titleKey(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Repository "Additional file 1 of…", supplementary material, appendices, datasets. */
function isSupplementary(title = ""): boolean {
  return /^\s*(additional file|supplementary|supporting information|appendix|data (from|for)\b|figure s?\d)/i.test(
    title
  );
}


/** Decide which OpenAlex filter to use from whatever identifier the editor entered. */
function filterFor(id: string): string {
  const v = id.trim();
  if (/^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(v)) {
    const orcid = v.replace(/^https?:\/\/orcid\.org\//i, "");
    return `author.orcid:${orcid}`;
  }
  if (/^A\d+$/i.test(v)) return `author.id:${v}`;
  return `raw_author_name.search:${v}`; // fallback — least reliable
}

async function worksFor(id: string): Promise<Pub[]> {
  const params = new URLSearchParams({
    filter: filterFor(id),
    "per-page": "200",
    sort: "publication_year:desc",
  });
  if (MAILTO) params.set("mailto", MAILTO);

  try {
    const res = await fetch(`${BASE}?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? [])
      .filter((w: any) => KEEP_TYPES.has(w.type) && !isSupplementary(w.display_name))
      .map(
        (w: any): Pub => ({
          title: w.display_name ?? "Untitled",
          year: w.publication_year ?? null,
          doi: normDoi(w.doi),
          venue: w.primary_location?.source?.display_name ?? "",
          citations: w.cited_by_count ?? 0,
          authors: (w.authorships ?? [])
            .map((a: any) => a.author?.display_name)
            .filter(Boolean)
            .join(", "),
          url: w.doi ?? w.primary_location?.landing_page_url ?? null,
        })
      );
  } catch {
    return []; // never let a fetch hiccup break the build
  }
}

/**
 * Aggregate everyone's works, merge in manual entries, drop hidden DOIs,
 * collapse duplicates of the same title (repository copies, abstracts) to one,
 * preferring the version that has a DOI and/or more citations, then sort newest-first.
 */
export async function teamPublications(
  ids: string[],
  opts: { hidden?: string[]; manual?: Pub[] } = {}
): Promise<Pub[]> {
  const fetched = (await Promise.all(ids.filter(Boolean).map(worksFor))).flat();
  const all = [...fetched, ...(opts.manual ?? [])];
  const hidden = new Set((opts.hidden ?? []).map((d) => normDoi(d)).filter(Boolean));

  const byKey = new Map<string, Pub>();
  for (const p of all) {
    if (p.doi && hidden.has(p.doi)) continue;
    const key = titleKey(p.title) || p.doi || Math.random().toString(36);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, p);
    } else {
      // prefer the copy with a DOI, then the one with more citations
      const better = (!existing.doi && p.doi) || p.citations > existing.citations;
      if (better) byKey.set(key, p);
    }
  }
  return [...byKey.values()].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}