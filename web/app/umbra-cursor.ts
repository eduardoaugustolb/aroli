export const CURSORS = {
  arrow: [5, 4],
  hover: [21, 8],
  text: [24, 24],
  grab: [24, 24],
  grabbing: [24, 24],
  "ew-resize": [24, 24],
  "ns-resize": [24, 24],
  "nwse-resize": [24, 24],
  crosshair: [24, 24],
  help: [24, 24],
  "no-drop": [5, 4],
  copy: [5, 4],
  "zoom-in": [21, 21],
  "zoom-out": [21, 21],
  wait: [24, 24],
  progress: [5, 4],
} as const;
export type CursorShape = keyof typeof CURSORS;

let preload: Promise<void> | undefined;
export function preloadUmbraCursors() {
  if (!preload)
    preload = Promise.all(
      Object.keys(CURSORS).map((name) => {
        const image = new Image();
        image.src = `/playground/cursors/${name}.svg`;
        return image.decode();
      }),
    )
      .then(() => {})
      .catch(() => {
        preload = undefined;
      });
  return preload;
}

export function cursorShape(
  hit: Element | null,
  dragging = false,
): CursorShape {
  if (dragging) return "grabbing";
  const explicit = hit?.closest<HTMLElement>("[data-umbra-cursor]")?.dataset
    .umbraCursor;
  if (explicit && explicit in CURSORS) return explicit as CursorShape;
  if (hit?.closest(':disabled,[aria-disabled="true"]')) return "no-drop";
  if (
    hit?.closest(
      'textarea,input:not([type="range"]):not([type="checkbox"]),[contenteditable="true"]',
    )
  )
    return "text";
  if (
    hit?.closest(
      'button,a[href],select,input[type="checkbox"],input[type="range"],label',
    )
  )
    return "hover";
  return "arrow";
}

// Significant direction reversals in a short window; slow sweeps don't qualify.
export class CursorShake {
  private lastX = 0;
  private lastY = 0;
  private lastTime = 0;
  private direction = 0;
  private reversals: number[] = [];
  private distance = 0;
  reset() {
    this.lastTime = 0;
    this.direction = 0;
    this.reversals = [];
    this.distance = 0;
  }
  sample(x: number, y: number, time: number) {
    if (!this.lastTime || time - this.lastTime > 180) {
      this.reset();
      this.lastX = x;
      this.lastY = y;
      this.lastTime = time;
      return false;
    }
    const dx = x - this.lastX,
      dy = y - this.lastY;
    if (Math.hypot(dx, dy) < 12) return false;
    const direction = Math.sign(Math.abs(dx) > Math.abs(dy) ? dx : dy);
    this.distance += Math.hypot(dx, dy);
    this.reversals = this.reversals.filter((t) => time - t < 450);
    if (this.direction && direction !== this.direction)
      this.reversals.push(time);
    this.direction = direction;
    this.lastX = x;
    this.lastY = y;
    this.lastTime = time;
    if (this.reversals.length >= 4 && this.distance > 240) {
      this.reset();
      return true;
    }
    return false;
  }
}
