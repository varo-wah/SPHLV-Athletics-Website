const { onRequest } = require("firebase-functions/v2/https");

const isAllowedSheetUrl = (value) => {
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

exports.sheets = onRequest(
  {
    cors: false,
    region: "us-central1",
  },
  async (request, response) => {
    if (request.method !== "GET") {
      response.set("Allow", "GET");
      response.status(405).send("Method not allowed");
      return;
    }

    const sheetUrl = request.query.url || "";

    if (typeof sheetUrl !== "string" || !isAllowedSheetUrl(sheetUrl)) {
      response.status(400).send("Invalid sheet URL");
      return;
    }

    try {
      const sheetResponse = await fetch(sheetUrl, {
        headers: {
          "User-Agent": "SPHLV-Athletics-Website/1.0",
        },
      });

      if (!sheetResponse.ok) {
        response
          .status(sheetResponse.status)
          .send(`Failed to fetch sheet CSV: ${sheetResponse.status}`);
        return;
      }

      response.set("Content-Type", "text/csv; charset=utf-8");
      response.set("Cache-Control", "no-store");
      response.status(200).send(await sheetResponse.text());
    } catch (error) {
      response
        .status(502)
        .send(error instanceof Error ? error.message : "Failed to fetch sheet CSV");
    }
  }
);
