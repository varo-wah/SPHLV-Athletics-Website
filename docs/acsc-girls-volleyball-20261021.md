# ACSC girls volleyball schedule - verified October 21, 2026

## Sources

- [Official ACSC girls volleyball page](https://acscconference.com/girls-volleyball/) identifies the 2026-27 season and links the booklet, live schedule and streams.
- [Official tournament booklet](https://acscconference.com/wp-content/uploads/2026/10/2026-27-acsc-girls-volleyball-tournament-booklet-edited.pdf): cover and page 2 identify International Community School, Bangkok, Thailand, October 20-24, 2026. Page 2 lists SPH as a participant. Pages 3-5 contain the schedule.
- [Current official schedule slides](https://docs.google.com/presentation/d/e/2PACX-1vTmw83IXsQ1Bx8cEpDl0CfDfbbYccDVwwQSqiuePxXyxTPhaECEoMEONTHdCE0WU9T91NJJZfPBHpMz/pub?start=true&loop=true&delayms=3000): six slides linked under Schedule on the official ACSC page, checked October 21.
- [Official host YouTube streams](https://www.youtube.com/@icsbkkathleticsarts2416/streams): linked under Watch ACSC Girl Volleyball Tournament / All Live Streams.

The current booklet SHA-256 is `c5b8a2ed2251af28b2e17292a494cd773218f3b8b6a4e2945d8f77e86feb4d96`, identical to the October 20 copy whose schedule pages were visually checked. All six current schedule slides were read by their published SVG content. Every SPH fixture date, start time and court agrees with the booklet. The booklet calls the schedule preliminary, so event source links point to the live schedule and tournament metadata retains the PDF link.

## SPH fixtures

All matches are at International Community School, Bangkok. Court 1 is labelled Bleachers and Court 2 Concrete in the booklet. Match play begins October 21; October 20 is the welcome event. Metadata uses playing dates October 21-24.

| Date | Start | Fixture | Court | Evidence |
| --- | --- | --- | --- | --- |
| October 21 | 08:30 | Dalat vs SPH | 2 | Booklet p. 3; slide 1 |
| October 21 | 10:30 | SPH vs ICS Hong Kong | 2 | Booklet p. 3; slide 1 |
| October 21 | 14:30 | ICS Bangkok vs SPH | 1 | Booklet p. 3; slide 2 |
| October 22 | 08:30 | SPH vs YISS | 2 | Booklet p. 4; slide 3 |
| October 22 | 10:30 | Grace vs SPH | 2 | Booklet p. 4; slide 3 |
| October 22 | 14:30 | Faith vs SPH | 2 | Booklet p. 4; slide 4 |
| October 22 | 16:30 | SPH vs Morrison | 2 | Booklet p. 4; slide 4 |

The first-listed team order is preserved without inferring home/away status at the neutral tournament venue. DAS in the booklet and DIS in the slides both identify Dalat. GIS is Grace, FA is Faith Academy, and MAC is Morrison Academy.

The sources do not explicitly state a time zone. Times are interpreted as local to the host, `Asia/Bangkok` (UTC+7), the same clock time as Jakarta. This assumption is stated in event details.

## Conditional rounds

- October 23 quarterfinal: 15:00 for seeds 1 vs 8 (Court 1) or 4 vs 5 (Court 2); 18:00 for seeds 2 vs 7 (Court 1) or 3 vs 6 (Court 2). Source: booklet p. 4, slide 5.
- October 24 semifinal or consolation: quarterfinal losers at 08:00 and winners at 09:30. Court and opponent depend on bracket position. Source: booklet p. 5, slide 6.
- October 24 placement: fifth/sixth on Court 1 and seventh/eighth on Court 2 at 12:00; championship on Court 1 and third/fourth on Court 2 at 13:30. Source: booklet p. 5, slide 6.

The three conditional events have null time and opponent fields. Their descriptions expose possible slots without choosing an unconfirmed SPH slot. Stable IDs must be replaced when confirmed fixtures become available, rather than duplicated.

## Deliberate exclusions

- No results were imported. The live slides already contain some result numbers, but also a 2-2 score in another match; independent confirmation is needed before treating schedule numbers as final results.
- The booklet duplicates Game 9 for fifth-place and third-place matches. Implementation does not use those game numbers as unique IDs.
- The booklet schedule marks fifth/seventh-place matches as five-set matches while the rules section says matches outside quarterfinals, semifinals, third place and final are best of three. Unconfirmed set formats are omitted.
- No team roster, standings, assumed seeding or player statistics were inferred from the schedule.
