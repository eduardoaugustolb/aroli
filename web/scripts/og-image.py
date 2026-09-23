"""Aroli OG image generator (1200x630).

Composes the brand lockup from repository sources only and rasterizes with
rsvg-convert under an isolated Fontconfig (no user-installed fonts needed):

- Backdrop shapes: web/public/aroli-backdrop.svg (paths copied below)
- Encaixe mark: branding/aroli/geometry.ts BODY + PIECE (paths copied below)
- Type: fonts/aroli-sans/dist + fonts/aroli/dist (Aroli Sans + Aroli Mono NF)
- Palette: web/app/styles/base.css --ink/--bone/--muted/--line

Output: web/app/opengraph-image.png (+ .alt.txt), wired automatically by the
Next.js opengraph-image file convention. Re-run after brand changes:

    python3 web/scripts/og-image.py
"""

import os
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SANS = ROOT / "fonts/aroli-sans/dist"
MONO = ROOT / "fonts/aroli/dist"
OUT = ROOT / "web/app/opengraph-image.png"
ALT = ROOT / "web/app/opengraph-image.alt.txt"

INK, BONE, MUTED, LINE = "#050505", "#C5C7C5", "#858A89", "#252727"

# branding/aroli/geometry.ts — the production Encaixe master.
BODY = "M96 40 C100 40 102 43 102 49 C102 77 122 95 148 96 C155 96 157 101 156 109 C150 146 126 160 91 160 C53 160 26 137 26 102 C26 68 54 42 88 40 Z"
PIECE = "M122 25 C144 30 164 49 169 70 C171 80 162 87 153 82 C147 68 133 54 116 49 C107 46 106 39 110 32 C113 27 118 24 122 25 Z"

# web/public/aroli-backdrop.svg dá a linguagem (planos + fio), mas o fundo aqui é
# plano: DESIGN.md pede intervalo com espaço negativo legível, sem repetir o
# logo no fundo. Um único arco complementar carrega o gesto; a marca aparece
# uma vez, íntegra e com área livre no canto superior direito.
ACCENT = '<circle cx="1060" cy="930" r="430" fill="none" stroke="#252727" stroke-width="2"/>'

SVG = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="{INK}"/>
{ACCENT}
<rect x="20" y="20" width="1160" height="590" fill="none" stroke="{LINE}" stroke-width="2"/>
<g transform="translate(988,88) scale(0.81)" fill="{BONE}"><path d="{BODY}"/><path d="{PIECE}"/></g>
<text x="96" y="152" font-family="Aroli Mono NF" font-size="25" letter-spacing="6" fill="{MUTED}">AROLI THEMES</text>
<text x="96" y="312" font-family="Aroli Sans" font-weight="600" font-size="104" fill="{BONE}">Tudo encontra</text>
<text x="96" y="422" font-family="Aroli Sans" font-weight="600" font-size="104" fill="{BONE}">seu lugar.</text>
<text x="96" y="484" font-family="Aroli Sans" font-size="31" fill="{MUTED}">Temas escuros para VS Code, Zed, Kitty e Starship.</text>
<text x="96" y="552" font-family="Aroli Mono NF" font-size="22" letter-spacing="3" fill="{MUTED}">VS CODE <tspan fill="{BONE}">·</tspan> ZED <tspan fill="{BONE}">·</tspan> KITTY <tspan fill="{BONE}">·</tspan> STARSHIP</text>
</svg>
"""

ALT_TEXT = "Aroli — Tudo encontra seu lugar. Temas escuros para VS Code, Zed, Kitty e Starship."


def main() -> None:
    for name in ("AroliSans-Regular.otf", "AroliSans-SemiBold.otf"):
        assert (SANS / name).exists(), f"missing {name}; build fonts/aroli-sans first"
    assert (MONO / "AroliMonoNF-Regular.otf").exists(), "missing Mono NF; build fonts/aroli first"
    tmp = Path(tempfile.mkdtemp(prefix="aroli-og-"))
    try:
        for src in (SANS / "AroliSans-Regular.otf", SANS / "AroliSans-SemiBold.otf",
                    MONO / "AroliMonoNF-Regular.otf"):
            shutil.copy(src, tmp / src.name)
        (tmp / "fonts.conf").write_text(
            '<?xml version="1.0"?><fontconfig><dir>' + str(tmp) +
            "</dir><cachedir>" + str(tmp / "cache") + "</cachedir></fontconfig>")
        svg_path = tmp / "og.svg"
        svg_path.write_text(SVG)
        env = {**os.environ, "FONTCONFIG_FILE": str(tmp / "fonts.conf")}
        r = subprocess.run(["rsvg-convert", "-w", "1200", "-h", "630",
                            "-o", str(OUT), str(svg_path)],
                           capture_output=True, text=True, env=env)
        if r.returncode != 0:
            raise RuntimeError(f"rsvg-convert failed: {r.stderr}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    ALT.write_text(ALT_TEXT)
    size = OUT.stat().st_size
    assert size < 8 * 1024 * 1024, f"og image {size} exceeds 8MB limit"
    print(f"Wrote {OUT} ({size // 1024}KB) + {ALT.name}")


if __name__ == "__main__":
    main()
