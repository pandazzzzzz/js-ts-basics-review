// Proxy and Reflect Demo
// 📘 For TypeScript comparison, see: 23-proxy-reflect-ts-comparison.ts


// ============================================
// Learning goals
// ============================================
// This file introduces proxies and the Reflect API as tools for intercepting and customizing object behavior.
// The examples focus on the idea of wrapping behavior rather than on advanced production patterns alone.

// ============================================
// Table of Contents
// ============================================

// 1. PROXY BASICS
// 2. GET TRAP
// 3. SET TRAP
// 4. HAS TRAP
// 5. DELETEPROPERTY TRAP
// 6. APPLY TRAP
// 7. CONSTRUCT TRAP
// 8. OTHER TRAPS
// 9. REFLECT API (Reflect API)
// 10. PRACTICAL EXAMPLES
// 11. PERFORMANCE AND PITFALLS
// 12. ADVANCED PATTERNS

// ============================================

// ============================================
// 1. PROXY BASICS
// ============================================
/**
 * Proxy - Create a wrapper for custom object behavior (ES6)
 *
 * Syntax:
 * - new Proxy(target, handler)
 * - target: Object to wrap
 * - handler: Object with trap methods
 *
 * Handler Traps:
 * - get, set, has, deleteProperty
 * - apply, construct
 * - ownKeys, getOwnPropertyDescriptor
 * - defineProperty, preventExtensions
 * - isExtensible, getPrototypeOf
 * - setPrototypeOf
 *
 * Use Cases:
 * - Data validation
 * - Property access logging
 * - Default values
 * - Negative array indices
 * - Reactive systems
 *
 * Common Pitfalls:
 * - Proxy is not the same object (===)
 * - this binding issues
 * - Performance overhead
 */

console.log("=== 1. Proxy Basics Demo ===");

// 1.1 Basic Proxy
let target = {
  name: "Target",
  value: 42
};

let handler = {};
let proxy = new Proxy(target, handler);

console.log("Basic proxy:");
console.log("proxy.name:", proxy.name); // "Target"
console.log("proxy.value:", proxy.value); // 42

// 1.2 Proxy with get trap
let target2 = {
  name: "Target2",
  secret: "hidden"
};

let handler2 = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return target[prop];
  }
};

let proxy2 = new Proxy(target2, handler2);
console.log("\nProxy with get trap:");
console.log(proxy2.name); // Logs "Getting name", then "Target2"

// 1.3 Proxy with default values
let defaultProxy = new Proxy({}, {
  get(target, prop) {
    return prop in target ? target[prop] : "default value";
  }
});

defaultProxy.existing = "I exist";
console.log("\nProxy with default values:");
console.log("existing:", defaultProxy.existing); // "I exist"
console.log("nonexistent:", defaultProxy.nonexistent); // "default value"

// 1.4 Proxy identity
let original = { name: "Original" };
let proxyIdentity = new Proxy(original, {});

console.log("\nProxy identity:");
console.log("proxy === original:", proxyIdentity === original); // false
console.log("But both access same data");

// 1.5 Proxy pass-through (no traps)
let passThrough = new Proxy({ name: "test" }, {});
console.log("\nPass-through proxy:");
console.log(passThrough.name); // "test"
passThrough.newProp = "value";
console.log(passThrough.newProp); // "value"


// ============================================
// 2. GET TRAP
// ============================================
/**
 * get Trap - Intercept Property Access
 *
 * Signature:
 * - get(target, prop, receiver)
 * - target: Original object
 * - prop: Property name (string or Symbol)
 * - receiver: The proxy or inheriting object
 *
 * Intercepted Operations:
 * - proxy[prop]
 * - proxy.prop
 * - Object.create(proxy)[prop]
 * - Reflect.get(proxy, prop)
 *
 * Use Cases:
 * - Logging property access
 * - Computed properties
 * - Default values
 * - Data validation
 *
 * Invariants:
 * - Can't change non-writable, non-configurable property values
 */

console.log("\n=== 2. get Trap Demo ===");

// 2.1 Logging property access
let loggingTarget = {
  name: "Logging Object",
  value: 100
};

