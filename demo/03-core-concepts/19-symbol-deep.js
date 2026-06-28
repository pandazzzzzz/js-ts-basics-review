// ============================================================================
// SYMBOL DEEP DIVE - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. SYMBOL BASICS
// ============================================================================
/**
 * Symbol - A unique and immutable primitive value (ES6)
 *
 * Characteristics:
 * - Created with Symbol() function
 * - Each Symbol is unique, even with same description
 * - Can be used as object property keys
 * - Not enumerable in for...in / Object.keys()
 * - Cannot be converted to string implicitly
 *
 * Use Cases:
 * - Unique property keys
 * - Avoiding naming conflicts
 * - Hidden/internal properties
 * - Protocol implementation
 *
 * Common Pitfalls:
 * - Cannot use Symbol with 'new'
 * - Implicit string conversion throws error
 * - JSON.stringify ignores Symbol properties
 */

console.log("=== 1. Symbol Basics Demo ===");

// 1.1 Creating symbols
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description");

console.log("Symbol without description:", sym1);
console.log("Symbol with description:", sym2);
console.log("Symbol description property:", sym2.description);

// 1.2 Uniqueness - each Symbol is unique
console.log("\nUniqueness check:");
console.log("sym2 === sym3:", sym2 === sym3); // false
console.log("Symbol('test') === Symbol('test'):", Symbol('test') === Symbol('test')); // false

// 1.3 Symbol as object property keys
let obj = {
  [sym1]: "value1",
  [sym2]: "value2",
  normal: "normal value"
};

console.log("\nSymbol as property keys:");
console.log("obj[sym1]:", obj[sym1]);
console.log("obj[sym2]:", obj[sym2]);
console.log("obj.normal:", obj.normal);

// 1.4 Symbols are not enumerable
console.log("\nEnumeration check:");
console.log("Object.keys(obj):", Object.keys(obj)); // ['normal']

console.log("for...in:");
for (let key in obj) {
  console.log("  ", key); // Only 'normal'
}

// 1.5 Getting Symbol properties
const symKeys = Object.getOwnPropertySymbols(obj);
console.log("\nSymbol keys:", symKeys);
console.log("Symbol values:", symKeys.map(s => obj[s]));

// 1.6 Symbol.toString() and description
console.log("\nSymbol.toString():");
console.log("sym2.toString():", sym2.toString()); // "Symbol(description)"
console.log("typeof sym2:", typeof sym2); // "symbol"

// Pitfall: Cannot convert Symbol to string implicitly
try {
  console.log("Cannot do this:", sym2 + " test");
} catch (error) {
  console.log("Implicit conversion error:", error.message);
}

// Correct: Use toString() or description
console.log("Correct concatenation:", sym2.toString() + " test");


// ============================================================================
// 2. GLOBAL SYMBOL REGISTRY
// ============================================================================
/**
 * Global Symbol Registry - Shared symbols across the application (ES6)
 *
 * Methods:
 * - Symbol.for(key): Creates or retrieves a global symbol
 * - Symbol.keyFor(sym): Returns the key for a global symbol
 *
 * Differences from regular symbols:
 * - Global symbols are shared across the entire runtime
 * - Same key returns the same symbol
 * - Accessible across realms (iframes, workers)
 * - Symbol.keyFor() only works for global symbols
 *
 * Use Cases:
 * - Cross-module shared constants
 * - Plugin systems
 * - Communication between iframes
 * - Well-known symbol registration
 *
 * Common Pitfalls:
 * - Global symbols persist (memory consideration)
 * - Symbol.keyFor() returns undefined for non-global symbols
 */

console.log("\n=== 2. Global Symbol Registry Demo ===");

// 2.1 Symbol.for() - Create or retrieve global symbol
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");

console.log("Symbol.for() uniqueness:");
console.log("globalSym1 === globalSym2:", globalSym1 === globalSym2); // true

// 2.2 Symbol.keyFor() - Get key from symbol
console.log("\nSymbol.keyFor():");
console.log("Key for globalSym1:", Symbol.keyFor(globalSym1)); // "app.id"

// 2.3 Non-global symbols don't have keys
const localSym = Symbol("app.id");
console.log("\nNon-global symbol:");
console.log("Symbol.keyFor(localSym):", Symbol.keyFor(localSym)); // undefined
console.log("localSym.description:", localSym.description); // "app.id"

// 2.4 Global symbol registry use case - Shared constants
const USER_ID = Symbol.for("constants.userId");
const POST_ID = Symbol.for("constants.postId");

