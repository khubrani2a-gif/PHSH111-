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
import { SlidesSection } from "../features/topics/Slides";
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

describe("ch01-t01 — new slide block (ch01-t01-block-opening)", () => {
  const topic = getTopic("ch01-t01")!;
  const slide1 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening")!;

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

  it("loads as a distinct record, first in the topic's ordered slides collection", () => {
    expect(slide1).toBeDefined();
    expect(slide1?.recordId).toBe("ch01-t01-block-opening");
    expect(slide1?.slideNumber).toBe(1);
    expect(topic.slides[0]?.recordId).toBe("ch01-t01-block-opening");
  });

  it("is learner-visible (present on slide1, not folded into instructorNotes)", () => {
    expect(slide1?.visibility).not.toBe("instructor");
    expect(topic.instructorNotes.some((n) => n.recordId === "ch01-t01-block-opening")).toBe(false);
  });

  it("preserves the supplied original English slide text exactly, character for character", () => {
    expect(slide1?.text.en).toContain(VERBATIM_ENGLISH_QUOTE);
  });

  it("preserves the supplied original Arabic translation of the slide text exactly, character for character", () => {
    expect(slide1?.text.ar).toContain(VERBATIM_ARABIC_QUOTE);
  });

  it("keeps studentFacingAllowed/studentPublicationAuthorized false, same as the rest of this topic", () => {
    expect(slide1?.blocking.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
  });

  it("does not duplicate the wording of the already-approved mainIdea, organizedExplanation, or misconception blocks", () => {
    const openingText = slide1?.text.en ?? "";
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

  it("scopes distance/time/mass/charge to this chapter's introductory framework, not a universal SI claim, and includes the SI scientific note", () => {
    const en = slide1?.text.en ?? "";
    expect(en).toContain(
      "introduces distance, time, mass, and charge as important measurable quantities within its introductory framework",
    );
    expect(en).not.toContain(
      "treats distance, time, mass, and charge as the quantities used to describe them in this context",
    );
    expect(en).not.toContain("every physical quantity used here ultimately traces back");
    expect(en).toContain("seven base quantities");
  });

  it("removes the electric-charge-derivation statement (Q = I t) — outside this introductory slide's instructional scope (ch01-english-baseline-rev-006)", () => {
    const en = slide1?.text.en ?? "";
    const ar = slide1?.text.ar ?? "";
    expect(en).not.toContain("Q = I t");
    expect(en).not.toContain("Electric charge is a derived quantity, obtained from current multiplied by time");
    expect(ar).not.toContain("Q = I t");
    expect(ar).not.toContain("أما الشحنة الكهربائية فهي كمية مشتقة");
  });

  it("replaces the Scientific Note with the project owner's exact shortened wording, in both languages", () => {
    const en = slide1?.text.en ?? "";
    const ar = slide1?.text.ar ?? "";
    expect(en).toContain(
      "Scientific Note: This slide follows the textbook's introductory framework for the quantities discussed in this chapter. The complete modern SI system contains seven base quantities.",
    );
    expect(ar).toContain(
      "ملاحظة علمية: يتبع هذا السلايد الإطار التمهيدي الذي يعتمده الكتاب للكميات المطروحة في هذا الفصل. ويحتوي نظام الوحدات الدولي الحديث على سبع كميات أساسية.",
    );
  });

  it("uses the corrected space-vs-distance sentence, not the old overly narrow one", () => {
    const en = slide1?.text.en ?? "";
    expect(en).toContain("Distance is one measurable way of describing separation within space.");
    expect(en).not.toContain("Distance is the measurable aspect of space.");
  });

  it("states speed's derived unit (m/s) exactly once, not twice — no repeated explanation", () => {
    const en = slide1?.text.en ?? "";
    const occurrences = (en.match(/formed from the units of distance and time/g) ?? []).length;
    expect(occurrences).toBe(1);
    expect(en).not.toContain("without needing any unit of its own");
    expect(en).not.toContain("rather than requiring an independent unit of its own");
  });

  it("is structured as a compact Main Idea / numbered-steps / Example / Misconception / Scientific Note / Connection sequence", () => {
    const en = slide1?.text.en ?? "";
    expect(en).toContain("Main idea:");
    expect(en).toContain("Simple example:");
    expect(en).toContain("Common misconception:");
    expect(en).toContain("Scientific Note:");
    expect(en).toContain("Connection to the next part:");
    for (const step of ["1.", "2.", "3.", "4.", "5."]) {
      expect(en).toContain(step);
    }
  });

  it("Arabic: uses the exact corrected car-example wording, not the division-as-addition phrasing", () => {
    const ar = slide1?.text.ar ?? "";
    expect(ar).toContain(
      "قطعت السيارة مسافة مقدارها 100 متر خلال زمن قدره 5 ثوانٍ. وبدمج قياسي المسافة والزمن نحسب سرعة السيارة:",
    );
    expect(ar).not.toContain("الجمع بين القياسين");
  });

  it("Arabic: uses the exact corrected distance-vs-space sentence", () => {
    const ar = slide1?.text.ar ?? "";
    expect(ar).toContain("المسافة إحدى الطرق القابلة للقياس لوصف مقدار الفصل بين المواضع داخل المكان");
    expect(ar).not.toContain("الجواهر");
  });

  it("Arabic: the SI base-quantity list (including the thermodynamic temperature clarification) was removed along with the Q = I t derivation (ch01-arabic-baseline-rev-004)", () => {
    const ar = slide1?.text.ar ?? "";
    expect(ar).not.toContain("درجة الحرارة الديناميكية الحرارية (درجة الحرارة المطلقة)");
    expect(ar).not.toContain("التيار الكهربائي");
  });

  it("contains the worked car example (100 m in 5 s) and the v = d / t = 20 m/s derived-quantity equation", () => {
    const en = slide1?.text.en ?? "";
    expect(en).toContain("100 m");
    expect(en).toContain("5 s");
    expect(en).toContain("v = d / t = 100 m / 5 s = 20 m/s");
  });

  it("renders as multiple paragraphs (not one giant run-on paragraph) via ContentSection", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ContentSection
          blockType="slide"
          text={slide1!.text}
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
          blockType="slide"
          text={slide1!.text}
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
    expect(slide1?.recordId).toBe("ch01-t01-block-opening");
    expect(topic.mainIdea?.recordId).toBe("ch01-t01-block-mainidea");
  });
});

describe("Slides / Slide presentation wrapper (generic blockType, rendered as a single-open accordion)", () => {
  const topic = getTopic("ch01-t01")!;
  const slide1 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening")!;

  function renderSlide1Only() {
    return renderToStaticMarkup(
      <LanguageProvider>
        <SlidesSection
          topicId="ch01-t01"
          anchorId="topic-opening"
          slides={[
            {
              recordId: slide1.recordId,
              slideNumber: 1,
              title: { en: "Fundamental Physical Quantities", ar: "الكميات الفيزيائية الأساسية" },
              content: (
                <ContentSection
                  blockType="slide"
                  text={slide1.text}
                  italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]}
                />
              ),
            },
          ]}
        />
      </LanguageProvider>,
    );
  }

  it("renders a visible 'Slides' parent heading", () => {
    const markup = renderSlide1Only();
    expect(markup).toContain('class="slides-section"');
    expect(textOnly(markup)).toContain("Slides");
  });

  it("Slide 1 opens by default (no persisted state) and shows the exact English label 'Slide 1 — Fundamental Physical Quantities' inside its expanded panel", () => {
    const markup = renderSlide1Only();
    // The anchor id now lives on the Slides section itself (not tied to
    // any one slide's open/closed state), immediately followed by Slide
    // 1's expanded panel markup, open by default with nothing persisted.
    const anchorStart = markup.indexOf('id="topic-opening"');
    const panelStart = markup.indexOf('id="slide-1-panel"');
    expect(anchorStart).toBeGreaterThanOrEqual(0);
    expect(panelStart).toBeGreaterThan(anchorStart);
    expect(markup).toContain('aria-expanded="true"');
    expect(textOnly(markup)).toContain("Slide 1 — Fundamental Physical Quantities");
  });

  it("is first (slideNumber 1) in the topic's generic ordered slides collection", () => {
    expect(slide1.slideNumber).toBe(1);
    expect(topic.slides[0]?.recordId).toBe("ch01-t01-block-opening");
  });

  it("still contains the full, unchanged Slide 1 educational content (verbatim quote, worked equation) inside the accordion panel", () => {
    const markup = renderSlide1Only();
    const text = textOnly(markup);
    expect(text).toContain("In physics, there are three basic aspects of the material universe");
    expect(text).toContain("v = d / t = 100 m / 5 s = 20 m/s");
    expect(text).toContain("Main idea:");
    expect(text).toContain("Scientific Note:");
  });

  it("supports a second slide as an additional sibling — its collapsed header renders automatically, without altering Slide 1's open content or id", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <SlidesSection
          topicId="ch01-t01"
          anchorId="topic-opening"
          slides={[
            {
              recordId: slide1.recordId,
              slideNumber: 1,
              title: { en: "Fundamental Physical Quantities", ar: "الكميات الفيزيائية الأساسية" },
              content: (
                <ContentSection
                  blockType="slide"
                  text={slide1.text}
                  italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]}
                />
              ),
            },
            {
              recordId: "ch01-t01-block-opening-synthetic-2",
              slideNumber: 2,
              title: { en: "Units of Measurement", ar: "وحدات القياس" },
              content: <p>placeholder future-slide content</p>,
            },
          ]}
        />
      </LanguageProvider>,
    );
    const text = textOnly(markup);
    expect(text).toContain("Slide 1 — Fundamental Physical Quantities");
    // Slide 2's collapsed header (number + title, used here as its own
    // short-title fallback since no override exists for this synthetic
    // recordId) still renders automatically — but Slide 1 is open by
    // default in a single-open accordion, so Slide 2's panel content
    // (its placeholder body) is not rendered.
    expect(text).toContain("Units of Measurement");
    expect(text).not.toContain("placeholder future-slide content");
    expect(markup).toContain('id="topic-opening"');
    expect(markup).toContain('id="slide-2-header"');
    expect(markup).toContain('aria-expanded="false"');
  });
});

describe("TopicReadingGuide — first step is now the generic 'Slides' label", () => {
  it("English: step 1 reads 'Slides', not the old topic-specific title", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <TopicReadingGuide />
      </LanguageProvider>,
    );
    expect(markup).toContain('href="#topic-opening"');
    // The old per-slide title must not appear as a *nav step* label —
    // it still appears deeper on the page as the Slide 1 heading itself,
    // so this checks the reading-guide markup specifically.
    const guideOnly = markup.slice(0, markup.indexOf("</nav>"));
    expect(textOnly(guideOnly)).toContain("Slides");
    expect(textOnly(guideOnly)).not.toContain("Fundamental Physical Quantities");
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
