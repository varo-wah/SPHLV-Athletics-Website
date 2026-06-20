const isAllowedSheetUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "docs.google.com" &&
      url.pathname.includes("/spreadsheets/") &&
      url.searchParams.get("output") === "csv"
    );
  } catch {
    return false;
  }
};

export const config = {
  path: "/api/sheets",
  method: "GET",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        "Allow": "GET",
      },
    });
  }

  const requestUrl = new URL(request.url);
  const sheetUrl = requestUrl.searchParams.get("url") ?? "";

  if (!isAllowedSheetUrl(sheetUrl)) {
    return new Response("Invalid sheet URL", { status: 400 });
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
      });
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Failed to fetch sheet CSV",
      { status: 502 }
    );
  }
}
