# Health Inequalities Team — website

Astro + Keystatic + Tailwind v4. Static, fast, free to host, editable by
non-developers at `/keystatic`. People, presentations, and site copy are files
in this repo (no database). **Publications update themselves from OpenAlex** —
no scraping, no API key, no cost.

## What's here

```
src/
  styles/global.css     Design system (Tailwind v4 @theme tokens + components)
  lib/publications.ts   OpenAlex fetch: by ORCID / OpenAlex ID / name, dedupe by DOI
  layouts/Layout.astro  Page shell: fonts, icons, header, footer
  components/           Header, Footer, Hero (signature illustration), PersonCard
  pages/                index (Home), people, presentations, publications
  content/              Keystatic entries (People / Presentations / Manual publications)
keystatic.config.ts     Content model
astro.config.mjs        Integrations + adapter
.github/workflows/      Weekly rebuild (refreshes publications)
MOVING.md               Checklist for handing the repo to the HIT account
```

## Run it locally

Requires Node 20, 22, or 24.

```bash
cp .env.example .env          # then set OPENALEX_MAILTO to your address
npm install
npm run dev
```

- Site: http://localhost:4321
- Editor: http://localhost:4321/keystatic

> **Copying these files into a brand-new project?** Generate the base so
> versions resolve cleanly, then drop these files in:
> ```bash
> npm create astro@latest -- --template minimal --typescript strict
> npx astro add react netlify
> npm install tailwindcss @tailwindcss/vite @keystatic/core @keystatic/astro @astrojs/markdoc
> ```

## How publications work (automatic)

1. Give each person an identifier in `/keystatic` → People → **Publication identifier**:
   - **ORCID iD** (preferred, e.g. `0000-0002-1825-0097`) — most reliable.
   - **OpenAlex author ID** (e.g. `A5023888391`) — for anyone without an ORCID.
   - **Full name** — last-resort fallback; risky for common names.
2. On each build, the Publications page fetches everyone's works from OpenAlex,
   de-duplicates co-authored papers by DOI, and groups them by year with
   citation counts.
3. The **weekly rebuild** (`.github/workflows/rebuild.yml`) refreshes the list on
   its own. Set a repo secret `BUILD_HOOK_URL` to your host's build hook.

Editor overrides (in `/keystatic` → Homepage & settings):
- **Featured publication DOI** — pin one paper to the homepage.
- **Hidden DOIs** — suppress a mis-attributed paper.
- **Manual publications** collection — add outputs OpenAlex doesn't have (reports, etc.).

## The email (`OPENALEX_MAILTO`)

OpenAlex asks for a courtesy contact email (the "polite pool"). It's not a key
or a login. It lives in **one** place — the `OPENALEX_MAILTO` env var — so
changing from your test address to the HIT address is a one-line edit in `.env`
locally and in the host's environment settings. If unset, the site still works.

## Adding content (for non-developers)

Go to `/keystatic`, pick People / Presentations / Manual publications, add an
entry, upload a photo where relevant, save. Adding or removing a person is just
adding or deleting an entry — the grid, filters, and homepage counts all update
from the data. No layout or code is touched.

## Deploy (free)

Push to GitHub, connect the repo to **Netlify** or **Cloudflare Pages**. Public
pages are prerendered static HTML; the `/keystatic` route runs as a serverless
function via the adapter in `astro.config.mjs`. Set your production domain in
`astro.config.mjs` (`site`), and add `OPENALEX_MAILTO` in the host's env vars.

For live team editing, switch Keystatic to GitHub storage — see **MOVING.md**,
which also covers handing the repo to the HIT account later.

## Notes

- **Icons** load from the Tabler CDN in `Layout.astro`. For production, install
  `@tabler/icons-webfont` and import it instead.
- **Fonts** (Inter, Sora, Fraunces) load from Google Fonts in `global.css`.
  Swap headings to `font-serif` (Fraunces) for a more academic register.
- **The hero illustration** in `components/Hero.astro` is hand-built SVG — a
  faithful placeholder of the hands/scales/globe concept. Drop in a
  professionally produced vector later without touching anything else.
