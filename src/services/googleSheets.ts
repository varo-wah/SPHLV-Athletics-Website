import { hasValidSheetUrl } from "../config/sheets";

export type CsvRow = Record<string, string>;

interface SheetCacheEntry {
  label: string;
  csv: string;
}

export interface SheetCachePayload {
  version: 1;
  generatedAt: string;
  sources: Record<string, SheetCacheEntry>;
}

const SHEET_CACHE_PATH = "/data/sheets-cache.json";
const SHEET_CACHE_TTL_MS = 45_000;
let cachedPayload: { loadedAt: number; payload: SheetCachePayload } | null = null;
let cacheRequest: Promise<SheetCachePayload> | null = null;

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
  const cache = await loadSheetCache();
  const entry = cache.sources[url];

  if (!entry) {
    throw new Error("Published sheet is missing from the deployed cache");
  }

  return entry.csv;
}

export function parseSheetCachePayload(value: unknown): SheetCachePayload {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid Sheets cache payload");
  }

  const candidate = value as Partial<SheetCachePayload>;
  if (
    candidate.version !== 1 ||
    typeof candidate.generatedAt !== "string" ||
    !candidate.sources ||
    typeof candidate.sources !== "object"
  ) {
    throw new Error("Invalid Sheets cache payload");
  }

  for (const entry of Object.values(candidate.sources)) {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.label !== "string" ||
      typeof entry.csv !== "string"
    ) {
      throw new Error("Invalid Sheets cache entry");
    }
  }

  return candidate as SheetCachePayload;
}

async function loadSheetCache(): Promise<SheetCachePayload> {
  const now = Date.now();
  if (cachedPayload && now - cachedPayload.loadedAt < SHEET_CACHE_TTL_MS) {
    return cachedPayload.payload;
  }

  if (cacheRequest) return cacheRequest;

  cacheRequest = (async () => {
    const response = await fetch(SHEET_CACHE_PATH, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load deployed Sheets cache: ${response.status}`);
    }

    const payload = parseSheetCachePayload(await response.json());
    cachedPayload = { loadedAt: Date.now(), payload };
    return payload;
  })();

  try {
    return await cacheRequest;
  } finally {
    cacheRequest = null;
  }
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

    const looksLikeHomeAwayResultsHeader =
      normalizedRow.includes("date") &&
      normalizedRow.includes("home team") &&
      normalizedRow.includes("home score") &&
      normalizedRow.includes("away team") &&
      normalizedRow.includes("away score");

    if (looksLikeMatchHeader || looksLikeStandingsHeader || looksLikeHomeAwayResultsHeader) {
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
