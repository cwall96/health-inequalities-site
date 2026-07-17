# Moving the site to another GitHub account

The whole site is files in this repo plus one public API (OpenAlex), so there's
no database or hidden state to migrate. Moving to the HIT account is a settings
checklist, not a rebuild. Two ways to do it — pick one.

## Option A — Transfer the repo (cleanest)

1. On GitHub: repo **Settings → General → Transfer ownership** → enter the HIT
   account/org name. History, issues, everything moves in one step.
2. Reconnect the host (below) and update config (below).

## Option B — Re-push to a fresh repo

1. Create an empty repo under the HIT account (no README).
2. Locally:
   ```bash
   git remote set-url origin https://github.com/HIT-ACCOUNT/health-inequalities-site.git
   git push -u origin main
   ```

## After either option — the settings checklist

1. **Keystatic storage** — in `keystatic.config.ts`, set the repo to the new owner:
   ```ts
   storage: {
     kind: "github",
     repo: { owner: "HIT-ACCOUNT", name: "health-inequalities-site" },
   }
   ```
   (During development this is `{ kind: "local" }`; switch to GitHub for live editing.)

2. **Host connection** — in Netlify/Cloudflare, point the site at the new repo
   (or create a new site from it). Re-add the build command `astro build` and
   publish directory `dist`.

3. **Environment variables** — re-add on the new host:
   - `OPENALEX_MAILTO` — the HIT contact email (this is the only place the email lives).

4. **Weekly rebuild** — create a new build hook on the host, then add it as a
   repo secret named `BUILD_HOOK_URL` (Settings → Secrets and variables → Actions).
   The workflow in `.github/workflows/rebuild.yml` needs no other change.

5. **Editors without GitHub accounts (optional)** — connect the repo to
   [Keystatic Cloud](https://keystatic.com/docs/cloud) (free up to 3 users) and
   set `storage: { kind: "cloud" }`. Colleagues then log in and edit without
   ever touching GitHub.

6. **Production domain** — update `site` in `astro.config.mjs`.

That's it. Nothing in the content or the publications feed needs recreating.
