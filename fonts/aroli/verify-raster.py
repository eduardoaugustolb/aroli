"""Optional raster regression: run with Python and Pillow (tested with 12.3.0)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent
def raster(font, char):
    image = Image.new("L", (80, 80))
    ImageDraw.Draw(image).text((10, 50), char, font=font, fill=255, anchor="ls")
    # Ignore faint antialiasing fringes so assertions follow visible ink.
    return image.point(lambda p: 255 if p >= 64 else 0)

for style in ("Regular", "Medium", "SemiBold"):
    for size in (12, 14, 15, 16, 24):
        font = ImageFont.truetype(str(root / "dist" / f"AroliMonoNF-{style}.otf"), size)
        for char in "aehmnouvwxzIHM0123AVWEM":
            bounds = raster(font, char).getbbox()
            assert bounds, (style, size, char, bounds)
            if size == 15:
                # Product size (Zed buffer_font_size): pixel-perfect floor.
                assert bounds[3] == 50, (style, size, char, bounds)
            else:
                assert 49 <= bounds[3] <= 51, (style, size, char, bounds)
        # Punctuation is product-critical at the Zed's 15 px code size. Its
        # visible dots must not collapse below the period or merge into one.
        period = raster(font, ".").getbbox()
        colon = raster(font, ":").getbbox()
        comma = raster(font, ",").getbbox()
        semicolon = raster(font, ";").getbbox()
        assert period and colon and comma and semicolon, (style, size, "missing punctuation")
        assert colon[2] - colon[0] >= period[2] - period[0], (style, size, "colon too thin", period, colon)
        assert colon[3] - colon[1] >= 2 * (period[3] - period[1]), (style, size, "colon dots merged", period, colon)
        assert comma[3] > period[3] and semicolon[3] > period[3], (style, size, "comma tail lost", period, comma, semicolon)
    print(f"{style}: baseline 15px exact, 12/14/16/24px within 1px")
