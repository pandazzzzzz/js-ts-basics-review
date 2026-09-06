/**
 * register-ts-node.mjs — register the ts-node ESM loader via module.register().
 *
 * Non-deprecated equivalent of `node --loader ts-node/esm` (Node >= 20.6).
 * `--import ts-node/esm` does NOT work: ts-node@10 only ships loader hooks,
 * it has no self-registering entry, so the hooks must be registered here.
 * parentURL = import.meta.url resolves "ts-node/esm" from this repo's
 * node_modules regardless of the process cwd.
 * Used by run-ts.cjs as: node --import scripts/register-ts-node.mjs <file.ts>
 */
import { register } from "node:module";

register("ts-node/esm", import.meta.url);
