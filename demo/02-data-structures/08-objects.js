// Objects - Complete Demo
// 📘 For TypeScript comparison, see: 08-objects-ts-comparison.ts
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces objects as the core way to group related data and behavior.
// The sections move from basic object creation to more advanced patterns such as copying, freezing, and prototype behavior.

// ============================================
// Table of Contents
// ============================================

// 1. Object Creation
// 2. Property Access Patterns
// 3. Property Definition and Manipulation
// 4. Object Methods - Inspection
// 5. Object Methods - Property Definition
// 6. Object Methods - Copying and Merging
// 7. Object Methods - Freezing and Sealing
// 8. Object Destructuring (ES6/ES2015)
// 9. Prototype Basics
// 10. this Binding
// 11. Object Methods - Grouping (ES2024)
// 12. Common Pitfalls & Best Practices

// ============================================

// ============================================
// 1. Object Creation
// ============================================

// Object literal - Most common way (ES1)
// - Key-value pairs
// - Keys are strings or symbols
// - Values can be any type
// - typeof returns "object"
const person = {
  name: "Alice",
  age: 30,
  city: "New York",
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

console.log("Object Creation:");
console.log(person);

// Original examples from minimal version
console.log(person.name); // Dot notation
console.log(person["age"]); // Bracket notation
console.log(person.greet());

// Object constructor (ES1)
// - Less common, use literal instead
const objConstructor = new Object();
objConstructor.name = "Bob";
console.log("Constructor:", objConstructor);

// Object.create() - Create with specific prototype (ES5)
// - Allows setting prototype directly
// - Use case: prototypal inheritance
const protoObj = { species: "human" };
const personWithProto = Object.create(protoObj);
personWithProto.name = "Charlie";
console.log("With prototype:", personWithProto);
console.log("Has species:", personWithProto.species); // From prototype

// ============================================
// 2. Property Access Patterns
// ============================================

// Dot notation (ES1)
// - Most common and readable
// - Cannot use with invalid identifiers
// - Cannot use with variables
console.log("\nProperty Access:");
console.log("Dot notation:", person.name);

// Bracket notation (ES1)
// - Works with any string
// - Works with variables
// - Works with invalid identifiers
// - Use case: dynamic property access
console.log("Bracket notation:", person["age"]);

// Dynamic property access
const propName = "city";
console.log("Dynamic access:", person[propName]);

// Invalid identifiers (require brackets)
const obj = {
  "first-name": "Alice",
  2023: "year",
  "hello world": "greeting",
};
console.log("Invalid identifier:", obj["first-name"]);
console.log("Numeric key:", obj["2023"]);

// Optional chaining (ES2020)
// - Safely access nested properties
// - Returns undefined if property doesn't exist
// - Prevents TypeError
const user = { profile: { email: "test@example.com" } };
console.log("\nOptional chaining:");
console.log("Exists:", user?.profile?.email);
console.log("Missing:", user?.profile?.phone); // undefined, no error
console.log("Deep missing:", user?.settings?.theme); // undefined

// ============================================
// 3. Property Definition and Manipulation
// ============================================

// Property shorthand (ES6/ES2015)
// - When variable name matches property name
// - Shorter syntax
const name = "David";
const age = 25;
const shorthand = { name, age };
console.log("\nProperty shorthand:", shorthand);

// Computed property names (ES6/ES2015)
// - Use expression as property name
// - Evaluated at object creation
const propKey = "dynamic";
const computed = {
  [propKey]: "value",
  [`${propKey}2`]: "value2",
  [1 + 2]: "three",
};
console.log("Computed properties:", computed);

// Method shorthand (ES6/ES2015)
// - Shorter syntax for methods
const methodObj = {
  // Old way
  oldMethod: function () {
    return "old";
  },
  // New way (ES6)
  newMethod() {
    return "new";
  },
  // Async method
  async asyncMethod() {
    return "async";
  },
  // Generator method
  *generatorMethod() {
    yield 1;
    yield 2;
  },
};
console.log("\nMethod shorthand:");
console.log("Old:", methodObj.oldMethod());
console.log("New:", methodObj.newMethod());

// Getter and setter (ES5)
// - Computed properties
// - Control access to internal state
const account = {
  _balance: 1000, // Convention: _ prefix for private
  get balance() {
    return `$${this._balance}`;
  },
  set balance(value) {
    if (value < 0) {
      console.log("Cannot set negative balance");
      return;
    }
    this._balance = value;
  },
};
console.log("\nGetters and setters:");
console.log("Get balance:", account.balance);
account.balance = 1500;
console.log("After set:", account.balance);
account.balance = -100; // Rejected

// ============================================
// 4. Object Methods - Inspection
// ============================================

// Object.keys() - Get property names (ES5)
// - Returns array of own enumerable property names
// - Does not include prototype properties
// - Does not include symbols
console.log("\nObject.keys():");
console.log("Keys:", Object.keys(person));

// Object.values() - Get property values (ES2017)
// - Returns array of own enumerable property values
const values = Object.values(person);
console.log("\nObject.values():");
console.log("Values:", values);

// Object.entries() - Get key-value pairs (ES2017)
// - Returns array of [key, value] arrays
// - Useful for iteration
const entries = Object.entries(person);
console.log("\nObject.entries():");
console.log("Entries:", entries);

// Iterate over entries
console.log("Iteration:");
for (const [key, value] of Object.entries(person)) {
  console.log(`  ${key}: ${value}`);
}

// Object.fromEntries() - Create object from entries (ES2019)
// - Inverse of Object.entries()
const entriesArray = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];
const fromEntries = Object.fromEntries(entriesArray);
console.log("\nObject.fromEntries():", fromEntries);

