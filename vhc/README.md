# BharatConnect — Indian Services, Jobs & Freelance Marketplace

A browser-managed starter project for a responsive marketplace PWA, GitHub Pages deployment, and Windows desktop EXE builds through GitHub Actions.

## What is included

- Responsive React + TypeScript + Vite frontend using hash routing so GitHub Pages refreshes work without server rewrites.
- Search/filter interactions for sample service, job, and freelance-project listings.
- Saved provider/job toggles for the current browser session.
- PWA manifest, service-worker generation, and offline app-shell caching.
- Electron desktop wrapper with renderer isolation.
- GitHub Actions workflows for CI, GitHub Pages deployment, and Windows `.exe` artifacts.
- Initial Supabase PostgreSQL schema and basic restrictive RLS policies.
- No local Node, npm, Git, or terminal is needed for the normal workflow.

## Important current limitations

This ZIP is a **starter application**, not a completed production marketplace. Visible listing data is illustrative and stored in `src/data.ts`. Booking, account registration, job application submission, messaging, proposal submission, identity checks, moderation and payments are not live. UI buttons explicitly say so. Supabase credentials alone do not activate these workflows; database policies, auth redirects, storage rules and server-side authorization must be configured and tested. Do not publish private resumes or identity documents until storage access is locked down. No escrow/payment flow is included.

## Architecture

- Frontend/PWA: GitHub Pages (static files only).
- CI and builds: GitHub Actions (hosted runners).
- Optional database/auth: Supabase hosted project.
- Windows app: Electron packaged by a Windows GitHub Actions runner.
- Secrets: no privileged secret is needed by the frontend. `VITE_*` values are compiled into public browser code and must never contain a service-role key.

## Repository file tree

```text
.github/workflows/ci.yml
.github/workflows/deploy-pages.yml
public/favicon.svg
public/icons/icon-192.svg
public/icons/icon-512.svg
src/App.tsx
src/data.ts
src/lib/supabase.ts
src/lib/supabase.test.ts
src/main.tsx
src/styles.css
src/types.ts
src/vite-env.d.ts
electron/main.cjs
supabase/migrations/0001_initial_schema.sql
.env.example
.gitignore
index.html
package.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
README.md
LICENSE
```

## GitHub website setup

1. Sign in to GitHub and create a **public** repository named `bharatconnect-marketplace` (or another name). For a public repo, avoid placing private information in commits.
2. On the repository page, choose **Add file → Upload files** and upload the extracted ZIP contents, preserving folders. GitHub's web uploader accepts multiple files; if uploading folder structures is awkward, create files via **Add file → Create new file** and include the path in the filename.
3. Commit to `main`. GitHub Actions will run. Open the **Actions** tab and inspect CI/build logs.
4. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
5. In **Settings → Actions → General**, ensure Actions are enabled and workflow permissions allow workflows to create Pages deployments. The workflow itself declares the needed `pages: write` and `id-token: write` permissions.
6. Push/commit a change in the GitHub website or select **Actions → Build PWA and Windows app → Run workflow**.
7. When the `build-web` job succeeds, the Pages deployment URL appears in the workflow summary. Do not assume it is live until this is green.
8. In the same workflow, open the `build-windows` job artifact named `BharatConnect-Windows-EXE` and download it. It contains a Windows installer and portable EXE if packaging succeeded.

## Optional Supabase setup (browser dashboard)

1. Create a project at https://supabase.com/ and select a region suitable for your audience. Check the current pricing and limits before committing to it.
2. Open **SQL Editor → New query**. Copy the contents of `supabase/migrations/0001_initial_schema.sql`, run it, and review the result.
3. In **Project Settings → API**, copy the project URL and the public anon/publishable key. Never copy the `service_role` key into the app.
4. In GitHub open **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Re-run the workflow so these values are included in the frontend build. These are public build-time values, not secrets.
6. In Supabase **Authentication → URL Configuration**, add the GitHub Pages URL to Site URL / Redirect URLs, adjusted to your real repository URL.
7. Keep RLS enabled. The migration intentionally leaves many write workflows without permissive policies. Before enabling a feature, add policies or secure database functions for each action and test them with separate accounts/roles. Never let clients write their own roles, verification state, or moderation decisions.
8. If using Supabase Storage for resumes or identity records, use private buckets and short-lived signed URLs with server-side authorization. Identity documents need an explicit consent, retention, correction and appeal process.

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | GitHub Actions Variables | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | GitHub Actions Variables | Public browser key, safe only with correctly configured RLS |

Do not set `SUPABASE_SERVICE_ROLE_KEY` as a `VITE_*` variable. The frontend must never receive it. `.env.example` contains placeholders only.

## Browser-only testing checklist

- [ ] CI job succeeds in GitHub Actions.
- [ ] PWA build succeeds and the Pages deployment job is green.
- [ ] Public Pages URL loads on mobile and desktop.
- [ ] Service category cards navigate to service search.
- [ ] Search works for title/category and location text.
- [ ] Job type filter and saved-job controls work.
- [ ] Saved providers toggle on/off.
- [ ] Freelance category filter and project search work.
- [ ] Modal messages make clear that unconnected operations are not submitted.
- [ ] Test offline app-shell behavior after first successful load.
- [ ] Windows artifact is available from the workflow run.
- [ ] Supabase RLS is tested using anonymous and authenticated test accounts before any real personal data is entered.

## Troubleshooting

- **Build fails:** open Actions → failed run → failed step, read the first TypeScript/dependency error. Fix that exact file in GitHub and commit again.
- **Pages URL gives 404:** confirm Pages source is GitHub Actions, workflow deployment succeeded, and `index.html` is included in `dist`.
- **Assets fail to load:** this project uses relative production paths (`base: './'`) to support GitHub Pages project URLs and Electron file loading.
- **Supabase reports permission denied:** check table RLS policies. Do not fix by disabling RLS globally.
- **Login redirect fails:** add the exact Pages URL and allowed callback paths in Supabase Auth URL Configuration.
- **EXE artifact missing:** inspect `build-windows` job. The artifact is uploaded only when `.exe` files exist.
- **PWA offline mode:** the first online load is needed to cache assets; dynamic backend actions will not work offline.
- **CORS / unavailable backend:** confirm the project URL, public key, auth redirect and hosted service status. Never put service-role keys in frontend code.

## Planned implementation phases

1. Frontend foundation (this ZIP).
2. Supabase auth, profiles and role onboarding; then provider publishing.
3. Booking state transitions, job applications and employer dashboard.
4. Reviews tied to completed work, reporting/moderation, audit logs and verification workflow.
5. Freelance proposals, secure messaging and work submissions.
6. Carefully reviewed advertising controls and optional promotions.
7. Security review, automated integration tests, accessibility checks and production launch.

## Licensing

See `LICENSE`.
