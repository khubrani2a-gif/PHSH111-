import { describe, expect, it } from "vitest";
import { RAW_CONTENT_BY_TOPIC, RAW_SVG_MARKUP_BY_TOPIC } from "../content/rawImports";
import { APP_TOPIC_ORDER } from "../types/pilotSchema";

describe("ch01-t07 internal integration",()=>it("loads between t06 and t08 with the original visual only",()=>{expect(APP_TOPIC_ORDER).toContain("ch01-t07");expect(APP_TOPIC_ORDER.indexOf("ch01-t07")).toBe(APP_TOPIC_ORDER.indexOf("ch01-t06")+1);expect(APP_TOPIC_ORDER.indexOf("ch01-t08")).toBe(APP_TOPIC_ORDER.indexOf("ch01-t07")+1);expect(RAW_CONTENT_BY_TOPIC["ch01-t07"]).toBeDefined();expect(RAW_SVG_MARKUP_BY_TOPIC["ch01-t07"]).toContain(">R<");expect(RAW_SVG_MARKUP_BY_TOPIC["ch01-t07"]).not.toContain("bird");}));
