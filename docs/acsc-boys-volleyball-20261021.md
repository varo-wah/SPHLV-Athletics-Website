# ACSC boys volleyball source review - October 21, 2026

This update preserves the existing website design and adds schedule information only. No scores, results or standings are inferred.

## Sources

- [Official ACSC boys volleyball page](https://acscconference.com/boys-volleyball/)
- [Official tournament booklet](https://acscconference.com/wp-content/uploads/2026/10/2026-27-acsc-boys-volleyball-tournament-booklet-edited.pdf)
- [Published schedule linked by the official website](https://docs.google.com/presentation/d/e/2PACX-1vQsDXP08RM7U5AG1-4E0KBgBPDRBWe68Ett6ewgY4pM2tARChZqQlkYqmBp_H_gTnB1eUR3_txE_Mbp/pub?delayms=3000&loop=true&start=true)
- [Fixture workbook linked on booklet page 4](https://docs.google.com/spreadsheets/d/12d3J1c3Hft-ioPgTVWtUkbrfoPrq5JeOM2Qpom9C-bw/edit?usp=sharing)
- [Host YouTube streams](https://www.youtube.com/@internationalchristianscho7869/streams)

The booklet identifies International Christian School, Hong Kong as host, with arrival October 20 and matches Wednesday through Saturday. The dated match window is therefore October 21-24, 2026. Local schedule times are interpreted in `Asia/Hong_Kong` (UTC+8), one hour ahead of Jakarta (UTC+7). Court codes UG and LG are retained exactly as published; their names are not expanded without a source.

The booklet's page 6 YouTube hyperlink targets `@internationalchristianscho7869`. The channel and its streams page returned HTTP 200 with the title "International Christian School Varsity Athletics". The official ACSC page's Watch link contains a truncated playlist ID, so the verified host channel is used instead.

## Consistent fixtures

Both the current published presentation and the workbook's `Schedule` tab agree on these four matches:

| Date | Hong Kong | Jakarta | Fixture | Court | Workbook cells |
| --- | --- | --- | --- | --- | --- |
| October 21 | 09:00 | 08:00 | YISS vs SPH | LG | H3, K2 (merged time), L3 |
| October 21 | 12:00 | 11:00 | Faith vs SPH | UG | H7, K7, L7 |
| October 21 | 14:00 | 13:00 | SPH vs Grace | UG | H12, K12, L12 |
| October 22 | 13:45 | 12:45 | SPH vs ICS Hong Kong | UG | O9, R9, S9 |

## Unresolved round-robin slots

1. **October 22, Round 4, 09:30 Hong Kong / 08:30 Jakarta:** the published presentation says SPH vs ICS Bangkok in LG. The workbook says Dalat vs SPH in UG (`O2`, `R2`, `S2`). Only the date and time are retained as fixed; opponent and court remain TBD.
2. **October 23, Round 7:** the presentation says ICS Bangkok vs SPH at 09:30 in LG. The workbook says the same fixture at 10:30 in LG (`V3`, `Y2` merged time, `Z3`). The presentation also repeats the ICS Bangkok opponent on Thursday and contains no Dalat vs SPH game. Court LG is consistent; opponent and time remain TBD pending host confirmation.

Morrison appears in the booklet's participant list and an old draft worksheet, but not in the current seven-team schedule. No Morrison match is added. SPH's Thursday Round 6 bye is not a match and is excluded.

## Conditional rounds

- Friday's published seeding slots begin at 13:00 and 14:15 Hong Kong time. SPH's position, opponent, court and exact start remain unknown, so the website uses one conditional seeding entry.
- Saturday's presentation lists conditional playoff/placement matches from 08:00 through 16:00 Hong Kong time. The workbook differs in numbering and later timings. The website uses one playoffs/placement entry with no fixed opponent or start time.
- Round IDs stay stable so confirmed host information can replace placeholders without generating duplicate fixtures.

The website therefore adds eight entries: four consistent fixtures, two flagged round-robin slots and two conditional round summaries. The source warning remains visible until the host resolves the inconsistencies.
