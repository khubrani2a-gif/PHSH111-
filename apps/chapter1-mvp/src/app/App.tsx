import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import { AppShell } from "./AppShell";
import { HomePage } from "../pages/HomePage";
import { ChapterOnePage } from "../pages/ChapterOnePage";
import { TopicPage } from "../pages/TopicPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="chapter/1" element={<ChapterOnePage />} />
            <Route path="chapter/1/topic/:topicId" element={<TopicPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
