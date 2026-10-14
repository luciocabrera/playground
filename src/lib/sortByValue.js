/** Slot in `values` for any property value the list does not name. */
export const OTHERS = "others";

/**
 * Return a new array of `data` ordered by the property `key`, following
 * `values` from first to last. A row whose value is not named in the list
 * uses the `others` entry when that entry is present, and otherwise comes
 * after every named value. Rows that share a slot keep their original order.
 * The input array stays as it was.
 *
 * @param {Array<object>} data
 * @param {Array<string>} values
 * @param {string} key
 * @returns {Array<object>}
 */
export function sortByValue(data, values, key) {
  if (!Array.isArray(data)) {
    throw new TypeError("data must be an array");
  }
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }
  if (typeof key !== "string" || key === "") {
    throw new TypeError("key must be a non-empty string");
  }

  const rank = new Map();
  let othersRank = null;
  values.forEach((value, index) => {
    if (value === OTHERS) {
      if (othersRank === null) othersRank = index;
      return;
    }
    if (!rank.has(value)) rank.set(value, index);
  });
  const fallback = othersRank === null ? values.length : othersRank;

  function rankOf(value) {
    return rank.has(value) ? rank.get(value) : fallback;
  }

  return [...data].sort((left, right) => rankOf(left?.[key]) - rankOf(right?.[key]));
}
