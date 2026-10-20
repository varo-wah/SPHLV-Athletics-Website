# GameDay results reviewed October 20, 2026

These additions retain the original site layout. `src/data/october20Updates.ts` contains 22 previously missing results plus the St John result previously available only in News: 10 have verified match dates and 13 have unconfirmed match dates. No result uses a report's posting date as its match date.

## Dated results

Source: [official JAAC football workbook](https://docs.google.com/spreadsheets/d/1-t0FXJKLwUz7_mO0Vk3A2CvD1vVoJ-u5LkF-rphwOd4/edit), read October 20. Locations and times are copied from the schedule rows.

| Team | Match date | Result | Workbook range |
| --- | --- | --- | --- |
| Boys soccer | October 2 | BSJ 1–1 LV | Boys Schedule A14:G14 |
| Boys soccer | October 17 | LV 2–1 ACS | Boys Schedule A16:G16 |
| Girls soccer | September 5 | LV 6–0 GJS | Girls Schedule A10:G10 |
| Girls soccer | October 2 | BSJ 2–0 LV | Girls Schedule A19:G19 |
| Girls soccer | October 13 | LV 1–0 ACS | Girls Schedule A21:G21 |
| Girls soccer | October 19 | STL 2–1 LV | Girls Schedule A23:G23 |

The October 19 girls row lists STL as home but SPH-LV as the location. Both source fields are retained. The October 18 boys soccer GameDay report supplies Solomon and Troy as the scorers against ACS; the workbook establishes the actual match date as October 17.

Mark Heil's October 15 and October 17 GameDay reports establish four SMP boys A basketball results at the Cup hosted by LV:

| Match date | Opponent | LV score | Stage |
| --- | --- | --- | --- |
| October 15 | SMP Negeri 6 | 69–10 | Opening game |
| October 15 | SDH DM | 51–24 | Second game that evening |
| October 17 | Tunas Muda | 50–7 | Semifinal |
| October 17 | Citra Berkat | 43–30 | Final; champions |

Start times are unconfirmed and remain blank. The user-confirmed September 26 boys basketball score against BSJ remains **69–25**.

## Scores with match dates still to be confirmed

These are completed results, shown with **Date TBD** in the existing result cards. Details explicitly identify the posting date and explain that the actual match date is unconfirmed. Posting dates can order reports in recent-result lists, but are never placed into the schedule or displayed as match dates.

| Team / report author | Report posted | Opponent | LV score | Confirmed context |
| --- | --- | --- | --- | --- |
| Girls basketball / Giselle London Sudjana | October 16 | Atisa | 40–5 | Opening SPH Cup game |
| Girls basketball / Giselle London Sudjana | October 16 | SMP 6 | 51–4 | SPH Cup, advances to semifinal |
| Girls basketball / Giselle London Sudjana | October 18 | Citra Berkat | 31–12 | SPH Cup semifinal |
| Girls basketball / Giselle London Sudjana | October 18 | Tunas Muda | 20–30 | SPH Cup final; runner-up |
| Girls volleyball / Trisha Celina Mai | October 17 | JIS JV | 2–1 | 20–25, 26–24, 17–16; deciding set capped at 17 |
| Girls volleyball / Trisha Celina Mai | October 17 | Cubic | 0–2 | 15–25, 20–25 |
| Girls volleyball / Trisha Celina Mai | October 17 | POPB | 1–2 | 19–25, 25–15, 8–15 |
| Girls volleyball / Trisha Celina Mai | October 17 | JIS | 2–1 | Third-place game: 25–21, 23–25, 15–13 |
| Boys volleyball / Rayn Alakay Danuseputra | October 16 | JIS JV | 2–1 | 24–26, 25–20, 15–10 |
| Boys volleyball / Rayn Alakay Danuseputra | October 16 | Cubic | 0–2 | 13–25, 17–25 |
| Boys volleyball / Rayn Alakay Danuseputra | October 18 | POPB | 2–1 | 25–14, 17–25, 15–5 |
| Boys volleyball / Rayn Alakay Danuseputra | October 18 | POPB | 2–0 | Third-place game: 25–23, 25–17 |
| Boys basketball / earlier GameDay report preserved in News | September 29 | St John | 52–43 | Coby double-double; date and venue unconfirmed |

The eight volleyball reports do not establish the competition name. They are not classified as ACSC or SPH Cup. Their match details say the competition needs confirmation.

## Statistics and unresolved source details

- The girls SMP 6 report gives Hillary five steals in its prose but six in the stat list. Her steals total is omitted pending confirmation; the remaining consistent statistics are included.
- Mark's boys basketball reports call a player “Eduardo”; the roster has “Edvardo Fernanda.” Stats retain **Eduardo (name as reported)**, without silently identifying him as the roster player.
- The girls Cubic volleyball report credits five saves to “both” liberos Shana and Louisa. The ambiguous number is omitted; their contributions remain in the highlights.
- The girls JIS third-place report describes Christa's two “dunks.” That source term is retained, rather than converted to a different volleyball statistic.
- Team-level percentages and “in one set” statistics remain labeled at their reported scope.
- Existing basketball score discrepancies (August 22 ACS-A, September 5 GJS, September 19 STL) remain unresolved and are not overwritten.

## Fixture identity and later date confirmation

Every undated report has a stable `fixtureId` copied into `SheetMatch.reviewedFixtureId`; this keeps the two boys POPB games separate even if they share an actual date. Feed parsing also recognizes `Reviewed Fixture ID`, `Fixture ID`, `Match ID`, or `Round` when distinguishing repeated same-day opponents.

To reconcile an undated report when the actual date is known, either update its reviewed `date`, or supply its exact stable ID in the feed's `Reviewed Fixture ID`, `Fixture ID`, or `Match ID` column. Arbitrary source IDs are kept separate from reviewed IDs; they reconcile only when they match a known reviewed ID. A date already supplied by a matching published fixture is preserved. Repeated merges remain idempotent.

An untagged dated feed entry is deliberately not assumed to be the same as an undated report merely because its opponent and score match. Until the reviewed date or identity is supplied, the two can coexist; manual reconciliation is required. For multiple matches on the same date, use separate fixture IDs or rounds rather than relying on the seven-column legacy format.

The Mac locked before attached score-sheet images could be checked. Written reports and the official workbook support the additions above; attachments are still needed to confirm the missing dates and any disputed player statistics.
