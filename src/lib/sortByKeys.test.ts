import assert from "node:assert/strict";
import test from "node:test";
import { sortByKeys } from "./sortByKeys.ts";

test("sorts by keys in priority order", () => {
  const data = [
    { name: "b", team: "a" },
    { name: "a", team: "b" },
    { name: "c", team: "a" },
  ];

  const sorted = sortByKeys(data, ["team", "name"]);

  assert.deepEqual(
    sorted.map((row) => `${row.team}-${row.name}`),
    ["a-b", "a-c", "b-a"],
  );
});

test("sorts numbers numerically", () => {
  const data = [{ n: 10 }, { n: 2 }, { n: 1 }];
  assert.deepEqual(
    sortByKeys(data, ["n"]).map((row) => row.n),
    [1, 2, 10],
  );
});

test("puts missing values last and keeps ties in original order", () => {
  const data = [
    { name: "a", city: null },
    { name: "b", city: "Lisbon" },
    { name: "c" },
    { name: "d", city: "Lisbon" },
  ];

  assert.deepEqual(
    sortByKeys(data, ["city", "name"]).map((row) => row.name),
    ["b", "d", "a", "c"],
  );
});

test("an empty key list keeps the original order in a new array", () => {
  const data = [{ n: 2 }, { n: 1 }];
  const sorted = sortByKeys(data, []);

  assert.notEqual(sorted, data);
  assert.deepEqual(sorted, data);
});

test("does not reorder the input array", () => {
  const data = [{ n: 2 }, { n: 1 }];
  sortByKeys(data, ["n"]);
  assert.deepEqual(
    data.map((row) => row.n),
    [2, 1],
  );
});

test("rejects values that are not arrays", () => {
  assert.throws(() => sortByKeys(null as never, []), TypeError);
  assert.throws(() => sortByKeys([], "name" as never), TypeError);
});
