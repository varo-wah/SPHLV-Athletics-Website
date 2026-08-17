# SPHLV Athletics Website

SPH LV Athletics has two release channels built from the same codebase:

- Firebase Hosting is the only official deployment. Production shows the six approved Season 1 teams: SMA Soccer, SMA Volleyball, and SMP Basketball for boys and girls.
- The complete in-progress sports and season catalog is viewed locally from the `prototype` branch.

## Release Channels

The app fails closed to production when `VITE_RELEASE_CHANNEL` is missing or invalid.

```bash
npm run build:production
npm run build:prototype
```

Production hides unfinished teams and stale favorites for those teams. Prototype uses the same Firebase Authentication and Firestore data, but displays a persistent Prototype badge.

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the production-restricted Vite dev server:

   ```bash
   npm run dev
   ```

3. To view the complete prototype locally instead, run:

   ```bash
   npm run dev:prototype
   ```

4. Open the local URL printed by Vite.

## Verification

```bash
npm test
npm run lint
npm run build:production
npm run build:prototype
```

## Team Results Sheets

Schedules and upcoming games continue to come only from the full master schedule. Completed results are loaded independently from six team-owned Google Sheets every 60 seconds. Each published `Results` tab must expose exactly these columns:

```text
Date | Time | Location | Home Team | Home Score | Away Team | Away Score
```

A completed row is accepted only when the date, both team names, and both non-negative whole-number scores are valid. Exactly one team must be `SPH LV`; time and location are optional. Invalid rows are ignored and repeated team/date/home/away entries use the last valid row.

The six published CSV URLs are configured with:

- `VITE_RESULTS_VARSITY_BOYS_SOCCER_URL`
- `VITE_RESULTS_VARSITY_GIRLS_SOCCER_URL`
- `VITE_RESULTS_VARSITY_BOYS_VOLLEYBALL_URL`
- `VITE_RESULTS_VARSITY_GIRLS_VOLLEYBALL_URL`
- `VITE_RESULTS_SMP_BOYS_BASKETBALL_URL`
- `VITE_RESULTS_SMP_GIRLS_BASKETBALL_URL`

See [the administrator handoff](docs/results-sheets-administrator-handoff.md) for the native Sheet links, publication status, and access-risk notes.

## Deployment

The prototype is not deployed to a second hosting provider. Contributors check out the `prototype` branch and run `npm run dev:prototype`.

### Free Google Sheets synchronization

The public Google Sheets are synchronized during the production build instead of being fetched through a runtime proxy. Run `npm run sync:sheets` to validate every configured public CSV and write `public/data/sheets-cache.json`. The browser reads that same-origin cache from Firebase Hosting.

The production workflow refreshes the cache on every `main` release and checks for online Sheet changes every 5 minutes. Scheduled runs deploy only when the published data changed. This keeps synchronization on the Firebase Spark plan and removes the Netlify and Cloud Functions dependency.

### Firebase Hosting

One-time setup:

```bash
npm install
firebase login
firebase use --add
```

Deploy Firebase Hosting and Firestore rules on the Spark plan:

```bash
npm run deploy:firebase
```

Merges to `main` are verified and deployed by `.github/workflows/deploy-production.yml`. Configure these GitHub Actions secrets before merging a release:

- `FIREBASE_SERVICE_ACCOUNT_SPHLV_ATHLETICS`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Feature work is reviewed on `prototype`. A tested release is promoted from `prototype` to `main`; production hotfixes from `main` must be merged back into `prototype`.

Required Firebase project setup:

- Enable Authentication providers used by the app.
- Create Firestore in the Firebase console.
- Add the Firebase web app config values to `.env` or to the hosting provider's environment variables using the keys shown in `.env.example`.
