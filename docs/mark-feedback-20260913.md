# Mr. Mark feedback — September 13 review

Base: origin/main at 69bb54d. Preserved as codex/main-snapshot-20260913.
Changes: codex/mark-feedback-20260913, isolated in .worktrees/mark-feedback-20260913.

## Requests read in Teams

- September 8, 13:13: correct Danson's name in two statistics displays.
- September 8, 14:27: use an embedded YouTube Sports Report because parents cannot access OneDrive.
- September 11, 06:28: boys and girls soccer standings show no results.

## Changes and evidence

- Correct the known Dansen spelling only in SMP boys basketball stats/highlights during ingestion. Verified August 22 ACS-A stat leaders and September 5 GJS rebound leaders in the local UI. The source spreadsheets remain untouched.
- The official YouTube channel's matching episode is titled September 2, 2026, video JCu8694AuqA. Its presenters, setting, uniforms, and graphics match the existing article image. The article now uses that date, embeds YouTube, and links directly to YouTube. The existing article ID is preserved. The direct video page loads; the Codex in-app embedded frame remained blank, so embedded playback is not verified.
- The official soccer workbook's Boys Standings/Ladders and Girls Standing/Ladders were read via the Sheets connector on September 13, A1:Q35. Boys SPH-LV: 1 win, 1 loss, 3 points, GF 12, GA 3. Girls: 2 wins, 1 draw, 7 points, GF 11, GA 2.
- Soccer now reads both official score matrices through the existing published-data cache. The existing scheduled sync includes those sources. Invalid data retains the last successful or bundled verified standings and displays a warning. The checked-in September 13 snapshot replaces the zero-only August snapshot.
- Standings footer dates now reflect soccer cache publication/fallback verification dates, with the existing basketball and volleyball snapshot dates kept accurate.

## Validation

- TypeScript, 59 tests, production and prototype builds, and git diff whitespace checks passed.
- Published-data cache refresh fetched all 12 configured sources.
- Local browser verified both soccer tables and both corrected name entries; production boys soccer still shows zero standings.
- No production deployment or remote push performed.

## Comparison

- Live: https://sphlv-athletics.web.app/#/teams/soccer-sma-boys
- Local: http://localhost:3013/#/teams/soccer-sma-boys
- Open Standings on each page. Local runs in production mode.

Mark also floated a form-to-spreadsheet workflow for future game summaries on September 8. That is a separate workflow proposal; this branch implements the concrete website corrections above.
