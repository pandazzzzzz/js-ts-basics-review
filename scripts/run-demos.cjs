/**
 * run-demos.cjs — execute every JS demo and report failures.
 * Usage: npm test   (or: node scripts/run-demos.cjs)
 * Exit code: 0 when all demos pass, 1 otherwise.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) files.push(p);
  }
})(path.join(root, "demo"));
files.sort();

const ok = [];
const failures = [];
// One retry per file: network-dependent demos (33-x fetch series) occasionally
// hit transient connection resets that a single attempt would report as failures.
function runOnce(f) {
  execFileSync("node", [f], { timeout: 60000, stdio: "pipe" });
}
for (const f of files) {
  try {
    runOnce(f);
    ok.push(f);
  } catch (firstErr) {
    try {
      runOnce(f);
      ok.push(f);
      console.log(`retry pass: ${path.relative(root, f)} (first attempt failed)`);
    } catch (err) {
      const msg = (err.stderr ? err.stderr.toString() : err.message)
        .split("\n")
        .filter(l => l.trim())
        .slice(0, 2)
        .join(" | ");
      failures.push(`${path.relative(root, f)} :: ${msg.slice(0, 160)}`);
    }
  }
}

console.log(`Demo sweep: ${ok.length}/${files.length} passed`);
for (const f of failures) console.error("FAIL: " + f);
process.exit(failures.length === 0 ? 0 : 1);
