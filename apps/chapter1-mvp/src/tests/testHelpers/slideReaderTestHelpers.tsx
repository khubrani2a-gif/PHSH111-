// Shared test helper for exercising the Slide Reader
// (src/features/topics/SlidesExperience.tsx / SlideReader/*). Mirrors
// slidesTestHelpers.tsx's own conventions (act/createRoot, one shared
// render entry point) but additionally wraps in a router, since the
// reader's deep-linking (?slide=N) requires react-router-dom's
// useSearchParams. Not itself a test file.
import { act } from "react";
import type { Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../../app/LanguageContext";
import { SlidesExperience } from "../../features/topics/SlidesExperience";
import type { NormalizedTopic } from "../../types/normalized";

export function renderSlidesExperience(
  root: Root,
  topic: NormalizedTopic,
  options?: { arabic?: boolean; initialEntries?: string[] },
) {
  window.localStorage.setItem("phsh111:language", options?.arabic ? "ar" : "en");
  act(() => {
    root.render(
      <MemoryRouter
        initialEntries={options?.initialEntries ?? ["/chapter/1/topic/ch01-t01"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <LanguageProvider>
          <SlidesExperience topic={topic} />
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
}
