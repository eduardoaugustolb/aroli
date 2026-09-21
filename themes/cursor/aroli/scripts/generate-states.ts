// Bone is the visible body; Charcoal defines its outer boundary, as in the hands.
const root = new URL("../src/", import.meta.url);
const bone = "#C5C7C5";
const charcoal = "#101111";
const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">\n${body}\n</svg>\n`;
const solid = (body: string) => `<g fill="${bone}" stroke="${charcoal}" stroke-width="2.5" stroke-linejoin="round">${body}</g>`;
// Open precision shapes need a light core, bounded by one dark outline.
const line = (body: string, width = 3) => `<g fill="none" stroke-linejoin="round" stroke-linecap="round"><g stroke="${charcoal}" stroke-width="${width + 2.5}">${body}</g><g stroke="${bone}" stroke-width="${width}">${body}</g></g>`;
const arrow = (rotation = 0) => solid(`<path transform="rotate(${rotation} 24 24)" d="M24 6 34 17H28V36H20V17H14Z"/>`);
const doubleArrow = (rotation = 0) => solid(`<path transform="rotate(${rotation} 24 24)" d="M6 24 16 14V20H32V14L42 24 32 34V28H16V34Z"/>`);
// Reuse the exact documented pointer arrow, including its boundary treatment.
const baseArrow = (await Bun.file(new URL("arrow.svg", root)).text()).replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const badge = (body: string) => `<g transform="translate(36 35)"><circle r="9" fill="${bone}" stroke="${charcoal}" stroke-width="2"/><g fill="none" stroke="${charcoal}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></g>`;
// Clockwise arc, ending beneath a filled head tangent to the circle at -45°.
// Head base centered at (2.828,-2.828), tip (4.242,-1.414): direction (1,1).
// The entire symbol, including the arc stroke, fits the 6.25-unit envelope.
const progressSymbol = `<path d="M2.828 2.828A4 4 0 1 1 2.828-2.828"/><path d="M4.242-1.414 1.555-1.555 4.101-4.101Z" fill="${charcoal}" stroke="none"/>`;
const states: Record<string, string> = {
  "all-scroll": svg(solid(`<path d="M24 5 31 13H27V21H35V17L43 24 35 31V27H27V35H31L24 43 17 35H21V27H13V31L5 24 13 17V21H21V13H17Z"/>`)),
  cell: svg(line(`<path d="M24 7V17M24 31V41M7 24H17M31 24H41"/>`) + solid(`<rect x="17" y="17" width="14" height="14" rx="2"/>`)),
  "col-resize": svg(doubleArrow()),
  "context-menu": svg(baseArrow + badge(`<path d="M-3-4H3M-3 0H3M-3 4H3"/>`)),
  crosshair: svg(line(`<circle cx="24" cy="24" r="7"/><path d="M24 6V13M24 35V42M6 24H13M35 24H42"/>`)),
  "ew-resize": svg(doubleArrow()),
  "ns-resize": svg(doubleArrow(90)),
  "row-resize": svg(doubleArrow(90)),
  text: svg(line(`<path d="M16 8H32M24 8V40M16 40H32"/>`, 3.5)),
  help: svg(solid(`<circle cx="24" cy="24" r="17"/>`) + `<path d="M19 18C19 11 30 11 30 18C30 23 24 23 24 28M24 34V35" fill="none" stroke="${charcoal}" stroke-width="3" stroke-linecap="round"/>`),
  wait: svg(solid(`<path d="M15 7H33V12C33 17 29 20 26 24C29 28 33 31 33 36V41H15V36C15 31 19 28 22 24C19 20 15 17 15 12Z"/>`) + `<path d="M19 12H29L24 19ZM19 37 24 30 29 37Z" fill="${charcoal}"/>`),
  progress: svg(baseArrow + badge(progressSymbol)),
  "zoom-in": svg(line(`<path d="M30 30 40 40"/>`, 5) + solid(`<circle cx="21" cy="21" r="12"/>`) + `<path d="M21 15V27M15 21H27" stroke="${charcoal}" stroke-width="2.5" stroke-linecap="round"/>`),
  "zoom-out": svg(line(`<path d="M30 30 40 40"/>`, 5) + solid(`<circle cx="21" cy="21" r="12"/>`) + `<path d="M15 21H27" stroke="${charcoal}" stroke-width="2.5" stroke-linecap="round"/>`),
  none: svg(""),
};
for (const [name, rotation] of Object.entries({ "e-resize": 90, "n-resize": 0, "ne-resize": 45, "nw-resize": -45, "s-resize": 180, "se-resize": 135, "sw-resize": -135, "w-resize": -90 })) states[name] = svg(arrow(rotation));
for (const [name, rotation] of Object.entries({ "nesw-resize": -45, "nwse-resize": 45 })) states[name] = svg(doubleArrow(rotation));
// Functional activity: 24 frames / 50 ms. The pointer and badge stay fixed.
for (const name of ["wait", "progress"]) {
  const inner = states[name].replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const frames: string[] = [];
  for (let frame = 0; frame < 24; frame++) {
    const angle = frame * (name === "wait" ? 180 : 360) / 24;
    const body = name === "wait"
      ? `<g transform="rotate(${angle} 24 24)">${inner}</g>`
      : baseArrow + badge(`<g transform="rotate(${angle})">${progressSymbol}</g>`);
    states[`frames/${name}-${String(frame).padStart(2, "0")}`] = svg(body);
    frames.push(`<g class="frame f${frame}">${body}</g>`);
  }
  const rules = frames.map((_, i) => `.f${i}{animation:f${i} 1200ms steps(1,end) infinite}@keyframes f${i}{0%{visibility:${i === 0 ? "visible" : "hidden"}}${i ? i * 100 / 24 + "%{visibility:visible}" : ""}${(i + 1) * 100 / 24}%{visibility:hidden}100%{visibility:hidden}}`).join("");
  states[`animated/${name}`] = svg(`<style>.frame{visibility:hidden}${rules}@media(prefers-reduced-motion:reduce){.frame{animation:none}.f0{visibility:visible}}</style>${frames.join("")}`);
}
for (const [name, source] of Object.entries(states)) {
  const file = new URL(`${name}.svg`, root);
  if (process.argv.includes("--check")) {
    if (await Bun.file(file).text() !== source) throw new Error(`${name}: generated SVG is stale; run make states`);
  } else await Bun.write(file, source);
}
