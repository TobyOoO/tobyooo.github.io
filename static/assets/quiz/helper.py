#!/usr/bin/env python3
"""
Process all images in raw_images/:

- Accepts: .jpg, .jpeg, .png, .svg
- Converts to PNG
- Resizes to 720p (1280x720) with aspect ratio preserved
- Adds black background (letterboxing)
- Saves to processed_images/ as *_480p.png

Requires:
    pip install pillow cairosvg
"""

import os
import io
from pathlib import Path

from PIL import Image
import cairosvg

# 480p target size
TARGET_SIZE = (854, 480)

RAW_DIR = Path("raw_images")
OUT_DIR = Path("processed_images")

OUT_DIR.mkdir(parents=True, exist_ok=True)

VALID_EXTS = {".jpg", ".jpeg", ".png", ".svg"}


def svg_to_png_bytes(svg_bytes: bytes) -> bytes:
    """Convert SVG bytes to PNG bytes using cairosvg."""
    return cairosvg.svg2png(bytestring=svg_bytes)


def open_image(path: Path) -> Image.Image:
    """
    Open a file as a Pillow Image.
    Handles both raster formats and SVG.
    """
    ext = path.suffix.lower()
    if ext == ".svg":
        print(f"  Detected SVG, converting: {path.name}")
        with path.open("rb") as f:
            svg_bytes = f.read()
        png_bytes = svg_to_png_bytes(svg_bytes)
        img = Image.open(io.BytesIO(png_bytes))
    else:
        img = Image.open(path)

    if img.mode != "RGBA":
        img = img.convert("RGBA")
    return img


def resize_letterbox(img: Image.Image, target_size=TARGET_SIZE) -> Image.Image:
    """
    Resize image to fit inside target_size while preserving aspect ratio.
    Pads with black background if needed (letterboxing).
    """
    target_w, target_h = target_size
    w, h = img.size

    scale = min(target_w / w, target_h / h)
    new_w = int(w * scale)
    new_h = int(h * scale)

    print(f"    Original: {w}x{h} -> Resized: {new_w}x{new_h}")

    resized = img.resize((new_w, new_h), Image.LANCZOS)

    # Black background (RGBA: black, fully opaque)
    background = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 255))

    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    background.paste(resized, (offset_x, offset_y), resized)

    return background


def main():
    if not RAW_DIR.exists():
        print(f"Directory {RAW_DIR} does not exist.")
        return

    files = [p for p in RAW_DIR.iterdir() if p.is_file() and p.suffix.lower() in VALID_EXTS]

    if not files:
        print(f"No JPG/PNG/SVG files found in {RAW_DIR}")
        return

    for path in files:
        print(f"Processing: {path.name}")
        try:
            img = open_image(path)
            img_480p = resize_letterbox(img, TARGET_SIZE)

            out_name = f"{path.stem}.png"
            out_path = OUT_DIR / out_name

            img_480p.save(out_path, format="PNG")
            print(f"  Saved -> {out_path}\n")
        except Exception as e:
            print(f"  ERROR processing {path.name}: {e}\n")


if __name__ == "__main__":
    main()
