const root = new URL("../", import.meta.url);
const states = [
  ["arrow", "NORMAL"], ["hover", "HOVER"], ["grabbing", "DRAG · FECHADA"],
  ["grab", "DROP / GRAB · ABERTA"], ["copy", "COPIAR"],
  ["alias", "LINK"], ["no-drop", "BLOQUEADO"],
];
for (const name of ["all-scroll", "cell", "col-resize", "context-menu", "crosshair", "e-resize", "ew-resize", "help", "n-resize", "ne-resize", "nesw-resize", "none", "ns-resize", "nw-resize", "nwse-resize", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize", "zoom-in", "zoom-out"]) states.push([name, name.toUpperCase()]);
const height = 300 + Math.ceil(states.length / 4) * 250 + 100;
const cards = await Promise.all(states.map(async ([name, label], index) => {
  const source = await Bun.file(new URL(`src/${name}.svg`, root)).text();
  const inner = source.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const x = 88 + index % 4 * 320, y = 300 + Math.floor(index / 4) * 250;
  return `<g transform="translate(${x} ${y})">
    <rect width="296" height="220" fill="#101111" stroke="#3B4242" stroke-width="2"/>
    <g transform="translate(76 16) scale(3)">${inner}</g>
    <text x="20" y="196" fill="#AEB9BC" font-size="16" font-weight="700" letter-spacing="1">${label}${["wait", "progress"].includes(name) ? " · ANIMADO" : ""}</text>
  </g>`;
}));
await Bun.write(new URL("preview.svg", root), `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="${height}" viewBox="0 0 1440 ${height}" role="img" aria-labelledby="title description">
  <title id="title">Umbra Cursor</title>
  <desc id="description">Catálogo completo dos 32 estados: interação, precisão, redimensionamento e utilitários.</desc>
  <rect width="1440" height="${height}" fill="#050505"/>
  <g font-family="DejaVu Sans, sans-serif">
    <text x="88" y="80" fill="#AEB9BC" font-size="18" font-weight="700" letter-spacing="5">UMBRA / CURSOR</text>
    <text x="88" y="163" fill="#C5C7C5" font-size="52" font-weight="700">Um gesto claro para cada intenção.</text>
    <text x="88" y="222" fill="#858A89" font-size="22">Precisão ao apontar. Mão fechada ao arrastar, aberta ao soltar.</text>
    ${cards.join("\n")}
    <path d="M88 ${height - 84}H1352" stroke="#252727" stroke-width="2"/>
    <text x="88" y="${height - 42}" fill="#858A89" font-size="15" letter-spacing="3">LINUX XCURSOR · 24 / 32 / 48 PX</text>
  </g>
</svg>\n`);
