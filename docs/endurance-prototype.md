# Swimming and cross-country prototype

Branch: `codex/swimming-cross-country`, based on production main e94e956.
Run `npm run dev:prototype -- --port 3017 --host 127.0.0.1`.
Routes: `#/teams/swimming` and `#/teams/cross-country`; linked from Teams.

The pages read swimming and cross-country entries from the existing master schedule. Results and athlete profiles are explicitly fictional, local display samples and never enter the shared match feed or standings. Production builds reject these routes and omit the directory links.

Before release: confirm rosters, swimming age groups/pool length, meet results, cross-country distances/categories and official timing. Replace samples with verified records. No league standings are invented for these timed-event sports.

Validation: 71 tests, TypeScript, both release builds, and local UI checks for swimming schedule/results and cross-country schedule.

## Cross-country release — September 30

Cross-country now has a dedicated public page with eight reported 5 km personal bests supplied September 27. Times were transcribed from the result image in the requested WhatsApp conversation: Gwen 30:28, Lidya 29:29, Nicole 33:03, Kaylee 33:01, Sigmund 19:30, Dom 23:48, Daniel 28:15, Sean 34:41. Publication was explicitly requested. No phone numbers, chat screenshots, inferred race dates, categories or placings are published. The athlete list is described as participants in this report, not a complete confirmed roster.

Swimming remains prototype-only. The public cross-country route and directory/menu links show no fictional values. Production routing coverage, both builds, and local page/data/schedule checks passed.
