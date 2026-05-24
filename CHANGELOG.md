# Changelog

## v0.1.1

### Fixed

- Fixed DFCS location input not always updating when switching between Moving, Apply, and Stationary.
- Fixed check firing being enforced while missions could still be sent to DFCS users, causing uncontrollable mission receive prompts.
- Fixed denied targets showing as current in the Mission Status Monitor.

### Added

- Added updated M777 range tables, including high- and low-angle fire.
- Added browser cache bypass for ballistic JSON fetches, so edits load properly.
- Added minimum and maximum elevation limits on mortar solutions.
- Added recorded targets to Map View with assigned target numbers.
- Added a Geometries tab with No Fire Area functions.
- Added a grid readout on Map View.
- Added DFCS local crest input.
- Added mission number to the Mission Status Monitor for simultaneous-mission tracking.
- Added Map View controls.
- Added available-unit display on Map View for stationary units.
- Added dynamic Map View grid scaling between 10km, 1km, and 100m grid spacing based on zoom.
- Added a Map View scale label showing the current grid square size.
- Added a right-click Map View target action to center the target on screen.
- Added right-click Map View unit actions to center units on screen and toggle range rings.
- Added Map View target hover labels.
- Added No Fire Area target blocking, so firing solutions fail when the target is inside an NFA.
- Added a Local Crest result column with Y/N status and N/A elevation when blocked.
- Added Map View range rings for available and active units based on the current weapon system.

### Changed

- Allowed the calculator to pick the best shell and charge solution based on the smallest PEr instead of only minimum time of flight.
- Updated target creation inputs to better match the grid mission page.
- Updated M777 firing table data to better match the mod.
- Geometries can now be built for situational awareness and controlling fires.
- Map View now supports zooming and click-drag navigation.
- Mission Status Monitor now displays the target number next to units in mission to help deconflict simultaneous missions and current engagements.
- Changed DFCS Ready Sent selected colour to match Rounds Complete Sent.
- Changed the Crest button to CREST DATA and moved it next to Ping.
- Changed Plan View naming and styling to Map View.
- Removed estimated PEr display from firing solutions.

## v0.1.0

- Initial tracked version.

- Added changelog.
- Added meteorological data input.
- Added volume slider under the Settings tab.
- Added target lists.
- Added Fire Plan tab with schedule **WIP**.
- Added Emergency Check Firing button.
- Added Zulu clock to the DFCS user screen.
- Added Clear Data button to the FDC fire mission screen.

- Fixed Adjustment tab issue.
- Fixed issue with data being left on screen after EOM is given.
- Fixed DFCS ping function so it only returns success on FDC acknowledgement.

- Removed range from DFCS.
- Removed notifications for sound effects.

- New missions retain user input when switching tabs.
- QoL improvements for UI and spacing.
- Target number autofills saved target data.
- Targets in target lists can be opened to initiate a fire mission.
- Changed Unit Location button to Unit Setup.
- Inputting 6- or 8-figure grids autofills them to 10 figures.
- Ammunition selection now affects the DFCS screen instead of displaying 'HE'.
