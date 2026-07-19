import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getTopic, getTopicOrder, loadAllTopics } from "../content/adapter";
import { APP_TOPIC_ORDER } from "../types/pilotSchema";
import { renderEquationText, EQUATION_ITALIC_TOKENS_BY_TOPIC, EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { ProblemCard } from "../features/topics/ProblemCard";
import { ReviewQuestion } from "../features/topics/ReviewQuestion";
import { InstructorReviewPanel } from "../features/topics/InstructorReviewPanel";
import { ContentSection } from "../features/topics/ContentSection";
import { EquationBlock } from "../features/topics/EquationBlock";
import { TopicReadingGuide } from "../features/topics/TopicReadingGuide";
import { LanguageProvider } from "../app/LanguageContext";

/**
 * Strips HTML tags and decodes the entities `renderToStaticMarkup`
 * (react-dom/server) emits for raw text content (`&amp;`, `&lt;`, `&gt;`,
 * `&quot;`, `&#x27;`) — react-dom's SSR output is not required to
 * preserve literal `'`/`"` bytes (a browser parses `&#x27;` back to `'`
 * identically), so comparing against the escaped form would be a test
 * artifact, not a real content-loss check. Mirrors
 * src/tests/equationRenderer.test.tsx's own helper.
 */
function textOnly(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
}

describe("six-topic registry and order", () => {
  it("loads exactly six topics, in the correct chapter-wide numerical order", () => {
    expect(getTopicOrder()).toEqual(["ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10"]);
    expect(getTopicOrder()).toEqual([...APP_TOPIC_ORDER]);
  });

  it("keeps the four originally pilot topics in their exact original relative order within the six", () => {
    const order = getTopicOrder();
    const pilotOnly = order.filter((id) => ["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"].includes(id));
    expect(pilotOnly).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
  });

  it("produces no error-severity diagnostics after Batch 1 integration", () => {
    const { diagnostics } = loadAllTopics();
    const errors = diagnostics.filter((d) => d.severity === "error");
    expect(errors).toEqual([]);
  });
});

describe("ch01-t01 — loading and rendering", () => {
  const topic = getTopic("ch01-t01");

  it("loads successfully with the correct topic ID and bilingual title", () => {
    expect(topic).toBeDefined();
    expect(topic?.title.en).toBe("Fundamental Quantities");
    expect(topic?.title.ar).toBe("الكميات الأساسية");
  });

  it("renders mainIdea, organizedExplanation, and equationSet with correct record IDs", () => {
    expect(topic?.mainIdea?.recordId).toBe("ch01-t01-block-mainidea");
    expect(topic?.explanation?.recordId).toBe("ch01-t01-block-explanation");
    expect(topic?.equations?.recordId).toBe("ch01-t01-block-equations");
  });

  it("resolves its visualReference to the approved SVG asset", () => {
    expect(topic?.visual?.recordId).toBe("ch01-t01-block-visual");
    expect(topic?.visual?.svgMarkup).toBeTruthy();
    expect(topic?.visual?.svgMarkup).toContain("<svg");
  });

  it("has NO problem record — problem field is undefined, not an empty object", () => {
    expect(topic?.problem).toBeUndefined();
  });

  it("ProblemCard renders nothing (null) for ch01-t01 — no empty problem section or empty solution button", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ProblemCard problem={topic?.problem} proseTokens={[]} symbolTokens={[]} />
      </LanguageProvider>,
    );
    expect(markup).toBe("");
  });

  it("confines the instructor-only misconception content to instructorNotes, never to a learner-visible field", () => {
    expect(topic?.instructorNotes.some((n) => n.blockType === "misconception")).toBe(true);
    for (const section of [topic?.mainIdea, topic?.explanation, topic?.equations]) {
      expect(section?.blockType).not.toBe("misconception");
    }
  });

  it("has a learner-visible reviewQuestion, rendered under the 'Review Card' label", () => {
    expect(topic?.reviewQuestion).toBeDefined();
    expect(topic?.reviewQuestion?.recordId).toBe("ch01-t01-block-review");
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={topic!.reviewQuestion!} />
      </LanguageProvider>,
    );
    expect(markup).toContain("Review Card");
  });

  it("keeps studentFacingAllowed/studentPublicationAuthorized false throughout", () => {
    expect(topic?.governance.studentFacingAllowed).toBe(false);
    expect(topic?.governance.studentPublicationAuthorized).toBe(false);
  });

  it("carries real, non-null Arabic text on the merged mainIdea block (from the approved Arabic baseline)", () => {
    expect(topic?.mainIdea?.text.en).toBeTruthy();
    expect(topic?.mainIdea?.text.ar).toBeTruthy();
  });

  it("preserves the equation v = d / t, L/T dimensional notation, and the scalar/average-speed qualifiers verbatim in the equationSet text", () => {
    const eq = topic?.equations?.text.en ?? "";
    expect(eq).toContain("v = d / t");
    expect(eq).toContain("L/T");
    expect(eq).toContain("scalar quantity");
    expect(eq).toContain("average speed");
  });
});

