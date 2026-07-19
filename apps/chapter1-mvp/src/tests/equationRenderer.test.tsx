import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  EQUATION_ITALIC_TOKENS_BY_TOPIC,
  EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC,
  renderEquationText,
  renderEquationTextWithHighlight,
} from "../content/equationRenderer";
import { getTopic } from "../content/adapter";

/**
 * Strips HTML tags and decodes the small set of named/numeric entities
 * `renderToStaticMarkup` (react-dom/server) emits for raw text content
 * (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#x27;`), leaving the same characters
 * the original source string had — react-dom's SSR output is not required
 * to preserve literal `'`/`"` bytes (any browser parses `&#x27;` back to
 * `'` identically), so comparing against the escaped form would be a test
 * artifact, not a real content-loss check.
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

describe("renderEquationText — real equation strings from all six topics", () => {
  const cases: {
    topicId: "ch01-t01" | "ch01-t02" | "ch01-t03" | "ch01-t04" | "ch01-t08" | "ch01-t10";
  }[] = [
    { topicId: "ch01-t01" },
    { topicId: "ch01-t02" },
    { topicId: "ch01-t03" },
    { topicId: "ch01-t04" },
    { topicId: "ch01-t08" },
    { topicId: "ch01-t10" },
  ];

  for (const { topicId } of cases) {
    it(`preserves every character of ${topicId}'s equationSet text (EN) when rendered`, () => {
      const topic = getTopic(topicId);
      const original = topic?.equations?.text.en;
      expect(original).toBeTruthy();
      const markup = renderToStaticMarkup(
        <>{renderEquationText(original!, EQUATION_ITALIC_TOKENS_BY_TOPIC[topicId])}</>,
      );
      // The ^ and _ delimiter characters are legitimately consumed into
      // real <sup>/<sub> markup (exactly like markdown's ** disappearing
      // into <strong> once rendered) — every OTHER character must survive
      // untouched, which is what this asserts.
      expect(textOnly(markup)).toBe(original!.replace(/[\^_]/g, ""));
    });

    it(`preserves every character of ${topicId}'s equationSet text (AR) when rendered`, () => {
      const topic = getTopic(topicId);
      const original = topic?.equations?.text.ar;
      expect(original).toBeTruthy();
      const markup = renderToStaticMarkup(
        <>{renderEquationText(original!, EQUATION_ITALIC_TOKENS_BY_TOPIC[topicId])}</>,
      );
      // The ^ and _ delimiter characters are legitimately consumed into
      // real <sup>/<sub> markup (exactly like markdown's ** disappearing
      // into <strong> once rendered) — every OTHER character must survive
      // untouched, which is what this asserts.
      expect(textOnly(markup)).toBe(original!.replace(/[\^_]/g, ""));
    });
  }

  it("converts an explicit ^ suffix into a true <sup> element", () => {
    const markup = renderToStaticMarkup(<>{renderEquationText("s^-1", [])}</>);
    expect(markup).toContain("<sup>-1</sup>");
  });

  it("converts an explicit _ suffix into a true <sub> element", () => {
    const markup = renderToStaticMarkup(<>{renderEquationText("a_c", [])}</>);
    expect(markup).toContain("<sub>c</sub>");
  });

  it("handles a compound nested-underscore subscript (a_c_max, from ch01-t10's problem givenValues) as one subscript group", () => {
    const markup = renderToStaticMarkup(<>{renderEquationText("a_c_max = 500 m/s^2", [])}</>);
    expect(markup).toContain("<sub>c_max</sub>");
    expect(markup).toContain("<sup>2</sup>");
  });

  it("italicizes only whitelisted bare tokens, not arbitrary letters (t02: does not italicize the English article 'a', not in t02's whitelist)", () => {
    const markup = renderToStaticMarkup(
      <>{renderEquationText("Area of a rectangle", EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t02"])}</>,
    );
    // "A" of "Area" must not be italicized as a standalone match (word-boundary protects this);
    // the standalone article "a" must not be italicized either, since it is not in t02's whitelist.
    expect(markup).not.toContain("<em>a</em>");
  });

  it("does not italicize the bare multiplication 'x' in t02's 'length x width' (only x_subscript forms are italicized)", () => {
    const original = "length x width";
    const markup = renderToStaticMarkup(
      <>{renderEquationText(original, EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t02"])}</>,
    );
    expect(markup).not.toContain("<em>x</em>");
    expect(textOnly(markup)).toBe(original);
  });

  it("leaves an undelimited fused token like 'v0' unstyled and unsplit (no invented subscript)", () => {
    const original = "v0 = 0";
    const markup = renderToStaticMarkup(
      <>{renderEquationText(original, EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t08"])}</>,
    );
    expect(markup).not.toContain("<sub>");
    expect(textOnly(markup)).toBe(original);
  });

  it("converts a bare numeric exponent with no letter base (e.g. '(7600)^2', '10^6' from the worked-example solution text) to a true superscript, leaving the preceding numeral/paren untouched", () => {
    const markup = renderToStaticMarkup(<>{renderEquationText("(7600)^2 / (6.9 x 10^6)", [])}</>);
    expect(markup).toContain("(7600)<sup>2</sup>");
    expect(markup).toContain("10<sup>6</sup>");
  });

  it("regression: t08's prose-safe whitelist must never italicize the bare English article 'a' (found during Phase 2 browser verification: 'under a downward-positive convention', 'from a rooftop', 'down a corridor' were all being incorrectly italicized before this fix)", () => {
    const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t08"];
    expect(proseTokens).not.toContain("a");
    const markup = renderToStaticMarkup(
      <>
        {renderEquationText(
          "the signed acceleration is a = -g under an upward-positive convention or a = +g under a downward-positive convention",
          proseTokens,
        )}
      </>,
    );
    expect(markup).not.toContain("<em>a</em>");
  });

  it("the full (non-prose-safe) t08 whitelist still italicizes bare 'a' for genuinely symbolic text (equationSet block, given values, calculation expressions)", () => {
    const symbolTokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t08"];
    expect(symbolTokens).toContain("a");
    const markup = renderToStaticMarkup(<>{renderEquationText("a = -g", symbolTokens)}</>);
    expect(markup).toContain("<em>a</em>");
  });

  it("wraps embedded Latin equation fragments inside Arabic prose in their own dir=ltr span", () => {
    const markup = renderToStaticMarkup(
      <>{renderEquationText("f = 1/T (التردد يساوي مقلوب الدور)", [])}</>,
    );
    expect(markup).toContain('dir="ltr"');
    expect(markup).toContain("f = 1/T");
  });

  it("regression: ch01-t04's whitelist must never italicize 'm' — it collides with the meters unit abbreviation in this topic's own text ('9.8 m/s^2' appears in the equationSet block, problem statement, both solution steps, and the g given-value)", () => {
    const tokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t04"];
    expect(tokens).not.toContain("m");
    const markup = renderToStaticMarkup(
      <>{renderEquationText("m is its mass, and g = 9.8 m/s^2", tokens)}</>,
    );
    expect(markup).not.toContain("<em>m</em>");
    expect(markup).toContain("<em>g</em>");
  });

  it("ch01-t01's whitelist italicizes the dimensional/measured-variable symbols v, d, t, L, T, M in the real equationSet text", () => {
    const topic = getTopic("ch01-t01");
    const original = topic?.equations?.text.en ?? "";
    const tokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"];
    const markup = renderToStaticMarkup(<>{renderEquationText(original, tokens)}</>);
    expect(markup).toContain("<em>v</em>");
    expect(markup).toContain("<em>L</em>");
    expect(markup).toContain("<em>T</em>");
  });

  it("ch01-t04's whitelist italicizes g and W in the real equationSet text", () => {
    const topic = getTopic("ch01-t04");
    const original = topic?.equations?.text.en ?? "";
    const tokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t04"];
    const markup = renderToStaticMarkup(<>{renderEquationText(original, tokens)}</>);
    expect(markup).toContain("<em>g</em>");
    expect(markup).toContain("<em>W</em>");
  });
});

describe("renderEquationTextWithHighlight — ch01-t01's highlighted v = d / t relationship", () => {
  const tokens = EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"];

  it("wraps the exact matched phrase in a <mark class=\"equation-highlight\"> without dropping or reordering any other character", () => {
    const topic = getTopic("ch01-t01");
    const original = topic?.equations?.text.en ?? "";
    expect(original).toContain("v = d / t");

    const highlighted = renderToStaticMarkup(
      <>{renderEquationTextWithHighlight(original, tokens, "v = d / t")}</>,
    );
    const plain = renderToStaticMarkup(<>{renderEquationText(original, tokens)}</>);

    expect(highlighted).toContain('<mark class="equation-highlight">');
    // Same text content either way — the highlight is markup-only.
    expect(textOnly(highlighted)).toBe(textOnly(plain));
  });

  it("still italicizes v, d, t inside the highlighted phrase itself", () => {
    const markup = renderToStaticMarkup(
      <>{renderEquationTextWithHighlight("v = d / t", tokens, "v = d / t")}</>,
    );
    expect(markup).toContain("<em>v</em>");
    expect(markup).toContain("<em>d</em>");
    expect(markup).toContain("<em>t</em>");
  });

  it("falls back to plain renderEquationText (no <mark>, no crash) when the phrase does not occur in the text", () => {
    const markup = renderToStaticMarkup(
      <>{renderEquationTextWithHighlight("no notation here", [], "v = d / t")}</>,
    );
    expect(markup).not.toContain("<mark");
    expect(textOnly(markup)).toBe("no notation here");
  });

  it("also finds and highlights the same Latin phrase embedded in the Arabic equationSet text", () => {
    const topic = getTopic("ch01-t01");
    const originalAr = topic?.equations?.text.ar ?? "";
    expect(originalAr).toContain("v = d / t");
    const markup = renderToStaticMarkup(
      <>{renderEquationTextWithHighlight(originalAr, tokens, "v = d / t")}</>,
    );
    expect(markup).toContain('<mark class="equation-highlight">');
  });
});
