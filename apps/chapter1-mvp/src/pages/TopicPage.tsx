import { useParams } from "react-router-dom";
import { useLanguage } from "../app/LanguageContext";
import { getTopic, getTopicOrder, loadAllTopics } from "../content/adapter";
import {
  EQUATION_ITALIC_TOKENS_BY_TOPIC,
  EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC,
} from "../content/equationRenderer";
import { NotFoundState } from "../components/NotFoundState";
import { ContentSection } from "../features/topics/ContentSection";
import { EquationBlock } from "../features/topics/EquationBlock";
import { VisualViewer } from "../features/topics/VisualViewer";
import { ProblemCard } from "../features/topics/ProblemCard";
import { ReviewQuestion, REVIEW_ANSWER_MARKER_BY_TOPIC } from "../features/topics/ReviewQuestion";
import { InstructorReviewPanel } from "../features/topics/InstructorReviewPanel";
import { InternalStatusPanel } from "../features/topics/InternalStatusPanel";
import { TopicNavigation } from "../features/topics/TopicNavigation";
import { TopicReadingGuide } from "../features/topics/TopicReadingGuide";
import { SlidesSection, Slide } from "../features/topics/Slides";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";
import { DiagnosticsPanel } from "../features/topics/DiagnosticsPanel";
import type { PilotTopicId } from "../types/pilotSchema";

const UNKNOWN_TOPIC_MESSAGE = {
  en: (topicId: string) => `"${topicId}" is not one of the six authorized topics.`,
  ar: (topicId: string) => `"${topicId}" ليس من بين المواضيع الستة المعتمدة.`,
} as const;

const UNTITLED = { en: "(untitled topic)", ar: "(بلا عنوان)" } as const;

export function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { language, direction } = useLanguage();
  const { diagnostics } = loadAllTopics();

  const topic = topicId ? getTopic(topicId) : undefined;

  if (!topic) {
    return (
      <NotFoundState
        message={{
          en: UNKNOWN_TOPIC_MESSAGE.en(topicId ?? ""),
          ar: UNKNOWN_TOPIC_MESSAGE.ar(topicId ?? ""),
        }}
      />
    );
  }

  const order = getTopicOrder();
  const index = order.indexOf(topic.topicId);
  const previousId: PilotTopicId | undefined = index > 0 ? order[index - 1] : undefined;
  const nextId: PilotTopicId | undefined = index < order.length - 1 ? order[index + 1] : undefined;
  const previousTopic = previousId ? getTopic(previousId) : undefined;
  const nextTopic = nextId ? getTopic(nextId) : undefined;

  // Two whitelists: the full one (includes "a" for t08's acceleration
  // variable) is safe only for bare symbolic/equation text; the
  // prose-safe one omits it for natural-language fields, where "a" is
  // often just the English article. See
  // src/content/equationRenderer.tsx's header comment on
  // EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC for the real defect this
  // split fixes.
  const equationTokens = EQUATION_ITALIC_TOKENS_BY_TOPIC[topic.topicId] ?? [];
  const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC[topic.topicId] ?? [];
  const title = topic.title[language] ?? UNTITLED[language];
  const topicDiagnostics = diagnostics.filter((d) => d.topicId === topic.topicId);
  const usesGuidedPresentation = topic.topicId === "ch01-t01";

  // ch01-t01-only interaction wiring (verified, per-topic — see each
  // component's own header comment for why these are opt-in props rather
  // than generic behavior applied to every topic). The review-answer
  // marker itself lives centrally in
  // ReviewQuestion.REVIEW_ANSWER_MARKER_BY_TOPIC, not as a literal here.
  //  - EQUATION_HIGHLIGHT_PHRASE: the literal "v = d / t" substring,
  //    confirmed present verbatim in ch01-t01's actual equationSet text in
  //    both languages (Latin notation stays untranslated per house style).
  const EQUATION_HIGHLIGHT_PHRASE = "v = d / t";

  return (
    <article className="topic-page" dir={direction}>
      <InternalStatusPanel governance={topic.governance} />

      <h1>{title}</h1>

      {usesGuidedPresentation ? <TopicReadingGuide /> : null}

      {topic.openingConcept ? (
        <SlidesSection>
          <Slide
            number={1}
            title={{ en: "Fundamental Physical Quantities", ar: "الكميات الفيزيائية الأساسية" }}
            id={usesGuidedPresentation ? "topic-opening" : undefined}
          >
            <StructuredSlideContent
              topicId={topic.topicId}
              text={topic.openingConcept.text}
              italicTokens={proseTokens}
            />
          </Slide>
        </SlidesSection>
      ) : null}

      {topic.mainIdea ? (
        <ContentSection
          blockType="mainIdea"
          text={topic.mainIdea.text}
          italicTokens={proseTokens}
          sectionId={usesGuidedPresentation ? "topic-main-idea" : undefined}
        />
      ) : null}
      {topic.explanation ? (
        <ContentSection
          blockType="organizedExplanation"
          text={topic.explanation.text}
          italicTokens={proseTokens}
          sectionId={usesGuidedPresentation ? "topic-explanation" : undefined}
          collapsible={usesGuidedPresentation}
          persistKey={usesGuidedPresentation ? "ch01-t01.section.explanation.open" : undefined}
        />
      ) : null}
      {topic.equations ? (
        <EquationBlock
          text={topic.equations.text}
          italicTokens={equationTokens}
          sectionId={usesGuidedPresentation ? "topic-equation" : undefined}
          collapsible={usesGuidedPresentation}
          persistKey={usesGuidedPresentation ? "ch01-t01.section.equation.open" : undefined}
          highlightPhrase={usesGuidedPresentation ? EQUATION_HIGHLIGHT_PHRASE : undefined}
        />
      ) : null}

      <div
        id={usesGuidedPresentation ? "topic-visual" : undefined}
        className={usesGuidedPresentation ? "topic-reading-anchor" : undefined}
      >
        <VisualViewer visual={topic.visual} size={usesGuidedPresentation ? "large" : "default"} />
      </div>

      {topic.workedExample ? (
        <ContentSection blockType="example" text={topic.workedExample.text} italicTokens={proseTokens} />
      ) : null}

      <ProblemCard problem={topic.problem} proseTokens={proseTokens} symbolTokens={equationTokens} />

      {topic.reviewQuestion ? (
        <div
          id={usesGuidedPresentation ? "topic-review" : undefined}
          className={usesGuidedPresentation ? "topic-reading-anchor" : undefined}
        >
          <ReviewQuestion
            section={topic.reviewQuestion}
            italicTokens={proseTokens}
            revealMarker={usesGuidedPresentation ? REVIEW_ANSWER_MARKER_BY_TOPIC[topic.topicId] : undefined}
            persistKey={usesGuidedPresentation ? "ch01-t01.review.revealed" : undefined}
          />
        </div>
      ) : null}

      <InstructorReviewPanel
        notes={topic.instructorNotes}
        learningObjectives={topic.instructorLearningObjectives}
        italicTokens={proseTokens}
      />

      <TopicNavigation previous={previousTopic} next={nextTopic} language={language} />

      <DiagnosticsPanel diagnostics={topicDiagnostics} />
    </article>
  );
}
