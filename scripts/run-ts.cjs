/**
 * run-ts.cjs — execute every TS comparison file and report failures.
 * Usage: npm run test:ts   (or: node scripts/run-ts.cjs)
 *
 * Strategy: run natively via Node's type stripping (`node file.ts`, Node >= 23.6).
 * Files that use non-erasable TypeScript syntax (enums, namespaces, angle-bracket
 * assertions) cannot be type-stripped; those fall back to ts-node automatically.
 * NOTE: network-dependent demos (33-x fetch series) need internet access.
 * Exit code: 0 when all files pass, 1 otherwise.
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
    else if (e.name.endsWith("-ts-comparison.ts")) files.push(p);
  }
})(path.join(root, "demo"));
files.sort();

const okNative = [];
const okTsNode = [];
const failures = [];

function errorHead(err) {
  return (err.stderr ? err.stderr.toString() : err.message)
    .split("\n")
    .filter(l => l.trim() && !/ExperimentalWarning|--import '|DeprecationWarning/.test(l))
    .slice(0, 2)
    .join(" | ")
    .slice(0, 160);
}

for (const f of files) {
  const rel = path.relative(root, f);
  // Up to two attempts per mode: fetch-dependent demos occasionally hit
  // transient connection resets that a single attempt would report as failures.
  const attempt = args => {
    try {
      execFileSync("node", args, { timeout: 90000, stdio: "pipe" });
      return true;
    } catch (err) {
      return err; // return the error object so callers can inspect it
    }
  };
  let firstErr = attempt([f]);
  if (firstErr === true) {
    okNative.push(rel);
    continue;
  }
  // One retry before falling back to ts-node
  firstErr = attempt([f]);
  if (firstErr === true) {
    okNative.push(rel);
    console.log(`retry pass: ${rel} (first native attempt failed)`);
    continue;
  }
  const nativeReason = errorHead(firstErr);
  let tsNodeErr = attempt(["--loader", "ts-node/esm", f]);
  if (tsNodeErr === true) {
    okTsNode.push(rel);
  } else {
    tsNodeErr = attempt(["--loader", "ts-node/esm", f]);
    if (tsNodeErr === true) {
      okTsNode.push(rel);
      console.log(`retry pass: ${rel} (first ts-node attempt failed)`);
    } else {
      failures.push(
        `${rel} :: native: ${nativeReason || "?"} :: ts-node: ${errorHead(tsNodeErr) || "?"}`
      );
    }
  }
}

console.log(
  `TS sweep: ${okNative.length + okTsNode.length}/${files.length} passed ` +
    `(native: ${okNative.length}, ts-node fallback: ${okTsNode.length})`
);
for (const f of failures) console.error("FAIL: " + f);
process.exit(failures.length === 0 ? 0 : 1);
