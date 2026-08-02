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
npm run lint
npm run build:production
npm run build:prototype
```

## Deployment

The prototype is not deployed to a second hosting provider. Contributors check out the `prototype` branch and run `npm run dev:prototype`. Firebase production builds may set `VITE_SHEETS_PROXY_BASE_URL` to the existing sheets proxy origin when Firebase Functions are unavailable on the current plan.

### Firebase Hosting

Firebase Hosting also publishes `dist`, but it must route `/api/sheets` to the Firebase Function in `functions/index.js`. Without that function, Google Sheets sync will fail on Firebase the same way it failed on Netlify before the Netlify Function existed.

One-time setup:

```bash
npm install
cd functions && npm install && cd ..
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
- `VITE_SHEETS_PROXY_BASE_URL`

Feature work is reviewed on `prototype`. A tested release is promoted from `prototype` to `main`; production hotfixes from `main` must be merged back into `prototype`.

Deploy Hosting, Firestore rules, and Firebase Functions after upgrading to Blaze:

```bash
npm run deploy:firebase:full
```

Required Firebase project setup:

- Enable Authentication providers used by the app.
- Create Firestore in the Firebase console.
- Add the Firebase web app config values to `.env` or to the hosting provider's environment variables using the keys shown in `.env.example`.