// 📘 Official MDN examples (Object.fromEntries):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
// Converting a Map to an Object
const map = new Map([
  ["foo", "bar"],
  ["baz", 42],
]);
console.log("MDN Map → Object:", Object.fromEntries(map)); // { foo: "bar", baz: 42 }

// Object transformation (entries → map → fromEntries)
const object1 = { a: 1, b: 2, c: 3 };
const object2 = Object.fromEntries(
  Object.entries(object1).map(([key, val]) => [key, val * 2])
);
console.log("MDN transform:", object2); // { a: 2, b: 4, c: 6 }

// Object.getOwnPropertyNames() - Get all property names (ES5)
// - Includes non-enumerable properties
// - Does not include symbols
const allProps = Object.getOwnPropertyNames(person);
console.log("\nAll property names:", allProps);

// Object.getOwnPropertySymbols() - Get symbol properties (ES6/ES2015)
const sym = Symbol("id");
const withSymbol = { [sym]: 123, name: "Test" };
console.log("Symbol properties:", Object.getOwnPropertySymbols(withSymbol));

// in operator - Check if property exists (ES1)
// - Checks own and inherited properties
console.log("\nin operator:");
console.log("'name' in person:", "name" in person);
console.log("'toString' in person:", "toString" in person); // Inherited

// hasOwnProperty() - Check own property (ES3)
// - Only checks own properties, not inherited
console.log("\nhasOwnProperty():");
console.log("person.hasOwnProperty('name'):", person.hasOwnProperty("name"));
console.log(
  "person.hasOwnProperty('toString'):",
  person.hasOwnProperty("toString")
);

