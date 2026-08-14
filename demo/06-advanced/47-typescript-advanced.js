// TypeScript Advanced Features Demo
// 📘 For TypeScript comparison, see: 47-typescript-advanced-ts-comparison.ts
// 📘 ECMAScript Decorator Proposal: https://github.com/tc39/proposal-decorators
// 📘 JSDoc Type Hints: https://www.typescriptlang.org/docs/handbook/jsdoc-reference.html
// 📘 Reflect API: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect
// 📘 Proxy: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
// 📌 Covers JavaScript metaprogramming features used by TypeScript
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces TypeScript-oriented JavaScript patterns that help bridge the gap between plain JavaScript and typed development.
// The examples focus on practical tooling hints and metaprogramming concepts rather than on deep type theory.

// ============================================
// Table of Contents
// ============================================
// 1. JSDoc Type Hints (JavaScript)
// 2. Decorators (Stage 2.7 proposal)
// 3. Reflect API
// 4. Proxy Object
// 5. Symbol Metadata
// 6. Type Coercion and Type Checking
// 7. Common Pitfalls
// 8. Best Practices

// ============================================
// Section 1: JSDoc Type Hints (JavaScript)
// ============================================

console.log("\n=== JSDoc Type Hints in JavaScript ===\n");

// JSDoc allows type hints in pure JavaScript
// TypeScript and IDEs can understand these comments
// Provides type safety without writing TypeScript

/**
 * Calculates the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @example
 * add(2, 3) // returns 5
 */
function add(a, b) {
  return a + b;
}

console.log("add(2, 3):", add(2, 3));

/**
 * A user object
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} [email] - Optional email
 * @property {boolean} active - Active status
 */

/**
 * Creates a new user
 * @param {string} name - User name
 * @param {number} id - User ID
 * @returns {User} New user object
 */
function createUser(name, id) {
  return {
    id,
    name,
    active: true
  };
}

const user = createUser("Alice", 1);
console.log("Created user:", user);

/**
 * @template T
 * @param {T[]} array - Array of any type
 * @param {T} item - Item to add
 * @returns {T[]} New array with item added
 */
function appendToArray(array, item) {
  return [...array, item];
}

const numbers = appendToArray([1, 2, 3], 4);
console.log("Numbers array:", numbers);

console.log("\nJSDoc benefits:");
console.log("1. Type hints in IDEs without TypeScript");
console.log("2. Better autocompletion");
console.log("3. self-documenting code");
console.log("4. Can gradually adopt TypeScript");

// ══════════════════════════════════════════
// ⚠️ PROPOSAL SECTION — not current standard, syntax may change
// ══════════════════════════════════════════
// Section 2: Decorators (Stage 2.7 proposal - not current standard)
// ============================================

/*
 * verification:
 *   feature: Decorators
 *   status: Stage 2.7
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/README.md
 */

console.log("\n=== Decorators (Stage 2.7 proposal - not current standard) ===\n");

// Decorators are a TC39 Stage 2.7 proposal (as of 2026-06, not yet part of the ECMAScript standard).
// TS 5.0+ already supports it (experimentalDecorators: false); Babel 7.21+ supports it.
console.log("- Stage 2.7 proposal, not yet part of ECMAScript standard");
console.log("- TS 5.0+ / Babel 7.21+ support via transpilation");
console.log(`// Method decorator example (future syntax):
// function logged(target, context) {
//   return function(...args) { console.log("Calling:", context.name); return target.apply(this, args); };
// }
// class Example { @logged greet(name) { return \`Hello, \${name}!\`; } }
`);
// 📘 See 50-reserved.js (future extensions topic)

// ============================================
// Section 3: Reflect API (ES6)
// ============================================

console.log("\n=== Reflect API (ES6) ===\n");

// Reflect is a built-in object that provides methods for
// interceptable JavaScript operations. It's the foundation
// for Proxy and decorators.

// Reflect vs Object methods:
// - Reflect methods always return a value
// - Reflect methods throw for invalid operations
// - Reflect is a function, not an object constructor

const obj = {
  name: "Alice",
  age: 30,
  greet() {
    return `Hello, ${this.name}!`;
  }
};

// Reflect.get - Get property value
console.log("Reflect.get(obj, 'name'):", Reflect.get(obj, "name"));

// Reflect.set - Set property value
Reflect.set(obj, "age", 31);
console.log("After Reflect.set(obj, 'age', 31):", obj.age);

// Reflect.has - Check if property exists
console.log("Reflect.has(obj, 'name'):", Reflect.has(obj, "name"));
console.log("Reflect.has(obj, 'email'):", Reflect.has(obj, "email"));

