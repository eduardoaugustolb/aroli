import assert from "node:assert/strict";
import { readdir, readlink } from "node:fs/promises";

const root = new URL("../cursors/", import.meta.url);
const names = ["default", "pointer", "grabbing", "grab", "copy", "alias", "no-drop"];
const frames = new Map<string, { size: number; pixels: number[] }[]>();

for (const name of names) {
  const data = Buffer.from(await Bun.file(new URL(name, root)).arrayBuffer());
  const u32 = (offset: number) => data.readUInt32LE(offset);
  assert.equal(data.toString("ascii", 0, 4), "Xcur", name);
  assert.equal(u32(12), 3, `${name}: three resolutions`);
  const images = [];
  for (let index = 0; index < 3; index++) {
    const size = [24, 32, 48][index];
    const toc = u32(4) + index * 12;
    assert.equal(u32(toc), 0xfffd0002);
    assert.equal(u32(toc + 4), size, `${name}: nominal size`);
    const start = u32(toc + 8);
    assert.equal(u32(start + 4), 0xfffd0002);
    assert.equal(u32(start + 8), size);
    assert.equal(u32(start + 16), size);
    assert.equal(u32(start + 20), size);
    const [x, y] = name === "pointer" ? [21, 8] : ["grab", "grabbing"].includes(name) ? [24, 24] : [5, 4];
    assert.equal(u32(start + 24), Math.floor(x * size / 48), `${name}: x hotspot`);
    assert.equal(u32(start + 28), Math.floor(y * size / 48), `${name}: y hotspot`);
    const pixels = Array.from({ length: size * size }, (_, i) => u32(start + u32(start) + i * 4));
    assert(pixels.some(pixel => pixel >>> 24 === 255), `${name}: visible image`);
    assert(pixels[u32(start + 28) * size + u32(start + 24)] >>> 24 > 0, `${name}: hotspot on shape`);
    pixels.forEach((pixel, i) => {
      const alpha = pixel >>> 24;
      for (const shift of [0, 8, 16]) {
        assert(((pixel >>> shift) & 255) <= alpha, `${name} ${size}: premultiplied alpha`);
      }
      const px = i % size, py = Math.floor(i / size);
      if (px === 0 || py === 0 || px === size - 1 || py === size - 1) {
        assert.equal(alpha, 0, `${name} ${size}: transparent margin, no clipping`);
      }
    });
    images.push({ size, pixels });
  }
  frames.set(name, images);
}

for (const name of ["copy", "alias", "no-drop"]) {
  frames.get(name)!.forEach((frame, index) => {
    const normal = frames.get("default")![index];
    assert.deepEqual(frame.pixels.slice(0, frame.size * Math.floor(24 * frame.size / 48)),
      normal.pixels.slice(0, frame.size * Math.floor(24 * frame.size / 48)),
      `${name}: arrow position and outline match the default cursor`);
  });
}

// Shared lower anatomy stays stable; upper contours articulate per pose.
for (const name of ["pointer", "grabbing"]) {
  frames.get(name)!.forEach((frame, index) => {
    const open = frames.get("grab")![index];
    const start = Math.ceil(28 * frame.size / 48) * frame.size;
    assert.deepEqual(frame.pixels.slice(start), open.pixels.slice(start),
      `${name}: shared lower palm and wrist`);
  });
}
// Test topology, not a row of equally spaced bars: the latter enforced the
// rejected fork silhouette. Anatomical recognition is reviewed separately.
for (const name of ["pointer", "grab", "grabbing"]) {
  for (const frame of frames.get(name)!) {
    const opaque = new Set(frame.pixels.flatMap((pixel, i) => pixel >>> 24 > 127 ? [i] : []));
    const visited = new Set<number>();
    const queue = [opaque.values().next().value!];
    while (queue.length) {
      const i = queue.pop()!;
      if (visited.has(i) || !opaque.has(i)) continue;
      visited.add(i);
      const x = i % frame.size, y = Math.floor(i / frame.size);
      if (x > 0) queue.push(i - 1);
      if (x + 1 < frame.size) queue.push(i + 1);
      if (y > 0) queue.push(i - frame.size);
      if (y + 1 < frame.size) queue.push(i + frame.size);
    }
    assert.equal(visited.size, opaque.size, `${name} ${frame.size}: connected silhouette`);
    const row = Math.floor(40 * frame.size / 48);
    const wrist = Array.from({ length: frame.size }, (_, x) => x)
      .filter(x => opaque.has(row * frame.size + x));
    assert(wrist.length >= Math.floor(10 * frame.size / 48), `${name}: substantial wrist`);
    assert.equal(wrist.at(-1)! - wrist[0] + 1, wrist.length, `${name}: plain wrist without teeth`);
    for (const y of [28, 32, 35]) {
      const width = Array.from({ length: frame.size }, (_, x) => x)
        .filter(x => opaque.has(Math.floor(y * frame.size / 48) * frame.size + x)).length;
      assert(width >= Math.floor(13 * frame.size / 48), `${name}: palm has height and volume`);
    }
  }
}
for (const [alias, target] of Object.entries({
  hand2: "pointer", openhand: "grab", closedhand: "grabbing", "dnd-move": "grabbing",
})) {
  assert.equal(await readlink(new URL(alias, root)), target, `${alias}: correct interaction state`);
}
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isSymbolicLink()) continue;
  assert(names.includes(await readlink(new URL(entry.name, root))), `${entry.name}: valid alias`);
}

// Optional contact sheet renders the actual binary pixels over light and dark surfaces.
if (process.argv[2]) {
  const cells: string[] = [];
  names.forEach((name, row) => {
    cells.push(`<text x="12" y="${row * 112 + 28}" fill="#888">${name}</text>`);
    frames.get(name)!.forEach(({ size, pixels }, column) => {
      for (let background = 0; background < 2; background++) {
        const x = 120 + column * 224 + background * 108, y = row * 112;
        cells.push(`<rect x="${x}" y="${y}" width="104" height="104" fill="${background ? "#eeeeee" : "#101111"}"/>`);
        pixels.forEach((pixel, i) => {
          const alpha = pixel >>> 24;
          if (!alpha) return;
          const rgb = [16, 8, 0].map(shift => Math.round(((pixel >>> shift) & 255) * 255 / alpha));
          cells.push(`<rect x="${x + 4 + i % size * 2}" y="${y + 4 + Math.floor(i / size) * 2}" width="2" height="2" fill="rgb(${rgb.join(",")})" fill-opacity="${alpha / 255}"/>`);
        });
      }
    });
  });
  await Bun.write(process.argv[2], `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="784"><rect width="800" height="784" fill="#252727"/>${cells.join("")}</svg>`);
}
console.log("Verified 7 cursors × 3 sizes: hotspots, alpha, margins, arrow alignment and aliases.");
