import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

const isAllowedSheetUrl = (value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'docs.google.com' &&
      url.pathname.includes('/spreadsheets/') &&
      url.searchParams.get('output') === 'csv'
    );
  } catch {
    return false;
  }
};

app.get('/api/sheets', async (req, res) => {
  const sheetUrl = String(req.query.url || '');

  if (!isAllowedSheetUrl(sheetUrl)) {
    res.status(400).send('Invalid sheet URL');
    return;
  }

  try {
    const response = await fetch(sheetUrl, {
      headers: {
        'User-Agent': 'SPHLV-Athletics-Website/1.0',
      },
    });

    if (!response.ok) {
      res.status(response.status).send(`Failed to fetch sheet CSV: ${response.status}`);
      return;
    }

    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Cache-Control', 'no-store');
    res.send(await response.text());
  } catch (error) {
    res.status(502).send(error instanceof Error ? error.message : 'Failed to fetch sheet CSV');
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`SPHLV Athletics server running on http://localhost:${port}`);
});
