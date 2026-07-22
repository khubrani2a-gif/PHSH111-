// Renders authored equation/notation text (plain strings from the source
// JSON — see MVP_PRODUCT_SPEC.md §9's rendering recommendation and
// docs/app/MVP_IMPLEMENTATION_DECISIONS.json decision E) as semantic HTML
// with true superscripts/subscripts, italic variables, upright units, and
// per-run LTR isolation for embedded Latin/notation fragments inside
// Arabic prose.
//
// EQUATION RENDERING SPIKE FINDINGS (§11): the four equationSet blocks are
// NOT clean, isolated formulas — each is a short paragraph mixing English
// or Arabic prose with embedded notation (e.g. t03: "f = 1/T (frequency
// equals the reciprocal of period...)"). The source uses two different,
// inconsistent inline notation conventions for subscripts: an explicit
// underscore ("a_c", "x_km") and bare concatenation with no delimiter at
// all ("v0" for v-sub-zero). The character "x" is also overloaded in t02's
// text as both part of a subscripted variable ("x_km") and a bare
// multiplication operator ("length x width"). None of this is a rendering
// *engine* limitation — feeding these strings into KaTeX or MathJax would
// not resolve the ambiguity, because doing so would first require manually
// rewriting each string into clean LaTeX source (deciding by hand that
// "v0" means "v_0" and that "at" means "a \cdot t"), which is exactly the
// kind of content rewriting this phase is instructed not to do. The
// approach below therefore only converts what is UNAMBIGUOUSLY delimited
// in the source (explicit ^ and _ suffixes) plus a small, per-topic,
// manually-verified whitelist of bare single-letter variable tokens that
// actually appear as standalone words in that topic's specific text — never
// a generic "italicize every solo letter" rule, which would have wrongly
// italicized the English article "a" in t02's "Area of a rectangle" and
// wrongly italicized the multiplication "x" in "length x width". Fused,
// undelimited tokens like "v0" and "at" are left exactly as authored.
// CONCLUSION: semantic HTML + this conservative tokenizer renders every
// actual pilot equation string accurately. No equation library is needed
// for the current four topics; see the Phase 2 report for the escalation
// recommendation if that changes in a future topic.

import type { ReactNode } from "react";
import type { PilotTopicId } from "../types/pilotSchema";

/**
 * Per-topic whitelist of bare single-letter/short variable tokens verified
 * by manual inspection of each topic's actual equationSet, problem, and
 * solution-step text to appear ONLY as standalone physics symbols in that
 * topic's content — never as an English word or an operator. See the
 * header comment above for the "x" and "a" ambiguities this avoids.
 */
// ch01-t01 (v, d, t, L, T, M, l, w): verified by direct inspection of every
// rendered field in the approved English baseline — each token appears
// only as a standalone dimensional/measured-variable symbol, never as an
// English word, unit abbreviation, or operator. No unit abbreviation
// collision exists (distance/time/mass are spelled out as "meters, m" /
// "seconds, s" — "m" and "s" are deliberately NOT in this whitelist).
// Lowercase "l" and "w" (Slide 3: "l commonly represents length" / "w
// commonly represents width") were independently re-verified against the
// full topic text and found to occur only as those two standalone
// symbols — no fused-abbreviation or English-word collision. Lowercase
// "h" ("h commonly represents height") was deliberately NOT added: it
// collides with the existing "h" in "km/h" and "miles/h" (Slide 2's
// speed example/scientific note) and the standalone "2 h" duration in
// that same equation — a genuine ambiguity of exactly the kind this
// whitelist's own house rule exists to catch, so "h" renders as plain
// (non-italic) text everywhere in this topic, including in Slide 3.
//
// "V" (Slide 6's volume symbol, "V = l × w × h") was added after
// confirming zero occurrences anywhere in ch01-t01's approved English
// baseline prior to Slide 6 — no English-word or unit-abbreviation
// collision is possible for a token that didn't previously appear.
// Uppercase "A" (Slide 5's/Slide 6's area symbol, "A = l × w") was
// deliberately NOT added, for the same reason "h" was excluded: it
// collides with the English indefinite article "A", which opens many
// sentences throughout this topic's authored prose (Slide 5's "A
// surface extends...", Slide 6's "A rectangular floor...", etc.) — so
// "A" renders as plain (non-italic) text everywhere in this topic.
//
// ch01-t04 (g, W only — "m" deliberately excluded): "m" appears in the
// approved baseline BOTH as the mass variable ("m is its mass", "Mass
// (m)", the givenValues entry "m = 45 kg") AND as the meters-per-second-
// squared unit abbreviation ("9.8 m/s^2", appearing in the equationSet
// block, the problem statement, both solution steps, and the g givenValues
// entry "g = 9.8 m/s^2") — a genuine, verified ambiguity of exactly the
// kind this whitelist's own house rule (never a blanket single-letter
// rule) exists to catch, mirroring t02's "x" and t08's prose-only "a"
// exclusions. Italicizing "m" here would incorrectly italicize the meters
// unit wherever it appears standalone. "g" and "W" were independently
// checked against every rendered field (mainIdea, organizedExplanation,
// equationSet, reviewQuestion, misconception, problem statement/
// interpretation/intuition/solution-steps/final-answer, given values) and
// found to appear only as their intended physics symbols, with no
// colliding occurrence.
export const EQUATION_ITALIC_TOKENS_BY_TOPIC: Record<PilotTopicId, string[]> = {
  "ch01-t01": ["v", "d", "t", "L", "T", "M", "l", "w", "V", "f"],
  "ch01-t02": ["A", "V"],
  "ch01-t03": ["f", "T"],
  "ch01-t04": ["g", "W"],
  "ch01-t08": ["a", "g", "v", "t"],
  "ch01-t10": ["v", "r"],
};

