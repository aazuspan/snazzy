"""
This script encodes SVG icons from Font Awesome to data URLs in a CSV that can be 
ingested into a Feature Collection. Before running, clone the Font Awesome repository
and place the SVG files in an `svgs` directory.
"""

import base64
from pathlib import Path

import cairosvg
import pandas as pd


def encode_svg_to_url(svg_path: Path, size: int) -> str:
    png_bytes = cairosvg.svg2png(url=svg_path.as_posix(), output_height=size, output_width=size)
    encoded_url = base64.b64encode(png_bytes).decode("utf-8")
    return f"data:image/png;base64,{encoded_url}"


def svg_to_row(svg_path: Path, size: int) -> dict:
    category = svg_path.parent.name
    name = f"fa-{svg_path.stem}"
    encoded_url = encode_svg_to_url(svg_path, size)
    return {"id": name, "category": category, "size": size, "url": encoded_url}


if __name__ == "__main__":
    svgs = Path("svgs").rglob("*.svg")
    sizes = [16, 24, 32, 48, 64]

    encoded_urls = pd.DataFrame([svg_to_row(svg, size) for svg in svgs for size in sizes])
    encoded_urls.to_csv("encoded_urls.csv", index=False)