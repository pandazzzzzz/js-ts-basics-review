/**
 * verify-consistency.js — automated consistency checks for the demo corpus.
 *
 * Closes the "verification blind spot" documented in CLAUDE.md: ES version
 * data used to be reconciled only by hand. This script checks:
 *
 *   1. Every demo verification block matches a reference/ entry and its
 *      status/stage4Date/stage4DateType agree with it
 *   2. Every reference/ feature is covered by at least one demo block
 *   3. Every JS demo has a -ts-comparison.ts counterpart (and vice versa)
 *   4. Filenames referenced across demo/docs/README actually exist
 *   5. Difficulty tags and `export {}` ESM markers cover every demo file
 *
 * Usage: npm run verify   (exits non-zero on any failure)
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];
const fail = msg => failures.push(msg);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// Reference feature keys are canonical; normalize block names for matching.
const norm = s =>
  s
    .toLowerCase()
    .replace(/^array\/\s*string\.prototype\./, "")
    .replace(/^array\.prototype\s*\/\s*/, "")
    .replace(/\s*\/\s*/g, " ")
    .trim();

// ---------- load reference data ----------
const reference = {};
for (const f of ["finished.json", "early.json", "active.json", "withdrawn.json"]) {
  const j = JSON.parse(fs.readFileSync(path.join(root, "reference", f), "utf8"));
  for (const [k, v] of Object.entries(j.features || j)) {
    reference[k] = { ...v, refFile: f };
  }
}
const refByNorm = new Map(Object.keys(reference).map(k => [norm(k), k]));

// ---------- collect demo files ----------
const demoDir = path.join(root, "demo");
const allFiles = walk(demoDir);
const jsFiles = allFiles.filter(f => f.endsWith(".js"));
const tsFiles = allFiles.filter(f => f.endsWith(".ts"));

