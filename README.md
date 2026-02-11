# JS/TS Basics Review Practice

JavaScript and TypeScript fundamentals practice project with detailed examples and comparisons.

## Project Structure

```
├── demo/                  # Practice examples
│   ├── 01-variables.js   # Variables and data types
│   ├── 01-variables-ts-comparison.ts  # JS vs TS comparison (variables)
│   ├── 02-functions.js   # Functions (comprehensive guide)
│   ├── 02-functions-ts-comparison.ts  # JS vs TS comparison (functions)
│   ├── 03-arrays.js      # Arrays and array methods
│   ├── 04-objects.js     # Objects and object methods
│   ├── 05-typescript-basics.ts  # TypeScript basics
│   ├── 06-modern-features.js    # ES6+ features and classes
│   ├── 07-operators.js   # Operators and expressions
│   ├── 08-control-flow.js # Control structures
│   ├── 09-strings.js     # Strings and template literals
│   ├── 10-error-handling.js # Error handling
│   ├── 11-scope-closures.js # Scope and closures
│   ├── 12-promises.js    # Promises
│   ├── 13-async-await.js # Async/Await
│   ├── 14-event-loop-callbacks.js # Event Loop and Callbacks
│   ├── 15-modules.js     # ES Modules
│   └── 16-prototypes-inheritance.js # Prototypes and Inheritance
├── audit/                # Audit tooling (TypeScript)
│   └── src/              # Property-based tests and validators
├── docs/
│   ├── TODOLIST.md       # Learning roadmap (14 topics)
│   └── JS-TS-KEY-DIFFERENCES.md  # Quick reference guide
└── LICENSE               # MIT License
```

## Quick Start

```bash
# Run JavaScript examples
node demo/01-variables.js
node demo/02-functions.js
node demo/03-arrays.js
node demo/07-operators.js
node demo/12-promises.js
node demo/13-async-await.js

# Run TypeScript examples
npx ts-node demo/01-variables-ts-comparison.ts
npx ts-node demo/02-functions-ts-comparison.ts
npx ts-node demo/05-typescript-basics.ts

# Run audit tests
cd audit
npm install
npm run test:coverage
npm run test:style
npm run test:executable
```

## Documentation

- **Learning Path**: [TODOLIST.md](docs/TODOLIST.md) - 14 topics with progress tracking
- **JS vs TS Guide**: [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) - Key differences and pitfalls
- **JavaScript**: [JavaScript.info](https://javascript.info)
- **TypeScript**: [TypeScript Docs](https://www.typescriptlang.org/docs)

## Features

- ✅ 16 comprehensive demo files covering JavaScript fundamentals
- ✅ Property-based testing for code quality validation
- ✅ ES version annotations for all features
- ✅ TypeScript comparison notes
- ✅ 300+ lines per comprehensive demo file
- ✅ Executable code examples with detailed comments

## License

MIT License - see [LICENSE](LICENSE) file for details.
