# JS/TS Basics Review Practice

JavaScript / TypeScript fundamentals review project with detailed examples and comparisons.

## Project Structure

```
demo/
├── 01-basics/              # Basic Syntax (01-05)
│   ├── 01-variables.js                  # Variables & Data Types
│   ├── 01-variables-ts-comparison.ts    # TS Comparison
│   ├── 02-operators.js                  # Operators & Expressions
│   ├── 03-control-flow.js               # Control Structures
│   ├── 04-strings.js                    # Strings & Template Literals
│   └── 05-numbers-math.js              # Numbers & Math
│
├── 02-data-structures/     # Data Structures (06-12)
│   ├── 06-arrays.js                     # Array Methods
│   ├── 06-arrays-ts-comparison.ts       # TS Comparison
│   ├── 07-functions.js                  # Functions (16 sections, 1100+ lines)
│   ├── 07-functions-ts-comparison.ts    # TS Comparison
│   ├── 08-objects.js                    # Objects & Methods
│   ├── 09-destructuring.js             # Destructuring Assignment
│   ├── 10-map-set.js                    # Map & Set
│   ├── 11-json.js                       # JSON Operations
│   └── 12-date-time.js                 # Date & Time
│
├── 03-core-concepts/       # Core Concepts (13-23)
│   ├── 13-scope-closures.js             # Scope & Closures
│   ├── 14-this-keyword.js               # this Keyword
│   ├── 15-prototypes-inheritance.js     # Prototypes & Inheritance
│   ├── 16-classes.js                    # Classes
│   ├── 17-property-descriptors.js       # Property Descriptors
│   ├── 18-modern-features.js            # ES6+ Features
│   ├── 19-symbol-deep.js               # Symbol Deep Dive
│   ├── 20-error-handling.js             # Error Handling
│   ├── 21-regex.js                      # Regular Expressions
│   ├── 22-iterators-generators.js       # Iterators & Generators
│   └── 23-proxy-reflect.js             # Proxy & Reflect
│
├── 04-asynchronous/        # Asynchronous Programming (24-28)
│   ├── 24-event-loop-callbacks.js       # Event Loop & Callbacks
│   ├── 25-promises.js                   # Promises
│   ├── 26-async-await.js               # Async/Await
│   ├── 27-modules.js                    # ES Modules
│   └── 28-fetch-api.js                 # Fetch API
│
├── 05-browser-dom/         # Browser & DOM (29-32)
│   ├── 29-dom-basics.js                 # DOM Basics
│   ├── 30-dom-manipulation.js           # DOM Manipulation
│   ├── 31-events.js                     # Event Handling
│   └── 32-forms-validation.js          # Forms & Validation
│
└── 06-advanced/            # Advanced Topics (33-39)
    ├── 33-es2022-plus-features.js       # ES2022+ Features
    ├── 34-debugging-testing.js          # Debugging & Testing
    ├── 35-memory-gc.js                  # Memory & Garbage Collection
    ├── 36-typed-arrays.js               # Typed Arrays
    ├── 37-intl-api.js                   # Internationalization API
    ├── 38-weakref-finalization.js       # WeakRef & FinalizationRegistry
    └── 39-storage-network.js            # Storage & Network
```

## Quick Start

```bash
# Stage 1: Basic Syntax
node demo/01-basics/01-variables.js
node demo/01-basics/02-operators.js
node demo/01-basics/03-control-flow.js
node demo/01-basics/04-strings.js
node demo/01-basics/05-numbers-math.js

# Stage 2: Data Structures
node demo/02-data-structures/06-arrays.js
node demo/02-data-structures/07-functions.js
node demo/02-data-structures/08-objects.js
node demo/02-data-structures/09-destructuring.js
node demo/02-data-structures/10-map-set.js
node demo/02-data-structures/11-json.js
node demo/02-data-structures/12-date-time.js

# Stage 3: Core Concepts
node demo/03-core-concepts/13-scope-closures.js
node demo/03-core-concepts/14-this-keyword.js
node demo/03-core-concepts/15-prototypes-inheritance.js
node demo/03-core-concepts/16-classes.js
node demo/03-core-concepts/17-property-descriptors.js
node demo/03-core-concepts/18-modern-features.js
node demo/03-core-concepts/19-symbol-deep.js
node demo/03-core-concepts/20-error-handling.js
node demo/03-core-concepts/21-regex.js
node demo/03-core-concepts/22-iterators-generators.js
node demo/03-core-concepts/23-proxy-reflect.js

# Stage 4: Asynchronous Programming
node demo/04-asynchronous/24-event-loop-callbacks.js
node demo/04-asynchronous/25-promises.js
node demo/04-asynchronous/26-async-await.js
node demo/04-asynchronous/27-modules.js
node demo/04-asynchronous/28-fetch-api.js

# TypeScript Comparisons
npx ts-node demo/01-basics/01-variables-ts-comparison.ts
npx ts-node demo/02-data-structures/06-arrays-ts-comparison.ts
npx ts-node demo/02-data-structures/07-functions-ts-comparison.ts
```

## Learning Path

Files are numbered 01-39 in recommended learning order:

1. **Basic Syntax (01-05)** — Variables, operators, control flow, strings, numbers
2. **Data Structures (06-12)** — Arrays, functions, objects, destructuring, Map/Set, JSON, dates
3. **Core Concepts (13-23)** — Scope, this, prototypes, classes, ES6+, regex, iterators, Proxy
4. **Asynchronous (24-28)** — Event loop, Promises, Async/Await, modules, Fetch
5. **Browser & DOM (29-32)** — DOM manipulation, events, forms & validation
6. **Advanced (33-39)** — ES2022+, debugging, memory management, internationalization, etc.

## Progress

- ✅ Completed: 15/39 (01-04, 06-08, 13, 15, 18, 20, 24-27)
- 🚧 Skeleton: 24/39

## Documentation

- [TODOLIST.md](docs/TODOLIST.md) — Learning roadmap & progress tracking
- [JS-TS-KEY-DIFFERENCES.md](docs/JS-TS-KEY-DIFFERENCES.md) — JS vs TS differences guide

## References

- [JavaScript.info](https://javascript.info)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [roadmap.sh/javascript](https://roadmap.sh/javascript)

## License

MIT
