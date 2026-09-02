# Learning Roadmap

> **References**: [JavaScript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) · [roadmap.sh](https://roadmap.sh/javascript)
> **Updated**: 2026-09-02
> **ES version verification**: 2026-09-01 · See [TC39 Finished Proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md) · reference/lastVerified
> **Content structure**: All demo files now use a consistent learning-goals intro block and standardized chapter ordering.
> **Example Index**: See `docs/EXAMPLES.md` for a task-based quick reference to common code examples.

**Progress**: 76 JS files + 76 TypeScript comparison files ✅ (numbered 01-50, 28 reserved; long files split into focused sub-files; all files tagged with difficulty levels)

---

## 📁 Stage 1: Basics (01-05)

| # | File | Topic | Status |
|---|------|-------|--------|
| 01 | `demo/01-basics/01-variables.js` | Variables and Data Types | ✅ |
| 02 | `demo/01-basics/02-operators.js` | Operators and Expressions | ✅ |
| 03 | `demo/01-basics/03-control-flow.js` | Control Flow | ✅ |
| 04 | `demo/01-basics/04-strings.js` | Strings and Template Literals | ✅ |
| 05 | `demo/01-basics/05-numbers-math.js` | Numbers and Math | ✅ |

TS comparison: `01-variables-ts-comparison.ts` · `02-operators-ts-comparison.ts` · `03-control-flow-ts-comparison.ts` · `04-strings-ts-comparison.ts` · `05-numbers-math-ts-comparison.ts`

### Knowledge Points

**01 Variables and Data Types** — var/let/const, primitive types, type coercion, TS type annotations
**02 Operators** — arithmetic/comparison/logical operators, assignment operators, ternary operator
**03 Control Flow** — if/else, switch, for/while/do-while, break/continue
**04 Strings** — string methods, template literals, tagged templates
**05 Numbers and Math** — Number methods, Math object, precision issues, BigInt

---

## 📁 Stage 2: Data Structures (06-12)

| # | File | Topic | Status |
|---|------|-------|--------|
| 06 | `demo/02-data-structures/06-arrays.js` | Array Methods (Full) | ✅ |
| | `demo/02-data-structures/06-1-arrays-basics.js` | Array Basics (Creation, Access, Type, Destructuring) | ✅ |
| | `demo/02-data-structures/06-2-arrays-iteration.js` | Array Iteration Methods | ✅ |
| | `demo/02-data-structures/06-3-arrays-search-sort.js` | Array Search & Sort | ✅ |
| | `demo/02-data-structures/06-4-arrays-manipulation.js` | Array Manipulation & Spread | ✅ |
| | `demo/02-data-structures/06-5-typed-arrays.js` | Typed Arrays (Basic) | ✅ |
| 07 | `demo/02-data-structures/07-functions.js` | Functions (Index) | ✅ |
| | `demo/02-data-structures/07-1-functions-basics.js` | Function Basics | ✅ |
| | `demo/02-data-structures/07-2-functions-advanced.js` | Advanced Functions | ✅ |
| | `demo/02-data-structures/07-3-functions-patterns.js` | Function Patterns | ✅ |
| 08 | `demo/02-data-structures/08-objects.js` | Objects and Methods | ✅ |
| 09 | `demo/02-data-structures/09-destructuring.js` | Destructuring Assignment | ✅ |
| 10 | `demo/02-data-structures/10-map-set.js` | Map and Set | ✅ |
| 11 | `demo/02-data-structures/11-json.js` | JSON Operations | ✅ |
| 12 | `demo/02-data-structures/12-date-time.js` | Date and Time | ✅ |

TS comparison: `06-arrays-ts-comparison.ts` · `06-1-arrays-basics-ts-comparison.ts` · `06-2-arrays-iteration-ts-comparison.ts` · `06-3-arrays-search-sort-ts-comparison.ts` · `06-4-arrays-manipulation-ts-comparison.ts` · `06-5-typed-arrays-ts-comparison.ts` · `07-functions-ts-comparison.ts` · `07-1-functions-basics-ts-comparison.ts` · `07-2-functions-advanced-ts-comparison.ts` · `07-3-functions-patterns-ts-comparison.ts` · `08-objects-ts-comparison.ts` · `09-destructuring-ts-comparison.ts` · `10-map-set-ts-comparison.ts` · `11-json-ts-comparison.ts` · `12-date-time-ts-comparison.ts`

### Knowledge Points

**06 Arrays** — creation (literals/constructor/Array.of/Array.from), access & type checking, destructuring (06-1); iteration (forEach/map/filter/reduce/flat/flatMap) (06-2); search (find/findIndex/includes/some/every) & sort (06-3); manipulation (push/pop/splice/slice/concat/join/spread) (06-4); typed arrays (TypedArray/ArrayBuffer/DataView) (06-5)
**07 Functions** — declaration/expression/arrow, default/rest parameters (07-1); higher-order functions, closures, generators, currying (07-2); method definitions, binding, IIFE, TCO, pure functions (07-3)
**08 Objects** — literals, property access, methods, getter/setter, Object.keys/values/entries, freeze/seal
**09 Destructuring** — array destructuring, object destructuring, nested destructuring, defaults, rest patterns, function parameter destructuring
**10 Map and Set** — Map creation and methods, Set creation and methods, WeakMap/WeakSet, use cases
**11 JSON** — parse/stringify, data types, serialization/deserialization, error handling, replacer/reviver
**12 Date and Time** — Date object, formatting and parsing, timezone handling, date arithmetic

---

## 📁 Stage 3: Core Concepts (13-27)

| # | File | Topic | Status |
|---|------|-------|--------|
| 13 | `demo/03-core-concepts/13-scope-closures.js` | Scope and Closures (Index) | ✅ |
| | `demo/03-core-concepts/13-1-scope-basics.js` | Scope Basics (Global/Function/Block/Scope Chain/Shadowing) | ✅ |
| | `demo/03-core-concepts/13-2-scope-tdz-strict.js` | TDZ, Strict Mode, eval/with | ✅ |
| | `demo/03-core-concepts/13-3-closures-basics.js` | Closures Basics (Data Privacy) | ✅ |
| | `demo/03-core-concepts/13-4-closures-patterns.js` | Closures Patterns (Factory/Partial/Memoization/Module/IIFE) | ✅ |
| | `demo/03-core-concepts/13-5-scope-pitfalls.js` | Scope & Closures Pitfalls/Best Practices | ✅ |
| 14 | `demo/03-core-concepts/14-this-keyword.js` | this Keyword | ✅ |
| 15 | `demo/03-core-concepts/15-prototypes-inheritance.js` | Prototypes and Inheritance | ✅ |
| 16 | `demo/03-core-concepts/16-classes.js` | Classes | ✅ |
| 17 | `demo/03-core-concepts/17-property-descriptors.js` | Property Descriptors | ✅ |
| 18 | `demo/03-core-concepts/18-es6-plus-syntax.js` | ES6+ Syntax | ✅ |
| 19 | `demo/03-core-concepts/19-symbol-deep.js` | Symbol Deep Dive | ✅ |
| 20 | `demo/03-core-concepts/20-error-handling.js` | Error Handling | ✅ |
| 21 | `demo/03-core-concepts/21-regex.js` | Regular Expressions | ✅ |
| 22 | `demo/03-core-concepts/22-iterators-generators.js` | Iterators and Generators | ✅ |
| 23 | `demo/03-core-concepts/23-proxy-reflect.js` | Proxy and Reflect | ✅ |
| 24 | `demo/03-core-concepts/24-function-patterns-advanced.js` | Advanced Function Patterns (Full) | ✅ |
| | `demo/03-core-concepts/24-1-function-composition.js` | Function Composition | ✅ |
| | `demo/03-core-concepts/24-2-debounce-throttle.js` | Debounce & Throttle | ✅ |
| | `demo/03-core-concepts/24-3-memoization-cache.js` | Memoization & Cache | ✅ |
| 25 | `demo/03-core-concepts/25-inheritance-patterns.js` | Inheritance Patterns | ✅ |
| 26 | `demo/03-core-concepts/26-optimization-performance.js` | Performance Optimization | ✅ |
| 27 | `demo/03-core-concepts/27-memory-management.js` | Memory Management | ✅ |

TS comparison: `13-scope-closures-ts-comparison.ts` · `13-1-scope-basics-ts-comparison.ts` · `13-2-scope-tdz-strict-ts-comparison.ts` · `13-3-closures-basics-ts-comparison.ts` · `13-4-closures-patterns-ts-comparison.ts` · `13-5-scope-pitfalls-ts-comparison.ts` · `14-this-keyword-ts-comparison.ts` · `15-prototypes-inheritance-ts-comparison.ts` · `16-classes-ts-comparison.ts` · `17-property-descriptors-ts-comparison.ts` · `18-es6-plus-syntax-ts-comparison.ts` · `19-symbol-deep-ts-comparison.ts` · `20-error-handling-ts-comparison.ts` · `21-regex-ts-comparison.ts` · `22-iterators-generators-ts-comparison.ts` · `23-proxy-reflect-ts-comparison.ts` · `24-function-patterns-advanced-ts-comparison.ts` · `24-1-function-composition-ts-comparison.ts` · `24-2-debounce-throttle-ts-comparison.ts` · `24-3-memoization-cache-ts-comparison.ts` · `25-inheritance-patterns-ts-comparison.ts` · `26-optimization-performance-ts-comparison.ts` · `27-memory-management-ts-comparison.ts`

### Knowledge Points

**13 Scope and Closures** — global/local/block scope, lexical scope, scope chain, variable shadowing (13-1); TDZ, strict mode, eval/with (13-2); closure principles, data privacy, memory behavior (13-3); factory functions, partial application, memoization, module pattern, IIFE (13-4); common pitfalls and best practices (13-5)
**14 this Keyword** — this binding rules, lost-binding scenarios, call/apply/bind, this in arrow functions, this in classes
**15 Prototypes and Inheritance** — prototype chain, constructor functions, Object.create(), class syntax
**16 Classes** — class syntax, inheritance, mixin, instanceof in depth, class vs prototype comparison, composition over inheritance, strategy pattern
**17 Property Descriptors** — defineProperty, data/accessor descriptors, enumerable/configurable/writable
**18 ES6+ Features** — spread operator, destructuring, default/rest parameters, arrow functions, classes and inheritance
**19 Symbol Deep Dive** — Symbol creation, well-known Symbols, Symbol.iterator, Symbol.toPrimitive
**20 Error Handling** — try/catch/finally, throw, Error types, custom errors, async error handling, Error.cause, AggregateError
**21 Regular Expressions** — pattern syntax, string methods, flags, common patterns
**22 Iterators and Generators** — iterator protocol, generator functions, yield, async iterators
**23 Proxy and Reflect** — Proxy traps, Reflect methods, metaprogramming patterns
**24 Advanced Function Patterns** — currying, composition (compose/pipe), partial application, factories, HOF transformers (24-1); debounce/throttle implementations and use cases (24-2); memoization, LRU cache, trampolining, recursion, point-free style (24-3)
**25 Inheritance Patterns** — composition over inheritance, functional mixins with collision detection, strategy pattern, observer pattern, template method, visitor pattern, traits pattern
**26 Performance Optimization** — tail-call optimization, memoization, lazy evaluation, event-loop optimization, batching
**27 Memory Management** — WeakRef, FinalizationRegistry, memory leaks, object pools, GC basics

---

## 📁 Stage 4: Asynchronous Programming (29-34)

| # | File | Topic | Status |
|---|------|-------|--------|
| 29 | `demo/04-asynchronous/29-event-loop-callbacks.js` | Event Loop and Callbacks | ✅ |
| 30 | `demo/04-asynchronous/30-promises.js` | Promises | ✅ |
| 31 | `demo/04-asynchronous/31-async-await.js` | Async/Await | ✅ |
| 32 | `demo/04-asynchronous/32-modules.js` | ES Modules | ✅ |
| 33 | `demo/04-asynchronous/33-fetch-api.js` | Fetch API (All-in-one) | ✅ |
| | `demo/04-asynchronous/33-1-fetch-basics.js` | Fetch Basics (GET, Response Methods, HTTP Methods, FormData) | ✅ |
| | `demo/04-asynchronous/33-2-fetch-error-handling.js` | Error Handling & Async/Await (Patterns, Timeout, Sequential/Parallel) | ✅ |
| | `demo/04-asynchronous/33-3-fetch-practical-patterns.js` | Practical Patterns (API Client, Retry, AbortController, Sequential Calls) | ✅ |
| | `demo/04-asynchronous/33-4-fetch-streams-advanced.js` | Streams & Advanced (Stream API, Progress, Transform, Cancellation) | ✅ |
| 34 | `demo/04-asynchronous/34-async-error-handling.js` | Async Error Handling | ✅ |

TS comparison: `29-event-loop-callbacks-ts-comparison.ts` · `30-promises-ts-comparison.ts` · `31-async-await-ts-comparison.ts` · `32-modules-ts-comparison.ts` · `33-fetch-api-ts-comparison.ts` · `33-1-fetch-basics-ts-comparison.ts` · `33-2-fetch-error-handling-ts-comparison.ts` · `33-3-fetch-practical-patterns-ts-comparison.ts` · `33-4-fetch-streams-advanced-ts-comparison.ts` · `34-async-error-handling-ts-comparison.ts`

### Knowledge Points

**29 Event Loop** — event-loop mechanism, callback pattern, callback hell
**30 Promises** — creation and chaining, error handling, Promise.all/race/allSettled/any
**31 Async/Await** — async functions, await, try/catch error handling, parallel vs sequential
**32 Modules** — import/export, default vs named exports, dynamic import
**33 Fetch API** — 已拆分为4个专注文件（33-1-33-4）：GET basics, response methods (json/text/blob/arrayBuffer) (33-1); error handling (response.ok check, network vs HTTP errors), timeout with Promise.race, async/await fetch patterns (33-2); API client wrapper, retry with exponential backoff, AbortController deep dive (basic abort, timeout, cancel multiple, SearchController, combineSignals, AbortSignal.timeout/any), sequential dependent calls (33-3); Stream API basics, download with progress tracking, stream transformation, cancelable stream reading, stream vs non-stream comparison (33-4)
**34 Async Error Handling** — Promise errors, async/await errors, circuit breaker, retry patterns

---

## 📁 Stage 5: Browser & DOM (35-38)

| # | File | Topic | Status |
|---|------|-------|--------|
| 35 | `demo/05-browser-dom/35-dom-basics.js` | DOM Basics | ✅ |
| 36 | `demo/05-browser-dom/36-dom-manipulation.js` | DOM Manipulation | ✅ |
| 37 | `demo/05-browser-dom/37-events.js` | Event Handling | ✅ |
| 38 | `demo/05-browser-dom/38-forms-validation.js` | Forms and Validation | ✅ |

TS comparison: `35-dom-basics-ts-comparison.ts` · `36-dom-manipulation-ts-comparison.ts` · `37-events-ts-comparison.ts` · `38-forms-validation-ts-comparison.ts`

### Knowledge Points

**35 DOM Basics** — DOM tree, node types, selectors (getElementById/querySelector), traversal
**36 DOM Manipulation** — create/insert/delete nodes, modify attributes and styles, DocumentFragment, MutationObserver, performance optimization
**37 Event Handling** — addEventListener, event bubbling/capturing, event delegation, custom events
**38 Forms and Validation** — form elements, Constraint Validation API, custom validation, form submission

---

## 📁 Stage 6: Advanced Topics (39-50)

| # | File | Topic | Status |
|---|------|-------|--------|
| 39 | `demo/06-advanced/es-features/39-es2022-plus-features.js` | ES2022+ Features (Index) | ✅ |
| | `demo/06-advanced/es-features/39-1-es2021-features.js` | ES2021 Features | ✅ |
| | `demo/06-advanced/es-features/39-2-es2022-features.js` | ES2022 Features | ✅ |
| | `demo/06-advanced/es-features/39-3-es2023-features.js` | ES2023 Features | ✅ |
| | `demo/06-advanced/es-features/39-4-es2024-features.js` | ES2024 Features | ✅ |
| | `demo/06-advanced/es-features/39-5-es2025-features.js` | ES2025 Features | ✅ |
| | `demo/06-advanced/es-features/39-6-es2026-features.js` | ES2026 Features | ✅ |
| | `demo/06-advanced/es-features/39-7-es2027-future.js` | ES2027+ & Future Proposals | ✅ |
| 40 | `demo/06-advanced/tooling/40-debugging-testing.js` | Debugging and Testing | ✅ |
| 41 | `demo/06-advanced/data-processing/41-typed-arrays.js` | Typed Arrays | ✅ |
| 42 | `demo/06-advanced/data-processing/42-intl-api.js` | Internationalization API | ✅ |
| 43 | `demo/06-advanced/web-platform/43-storage-network.js` | Storage and Network | ✅ |
| 44 | `demo/06-advanced/architecture/44-design-patterns.js` | Design Patterns | ✅ |
| 45 | `demo/06-advanced/web-platform/45-web-apis.js` | Web APIs | ✅ |
| 46 | `demo/06-advanced/architecture/46-performance.js` | Performance Optimization | ✅ |
| 47 | `demo/06-advanced/metaprogramming/47-metaprogramming.js` | Metaprogramming (JSDoc/Reflect/Proxy/Decorators) | ✅ |
| 48 | `demo/06-advanced/architecture/48-security.js` | Security Best Practices | ✅ |
| 49 | `demo/06-advanced/tooling/49-build-tools.js` | Build Tool Integration | ✅ |
| 50 | `demo/06-advanced/metaprogramming/50-reserved.js` | Reserved for Future Extensions | ✅ |

TS comparison: `es-features/39-es2022-plus-features-ts-comparison.ts` · `es-features/39-1-es2021-features-ts-comparison.ts` · `es-features/39-2-es2022-features-ts-comparison.ts` · `es-features/39-3-es2023-features-ts-comparison.ts` · `es-features/39-4-es2024-features-ts-comparison.ts` · `es-features/39-5-es2025-features-ts-comparison.ts` · `es-features/39-6-es2026-features-ts-comparison.ts` · `es-features/39-7-es2027-future-ts-comparison.ts` · `tooling/40-debugging-testing-ts-comparison.ts` · `data-processing/41-typed-arrays-ts-comparison.ts` · `data-processing/42-intl-api-ts-comparison.ts` · `web-platform/43-storage-network-ts-comparison.ts` · `architecture/44-design-patterns-ts-comparison.ts` · `web-platform/45-web-apis-ts-comparison.ts` · `architecture/46-performance-ts-comparison.ts` · `metaprogramming/47-metaprogramming-ts-comparison.ts` · `architecture/48-security-ts-comparison.ts` · `tooling/49-build-tools-ts-comparison.ts` · `metaprogramming/50-reserved-ts-comparison.ts`

### Knowledge Points

**39 ES2022+** — 已按ES版本拆分到7个独立文件（39-1-39-7，覆盖 ES2021–ES2027；更早特性委托给对应主题文件：ES2018 Intl.PluralRules → 42，ES2020 特性 → 30/32/18）：ES2021 (replaceAll, ||=, &&=, ??=, numeric separators, WeakRef, FinalizationRegistry, Promise.any, AggregateError) · ES2022 (at(), Object.hasOwn, Error.cause, top-level await, class private fields, Class Static Block, Ergonomic brand checks, RegExp Match Indices) · ES2023 (toSorted, toReversed, with, toSpliced, findLast, findLastIndex, Hashbang, Symbols as WeakMap keys) · ES2024 (Object.groupBy, Map.groupBy, Promise.withResolvers, RegExp /v, ArrayBuffer.transfer, Resizable ArrayBuffer, Atomics.waitAsync, Well-Formed Unicode Strings) · ES2025 (Set methods, Iterator helpers, RegExp.escape, Promise.try, Float16Array, Import Attributes, Redeclarable global eval vars, JSON Modules, RegExp Modifiers, Duplicate Named Capture Groups, Intl.DurationFormat) · ES2026 (Array.fromAsync, Math.sumPrecise, Error.isError, Uint8Array Base64, Upsert/getOrInsert, JSON.parse source text access, Iterator Sequencing) · ES2027 (Temporal API, Explicit Resource Management, DisposableStack, Joint Iteration, Atomics.pause) · Stage 2.7 (Decorators)
**40 Debugging and Testing** — console methods, debugger, breakpoints, unit testing basics
**41 Typed Arrays** — ArrayBuffer, TypedArray views, DataView, binary data processing
**42 Internationalization API** — Intl.NumberFormat, DateTimeFormat, Collator, RelativeTimeFormat
**43 Storage and Network** — localStorage/sessionStorage, IndexedDB, XMLHttpRequest, WebSocket
**44 Design Patterns** — factory, singleton, observer, strategy, decorator
**45 Web APIs** — Service Workers, Web Workers, Intersection Observer, Geolocation, WebSocket
**46 Performance Optimization** — Performance API, debounce/throttle, lazy loading, virtual scrolling, code splitting
**47 Metaprogramming** — JSDoc type hints, decorators (Stage 2.7), Reflect API, Proxy, Symbol metadata, type coercion/checking. For TypeScript's type system (generics, conditional/mapped/template-literal/utility types), see `../demo/06-advanced/metaprogramming/47-metaprogramming-ts-comparison.ts`
**48 Security Best Practices** — XSS protection, CSRF protection, CSP configuration, secure storage, input validation
**49 Build Tools** — webpack config, vite config, code splitting, production optimization
**50 Reserved for Future Extensions** — TC39 proposals, Temporal API (ES2027), Decorators (Stage 2.7), runtime evolution, future features
