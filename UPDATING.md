# Updating Snazzy Styles

If new styles are added to Snazzy Maps, the style feature collection will need to be manually updated. Follow these steps to rebuild and ingest the new styles safely.

Note: This guide is just a reference for the maintainer of `snazzy` or users looking to set up a fully independent clone.


1. Run `python scripts/update_snazzy_styles.py` to download all styles and save as `snazzy_styles.csv`. 
2. Upload `snazzy_styles.csv` to Earth Engine as a new asset named `snazzy_styles_update`. Remember to set the `CSV Delimeter` option to a tab and enter the current time as the `system:end_time`. Copy the description text from the original `snazzy_styles`.
3. Update the `snazzy:styles` script to use the updated asset.
4. Test a number of styles to ensure the new asset is properly formatted and working. 
5. Rename the old `snazzy_styles` collection to `snazzy_styles_old`. Rename the new `snazzy_styles_update` collection to `snazzy_styles` to replace it. 
6. Revert the `snazzy:styles` script to use the new renamed collection. 
7. Re-test and delete `snazzy_styles_old`.