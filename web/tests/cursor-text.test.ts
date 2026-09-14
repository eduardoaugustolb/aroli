import assert from "node:assert/strict";
import { after, test } from "node:test";
import { getLinkTextRect } from "../app/cursor-target";

const originalNodeFilter = Object.getOwnPropertyDescriptor(globalThis, "NodeFilter");
Object.defineProperty(globalThis, "NodeFilter", {
  configurable: true,
  value: { SHOW_TEXT: 4 },
});
after(() => {
  if (originalNodeFilter) Object.defineProperty(globalThis, "NodeFilter", originalNodeFilter);
  else Reflect.deleteProperty(globalThis, "NodeFilter");
});

function textNode(text: string, left: number, width: number, excluded = false) {
  return {
    textContent: text,
    parentElement: { closest: () => excluded ? {} : null },
    rect: { left, top: 20, right: left + width, bottom: 34, width, height: 14 },
  };
}

// Supply browser text geometry; the function must combine all text fragments
// and never use the icon/link container geometry or the pointer's position.
function link(nodes: ReturnType<typeof textNode>[]) {
  const target = {
    ownerDocument: {
      createTreeWalker(root: unknown, filter: number) {
        assert.equal(root, target);
        assert.equal(filter, 4);
        let index = 0;
        return { nextNode: () => nodes[index++] ?? null };
      },
      createRange() {
        let selected: ReturnType<typeof textNode>;
        return {
          setStart(node: ReturnType<typeof textNode>, offset: number) {
            selected = node;
            assert.equal(offset, node.textContent.search(/\S/));
          },
          setEnd(node: ReturnType<typeof textNode>, offset: number) {
            assert.equal(node, selected);
            assert.equal(offset, node.textContent.trimEnd().length);
          },
          getClientRects: () => [selected.rect],
        };
      },
    },
  } as unknown as HTMLElement;
  return target;
}

test("underlines the full label across SplitText words, excluding the icon", () => {
  const target = link([
    textNode("Guia", 10, 25),
    textNode(" ", 35, 4),
    textNode("de", 39, 12),
    textNode("instalação", 55, 60),
    textNode("↗", 125, 13, true),
  ]);
  assert.deepEqual(getLinkTextRect(target), {
    left: 10, top: 20, right: 115, bottom: 34, width: 105, height: 14,
  });
});

test("a leading SVG title cannot replace the text underline", () => {
  const target = link([
    textNode("External link", 0, 200, true),
    textNode("  GitHub  ", 24, 42),
  ]);
  assert.equal(getLinkTextRect(target)?.left, 24);
  assert.equal(getLinkTextRect(target)?.width, 42);
});

test("a link with only decorative text has no text rectangle", () => {
  assert.equal(getLinkTextRect(link([textNode("↗", 0, 13, true)])), null);
  assert.equal(getLinkTextRect(link([textNode(" ", 0, 4)])), null);
});
