import { useLanguage } from "../app/LanguageContext";
import { loadAllTopics } from "../content/adapter";
import { TopicCard } from "../features/topics/TopicCard";
import { DiagnosticsPanel } from "../features/topics/DiagnosticsPanel";

const TEXT = {
  en: {
    title: "Chapter 1 — Pilot Topics",
    intro:
      "Six topics are available for internal review, in the approved chapter order.",
  },
  ar: {
    title: "الفصل الأول — المواضيع التجريبية",
    intro:
      "تتوفر ستة مواضيع للمراجعة الداخلية، وفق ترتيب الفصل المعتمد.",
  },
} as const;

export function ChapterOnePage() {
  const { language } = useLanguage();
  const text = TEXT[language];
  const { topics, diagnostics } = loadAllTopics();

  return (
    <section className="chapter-page">
      <h1>{text.title}</h1>
      <p>{text.intro}</p>
      <div className="chapter-page__grid" role="list">
        {topics.map((topic, index) => (
          <div role="listitem" key={topic.topicId}>
            <TopicCard topic={topic} position={index + 1} total={topics.length} language={language} />
          </div>
        ))}
      </div>
      <DiagnosticsPanel diagnostics={diagnostics} />
    </section>
  );
}
