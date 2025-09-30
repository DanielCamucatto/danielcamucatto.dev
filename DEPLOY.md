# Deployment guide — frontend

This repository uses GitHub Actions to deploy the frontend to Netlify:

- `main` → Production (Netlify site)
- `homolog` → Staging (Netlify site)

This document explains how to create the Netlify sites, get the required secrets, and how the workflows work.

## Workflows added

- `.github/workflows/deploy-prod-netlify.yml` — builds `frontend` and deploys `frontend/dist` to the Netlify production site. Runs on `push` to `main`.
- `.github/workflows/deploy-homolog-netlify.yml` — builds `frontend` and deploys `frontend/dist` to the Netlify staging site. Runs on `push` to `homolog`.
- `.github/workflows/pr-validate.yml` — CI run on `pull_request` targeting `main` or `homolog` (and on push to `homolog`); installs deps, runs lint, builds and runs tests. This is used as a pre-merge check.

## Required repository secrets

Add the following secrets to the GitHub repository (Settings → Secrets → Actions):

- `NETLIFY_AUTH_TOKEN` — Netlify personal access token (scoped to Sites: write)
- `NETLIFY_SITE_ID_PROD` — Netlify site ID for the production site
- `NETLIFY_SITE_ID_STAGING` — Netlify site ID for the staging site

> If you prefer to use a single Netlify site with multiple branch deploys, set `NETLIFY_SITE_ID_PROD` and `NETLIFY_SITE_ID_STAGING` accordingly (they may point to the same site or different sites).

## How to get the Netlify Site ID and token

1. Log in to Netlify: https://app.netlify.com
2. Create a new site (New site from Git) or use an existing site.
3. In the site settings, go to "Site information" — you'll see **Site ID**. Copy it.
4. Create a personal access token: User menu → User settings → Applications → Personal access tokens → New access token. Give it a name and copy the token.
5. Add the token to your GitHub repo secrets as `NETLIFY_AUTH_TOKEN` and the Site IDs as `NETLIFY_SITE_ID_PROD` / `NETLIFY_SITE_ID_STAGING`.

## How it works

- On push to `homolog`, the staging workflow builds the `frontend` and pushes the `frontend/dist` folder to the Netlify site pointed by `NETLIFY_SITE_ID_STAGING`.
- On push to `main`, the production workflow builds the `frontend` and pushes the `frontend/dist` folder to the Netlify site pointed by `NETLIFY_SITE_ID_PROD`.
- The `pr-validate.yml` workflow runs on pull requests targeting `main`/`homolog` and ensures the code builds, lints and tests before a PR can be merged.

## Recommended Branch Protection / Required Checks

- In GitHub branch protection for `main`, require the `pr-validate` / CI workflow checks (the check name will be `Frontend CI (install, lint, test, build)`), plus the Netlify deploy status if you want to ensure deploy succeeded.
- Require PRs and require status checks to pass before merging.

## Testing locally / manually

To test the build locally (same steps as GitHub Actions):

```bash
# from repo root
cd frontend
npm ci
npm run build
npx jest --passWithNoTests
npm run lint
```

To trigger staging deploy: push or merge to `homolog`.
To trigger prod deploy: push or merge to `main`.

## Rollback

- Netlify keeps deploy history — go to the site → Deploys → rollback to a previous deploy.
- Alternatively, revert the PR and merge a new commit to `main`.

## Notes / caveats

- If your repository has branch protection rules that block the `GITHUB_TOKEN` from performing push operations to the site or to certain branches, you may need to create a Personal Access Token (PAT) and adjust workflows to use that PAT instead. The Netlify action used here only needs an API token (`NETLIFY_AUTH_TOKEN`) which uses the Netlify API, so it does not depend on `GITHUB_TOKEN` to push.
- The CI runs `npm run lint`; if ESLint fails in CI because of environment-specific globals, update the ESLint config or adjust the lint script to target the correct files.

---

If you want, I can also:
- Create the Netlify sites for you (you must authorize Netlify to access your GitHub repo), or
- Walk you step-by-step in the Netlify UI to create the Site and generate the secrets.

Which do you prefer next?