/**
 * A reduced variant of the whitelist above, for use on natural-language
 * PROSE fields (mainIdea, organizedExplanation, example, problem
 * statement/interpretation, solution-step explanations, instructor
 * notes/learning objectives) rather than bare symbolic/equation text.
 *
 * "a" is deliberately excluded from ch01-t08's prose-safe set: it is the
 * English indefinite article and appears repeatedly as one in that
 * topic's actual mainIdea/organizedExplanation/example/problem prose
 * ("under a downward-positive convention", "from a rooftop", "down a
 * corridor") — confirmed by rendering and visual inspection during this
 * phase, which is exactly the kind of real defect this two-tier design
 * exists to prevent. It was verified safe only within ch01-t08's dense,
 * low-prose equationSet text (see the header comment above), which is why
 * EQUATION_ITALIC_TOKENS_BY_TOPIC (used only for that block, and for bare
 * symbol/calculation fields that are never natural-language prose) still
 * includes it. None of the other tokens in any topic (A, V, f, T, v, r,
 * t, g) collide with a common English word, so they are unchanged here.
 */
// ch01-t01 and ch01-t04 use the identical token set in both maps below:
// no prose-specific ambiguity (an English-word or fused-abbreviation
// collision, comparable to t08's "a" or t04's own excluded "m") was found
// for any of v/d/t/L/T/M/l/w/f (t01) or g/W (t04) in either the
// equation-only fields or the natural-language prose fields — see the
// header comment on EQUATION_ITALIC_TOKENS_BY_TOPIC above for the full
// per-token verification, including why "h" is excluded from ch01-t01's
// whitelist. "f" was added for Slide 9 (Period and Frequency) after
// confirming zero standalone-word occurrences anywhere in ch01-t01's
// approved content, the same precedent used for "V" (Slide 6) and "l"/"w"
// (Slide 3).
export const EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC: Record<PilotTopicId, string[]> = {
  "ch01-t01": ["v", "d", "t", "L", "T", "M", "l", "w", "V", "f"],
  "ch01-t02": ["A", "V"],
  "ch01-t03": ["f", "T"],
  "ch01-t04": ["g", "W"],
  "ch01-t08": ["g", "v", "t"],
  "ch01-t10": ["v", "r"],
};

// Uses a Unicode property escape (ES2018+) rather than manually-typed
// codepoint ranges, to avoid any risk of a mistyped/mis-encoded range.
const ARABIC_RANGE_RE = /\p{Script=Arabic}/u;

type RunType = "ar" | "latin";

function classify(ch: string): RunType | "neutral" {
  if (ARABIC_RANGE_RE.test(ch)) return "ar";
  if (/[A-Za-z0-9]/.test(ch)) return "latin";
  return "neutral";
}

/**
 * Splits text into alternating Arabic-script and Latin/notation runs.
 * Neutral characters (whitespace, punctuation, math operators) extend
 * whichever run is currently open rather than forcing a break — this
 * keeps short equation fragments like "f = 1/T (" together as one run
 * instead of fragmenting on every space or operator.
 */
