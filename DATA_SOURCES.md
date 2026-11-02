# Data sources and collection

Collected November 2, 2026. The supplied operator catalog/food records retain their November 1, 2026 research dates. `checked_on` is a collection/review date, not a guarantee of current operation.

* Supplied foundation: `editable_food_database.zip`, containing the full MileMarker source, 97-place catalog, 213 food records, source tables and existing logo provenance. The earlier chat's separate `/mnt/data/MileMarker_IL_IA_Foundation.zip` and workbook were not available locally. The supplied app was used for integration instead.
* Iowa DOT's public rest-area map links the official `Rest_Areas_All` FeatureServer. Rest areas, welcome centers and parking-only layers were queried; weigh scales were excluded. Geometry and travel-direction fields are preserved. [Official map entry](https://iowadot.gov/modes-travel/roads-highways/maintenance/rest-areas), [FeatureServer](https://services.arcgis.com/8lRhdTsQyJpO52F1/arcgis/rest/services/Rest_Areas_All/FeatureServer).
* Illinois rest-area feature layer: coordinates, route direction, status and semi allowance. [Public layer](https://services2.arcgis.com/aIrBD8yn1TDTEXoz/ArcGIS/rest/services/IL_Rest_Areas/FeatureServer/0). The UI calls these DOT-listed records and does not claim live operating status.
* OpenStreetMap: named `tourism=hotel|museum|attraction` nodes/ways/relations in the regional bounding box 41.1,-96.0,42.0,-87.4, followed by a narrower latitude/longitude filter and an IL/IA point-in-polygon filter. The data includes independently named businesses and sights; it is not a manually verified opening-status directory. Ways/relations use feature centroids. Each record links to its exact OSM object. Query endpoint: `https://overpass-api.de/api/interpreter`. [OSM attribution and ODbL license](https://www.openstreetmap.org/copyright).
* State boundaries: [US Census TIGERweb State_County layer 0](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0), `STUSAB IN ('IA','IL')`, EPSG 4326, maximum geometry offset 0.0001 degrees. Used to discard neighboring-state OSM results and assign state labels.
* Routing: [OSRM HTTP API](https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md), OpenStreetMap network. Captured test fixtures are road responses, not synthetic distance matrices. Their values reflect the demo server at collection time and can change when the network updates.
* City search: [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api), sourced from GeoNames. Built-in city anchors are approximate centers, not business or truck entrances.

The Iowa 80 Truckstop pin uses the supplied operator dining dataset's on-campus point and is labeled as such. [Operator](https://iowa80truckstop.com/) identifies I-80 Exit 284 in Walcott. Truck navigation must select the correct entrance.

The old Wilton westbound rest-area row is omitted in favor of the parking-only record: [Iowa DOT's June 15, 2026 update](https://iowadot.gov/transportation-matters/2026-06-15/take-break-how-iowas-rest-areas-keep-summer-travel-safe-convenient-and-comfortable) describes the former rest area as reopened with no services. This avoids offering it as a restroom stop from an older GIS row.

To repeat the regional discovery request for review, run `python tools/discover_osm.py --output osm_candidates.json`. This writes a candidate file without changing the deployed catalog. Check state boundaries, duplicates, operation and access before adding records to the master workbook.

No additional copyrighted logos were downloaded. Existing bundled assets whose provenance marks an official operator source remain enabled for place identification; other brands use neutral symbols. See `data/LOGO_SOURCES.json`. Trademarks remain with their owners; this package does not assert an endorsement or a new commercial logo license.

The OSM-derived database portion is distributed under ODbL. Operator and state-source records retain their provenance separately in the aggregate CSV; consult the publishers for terms applicable to their material. Preserve attribution and source columns when redistributing.
