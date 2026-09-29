# September 29 Teams review

Read Mark Heil, GameDay Summaries and Player of the Week native Teams windows on September 29. Read the three official league workbooks using bounded Sheets reads; raw schedule evidence is in league-source-review-20260929.json. Standings snapshot is in src/data/leagueStandingsSnapshot.json.

## Implemented

- Soccer standings now accept the current six-school boys and seven-school girls matrices. All six standings tables now retrieve the published workbook matrices through the deployed cache; the cache sync validates the girls basketball title too. Refreshed fallback standings and head-to-head data.
- Added missing dated volleyball and basketball league results through September 26, preserving published manager-feed scores except the specifically confirmed BSJ correction. September 26 boys BSJ is 69–25, confirmed by William in this task (league source says 67–25). Official standings continue to reflect league-published totals.
- Added September 21 boys 57–35 SDH DM friendly and verified GameDay stats for AIS and ACG volleyball. Omitted inconsistent rebound totals in the SDH DM report.
- Updated soccer cup scoring notes: Solomon free kicks against SMK 31 and PGRI-83, Ben's corner-kick goal in the September 19 final; confirmed runner-up placement from Mark's September 29 write-up.
- September 28–29 volleyball cup fixtures transcribed from Mark's September 27 attachment. Both genders: September 28 at 15:30 vs Moria, 17:30 vs SMA 15; September 29 at 13:30 vs SMA 4, 16:30 vs Laurensia. Boys Court 1, girls Court 2. No cup scores invented.
- September 29 awards: Coby, Isa, Solomon. Preserved supplied write-ups and the soccer AI attribution. Shared poster folder currently contains only Aug 28 and Sep 9 editions, so new posts use the existing school banner.
- B-team basketball published as a separate news recap, keeping B games out of A-team records: boys 22–31 BSJ with Mason 10 points/2 steals; girls corrected to 11–12, Aurel 9 points (Giselle's Sept 28 21:14 correction supersedes 21–22/13 points).

## Source conflicts / pending items

- September 19 boys STL: league says 50–18; Mark's Sept 21 report says 50–20. Asked William; use the league value pending confirmation and do not attach the conflicting summary.
- Girls soccer Sept 5 GJS remains conflicting (league 6–0 versus earlier stats workbook 7–0); no new supplemental result added.
- Girls soccer BSJ league row is dated Oct 2 (future as of review) and says 0–2, while Isa's award mentions scoring the team's lone goal against BSJ. Do not infer a new dated result from that award narrative. League standings are reproduced as published.
- Mark's September 21 request for access to six manager Sheets is a Drive sharing issue, not fixed by this website release. No Drive permissions or Teams messages changed.
