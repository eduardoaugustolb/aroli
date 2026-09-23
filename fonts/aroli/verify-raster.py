"""Optional raster regression: run with Python and Pillow (tested with 12.3.0)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent
for style in ("Regular", "Medium", "SemiBold"):
    for size in (12, 14, 15, 16, 24):
        font = ImageFont.truetype(str(root / "dist" / f"AroliMonoNF-{style}.otf"), size)
        for char in "aehmnouvwxzIHM0123AVWEM":
            image = Image.new("L", (80, 80))
            ImageDraw.Draw(image).text((10, 50), char, font=font, fill=255, anchor="ls")
            # Ignore very faint antialiasing fringes; test the visible baseline.
            bounds = image.point(lambda p: 255 if p >= 64 else 0).getbbox()
            assert bounds, (style, size, char, bounds)
            if size == 15:
                # Product size (Zed buffer_font_size): pixel-perfect floor.
                assert bounds[3] == 50, (style, size, char, bounds)
            else:
                assert 49 <= bounds[3] <= 51, (style, size, char, bounds)
    print(f"{style}: baseline 15px exact, 12/14/16/24px within 1px")
