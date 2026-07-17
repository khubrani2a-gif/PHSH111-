import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Internal-only Chapter 1 pilot MVP. No production/public deployment target
// is configured here — see docs/content-design/chapter-01/PILOT_AUTHORIZATION.json.
//
// server.fs.allow is extended, narrowly, to the one canonical content
// directory this app reads from (docs/content-design/chapter-01/) so the
// dev server can serve the four pilot JSON files and four SVGs via normal
// ES module imports (see src/content/rawImports.ts) without widening
// access to the rest of the repository. Production builds do not use this
// setting — Rollup reads source files directly from disk at build time.
const CANONICAL_CONTENT_DIR = resolve(__dirname, "../../docs/content-design/chapter-01");

// GitHub Pages serves this repository at /PHSH111-/ (repo name), so built
// asset URLs must be rooted there rather than at "/". See
// docs/content-design/chapter-01/PILOT_AUTHORIZATION.json v1.6.0
// publicDeploymentAuthorization for the deployment authorization this base
// path serves.
export default defineConfig({
  base: "/PHSH111-/",
  plugins: [react()],
  server: {
    fs: {
      allow: ["./", CANONICAL_CONTENT_DIR],
    },
  },
});
