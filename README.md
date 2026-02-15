# JS/TS Basics Review Practice

JavaScript and TypeScript fundamentals practice project with detailed examples and comparisons.

## Project Structure

```
├── demo/                  # Practice examples (executable code)
│   ├── basics/            # Basic Syntax (01-04)
│   │   ├── 01-variables.js              # Variables and data types (7 sections)
│   │   ├── 01-variables-ts-comparison.ts
│   │   ├── 02-operators.js              # Operators and expressions
│   │   ├── 03-control-flow.js           # Control structures (if/loop/switch)
│   │   └── 04-strings.js                # Strings and template literals
│   │
│   ├── data-structures/   # Data Structures (05-09)
│   │   ├── 05-arrays.js                 # Arrays and methods (8 sections)
│   │   ├── 05-arrays-ts-comparison.ts
│   │   ├── 06-functions.js              # Functions (16 sections, 1100+ lines)
│   │   ├── 06-functions-ts-comparison.ts
│   │   ├── 07-objects.js                # Objects and methods (10 sections)
│   │   ├── 08-map-set.js                # Map and Set data structures
│   │   └── 09-json.js                   # JSON operations
│   │
│   ├── core-concepts/     # Core Concepts (10-15)
│   │   ├── 10-scope-closures.js         # Scope and closures
│   │   ├── 11-error-handling.js         # Error handling
│   │   ├── 12-prototypes-inheritance.js # Prototypes and inheritance
│   │   ├── 13-modern-features.js        # ES6+ features and classes
│   │   ├── 14-regex.js                  # Regular expressions
│   │   └── 15-iterators-generators.js   # Iterators and generators
│   │
│   └── asynchronous/      # Asynchronous Programming (16-20)
│       ├── 16-event-loop-callbacks.js   # Event loop and callbacks
│       ├── 17-promises.js               # Promises
│       ├── 18-async-await.js            # Async/Await
│       ├── 19-modules.js                # ES Modules
│       └── 20-fetch-api.js              # Fetch API
│
├── docs/
│   ├── TODOLIST.md       # Learning roadmap (14 topics)
│   └── JS-TS-KEY-DIFFERENCES.md  # Quick reference guide
└── LICENSE               # MIT License
```

## Quick Start

```bash
# Run JavaScript examples (recommended learning order)

# Basic Syntax (01-04)
node demo/basics/01-variables.js      # Start here: Variables and data types
node demo/basics/02-operators.js      # Operators and expressions
node demo/basics/03-control-flow.js   # Control structures
node demo/basics/04-strings.js        # Strings and template literals

# Data Structures (05-09)
node demo/data-structures/05-arrays.js         # Arrays: creation, iteration, search, manipulation
node demo/data-structures/06-functions.js      # Functions: 16 sections, 1100+ lines
node demo/data-structures/07-objects.js        # Objects: creation, access, methods, prototypes
node demo/data-structures/08-map-set.js        # Map and Set data structures
node demo/data-structures/09-json.js           # JSON operations

# Core Concepts (10-15)
node demo/core-concepts/10-scope-closures.js # Scope and closures
node demo/core-concepts/11-error-handling.js # Error handling
node demo/core-concepts/12-prototypes-inheritance.js # Prototypes
node demo/core-concepts/13-modern-features.js # ES6+ features
node demo/core-concepts/14-regex.js          # Regular expressions
node demo/core-concepts/15-iterators-generators.js # Iterators and generators

# Asynchronous Programming (16-20)
node demo/asynchronous/16-event-loop-callbacks.js # Event loop basics
node demo/asynchronous/17-promises.js       # Promises
node demo/asynchronous/18-async-await.js    # Async/Await
node demo/asynchronous/19-modules.js        # ES Modules
node demo/asynchronous/20-fetch-api.js      # Fetch API

# Run TypeScript examples
npx ts-node demo/basics/01-variables-ts-comparison.ts
npx ts-node demo/data-structures/05-arrays-ts-comparison.ts
npx ts-node demo/data-structures/06-functions-ts-comparison.ts
```

## Documentation

- **Learning Path**: [TODOLIST.md](docs/TODOLIST.md) - 14 topics with progress tracking
- **JS vs TS Guide**: [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) - Key differences and pitfalls
- **JavaScript**: [JavaScript.info](https://javascript.info)
- **TypeScript**: [TypeScript Docs](https://www.typescriptlang.org/docs)

## Features

- ✅ 20 comprehensive demo files covering JavaScript fundamentals
- ✅ 3 TypeScript comparison files (variables, functions, arrays)
- ✅ Organized by learning progression: Basics → Data Structures → Core Concepts → Async
- ✅ ES version annotations for all features (ES1-ES2023)
- ✅ 300-1100+ lines per comprehensive demo file
- ✅ Executable code examples with detailed comments
- ✅ Advanced topics: IIFE patterns, TCO, pure functions, functional programming

## Learning Path

The files are numbered in recommended learning order:

1. **Basic Syntax (01-04)** - Start here if you're new to JavaScript
2. **Data Structures (05-09)** - Learn arrays, functions, objects, Map/Set, and JSON
3. **Core Concepts (10-15)** - Master scope, errors, prototypes, ES6+, regex, and iterators
4. **Asynchronous (16-20)** - Understand async programming patterns and Fetch API

## License

MIT License - see [LICENSE](LICENSE) file for details.
