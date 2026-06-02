import { hasValidSheetUrl } from "../config/sheets";

export type CsvRow = Record<string, string>;

export async function fetchCsvRows(url: string): Promise<CsvRow[]> {
  if (!hasValidSheetUrl(url)) {
    return [];
  }

  const cacheBustedUrl = `${url}&cacheBust=${Date.now()}`;

  const response = await fetch(cacheBustedUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status}`);
  }

  const text = await response.text();
  return parseCsv(text);
}

export function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      current += '"';
      i++;
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
        i++;
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((header) =>
    header.trim().replace(/^\uFEFF/, "")
  );

  return rows
    .slice(1)
    .filter((cells) => cells.some((cell) => cell.trim() !== ""))
    .map((cells) => {
      const obj: CsvRow = {};

      headers.forEach((header, index) => {
        obj[header] = cells[index]?.trim() || "";
      });

      return obj;
    });
}
