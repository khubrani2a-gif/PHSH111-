import { Link } from "react-router-dom";
import type { NormalizedTopic } from "../../types/normalized";

const LABELS = {
  en: { previous: "Previous topic", next: "Next topic", nav: "Topic navigation" },
  ar: { previous: "الموضوع السابق", next: "الموضوع التالي", nav: "التنقل بين المواضيع" },
} as const;

interface TopicNavigationProps {
  previous?: NormalizedTopic;
  next?: NormalizedTopic;
  language: "en" | "ar";
}

/**
 * Previous/next controls. The semantic destination (which topic "next"
 * points to) always follows the fixed pilot topic order regardless of
 * language direction — only the visual left/right placement mirrors under
 * RTL, via ordinary CSS layout, never by swapping which topic each link
 * targets.
 */
export function TopicNavigation({ previous, next, language }: TopicNavigationProps) {
  const labels = LABELS[language];
  return (
    <nav className="topic-navigation" aria-label={labels.nav}>
      {previous ? (
        <Link to={`/chapter/1/topic/${previous.topicId}`} className="topic-navigation__prev">
          <span className="topic-navigation__direction">{labels.previous}</span>
          <span className="topic-navigation__title">
            {previous.title[language] ?? previous.topicId}
          </span>
        </Link>
      ) : (
        <span className="topic-navigation__prev topic-navigation__prev--disabled" aria-disabled="true">
          {labels.previous}
        </span>
      )}
      {next ? (
        <Link to={`/chapter/1/topic/${next.topicId}`} className="topic-navigation__next">
          <span className="topic-navigation__direction">{labels.next}</span>
          <span className="topic-navigation__title">{next.title[language] ?? next.topicId}</span>
        </Link>
      ) : (
        <span className="topic-navigation__next topic-navigation__next--disabled" aria-disabled="true">
          {labels.next}
        </span>
      )}
    </nav>
  );
}
