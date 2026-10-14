import assert from "node:assert/strict";
import test from "node:test";
import { sortByValue } from "./sortByValue.js";

const swatches = [
  { name: "Lemon", color: "yellow" },
  { name: "Ink", color: "black" },
  { name: "Snow", color: "white" },
  { name: "Moss", color: "green" },
  { name: "Poppy", color: "red" },
  { name: "Paper", color: "white" },
  { name: "Sea", color: "blue" },
  { name: "Coal", color: "black" },
  { name: "Lime", color: "green" },
];

test("orders a color field by the value list and sends the rest to others", () => {
  const sorted = sortByValue(
    swatches,
    ["white", "black", "green", "yellow", "others"],
    "color",
  );

  assert.deepEqual(
    sorted.map((row) => row.name),
    ["Snow", "Paper", "Ink", "Coal", "Moss", "Lime", "Lemon", "Poppy", "Sea"],
  );
});

test("places unnamed values where others sits in the list", () => {
  const data = [
    { name: "Ink", color: "black" },
    { name: "Poppy", color: "red" },
    { name: "Snow", color: "white" },
    { name: "Sea", color: "blue" },
  ];

  const sorted = sortByValue(data, ["white", "others", "black"], "color");

  assert.deepEqual(
    sorted.map((row) => row.name),
    ["Snow", "Poppy", "Sea", "Ink"],
  );
});

test("puts unnamed values after the list when others is absent", () => {
  const data = [
    { name: "Poppy", color: "red" },
    { name: "Ink", color: "black" },
    { name: "Snow", color: "white" },
  ];

  assert.deepEqual(
    sortByValue(data, ["white", "black"], "color").map((row) => row.name),
    ["Snow", "Ink", "Poppy"],
  );
});

test("treats a missing property as others", () => {
  const data = [{ name: "Bare" }, { name: "Snow", color: "white" }, { name: "Ink", color: "black" }];

  assert.deepEqual(
    sortByValue(data, ["white", "black", "others"], "color").map((row) => row.name),
    ["Snow", "Ink", "Bare"],
  );
});

test("uses the first copy when a value is listed twice", () => {
  const data = [
    { name: "Ink", color: "black" },
    { name: "Snow", color: "white" },
  ];

  assert.deepEqual(
    sortByValue(data, ["black", "white", "black"], "color").map((row) => row.name),
    ["Ink", "Snow"],
  );
});

test("an empty value list keeps the original order in a new array", () => {
  const data = [{ color: "black" }, { color: "white" }];
  const sorted = sortByValue(data, [], "color");

  assert.notEqual(sorted, data);
  assert.deepEqual(sorted, data);
});

test("does not reorder the input array", () => {
  const data = [{ color: "black" }, { color: "white" }];
  sortByValue(data, ["white", "black"], "color");
  assert.deepEqual(
    data.map((row) => row.color),
    ["black", "white"],
  );
});

test("rejects a bad data array, value list, or key", () => {
  assert.throws(() => sortByValue(null, [], "color"), TypeError);
  assert.throws(() => sortByValue([], "white", "color"), TypeError);
  assert.throws(() => sortByValue([], [], ""), TypeError);
  assert.throws(() => sortByValue([], [], 1), TypeError);
});
