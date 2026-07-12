const ALLOWED_ORIGINS = new Set([
  "https://sphlv-athletics.web.app",
  "https://sphlv-athletics.firebaseapp.com",
]);

const ALLOWED_SPREADSHEET_IDS = new Set([
  "2PACX-1vQHaYs7n4UH_LqQPwGlDJzBlO8LQP0VXvX-l4uB-jvj_240jNrtBZmaXohGj5j7rg",
  "2PACX-1vQN3pbSoFSwKAOPx4ifplCAWQP6GYR1Hav_lIiVGI8WUQz7QlVWkx9CxXETFT2Opg",
]);

const corsHeaders = (origin: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
};

const isAllowedSheetUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    const pathParts = url.pathname.split("/");
    const publishedId = pathParts[pathParts.indexOf("e") + 1];

    return (
      url.protocol === "https:" &&
      url.hostname === "docs.google.com" &&
      url.pathname.startsWith("/spreadsheets/d/e/") &&
      url.pathname.endsWith("/pub") &&
      ALLOWED_SPREADSHEET_IDS.has(publishedId) &&
      url.searchParams.get("output") === "csv"
    );
  } catch {
    return false;
  }
};

export const config = {
  path: "/api/sheets",
};

export default async function handler(request: Request): Promise<Response> {
  const origin = request.headers.get("Origin");
  const responseCorsHeaders = corsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: responseCorsHeaders,
    });
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        ...responseCorsHeaders,
        "Allow": "GET",
        "Cache-Control": "no-store",
      },
    });
  }

  const requestUrl = new URL(request.url);
  const sheetUrl = requestUrl.searchParams.get("url") ?? "";

  if (!isAllowedSheetUrl(sheetUrl)) {
    return new Response("Invalid sheet URL", {
      status: 400,
      headers: {
        ...responseCorsHeaders,
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    const response = await fetch(sheetUrl, {
      headers: {
        "User-Agent": "SPHLV-Athletics-Website/1.0",
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch sheet CSV: ${response.status}`, {
        status: response.status,
        headers: {
          ...responseCorsHeaders,
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        ...responseCorsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
        "Netlify-CDN-Cache-Control": "public, durable, max-age=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Failed to fetch sheet CSV",
      {
        status: 502,
        headers: {
          ...responseCorsHeaders,
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