// Reflect.deleteProperty - Delete property
const newObj = { x: 1, y: 2 };
Reflect.deleteProperty(newObj, "x");
console.log("After Reflect.deleteProperty:", newObj);

// Reflect.construct - Create instance with new
function Person(name) {
  this.name = name;
}
const person = Reflect.construct(Person, ["Bob"]);
console.log("Reflect.construct:", person.name);

// Reflect.apply - Call function with this and arguments
const nums = [1, 2, 3, 4, 5];
const max = Reflect.apply(Math.max, null, nums);
console.log("Reflect.apply(Math.max, null, nums):", max);

// Reflect.ownKeys - Get all own property keys
console.log("Reflect.ownKeys(obj):", Reflect.ownKeys(obj));

console.log("\nReflect API use cases:");
console.log("- Building proxies and traps");
console.log("- Metaprogramming");
console.log("- Framework development");
console.log("- Consistent API for object operations");

// ============================================
// Section 4: Proxy Object (ES6)
// ============================================

console.log("\n=== Proxy Object (ES6) ===\n");

// Proxy allows you to create a placeholder for another object
// which can intercept and redefine fundamental operations

const target = {
  message: "Hello"
};

// Basic proxy with get trap
const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Getting property: ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`Setting property: ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

console.log("proxy.message:", proxy.message);
proxy.message = "Hi there";
console.log("proxy.message after set:", proxy.message);

// Validation proxy
const validator = {
  set(target, property, value) {
    if (property === "age") {
      if (typeof value !== "number" || value < 0 || value > 150) {
        throw new Error("Invalid age");
      }
    }
    target[property] = value;
    return true;
  }
};

const personValidator = new Proxy({}, validator);
personValidator.age = 25;
console.log("personValidator.age:", personValidator.age);

console.log("\nAvailable proxy traps:");
console.log("get, set, has, deleteProperty");
console.log("getPrototypeOf, setPrototypeOf");
console.log("isExtensible, preventExtensions");
console.log("getOwnPropertyDescriptor, defineProperty");
console.log("ownKeys, apply, construct");

console.log("\nProxy use cases:");
console.log("- Validation and sanitization");
console.log("- Logging and debugging");
console.log("- Caching and memoization");
console.log("- Virtual objects and lazy loading");
console.log("- Data binding and observables");

// See 23-proxy-reflect.js for more detailed coverage

// ============================================
// Section 5: Symbol Metadata
// ============================================

console.log("\n=== Symbol Metadata ===\n");

// Symbols can be used as unique property keys
// Useful for metadata and avoiding name collisions

// Create unique symbols
const KEY = Symbol("key");
const ANOTHER_KEY = Symbol("key"); // Different symbol!

console.log("KEY === ANOTHER_KEY:", KEY === ANOTHER_KEY); // false

// Using symbols as object keys
const objWithSymbols = {
  [KEY]: "secret value",
  public: "public value"
};

console.log("objWithSymbols[KEY]:", objWithSymbols[KEY]);
console.log("Object.keys(objWithSymbols):", Object.keys(objWithSymbols));
console.log("Reflect.ownKeys(objWithSymbols):", Reflect.ownKeys(objWithSymbols));

// Well-known symbols
console.log("\nWell-known symbols:");
console.log("Symbol.iterator - Iterator protocol");
console.log("Symbol.asyncIterator - Async iterator");
console.log("Symbol.hasInstance - instanceof behavior");
console.log("Symbol.toStringTag - Object.prototype.toString()");
console.log("Symbol.toPrimitive - Convert to primitive");
console.log("Symbol.dispose - Explicit resource management (ES2027, Stage 4 May 2025)");
console.log("Symbol.asyncDispose - Async resource management (ES2027, Stage 4 May 2025)");

// Example: Symbol.toStringTag
class MyClass {
  get [Symbol.toStringTag]() {
    return "MyClass";
  }
}
console.log("Object.prototype.toString.call(new MyClass()):",
  Object.prototype.toString.call(new MyClass()));

// ============================================
// Section 6: Type Coercion and Type Checking
// ============================================

console.log("\n=== Type Coercion and Checking ===\n");

// Understanding JavaScript types is crucial for TypeScript

// typeof operator
console.log("typeof 42:", typeof 42);
console.log("typeof 'hello':", typeof "hello");
console.log("typeof true:", typeof true);
console.log("typeof undefined:", typeof undefined);
console.log("typeof null:", typeof null); // "object" (historical bug!)
console.log("typeof {}:", typeof {});
console.log("typeof []:", typeof []);
console.log("typeof function(){}:", typeof function(){});

// Better type checking
function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

console.log("\ngetType(null):", getType(null));
console.log("getType([]):", getType([]));
console.log("getType({}):", getType({}));

// instanceof - checks prototype chain
class Animal {}
class Dog extends Animal {}
const dog = new Dog();
console.log("\ndog instanceof Dog:", dog instanceof Dog);
console.log("dog instanceof Animal:", dog instanceof Animal);
console.log("dog instanceof Object:", dog instanceof Object);

// Array.isArray
console.log("\nArray.isArray([]):", Array.isArray([]));
console.log("Array.isArray({}):", Array.isArray({}));

// Number.isNaN vs isNaN
console.log("\nNumber.isNaN(NaN):", Number.isNaN(NaN));
console.log("Number.isNaN('hello'):", Number.isNaN("hello"));
console.log("isNaN('hello'):", isNaN("hello"));

// ============================================
// Section 7: Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: typeof null is "object"
console.log("Pitfall 1: typeof null === 'object'");
console.log("  Always check for null separately");
function isObject(value) {
  return typeof value === "object" && value !== null;
}
console.log("  isObject(null):", isObject(null));
console.log("  isObject({}):", isObject({}));

// Pitfall 2: Array type checking
console.log("\nPitfall 2: typeof [] === 'object'");
console.log("  Use Array.isArray() instead");
console.log("  Array.isArray([]):", Array.isArray([]));

// Pitfall 3: Loose equality (==)
console.log("\nPitfall 3: Loose equality coercion");
console.log("  '' == 0:", "" == 0);
console.log("  0 == '0':", 0 == "0");
console.log("  '' == '0':", "" == "0");
console.log("  Use === for strict equality");

// Pitfall 4: NaN comparison
console.log("\nPitfall 4: NaN !== NaN");
console.log("  NaN === NaN:", NaN === NaN);
console.log("  Use Number.isNaN() instead");

// Pitfall 5: Symbol uniqueness
console.log("\nPitfall 5: Same description !== same symbol");
const s1 = Symbol("test");
const s2 = Symbol("test");
console.log("  Symbol('test') === Symbol('test'):", s1 === s2);
console.log("  Use Symbol.for() for global symbols");
const gs1 = Symbol.for("global");
const gs2 = Symbol.for("global");
console.log("  Symbol.for('global') === Symbol.for('global'):", gs1 === gs2);

// Pitfall 6: Proxy with this context
console.log("\nPitfall 6: Proxy and 'this' binding");
console.log("  Methods on target may lose 'this' context");
console.log("  Use Reflect.get/set with receiver parameter");

// Pitfall 7: Decorator compatibility
console.log("\nPitfall 7: Decorator proposal variations");
console.log("  Different implementations have different syntax");
console.log("  TypeScript decorators !== proposal decorators");
console.log("  Check your transpiler settings");

// ============================================
// Section 8: Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use JSDoc for type hints in JavaScript");
console.log("2. Prefer === and !== over == and !=");
console.log("3. Use Array.isArray() for array checking");
console.log("4. Use Number.isNaN() instead of isNaN()");
console.log("5. Check for null before typeof check");
console.log("6. Use Reflect API with Proxy for consistency");
console.log("7. Consider transpilation for decorators");
console.log("8. Use Symbol.for() for shared symbols");
console.log("9. Always provide receiver to Reflect traps");
console.log("10. Document JSDoc types thoroughly");

console.log("\n❌ DON'T:");
console.log("1. Don't rely on typeof null === 'object'");
console.log("2. Don't use loose equality (==) without reason");
console.log("3. Don't assume Symbol with same description is equal");
console.log("4. Don't forget this binding in proxies");
console.log("5. Don't use decorators without transpilation");
console.log("6. Don't ignore JSDoc type hints");
console.log("7. Don't mix up TypeScript and proposal decorators");
console.log("8. Don't use Proxy without a clear use case");
console.log("9. Don't expose internal symbols publicly");
console.log("10. Don't skip type checking with 'any' in JSDoc");

console.log("\n⚠️  WATCH OUT FOR:");
console.log("1. Transpiler compatibility with decorators");
console.log("2. Symbol keys not showing in Object.keys()");
console.log("3. Proxy traps affecting performance");
console.log("4. Memory leaks with long-lived proxies");
console.log("5. Type coercion edge cases");
console.log("6. Different JSDoc implementations");
console.log("7. Proposal syntax changes");
console.log("8. Reflect vs Object method differences");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 24.1-function-composition.ts - Function composition TS");
console.log("📘 23-proxy-reflect.ts - Proxy TS comparison");
console.log("📘 48-security.js - Type-safe security");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 47-typescript-advanced-ts-comparison.ts
*/
