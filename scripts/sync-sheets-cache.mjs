import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(repoRoot, "src/config/sheetSources.json");
const outputPath = path.join(repoRoot, "public/data/sheets-cache.json");
const sourceConfig = JSON.parse(await fs.readFile(configPath, "utf8"));

const resultSources = sourceConfig.results.map((source) => ({
  label: source.displayName,
  type: "results",
  url: process.env[source.envKey] || source.url,
}));
const scheduleSources = sourceConfig.masterSchedules
  .filter((source) => source.season !== "Season 1")
  .map((source) => ({ label: source.season, type: "schedule", url: source.url }));
const standingSources = Object.entries(sourceConfig.standings)
  .filter(([, url]) => Boolean(url))
  .map(([label, url]) => ({ label: `${label} standings`, type: "standings", url }));
const sources = [...resultSources, ...scheduleSources, ...standingSources];

function assertExpectedCsv(source, csv) {
  const normalized = csv.toLowerCase();
  if (!csv.trim()) throw new Error(`${source.label} returned an empty CSV`);
  if (source.type === "results" && !normalized.includes("home team")) {
    throw new Error(`${source.label} is missing the results header`);
  }
  if (source.type === "standings" && !normalized.includes("team")) {
    throw new Error(`${source.label} is missing the standings header`);
  }
  if (source.type === "schedule" && !normalized.includes("season")) {
    throw new Error(`${source.label} is missing the schedule title`);
  }
}

async function fetchSource(source) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(source.url, {
        headers: { "User-Agent": "SPHLV-Athletics-Website/1.0" },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        throw new Error(`${source.label} returned HTTP ${response.status}`);
      }

      const csv = await response.text();
      assertExpectedCsv(source, csv);
      return [source.url, { label: source.label, csv }];
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw new Error(`${source.label} failed after 3 attempts`, { cause: lastError });
}

const entries = [];
for (let index = 0; index < sources.length; index += 3) {
  entries.push(...await Promise.all(sources.slice(index, index + 3).map(fetchSource)));
}
const generatedSources = Object.fromEntries(entries);
let changedFromDeployment = true;

if (process.env.DEPLOYED_CACHE_URL) {
  try {
    const deployedResponse = await fetch(process.env.DEPLOYED_CACHE_URL, {
      headers: { "User-Agent": "SPHLV-Athletics-Website/1.0" },
      signal: AbortSignal.timeout(15_000),
    });
    if (deployedResponse.ok) {
      const deployedPayload = await deployedResponse.json();
      changedFromDeployment = JSON.stringify(deployedPayload.sources) !== JSON.stringify(generatedSources);
    }
  } catch {
    changedFromDeployment = true;
  }
}

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  sources: generatedSources,
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const temporaryPath = `${outputPath}.tmp`;
await fs.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
await fs.rename(temporaryPath, outputPath);
if (process.env.GITHUB_OUTPUT) {
  await fs.appendFile(process.env.GITHUB_OUTPUT, `changed=${changedFromDeployment}\n`, "utf8");
}
console.log(`Cached ${entries.length} published Google Sheets in ${path.relative(repoRoot, outputPath)}`);
console.log(`Published data changed: ${changedFromDeployment}`);
