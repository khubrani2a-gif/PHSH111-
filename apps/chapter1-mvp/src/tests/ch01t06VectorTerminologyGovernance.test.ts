import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const glossaryPath = resolve(
  process.cwd(),
  "../../docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json",
);

describe("ch01-t06 vector terminology governance", () => {
  it("keeps the approved Arabic vector term available to ch01-t06", () => {
    const glossary = JSON.parse(readFileSync(glossaryPath, "utf8"));
    const vector = glossary.terms.find(
      (term: { termId: string }) => term.termId === "ch01-term-vector",
    );

    expect(vector).toMatchObject({
      termId: "ch01-term-vector",
      englishTerm: "vector",
      approvedArabicTerm: { text: "كمية متجهة", status: "approved" },
      approvalStatus: "approved",
      topicIds: ["ch01-t06", "ch01-t07"],
    });
  });
});
