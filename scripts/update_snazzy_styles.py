import requests
import math
import pandas as pd
import json
import ast
import dirtyjson
import re
import rich
from rich.prompt import Prompt
from tqdm.auto import tqdm


# Empirically, a page size between 1,000 and 2,000 performs similarly. Smaller page sizes tend
# to take longer and larger page sizes (>2048) aren't allowed.
PAGE_SIZE = 1_000
BASE_URL = "https://snazzymaps.com/explore.json"


def count_styles(api_key):
    """Get the total number of styles in the Snazzy Maps collection."""
    r = requests.get(BASE_URL, params={"key": api_key, "pageSize": 1})
    r.raise_for_status()
    
    return int(r.json()["pagination"]["totalItems"])

def download_styles(pages, api_key):
    """Download all styles from Snazzy Maps, one page at a time."""
    styles = []

    for page in tqdm(range(pages), desc="Downloading", unit="page"):
        params = {
            "key": api_key,
            "pageSize": PAGE_SIZE,
            "sort": "recent",
            "page": page + 1
        }

        r = requests.get(BASE_URL, params=params)
        r.raise_for_status()

        styles += r.json()["styles"]
    
    return styles


def clean_json(s):
    """Take a JSON that failed to load, apply cleaning, and return the cleaned, readable string.
    
    This function applies increasingly involved processing to attempt to make the string readable,
    and will return the result of the first successful processing. These techniques (especially the 
    final technique) were written specifically to handle known issues in a few Snazzy Maps styles, 
    and probably won't generalize well to other applications.
    """
    # This pattern captures C-style comments like those included in https://snazzymaps.com/style/17/bright-and-bubbly
    comment_pattern = re.compile(r'''(\/{2}[A-Za-z0-9\-]*)''')
    # This pattern captures whitespace where a comma is missing, separating two properties. 
    missing_comma_pattern = re.compile(r'''([a-zA-Z0-9-"#]+:[a-zA-Z0-9-"#]+)(\s+)''')

    # ast.literal_eval should solve trailing commas.
    try:
        clean = json.dumps(ast.literal_eval(s))
        json.loads(clean)
        return clean
    except (json.JSONDecodeError, ValueError, SyntaxError):
        pass
    
    # dirtyjson should solve missing quotes around properties and trailing commas
    try:
        clean = json.dumps(dirtyjson.loads(s))
        json.loads(clean)
        return clean
    except ValueError:
        pass
    
    # This should solve one style (Bright and Bubbly) that contains C-style comments
    # that need to be removed and a missing comma.
    try:
        cleanish = re.sub(comment_pattern, " ", s)
        # Use a numeric backreference to replace only the missing comma
        cleaner = re.sub(missing_comma_pattern, "\\1,", cleanish)
        clean = json.dumps(ast.literal_eval(cleaner))
        json.loads(clean)
        return clean
    except json.JSONDecodeError:
        pass
    
    raise ValueError(f"{s} could not be decoded!")


def clean_styles(styles):
    """Confirm that every style's JSON can be loaded. If not, apply
    cleaning and swap in the cleaned JSON. If any JSON string cannot be 
    loaded after cleaning, this will fail."""
    cleaned_styles = []
    for style in styles:
        try:
            json.loads(style["json"])
        except json.JSONDecodeError:
            style["json"] = clean_json(style["json"])
            json.loads(style["json"])
        cleaned_styles.append(style)
    
    return cleaned_styles


def save_styles(styles):
    """Save the styles to a CSV for ingestion into Earth Engine."""
    df = pd.json_normalize(styles)

    # Back up a copy of the raw styles
    df.to_csv("snazzy_styles_raw.csv", index=False, sep="\t")

    # Just in case, drop any rows with null styles or urls
    df = df.dropna(subset=["json", "url"])
    # Remove empty styles
    df = df[df.json.ne("[]")]
    # Remove illegal characters. These WILL break asset ingestion into GEE.
    df.json = df.json.str.replace('[\\r\\n\\t\s]', "", regex=True)

    # Merge the tags and colors into one row of comma-separated values
    df["tags"] = (df.tags + df.colors).map(lambda x: ",".join(x))

    df = df[["name", "url", "tags", "json", "views", "favorites"]]
    # Tab-delimiting overcomes some issues that GEE has when you ingest
    # these comma-delimited.
    df.to_csv("snazzy_styles.csv", index=False, sep="\t")


if __name__ == "__main__":
    key = Prompt.ask("Enter your Snazzy Maps API key", password=True)
    
    n = count_styles(key)
    pages = math.ceil(n / PAGE_SIZE)

    rich.print(f"Found {n:,} styles over {pages} pages...")

    styles = download_styles(pages, api_key=key)
    rich.print(f"{len(styles):,} styles successfully downloaded!")

    cleaned = clean_styles(styles)
    rich.print(f"{len(cleaned):,} styles successfully cleaned!")

    save_styles(cleaned)
    rich.print("All styles saved!")
