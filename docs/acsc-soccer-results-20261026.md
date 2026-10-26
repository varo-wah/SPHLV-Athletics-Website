# ACSC boys soccer final review — October 26, 2026

The [official ACSC boys soccer page](https://acscconference.com/boys-soccer/) was retrieved at **2026-10-26 12:47:41 UTC+7**. Its live sources were retrieved immediately before it:

- [Four-day schedule and results](https://docs.google.com/presentation/d/e/2PACX-1vS33XQPS5D1DZ9jKyJyBOMyVMCW568j9Aojq8TPjIagEeSl5eZjKoz99Ox3-AEkGyc5E_VNHEotLjHy/pub?start=false&loop=false&delayms=3000)
- [Elimination bracket](https://docs.google.com/presentation/d/e/2PACX-1vTdGvR58SoNhp_M28V3SjuSueIYh04coR1zPoXf3mpHZ090xDhwhe1lQvroFEcPkvhAPMTr8-_dIBLq/pub?start=false&loop=false&delayms=3000)
- [Pool standings, linked by ACSC as Results & Awards](https://docs.google.com/presentation/d/e/2PACX-1vRpZlXV0Epa-pV37kZFzNF9qu5caU-peWaBdOhmd06r0TDVyBWbQF9PG2wzKEDbeueOuTtsL1EWPFe9/pub?start=false&loop=false&delayms=3000)

All six slides were rendered and visually reviewed, including embedded team-logo and score images. Original HTML, decoded SVG, embedded-image SVG, rendered PNGs, exact retrieval timestamps, and the resulting JSON snapshot are under `/tmp/acsc-results-20261026/soccer/`. The twelve pool scores and pool standings match the October 23 review and are preserved.

## SPH results and placement

Times below are Chiang Mai local time, UTC+7, also Jakarta time.

| Date | Time | Stage | Result from SPH's perspective | Field |
| --- | --- | --- | --- | --- |
| October 23 | 08:00 | Quarterfinal Q2 / G2 | SPH 0–2 Grace | 2 |
| October 23 | 15:00 | Placement semifinal G5 | SPH 0–1 Dalat | 2 |
| October 24 | 08:00 | Seventh-place match G10 | SPH 2–0 Morrison | 2 |

The official schedule and bracket agree with William's October 26, 12:45 Teams GameDay report on all three scores and seventh place. Combined with the pool matches, SPH finished with **2 wins, 1 draw and 3 losses**, scoring 9 and conceding 12 goals. The three prior SPH pool IDs and three prior playoff/placement IDs are retained, so the results update the published fixtures without duplicating them.

The updated official slides put the Friday placement semifinals on Field 2 and the championship semifinals on Field 1. Saturday's fifth-place match and championship are on Field 1; seventh-place and third-place games are on Field 2. These supersede the earlier booklet and pre-result bracket fields.

## Other playoff results

| Date | Stage | Result |
| --- | --- | --- |
| October 23 | Q1 / G1 | ICS Hong Kong 5–1 Dalat |
| October 23 | Q3 / G3 | ICS Bangkok 6–0 Morrison |
| October 23 | Q4 / G4 | YISS 1–1 Faith; Faith won penalties 4–2 |
| October 23 | Semifinal G6 | ICS Hong Kong 2–2 Grace; Grace won penalties 3–1 |
| October 23 | Placement semifinal G7 | Morrison 0–3 YISS |
| October 23 | Semifinal G8 | ICS Bangkok 2–0 Faith |

Shootout totals are stored separately from the drawn regulation scores. The snapshot contains **21 verified numeric results**, including all six SPH games. It has 24 scheduled tournament matches in total.

## Final placements and unresolved numeric scores

1. ICS Bangkok — explicitly pictured as champion on the official bracket.
2. Grace — the other finalist.
3. Faith — the bracket's third-place winner marker.
4. ICS Hong Kong — the other third-place participant.
5. Dalat — wins against YISS in both sources, despite the score discrepancy below.
6. YISS.
7. SPH — explicit seventh-place winner marker and 2–0 result.
8. Morrison.

These placements use the official bracket's winner markers and confirmed placement fixtures. Missing score values are not inferred from the winner markers:

- **Dalat–YISS, fifth place:** the Day 4 schedule shows **4–2**, while the elimination bracket shows **4–0**. Both agree Dalat won. The snapshot keeps both score fields `null` and describes the conflict.
- **ICS Hong Kong–Faith, third place:** the score is blank; the bracket identifies Faith as the third-place winner.
- **Grace–ICS Bangkok, championship:** the score is blank; the bracket explicitly crowns ICS Bangkok champion.

`complete: true` means the tournament has concluded, not that every numeric score has been published. The three matches above must be shown as concluded with unreported or unconfirmed scores, not as upcoming fixtures.

## Award and scorer provenance

William's October 26, 12:45 Teams GameDay post reports **Solomon's All-Tournament Team award**. The official SPH roster identifies him as **Solomon Schleper**. The linked Results & Awards slide still contains only pool standings, so the award is attributed to the team report rather than falsely claimed as an official-slide award entry.

The prior pool scorers remain unchanged: Troy, Tobin, Ben and Kenzo Stanley against Morrison; Yusang and the ambiguously reported Kenzo against YISS. No scorer is invented for the three newly added playoff results.