// Object.hasOwn() - Modern alternative (ES2022)
// - Safer than hasOwnProperty
// - Works with objects without prototype
/*
 * verification:
 *   feature: Object.hasOwn
 *   status: ES2022
 *   stage4Date: 2021-08
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("Object.hasOwn(person, 'name'):", Object.hasOwn(person, "name"));

// Object.is() - Strict equality with special cases (ES6/ES2015)
// - Similar to === but handles NaN and +/-0 differently
// - NaN === NaN is false, Object.is(NaN, NaN) is true
// - 0 === -0 is true, Object.is(0, -0) is false
console.log("\nObject.is() - Value comparison:");
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Object.is(0, -0):", Object.is(0, -0)); // false
console.log("0 === -0:", 0 === -0); // true
console.log("Object.is({}, {}):", Object.is({}, {})); // false (different references)
console.log("Object.is('foo', 'foo'):", Object.is("foo", "foo")); // true

// ============================================
// 5. Object Methods - Property Definition
// ============================================

// Object.defineProperty() - Define single property with descriptor (ES5)
// - Allows fine-grained control over property behavior
// - Property descriptors: value, writable, enumerable, configurable
// - Getters/setters: get, set
console.log("\nObject.defineProperty():");
const strictObj = {};
Object.defineProperty(strictObj, "readonly", {
  value: "cannot change",
  writable: false, // Cannot assign new value
  enumerable: true, // Visible in Object.keys()
  configurable: false, // Cannot delete or redefine
});
console.log("Created with defineProperty:", strictObj);
try {
  strictObj.readonly = "trying to change"; // Throws TypeError in strict mode (silently fails in sloppy mode)
} catch (e) {
  console.log("Cannot assign to readonly property:", e.message);
}
console.log("After attempt to change:", strictObj.readonly);

// Object.defineProperties() - Define multiple properties (ES5)
const multiProps = {};
Object.defineProperties(multiProps, {
  _id: {
    value: 1,
    writable: true,
    enumerable: false, // Hidden (starts with _ convention)
  },
  id: {
    get() {
      return this._id;
    },
    set(value) {
      this._id = value;
    },
    enumerable: true,
  },
  name: {
    value: "Default",
    writable: true,
    enumerable: true,
    configurable: true,
  },
});
console.log("\nObject.defineProperties():", multiProps);
console.log("Own enumerable props:", Object.keys(multiProps)); // ['id', 'name']

// Property descriptor reading
const descriptor = Object.getOwnPropertyDescriptor(strictObj, "readonly");
console.log("\nProperty descriptor:", descriptor);

// Object.getOwnPropertyDescriptors() - Get all property descriptors (ES2017)
const allDescriptors = Object.getOwnPropertyDescriptors(multiProps);
console.log("\nAll descriptors:", Object.keys(allDescriptors));

// ============================================
// 6. Object Methods - Copying and Merging
// ============================================

// Object.assign() - Shallow copy/merge (ES6/ES2015)
// - Copies enumerable own properties
// - ⚠️ Shallow copy only (nested objects are referenced)
// - Mutates target object
// - Returns target object
const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { c: 5, d: 6 };

console.log("\nObject.assign():");
const merged = Object.assign(target, source1, source2);
console.log("Merged:", merged);
console.log("Target mutated:", target);

// Shallow copy with Object.assign
const original = { x: 1, nested: { y: 2 } };
const copy = Object.assign({}, original);
copy.x = 99;
copy.nested.y = 99;
console.log("\nShallow copy pitfall:");
console.log("Original:", original); // nested.y is also 99!
console.log("Copy:", copy);

// Spread operator - Modern alternative (ES2018)
// - Also shallow copy
// - More readable
// - Cannot be used to mutate target
const spread1 = { a: 1, b: 2 };
const spread2 = { b: 3, c: 4 };
const spreadMerged = { ...spread1, ...spread2, d: 5 };
console.log("\nSpread operator:", spreadMerged);

// Original example from minimal version
const updatedPerson = { ...person, age: 31, country: "USA" };
console.log("Updated:", updatedPerson);

// Deep copy with structuredClone (ES2022)
// - True deep copy
// - Handles nested objects, arrays, dates, etc.
// - Cannot clone functions, symbols, DOM nodes
const deepOriginal = { x: 1, nested: { y: 2 }, arr: [1, 2, 3] };
const deepCopy = structuredClone(deepOriginal);
deepCopy.nested.y = 99;
console.log("\nDeep copy:");
console.log("Original:", deepOriginal); // Unchanged!
console.log("Deep copy:", deepCopy);

// ============================================
// 7. Object Methods - Freezing and Sealing
// ============================================

// Object.freeze() - Make immutable (ES5)
// - Cannot add, delete, or modify properties
// - ⚠️ Shallow freeze only
// - Returns same object
const frozen = Object.freeze({ a: 1, b: 2 });
console.log("\nObject.freeze():");
// All mutations throw TypeError in strict mode (ES modules); fail silently in sloppy mode
try {
  frozen.a = 99;
} catch (e) {
  console.log("Cannot modify frozen property:", e.message);
}
try {
  frozen.c = 3;
} catch (e) {
  console.log("Cannot add to frozen object:", e.message);
}
try {
  delete frozen.b;
} catch (e) {
  console.log("Cannot delete from frozen object:", e.message);
}
console.log("Frozen (unchanged):", frozen);

// Check if frozen
console.log("Is frozen:", Object.isFrozen(frozen));

// Shallow freeze pitfall
const shallowFrozen = Object.freeze({ nested: { x: 1 } });
shallowFrozen.nested.x = 99; // Works! Nested object not frozen
console.log("Shallow freeze pitfall:", shallowFrozen);

// Object.seal() - Prevent additions/deletions (ES5)
// - Cannot add or delete properties
// - Can modify existing properties
// - Returns same object
const sealed = Object.seal({ a: 1, b: 2 });
console.log("\nObject.seal():");
sealed.a = 99; // Works!
try {
  sealed.c = 3; // Throws in strict mode (ES modules); fails silently in sloppy mode
} catch (e) {
  console.log("Cannot add to sealed:", e.message);
}
try {
  delete sealed.b; // Throws in strict mode
} catch (e) {
  console.log("Cannot delete from sealed:", e.message);
}
console.log("Sealed (a modified):", sealed);

// Check if sealed
console.log("Is sealed:", Object.isSealed(sealed));

// Object.preventExtensions() - Prevent additions (ES5)
// - Cannot add properties
// - Can modify and delete existing properties
const preventExt = Object.preventExtensions({ a: 1, b: 2 });
console.log("\nObject.preventExtensions():");
preventExt.a = 99; // Works!
delete preventExt.b; // Works!
try {
  preventExt.c = 3; // Throws in strict mode (ES modules); fails silently in sloppy mode
} catch (e) {
  console.log("Cannot add to non-extensible:", e.message);
}
console.log("Prevent extensions:", preventExt);

// Check if extensible
console.log("Is extensible:", Object.isExtensible(preventExt));

// ============================================
// 8. Object Destructuring (ES6/ES2015)
// ============================================

// Basic destructuring
const { name: personName, age: personAge, city } = person;
console.log("\nDestructuring:");
console.log({ personName, personAge, city });

// Original example from minimal version
const { name: origName, age: origAge, city: origCity } = person;
console.log({ name: origName, age: origAge, city: origCity });

// Also preserve exact original syntax (for test validation)
// const { name, age, city } = person; // Would conflict with variables above

// Default values
const { country = "USA", state = "NY" } = person;
console.log("With defaults:", { country, state });

// Rest properties (ES2018)
const { name: n, ...restProps } = person;
console.log("Rest properties:", restProps);

// Nested destructuring
const nested = {
  user: {
    id: 1,
    profile: {
      email: "test@example.com",
    },
  },
};
const {
  user: {
    id,
    profile: { email },
  },
} = nested;
console.log("Nested:", { id, email });

// Destructuring in function parameters
function greetPerson({ name, age }) {
  return `${name} is ${age} years old`;
}
console.log("Function param:", greetPerson(person));

// ============================================
// 9. Prototype Basics
// ============================================

// Every object has a prototype (ES3)
// - Prototype is another object
// - Properties are inherited from prototype
// - Prototype chain: obj -> prototype -> Object.prototype -> null

console.log("\nPrototype basics:");

// Get prototype
const proto = Object.getPrototypeOf(person);
console.log("Prototype:", proto);
console.log("Is Object.prototype:", proto === Object.prototype);

// Set prototype (not recommended, use Object.create instead)
const animal = { species: "unknown" };
const dog = { name: "Rex" };
Object.setPrototypeOf(dog, animal);
console.log("Dog name:", dog.name);
console.log("Dog species:", dog.species); // From prototype

// Check prototype chain
console.log("Is animal prototype of dog:", animal.isPrototypeOf(dog));

// __proto__ (deprecated, use Object.getPrototypeOf instead)
// - Direct access to prototype
// - Not recommended in production code
console.log("__proto__:", dog.__proto__ === animal);

// ============================================
// 10. this Binding
// ============================================

// this in methods (ES1)
// - Refers to object that called the method
// - Can be lost in callbacks
const thisObj = {
  name: "Alice",
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
  greetArrow: () => {
    // Arrow functions don't have own this
    console.log(`Arrow: ${this.name}`); // undefined or global
  },
};

console.log("\nthis binding:");
thisObj.greet(); // Works

// Lost this context
const greetFunc = thisObj.greet;
// greetFunc(); // Error: this.name is undefined

// Bind this (ES5)
const boundGreet = thisObj.greet.bind(thisObj);
boundGreet(); // Works

// Call and apply (ES3)
const otherObj = { name: "Bob" };
thisObj.greet.call(otherObj); // "Hello, I'm Bob"
thisObj.greet.apply(otherObj); // Same as call

// ============================================
// 11. Object Methods - Grouping (ES2024)
// ============================================

// Object.groupBy() - Group array elements into object (ES2024)
// - Groups array items by key returned from callback
// - Returns object with grouped arrays
// - Similar to SQL GROUP BY or Map.groupBy()
/*
 * verification:
 *   feature: Object.groupBy
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nObject.groupBy() - Array grouping:");

// Group numbers by parity
const numbersToGroup = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const groupedByParity = Object.groupBy(numbersToGroup, num =>
  num % 2 === 0 ? "even" : "odd"
);
console.log("Grouped by parity:", groupedByParity);

// Group people by age category
const peopleToGroup = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
  { name: "Charlie", age: 28 },
  { name: "Diana", age: 42 },
];
const groupedByAge = Object.groupBy(peopleToGroup, person =>
  person.age < 30 ? "young" : person.age < 40 ? "middle" : "senior"
);
console.log("Grouped by age category:", groupedByAge);

// Group strings by length
const words = ["hello", "world", "hi", "there", "a", "an"];
const groupedByLength = Object.groupBy(words, word => `length-${word.length}`);
console.log("Grouped by length:", groupedByLength);

// 📘 Official MDN example (Object.groupBy):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
// Group an inventory by its `type` field.
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 9 },
  { name: "bananas", type: "fruit", quantity: 5 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 12 },
  { name: "fish", type: "meat", quantity: 22 },
];
const groupedInventory = Object.groupBy(inventory, ({ type }) => type);
/* Result is:
{
  vegetables: [{ name: "asparagus", type: "vegetables", quantity: 9 }],
  fruit: [
    { name: "bananas", type: "fruit", quantity: 5 },
    { name: "cherries", type: "fruit", quantity: 12 },
  ],
  meat: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 },
  ],
}
*/
console.log("MDN inventory example:", groupedInventory);

