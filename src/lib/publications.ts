/**
 * Team publications.
 *
 * Identifier handling:
 *  - ORCID  -> read the authoritative list straight from the ORCID API (clean,
 *              no namesake pollution), then enrich each paper with citation
 *              counts + authors via EXACT DOI lookups on OpenAlex.
 *  - OpenAlex ID / name -> fall back to OpenAlex author filter.
 *
 * OpenAlex's own author records are name-clustered and over-merge common names,
 * which is why we prefer ORCID-direct whenever an ORCID is given.
 */
const OA = "https://api.openalex.org/works";
const ORCID = "https://pub.orcid.org/v3.0";
const MAILTO = import.meta.env.OPENALEX_MAILTO ?? "";

const KEEP_TYPES = new Set([
  "article", "review", "book-chapter", "book", "report", "preprint", "dissertation",
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

export function normDoi(doi?: string | null): string | null {
  if (!doi) return null;
  const bare = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim().toLowerCase();
  return bare || null;
}

function titleKey(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function isSupplementary(title = ""): boolean {
  return /^\s*(additional file|supplementary|supporting information|appendix|data (from|for)\b|figure s?\d)/i.test(
    title
  );
}

function isOrcid(id: string): boolean {
  return /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(id.trim());
}
function bareOrcid(id: string): string {
  return id.trim().replace(/^https?:\/\/orcid\.org\//i, "");
}

/* ---------- OpenAlex: exact citation/author lookup by DOI ---------- */
type Enrichment = { citations: number; venue: string; authors: string; url: string | null };

async function openAlexByDois(dois: string[]): Promise<Map<string, Enrichment>> {
  const map = new Map<string, Enrichment>();
  const clean = [...new Set(dois.filter(Boolean))];
  for (let i = 0; i < clean.length; i += 50) {
    const chunk = clean.slice(i, i + 50);
    const params = new URLSearchParams({
      filter: `doi:${chunk.map((d) => `https://doi.org/${d}`).join("|")}`,
      "per-page": "50",
    });
    if (MAILTO) params.set("mailto", MAILTO);
    try {
      const res = await fetch(`${OA}?${params.toString()}`);
      if (!res.ok) continue;
      const data = await res.json();
      for (const w of data.results ?? []) {
        const key = normDoi(w.doi);
        if (!key) continue;
        map.set(key, {
          citations: w.cited_by_count ?? 0,
          venue: w.primary_location?.source?.display_name ?? "",
          authors: (w.authorships ?? [])
            .map((a: any) => a.author?.display_name)
            .filter(Boolean)
            .join(", "),
          url: w.doi ?? null,
        });
      }
    } catch {}
  }
  return map;
}

/* ---------- ORCID: the authoritative list for a person ---------- */
async function worksForOrcid(orcid: string): Promise<Pub[]> {
  let groups: any[] = [];
  try {
    const res = await fetch(`${ORCID}/${orcid}/works`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    groups = data.group ?? [];
  } catch {
    return [];
  }

  const list = groups
    .map((g) => (g["work-summary"] ?? [])[0])
    .filter(Boolean)
    .map((s: any) => {
      const title = s.title?.title?.value ?? "Untitled";
      const yearStr = s["publication-date"]?.year?.value;
      const doiRaw = ((s["external-ids"]?.["external-id"] ?? []).find(
        (e: any) => (e["external-id-type"] || "").toLowerCase() === "doi"
      ) || {})["external-id-value"];
      return {
        title,
        year: yearStr ? Number(yearStr) : null,
        journal: s["journal-title"]?.value ?? "",
        doi: normDoi(doiRaw),
      };
    })
    .filter((w) => !isSupplementary(w.title));

  const enrich = await openAlexByDois(list.map((w) => w.doi).filter(Boolean) as string[]);

  return list.map((w): Pub => {
    const e = w.doi ? enrich.get(w.doi) : undefined;
    return {
      title: w.title,
      year: w.year,
      doi: w.doi,
      venue: e?.venue || w.journal || "",
      citations: e?.citations ?? 0,
      authors: e?.authors ?? "",
      url: e?.url ?? (w.doi ? `https://doi.org/${w.doi}` : null),
    };
  });
}

/* ---------- OpenAlex author filter (fallback for OpenAlex ID / name) ---------- */
function authorFilter(id: string): string {
  const v = id.trim();
  if (/^A\d+$/i.test(v)) return `author.id:${v}`;
  return `raw_author_name.search:${v}`;
}

async function worksForOpenAlexAuthor(id: string): Promise<Pub[]> {
  const params = new URLSearchParams({
    filter: authorFilter(id),
    "per-page": "200",
    sort: "publication_year:desc",
  });
  if (MAILTO) params.set("mailto", MAILTO);
  try {
    const res = await fetch(`${OA}?${params.toString()}`);
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
    return [];
  }
}

async function worksFor(id: string): Promise<Pub[]> {
  return isOrcid(id) ? worksForOrcid(bareOrcid(id)) : worksForOpenAlexAuthor(id);
}

/* ---------- aggregate the whole team ---------- */
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
      const better = (!existing.doi && p.doi) || p.citations > existing.citations;
      if (better) byKey.set(key, p);
    }
  }
  return [...byKey.values()].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}