let database = {
  [USER_ID]: 12345,
  [POST_ID]: 67890
};

console.log("\nShared constants:");
console.log("Database:", database[USER_ID], database[POST_ID]);

// 2.5 Global symbols across different contexts (simulation)
function createContext1() {
  return Symbol.for("shared.token");
}

function createContext2() {
  return Symbol.for("shared.token");
}

console.log("\nCross-context sharing:");
console.log("Same symbol:", createContext1() === createContext2()); // true


// ============================================================================
// 3. WELL-KNOWN SYMBOLS
// ============================================================================
/**
 * Well-Known Symbols - Built-in symbols that customize object behavior (ES6+)
 *
 * Common Well-Known Symbols:
 * - Symbol.iterator: Default iterator (for...of)
 * - Symbol.asyncIterator: Async iterator (for await...of)
 * - Symbol.toPrimitive: Custom type conversion
 * - Symbol.toStringTag: Custom toString output
 * - Symbol.hasInstance: Custom instanceof behavior
 * - Symbol.isConcatSpreadable: Control Array.concat behavior
 * - Symbol.species: Constructor for derived objects
 *
 * Use Cases:
 * - Custom iterable objects
 * - Custom type conversion
 * - Framework integration
 * - Library API design
 *
 * Common Pitfalls:
 * - Modifying built-in Symbol behavior can be confusing
 * - Performance implications of custom iterators
 */

console.log("\n=== 3. Well-Known Symbols Demo ===");

// 3.1 Symbol.iterator - Custom iteration
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,

      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        }
        return { done: true };
      }
    };
  }
};

console.log("\nSymbol.iterator:");
console.log("for...of range:");
for (let num of range) {
  console.log("  ", num); // 1, 2, 3, 4, 5
}

// 3.2 Symbol.toPrimitive - Custom type conversion
let money = {
  dollars: 100,
  cents: 50,

  [Symbol.toPrimitive](hint) {
    console.log(`toPrimitive hint: ${hint}`);
    if (hint === "string") {
      return `${this.dollars}.${this.cents.toString().padStart(2, '0')} USD`;
    }
    if (hint === "number") {
      return this.dollars + this.cents / 100;
    }
    // default
    return this.dollars + this.cents / 100;
  }
};

console.log("\nSymbol.toPrimitive:");
console.log("String conversion:", String(money)); // "100.50 USD"
console.log("Number conversion:", +money); // 100.5
console.log("Addition:", money + 10); // 110.5

// 3.3 Symbol.toStringTag - Custom toString output
class Validator {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}

const validator = new Validator();
console.log("\nSymbol.toStringTag:");
console.log("Object.prototype.toString:", Object.prototype.toString.call(validator));
// "[object Validator]"

// Built-in examples
console.log("\nBuilt-in toStringTag:");
console.log("Map:", Object.prototype.toString.call(new Map())); // [object Map]
console.log("Promise:", Object.prototype.toString.call(Promise.resolve())); // [object Promise]
console.log("Array:", Object.prototype.toString.call([])); // [object Array]

// 3.4 Symbol.hasInstance - Custom instanceof behavior
class PrimitiveNumber {
  static [Symbol.hasInstance](obj) {
    return typeof obj === "number";
  }
}

console.log("\nSymbol.hasInstance:");
console.log("42 instanceof PrimitiveNumber:", 42 instanceof PrimitiveNumber); // true
console.log("'str' instanceof PrimitiveNumber:", "str" instanceof PrimitiveNumber); // false

// 3.5 Symbol.isConcatSpreadable - Control concat behavior
let arr1 = [1, 2];
let arr2 = [3, 4];
arr2[Symbol.isConcatSpreadable] = false;

console.log("\nSymbol.isConcatSpreadable:");
console.log("Normal concat:", [0].concat(arr1)); // [0, 1, 2]
console.log("Non-spreadable concat:", [0].concat(arr2)); // [0, [3, 4]]

// 3.6 Symbol.species - Custom constructor for derived objects
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array; // Return built-in Array for derived methods
  }
}

let myArray = new MyArray(1, 2, 3);
let filtered = myArray.filter(x => x > 1);

console.log("\nSymbol.species:");
console.log("myArray instanceof MyArray:", myArray instanceof MyArray); // true
console.log("filtered instanceof MyArray:", filtered instanceof MyArray); // false
console.log("filtered instanceof Array:", filtered instanceof Array); // true

// 3.7 Symbol.match/replace/search/split - Custom regex behavior
class CaseInsensitiveMatcher {
  constructor(pattern) {
    this.pattern = pattern.toLowerCase();
  }

