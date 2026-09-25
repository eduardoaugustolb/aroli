"""FontTools finishing stage, invoked by the Bun build (not a second build entrypoint)."""
import subprocess
import sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps

filename, style, stroke = sys.argv[1:]
weight = {"Regular": 400, "Medium": 500, "SemiBold": 600}[style]
font = TTFont(filename)
# Only original text: preserve the external Nerd Font outlines.
text = [name for name in font.getGlyphOrder() if not name.startswith("nf")]
removeOverlaps(font, glyphNames=text)
font["OS/2"].usWeightClass = weight
font["OS/2"].fsSelection = 64 if weight == 400 else 0
font["head"].macStyle = 0
font["head"].fontRevision = 0.905
font["post"].isFixedPitch = 1
family = "Aroli Mono NF"
names = {1: family if style == "Regular" else f"{family} {style}",
         2: "Regular", 4: f"{family} {style}", 5: "Version 0.905",
         6: f"AroliMonoNF-{style}", 16: family, 17: style}
for platform, encoding, language in [(3, 1, 0x409), (1, 0, 0)]:
    for key, value in names.items():
        font["name"].setName(value, key, platform, encoding, language)
top = font["CFF "].cff.topDictIndex[0]
top.isFixedPitch = True
top.Weight = style
private = top.Private
# Alignment zones surround the actual outline extrema, in 2048 UPM.
half = float(stroke) / 2
scale = 2.048
private.BlueValues = [-16, 0, round(520*scale), round(528*scale),
                      round(700*scale), round(708*scale)]
private.OtherBlues = [round(-213*scale), round(-205*scale)]
private.StdHW = round(float(stroke)*scale)
private.StdVW = round(float(stroke)*scale)
font.save(filename)
hint = subprocess.run([sys.executable, "-m", "psautohint", "--glyphs",
                       ",".join(text), filename], check=True, capture_output=True, text=True)
if "ERROR:" in hint.stderr:
    raise RuntimeError(hint.stderr)
# A release build must contain actual hints, not just a configured rasterizer.
# Baseline floor is product-critical: every flat-bottomed text glyph must carry
# a horizontal hint so rasterizers snap the floor instead of drifting 1px.
font = TTFont(filename)
charstrings = font["CFF "].cff.topDictIndex[0].CharStrings
for name in ["uni0049", "uni0069", "uni006C", "uni006E", "uni006D",
             "uni0030", "uni006F", "uni0065", "uni0048", "uni0045"]:
    charstring = charstrings[name]
    charstring.decompile()
    assert any(op in charstring.program for op in
               ["hstem", "vstem", "hstemhm", "vstemhm"]), f"Missing hints: {name}"
assert font["OS/2"].usWeightClass == weight
print(f"Finished {style}: merged text contours, weight {weight}, CFF stem hints")
