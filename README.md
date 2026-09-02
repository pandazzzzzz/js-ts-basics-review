# JS/TS Fundamentals Review

JavaScript/TypeScript fundamentals — 76 JS demo files + 76 TypeScript comparison files, covering ES2020–ES2027.

## Quick Start

```bash
# First, install dependencies (required for TS comparison files and type checking)
npm install

# Run a JS demo
node demo/01-basics/01-variables.js
node demo/06-advanced/es-features/39-5-es2025-features.js   # ES2025 features

# Run a TS comparison file (after npm install)
node --loader ts-node/esm demo/01-basics/01-variables-ts-comparison.ts

# Type-check all TS files
npm run typecheck

# Format all demo files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check
```

## Requirements

| Feature | Node.js | TypeScript |
|---------|---------|------------|
| ES2022+ basics | 18+ | 5+ |
| ES2025 (Set methods, Iterator helpers, Promise.try) | 22+ | 5.2+ |
| ES2027 (Temporal, Explicit Resource Management) | Not yet | Community types needed |

> Temporal API is ES2027 (Stage 4); TypeScript has no built-in types, use `@js-temporal/polyfill`.

## Formatting

This project uses Prettier for consistent code formatting across all demo files and TypeScript comparisons.

- Configuration: `.prettierrc` (100-char width, 2-space indent, double quotes, ES5 trailing commas)
- Exclusions: `.prettierignore` (docs/, local files, dependencies, git metadata)
- Apply formatting: `npm run format`
- Check formatting: `npm run format:check`

> Demo files contain intentional anti-patterns for teaching purposes; ESLint is intentionally omitted to avoid noise.

## Status

✅ 76/76 JS + 76/76 TS complete · 6 long files split into 27 focused sub-files · All use ESM (`export {}`) strict mode
📅 Updated 2026-08-21 · 📊 Coverage: Stages 1-6 Complete

## Documentation

- [TODOLIST.md](docs/TODOLIST.md) — Learning roadmap
- [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) — JS vs TS quick reference

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ts-node` not found | `npm install` (ts-node is a dev dependency) |
| ES2022+ syntax error | Ensure Node.js 18+; ES2025 requires 22+ |
| TypeScript type errors | Run `npx tsc --noEmit`; verify tsconfig.json |
| TS comparison won't run | Browser-DOM (35–38, 43, 45, 48) and future-ES (39-4/39-6/39-7) demos need a browser or newer runtime; files containing Stage 2.7 decorator snippets (16, 17, 39-7, 50, plus isolated decorator sections in 44 and 46) may require `experimentalDecorators` for those specific sections — the rest of each file runs normally. See each file's header. |

## References

[javascript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) · [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