  [Symbol.match](string) {
    const lower = string.toLowerCase();
    const matches = [];
    let pos = 0;
    while (pos < lower.length) {
      const idx = lower.indexOf(this.pattern, pos);
      if (idx === -1) break;
      matches.push(string.slice(idx, idx + this.pattern.length));
      pos = idx + 1;
    }
    return matches.length ? matches : null;
  }

  [Symbol.replace](string, replacement) {
    // Use a case-insensitive RegExp to preserve non-match casing
    // (toLowerCase().replaceAll would lowercase the whole string)
    return string.replace(new RegExp(this.pattern, 'gi'), replacement);
  }

  [Symbol.search](string) {
    return string.toLowerCase().indexOf(this.pattern);
  }

  [Symbol.split](string) {
    return string.toLowerCase().split(this.pattern);
  }
}

console.log("\nSymbol.match/replace/search/split:");
const matcher = new CaseInsensitiveMatcher("HELLO");
console.log("'hello world hello'.match:", "hello world hello".match(matcher));
console.log("'HELLO WORLD'.replace:", matcher[Symbol.replace]("HELLO WORLD", "hi"));
console.log("'Say HELLO'.search:", "Say HELLO".search(matcher));
console.log("'aHELLOb'.split:", "aHELLOb".split(matcher));

// 3.8 Symbol.unscopables - Exclude properties from with statement
// Note: with statement is deprecated, but this symbol exists for Array methods
console.log("\nSymbol.unscopables:");
console.log("Array[Symbol.unscopables]:", Array.prototype[Symbol.unscopables]);
// { copyWithin: true, entries: true, fill: true, find: true, findIndex: true, ... }
// These methods are excluded from 'with' scope binding

// Built-in objects with Symbol.unscopables
const unscopables = ['copyWithin', 'entries', 'fill', 'find', 'findIndex',
                     'flat', 'flatMap', 'includes', 'keys', 'values'];
console.log("Methods excluded from 'with':", unscopables.slice(0, 5));


// ============================================================================
// 4. SYMBOL PRACTICAL APPLICATIONS
// ============================================================================
/**
 * Symbol Practical Applications
 *
 * Use Cases:
 * 1. Private-like properties (before # private fields)
 * 2. Avoiding naming conflicts in libraries
 * 3. Protocol implementation
 * 4. Metadata storage
 * 5. Feature detection
 *
 * Best Practices:
 * - Use Symbol.for() for shared symbols
 * - Use Symbol() for unique symbols
 * - Document Symbol usage clearly
 * - Consider # private fields for true privacy
 *
 * Common Pitfalls:
 * - Symbols are not truly private (getOwnPropertySymbols)
 * - Reflect.ownKeys() reveals Symbol properties
 * - JSON.stringify ignores Symbol properties
 */

console.log("\n=== 4. Symbol Practical Applications Demo ===");

// 4.1 "Private" properties with Symbol (not truly private!)
let idSymbol = Symbol('id');

class User {
  constructor(name, id) {
    this.name = name;
    this[idSymbol] = id; // "Private" property
  }

  getId() {
    return this[idSymbol];
  }
}

let user = new User("Alice", 123);
console.log("\nSymbol as 'private' property:");
console.log("user.name:", user.name);
console.log("user.id:", user.id); // undefined
console.log("user.getId():", user.getId()); // 123

// But not truly private!
const symbols = Object.getOwnPropertySymbols(user);
console.log("Can be discovered:", symbols);
console.log("Value accessible:", user[symbols[0]]);

// 4.2 Avoiding naming conflicts
let plugin1 = {
  [Symbol.for("plugin.init")]() {
    console.log("Plugin 1 initialized");
  }
};

let plugin2 = {
  [Symbol.for("plugin.init")]() {
    console.log("Plugin 2 initialized");
  }
};

let app = {
  ...plugin1,
  ...plugin2,
  run() {
    // Each plugin has its own symbol-keyed method
    plugin1[Symbol.for("plugin.init")]();
    plugin2[Symbol.for("plugin.init")]();
  }
};

console.log("\nAvoiding naming conflicts:");
app.run();

// 4.3 Protocol implementation - Iterable protocol
let customIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};

console.log("\nCustom iterable protocol:");
console.log("Spread:", [...customIterable]); // [1, 2, 3]

// 4.4 Metadata storage
const metadataSymbol = Symbol.for("meta.metadata");

function addMetadata(target, metadata) {
  target[metadataSymbol] = metadata;
}

function getMetadata(target) {
  return target[metadataSymbol];
}

