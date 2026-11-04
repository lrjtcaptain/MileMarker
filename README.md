# MileMarker upload package - November 3, 2026

## Upload to GitHub Pages

1. Unzip this package.
2. Upload the contents of this folder to your existing repository root. Keep index.html, .nojekyll, css/, js/, and data/ together. Do not upload only the ZIP or place the whole folder one level below the site root.
3. Keep your current Pages branch/root setting. After deployment, reload the site once to pick up the new files.

The existing navy interface, original Plan form and clocks, Drive, Garage, Truck/Road Trip modes, favorites/private notes, foreground GPS controls, achievements, hotel/attraction records, and rest-area button are retained. Google map is deferred; its optional future key field is in Settings. Restaurant preferences remain Godfather's for generic pizza and Taco John's before Taco Bell for generic Mexican, subject to route suitability; named requests still win. Both Pizza Counter locations are saved as favorites once on first use.

## Included data

All 505 original truck-stop records and coordinates: 316 Illinois and 189 Iowa. All 505 detail pages were attempted, with retries; 498 directory profiles were retrieved, one additional record uses an alternate directory source, and 6 remain unavailable. Their original identities and coordinates remain in the app. 464 parking counts are populated (78 explicit zeros); 41 counts remain blank because the source did not provide them or the profile was unavailable. No count is invented. The collection audit and per-record source links are included in data/.

The food overlay contains 4030 records: the Iowa restaurant inventory including the two repaired Pizza Counter locations, Pizza King, and Barley's, plus 3 additional named on-site food listings linked directly to their host truck stops. Food browsing also retains the earlier Illinois/Iowa catalog and merges matching existing IDs. On-site coordinates use the approximate host point. The OSM food snapshot is October 11, 2026; local restaurant corrections are November 3. Barley's address is listed with an address-map link; its coordinate pin remains unverified, so it is excluded from coordinate-based route suggestions.

## Preserved rules

Zero or missing parking counts do not qualify a truck stop for overnight recommendations. Such records remain searchable and can qualify for fuel if diesel is listed. Only positive or explicitly listed amenities appear. Services listed at an exit remain separate from on-site amenities. Source parking counts describe capacity, not live vacancy. A nearby restaurant does not inherit truck access.

## Editing data

data/truck-stops.json contains the researched directory inventory. data/iowa-food.json contains the Iowa food overlay. data/places.csv and MileMarker_Data.xlsx retain the original Beta 2 records and schema; their workbook export does not erase the separately loaded overlays. Update the corresponding overlay when editing its records. Back up browser trip/favorite/garage data in the app before changing the site address. Existing data is browser-local and site-address specific.

## Connectivity and limits

Bundled stop and food browsing needs no Overpass calls. Routing and town search need internet; GPS needs HTTPS and user permission. OSRM uses a car routing profile, not truck-clearance-aware navigation. Google/Waze/Apple handoffs are available; Trucker Path shows/copies the destination for entry. There is no live diesel-price or parking-vacancy feed.

Automated validation is documented in TEST_REPORT.md. No Google map or API key is required for this release.
