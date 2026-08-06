# JS/TS Fundamentals Review

JavaScript/TypeScript fundamentals with 49 numbered demo files (01-50, 28 reserved) and TypeScript comparison files.

## Requirements

### Version Requirements by Feature

| Feature Category | Node.js | TypeScript |
|-----------------|---------|------------|
| ES2022+ (basics) | 18+ | 5+ |
| ES2027 Features | 22+ | 5.2+ |
| Temporal API (ES2027) | Future | N/A (use community types) |

**Note**:
- Node.js 18+ supports most ES2022+ features
- Node.js 22+ (April 2024) required for ES2025 Set methods, Iterator helpers, Promise.try
- Node.js 24+ (April 2025) required for ES2025 RegExp.escape
- Temporal API is ES2027 (conditional Stage 4 Mar 2026, delayed publication) - check future Node.js versions
- TypeScript does not include built-in Temporal types; use community type definitions (e.g., `@js-temporal/polyfill`) for type support
- TypeScript 5.2+ (August 2023) supports `using` declarations syntax (now ES2027, conditional Stage 4 since May 2025, still conditional as of 2026-03)

## Quick Start

```bash
# Run a JavaScript demo file
node demo/01-basics/01-variables.js
node demo/02-data-structures/06-arrays.js
node demo/06-advanced/39-es2022-plus-features.js    # ES2022+ index file
node demo/06-advanced/39.5-es2025-features.js      # Specific ES version: ES2025
node demo/06-advanced/39.7-es2027-future.js        # ES2027+ & future proposals

# Run TypeScript comparison files (uses npx ts-node, auto-installs on first run)
npx ts-node demo/01-basics/01-variables-ts-comparison.ts

# Type-check all TypeScript comparison files (uses tracked tsconfig.json)
npx tsc --noEmit
```

## Structure

**Stage 1 (01-05)**: Basics — Variables, operators, control flow, strings, numbers
**Stage 2 (06-12)**: Data Structures — Arrays, functions, objects, destructuring, Map/Set, JSON, dates
**Stage 3 (13-27)**: Core Concepts — Scope, this, prototypes, classes, ES6+, regex, iterators, Proxy
**Stage 4 (29-34)**: Async — Event loop, Promises, async/await, modules, Fetch, async error handling
**Stage 5 (35-38)**: Browser & DOM — DOM basics, manipulation, events, forms
**Stage 6 (39-50)**: Advanced — ES2022+ (split into 7 per-version files 39.1-39.7), debugging, typed arrays, Intl, patterns

## Progress

✅ 49/49 files completed · 49 TypeScript comparisons (+ 7 ES2022+ split files with their TS counterparts)
✅ ES2020-ES2027 features (Optional Chaining, BigInt, replaceAll, logical assignment, numeric separators, WeakRef, Set methods, Iterator helpers, Temporal, Explicit Resource Management)
✅ 39-es2022-plus-features.js 已按 ES 版本拆分为 7 个独立文件 (39.1-39.7)，每个文件 200-500 行，结构清晰
✅ All demo files now use a consistent learning-goals intro structure for clearer study flow
✅ Common Pitfalls & Best Practices sections in all advanced files

## Project Status

📅 **Last Updated**: 2026-08-06
🔍 **Documentation Review**: ✅ Verified against MDN, TypeScript official docs, TC39 proposals, and the current repo structure  
🚀 **Git Status**: Files updated (ES2022+ split into per-version files)
📊 **Coverage**: Complete (Stages 1-6)

## Documentation

- [TODOLIST.md](docs/TODOLIST.md) — Detailed roadmap
- [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) — JS vs TS reference

## Audit Tools

| Tool | Purpose | Location |
|------|---------|----------|
| js-fundamentals-review | JS/TS file pair validation | [js-fundamentals-review/](js-fundamentals-review/) |
| basics-review | 01-basics folder analysis | [basics-review/](basics-review/) |
| operators-review | Operator coverage audit | [operators-review/](operators-review/) |
| audit | Property-based testing | [audit/](audit/) |
| array-audit | Array method examples (Python) | [array-audit/](array-audit/) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ts-node` not found | `npx ts-node` auto-installs on first run, or install globally with `npm install -g ts-node` |
| ES2022+ syntax error | Ensure Node.js 18+ (`node --version`); ES2025 features require Node.js 22+ |
| Module not found | Check file path relative to project root |
| TypeScript type errors | Run `npx tsc --noEmit` for type checking; ensure tsconfig.json is properly configured |

## References

[javascript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) · [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
