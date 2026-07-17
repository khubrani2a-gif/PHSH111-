# PHSH111 — Chapter 1 Internal Pilot

Internal review build only. **Not authorized for student-facing or public deployment.** See `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` and `docs/app/MVP_IMPLEMENTATION_DECISIONS.json` for the governing authorization; see `docs/app/PHSH111_APP_HANDOFF.md` for full development history.

## Current scope

Six topics, in this order: `ch01-t01`, `ch01-t02`, `ch01-t03`, `ch01-t04`, `ch01-t08`, `ch01-t10` (the four originally build-authorized pilot topics plus Batch 1's `ch01-t01`/`ch01-t04`, integrated under `PILOT_AUTHORIZATION.json` v1.5.0's `batch1ApplicationIntegrationAuthorization`). All six remain `draft`/`blocked`, `studentFacingAllowed: false`, `studentPublicationAuthorized: false`.

Content and visuals are read directly from the canonical source files under `docs/content-design/chapter-01/` at build/dev time (`src/content/rawImports.ts`) — never duplicated into application source. Batch 1's English and Arabic baselines are stored in two separate approved files per topic and merged in memory at load time (`src/content/batch1Merge.ts`); the four original pilot topics each have a single already-merged file.

## Commands

```
npm run dev         # local dev server
npm run typecheck    # tsc -b --noEmit
npm test             # vitest run
npm run build        # tsc -b && vite build
```

Requires Node.js 20 / npm 10 (a matching version was verified working at v20.20.2/10.8.2). Do not run `npm install`/`npm update`/`npm audit fix` without a deliberate, coordinated decision — see `docs/app/PHSH111_APP_HANDOFF.md` for the current dependency-audit status.

## Governance

- Independent human visual/scientific review: **not complete**.
- Student-facing use / publication: **not authorized**.
- Public deployment: **not performed, not authorized**.

See `docs/content-design/chapter-01/PILOT_READINESS.json` for the authoritative, versioned readiness state, and `docs/app/PHSH111_BATCH1_APPLICATION_VERIFICATION_AND_QA_REPORT.md` for the most recent verification results.
