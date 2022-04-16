import ast
import json
import os
import subprocess
import datetime

import ee
import requests
import rich
from rich.status import Status
from rich.prompt import Confirm

from scripts.update import STYLE_PATH


# Name of the style Feature Collection asset in Earth Engine
STYLE_ASSET = "projects/ee-aazuspan/assets/snazzy/styles"
# Temporary asset names used during ingestion
NEW_STYLE_ASSET = STYLE_ASSET + "_NEW"
OLD_STYLE_ASSET = STYLE_ASSET + "_OLD"


def load_cookies(path):
    """Load the cookies from the cookies JSON file."""
    if not os.path.exists(path):
        raise Exception("GEE cookies not found! `pip install geeup` and follow the guide to set them up: "\
            "https://samapriya.github.io/geeup/projects/cookies_setup/")
    with open(path, "r") as f:
        return json.load(f)


def create_session(cookie_list):
    """Create an authorized Earth Engine session from cookies."""
    session = requests.Session()

    for cookies in cookie_list:
        session.cookies.set(cookies["name"], cookies["value"])

    return session


def get_upload_url(session):
    """Get a URL to post asset data to for uploading to Google Storage."""
    r = session.get("https://code.earthengine.google.com/assets/upload/geturl")
    r.raise_for_status()

    return ast.literal_eval(r.text)["url"]


def upload_to_google_storage(file: str, session) -> str:
    """Upload the style table to Google Storage. From here, it can be ingested as an EE asset. Return the GS path."""
    upload_url = get_upload_url(session)

    with open(file, "rb") as f:
        r = session.post(upload_url, files={"csv_file": f})
        r.raise_for_status()

    gsid = r.json()[0]
    return gsid


def asset_exists(asset_name):
    """Check if an asset exists."""
    try:
        ee.data.getAsset(asset_name)
        return True
    except ee.ee_exception.EEException:
        return False


def upload_asset(file, asset_name):
    """Upload a tab-delimited style CSV to an Earth Engine asset using the CLI.
    
    Adapted from geeup (https://github.com/samapriya/geeup) by Samapriya Roy under Apache-2.0 License.
    """
    cookies = load_cookies("cookie_jar.json")
    session = create_session(cookies)
    gsid = upload_to_google_storage(file, session)

    description = \
        "This table contains all style descriptions from [Snazzy Maps](https://snazzymaps.com/) as of the "\
        "listed end date. Styles are used by the `users/aazuspan/snazzy` module to load basemap styles from Snazzy Map "\
        "URLs. For more details, see the module [on Github](https://github.com/aazuspan/snazzy)."
    start_time = datetime.datetime.utcnow().isoformat()
    end_time = datetime.datetime.utcnow().isoformat()

    commands = [
        f'earthengine upload table {gsid}',
        f'--wait',
        f'--asset_id {asset_name}',
        f'--property "(string)description={description}"',
        f'--time_start {start_time} --time_end {end_time}',
        f'--csv_delimiter "	"'
    ]

    command = " ".join(commands)

    try: 
        with Status(f"Ingesting asset...", spinner="bouncingBar"):
            subprocess.check_output(command, shell=True)
    except subprocess.CalledProcessError as e: 
        raise Exception(f"Error uploading asset: {e.output.decode()}")


def share_asset(asset):
    """
    Set public access to an asset.
    """
    public = json.dumps({"all_users_can_read": True})
    ee.data.setAssetAcl(asset, public)


def is_shared_asset(asset):
    """Verify that an asset has public access."""
    acl = ee.data.getAssetAcl(asset)

    try:
        return acl["all_users_can_read"]
    except KeyError:
        return False


def compare_style_sizes(OLD_STYLE_ASSET, NEW_STYLE_ASSET):
    """Compare the size of the previous and new style collections (in rows and bytes) and print the results."""
    new_num = ee.FeatureCollection(NEW_STYLE_ASSET).size().getInfo()
    old_num = ee.FeatureCollection(OLD_STYLE_ASSET).size().getInfo()

    if new_num > old_num:
        rich.print(f"[cyan]{new_num - old_num} styles were added.[/]")
    elif new_num < old_num:
        rich.print(f"[red]{old_num - new_num} styles were removed.[/]")
    else:
        rich.print("[yellow]No new styles were added.[/]")

    new_bytes = int(ee.data.getAsset(NEW_STYLE_ASSET)["sizeBytes"])
    old_bytes = int(ee.data.getAsset(OLD_STYLE_ASSET)["sizeBytes"])

    if new_bytes > old_bytes:
        rich.print(f"[cyan]Style size increased by {new_bytes - old_bytes} bytes.[/]")
    elif new_bytes < old_bytes:
        rich.print(f"[red]Style size decreased by {old_bytes - new_bytes} bytes.[/]")
    else:
        rich.print("[yellow]Style size did not change.[/]")

    
def rename_asset(asset, new_name):
    """Rename an asset in Earth Engine and print a notification."""
    rich.print(f"[yellow]Renaming '{asset}' to '{new_name}'...[/]")
    ee.data.renameAsset(asset, new_name)


def delete_asset(asset):
    """Delete an asset in Earth Engine and print a notification."""
    rich.print(f"[yellow]Deleting '{asset}'...[/]")    
    ee.data.deleteAsset(asset)


def main():
    """This script uploads a new Snazzy styles table to an Earth Engine asset and removes the old styles."""
    ee.Initialize()

    if asset_exists(NEW_STYLE_ASSET):
        if Confirm.ask(f"[red]Asset '{NEW_STYLE_ASSET}' already exists. Overwrite?[/]"):
            delete_asset(NEW_STYLE_ASSET)
        else:
            rich.print("[red]Aborting...[/]")
            return

    rich.print(f"\n[yellow]Uploading '{STYLE_PATH}' to '{NEW_STYLE_ASSET}'...[/]")
    upload_asset(file=STYLE_PATH, asset_name=NEW_STYLE_ASSET)
    
    rich.print("\n[green]Styles successfully ingested![/]")

    if asset_exists(STYLE_ASSET):
        compare_style_sizes(OLD_STYLE_ASSET=STYLE_ASSET, NEW_STYLE_ASSET=NEW_STYLE_ASSET)

        if Confirm.ask("\n[red]Rename styles?[/] This will make the new styles active. If not, styles will be reset."):
            rename_asset(STYLE_ASSET, OLD_STYLE_ASSET)
            rename_asset(NEW_STYLE_ASSET, STYLE_ASSET)
        else:
            delete_asset(NEW_STYLE_ASSET)
            rich.print("[red bold]Aborting![/] New styles have been deleted.")
            return

        if Confirm.ask(f"\n[red bold]Delete old styles?[/] If not, styles will be reset."):
            delete_asset(OLD_STYLE_ASSET)
        else:
            rename_asset(STYLE_ASSET, NEW_STYLE_ASSET)
            rename_asset(OLD_STYLE_ASSET, STYLE_ASSET)
            delete_asset(NEW_STYLE_ASSET)
            rich.print("[red bold]Aborting![/] New styles have been deleted and old styles have been reactivated.")
            return
        
        share_asset(STYLE_ASSET)
        rich.print("\n[green]Styles successfully updated![/]")

    # The first time styles are updated, there are no old styles to rename and delete.
    else:
        rename_asset(NEW_STYLE_ASSET, STYLE_ASSET)
        share_asset(STYLE_ASSET)
        rich.print("\n[green]No old styles exist. New styles successfully uploaded![/]")
    
    if not is_shared_asset(STYLE_ASSET):
        raise Exception(f"Asset '{STYLE_ASSET}' does not have public access!")

if __name__ == "__main__":
    main()