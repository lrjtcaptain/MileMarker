# November 3 upload verification

61 automated tests passed on November 3, 2026.

The automated suite covers routing fixtures, rest-area direction, original Plan layout/controls, hours and stop ordering, explicit food requests, generic pizza/Mexican preferences, Iowa restaurant merges, favorites, all 505 directory records, zero/missing parking exclusion, fuel availability, and positive-only amenities. Run npm test from this folder.

All classic app scripts and ES module files are checked for syntax. The package checks verify local assets and imports, both inventory loaders, stable IDs, and the ZIP root. The existing layout/style files are retained. No Google Maps script is loaded.

Live browser/phone GPS and public routing-service availability have not been verified for this release. The browser tool rejected file:// previews; that restriction was not bypassed. Automated checks do not establish live device behavior. The retained earlier report's live-device claims are not used as verification for this release.
