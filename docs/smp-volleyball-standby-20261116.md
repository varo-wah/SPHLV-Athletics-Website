# SMP volleyball standby — November 16, 2026

Both SMP volleyball pages are public under Season 2 with a Standby label. Rosters, scores and SMP league standings remain pending; varsity tables and tournament summaries are not reused.

Schedule source: the downloaded school file `SPHLV Sports Master Schedule 26-27.xlsx`, Season 2 columns E/F and date column B, rows 6–49. Stored dates are November–December 2026; the sheet title is stale. There are 20 listed sessions for each team, November 2–December 15. Blank cells are not interpreted as practice. January rows contain January 2026 dates and are withheld pending clarification.

Confirmed scheduled sessions for both teams:
- November 17: STL at LV (row 21), time unlisted.
- November 28: LV at ACG (row 32), time unlisted.
- December 5: BSJ at LV, 08:00 (row 39). Both team columns list the same start time; separate match times are not inferred.
- December 12: LV/KV at GJS (row 46). Individual pairings and start times are unlisted; the session does not assert an opponent matchup.

The public Season 2 CSV retains older dates. Only the reviewed 2026 SMP snapshot is exposed in production and the prototype, on first load and after refresh. The source SharePoint link was inaccessible during the prior November 16 source check; this update does not claim a fresh cloud workbook download.

Validation: TypeScript, 176 tests, production build; in-app browser checked SMP upcoming games, practice navigation and filters in wide and compact views.
