import { useLayoutEffect, useState, type RefObject } from "react";
import { contentOverflows, isBelowClip } from "./fadeClip.ts";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function useContentOverflow(contentRef: RefObject<HTMLDivElement | null>): boolean {
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const collapsedHeight = Number.parseFloat(
        getComputedStyle(el).getPropertyValue("--fade-collapsed"),
      );
      const next = contentOverflows(el.scrollHeight, collapsedHeight);
      setOverflows((current) => (current === next ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    void document.fonts.ready.then(measure);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [contentRef]);

  return overflows;
}

export function useClippedFocus(
  clipRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  collapsed: boolean,
) {
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const nodes = () => [...content.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const clear = () => {
      for (const node of nodes()) node.removeAttribute("inert");
    };

    if (!collapsed) {
      clear();
      return;
    }

    const clip = clipRef.current;
    if (!clip) return;

    const apply = () => {
      const edge = collapsedEdge(clip);
      for (const node of nodes()) {
        const hidden = isBelowClip(node.getBoundingClientRect().top, edge);
        if (hidden) node.setAttribute("inert", "");
        else node.removeAttribute("inert");
      }
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(content);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [clipRef, contentRef, collapsed]);
}

function collapsedEdge(clip: HTMLElement): number {
  const top = clip.getBoundingClientRect().top;
  const collapsedHeight = Number.parseFloat(
    getComputedStyle(clip).getPropertyValue("--fade-collapsed"),
  );
  if (!Number.isFinite(collapsedHeight)) return clip.getBoundingClientRect().bottom;
  return top + collapsedHeight;
}
