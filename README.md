# SPHLV Athletics Website

Live athletics site for SPH LV schedules, standings, team pages, and match results.

## Current Data Scope

- Soccer Matches and Soccer Standings are synced from published Google Sheets CSV URLs.
- Basketball and other sports are intentionally disabled until their published sheet URLs are ready.
- Netlify production uses `/api/sheets` through a Netlify Function so Google Sheets CSV fetches do not fail in the browser.

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Vite dev server:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite.

## Verification

```bash
npm run lint
npm run build
```

## Deployment

Netlify builds with `npm run build`, publishes `dist`, and serves the sheets proxy from `netlify/functions/sheets.mts`.

### Firebase Hosting

Firebase Hosting also publishes `dist`, but it must route `/api/sheets` to the Firebase Function in `functions/index.js`. Without that function, Google Sheets sync will fail on Firebase the same way it failed on Netlify before the Netlify Function existed.

One-time setup:

```bash
npm install
cd functions && npm install && cd ..
firebase login
firebase use --add
```

Deploy:

```bash
npm run deploy:firebase
```

Required Firebase project setup:

- Enable Authentication providers used by the app.
- Create Firestore in the Firebase console.
- Add the Firebase web app config values to `.env` or to the hosting provider's environment variables using the keys shown in `.env.example`.