// ---------- parse verification blocks (both comment styles) ----------
const blocks = [];
for (const f of jsFiles) {
  const rel = path.relative(root, f);
  const lines = fs.readFileSync(f, "utf8").split("\n");
  let cur = null;
  lines.forEach((line, i) => {
    // Close-before-open: guards against a same-line-closed opener like
    // `/* verification: foo */` keeping the block open forever.
    if (cur && (/\*\//.test(line) || /=\= end verification block ==/i.test(line))) {
      cur = null;
    }
    // Both block styles open with a bare "verification:" line; the trailing
    // style adds `==` decorations. Require nothing after the colon so a
    // hypothetical one-line payload is skipped rather than mis-absorbed.
    if (/verification:\s*$|^\s*\/\/ == verification block ==/.test(line)) {
      cur = { file: rel, line: i + 1 };
      blocks.push(cur);
      return;
    }
    if (!cur) return;
    let m;
    if ((m = line.match(/(?:\*|\/\/)\s*feature:\s*(.+)/))) cur.feature = m[1].trim();
    else if ((m = line.match(/(?:\*|\/\/)\s*status:\s*(.+)/))) cur.status = m[1].trim();
    else if ((m = line.match(/(?:\*|\/\/)\s*stage4Date:\s*(\S+)/))) cur.stage4Date = m[1];
    else if ((m = line.match(/(?:\*|\/\/)\s*stage4DateType:\s*(\S+)/))) cur.stage4DateType = m[1];
    else if ((m = line.match(/(?:\*|\/\/)\s*lastVerified:\s*(\S+)/))) cur.lastVerified = m[1];
  });
}

// ---------- check 1+2: block ↔ reference reconciliation ----------
const covered = new Set();
const warnings = [];
for (const b of blocks) {
  if (!b.feature) {
    fail(`${b.file}:${b.line} — verification block has no "feature:" field`);
    continue;
  }
  const key = refByNorm.get(norm(b.feature));
  if (!key) {
    fail(`${b.file}:${b.line} — feature "${b.feature}" not found in reference/`);
    continue;
  }
  covered.add(key);
  const r = reference[key];
  for (const field of ["status", "stage4Date", "stage4DateType"]) {
    if (b[field] && r[field] && b[field] !== r[field]) {
      fail(
        `${b.file}:${b.line} — "${key}" ${field}: demo says ${b[field]}, reference says ${r[field]}`
      );
    } else if (r[field] && !b[field]) {
      // informational: block omits a field the reference could contradict
      warnings.push(`${b.file}:${b.line} — "${key}" block omits "${field}"`);
    }
  }
}
for (const key of Object.keys(reference)) {
  if (!covered.has(key))
    fail(`reference entry "${key}" (${reference[key].refFile}) has no demo verification block`);
}

// ---------- check 3: JS ↔ TS pairing ----------
const basenames = new Set(allFiles.map(f => path.basename(f)));
for (const f of jsFiles) {
  const pair = path.basename(f).replace(/\.js$/, "-ts-comparison.ts");
  if (!basenames.has(pair))
    fail(`${path.relative(root, f)} is missing its TypeScript counterpart ${pair}`);
}
for (const f of tsFiles) {
  const pair = path.basename(f).replace(/-ts-comparison\.ts$/, ".js");
  if (!basenames.has(pair))
    fail(`${path.relative(root, f)} is missing its JavaScript counterpart ${pair}`);
}

// ---------- check 4: referenced demo filenames exist ----------
// Case-insensitive so a wrong-case reference is matched and then flagged
// (all actual demo filenames are lowercase).
const refRe = /\b\d{2}(?:-\d)?-[a-z0-9-]+(?:-ts-comparison)?\.(?:js|ts)\b/gi;
const docFiles = [
  ...walk(path.join(root, "docs")).filter(f => f.endsWith(".md")),
  path.join(root, "README.md"),
  path.join(root, "CONTRIBUTING.md"),
].filter(f => fs.existsSync(f));
for (const f of [...allFiles, ...docFiles]) {
  const text = fs.readFileSync(f, "utf8");
  let m;
  while ((m = refRe.exec(text)) !== null) {
    if (!basenames.has(m[0])) {
      fail(`${path.relative(root, f)} references non-existent demo file "${m[0]}"`);
    }
  }
}

// ---------- check 5: difficulty tags + ESM markers ----------
for (const f of allFiles) {
  const rel = path.relative(root, f);
  const text = fs.readFileSync(f, "utf8");
  if (!text.includes("🎯 Difficulty:")) fail(`${rel} is missing a 🎯 Difficulty tag`);
  if (f.endsWith(".js") && !text.includes("export {}"))
    fail(`${rel} is missing the "export {}" ESM marker`);
}

// ---------- check 6: ToC ↔ body section alignment (JS demos) ----------
// Every Table-of-Contents entry number must exist as a numbered body section,
// and appear in the same order. Extra numbered lines in the body (e.g. numbered
// best-practice lists) are tolerated. Requires a space after the leading dot so
// `N.M` sub-section headers (e.g. "// 12.5 QUEUEMICROTASK") don't match.
const isFrame = l => /^\/\/ ={10,}\s*$/.test((l || "").trim());
for (const f of jsFiles) {
  const rel = path.relative(root, f);
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  let t = -1;
  for (let i = 0; i < lines.length; i++)
    if (/^\/\/\s*Table of Contents\s*$/.test(lines[i].trim())) {
      t = i;
      break;
    }
  if (t === -1) {
    fail(`${rel} has no Table of Contents`);
    continue;
  }

  // ToC entries: consecutive entry/blank/frame lines after the header's own frame
  const tocNums = [];
  let bodyStart = -1;
  let carriedNum = null; // body's first header absorbed into the ToC scan (dup number)
  for (let i = t + 2; i < lines.length; i++) {
    const line = lines[i];
    if (isFrame(line) || line.trim() === "") continue;
    const m = line.match(/^\/\/\s*(\d+[a-z]?)\.\s(\S)/);
    if (m && !tocNums.includes(m[1])) {
      tocNums.push(m[1]);
      continue;
    }
    if (m) carriedNum = m[1]; // duplicate number = the body's first section header
    bodyStart = i;
    break;
  }
  if (tocNums.length === 0) {
    fail(`${rel} has an empty Table of Contents`);
    continue;
  }
  if (bodyStart === -1) {
    fail(`${rel} ToC region never terminates`);
    continue;
  }

  // Body section numbers after the ToC region
  const bodyNums = [];
  if (carriedNum) bodyNums.push(carriedNum);
  for (let i = bodyStart; i < lines.length; i++) {
    let m = lines[i].match(/^\/\/\s*(\d+[a-z]?)\.\s(\S)/);
    if (!m) m = lines[i].match(/^\/\/\s*Section (\d+):\s(\S)/);
    if (m) bodyNums.push(m[1]);
  }

  // (a) every ToC number present in the body
  const missing = tocNums.filter(n => !bodyNums.includes(n));
  if (missing.length) fail(`${rel} — ToC section(s) missing from body: ${missing.join(", ")}`);
  // Numbered list items inside sections (e.g. best-practice lists) also match;
  // they are informational, not failures — only warn when MANY extras appear.
  const extraSections = [...new Set(bodyNums.filter(n => !tocNums.includes(n)))];
  if (extraSections.length > 2)
    console.log(
      `ℹ️  ${rel} — ${extraSections.length} numbered body item(s) beyond the ToC (likely list items): ${extraSections.join(", ")}`
    );

  // (b) ToC numbers appear in body in the same order (subsequence match)
  let cursor = 0;
  for (const n of tocNums) {
    const at = bodyNums.indexOf(n, cursor);
    if (at === -1) {
      if (!missing.includes(n)) fail(`${rel} — ToC section ${n} is out of order in the body`);
      continue;
    }
    cursor = at + 1;
  }
}

// ---------- check 7: EOL & encoding consistency ----------
// Adapted from the (unmerged) fix-runtime-errors health-check script. Fails on
// files with MIXED line endings, a missing final newline, or a UTF-8 BOM —
// .editorconfig/.gitattributes make CRLF-in-working-tree and LF-in-index both
// legitimate, so a uniform LF-only file is reported as info, not failure.
{
  const eolFiles = [
    ...new Set([
      ...allFiles,
      ...docFiles,
      path.join(root, "CONTRIBUTING.md"),
      ...walk(path.join(root, "reference")).filter(f => f.endsWith(".json")),
    ]),
  ];
  let crlfOnly = 0,
    lfOnly = 0,
    lfListed = 0;
  for (const f of eolFiles) {
    const rel = path.relative(root, f);
    const content = fs.readFileSync(f, "utf8");
    const crlfCount = (content.match(/\r\n/g) || []).length;
    const totalLF = (content.match(/\n/g) || []).length;
    const bareLF = totalLF - crlfCount;
    if (crlfCount > 0 && bareLF > 0) {
      fail(`${rel} has mixed line endings (${crlfCount} CRLF + ${bareLF} bare LF)`);
    }
    if (content.startsWith("\uFEFF")) fail(`${rel} starts with a UTF-8 BOM`);
    if (content.length > 0 && !/\n$/.test(content)) {
      fail(`${rel} is missing a final newline`);
    }
    if (crlfCount > 0) crlfOnly++;
    else if (totalLF > 0) {
      lfOnly++;
      if (lfListed < 5) {
        console.log(
          `ℹ️  ${rel} is LF-only (git normalizes on commit — fine, listed for visibility)`
        );
      }
      lfListed++;
    }
  }
  console.log(`EOL scan: ${eolFiles.length} files · CRLF-only: ${crlfOnly} · LF-only: ${lfOnly}`);
}

// ---------- report ----------
console.log(`Demo files: ${jsFiles.length} JS + ${tsFiles.length} TS`);
console.log(
  `Verification blocks: ${blocks.length} · Reference entries: ${Object.keys(reference).length}`
);
if (failures.length === 0) {
  console.log("✅ verify-consistency: all checks passed");
  if (warnings.length > 0) {
    console.log(
      `ℹ️  ${warnings.length} informational note(s) (blocks omitting fields the reference could contradict):`
    );
    for (const w of warnings.slice(0, 10)) console.log("  · " + w);
    if (warnings.length > 10) console.log(`  · … and ${warnings.length - 10} more`);
  }
  process.exit(0);
}
console.error(`\n❌ ${failures.length} consistency problem(s):`);
for (const p of failures) console.error("  - " + p);
process.exit(1);