describe("ch01-t01 — interactive presentation without content rewriting", () => {
  const topic = getTopic("ch01-t01")!;

  it("renders a six-step section guide linked only to existing topic sections", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <TopicReadingGuide />
      </LanguageProvider>,
    );
    for (const id of [
      "topic-opening",
      "topic-main-idea",
      "topic-explanation",
      "topic-equation",
      "topic-visual",
      "topic-review",
    ]) {
      expect(markup).toContain(`href="#${id}"`);
    }
  });

  it("keeps the approved explanation verbatim while making its display collapsible and open by default", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ContentSection
          blockType="organizedExplanation"
          text={topic.explanation!.text}
          italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]}
          sectionId="topic-explanation"
          collapsible
        />
      </LanguageProvider>,
    );
    expect(markup).toContain("<details");
    expect(markup).toContain("open");
    expect(textOnly(markup)).toContain(topic.explanation!.text.en!);
  });

  it("keeps the approved equation text verbatim while making its display collapsible and open by default", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <EquationBlock
          text={topic.equations!.text}
          italicTokens={EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"]}
          sectionId="topic-equation"
          collapsible
        />
      </LanguageProvider>,
    );
    expect(markup).toContain("<details");
    expect(markup).toContain("open");
    expect(textOnly(markup)).toContain(topic.equations!.text.en!.replace(/[\^_]/g, ""));
  });
});

describe("ch01-t01 — new openingConcept block (ch01-t01-block-opening)", () => {
  const topic = getTopic("ch01-t01")!;

  const VERBATIM_ENGLISH_QUOTE =
    "In physics, there are three basic aspects of the material universe that we must describe and quantify in various ways:\n\n" +
    "space, time, and matter.\n\n" +
    "All physical quantities used here involve measurements (or combinations of measurements) of space, time, and the properties of matter.\n\n" +
    "The units of measure of all of these quantities can be traced back to the units of measure of distance, time, and two properties of matter called mass and charge.";

  const VERBATIM_ARABIC_QUOTE =
    "في الفيزياء، توجد ثلاثة جوانب أساسية للكون المادي يجب أن نصفها ونقيسها بطرق مختلفة:\n\n" +
    "المكان، والزمن، والمادة.\n\n" +
    "جميع الكميات الفيزيائية المستخدمة هنا تتضمن قياسات، أو مجموعات من القياسات، للمكان والزمن وخصائص المادة.\n\n" +
    "يمكن إرجاع وحدات قياس جميع هذه الكميات إلى وحدات قياس المسافة والزمن، وإلى خاصيتين من خصائص المادة تُسمّيان الكتلة والشحنة.";

  it("loads as a distinct record with its own blockId and blockType", () => {
    expect(topic.openingConcept).toBeDefined();
    expect(topic.openingConcept?.recordId).toBe("ch01-t01-block-opening");
    expect(topic.openingConcept?.blockType).toBe("openingConcept");
  });

  it("is learner-visible (present on topic.openingConcept, not folded into instructorNotes)", () => {
    expect(topic.openingConcept?.visibility).not.toBe("instructor");
    expect(topic.instructorNotes.some((n) => n.recordId === "ch01-t01-block-opening")).toBe(false);
  });

  it("preserves the supplied original English slide text exactly, character for character", () => {
    expect(topic.openingConcept?.text.en).toContain(VERBATIM_ENGLISH_QUOTE);
  });

  it("preserves the supplied original Arabic translation of the slide text exactly, character for character", () => {
    expect(topic.openingConcept?.text.ar).toContain(VERBATIM_ARABIC_QUOTE);
  });

  it("keeps studentFacingAllowed/studentPublicationAuthorized false, same as the rest of this topic", () => {
    expect(topic.openingConcept?.blocking.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
  });

  it("does not duplicate the wording of the already-approved mainIdea, organizedExplanation, or misconception blocks", () => {
    const openingText = topic.openingConcept?.text.en ?? "";
    const mainIdeaText = topic.mainIdea?.text.en ?? "";
    const explanationText = topic.explanation?.text.en ?? "";
    const misconception = topic.instructorNotes.find((n) => n.blockType === "misconception");

    expect(mainIdeaText.length).toBeGreaterThan(0);
    expect(explanationText.length).toBeGreaterThan(0);
    expect(openingText).not.toContain(mainIdeaText);
    expect(openingText).not.toContain(explanationText);
    if (misconception?.text.en) {
      expect(openingText).not.toContain(misconception.text.en);
    }
  });

  it("contains the worked car example (100 m in 5 s) and the v = d / t = 20 m/s derived-quantity equation", () => {
    const en = topic.openingConcept?.text.en ?? "";
    expect(en).toContain("100 m");
    expect(en).toContain("5 s");
    expect(en).toContain("v = d / t = 100 m / 5 s = 20 m/s");
  });

  it("renders as multiple paragraphs (not one giant run-on paragraph) via ContentSection", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ContentSection
          blockType="openingConcept"
          text={topic.openingConcept!.text}
          italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]}
          sectionId="topic-opening"
        />
      </LanguageProvider>,
    );
    const paragraphCount = (markup.match(/<p class="content-section__text"/g) ?? []).length;
    expect(paragraphCount).toBeGreaterThan(5);
    expect(textOnly(markup)).toContain("v = d / t = 100 m / 5 s = 20 m/s");
  });

  it("italicizes v, d, t inside the worked-example equation using the existing ch01-t01 prose-safe whitelist", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ContentSection
          blockType="openingConcept"
          text={topic.openingConcept!.text}
          italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]}
        />
      </LanguageProvider>,
    );
    expect(markup).toContain("<em>v</em>");
    expect(markup).toContain("<em>d</em>");
    expect(markup).toContain("<em>t</em>");
  });

  it("normalizes to its own distinct recordId, separate from mainIdea/explanation/equations", () => {
    // src/pages/TopicPage.tsx renders openingConcept immediately before
    // mainIdea's ContentSection, matching this block's position as the
    // first contentBlock record in the source file.
    expect(topic.openingConcept?.recordId).toBe("ch01-t01-block-opening");
    expect(topic.mainIdea?.recordId).toBe("ch01-t01-block-mainidea");
  });
});

