import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Connect} from 'vite';

const isAllowedSheetUrl = (value: string): boolean => {
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

const sheetsProxy = (): Connect.NextHandleFunction => async (req, res, next) => {
  if (!req.url?.startsWith('/api/sheets')) {
    next();
    return;
  }

  const requestUrl = new URL(req.url, 'http://localhost');
  const sheetUrl = requestUrl.searchParams.get('url') ?? '';

  if (!isAllowedSheetUrl(sheetUrl)) {
    res.statusCode = 400;
    res.end('Invalid sheet URL');
    return;
  }

  try {
    const response = await fetch(sheetUrl, {
      headers: {
        'User-Agent': 'SPHLV-Athletics-Website/1.0',
      },
    });

    if (!response.ok) {
      res.statusCode = response.status;
      res.end(`Failed to fetch sheet CSV: ${response.status}`);
      return;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(await response.text());
  } catch (error) {
    res.statusCode = 502;
    res.end(error instanceof Error ? error.message : 'Failed to fetch sheet CSV');
  }
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'sheets-proxy',
        configureServer(server) {
          server.middlewares.use(sheetsProxy());
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
