import requests
import math
import pandas as pd



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

    for page in range(pages):
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

def save_styles(styles):
    """Save the styles to a CSV for ingestion into Earth Engine."""
    df = pd.json_normalize(styles)[["url", "json"]]
    # Just in case, drop any null rows
    df = df.dropna()
    # Remove empty styles
    df = df[df.json.ne("[]")]
    # Remove illegal characters. These WILL break ingestion into GEE.
    df.json = df.json.str.replace('[\\r\\n\\t\s]', "", regex=True)

    # Tab-delimiting overcomes some issues that GEE has when you ingest
    # these comma-delimited.
    df.to_csv("snazzy_styles.csv", index=False, sep="\t")


if __name__ == "__main__":
    key = input("Enter your Snazzy Maps API key: ")
    n = count_styles(key)
    pages = math.ceil(n / PAGE_SIZE)

    styles = download_styles(pages, api_key=key)
    save_styles(styles)