let annotatedFunction = function() {};
addMetadata(annotatedFunction, { version: "1.0", author: "Dev" });

console.log("\nMetadata storage:");
console.log("Metadata:", getMetadata(annotatedFunction));

// 4.5 JSON.stringify ignores Symbol properties
let objWithSymbols = {
  name: "Test",
  [Symbol("secret")]: "hidden value"
};

console.log("\nJSON.stringify ignores Symbols:");
console.log("JSON.stringify:", JSON.stringify(objWithSymbols)); // {"name":"Test"}


// ============================================================================
// 5. SYMBOL WITH OTHER FEATURES
// ============================================================================
/**
 * Symbol Interaction with Other JavaScript Features
 *
 * Interactions:
 * 1. for...of uses Symbol.iterator
 * 2. for await...of uses Symbol.asyncIterator
 * 3. JSON.stringify ignores Symbol properties
 * 4. Proxy/Reflect can intercept Symbol operations
 * 5. Object methods behavior with Symbols
 *
 * Object Methods and Symbols:
 * - Object.keys(): Excludes Symbol properties
 * - Object.getOwnPropertyNames(): Excludes Symbol properties
 * - Object.getOwnPropertySymbols(): Returns Symbol properties
 * - Reflect.ownKeys(): Returns all keys (strings + symbols)
 *
 * Common Pitfalls:
 * - Forgetting that JSON.stringify ignores Symbols
 * - Confusion about which methods include Symbols
 */

console.log("\n=== 5. Symbol with Other Features Demo ===");

// 5.1 Symbol.iterator and for...of
let collection = {
  items: [10, 20, 30],

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.items.length) {
          return { done: false, value: this.items[index++] };
        }
        return { done: true };
      }
    };
  }
};

console.log("\nfor...of with Symbol.iterator:");
for (let item of collection) {
  console.log("  ", item); // 10, 20, 30
}

// 5.2 Symbol.asyncIterator and for await...of
let asyncCollection = {
  data: [1, 2, 3],

  async *[Symbol.asyncIterator]() {
    for (let item of this.data) {
      await new Promise(resolve => setTimeout(resolve, 10));
      yield item;
    }
  }
};

console.log("\nfor await...of with Symbol.asyncIterator:");
(async () => {
  for await (let item of asyncCollection) {
    console.log("  ", item); // 1, 2, 3
  }
})();

// 5.3 Object methods with Symbol properties
let objWithMultipleSymbols = {
  stringProp: "string",
  [Symbol("sym1")]: "symbol1",
  [Symbol("sym2")]: "symbol2"
};

console.log("\nObject methods with Symbols:");
console.log("Object.keys():", Object.keys(objWithMultipleSymbols));
console.log("Object.getOwnPropertyNames():", Object.getOwnPropertyNames(objWithMultipleSymbols));
console.log("Object.getOwnPropertySymbols():", Object.getOwnPropertySymbols(objWithMultipleSymbols));
console.log("Reflect.ownKeys():", Reflect.ownKeys(objWithMultipleSymbols));

// 5.4 Proxy intercepting Symbol operations
let target = {
  [Symbol("hidden")]: "secret"
};

let handler = {
  getOwnPropertyDescriptor(trapTarget, prop) {
    console.log(`Getting descriptor for: ${String(prop)}`);
    return Object.getOwnPropertyDescriptor(trapTarget, prop);
  }
};

let proxy = new Proxy(target, handler);
console.log("\nProxy with Symbol:");
Object.getOwnPropertySymbols(proxy);

// 5.5 Spread operator and Symbol.iterator
let str = "hello";
console.log("\nSpread with Symbol.iterator:");
console.log("String spread:", [...str]); // ['h', 'e', 'l', 'l', 'o']

// 5.6 Destructuring and Symbol.iterator
let [first, ...rest] = collection;
console.log("\nDestructuring:");
console.log("First:", first, "Rest:", rest);


// ============================================================================
// BEST PRACTICES
// ============================================================================
/**
 * Symbol Best Practices
 *
 * 1. USE SYMBOL.FOR() FOR SHARED SYMBOLS
 *    - Cross-module communication
 *    - Plugin systems
 *    - API contracts
 *
 * 2. USE SYMBOL() FOR UNIQUE SYMBOLS
 *    - Private-like properties
 *    - Internal state
 *    - Avoiding conflicts
 *
 * 3. DOCUMENT SYMBOL USAGE
 *    - Comment the purpose
 *    - Export shared symbols
 *    - Use descriptive descriptions
 *
 * 4. CONSIDER ALTERNATIVES
 *    - # private fields for true privacy
 *    - WeakMap for metadata
 *    - Regular properties for non-hidden data
 *
 * 5. BE AWARE OF LIMITATIONS
 *    - Not truly private
 *    - JSON.stringify ignores them
 *    - Can be discovered with getOwnPropertySymbols
 */

