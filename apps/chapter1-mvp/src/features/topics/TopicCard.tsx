import { Link } from "react-router-dom";
import type { NormalizedTopic } from "../../types/normalized";

const POSITION_LABEL = {
  en: (position: number, total: number) => `Topic ${position} of ${total}`,
  ar: (position: number, total: number) => `الموضوع ${position} من ${total}`,
} as const;

const UNTITLED = { en: "(untitled topic)", ar: "(بلا عنوان)" } as const;

interface TopicCardProps {
  topic: NormalizedTopic;
  position: number;
  total: number;
  language: "en" | "ar";
}

/**
 * Topic summary card. Title comes from the topic's canonical
 * topicTitle/topicTitleAr fields via the content adapter — never
 * hardcoded in this component (see
 * docs/content-design/chapter-01/pilot/ch01-t*-content.json and
 * src/content/adapter.ts).
 */
export function TopicCard({ topic, position, total, language }: TopicCardProps) {
  const title = topic.title[language] ?? UNTITLED[language];
  return (
    <Link to={`/chapter/1/topic/${topic.topicId}`} className="topic-card">
      <span className="topic-card__position">{POSITION_LABEL[language](position, total)}</span>
      <span className="topic-card__label">{title}</span>
      <span className="topic-card__id">{topic.topicId}</span>
    </Link>
  );
}