let loggingHandler = {
  get(target, prop, receiver) {
    console.log(`[LOG] Accessing: ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  }
};

let loggingProxy = new Proxy(loggingTarget, loggingHandler);
console.log("Logging proxy:");
console.log(loggingProxy.name);
console.log(loggingProxy.value);

// 2.2 Computed properties
let computedProxy = new Proxy({
  firstName: "John",
  lastName: "Doe"
}, {
  get(target, prop) {
    if (prop === "fullName") {
      return `${target.firstName} ${target.lastName}`;
    }
    return target[prop];
  }
});

console.log("\nComputed property:");
console.log(computedProxy.fullName); // "John Doe"

// 2.3 Negative array indices
function createArrayProxy(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      // Convert negative index to positive
      if (typeof prop === "string" && /^-?\d+$/.test(prop)) {
        let index = parseInt(prop);
        if (index < 0) {
          index = target.length + index;
        }
        return Reflect.get(target, String(index), receiver);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

let arr = [1, 2, 3, 4, 5];
let proxyArr = createArrayProxy(arr);

console.log("\nNegative array indices:");
console.log("proxyArr[-1]:", proxyArr[-1]); // 5 (last element)
console.log("proxyArr[-2]:", proxyArr[-2]); // 4

// 2.4 Type-safe property access
let safeProxy = new Proxy({
  age: 25,
  name: "Alice"
}, {
  get(target, prop) {
    if (!(prop in target)) {
      throw new ReferenceError(`Property "${String(prop)}" does not exist`);
    }
    return target[prop];
  }
});

console.log("\nSafe property access:");
console.log(safeProxy.age); // 25
try {
  console.log(safeProxy.nonexistent); // Throws error
} catch (e) {
  console.log("Error:", e.message);
}


// ============================================
// 3. SET TRAP
// ============================================
/**
 * set Trap - Intercept Property Assignment
 *
 * Signature:
 * - set(target, prop, value, receiver)
 * - Must return boolean (true = success)
 *
 * Intercepted Operations:
 * - proxy[prop] = value
 * - proxy.prop = value
 * - Reflect.set(proxy, prop, value)
 *
 * Use Cases:
 * - Data validation
 * - Type checking
 * - Change notification (reactive)
 * - Automatic conversion
 *
 * Invariants:
 * - Can't set non-writable, non-configurable property to different value
 * - Must return true for successful set
 */

console.log("\n=== 3. set Trap Demo ===");

// 3.1 Data validation
let validatedTarget = {
  age: 0,
  name: ""
};

let validatedProxy = new Proxy(validatedTarget, {
  set(target, prop, value, receiver) {
    if (prop === "age") {
      if (typeof value !== "number" || value < 0 || value > 150) {
        throw new TypeError("Age must be between 0 and 150");
      }
    }
    if (prop === "name") {
      if (typeof value !== "string" || value.length === 0) {
        throw new TypeError("Name must be non-empty string");
      }
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log("Validated proxy:");
validatedProxy.age = 30;
validatedProxy.name = "Bob";
console.log("Age:", validatedProxy.age);
console.log("Name:", validatedProxy.name);

try {
  validatedProxy.age = -5; // Throws error
} catch (e) {
  console.log("Validation error:", e.message);
}

// 3.2 Type coercion
let coercingProxy = new Proxy({}, {
  set(target, prop, value, receiver) {
    // Auto-convert number strings to numbers
    if (typeof value === "string" && /^\d+$/.test(value)) {
      value = Number(value);
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log("\nType coercion:");
coercingProxy.count = "42";
console.log("count:", coercingProxy.count, typeof coercingProxy.count); // 42, number

// 3.3 Change notification (simple reactivity)
let listeners = [];

let reactiveProxy = new Proxy({}, {
  set(target, prop, value, receiver) {
    let oldValue = target[prop];
    let result = Reflect.set(target, prop, value, receiver);

    // Notify listeners
    listeners.forEach(fn => fn(prop, value, oldValue));

    return result;
  }
});

console.log("\nChange notification:");
listeners.push((prop, newVal, oldVal) => {
  console.log(`Changed: ${prop} from ${oldVal} to ${newVal}`);
});

reactiveProxy.x = 10;
reactiveProxy.x = 20;


// ============================================
// 4. HAS TRAP
// ============================================
/**
 * has Trap - Intercept 'in' Operator
 *
 * Signature:
 * - has(target, prop)
 * - Returns boolean
 *
 * Intercepted Operations:
 * - prop in proxy
 * - Reflect.has(proxy, prop)
 *
 * Use Cases:
 * - Hiding properties
 * - Virtual properties
 * - Property existence validation
 *
 * Invariants:
 * - Can't hide non-configurable properties
 */

console.log("\n=== 4. has Trap Demo ===");

// 4.1 Hiding properties
let hiddenTarget = {
  public: "visible",
  _private: "hidden"
};

let hiddenProxy = new Proxy(hiddenTarget, {
  has(target, prop) {
    // Hide properties starting with _
    if (prop.startsWith("_")) {
      return false;
    }
    return prop in target;
  }
});

console.log("Hiding properties:");
console.log("'public' in proxy:", "public" in hiddenProxy); // true
console.log("'_private' in proxy:", "_private" in hiddenProxy); // false
console.log("Actual value:", hiddenProxy._private); // Still accessible directly!

// 4.2 Virtual properties
let virtualProxy = new Proxy({}, {
  has(target, prop) {
    // Make certain properties appear to exist
    if (prop.startsWith("is")) {
      return true;
    }
    return prop in target;
  },

  get(target, prop) {
    if (prop.startsWith("is")) {
      return true;
    }
    return target[prop];
  }
});

console.log("\nVirtual properties:");
console.log("'isActive' in proxy:", "isActive" in virtualProxy); // true
console.log("proxy.isActive:", virtualProxy.isActive); // true


// ============================================
// 5. DELETEPROPERTY TRAP
// ============================================
/**
 * deleteProperty Trap - Intercept delete Operator
 *
 * Signature:
 * - deleteProperty(target, prop)
 * - Returns boolean
 *
 * Intercepted Operations:
 * - delete proxy.prop
 * - delete proxy[prop]
 * - Reflect.deleteProperty(proxy, prop)
 *
 * Use Cases:
 * - Preventing deletion
 * - Cascade deletion
 * - Deletion logging
 *
 * Invariants:
 * - Can't delete non-configurable properties
 */

console.log("\n=== 5. deleteProperty Trap Demo ===");

// 5.1 Preventing deletion
let protectedProxy = new Proxy({
  important: "data",
  removable: "can delete"
}, {
  deleteProperty(target, prop) {
    if (prop === "important") {
      console.log("Cannot delete important property");
      return false;
    }
    return Reflect.deleteProperty(target, prop);
  }
});

console.log("Preventing deletion:");
console.log("Before delete:", protectedProxy.important);
delete protectedProxy.removable;
console.log("After delete removable:", protectedProxy.removable); // undefined
delete protectedProxy.important;
console.log("After delete important:", protectedProxy.important); // Still "data"

// 5.2 Deletion logging
let loggedProxy = new Proxy({ a: 1, b: 2 }, {
  deleteProperty(target, prop) {
    console.log(`Deleting property: ${String(prop)}`);
    return Reflect.deleteProperty(target, prop);
  }
});

console.log("\nDeletion logging:");
delete loggedProxy.a;


// ============================================
// 6. APPLY TRAP
// ============================================
/**
 * apply Trap - Intercept Function Calls
 *
 * Signature:
 * - apply(target, thisArg, argumentsList)
 * - target: Original function
 * - thisArg: Value of this
 * - argumentsList: Array of arguments
 *
 * Intercepted Operations:
 * - proxy(...args)
 * - proxy.call(this, ...args)
 * - proxy.apply(this, args)
 * - Reflect.apply(proxy, this, args)
 *
 * Use Cases:
 * - Function logging
 * - Argument validation
 * - Caching/memoization
 * - Timing/profiling
 */

console.log("\n=== 6. apply Trap Demo ===");

// 6.1 Function logging
function greet(name, greeting) {
  return `${greeting}, ${name}!`;
}

let loggedFunction = new Proxy(greet, {
  apply(target, thisArg, args) {
    console.log(`Calling function with args:`, args);
    let result = Reflect.apply(target, thisArg, args);
    console.log(`Function returned:`, result);
    return result;
  }
});

console.log("Function logging:");
console.log(loggedFunction("Alice", "Hello"));

// 6.2 Argument validation
let validatedFunction = new Proxy(function(a, b) {
  return a + b;
}, {
  apply(target, thisArg, args) {
    // Ensure all arguments are numbers
    for (let arg of args) {
      if (typeof arg !== "number") {
        throw new TypeError("All arguments must be numbers");
      }
    }
    return Reflect.apply(target, thisArg, args);
  }
});

console.log("\nArgument validation:");
console.log(validatedFunction(5, 3)); // 8
try {
  validatedFunction(5, "3"); // Throws error
} catch (e) {
  console.log("Error:", e.message);
}

// 6.3 Memoization/caching
function expensive(n) {
  console.log(`Computing for ${n}...`);
  return n * n;
}

let cache = new Map();
let memoizedFunction = new Proxy(expensive, {
  apply(target, thisArg, args) {
    let key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`Cache hit for ${key}`);
      return cache.get(key);
    }
    let result = Reflect.apply(target, thisArg, args);
    cache.set(key, result);
    return result;
  }
});

console.log("\nMemoization:");
console.log(memoizedFunction(5)); // Computes
console.log(memoizedFunction(5)); // Cache hit
console.log(memoizedFunction(6)); // Computes


// ============================================
// 7. CONSTRUCT TRAP
// ============================================
/**
 * construct Trap - Intercept new Operator
 *
 * Signature:
 * - construct(target, argumentsList, newTarget)
 * - target: Constructor function
 * - argumentsList: Array of arguments
 * - newTarget: The called constructor (for inheritance)
 *
 * Intercepted Operations:
 * - new proxy(...args)
 * - Reflect.construct(proxy, args)
 *
 * Use Cases:
 * - Constructor validation
 * - Factory pattern
 * - Singleton pattern
 */

console.log("\n=== 7. construct Trap Demo ===");

// 7.1 Constructor validation
function Person(name, age) {
  this.name = name;
  this.age = age;
}

let ValidatedPerson = new Proxy(Person, {
  construct(target, args) {
    let [name, age] = args;

    if (typeof name !== "string" || name.length === 0) {
      throw new TypeError("Name must be non-empty string");
    }
    if (typeof age !== "number" || age < 0) {
      throw new TypeError("Age must be positive number");
    }

    return Reflect.construct(target, args);
  }
});

console.log("Constructor validation:");
let p1 = new ValidatedPerson("Alice", 25);
console.log("Created:", p1.name, p1.age);

try {
  new ValidatedPerson("", 25); // Throws error
} catch (e) {
  console.log("Error:", e.message);
}

// 7.2 Singleton pattern
let SingletonProxy = new Proxy(function() {
  this.data = "singleton data";
}, {
  construct(target, args) {
    if (!this.instance) {
      this.instance = Reflect.construct(target, args);
    }
    return this.instance;
  }
});

console.log("\nSingleton pattern:");
let s1 = new SingletonProxy();
let s2 = new SingletonProxy();
console.log("s1 === s2:", s1 === s2); // true


// ============================================
// 8. OTHER TRAPS
// ============================================
/**
 * Other Proxy Traps
 *
 * ownKeys(target):
 * - Intercept Object.keys(), for...in, Object.getOwnPropertyNames
 * - Returns array of property names
 *
 * getOwnPropertyDescriptor(target, prop):
 * - Intercept Object.getOwnPropertyDescriptor
 * - Returns property descriptor
 *
 * defineProperty(target, prop, descriptor):
 * - Intercept Object.defineProperty
 * - Returns boolean
 *
 * preventExtensions(target):
 * - Intercept Object.preventExtensions
 * - Returns boolean
 *
 * isExtensible(target):
 * - Intercept Object.isExtensible
 * - Returns boolean
 *
 * getPrototypeOf(target):
 * - Intercept Object.getPrototypeOf
 * - Returns prototype object
 *
 * setPrototypeOf(target, proto):
 * - Intercept Object.setPrototypeOf
 * - Returns boolean
 */

console.log("\n=== 8. Other Traps Demo ===");

// 8.1 ownKeys trap
let ownKeysTarget = { a: 1, b: 2, _hidden: 3 };

let ownKeysProxy = new Proxy(ownKeysTarget, {
  ownKeys(target) {
    // Filter out hidden properties
    return Object.keys(target).filter(k => !k.startsWith("_"));
  }
});

console.log("ownKeys trap:");
console.log("Object.keys:", Object.keys(ownKeysProxy)); // ['a', 'b']
console.log("for...in:");
for (let key in ownKeysProxy) {
  console.log("  ", key);
}

// 8.2 getOwnPropertyDescriptor trap
let descriptorTarget = { visible: "data" };

let descriptorProxy = new Proxy(descriptorTarget, {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`Getting descriptor for: ${String(prop)}`);
    return Reflect.getOwnPropertyDescriptor(target, prop);
  }
});

console.log("\ngetOwnPropertyDescriptor:");
Object.getOwnPropertyDescriptor(descriptorProxy, "visible");

// 8.3 defineProperty trap
let defineProxy = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(`Defining property: ${String(prop)}`);
    // Add configurable: true by default
    descriptor.configurable = true;
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

console.log("\ndefineProperty:");
Object.defineProperty(defineProxy, "test", { value: 42 });

// 8.4 preventExtensions trap
let preventProxy = new Proxy({}, {
  preventExtensions(target) {
    console.log("preventExtensions called");
    return Reflect.preventExtensions(target);
  },

  isExtensible(target) {
    console.log("isExtensible called");
    return Reflect.isExtensible(target);
  }
});

console.log("\npreventExtensions/isExtensible:");
console.log("Is extensible:", Object.isExtensible(preventProxy));
Object.preventExtensions(preventProxy);


// ============================================
// 9. REFLECT API (Reflect API)
// ============================================
/**
 * Reflect API - Standard Object Operations (ES6)
 *
 * Purpose:
 * - Consistent API for object operations
 * - Return boolean instead of throwing
 * - Forward Proxy trap calls
 *
 * Methods (13 total):
 * - Reflect.get(target, prop, receiver)
 * - Reflect.set(target, prop, value, receiver)
 * - Reflect.has(target, prop)
 * - Reflect.deleteProperty(target, prop)
 * - Reflect.apply(target, thisArg, args)
 * - Reflect.construct(target, args, newTarget)
 * - Reflect.ownKeys(target)
 * - Reflect.getOwnPropertyDescriptor(target, prop)
 * - Reflect.defineProperty(target, prop, descriptor)
 * - Reflect.preventExtensions(target)
 * - Reflect.isExtensible(target)
 * - Reflect.getPrototypeOf(target)
 * - Reflect.setPrototypeOf(target, proto)
 *
 * Why Use Reflect:
 * - Consistent return values
 * - Better for Proxy forwarding
 * - Functional style
 */

console.log("\n=== 9. Reflect API Demo ===");

// 9.1 Reflect.get vs Object property access
let obj = { x: 10 };
console.log("Reflect.get:", Reflect.get(obj, "x")); // 10
console.log("Direct access:", obj.x); // 10

// 9.2 Reflect.set returns boolean
let setObj = {};
console.log("\nReflect.set:");
console.log("Success:", Reflect.set(setObj, "x", 42)); // true

// 9.3 Reflect.has vs 'in' operator
console.log("\nReflect.has:");
console.log("Reflect.has:", Reflect.has(obj, "x")); // true
console.log("'in' operator:", "x" in obj); // true

// 9.4 Reflect.ownKeys includes symbols
let sym = Symbol("test");
let symObj = { a: 1, [sym]: 2 };

console.log("\nReflect.ownKeys:");
console.log("Object.keys:", Object.keys(symObj)); // ['a']
console.log("Reflect.ownKeys:", Reflect.ownKeys(symObj)); // ['a', Symbol(test)]

// 9.5 Reflect.apply vs Function.prototype.apply
function add(a, b) {
  return a + b;
}

console.log("\nReflect.apply:");
console.log("Reflect.apply:", Reflect.apply(add, null, [1, 2])); // 3
console.log("Function.apply:", add.apply(null, [1, 2])); // 3

// 9.6 Reflect.construct vs new
function Person2(name) {
  this.name = name;
}

console.log("\nReflect.construct:");
let p2 = Reflect.construct(Person2, ["Alice"]);
console.log("Constructed:", p2.name);

// 9.7 Reflect in Proxy traps (best practice)
let bestPracticeProxy = new Proxy({ x: 10 }, {
  get(target, prop, receiver) {
    // Always use Reflect.get for forwarding
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    // Always use Reflect.set for forwarding
    console.log(`Setting ${String(prop)} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log("\nBest practice proxy:");
console.log(bestPracticeProxy.x);
bestPracticeProxy.y = 20;


// ============================================
// 10. PRACTICAL EXAMPLES
// ============================================
/**
 * Practical Proxy Examples
 *
 * Examples:
 * 1. Data validation
 * 2. Property access logging
 * 3. Reactive systems
 * 4. Negative array indices
 * 5. API client with caching
 *
 * Best Practices:
 * - Use Reflect for forwarding
 * - Keep traps focused
 * - Document proxy behavior
 * - Consider performance impact
 */

console.log("\n=== 10. Practical Examples Demo ===");

// 10.1 Simple reactive system
function createReactiveObject(initial = {}) {
  let listeners = new Set();

  let proxy = new Proxy(initial, {
    set(target, prop, value, receiver) {
      let oldValue = target[prop];
      let result = Reflect.set(target, prop, value, receiver);

      if (result && oldValue !== value) {
        listeners.forEach(fn => fn(prop, value, oldValue));
      }

      return result;
    }
  });

  proxy.on = (fn) => listeners.add(fn);
  proxy.off = (fn) => listeners.delete(fn);

  return proxy;
}

console.log("Reactive object:");
let state = createReactiveObject({ count: 0 });

state.on((prop, newVal, oldVal) => {
  console.log(`${prop}: ${oldVal} -> ${newVal}`);
});

state.count = 1;
state.count = 2;

// 10.2 Readonly proxy
// Note: set/deleteProperty traps returning false silently fail in non-strict
// mode, but THROW a TypeError in strict mode (e.g. ESM modules are strict).
function createReadonly(obj) {
  return new Proxy(obj, {
    set(target, prop, value) {
      console.log(`Cannot set ${String(prop)}: readonly object`);
      return false;
    },

    deleteProperty(target, prop) {
      console.log(`Cannot delete ${String(prop)}: readonly object`);
      return false;
    }
  });
}

console.log("\nReadonly proxy:");
let readonly = createReadonly({ x: 10 });
console.log("x:", readonly.x);
readonly.x = 20; // Logs error

// 10.3 Auto-saving proxy
function createAutoSave(obj, saveFn) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      let result = Reflect.set(target, prop, value, receiver);
      if (result) {
        saveFn(target);
      }
      return result;
    }
  });
}