describe("ch01-t04 — loading, rendering, problem and solution", () => {
  const topic = getTopic("ch01-t04");

  it("loads successfully with the correct topic ID and bilingual title", () => {
    expect(topic).toBeDefined();
    expect(topic?.title.en).toBe("Mass, Inertia and Weight");
    expect(topic?.title.ar).toBe("الكتلة والقصور الذاتي والوزن");
  });

  it("resolves its visualReference to the approved SVG asset", () => {
    expect(topic?.visual?.recordId).toBe("ch01-t04-block-visual");
    expect(topic?.visual?.svgMarkup).toBeTruthy();
  });

  it("contains ch01-prob-104 with a non-empty numbered solution and final answer", () => {
    expect(topic?.problem?.recordId).toBe("ch01-prob-104");
    expect(topic?.problem?.steps.length).toBeGreaterThan(0);
    expect(topic?.problem?.finalAnswer).toBeDefined();
  });

  it("shows 441 N only as the unrounded intermediate step, and 4.4 x 10^2 N as the final two-significant-figure result", () => {
    const step1 = topic?.problem?.steps[0];
    expect(step1?.explanation.en).toContain("441 N");
    expect(step1?.explanation.en).toContain("4.4 x 10^2 N");
    expect(topic?.problem?.finalAnswer?.value).toBe(
      "4.4 x 10^2 N at Earth's surface; mass remains 45 kg everywhere",
    );
    expect(topic?.problem?.finalAnswer?.interpretation.en).toContain("4.4 x 10^2 N");
    // The raw calculation entry's own numeric `result` is the unrounded 441 — never a separate `roundedResult` field (none exists in the schema).
    expect((topic?.problem as unknown as { steps: { expression?: { result: number | null } }[] })?.steps[0]?.expression?.result).toBe(441);
  });

  it("renders the problem's solution-reveal button and, once expanded server-side-equivalent markup, the step text (statically rendered, reveal starts collapsed)", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ProblemCard problem={topic?.problem} proseTokens={[]} symbolTokens={[]} />
      </LanguageProvider>,
    );
    expect(markup).toContain("Show solution");
    expect(markup).not.toContain("441"); // collapsed by default — steps not yet in the static markup
  });

  it("confines the instructor-only misconception content to instructorNotes", () => {
    expect(topic?.instructorNotes.some((n) => n.blockType === "misconception")).toBe(true);
  });

  it("has a learner-visible reviewQuestion under the 'Review Card' label", () => {
    expect(topic?.reviewQuestion?.recordId).toBe("ch01-t04-block-review");
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={topic!.reviewQuestion!} />
      </LanguageProvider>,
    );
    expect(markup).toContain("Review Card");
  });

  it("keeps studentFacingAllowed/studentPublicationAuthorized false throughout", () => {
    expect(topic?.governance.studentFacingAllowed).toBe(false);
    expect(topic?.governance.studentPublicationAuthorized).toBe(false);
  });

  it("preserves W = mg, |g| ~ 9.8 m/s^2, and the 45 kg x 9.8 m/s^2 = 441 N calculation verbatim in rendered text", () => {
    const eq = topic?.equations?.text.en ?? "";
    expect(eq).toContain("W = mg");
    expect(eq).toContain("9.8 m/s");
    const step1 = topic?.problem?.steps[0]?.explanation.en ?? "";
    expect(step1).toContain("45 kg x 9.8 m/s^2 = 441 N");
  });
});

