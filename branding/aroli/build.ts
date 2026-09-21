import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import opentype from "../../fonts/aroli/node_modules/opentype.js";
import { BODY, PIECE, mark } from "./geometry";

const root = resolve(import.meta.dir, "../..");
const write = (path: string, value: string) => {
  const p = resolve(root, path);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, value);
};
const svg = (
  w: number,
  h: number,
  content: string,
  title = "Aroli — Encaixe",
) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${title}</title>${content}</svg>\n`;
const bytes = readFileSync(resolve(root, "fonts/aroli-sans/dist/AroliSans-Medium.otf"));
const font = opentype.parse(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
);
const text = (
  s: string,
  x: number,
  y: number,
  size: number,
  fill = "#C5C7C5",
) => {
  const fields: Record<string, string[]> = {
    M: ["x", "y"],
    L: ["x", "y"],
    Q: ["x1", "y1", "x", "y"],
    C: ["x1", "y1", "x2", "y2", "x", "y"],
    Z: [],
  };
  const d = font
    .getPath(s, x, y, size)
    .commands.map(
      (c: any) =>
        c.type +
        (fields[c.type] ?? [])
          .map((k) => {
            const n = Number(c[k]);
            if (!Number.isFinite(n))
              throw new Error(`Invalid text outline: ${s}`);
            return String(Math.round(n * 1000) / 1000);
          })
          .join(" "),
    )
    .join(" ");
  return `<path fill="${fill}" d="${d}"/>`;
};
const symbol = svg(192, 192, mark());
const avatar = svg(
  512,
  512,
  `<rect width="512" height="512" rx="112" fill="#101111"/><g transform="translate(64 64) scale(2)">${mark()}</g>`,
);
write("branding/aroli/logo/aroli-symbol.svg", symbol);
write(
  "branding/aroli/logo/aroli-symbol-black.svg",
  svg(192, 192, mark("#050505")),
);
write("branding/aroli/logo/aroli-avatar.svg", avatar);
write(
  "branding/aroli/logo/aroli-wordmark.svg",
  svg(360, 104, text("Aroli", 4, 83, 108), "Aroli — assinatura"),
);
write(
  "branding/aroli/logo/aroli-lockup.svg",
  svg(
    420,
    120,
    `<g transform="translate(0 0) scale(.625)">${mark()}</g>${text("Aroli", 134, 92, 105)}`,
  ),
);
write(
  "web/app/icon.svg",
  svg(
    192,
    192,
    `<rect width="192" height="192" rx="42" fill="#101111"/>${mark()}`,
  ),
);
write("web/public/aroli-symbol.svg", symbol);
write(
  "web/public/aroli-lockup.svg",
  svg(
    420,
    120,
    `<g transform="scale(.625)">${mark()}</g>${text("Aroli", 134, 92, 105)}`,
  ),
);
// No logo/name/slogan: the negative interval is the recognition asset.
const wallpaper = (background = "#050505") =>
  svg(
    3840,
    2160,
    `<rect width="3840" height="2160" fill="${background}"/><path d="M2780 0H3840V1140C3390 965 3010 755 2760 410C2670 280 2670 100 2780 0Z" fill="#191C1C"/><path d="M1680 2160C1490 1710 1810 1270 2190 970C2420 790 2630 775 2840 905C3200 1130 3500 1260 3840 1370V2160Z" fill="#101111"/><path d="M1680 2160C1490 1710 1810 1270 2190 970C2420 790 2630 775 2840 905C3200 1130 3500 1260 3840 1370" fill="none" stroke="#252727" stroke-width="3"/>`,
    "Aroli Backdrops — Encaixe",
  );
write("branding/aroli/applications/wallpaper.svg", wallpaper());
write("wallpapers/aroli-encaixe.svg", wallpaper());
write("web/public/aroli-backdrop.svg", wallpaper());
for (const variant of ["umbra", "umbra-ink"]) {
  write(
    `themes/chrome/${variant}/images/theme_ntp_background.svg`,
    wallpaper(variant === "umbra" ? "#101111" : "#050505"),
  );
  write(`themes/chrome/${variant}/store/icon.svg`, avatar);
  write(
    `themes/chrome/${variant}/store/promo-small.svg`,
    svg(
      440,
      280,
      `<rect width="440" height="280" fill="#101111"/><g transform="translate(164 20) scale(.6)">${mark()}</g>${text("Aroli", 143, 207, 60)}${text(variant === "umbra" ? "Dark for Chrome" : "Black for Chrome", 133, 246, 22)}`,
    ),
  );
}
write(
  "themes/jetbrains/aroli/src/main/resources/META-INF/pluginIcon.svg",
  svg(40, 40, `<g transform="scale(.2083333)">${mark()}</g>`),
);
// Human-readable review board, lettering outlined using original Aroli Sans.
const panel = (x: number, y: number, label: string, content: string) =>
  `<g transform="translate(${x} ${y})"><rect width="480" height="400" rx="16" fill="#101111"/>${text(label, 24, 38, 18, "#858A89")}${content}</g>`;
const frames = [0, 1, 2]
  .map(
    (n) =>
      `<g transform="translate(${26 + n * 150} 115) scale(.7)"><path fill="#C5C7C5" d="${BODY}"/><path fill="#C5C7C5" transform="translate(${12 - n * 6} ${-12 + n * 6})" d="${PIECE}"/></g>${text(["0 ms", "140 ms", "280 ms"][n], 40 + n * 150, 292, 18)}`,
  )
  .join("");
const tiles = [
  panel(
    24,
    100,
    "01 / Assinatura",
    `<g transform="translate(145 64)">${mark()}</g>${text("Aroli", 137, 315, 80)}${text("Tudo encontra seu lugar.", 107, 361, 23)}`,
  ),
  panel(
    520,
    100,
    "02 / Símbolo",
    `<g transform="translate(155 66)">${mark()}</g><rect x="98" y="282" width="78" height="78" rx="18" fill="#C5C7C5"/><g transform="translate(101 285) scale(.375)">${mark("#050505")}</g><g transform="translate(285 285) scale(.375)">${mark()}</g>`,
  ),
  panel(
    1016,
    100,
    "03 / Família",
    ["Themes", "Mono", "Pointer", "Backdrops"]
      .map((s, i) => text("Aroli " + s, 30, 115 + i * 72, 42))
      .join(""),
  ),
  panel(
    24,
    516,
    "04 / Tipografia",
    text("Aroli Sans", 28, 112, 54) +
      text("Aa Bb Cc 0123456789", 28, 177, 34) +
      text("Precisão em cada detalhe.", 28, 232, 29) +
      text("Aroli Mono / código", 28, 324, 27) +
      text("Uma família. Um ambiente.", 28, 363, 22, "#858A89"),
  ),
  panel(
    520,
    516,
    "05 / Sem assinatura",
    `<svg x="20" y="75" width="440" height="292" viewBox="0 0 3840 2160" preserveAspectRatio="xMidYMid slice">${wallpaper()
      .replace(/^.*?<title>.*?<\/title>/s, "")
      .replace("</svg>", "")}</svg>`,
  ),
  panel(
    1016,
    516,
    "06 / Movimento",
    frames + text("Acomodar. Alinhar. Permanecer.", 28, 362, 24),
  ),
].join("");
write(
  "branding/aroli/system.svg",
  svg(
    1520,
    940,
    `<rect width="1520" height="940" fill="#050505"/>${text("Aroli", 24, 65, 45)}${text("Sistema visual / 2026", 1110, 58, 26, "#858A89")}${tiles}`,
    "Aroli — sistema de identidade",
  ),
);
write(
  "branding/aroli/stress.svg",
  svg(
    1200,
    480,
    `<defs><filter id="blur"><feGaussianBlur stdDeviation="4"/></filter></defs><rect width="1200" height="480" fill="#050505"/>${text("Aroli / provas de reprodução", 28, 48, 30)}${[16, 24, 32, 64, 128].map((s, i) => `<g transform="translate(${40 + i * 150} 125) scale(${s / 192})">${mark()}</g>${text(s + " px", 40 + i * 150, 300, 20)}`).join("")}<g transform="translate(850 85)" filter="url(#blur)">${mark()}</g>${text("Desfoque", 880, 300, 20)}<rect x="30" y="350" width="1120" height="95" rx="12" fill="#C5C7C5"/><g transform="translate(45 356) scale(.42)">${mark("#050505")}</g>${text("Mesma silhueta. Uma cor. Duas peças.", 160, 413, 32, "#050505")}`,
  ),
);
write(
  "branding/aroli/applications/competitor-swap.svg",
  svg(
    900,
    520,
    `<rect width="900" height="520" fill="#050505"/><g transform="translate(630 70) scale(1.5)">${mark("#252727")}</g>${text("Nord", 45, 260, 80)}${text("Teste de troca — não é uma aplicação oficial", 45, 460, 24, "#858A89")}`,
  ),
);
const render = (source: string, target: string, w: number, h?: number) => {
  mkdirSync(dirname(resolve(root, target)), { recursive: true });
  const r = Bun.spawnSync(
    [
      "rsvg-convert",
      "-w",
      String(w),
      ...(h ? ["-h", String(h)] : []),
      resolve(root, source),
      "-o",
      resolve(root, target),
    ],
    { stderr: "inherit" },
  );
  if (r.exitCode) throw new Error(`Render failed: ${source}`);
};
render(
  "branding/aroli/logo/aroli-avatar.svg",
  "branding/aroli/exports/aroli-avatar-512.png",
  512,
);
copyFileSync(
  resolve(root, "branding/aroli/exports/aroli-avatar-512.png"),
  resolve(root, "web/public/aroli-avatar-512.png"),
);
render(
  "branding/aroli/logo/aroli-avatar.svg",
  "themes/vscode/aroli/icon.png",
  256,
);
render(
  "branding/aroli/system.svg",
  "branding/aroli/exports/aroli-system.png",
  1520,
);
render(
  "branding/aroli/stress.svg",
  "branding/aroli/exports/aroli-stress.png",
  1200,
);
render(
  "branding/aroli/applications/wallpaper.svg",
  "wallpapers/aroli-encaixe.png",
  3840,
);
for (const variant of ["umbra", "umbra-ink"]) {
  render(
    `themes/chrome/${variant}/images/theme_ntp_background.svg`,
    `themes/chrome/${variant}/images/theme_ntp_background.png`,
    1920,
    1080,
  );
  render(
    `themes/chrome/${variant}/store/icon.svg`,
    `themes/chrome/${variant}/store/icon-128.png`,
    128,
  );
  render(
    `themes/chrome/${variant}/store/promo-small.svg`,
    `themes/chrome/${variant}/store/promo-small-440x280.png`,
    440,
  );
}
console.log(
  "Aroli vector masters, outlined signatures, production assets and review boards generated.",
);
