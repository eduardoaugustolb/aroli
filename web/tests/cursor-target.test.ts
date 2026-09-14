import assert from "node:assert/strict";
import { after, test } from "node:test";
import { getCursorTarget } from "../app/cursor-target";

// Computed styles and hit testing are supplied by the browser in production.
// These fixtures isolate the visibility guard, including ancestor opacity.
function fixture(parent?: { element: HTMLElement }) {
  const state = {
    connected: true,
    disabled: false,
    inactive: false,
    style: {
      opacity: "1", visibility: "visible", display: "block",
      contentVisibility: "visible", pointerEvents: "auto",
    },
  };
  const element = {
    get isConnected() { return state.connected; },
    parentElement: parent?.element ?? null,
    matches: () => state.disabled,
    closest: () => state.inactive ? element : parent?.element.closest("") ?? null,
  } as unknown as HTMLElement;
  styles.set(element, state.style);
  const hit = { closest: () => element } as unknown as Element;
  return { state, element, hit };
}

const styles = new WeakMap<Element, object>();
const originalStyle = Object.getOwnPropertyDescriptor(globalThis, "getComputedStyle");
Object.defineProperty(globalThis, "getComputedStyle", {
  configurable: true,
  value: (element: Element) => styles.get(element),
});
after(() => {
  if (originalStyle) Object.defineProperty(globalThis, "getComputedStyle", originalStyle);
  else Reflect.deleteProperty(globalThis, "getComputedStyle");
});

test("a visible button is recognized through its child hit", () => {
  const { hit, element } = fixture();
  assert.equal(getCursorTarget(hit), element);
  assert.equal(getCursorTarget(null), null);
});

test("transparent ancestor stops morphing and reversing the fade restores it", () => {
  const heading = fixture();
  const wrapper = fixture(heading);
  const button = fixture(wrapper);
  for (const opacity of ["1", "0.5", "0", "0.5", "1"]) {
    heading.state.style.opacity = opacity;
    assert.equal(getCursorTarget(button.hit), opacity === "0" ? null : button.element);
  }
});

test("visibility changes are checked again for the same stationary hit", () => {
  const parent = fixture();
  const button = fixture(parent);
  assert.equal(getCursorTarget(button.hit), button.element);
  parent.state.style.visibility = "hidden";
  assert.equal(getCursorTarget(button.hit), null);
  parent.state.style.visibility = "visible";
  assert.equal(getCursorTarget(button.hit), button.element);
});

for (const [property, value] of [
  ["opacity", "0"], ["visibility", "collapse"],
  ["display", "none"], ["contentVisibility", "hidden"],
] as const) {
  test(`ignores an ancestor with ${property}: ${value}`, () => {
    const parent = fixture();
    const button = fixture(parent);
    parent.state.style[property] = value;
    assert.equal(getCursorTarget(button.hit), null);
  });
}

test("ignores disabled, inactive, detached and non-interactive targets", () => {
  const parent = fixture();
  const button = fixture(parent);
  button.state.disabled = true;
  assert.equal(getCursorTarget(button.hit), null);
  button.state.disabled = false;
  parent.state.inactive = true;
  assert.equal(getCursorTarget(button.hit), null);
  parent.state.inactive = false;
  button.state.connected = false;
  assert.equal(getCursorTarget(button.hit), null);
  button.state.connected = true;
  button.state.style.pointerEvents = "none";
  assert.equal(getCursorTarget(button.hit), null);
});
