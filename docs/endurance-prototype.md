# Swimming and cross-country prototype

Branch: `codex/swimming-cross-country`, based on production main e94e956.
Run `npm run dev:prototype -- --port 3017 --host 127.0.0.1`.
Routes: `#/teams/swimming` and `#/teams/cross-country`; linked from Teams.

The pages read swimming and cross-country entries from the existing master schedule. Results and athlete profiles are explicitly fictional, local display samples and never enter the shared match feed or standings. Production builds reject these routes and omit the directory links.

Before release: confirm rosters, swimming age groups/pool length, meet results, cross-country distances/categories and official timing. Replace samples with verified records. No league standings are invented for these timed-event sports.

Validation: 71 tests, TypeScript, both release builds, and local UI checks for swimming schedule/results and cross-country schedule.
