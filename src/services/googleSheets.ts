import { hasValidSheetUrl } from "../config/sheets";

export type CsvRow = Record<string, string>;

export async function fetchCsvRows(url: string): Promise<CsvRow[]> {
  if (!hasValidSheetUrl(url)) {
    return [];
  }

  const text = await fetchCsvText(url);
  return parseCsv(text);
}

export async function fetchCsvMatrix(url: string): Promise<string[][]> {
  if (!hasValidSheetUrl(url)) {
    return [];
  }

  const text = await fetchCsvText(url);
  return parseCsvMatrix(text);
}

async function fetchCsvText(url: string): Promise<string> {
  const cacheBustedUrl = `/api/sheets?url=${encodeURIComponent(url)}&cacheBust=${Date.now()}`;

  const response = await fetch(cacheBustedUrl, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status}`);
  }

  return response.text();
}

export function parseCsvMatrix(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (current.length > 0 || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = "";
      }

      if (char === "\r" && next === "\n") {
        i += 1;
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  return rows;
}

export function parseCsv(text: string): CsvRow[] {
  const rows = parseCsvMatrix(text);

  if (rows.length === 0) {
    return [];
  }

  let headerIndex = 0;

  for (let i = 0; i < rows.length; i += 1) {
    const normalizedRow = rows[i].join(" ").toLowerCase();

    const looksLikeMatchHeader =
      (
        normalizedRow.includes("match id") ||
        normalizedRow.includes("game id") ||
        normalizedRow.includes("fixture id")
      ) &&
      (
        normalizedRow.includes("opponent") ||
        normalizedRow.includes("against") ||
        normalizedRow.includes("team")
      ) &&
      (
        normalizedRow.includes("lv goals") ||
        normalizedRow.includes("lv points") ||
        normalizedRow.includes("score for") ||
        normalizedRow.includes("points for") ||
        normalizedRow.includes("lv score")
      );

    const looksLikeStandingsHeader =
      normalizedRow.includes("team") &&
      (
        normalizedRow.includes("wins") ||
        normalizedRow.includes("w")
      ) &&
      (
        normalizedRow.includes("points") ||
        normalizedRow.includes("pts") ||
        normalizedRow.includes("pct")
      );

    if (looksLikeMatchHeader || looksLikeStandingsHeader) {
      headerIndex = i;
      break;
    }
  }

  const headers = rows[headerIndex].map((header, index) => {
    const cleaned = header.trim().replace(/^\uFEFF/, "");
    return cleaned || `Column ${index + 1}`;
  });

  return rows
    .slice(headerIndex + 1)
    .filter((cells) => cells.some((cell) => cell.trim() !== ""))
    .map((cells) => {
      const obj: CsvRow = {};

      headers.forEach((header, index) => {
        obj[header] = cells[index]?.trim() ?? "";
      });

      return obj;
    });
}
