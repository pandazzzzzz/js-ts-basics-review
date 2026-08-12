# JS/TS Fundamentals Review

JavaScript/TypeScript fundamentals — 76 JS demo files + 76 TypeScript comparison files, covering ES2020–ES2027.

## Quick Start

```bash
# Run a JS demo
node demo/01-basics/01-variables.js
node demo/06-advanced/39.5-es2025-features.js   # ES2025 features

# Run a TS comparison file (auto-installs ts-node on first run)
npx ts-node demo/01-basics/01-variables-ts-comparison.ts

# Type-check all TS files
npx tsc --noEmit
```

## Requirements

| Feature | Node.js | TypeScript |
|---------|---------|------------|
| ES2022+ basics | 18+ | 5+ |
| ES2025 (Set methods, Iterator helpers, Promise.try) | 22+ | 5.2+ |
| ES2027 (Temporal, Explicit Resource Management) | Not yet | Community types needed |

> Temporal API is ES2027 (Stage 4); TypeScript has no built-in types, use `@js-temporal/polyfill`.

## Status

✅ 76/76 JS + 76/76 TS complete · 6 long files split into 27 focused sub-files · All use ESM (`export {}`) strict mode
📅 Updated 2026-08-12 · 📊 Coverage: Stages 1-6 Complete

## Documentation

- [TODOLIST.md](docs/TODOLIST.md) — Learning roadmap
- [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) — JS vs TS quick reference

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ts-node` not found | `npx ts-node` auto-installs on first run |
| ES2022+ syntax error | Ensure Node.js 18+; ES2025 requires 22+ |
| TypeScript type errors | Run `npx tsc --noEmit`; verify tsconfig.json |

## References

[javascript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) · [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