console.log("\n=== Symbol Best Practices Demo ===");

// Good: Using Symbol.for for shared constants
const API_EVENTS = {
  INIT: Symbol.for("api.init"),
  READY: Symbol.for("api.ready"),
  ERROR: Symbol.for("api.error")
};

// Good: Using Symbol description for debugging
const debugSymbol = Symbol("user.internalState");
console.log("Debug symbol:", debugSymbol.description);

// Good: Exporting shared symbols
// In a module:
// export const PRIVATE_DATA = Symbol('privateData');

// Avoid: Assuming Symbols are private
class BadExample {
  constructor() {
    this[Symbol("secret")] = "password"; // Not truly private!
  }
}


// ============================================================================
// COMMON PITFALLS
// ============================================================================
console.log("\n=== Symbol Common Pitfalls Demo ===");

// Pitfall 1: Cannot use 'new' with Symbol
try {
  new Symbol();
} catch (error) {
  console.log("Pitfall 1 - Cannot use new:", error.message);
}

// Pitfall 2: Implicit string conversion fails
let sym = Symbol("test");
try {
  console.log("test" + sym);
} catch (error) {
  console.log("Pitfall 2 - Implicit conversion:", error.message);
}

// Pitfall 3: JSON.stringify ignores Symbol properties
let data = {
  name: "test",
  [Symbol("id")]: 123
};
console.log("Pitfall 3 - JSON.stringify:", JSON.stringify(data)); // {"name":"test"}

// Pitfall 4: Symbols are not truly private
let symObj = {
  [Symbol("private")]: "secret"
};
let symSymbols = Object.getOwnPropertySymbols(symObj);
console.log("Pitfall 4 - Can discover:", symObj[symSymbols[0]]);

// Pitfall 5: Symbol.keyFor only works for global symbols
let local = Symbol("test");
let global = Symbol.for("test");
console.log("Pitfall 5 - keyFor local:", Symbol.keyFor(local)); // undefined
console.log("Pitfall 5 - keyFor global:", Symbol.keyFor(global)); // "test"


// ============================================================================
// SUMMARY
// ============================================================================
/**
 * Symbol Summary
 *
 * Key Concepts:
 * 1. Unique, immutable primitive values
 * 2. Global registry with Symbol.for/keyFor
 * 3. Well-known symbols for protocol customization
 * 4. Not enumerable in for...in/Object.keys
 * 5. Not truly private, but hidden from casual access
 *
 * When to Use:
 * - Unique property keys
 * - Avoiding naming conflicts
 * - Implementing protocols (iterable, etc.)
 * - Metadata storage
 *
 * When to Avoid:
 * - When you need true privacy (use # private fields)
 * - When you need JSON serialization
 * - When simplicity is preferred
 */

console.log("\n=== Symbol Deep Dive Demo Complete ===");


// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. UNIQUE SYMBOL TYPE
   TS:  const sym: unique symbol = Symbol('id')
   TS:  unique symbol can only be used with const

   TypeScript example:
   const ID_KEY: unique symbol = Symbol('id');
   class User {
     [ID_KEY]: number;
   }

2. SYMBOL INDEX SIGNATURE
   TS:  { [key: symbol]: string }

   TypeScript example:
   interface SymbolMap {
     [key: symbol]: string;
   }

3. WELL-KNOWN SYMBOLS TYPING
   TS:  Built-in Symbol types are predefined

   TypeScript example:
   class CustomIterable {
     [Symbol.iterator](): Iterator<number> {
       // ...
     }
   }

4. SYMBOL.TO PRIMITIVE TYPING
   TS:  [Symbol.toPrimitive](hint: string): string | number

   TypeScript example:
   class Money {
     [Symbol.toPrimitive](hint: string): string | number {
       return hint === 'string' ? '$100' : 100;
     }
   }

📘 See related: 01-variables.js (Symbol basics)
📘 See related: 22-iterators-generators.js (Symbol.iterator)
*/
// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

Symbols & Weak Collections:
- 27-memory-management.js (WeakMap, WeakSet, WeakRef, FinalizationRegistry)
- 23-proxy-reflect.js (well-known symbols)
- 17-property-descriptors.js (property descriptors with symbols)
`);