// ============================================
// 12. Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Shallow copy
const shallowOriginal = { a: 1, nested: { b: 2 } };
const shallowCopy = { ...shallowOriginal };
shallowCopy.nested.b = 99;
console.log("\nPitfall - Shallow copy:");
console.log("Original nested.b:", shallowOriginal.nested.b); // 99!

// Pitfall 2: this binding in callbacks
const callbackObj = {
  name: "Alice",
  delayedGreet() {
    setTimeout(function () {
      // console.log(this.name); // undefined! this is lost
    }, 100);
  },
  delayedGreetArrow() {
    setTimeout(() => {
      console.log(`Arrow preserves this: ${this.name}`);
    }, 100);
  },
};
callbackObj.delayedGreetArrow();

// Pitfall 3: Property enumeration order
// - Integer keys sorted numerically
// - String keys in insertion order
// - Symbol keys not enumerated
const orderObj = { b: 2, 1: "one", a: 1, 3: "three", 2: "two" };
console.log("\nPitfall - Property order:");
console.log("Keys:", Object.keys(orderObj)); // ['1', '2', '3', 'b', 'a']

// Pitfall 4: Prototype pollution
// - Modifying Object.prototype affects all objects
// - Security risk
// - Never do this in production!
// Object.prototype.polluted = "bad"; // DON'T DO THIS