function splitBidiRuns(text: string): { text: string; type: RunType }[] {
  const runs: { text: string; type: RunType }[] = [];
  let current = "";
  let currentType: RunType | null = null;
  for (const ch of text) {
    const cls = classify(ch);
    if (cls === "neutral") {
      current += ch;
      continue;
    }
    if (currentType === null || cls === currentType) {
      current += ch;
      currentType = cls;
    } else {
      runs.push({ text: current, type: currentType });
      current = ch;
      currentType = cls;
    }
  }
  if (current) runs.push({ text: current, type: currentType ?? "latin" });
  return runs;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Only matches notation that carries an EXPLICIT ^ or _ suffix already
// present in the source text — never inferred. Two alternatives:
//   1. A letter-led base with a ^exponent or _subscript suffix (e.g.
//      "v^2", "a_c", "s^-1"). The subscript branch allows nested
//      underscores ("a_c_max") so a compound symbol renders as one
//      subscript group rather than truncating at the first inner
//      underscore. The base is captured (group 1) so it can be
//      italicized against the per-topic whitelist.
//   2. A BARE ^exponent with no letter immediately before it — e.g.
//      "(7600)^2" or "10^6", both of which appear in the pilot problem
//      solutions. There is no "base" to italicize here (it's a numeral or
//      a closing parenthesis, never a variable), so only the exponent is
//      captured (group 3) and converted to a true superscript, and
//      whatever precedes it is left completely untouched.
const SUP_SUB_RE =
  /([A-Za-z][A-Za-z0-9]*)(\^-?\d+|_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*)|(\^-?\d+)/g;

function renderPlainSegment(
  text: string,
  italicTokens: readonly string[],
  keyPrefix: string,
): ReactNode[] {
  if (text.length === 0 || italicTokens.length === 0) return [text];
  const pattern = new RegExp(`\\b(${italicTokens.map(escapeRegExp).join("|")})\\b`, "g");
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    nodes.push(<em key={`${keyPrefix}-i-${key}`}>{m[1]}</em>);
    lastIndex = m.index + m[1].length;
    key += 1;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length > 0 ? nodes : [text];
}

function renderLatinRun(
  text: string,
  italicTokens: readonly string[],
  keyPrefix: string,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  SUP_SUB_RE.lastIndex = 0;
  while ((match = SUP_SUB_RE.exec(text)) !== null) {
    const [full, base, suffix, bareSuperscript] = match;
    if (match.index > lastIndex) {
      nodes.push(
        ...renderPlainSegment(text.slice(lastIndex, match.index), italicTokens, `${keyPrefix}-p${key}`),
      );
    }
    if (bareSuperscript) {
      // No letter base to italicize — just the numeral/paren stays plain,
      // and the exponent becomes a true superscript.
      nodes.push(
        <sup key={`${keyPrefix}-t-${key}`}>{bareSuperscript.slice(1)}</sup>,
      );
    } else {
      const isItalic = italicTokens.includes(base);
      const baseNode = isItalic ? <em key={`${keyPrefix}-b-${key}`}>{base}</em> : base;
      if (suffix.startsWith("^")) {
        nodes.push(
          <span key={`${keyPrefix}-t-${key}`}>
            {baseNode}
            <sup>{suffix.slice(1)}</sup>
          </span>,
        );
      } else {
        nodes.push(
          <span key={`${keyPrefix}-t-${key}`}>
            {baseNode}
            <sub>{suffix.slice(1)}</sub>
          </span>,
        );
      }
    }
    lastIndex = match.index + full.length;
    key += 1;
  }
  if (lastIndex < text.length) {
    nodes.push(...renderPlainSegment(text.slice(lastIndex), italicTokens, `${keyPrefix}-pEnd`));
  }
  return nodes;
}

/**
 * Renders authored notation text as React nodes: Arabic-script runs pass
 * through as plain text (natural RTL flow within the parent); Latin/
 * notation runs (equation fragments, unit symbols, numbers) are each
 * wrapped in their own `dir="ltr"` span, with explicit ^/_ suffixes
 * converted to true `<sup>`/`<sub>`, and whitelisted bare variable tokens
 * italicized. Never rewrites, reorders, or drops any character of the
 * source text — the concatenation of all rendered nodes' text content is
 * identical to the input string.
 */
export function renderEquationText(
  text: string,
  italicTokens: readonly string[] = [],
): ReactNode {
  const runs = splitBidiRuns(text);
  return runs.map((run, i) =>
    run.type === "latin" ? (
      <span dir="ltr" className="equation-latin-run" key={i}>
        {renderLatinRun(run.text, italicTokens, `r${i}`)}
      </span>
    ) : (
      <span key={i}>{run.text}</span>
    ),
  );
}

/**
 * Same rendering as renderEquationText, plus a purely visual highlight
 * around one exact, verified substring (e.g. ch01-t01's "v = d / t") —
 * used to draw attention to a specific relationship within a longer
 * equationSet paragraph without extracting, summarizing, or hiding any of
 * the surrounding authored text (see EquationBlock's header comment on why
 * extraction itself is avoided). If highlightPhrase does not occur in text
 * (verbatim, case-sensitive), this falls back to plain renderEquationText
 * with no highlight — it never alters or drops a character either way:
 * the three slices concatenated back together equal the input exactly.
 */
export function renderEquationTextWithHighlight(
  text: string,
  italicTokens: readonly string[],
  highlightPhrase: string,
): ReactNode {
  const index = text.indexOf(highlightPhrase);
  if (index < 0) return renderEquationText(text, italicTokens);

  const before = text.slice(0, index);
  const match = text.slice(index, index + highlightPhrase.length);
  const after = text.slice(index + highlightPhrase.length);

  return (
    <>
      {renderEquationText(before, italicTokens)}
      <mark className="equation-highlight">{renderEquationText(match, italicTokens)}</mark>
      {renderEquationText(after, italicTokens)}
    </>
  );
}
