import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const rawPath = new URL("./raw-sources/source-kahoot-001-pasted-text.txt", import.meta.url);
const inventoryPath = new URL("./sources/source-kahoot-001/ch01-t06-user-provided-question-inventory.json", import.meta.url);
const expectedSha256 = "6bce541abb21be6b36b0ded30f253110887e24bdb635a02bd36ac86351149043";
const raw = await readFile(rawPath);
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const sha256 = createHash("sha256").update(raw).digest("hex");

if (sha256 !== expectedSha256 || inventory.rawSource.sha256 !== expectedSha256) {
  throw new Error("The saved user-provided Kahoot source checksum does not match the registered value.");
}

const firstBank = inventory.includedQuestions
  .filter((entry) => entry.bank === "Kahoot Exam — Chapter 1: The Study of Motion")
  .map((entry) => entry.questionNumber);
const secondBank = inventory.includedQuestions
  .filter((entry) => entry.bank === "Kahoot 2 — Conceptual Mastery of Chapter 1")
  .map((entry) => entry.questionNumber);

if (JSON.stringify(firstBank) !== JSON.stringify([33, 34, 35, 36, 37, 38, 39, 40])) {
  throw new Error("First-bank inclusion must remain questions 33–40 only.");
}
if (JSON.stringify(secondBank) !== JSON.stringify([20, 21, 22, 23, 24, 25, 26])) {
  throw new Error("Second-bank inclusion must remain questions 20–26 only.");
}
if (!inventory.explicitExclusions.some((entry) => JSON.stringify(entry.questionNumbers) === JSON.stringify([41, 42, 43, 44])) ||
    !inventory.explicitExclusions.some((entry) => JSON.stringify(entry.questionNumbers) === JSON.stringify([27, 28]))) {
  throw new Error("Vector-addition and resultant exclusions are required.");
}
if (!inventory.explicitExclusions.some((entry) => entry.scope === "displacement") ||
    !inventory.explicitExclusions.some((entry) => entry.scope === "equations and numerical calculation")) {
  throw new Error("Displacement and equation exclusions are required.");
}

for (const entry of inventory.includedQuestions) {
  if (!raw.toString("utf8").includes(entry.question)) {
    throw new Error(`Registered question is absent from the raw source: ${entry.question}`);
  }
}

console.log("ch01-t06 user source audit: passed");
