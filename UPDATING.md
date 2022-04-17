# Updating Snazzy Styles

If new styles are added to Snazzy Maps, the style feature collection will need to be manually updated. Follow these steps to rebuild and ingest the new styles safely.

Note: This guide is just a reference for the maintainer of `snazzy` or users looking to set up a fully independent clone.

1. `pip install -r scripts/requirements.txt` to install script dependencies.
2. `python -m scripts.update` to download all styles from Snazzy Maps to a local CSV (data/snazzy_styles.csv).
3. `python -m scripts.ingest` to upload the new styles to an Earth Engine asset. The script will walk you through the process of replacing the old styles.
4. Run `snazzy:tests/test` in the code editor and confirm that all tests pass.