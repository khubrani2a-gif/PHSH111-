# PHSH111 — Public Deployment (GitHub Pages) Authorization Record

**Decision date:** 2026-07-17. **Type:** Authorization and implementation record for hosting mechanism only. No instructional content, baseline, or governance-flag change is authorized or performed by this record.

## 1. Purpose

This document records the project owner's explicit authorization to publicly host the built `apps/chapter1-mvp/` application on GitHub Pages, via a GitHub Actions workflow, and the implementation carried out under that authorization.

This authorization concerns **hosting reachability only**. It does not change, and is not, any of the following already-recorded governance facts:

- Content approval status of any topic, record, or visual (all remain draft/review-required).
- `studentFacingAllowed` / `studentPublicationAuthorized` (remain `false` everywhere).
- Independent human scientific, linguistic, or visual review (remains incomplete).

## 2. Project-owner decision

Given directly in chat on 2026-07-17:

> "I authorize publishing the PHSH111 application publicly through GitHub Pages from `main`."

This is recorded under `PILOT_AUTHORIZATION.json` v1.6.0's `publicDeploymentAuthorization` section.

## 3. Scope

Authorizes:

1. A GitHub Actions workflow that builds `apps/chapter1-mvp/` with Vite and publishes `dist/` via the official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions.
2. Automatic deployment on every push to `main`.
3. Setting `vite.config.ts`'s `base` to `/PHSH111-/` so built asset URLs resolve correctly under `https://khubrani2a-gif.github.io/PHSH111-/`.
4. Switching the repository's GitHub Pages source setting from "Deploy from a branch" to "GitHub Actions".
5. Running the existing test suite and a production build before committing, and verifying the deployed site's JS/CSS/images/routes/topic assets load correctly.

Does **not** authorize:

- Any change to instructional content, baseline files, Arabic candidate files, or visual assets.
- Any change to `studentFacingAllowed`, `studentPublicationAuthorized`, or any other governance flag.
- Removing or hiding the Draft / Review Required banner.
- Expanding topic scope beyond what `applicationBuildAuthorization` and `batch1ApplicationIntegrationAuthorization` already authorize.

## 4. Required governance state at the public URL

Identical to the internally built application:

- Draft / Review Required banner visible on every route, both languages.
- All topics remain in their existing blocked / non-student-facing state.
- No topic, record, or visual's approval status changes as a result of being publicly reachable.

## 5. Implementation summary

- `apps/chapter1-mvp/vite.config.ts`: added `base: "/PHSH111-/"`.
- `apps/chapter1-mvp/src/app/App.tsx`: added `basename={import.meta.env.BASE_URL}` to `BrowserRouter` — required so client-side routes resolve correctly under the `/PHSH111-/` subpath rather than at domain root. No route, page, or behavior was added, removed, or changed; only the router's base path was made subpath-aware.
- `apps/chapter1-mvp/package.json`: `description` field updated to reflect the new public-hosting authorization (still states `studentFacingAllowed`/`studentPublicationAuthorized` remain `false`); no dependency or script change.
- `.github/workflows/deploy.yml`: new workflow — installs dependencies, runs tests, builds `apps/chapter1-mvp/`, copies `dist/index.html` to `dist/404.html` (GitHub Pages SPA-fallback convention, so deep-linked client-side routes don't 404 on direct load/refresh), and deploys `apps/chapter1-mvp/dist/` to GitHub Pages via the official Pages Actions, triggered on push to `main` (and manual `workflow_dispatch`).
- No instructional content, baseline, candidate, visual, or audit file under `docs/content-design/` or `docs/content-audits/` was modified; the only `docs/content-design/` change is the authorized v1.6.0 amendment to `PILOT_AUTHORIZATION.json` itself.
- No other application source file was modified.

## 6. Related records

- `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` (v1.6.0, `publicDeploymentAuthorization`)
- `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md`
