# Teams feedback implemented October 15, 2026

Sources read directly in Teams: Mark Heil private conversation October 13–15, Team Athletics Media October 12–13, GameDay Summaries through October 15 at 19:43 Jakarta time.

## Confirmed teacher requests
- Standings ranked by wins divided by games played; draws displayed only for soccer.
- Remove ACSC from SMP tournament cards.
- Put cross-country below team sports and reduce its navigation card.
- Add the JIS Dragons logo wherever school identities appear.
- Remove game updates from News; keep the underlying confirmed results and archived article data.
- Publish the new video linked October 13: https://youtu.be/6JxJXMnhXyY.

## Media team improvements
- Clear Boys/Girls labels and blue/pink accents.
- Home access to personal pinned teams and recent results.
- Chronological schedule timeline with date-based Today/Past indicators and clickable event details, retaining calendar view.
- Clickable player rows with confidently matched reported game stats and honest empty states. No invented season totals.
- Simplified news rows/category filtering and integrated header logo/title styling.

GameDay Summaries has no new result report after October 3 as of this review. October 15 posts request stats and pictures; they do not supply scores. Mark identified Jethro (grade 9) as a swimming information contact; no swim times were supplied. Public prediction voting remained a proposal rather than a confirmed requirement. Image-reference attachments could not be opened reliably through Teams; UI changes follow the accompanying text feedback.

Official JIS logo source: https://www.jisedu.or.id/arts-athletics-activities/athletics, image https://resources.finalsite.net/images/f_auto,q_auto/v1728964162/jiseduorg/njtvziwo1fwqpxdrhhwg/NewJISAthleticsLogo.jpg. Video title confirmed with YouTube oEmbed: LV Game Day Sport's Report - October 12, 2026, by LV GameDay.

## Data validation and release checks
- Trim whitespace around recovered reverse scores before parsing. Valid `42 - 25` input is accepted; inconsistent points totals still reject the feed.
- Refreshed all 16 published sheet sources. All six official standings feeds now validate, including boys basketball after the upstream GJS total was corrected.
- Type-check, all 85 tests, prototype build, and production build pass. Browser checks cover win-percentage order, soccer-only draws, SMP tournament visibility, player reports, news filtering/video, team order, schedule views/details, and the guest Home state.
- Preserve the prior main commit under `archive/main-before-feedback-20261015` for rollback.
