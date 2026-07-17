// Route-level topic ID utilities. The stable topic-ID list and order come
// from src/types/pilotSchema.ts (APP_TOPIC_ORDER) — this file does not
// redefine that order, only re-exposes it for route/navigation use.
//
// APP_TOPIC_ORDER is the chapter-wide six-topic sequence (the original
// four pilot topics plus Batch 1's ch01-t01/ch01-t04, per
// PILOT_AUTHORIZATION.json v1.5.0's batch1ApplicationIntegrationAuthorization),
// not the narrower four-topic PILOT_TOPIC_ORDER, which remains a separate
// constant for logic specifically scoped to the original application-build
// authorization.
//
// Topic TITLES are no longer hardcoded here (Phase 1 used a neutral
// placeholder label; Phase 2 replaces that with real bilingual titles
// sourced from each topic's canonical JSON via the content adapter — see
// src/content/adapter.ts's NormalizedTopic.title). This file only knows
// about IDs and their fixed order, never instructional content.

import { APP_TOPIC_ORDER, type PilotTopicId } from "../types/pilotSchema";

export type TopicId = PilotTopicId;

export const TOPIC_ORDER: readonly TopicId[] = APP_TOPIC_ORDER;

export function isKnownTopicId(value: string | undefined): value is TopicId {
  return !!value && (TOPIC_ORDER as readonly string[]).includes(value);
}

export function getTopicIndex(topicId: TopicId): number {
  return TOPIC_ORDER.indexOf(topicId);
}
