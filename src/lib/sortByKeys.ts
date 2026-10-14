/**
 * Return a new array of `data` sorted by `keys`, in priority order.
 * The first key is compared first. Each later key is used only when the
 * earlier keys tie. Missing values sort last. The input array stays as it was.
 */
export function sortByKeys<T extends object>(data: readonly T[], keys: readonly string[]): T[] {
  if (!Array.isArray(data)) {
    throw new TypeError("data must be an array");
  }
  if (!Array.isArray(keys)) {
    throw new TypeError("keys must be an array");
  }

  return data.toSorted((left, right) => compareRows(left, right, keys));
}

function compareRows(left: object, right: object, keys: readonly string[]): number {
  for (const key of keys) {
    const difference = compareValues(fieldOf(left, key), fieldOf(right, key));
    if (difference !== 0) return difference;
  }
  return 0;
}

function fieldOf(row: object | null | undefined, key: string): unknown {
  return (row as Record<string, unknown> | null | undefined)?.[key];
}

function compareValues(left: unknown, right: unknown): number {
  const leftMissing = left == null;
  const rightMissing = right == null;
  if (leftMissing && rightMissing) return 0;
  if (leftMissing) return 1;
  if (rightMissing) return -1;

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
