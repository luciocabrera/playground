/**
 * The word a value list uses for the slot that catches every property value
 * the list does not name. It is a position in the order, not a real value
 * stored on a row.
 */
export const OTHERS = "others";

/**
 * Return a new array of `data` ordered by the property `key`, following
 * `values` from first to last.
 *
 * Each string in `values` is a rank. The first string is rank 0, the next is
 * rank 1, and so on. A row is placed by reading `row[key]` and looking that
 * string up. Rows with a lower rank come first.
 *
 * `"others"` ({@link OTHERS}) is the slot for every value the list does not
 * name, including a missing property. Its rank is the index where `"others"`
 * sits. When the list has no `"others"`, those rows use `values.length` and
 * therefore come after every named value.
 *
 * A value listed twice keeps the rank of its first copy. Rows that share a
 * rank stay in the order they had in `data`. `data` itself is left unchanged.
 *
 * @typeParam T - Row type. Each item is an object.
 * @param data - Rows to order.
 * @param values - Wanted order for the property `key`. May include `"others"`.
 * @param key - Name of the property to read on each row.
 * @returns A new array of the same rows, in the requested order.
 * @throws {TypeError} When `data` or `values` is not an array, or when `key`
 *   is not a non-empty string.
 * @example
 * sortByValue(
 *   [
 *     { name: "Ink", color: "black" },
 *     { name: "Poppy", color: "red" },
 *     { name: "Snow", color: "white" },
 *     { name: "Sea", color: "blue" },
 *   ],
 *   ["white", "others", "black"],
 *   "color",
 * );
 * // Snow (white), Poppy (red), Sea (blue), Ink (black)
 */
export function sortByValue<T extends object>(
  data: readonly T[],
  values: readonly string[],
  key: string,
): T[] {
  if (!Array.isArray(data)) {
    throw new TypeError("data must be an array");
  }
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }
  if (typeof key !== "string" || key === "") {
    throw new TypeError("key must be a non-empty string");
  }

  const rank = ranksFor(values);
  const fallback = indexOfValue(values, OTHERS) ?? values.length;

  return data.toSorted(
    (left, right) =>
      rankOf(fieldOf(left, key), rank, fallback) - rankOf(fieldOf(right, key), rank, fallback),
  );
}

/**
 * Map each named value to the index of its first appearance.
 *
 * `"others"` is omitted. It is a slot for unnamed values, so it must not be
 * stored as a name that a row can match. A later copy of a name is omitted
 * too, which keeps the earlier index.
 *
 * @param values - Order list, the same array passed to {@link sortByValue}.
 * @returns A map from a named value to its rank. Ranks start at 0.
 */
function ranksFor(values: readonly string[]): ReadonlyMap<string, number> {
  return new Map(
    values.flatMap((value, index): Array<readonly [string, number]> => {
      if (value === OTHERS || values.indexOf(value) !== index) return [];
      return [[value, index]];
    }),
  );
}

/**
 * Return the index of the first `target` in `values`.
 *
 * `Array#indexOf` uses `-1` for "not found". This returns `undefined` instead,
 * so a caller can write `indexOfValue(values, OTHERS) ?? values.length` and
 * send unnamed rows to the end when the list has no `"others"` slot.
 *
 * @param values - Order list to search.
 * @param target - String to find, compared with `===`.
 * @returns The first index, or `undefined` when `target` is absent.
 */
function indexOfValue(values: readonly string[], target: string): number | undefined {
  const index = values.indexOf(target);
  return index === -1 ? undefined : index;
}

/**
 * Return the rank of one property value.
 *
 * A string that {@link ranksFor} recorded uses that rank. Anything else uses
 * `fallback`: a number, a missing property (`undefined`), or a string the
 * list does not name. `fallback` is the index of `"others"`, or the length
 * of the list when that slot is absent.
 *
 * @param value - The property read by {@link fieldOf}.
 * @param rank - Named values and their ranks.
 * @param fallback - Rank for a value the map does not contain.
 * @returns A number. Lower numbers sort earlier.
 */
function rankOf(value: unknown, rank: ReadonlyMap<string, number>, fallback: number): number {
  if (typeof value !== "string") return fallback;
  return rank.get(value) ?? fallback;
}

/**
 * Read `key` from one row.
 *
 * A missing row and a missing property both become `undefined`.
 * {@link rankOf} then gives that row the fallback rank.
 *
 * @param row - One item from `data`, or a missing item.
 * @param key - Property name passed to {@link sortByValue}.
 * @returns The property value, or `undefined` when it cannot be read.
 */
function fieldOf(row: object | null | undefined, key: string): unknown {
  return (row as Record<string, unknown> | null | undefined)?.[key];
}
