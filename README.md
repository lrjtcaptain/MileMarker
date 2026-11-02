# MileMarker Beta 2

This is the working GitHub Pages package, integrated into the navy MileMarker app supplied in `editable_food_database.zip`. Garage, truck drawing, Drive cards, food catalog, favorites and private notes are retained. Beta 2 adds road routing and a new time-based Plan panel. No build or API key is required to try the beta.

## Deploy to GitHub Pages

1. Unzip the package. Upload the **contents** of this folder to the root of your GitHub repository (keep `index.html`, `css/`, `js/`, and `data/` together).
2. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
3. Open `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` after GitHub finishes deployment. HTTPS is required for foreground GPS. All paths are relative, so repository subpaths work.
4. Hard-refresh once if upgrading an existing deployment. Browser data is separate for each site address. Export the old app's backup before changing its URL.

For a local test, open a terminal in the unzipped folder and run `python -m http.server 8000`, then visit `http://localhost:8000`. Opening `index.html` directly with a `file://` URL cannot load the modules and CSV files.

## First trip

Open **PLAN**. The original supplied Plan form is restored, headed **How many hours you got on your clocks?** Its hours-left field, food/diesel/parking rows, presets, origin/destination search and food preferences remain in their original layout. Press its original Find button; Beta 2 road routing runs behind that button. Choose and save routed stops in the original results area.

The only added top-level control is the clear **TRUCK | ROAD TRIP** mode switch. Road Trip adds hotel choices and an opt-in **Show fun stops & museums** checkbox. All routing, data, achievements, navigation preferences and foreground GPS features remain in this package.

Targets mean driving hours. Break durations affect clock ETA separately. Food/diesel can be up to 30 minutes after their target within your driving budget; parking is at or before the target. Route and highway details are expandable below the original form.

In **DRIVE**, the highway summary uses the saved itinerary route. The big mileage/time display counts down to the next planned stop from GPS road progress. **All itinerary stops** exposes every middle stop. **Next direction-correct rest area** checks DOT travel direction, route highway, forward progress, and routed access before offering navigation.

Road Trip mode includes hotels and unknown-truck-access food. Museums and attractions require the **TAKE A BREAK** checkbox. Truck mode excludes unknown truck access. Listing a truck stop does not certify its entrance, clearances, parking availability or legal overnight use.

## Editable master and CSV data

`MileMarker_Data.xlsx` is the editable master. `data/places.csv` is the deployed route planner's authoritative place list. Keep the first row and stable IDs intact. Columns include category, coordinates, truck access, highway/direction, suggested duration, provenance and optional dated diesel price fields.

After editing the workbook, save it and run:

```text
python tools/xlsx_to_csv.py MileMarker_Data.xlsx
```

Upload the updated `data/*.csv` files to GitHub. The exporter uses Python's standard library; no installation is needed. You can also edit UTF-8 CSV files directly with Excel or a text editor. The workbook and CSVs do not automatically sync in the browser. Do not overwrite your edited files with an older ZIP.

Tabs: Places, Anchors, Achievements, Settings, Food sources, Food brands, plus the Guide. `truck_access` is `yes` or `unknown`; categories are `truck_stop`, `food`, `rest_area`, `parking`, `hotel`, `attraction`. Rest directions are `EB`, `WB`, `NB`, `SB`. Do not invent price values. A diesel price is displayed only with a positive value, valid ISO timestamp and HTTPS source. No diesel prices have been populated in this release.

The inherited food browser reads the edited fields for matching food IDs and the Food brands/sources tabs. It retains the original corridor indexing and inherited hours. New regional listings appear in the Beta 2 route directory; the older Stops/Food browser remains a separate compatibility view of the supplied catalog. Use PLAN for routed mileage rather than the compatibility view's old corridor estimates.

`data/legacy.json` holds the extracted original catalog, truck models, permitted-source logo assets, and original corridor geometry. It is outside `index.html`. `js/legacy-*.js` retain the supplied app's functions; `js/core.js`, `routing.js`, and `app.js` own Beta 2. `css/milemarker.css` is the original styling; `css/beta2.css` extends it.

## Sources and coverage

See `DATA_SOURCES.md` and `data/provenance.json`. Starter records include supplied operator listings, DOT rest/parking areas, and regional OSM hotels/museums/attractions. This is not an exhaustive statewide directory. Community listings and DOT layers may lag closures; every record exposes its source and collection date. No live opening hours, diesel feed, parking vacancy or booking inventory is connected.

Routing and city search require internet. Bundled records are available after the page loads, but this release does not install an offline map or promise offline POI coverage. Previously saved road routes restore with their calculation timestamp; recalculate before a new trip.

## Navigation, GPS and privacy

Google Maps, Waze and Apple Maps receive the destination coordinates only when Navigate is pressed. Trucker Path's public coordinate-handoff scheme could not be verified; its option shows/copies the destination for entry and opens its website. No fabricated deep link is used.

GPS starts only when requested and pauses when the page is hidden. Inaccurate, stale, off-route and backward fixes do not advance the countdown. This is foreground progress along a route, not turn-by-turn navigation or background tracking. Actual phone GPS still needs a road test.

Road requests send route coordinates, including a GPS origin when chosen, to the configured OSRM endpoint. City-name search sends the entered name to Open-Meteo (GeoNames). Route plans, badges and preferences are stored in this browser. Raw live GPS fixes are not written to disk. A route's chosen start point is saved as part of the plan. No account, analytics or location upload service is added.

The default OSRM **car** demo profile calculates road-network miles, not truck-legal routing. It does not check height, weight, hazmat, HOS or traffic. Replace `routing_base` in Settings with your own compatible OSRM service before public-scale use; requests are queued at no more than one per 1.1 seconds. A routing error is shown as an error; straight-line guesses never substitute for road mileage. See `https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md`.

## Tests

With Node.js installed, run `npm test` (or `node --test tests/core.test.js`). Tests use captured real OSRM responses for both directions and a second Illinois route, plus failure and data cases. See `TEST_REPORT.md` for the completed checks and remaining device-only checks.

Achievements work in both modes, with GPS proximity or labeled manual check-in. LOWER WACKER DRIVE is a proximity badge; GPS cannot establish which vertical road level you occupied. HARD TIME / San Quentin and 77 LIVES are excluded.
