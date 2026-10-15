/** True when the body is taller than the teaser. One pixel of slack absorbs rounding. */
export function contentOverflows(scrollHeight: number, collapsedHeight: number): boolean {
  if (!Number.isFinite(scrollHeight) || !Number.isFinite(collapsedHeight)) return false;
  return scrollHeight - collapsedHeight > 1;
}

/** True when a focusable starts at or past the teaser's bottom edge. */
export function isBelowClip(top: number, clipBottom: number): boolean {
  if (!Number.isFinite(top) || !Number.isFinite(clipBottom)) return false;
  return top >= clipBottom - 1;
}
