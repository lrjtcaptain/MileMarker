# MileMarker Beta 2 — verification

Completed November 2, 2026, using the supplied MileMarker app and the final modular package.

## Automated checks

17 Node.js tests pass. Coverage includes quoted/multiline CSVs, unclosed CSV rejection, unique sourced records, coordinate validity, missing-price handling, attraction opt-in, unknown truck access filtering, rest travel directions, external navigation URLs, cumulative road-leg itinerary timing, real OSRM route geometry, highway summaries without concurrent-ref duplication, GPS progress projection, inaccurate/stale/off-route/opposing-heading rejection, invalid route inputs, and service-failure behavior without a fabricated distance fallback. Excluded achievements are checked against active data.

Captured real OSRM fixtures:

| Route | Road miles | Driving hours |
| --- | ---: | ---: |
| Downers Grove → Council Bluffs | 439.0 | 8.09 |
| Council Bluffs → Downers Grove | 441.1 | 8.16 |
| Springfield → Rockford | 200.4 | 3.74 |

These are collection-time car-profile estimates, not traffic ETAs or truck-route certifications.

## Browser checks

* Integrated source loads over HTTP with the original navy interface, original Garage and four-tab navigation.
* Downers Grove → Council Bluffs calculated using the network service. PLAN shows route-derived I-88 → I-80 → IA 906, rather than a hardcoded I-55 sequence.
* Food after 3h / fuel after 6h produced sourced choices. A Walcott Wendy's stop and Altoona Flying J #913 were selected and saved as a complete, rerouted itinerary: approximately 441 road miles, 8h 13m driving, plus 50 minutes of breaks.
* Both middle-stop entries, their sources, cumulative miles and times are exposed. DRIVE shows the next stop and the same saved-route highway summary.
* Reload restores the saved road route and stop sequence with its calculation timestamp.
* Quick-rest lookup returns Davenport Westbound on the westbound route: about 143 road miles from this start, with about one added road minute at test time.
* Road Trip + attractions category returns zero results before opt-in; TAKE A BREAK enables sourced regional attraction results. Truck mode filters access-unknown places.
* A 390 × 844 phone-width viewport was visually inspected. Route controls are compact, the next-stop card and navigation button remain accessible, and the bottom navigation is retained.
* Browser console inspection found no JavaScript errors during the checked flows.

## Workbook and package

Master XLSX was exported, its seven sheets rendered for layout review, and its primary data tabs round-tripped through the included Python exporter. Place, anchor, achievement and settings fields match their CSV source records. Food brand/source headers normalize the source UTF-8 BOM. The exporter preserves their data. The workbook has 1,846 active place records, including 90 rest areas, 14 parking areas, 22 truck stops, 213 food records, 793 hotels and 714 attractions.

The ZIP is checked for the entry point, module/style/data files, workbook, deploy guide and test fixtures. It contains no dependency installation or private credentials. GitHub Pages deployment has not been performed; this is the requested ready-to-upload ZIP.

## Remaining device / service checks

* A real moving-phone GPS road test, browser permission experience, battery use and native app handoffs remain unverified. Foreground countdown logic is covered with captured-route fixtures, including invalid fix cases.
* The default public OSRM endpoint uses a car profile and has no truck restrictions, traffic or uptime guarantee. No truck-clearance certification is claimed.
* Trucker Path uses a destination shown/copied for manual entry and a website link because a supported public coordinate deep link was not verified. Google/Waze/Apple coordinate URLs are tested; native launch behavior depends on the device.
* No live diesel price feed, current-business opening check, hotel inventory, parking vacancy, or offline-map service is connected. Diesel price fields remain empty.
