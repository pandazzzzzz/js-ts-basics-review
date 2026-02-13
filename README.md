# JS/TS Basics Review Practice

JavaScript and TypeScript fundamentals practice project with detailed examples and comparisons.

## Project Structure

```
├── demo/                  # Practice examples (executable code)
│   ├── 📁 Basic Syntax
│   │   ├── 01-variables.js              # Variables and data types (7 sections)
│   │   ├── 01-variables-ts-comparison.ts
│   │   ├── 02-operators.js              # Operators and expressions
│   │   ├── 03-control-flow.js           # Control structures (if/loop/switch)
│   │   └── 04-strings.js                # Strings and template literals
│   │
│   ├── 📁 Data Structures
│   │   ├── 05-arrays.js                 # Arrays and methods (8 sections)
│   │   ├── 05-arrays-ts-comparison.ts
│   │   ├── 06-functions.js              # Functions (16 sections, 1100+ lines)
│   │   ├── 06-functions-ts-comparison.ts
│   │   └── 07-objects.js                # Objects and methods (10 sections)
│   │
│   ├── 📁 Core Concepts
│   │   ├── 08-scope-closures.js         # Scope and closures
│   │   ├── 09-error-handling.js         # Error handling
│   │   ├── 10-prototypes-inheritance.js # Prototypes and inheritance
│   │   └── 11-modern-features.js        # ES6+ features and classes
│   │
│   └── 📁 Asynchronous Programming
│       ├── 12-event-loop-callbacks.js   # Event loop and callbacks
│       ├── 13-promises.js               # Promises
│       ├── 14-async-await.js            # Async/Await
│       └── 15-modules.js                # ES Modules
│
├── docs/
│   ├── TODOLIST.md       # Learning roadmap (14 topics)
│   └── JS-TS-KEY-DIFFERENCES.md  # Quick reference guide
└── LICENSE               # MIT License
```

## Quick Start

```bash
# Run JavaScript examples (recommended learning order)

# 📁 Basic Syntax
node demo/01-variables.js      # Start here: Variables and data types
node demo/02-operators.js      # Operators and expressions
node demo/03-control-flow.js   # Control structures
node demo/04-strings.js        # Strings and template literals

# 📁 Data Structures
node demo/05-arrays.js         # Arrays: creation, iteration, search, manipulation
node demo/06-functions.js      # Functions: 16 sections, 1100+ lines
node demo/07-objects.js        # Objects: creation, access, methods, prototypes

# 📁 Core Concepts
node demo/08-scope-closures.js # Scope and closures
node demo/09-error-handling.js # Error handling
node demo/10-prototypes-inheritance.js # Prototypes
node demo/11-modern-features.js # ES6+ features

# 📁 Asynchronous Programming
node demo/12-event-loop-callbacks.js # Event loop basics
node demo/13-promises.js       # Promises
node demo/14-async-await.js    # Async/Await
node demo/15-modules.js        # ES Modules

# Run TypeScript examples
npx ts-node demo/01-variables-ts-comparison.ts
npx ts-node demo/05-arrays-ts-comparison.ts
npx ts-node demo/06-functions-ts-comparison.ts
```

## Documentation

- **Learning Path**: [TODOLIST.md](docs/TODOLIST.md) - 14 topics with progress tracking
- **JS vs TS Guide**: [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) - Key differences and pitfalls
- **JavaScript**: [JavaScript.info](https://javascript.info)
- **TypeScript**: [TypeScript Docs](https://www.typescriptlang.org/docs)

## Features

- ✅ 15 comprehensive demo files covering JavaScript fundamentals
- ✅ 3 TypeScript comparison files (variables, functions, arrays)
- ✅ Organized by learning progression: Basics → Data Structures → Core Concepts → Async
- ✅ ES version annotations for all features (ES1-ES2023)
- ✅ 300-1100+ lines per comprehensive demo file
- ✅ Executable code examples with detailed comments
- ✅ Advanced topics: IIFE patterns, TCO, pure functions, functional programming

## Learning Path

The files are numbered in recommended learning order:

1. **Basic Syntax (01-04)** - Start here if you're new to JavaScript
2. **Data Structures (05-07)** - Learn arrays, functions, and objects
3. **Core Concepts (08-11)** - Master scope, errors, prototypes, and ES6+
4. **Asynchronous (12-15)** - Understand async programming patterns

## License

MIT License - see [LICENSE](LICENSE) file for details.
