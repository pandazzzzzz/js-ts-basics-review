/**
 * verify-tc39.cjs — diff local reference/ data against the official TC39 lists.
 *
 * Offline `npm run verify` guards internal consistency; this script guards
 * staleness against the source of truth. It downloads the three official
 * markdown tables and reports (does not auto-fix) differences in:
 *
 *   1. Stage 4 features in finished-proposals.md vs finished.json
 *   2. Active proposals (Stage 2.7 / 2 / 1) vs active.json
 *   3. Local entries whose stage no longer matches the official table
 *   4. withdrawn.json entries that reappear in the official active lists
 *
 * Requires network. NOT part of CI — run manually when refreshing reference/
 * (the project's monthly verification cadence).
 *
 * Usage: npm run verify:tc39
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const SOURCES = {
  "tc39-finished.md": "https://raw.githubusercontent.com/tc39/proposals/main/finished-proposals.md",
  "tc39-readme.md": "https://raw.githubusercontent.com/tc39/proposals/main/README.md",
  "tc39-stage1.md": "https://raw.githubusercontent.com/tc39/proposals/main/stage-1-proposals.md",
  "tc39-402-finished.md":
    "https://raw.githubusercontent.com/tc39/proposals/main/ecma402/finished-proposals.md",
  "tc39-402-active.md": "https://raw.githubusercontent.com/tc39/proposals/main/ecma402/README.md",
};

function normKey(name) {
  return name
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/\((?:[^)]*)\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseTableRows(md) {
  const out = [];
  for (const m of md.matchAll(/^\| \[([^\]]+)\]/gm)) out.push(m[1].trim());
  return out;
}

function tableBetween(md, from, to) {
  const lines = md.split("\n");
  // Exact equality so "### Stage 2" does not also match "### Stage 2.7".
  const i = lines.findIndex(l => l.trim() === from);
  const j = lines.findIndex((l, idx) => idx > i && l.trim().startsWith(to));
  if (i === -1 || j === -1 || j <= i) return [];
  return parseTableRows(lines.slice(i, j).join("\n"));
}

// The finished table is newest-first; track only the era the project's
// finished.json covers (ES2016+). Earlier features live in early.json with
// milestone dates, out of scope here.
function recentFinished(rows) {
  // finished.json tracks ES2016-era features down to Array.prototype.includes
  // (the oldest row it records); everything older lives in early.json instead.
  const cut = rows.findIndex(n => normKey(n) === "array prototype includes");
  return cut === -1 ? rows : rows.slice(0, cut + 1);
}

// finished.json tracks a curated subset of the official finished list — names
// are intentionally short (e.g. "Set methods" vs "New Set methods") or split
// (Object.groupBy + Map.groupBy vs "Array Grouping"). Exact-name diffing would
// drown the signal in noise, so map each local key to a set of accepted
// aliases (official name fragments it was derived from).
const FINISHED_ALIASES = {
  using: ["explicit resource management"],
  disposablestack: ["explicit resource management"],
  "uint8array base64": ["uint8array to from base64"],
  "set methods": ["new set methods"],
  "iterator helpers": ["sync iterator helpers"],
  float16array: ["float16 on typedarrays dataview math f16round"],
  "redeclarable global eval vars": ["redeclarable global eval introduced vars"],
  "object groupby": ["array grouping"],
  "map groupby": ["array grouping"],
  "regexp v flag": ["regexp v flag with set notation properties of strings"],
  "resizable arraybuffer": ["resizable and growable arraybuffers"],
  tosorted: ["change array by copy"],
  toreversed: ["change array by copy"],
  with: ["change array by copy"],
  tospliced: ["change array by copy"],
  findlast: ["array find from last"],
  findlastindex: ["array find from last"],
  "hashbang syntax": ["hashbang grammar"],
  "object hasown": ["accessible object prototype hasownproperty"],
  "ergonomic brand checks": ["ergonomic brand checks for private fields"],
  "private class fields": ["class fields"],
  replaceall: ["string prototype replaceall"],
  "logical assignment": ["logical assignment operators"],
  weakref: ["weakrefs"],
  finalizationregistry: ["weakrefs"],
  aggregateerror: ["promise any"],
  "nullish coalescing": ["nullish coalescing operator"],
  "import dynamic import": ["import"],
  "trailing commas in function params": ["trailing commas in function parameter lists and calls"],
  "intl durationformat": ["intl durationformat"],
  "regexp s flag": ["s flag for regular expressions"],
};

// active.json is also a curated subset: it tracks only proposals the demos
// actually teach. Missing upstream proposals are NOT errors — that is the
// documented scope. Only flag local entries that drifted or vanished upstream.

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

(async () => {
  const offlineDir = process.env.VERIFY_TC39_OFFLINE_DIR;
  const loadDoc = ([file, url]) =>
    offlineDir
      ? Promise.resolve(fs.readFileSync(path.join(offlineDir, file), "utf8"))
      : fetchText(url);
  const [finishedMd, readmeMd, stage1Md, fin402Md, act402Md] = await Promise.all(
    Object.entries(SOURCES).map(loadDoc)
  );

  const load = f => JSON.parse(fs.readFileSync(path.join(root, "reference", f), "utf8")).features;
  const finishedLocal = load("finished.json");
  const activeLocal = load("active.json");
  const withdrawnLocal = load("withdrawn.json");

  // 262 finished is newest-first — keep only the era finished.json tracks
  // (ES2016+). The ECMA-402 finished list is short; keep it whole.
  const officialFinished = [
    ...recentFinished(parseTableRows(finishedMd)),
    ...parseTableRows(fin402Md),
  ];
  const officialStage27 = tableBetween(readmeMd, "### Stage 2.7", "### Stage 2");
  const officialStage2 = tableBetween(readmeMd, "### Stage 2", "## Contributing");
  const officialStage1 = parseTableRows(stage1Md);

  const notes = [];

  // finished: official → local (new Stage 4 not yet recorded).
  // Only the ECMA-262 list is checked this direction: finished.json is a
  // curated teaching subset and only tracks Intl.DurationFormat from the
  // ECMA-402 finished list (other Intl features are out of scope).
  const localFin = new Set(Object.keys(finishedLocal).map(normKey));
  // Reverse-alias index: official key → local key(s) that legitimately cover it
  const aliasCovers = new Set(Object.entries(FINISHED_ALIASES).flatMap(([, list]) => list));
  for (const name of recentFinished(parseTableRows(finishedMd))) {
    const k = normKey(name);
    if (!localFin.has(k) && !aliasCovers.has(k))
      notes.push(`finished.json is MISSING new Stage 4 feature: "${name}"`);
  }
  // finished: local → official (renamed or moved). Includes the ECMA-402
  // finished list so Intl entries can resolve.
  const officialFin = new Map(officialFinished.map(n => [normKey(n), n]));
  for (const name of Object.keys(finishedLocal)) {
    const k = normKey(name);
    const ok = officialFin.has(k) || (FINISHED_ALIASES[k] || []).some(a => officialFin.has(a));
    if (!ok)
      notes.push(
        `finished.json entry "${name}" not found in official finished list (renamed? moved to early.json?)`
      );
  }

  // active: official → local is intentionally NOT checked: active.json is a
  // curated subset (only proposals the demos teach), so a proposal being
  // absent from active.json is scope, not drift. Only local → official below.
  // active: local → official (stage mismatch / removed)
  const officialActive = new Map([
    ...officialStage27.map(n => [normKey(n), "Stage 2.7"]),
    ...officialStage2.map(n => [normKey(n), "Stage 2"]),
    ...officialStage1.map(n => [normKey(n), "Stage 1"]),
    // ECMA-402 (Intl) proposals live in their own table; treat its Stage 1
    // rows as authoritative for Intl.* entries tracked in active.json.
    ...tableBetween(act402Md, "### Stage 1", "### Contributing").map(n => [normKey(n), "Stage 1"]),
  ]);
  for (const [name, entry] of Object.entries(activeLocal)) {
    const officialStage = officialActive.get(normKey(name));
    if (!officialStage)
      notes.push(
        `active.json entry "${name}" not in any official active list (finished? withdrawn? renamed?)`
      );
    else if (officialStage !== entry.status)
      notes.push(
        `active.json entry "${name}" says ${entry.status}, official list says ${officialStage}`
      );
  }

  // withdrawn sanity: a withdrawn entry should never be active upstream again
  for (const name of Object.keys(withdrawnLocal)) {
    if (officialActive.has(normKey(name)))
      notes.push(`withdrawn.json entry "${name}" appears in the official active lists`);
  }

  console.log(
    `Official: ${officialFinished.length} finished (tracked era) · ${officialStage27.length} Stage 2.7 · ${officialStage2.length} Stage 2 · ${officialStage1.length} Stage 1`
  );
  if (notes.length === 0) {
    console.log("✅ verify-tc39: reference data matches the official TC39 lists");
    process.exit(0);
  }
  console.log(`⚠️  verify-tc39: ${notes.length} difference(s) between reference/ and TC39:`);
  for (const n of notes) console.log(`  - ${n}`);
  process.exit(1);
})().catch(err => {
  console.error("❌ verify-tc39 failed to fetch/parse official data:", err.message);
  console.error("   (network required — run outside a sandbox or with approval)");
  process.exit(1);
});