// Pitfall 5: Comparing objects
const obj1 = { a: 1 };
const obj2 = { a: 1 };
console.log("\nPitfall - Object comparison:");
console.log("obj1 === obj2:", obj1 === obj2); // false! Different references
console.log("obj1 === obj1:", obj1 === obj1); // true

// Best Practice 1: Use const for objects
const bestPractice = { a: 1 };
// bestPractice = { b: 2 }; // Error!
bestPractice.a = 2; // OK - modifying properties

// Best Practice 2: Use Object.hasOwn instead of hasOwnProperty
console.log("\nBest Practice - Property check:");
console.log("Object.hasOwn:", Object.hasOwn(person, "name"));

// Best Practice 3: Use optional chaining for nested access
const safeAccess = user?.profile?.email ?? "default@example.com";
console.log("Safe access:", safeAccess);

// Best Practice 4: Use Object.freeze for constants
const CONFIG = Object.freeze({
  API_URL: "https://api.example.com",
  TIMEOUT: 5000,
});
// CONFIG.API_URL = "other"; // Silently fails

// Best Practice 5: Use descriptive property names
// Good: { firstName: "Alice", lastName: "Smith" }
// Bad: { fn: "Alice", ln: "Smith" }

// Best Practice 6: Avoid modifying prototypes
// - Use composition over inheritance
// - Use classes or factory functions

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06.1-arrays-basics.js - Array basics");
console.log("📘 10-map-set.js - Map and Set");
console.log("📘 15-prototypes-inheritance.js - Prototypes and inheritance");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 08-objects-ts-comparison.ts
*/
