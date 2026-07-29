# ch01-t06 targeted source review

## Evidence reviewed

- `SRC-CH01-KAHOOT-001`: the raw user-provided copy recorded at `raw-sources/source-kahoot-001-pasted-text.txt`, with the 15 selected questions enumerated in `sources/source-kahoot-001/ch01-t06-user-provided-question-inventory.json`.
- `SRC-CH01-PDF-003`, page 24 of `Lectures pdf/Chapter One- The Study of Motion.pdf`: direction matters; velocity is speed in a particular direction and has the same units as speed; velocity is a vector and speed is a scalar.

The raw file intentionally preserves four trailing-whitespace lines from the attachment. They are checksum-covered evidence, not formatting defects; generated audit files must pass `git diff --check` when that raw path is excluded.

## Supported limited scope

The two sources agree on a narrow, introductory scope: distinguish speed from velocity by direction; classify speed as scalar and velocity as vector; state that a vector has magnitude and direction; and explain that velocity changes when direction changes even at constant speed. The selected Kahoot questions also support the convention that arrow length represents magnitude.

## Boundaries and visual decision

This review excludes all vector-addition/resultant items: first-bank questions 41–44 and second-bank questions 27–28 belong to `ch01-t07`. It authorizes neither displacement nor equations/numerical calculations. PDF page 25 is also `ch01-t07` material and must not be reused.

No source reviewed here establishes that an instructional figure is necessary. The arrow-length convention can be taught textually in this narrowly scoped topic, so the recommendation is **internal integration without a visual**, provided a future authorization records that decision explicitly. This is not permission to reuse, redraw, or adapt the PDF vector-addition artwork.

## Readiness recommendation

The topic is ready only for a **narrow English drafting authorization** covering the supported conceptual distinctions above, with newly authored prose and examples. It is not ready for a broader treatment of displacement, average velocity equations, vector addition, resultants, graphs, or acceleration.

The original narrative evidence remains incomplete: `SEG032` and the raw Source 002 materials are still unavailable. The appropriate approved primary source to restore is `SRC-CH01-CONV-001` at `docs/content-audits/chapter-01/raw-sources/source-001-segments.json` (specifically `SEG032`), supplemented where available by the existing Source 002 snapshot. An external replacement source must not be introduced without a separate owner decision.
