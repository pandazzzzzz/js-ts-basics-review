# Learning Roadmap

> **Documentation Sources**: 
> - JavaScript: [JavaScript.info](https://javascript.info)
> - TypeScript: [TypeScript Official Docs](https://www.typescriptlang.org/docs)
> - Last Updated: 2026-02-14

## Learning Path

Files are organized in recommended learning order (01-20). Follow the sequence for optimal understanding.

## 📁 Stage 1: Basic Syntax (01-04)

### 1. Variables & Data Types
- [x] Variable declarations (var, let, const)
- [x] Primitive types (string, number, boolean, null, undefined, symbol, bigint)
- [x] Type coercion and conversion
- [x] TypeScript type annotations
- **File**: `demo/basics/01-variables.js` ✅
- **TS**: `demo/basics/01-variables-ts-comparison.ts`
- **Ref**: [JavaScript.info Variables](https://javascript.info/variables)

### 2. Operators & Expressions
- [x] Arithmetic, comparison, logical operators
- [x] Assignment operators
- [x] Ternary operator
- **File**: `demo/basics/02-operators.js` ✅
- **Ref**: [JavaScript.info Operators](https://javascript.info/operators)

### 3. Control Flow
- [x] if/else, switch statements
- [x] for, while, do-while loops
- [x] break and continue
- **File**: `demo/basics/03-control-flow.js` ✅
- **Ref**: [JavaScript.info Conditionals](https://javascript.info/ifelse)

### 4. Strings & Template Literals
- [x] String methods (slice, substring, indexOf, includes)
- [x] Template literals and interpolation
- [x] Tagged templates
- **File**: `demo/basics/04-strings.js` ✅
- **Ref**: [JavaScript.info Strings](https://javascript.info/string)

## 📁 Stage 2: Data Structures (05-09)

### 5. Arrays
- [x] Array creation and access
- [x] Array methods (push, pop, shift, unshift)
- [x] Iteration (forEach, map, filter, reduce)
- [x] Search (find, findIndex, indexOf, includes)
- [x] Manipulation (sort, reverse, splice, slice)
- [x] Destructuring and spread operator
- **File**: `demo/data-structures/05-arrays.js` ✅
- **TS**: `demo/data-structures/05-arrays-ts-comparison.ts`
- **Ref**: [JavaScript.info Arrays](https://javascript.info/array)

### 6. Functions
- [x] Declarations, expressions, arrow functions
- [x] Parameters (default, rest)
- [x] Higher-order functions
- [x] Closures
- [x] Async functions, generators
- [x] IIFE, TCO, pure functions
- [x] Currying, function binding
- **File**: `demo/data-structures/06-functions.js` ✅ (16 sections, 1100+ lines)
- **TS**: `demo/data-structures/06-functions-ts-comparison.ts`
- **Ref**: [JavaScript.info Functions](https://javascript.info/function-basics)

### 7. Objects
- [x] Object literals, property access
- [x] Object methods
- [x] Destructuring, spread operator
- [x] Getters and setters
- [x] Object methods (keys, values, entries, assign)
- [x] Freezing and sealing
- **File**: `demo/data-structures/07-objects.js` ✅
- **Ref**: [JavaScript.info Objects](https://javascript.info/object)

### 8. Map & Set
- [ ] Map creation and methods
- [ ] Set creation and methods
- [ ] WeakMap and WeakSet
- [ ] Use cases and performance
- **File**: `demo/data-structures/08-map-set.js` 🚧
- **Ref**: [JavaScript.info Map and Set](https://javascript.info/map-set)

### 9. JSON
- [ ] JSON.parse() and JSON.stringify()
- [ ] JSON data types
- [ ] Serialization and deserialization
- [ ] Error handling
- **File**: `demo/data-structures/09-json.js` 🚧
- **Ref**: [JavaScript.info JSON](https://javascript.info/json)

## 📁 Stage 3: Core Concepts (10-15)

### 10. Scope & Closures
- [x] Global vs local scope
- [x] Block scope
- [x] Lexical scope
- [x] Closures
- **File**: `demo/core-concepts/10-scope-closures.js` ✅
- **Ref**: [JavaScript.info Closures](https://javascript.info/closure)

### 11. Error Handling
- [x] try/catch/finally
- [x] throw statements
- [x] Error types
- [x] Custom errors
- **File**: `demo/core-concepts/11-error-handling.js` ✅
- **Ref**: [JavaScript.info Error Handling](https://javascript.info/try-catch)

### 12. Prototypes & Inheritance
- [x] Prototype chain
- [x] Constructor functions
- [x] Object.create()
- [x] Class syntax
- **File**: `demo/core-concepts/12-prototypes-inheritance.js` ✅
- **Ref**: [JavaScript.info Prototypes](https://javascript.info/prototypes)

### 13. Modern Features (ES6+)
- [x] Spread operator, destructuring
- [x] Default and rest parameters
- [x] Arrow functions
- [x] Classes and inheritance
- **File**: `demo/core-concepts/13-modern-features.js` ✅
- **Ref**: [JavaScript.info Modern Features](https://javascript.info/advanced-functions)

### 14. Regular Expressions
- [ ] Regex patterns and syntax
- [ ] String methods with regex
- [ ] Flags and modifiers
- [ ] Common patterns
- **File**: `demo/core-concepts/14-regex.js` 🚧
- **Ref**: [JavaScript.info Regular Expressions](https://javascript.info/regular-expressions)

### 15. Iterators & Generators
- [ ] Iterator protocol
- [ ] Generator functions
- [ ] yield keyword
- [ ] Async iterators
- **File**: `demo/core-concepts/15-iterators-generators.js` 🚧
- **Ref**: [JavaScript.info Generators](https://javascript.info/generators)

## 📁 Stage 4: Asynchronous Programming (16-20)

### 16. Event Loop & Callbacks
- [x] Event loop mechanism
- [x] Callback patterns
- [x] Callback hell
- **File**: `demo/asynchronous/16-event-loop-callbacks.js` ✅
- **Ref**: [JavaScript.info Event Loop](https://javascript.info/event-loop)

### 17. Promises
- [x] Promise creation and chaining
- [x] Error handling
- [x] Promise.all/race/allSettled/any
- **File**: `demo/asynchronous/17-promises.js` ✅
- **Ref**: [JavaScript.info Promises](https://javascript.info/promise-basics)

### 18. Async/Await
- [x] async function syntax
- [x] await keyword
- [x] Error handling with try/catch
- [x] Parallel vs sequential execution
- **File**: `demo/asynchronous/18-async-await.js` ✅
- **Ref**: [JavaScript.info Async/Await](https://javascript.info/async-await)

### 19. Modules
- [x] ES Modules (import/export)
- [x] Default vs named exports
- [x] Dynamic imports
- **File**: `demo/asynchronous/19-modules.js` ✅
- **Ref**: [JavaScript.info Modules](https://javascript.info/modules-intro)

### 20. Fetch API
- [ ] Fetch basics
- [ ] Request and Response objects
- [ ] Headers and options
- [ ] Error handling
- **File**: `demo/asynchronous/20-fetch-api.js` 🚧
- **Ref**: [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Progress**: 15/20 topics ✅ (5 new skeleton files 🚧)

**Next Steps**: 
- Complete skeleton files: Map/Set, JSON, Regex, Iterators/Generators, Fetch API
- Advanced topics: DOM manipulation, Advanced TypeScript, Web APIs
- Advanced: Design patterns, Performance optimization, Testing
