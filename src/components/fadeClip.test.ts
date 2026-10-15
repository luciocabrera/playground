import assert from "node:assert/strict";
import test from "node:test";
import { contentOverflows, isBelowClip } from "./fadeClip.ts";

test("short content does not overflow the teaser", () => {
  assert.equal(contentOverflows(80, 140), false);
  assert.equal(contentOverflows(140, 140), false);
});

test("overflow ignores a single pixel and catches anything taller", () => {
  assert.equal(contentOverflows(141, 140), false);
  assert.equal(contentOverflows(142, 140), true);
});

test("a missing measurement does not count as overflow", () => {
  assert.equal(contentOverflows(Number.NaN, 140), false);
  assert.equal(contentOverflows(400, Number.NaN), false);
});

test("a focusable at the clip edge is below the fold", () => {
  assert.equal(isBelowClip(139, 140), true);
  assert.equal(isBelowClip(140, 140), true);
  assert.equal(isBelowClip(138, 140), false);
});