console.log("\nAuto-save proxy:");
let data = { name: "test" };
let savedData = createAutoSave(data, (obj) => {
  console.log("Saving:", JSON.stringify(obj));
});

savedData.name = "updated";
savedData.value = 42;


// ============================================
// 11. PERFORMANCE AND PITFALLS
// ============================================
console.log("\n=== 11. Performance and Pitfalls Demo ===");

// 11.1 Proxy has overhead
let plainObj = { x: 1, y: 2, z: 3 };
let proxiedObj = new Proxy({ x: 1, y: 2, z: 3 }, {});

console.log("Proxy has performance overhead:");
console.log("Use proxies judiciously");

// 11.2 this binding issue
let user = {
  name: "Alice",
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

let userProxy = new Proxy(user, {});

console.log("\nthis binding:");
console.log("Direct call:", user.greet()); // "Hello, I'm Alice"
console.log("Proxy call:", userProxy.greet()); // "Hello, I'm Alice" (works!)

// But if method is extracted:
let extractedGreet = userProxy.greet;
// Note: bare call (no .call/.apply) sets this to globalThis in non-strict mode,
// so it returns "Hello, I'm undefined" — it does NOT throw.
console.log("Extracted:", extractedGreet()); // "Hello, I'm undefined"

// 11.3 Private fields and Proxy
class PrivateClass {
  #private = "secret";

  getPrivate() {
    return this.#private;
  }
}

let privateInstance = new PrivateClass();
let privateProxy = new Proxy(privateInstance, {});

console.log("\nPrivate fields:");
// Note: Private fields CANNOT be accessed through a Proxy. When getPrivate()
// is called on the proxy, 'this' is the proxy (not a PrivateClass instance),
// so accessing #private throws TypeError — there is no "correct this binding"
// workaround; this always throws.
try {
  console.log("Can access method:", privateProxy.getPrivate()); // always throws
} catch (e) {
  console.log("Private field limitation:", e.message);
}


// ============================================
// 12. ADVANCED PATTERNS
// ============================================
console.log("\n=== 12. Advanced Patterns Demo ===");

// 12.1 Revocable proxy
let { proxy: revocableProxy, revoke } = Proxy.revocable(
  { secret: "data" },
  {}
);

console.log("Revocable proxy:");
console.log("Before revoke:", revocableProxy.secret);
revoke();
try {
  console.log(revocableProxy.secret); // TypeError
} catch (e) {
  console.log("After revoke:", e.message);
}

// 12.2 Proxy chain (proxy wrapping proxy)
let base = { value: 42 };
let proxy1 = new Proxy(base, {
  get(target, prop) {
    console.log("Proxy 1 get");
    return target[prop];
  }
});

let proxyChain2 = new Proxy(proxy1, {
  get(target, prop) {
    console.log("Proxy 2 get");
    return target[prop];
  }
});

console.log("\nProxy chain:");
console.log(proxyChain2.value); // Goes through both proxies

// 12.3 Membrane pattern (transparent wrapping)
function createMembrane() {
  let wrapped = new WeakMap();
  let unwrapped = new WeakMap();

  function wrap(value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    if (wrapped.has(value)) {
      return wrapped.get(value);
    }

    let proxy = new Proxy(value, {
      get(target, prop, receiver) {
        return wrap(Reflect.get(target, prop, receiver));
      },
      set(target, prop, value, receiver) {
        return Reflect.set(target, prop, unwrap(value), receiver);
      }
    });

    wrapped.set(value, proxy);
    unwrapped.set(proxy, value);

    return proxy;
  }

  function unwrap(value) {
    if (unwrapped.has(value)) {
      return unwrapped.get(value);
    }
    return value;
  }

  return wrap;
}

console.log("\nMembrane pattern:");
let membrane = createMembrane();
let originalObj = { nested: { value: 42 } };
let wrappedObj = membrane(originalObj);
console.log("Wrapped access:", wrappedObj.nested.value);


// ============================================
// SUMMARY
// ============================================
/**
 * Proxy and Reflect Summary
 *
 * Key Concepts:
 * 1. Proxy wraps target object with custom behavior
 * 2. 13 different traps for intercepting operations
 * 3. Reflect provides consistent forwarding methods
 * 4. Revocable proxies for controlled access
 * 5. Many practical applications (validation, logging, reactivity)
 *
 * When to Use:
 * - Data validation
 * - Logging/debugging
 * - Reactive systems
 * - Default values
 * - API abstraction
 *
 * When to Avoid:
 * - Performance-critical code
 * - When simpler solution exists
 * - For true privacy (use # private fields)
 */

console.log("\n=== Proxy and Reflect Demo Complete ===");


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. PROXY TYPING
   JS:  let proxy = new Proxy(target, handler);
   TS:  let proxy: typeof target = new Proxy(target, handler);

2. HANDLER TYPING
   TS:  Proxy Handler<T> interface

   TypeScript example:
   const handler: ProxyHandler<MyObject> = {
     get(target, prop, receiver) {
       return Reflect.get(target, prop, receiver);
     }
   };

3. GENERIC HANDLERS
   TS:  Can create generic proxy handlers

   TypeScript example:
   function createLoggingProxy<T extends object>(obj: T): T {
     return new Proxy(obj, {
       get(target, prop, receiver) {
         console.log(`Getting ${String(prop)}`);
         return Reflect.get(target, prop, receiver);
       }
     });
   }

4. REFLECT RETURN TYPES
   TS:  Reflect methods have proper return types

   TypeScript example:
   const value: number = Reflect.get(obj, 'prop');
   const success: boolean = Reflect.set(obj, 'prop', value);

5. PROXY WITH CLASSES
   TS:  Can proxy classes with proper typing

   TypeScript example:
   class MyClass {
     value: number = 0;
   }

   const proxiedClass = new Proxy(MyClass, {
     construct(target, args, newTarget) {
       return Reflect.construct(target, args, newTarget);
     }
   });

📘 See related: 17-property-descriptors.js for property manipulation
📘 See related: 16-classes.js for class patterns
*/
// ============================================
// CROSS-REFERENCES
// ============================================
console.log(`
📘 See related files for additional patterns:

Proxy & Reflect:
- 17-property-descriptors.js (property descriptors)
- 19-symbol-deep.js (well-known symbols)
`);


// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 17-property-descriptors.js - Property descriptors");
console.log("📘 19-symbol-deep.js - Well-known Symbols");
console.log("📘 24.1-function-composition.js - Function composition and decorators");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 23-proxy-reflect-ts-comparison.ts
*/