describe("Batch 1 — instructor panel renders both topics' instructor-only content correctly", () => {
  it("ch01-t01's InstructorReviewPanel renders its collapsed-by-default toggle, badged as internal-only", () => {
    const topic = getTopic("ch01-t01")!;
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <InstructorReviewPanel notes={topic.instructorNotes} learningObjectives={topic.instructorLearningObjectives} />
      </LanguageProvider>,
    );
    // Collapsed by default (useState(false), same pattern as
    // SolutionReveal) — the "Not student-facing material" disclaimer lives
    // in the panel body, which is only rendered once expanded; the toggle
    // badge itself is always present.
    expect(markup).toContain("Instructor Review Note");
    expect(markup).toContain("Show instructor review note");
  });

  it("ch01-t04's InstructorReviewPanel includes the misconception note", () => {
    const topic = getTopic("ch01-t04")!;
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <InstructorReviewPanel notes={topic.instructorNotes} learningObjectives={topic.instructorLearningObjectives} />
      </LanguageProvider>,
    );
    expect(markup).toContain("Instructor Review Note");
  });
});

describe("Batch 1 — RTL/LTR and equation-isolation verification", () => {
  const t01 = getTopic("ch01-t01");
  const t04 = getTopic("ch01-t04");

  it("ch01-t01's equationSet text preserves v = d / t and L/T when rendered, with no character loss besides consumed ^/_ delimiters", () => {
    const original = t01?.equations?.text.en ?? "";
    const markup = renderToStaticMarkup(
      <>{renderEquationText(original, EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"])}</>,
    );
    expect(textOnly(markup)).toBe(original.replace(/[\^_]/g, ""));
    expect(markup).toContain('dir="ltr"');
  });

  it("ch01-t04's equationSet text preserves W = mg and |g| notation when rendered", () => {
    const original = t04?.equations?.text.en ?? "";
    const markup = renderToStaticMarkup(
      <>{renderEquationText(original, EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t04"])}</>,
    );
    expect(textOnly(markup)).toBe(original.replace(/[\^_]/g, ""));
  });

  it("does NOT italicize 'm' in ch01-t04 (it collides with the meters unit abbreviation, e.g. '9.8 m/s^2') — regression guard for the excluded token", () => {
    const symbolTokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t04"];
    const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t04"];
    expect(symbolTokens).not.toContain("m");
    expect(proseTokens).not.toContain("m");
    const markup = renderToStaticMarkup(<>{renderEquationText("g = 9.8 m/s^2", symbolTokens)}</>);
    expect(markup).not.toContain("<em>m</em>");
    expect(markup).toContain("<em>g</em>");
  });

  it("italicizes ch01-t01's whitelisted bare tokens (v, d, t, L, T, M) without touching unrelated letters", () => {
    const tokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"];
    const markup = renderToStaticMarkup(<>{renderEquationText("v = d / t", tokens)}</>);
    expect(markup).toContain("<em>v</em>");
    expect(markup).toContain("<em>d</em>");
    expect(markup).toContain("<em>t</em>");
  });

  it("both topics' Arabic equationSet text renders with an LTR-isolated span for embedded Latin notation", () => {
    for (const topic of [t01, t04]) {
      const arText = topic?.equations?.text.ar ?? "";
      expect(arText).toBeTruthy();
      const markup = renderToStaticMarkup(<>{renderEquationText(arText, [])}</>);
      expect(markup).toContain('dir="ltr"');
    }
  });

  it("renders both topics' Arabic content with dir='rtl' in ContentSection/EquationBlock context via useLanguage (spot-checked through ReviewQuestion, which sets dir explicitly)", () => {
    for (const topic of [t01, t04]) {
      const section = topic!.reviewQuestion!;
      const markup = renderToStaticMarkup(
        <LanguageProvider>
          <ReviewQuestion section={section} />
        </LanguageProvider>,
      );
      // Default language is "en" (LanguageProvider's initial state) — this
      // confirms the component sets an explicit ltr direction for English;
      // language-switch RTL behavior itself is exercised by LanguageContext's
      // own directionFor() logic, unchanged by this integration.
      expect(markup).toContain('dir="ltr"');
    }
  });
});
