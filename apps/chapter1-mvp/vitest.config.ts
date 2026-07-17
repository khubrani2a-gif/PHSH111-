import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Default environment is Node (no DOM) — most of this suite is
// adapter/data-layer or static-markup assertions with no DOM interaction.
// One file (src/tests/visualViewerDialog.test.tsx, Phase 3) opts into
// jsdom via a per-file `// @vitest-environment jsdom` pragma, since
// dialog-focus/scroll-lock assertions need a real `document.activeElement`
// and element lifecycle — see that file's header comment for what jsdom
// can and cannot verify for a native <dialog>. No component-testing
// library (React Testing Library, etc.) was added; React's own
// createRoot/act are sufficient for the one file that needs a live DOM.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
