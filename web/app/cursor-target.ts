const CURSOR_TARGET = "a[href], button, [data-cursor]";
const INACTIVE = "[hidden], [inert], [aria-hidden='true'], [aria-disabled='true']";

export function getLinkTextRect(target: HTMLElement) {
  const document = target.ownerDocument;
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;

  // Measure only text, including words wrapped by SplitText. Element ranges
  // also contain SVG/icon boxes and can select a different box as the mouse moves.
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest("svg, [aria-hidden='true'], [hidden], [inert]")) continue;
    const text = node.textContent ?? "";
    const start = text.search(/\S/);
    if (start < 0) continue;
    range.setStart(node, start);
    range.setEnd(node, text.trimEnd().length);
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width <= 0 || rect.height <= 0) continue;
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
      bottom = Math.max(bottom, rect.bottom);
    }
  }

  return Number.isFinite(left)
    ? { left, top, right, bottom, width: right - left, height: bottom - top }
    : null;
}

export function getCursorTarget(hit: Element | null): HTMLElement | null {
  const target = hit?.closest<HTMLElement>(CURSOR_TARGET);
  if (!target?.isConnected || target.matches(":disabled") || target.closest(INACTIVE)) {
    return null;
  }

  // Opacity is not inherited: a visible button can have a transparent ancestor.
  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (
      Number(style.opacity) === 0 ||
      style.visibility === "hidden" ||
      style.visibility === "collapse" ||
      style.display === "none" ||
      style.contentVisibility === "hidden" ||
      (element === target && style.pointerEvents === "none")
    ) {
      return null;
    }
  }

  return target;
}
