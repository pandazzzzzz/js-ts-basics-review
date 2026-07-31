// Property Descriptors & Configuration Demo
// 📘 For TypeScript comparison, see: 17-property-descriptors-ts-comparison.ts


// ============================================
// Learning goals
// ============================================
// This file introduces property descriptors and configuration flags that control how object properties behave.
// The examples show how the language exposes low-level behavior that is often hidden behind everyday syntax.

// ============================================
// Table of Contents
// ============================================

// 1. PROPERTY FLAGS
// 2. Object.defineProperty()
// 3. Object.defineProperties()
// 4. OBJECT-LEVEL RESTRICTION METHODS
// 5. GETTERS AND SETTERS
// 6. RELATIONSHIP WITH OTHER CONCEPTS

// ============================================

// ============================================
// 1. PROPERTY FLAGS
// ============================================
/**
 * Property Flags - Attributes that control property behavior (ES5)
 *
 * Three main flags:
 * - writable: Whether the value can be changed
 * - enumerable: Whether the property shows up in for...in / Object.keys()
 * - configurable: Whether the property can be deleted or its flags changed
 *
 * Default values (when using Object.defineProperty):
 * - All flags default to false
 * - When creating properties via assignment, all flags are true
 *
 * Use Cases:
 * - Creating read-only properties
 * - Hiding internal properties from enumeration
 * - Protecting properties from deletion
 *
 * Common Pitfalls:
 * - Forgetting that defineProperty sets flags to false by default
 * - Trying to change non-configurable properties
 * - Not understanding the difference between assignment and defineProperty
 */

console.log("=== 1. Property Flags Demo ===");

// 1.1 Viewing property descriptors
let user = {
  name: "John",
  age: 30
};

// Get descriptor for a single property
let descriptor = Object.getOwnPropertyDescriptor(user, 'name');
console.log("Descriptor for 'name':", descriptor);
// { value: 'John', writable: true, enumerable: true, configurable: true }

// Get all property descriptors
let allDescriptors = Object.getOwnPropertyDescriptors(user);
console.log("All descriptors:", allDescriptors);

// 1.2 Default flags with assignment vs defineProperty
let obj = {};

// Assignment creates properties with all flags = true
obj.prop1 = "value";
console.log("Assignment flags:", Object.getOwnPropertyDescriptor(obj, 'prop1'));
// { value: 'value', writable: true, enumerable: true, configurable: true }

// Object.defineProperty creates properties with all flags = false by default
Object.defineProperty(obj, 'prop2', {
  value: "value"
});
console.log("defineProperty flags:", Object.getOwnPropertyDescriptor(obj, 'prop2'));
// { value: 'value', writable: false, enumerable: false, configurable: false }


// ============================================
// 2. Object.defineProperty()
// ============================================
/**
 * Object.defineProperty() - Precise property definition (ES5)
 *
 * Syntax: Object.defineProperty(obj, prop, descriptor)
 *
 * Data Descriptor:
 * - value: The property's value
 * - writable: Can the value be changed?
 * - enumerable: Does it appear in for...in / Object.keys()?
 * - configurable: Can the property be deleted or its descriptor changed?
 *
 * Accessor Descriptor:
 * - get: Function that returns the property value
 * - set: Function that sets the property value
 * - enumerable: Same as data descriptor
 * - configurable: Same as data descriptor
 *
 * Common Pitfalls:
 * - Cannot mix data and accessor descriptors
 * - Non-configurable properties cannot change descriptor type
 * - Strict mode throws TypeError for violations
 */

console.log("\n=== 2. Object.defineProperty() Demo ===");

// 2.1 writable: false - Non-writable property
let person = {
  name: "Alice"
};

Object.defineProperty(person, 'name', {
  writable: false
});

console.log("Before assignment:", person.name); // Alice

// In non-strict mode, assignment fails silently
person.name = "Bob";
console.log("After assignment (non-strict):", person.name); // Alice (unchanged)

// In strict mode, this would throw TypeError
(function() {
  "use strict";
  let strictPerson = { name: "Charlie" };
  Object.defineProperty(strictPerson, 'name', { writable: false });

  try {
    strictPerson.name = "David";
  } catch (error) {
    console.log("Strict mode error:", error.message);
  }
})();

// 2.2 enumerable: false - Non-enumerable property
let product = {
  id: 1,
  price: 100
};

Object.defineProperty(product, 'internalId', {
  value: "SECRET-123",
  enumerable: false
});

console.log("\nEnumerable check:");
console.log("Keys:", Object.keys(product)); // ['id', 'price']
console.log("for...in:");
for (let key in product) {
  console.log("  ", key);
}
console.log("Hidden property exists:", product.internalId); // SECRET-123
console.log("Descriptor:", Object.getOwnPropertyDescriptor(product, 'internalId'));

// 2.3 configurable: false - Non-configurable property
let config = {
  apiKey: "abc123"
};

Object.defineProperty(config, 'apiKey', {
  configurable: false,
  writable: false
});

console.log("\nNon-configurable property:");
console.log("Cannot delete:", delete config.apiKey); // false (fails silently)
console.log("Still exists:", config.apiKey); // abc123

try {
  // Cannot change flags when configurable: false
  Object.defineProperty(config, 'apiKey', {
    enumerable: false
  });
} catch (error) {
  console.log("Cannot reconfigure:", error.message);
}

// 2.4 configurable: false is irreversible
let locked = { value: 42 };
Object.defineProperty(locked, 'value', {
  configurable: false
});

// This is permanent - we cannot make it configurable again
try {
  Object.defineProperty(locked, 'value', {
    configurable: true
  });
} catch (error) {
  console.log("Cannot reverse configurable:", error.message);
}


// ============================================
// 3. Object.defineProperties()
// ============================================
/**
 * Object.defineProperties() - Define multiple properties at once (ES5)
 *
 * Syntax: Object.defineProperties(obj, descriptors)
 *
 * Advantages:
 * - Define multiple properties in one call
 * - More efficient than multiple defineProperty calls
 * - Used with getOwnPropertyDescriptors for cloning
 *
 * Use Cases:
 * - Batch property definition
 * - Cloning objects with all descriptors preserved
 * - Creating objects with mixed property types
 */

console.log("\n=== 3. Object.defineProperties() Demo ===");

// 3.1 Define multiple properties
let book = {};

Object.defineProperties(book, {
  title: {
    value: "JavaScript Guide",
    writable: true,
    enumerable: true
  },
  _price: {
    value: 29.99,
    writable: true,
    enumerable: false
  },
  price: {
    get() { return this._price; },
    set(value) {
      if (value > 0) this._price = value;
    },
    enumerable: true
  }
});

console.log("Book properties:", book);
console.log("Book price:", book.price);

// 3.2 Cloning with descriptors
let original = {
  name: "Original",
  get fullName() {
    return this.name + " Smith";
  }
};
Object.defineProperty(original, 'secret', {
  value: "hidden",
  enumerable: false
});

// Clone with all descriptors preserved
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(original));
console.log("\nClone name:", clone.name);
console.log("Clone secret:", clone.secret);
console.log("Clone fullName:", clone.fullName);


// ============================================
// 4. OBJECT-LEVEL RESTRICTION METHODS
// ============================================
/**
 * Object-Level Restriction Methods (ES5)
 *
 * Three levels of restriction:
 * 1. Object.preventExtensions() - Cannot add new properties
 * 2. Object.seal() - Cannot add/delete properties (configurable: false)
 * 3. Object.freeze() - Cannot add/delete/modify properties (writable: false)
 *
 * Testing methods:
 * - Object.isExtensible()
 * - Object.isSealed()
 * - Object.isFrozen()
 *
 * Important Notes:
 * - These are shallow (only affect own properties)
 * - Non-strict mode fails silently
 * - Strict mode throws TypeError
 *
 * Common Pitfalls:
 * - Thinking freeze() is deep (nested objects can still be modified)
 * - Not testing with isExtensible/isSealed/isFrozen
 */

console.log("\n=== 4. Object-Level Restriction Methods Demo ===");

// 4.1 Object.preventExtensions()
let extensible = { a: 1 };
console.log("Is extensible:", Object.isExtensible(extensible)); // true

Object.preventExtensions(extensible);

extensible.b = 2; // Fails silently in non-strict mode
console.log("After preventExtensions:", extensible); // { a: 1 }
console.log("Is extensible:", Object.isExtensible(extensible)); // false

// Can still modify existing properties
extensible.a = 10;
console.log("Can modify:", extensible.a); // 10

// Can still delete properties
delete extensible.a;
console.log("After delete:", extensible); // {}

// 4.2 Object.seal()
let sealed = { x: 1, y: 2 };
console.log("\nBefore seal:", Object.isSealed(sealed)); // false

Object.seal(sealed);

sealed.z = 3; // Cannot add
delete sealed.x; // Cannot delete
sealed.x = 100; // Can still modify

console.log("After seal:", sealed); // { x: 100, y: 2 }
console.log("Is sealed:", Object.isSealed(sealed)); // true

// Check descriptor - configurable becomes false
console.log("Descriptor after seal:", Object.getOwnPropertyDescriptor(sealed, 'x'));

// 4.3 Object.freeze()
let frozen = { count: 0, nested: { value: 1 } };
console.log("\nBefore freeze:", Object.isFrozen(frozen)); // false

Object.freeze(frozen);

frozen.count = 10; // Cannot modify
frozen.newProp = "test"; // Cannot add
delete frozen.count; // Cannot delete

console.log("After freeze:", frozen); // { count: 0, nested: { value: 1 } }
console.log("Is frozen:", Object.isFrozen(frozen)); // true

// IMPORTANT: Freeze is shallow!
frozen.nested.value = 100;
console.log("Nested object can still be modified:", frozen.nested.value); // 100

// 4.4 Deep freeze implementation
function deepFreeze(obj) {
  // Get all properties (including Symbol-keyed, which getOwnPropertyNames misses)
  let propNames = Reflect.ownKeys(obj);

  // Freeze nested objects first
  for (let name of propNames) {
    let value = obj[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  // Freeze the object itself
  return Object.freeze(obj);
}

let deepObj = {
  a: 1,
  b: {
    c: 2
  }
};

deepFreeze(deepObj);
deepObj.b.c = 100; // Fails
console.log("\nDeep frozen - nested cannot be modified:", deepObj.b.c); // 2


// ============================================
// 5. GETTERS AND SETTERS
// ============================================
/**
 * Getters and Setters - Accessor Properties (ES5)
 *
 * Accessor Descriptor vs Data Descriptor:
 * - Accessor: { get, set, enumerable, configurable }
 * - Data: { value, writable, enumerable, configurable }
 *
 * Cannot mix both:
 * - Cannot have both 'value' and 'get/set'
 * - Cannot have both 'writable' and 'get/set'
 *
 * Use Cases:
 * - Computed properties
 * - Data validation
 * - Logging and monitoring
 * - Lazy initialization
 * - Backward compatibility
 *
 * Common Pitfalls:
 * - Getter without setter makes property read-only
 * - Setter without getter makes property write-only
 * - Infinite recursion when getter/setter reference same property name
 */

console.log("\n=== 5. Getters and Setters Demo ===");

// 5.1 Basic getter/setter in object literal
let circle = {
  _radius: 0,

  get radius() {
    console.log("Getting radius");
    return this._radius;
  },

  set radius(value) {
    console.log("Setting radius to", value);
    if (value >= 0) {
      this._radius = value;
    } else {
      console.log("Invalid radius");
    }
  },

  get area() {
    return Math.PI * this._radius ** 2;
  }
};

circle.radius = 5;
console.log("Radius:", circle.radius);
console.log("Area:", circle.area);

// 5.2 Getter/setter with Object.defineProperty
let temperature = {};

let _celsius = 0;

Object.defineProperty(temperature, 'celsius', {
  get() {
    return _celsius;
  },
  set(value) {
    _celsius = value;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(temperature, 'fahrenheit', {
  get() {
    return _celsius * 1.8 + 32;
  },
  set(value) {
    _celsius = (value - 32) / 1.8;
  },
  enumerable: true,
  configurable: true
});

temperature.celsius = 25;
console.log("\nCelsius:", temperature.celsius);
console.log("Fahrenheit:", temperature.fahrenheit);

temperature.fahrenheit = 100;
console.log("After setting Fahrenheit:");
console.log("Celsius:", temperature.celsius.toFixed(2));

// 5.3 Data validation with setter
let userAccount = {
  _age: 0
};

Object.defineProperty(userAccount, 'age', {
  get() {
    return this._age;
  },
  set(value) {
    if (typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    if (value < 0 || value > 150) {
      throw new RangeError('Age must be between 0 and 150');
    }
    this._age = value;
  },
  enumerable: true
});

console.log("\nValidation example:");
try {
  userAccount.age = 25;
  console.log("Valid age set:", userAccount.age);

  userAccount.age = -5; // Throws RangeError
} catch (error) {
  console.log("Error:", error.message);
}

// 5.4 Read-only property (getter without setter)
let config2 = {
  _version: "1.0.0"
};

Object.defineProperty(config2, 'version', {
  get() {
    return this._version;
  },
  enumerable: true
});

console.log("\nRead-only property:");
console.log("Version:", config2.version);

config2.version = "2.0.0"; // Fails silently in non-strict mode
console.log("Still version:", config2.version); // 1.0.0

// 5.5 Lazy initialization with getter
let expensiveObject = {
  _data: null,

  get data() {
    if (this._data === null) {
      console.log("Computing expensive data...");
      this._data = Array.from({ length: 1000 }, (_, i) => i * i);
    }
    return this._data;
  }
};

console.log("\nLazy initialization:");
console.log("Before access, data is:", expensiveObject._data);
console.log("First access:", expensiveObject.data.length);
console.log("Second access (cached):", expensiveObject.data.length);


// ============================================
// 6. RELATIONSHIP WITH OTHER CONCEPTS
// ============================================
/**
 * Property Descriptors in the Broader JavaScript Ecosystem
 *
 * Related Concepts:
 * 1. Proxy/Reflect - Can intercept descriptor operations
 * 2. Vue 2 Reactivity - Uses defineProperty for reactivity
 * 3. Object cloning - uses getOwnPropertyDescriptors (no built-in Object.clone)
 * 4. Decorators - Often modify property descriptors
 *
 * Framework Usage:
 * - Vue 2: Object.defineProperty for reactive properties
 * - MobX: Uses descriptors for observable properties
 * - Decorators: Modify descriptors (class properties)
 *
 * Best Practices:
 * - Use defineProperty sparingly (adds complexity)
 * - Prefer const/let for immutability
 * - Use freeze/seal for object-level protection
 * - Document non-obvious descriptor usage
 */

console.log("\n=== 6. Relationship with Other Concepts Demo ===");

// 6.1 Property descriptors and Proxy
let targetObj = { x: 10, y: 20 };

let proxyHandler = {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`Getting descriptor for: ${prop}`);
    return Object.getOwnPropertyDescriptor(target, prop);
  },

  defineProperty(target, prop, descriptor) {
    console.log(`Defining property: ${prop}`);
    // Add validation or logging
    return Object.defineProperty(target, prop, descriptor);
  }
};

let proxy = new Proxy(targetObj, proxyHandler);
console.log("Proxy descriptor:", Object.getOwnPropertyDescriptor(proxy, 'x'));

// 6.2 Simple Vue 2 reactivity simulation
function reactive(target) {
  const observed = {};

  Object.keys(target).forEach(key => {
    let internalValue = target[key];

    Object.defineProperty(observed, key, {
      get() {
        console.log(`Getting ${key}`);
        return internalValue;
      },
      set(newValue) {
        console.log(`Setting ${key} to ${newValue}`);
        internalValue = newValue;
      },
      enumerable: true,
      configurable: true
    });
  });

  return observed;
}

let data = reactive({ message: "Hello" });
console.log("\nReactive object:");
console.log(data.message); // Logs "Getting message"
data.message = "World";    // Logs "Setting message to World"

// 6.3 Comparison: defineProperty vs assignment
console.log("\n=== defineProperty vs Assignment ===");

let obj1 = {};
obj1.a = 1;
// Equivalent to:
// Object.defineProperty(obj1, 'a', {
//   value: 1,
//   writable: true,
//   enumerable: true,
//   configurable: true
// });

let obj2 = {};
Object.defineProperty(obj2, 'a', { value: 1 });
// Flags are all false by default!

console.log("Assignment descriptor:", Object.getOwnPropertyDescriptor(obj1, 'a'));
console.log("defineProperty descriptor:", Object.getOwnPropertyDescriptor(obj2, 'a'));


// ============================================
// BEST PRACTICES
// ============================================
/**
 * Property Descriptor Best Practices
 *
 * 1. PREFER SIMPLER ALTERNATIVES
 *    - Use const/let for immutability
 *    - Use Object.freeze() for object-level protection
 *    - Use class getters/setters for computed properties
 *
 * 2. DOCUMENT DESCRIPTOR USAGE
 *    - Comment why defineProperty is needed
 *    - Document non-default flags
 *    - Explain accessor properties
 *
 * 3. USE STRICT MODE
 *    - Makes descriptor violations throw errors
 *    - Catches accidental modifications
 *    - Makes debugging easier
 *
 * 4. CONSIDER MAINTAINABILITY
 *    - Complex descriptor logic is hard to debug
 *    - Use clear naming conventions
 *    - Avoid over-engineering
 *
 * 5. PERFORMANCE CONSIDERATIONS
 *    - defineProperty has overhead
 *    - Accessor properties are slower than data properties
 *    - Batch operations with defineProperties
 */

console.log("\n=== Best Practices Demo ===");

// Good: Simple, clear intent
const API_KEY = "secret"; // Already immutable

// Good: Object-level protection
const CONFIG = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000
});

// Good: Class getter for computed property
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

// Avoid: Over-engineered descriptor usage
let badExample = {};
Object.defineProperty(badExample, 'x', {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: true
  // This is just a normal property - use assignment instead!
});

// Better: Just use assignment
let goodExample = { x: 42 };


// ============================================
// COMMON PITFALLS
// ============================================
console.log("\n=== Common Pitfalls Demo ===");

// Pitfall 1: Forgetting default flags
let pitfall1 = {};
Object.defineProperty(pitfall1, 'prop', { value: 42 });
console.log("Pitfall 1 - Not writable:", pitfall1.prop); // 42
pitfall1.prop = 100; // Fails silently
console.log("Still 42:", pitfall1.prop);

// Pitfall 2: Cannot mix data and accessor descriptors
let pitfall2 = { value: 10 };
try {
  Object.defineProperty(pitfall2, 'value', {
    get() { return 20; }
  });
} catch (error) {
  console.log("Pitfall 2 - Cannot mix:", error.message);
}

// Pitfall 3: configurable: false is permanent
let pitfall3 = {};
Object.defineProperty(pitfall3, 'locked', {
  value: true,
  configurable: false
});

try {
  Object.defineProperty(pitfall3, 'locked', {
    configurable: true
  });
} catch (error) {
  console.log("Pitfall 3 - Cannot unlock:", error.message);
}

// Pitfall 4: Shallow freeze
let pitfall4 = Object.freeze({
  nested: { value: 1 }
});
pitfall4.nested.value = 100; // Works!
console.log("Pitfall 4 - Shallow freeze:", pitfall4.nested.value);

// Pitfall 5: Accessor this binding
let pitfall5 = {
  _value: 42,
  get value() {
    return this._value;
  }
};

let extracted = pitfall5.value;
console.log("Pitfall 5 - This is fine:", extracted);


// ============================================
// SUMMARY
// ============================================
/**
 * Property Descriptors Summary
 *
 * Key Concepts:
 * 1. Three flags: writable, enumerable, configurable
 * 2. Data descriptors vs accessor descriptors
 * 3. defineProperty for fine-grained control
 * 4. Object-level methods: preventExtensions, seal, freeze
 *
 * When to Use:
 * - Creating read-only properties
 * - Hiding internal properties
 * - Data validation with getters/setters
 * - Building reactive systems (frameworks)
 *
 * When to Avoid:
 * - Simple property assignments
 * - When const/let/freeze suffice
 * - When it adds unnecessary complexity
 */

console.log("\n=== Property Descriptors Demo Complete ===");


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. READONLY MODIFIER
   JS:  Object.defineProperty(obj, 'x', { writable: false })
   TS:  readonly x: number (compile-time check)

   TypeScript example:
   class Config {
     readonly apiKey: string = "secret";
   }

2. PROPERTY DESCRIPTORS TYPING
   TS:  PropertyDescriptor interface
   TS:  ThisType<T> for descriptor this context

   TypeScript example:
   const descriptor: PropertyDescriptor = {
     value: 42,
     writable: true,
     enumerable: true,
     configurable: true
   };

3. CONST ASSERTIONS
   TS:  as const creates deeply readonly types

   TypeScript example:
   const config = {
     url: "https://api.example.com",
     timeout: 5000
   } as const;
   // All properties become readonly

4. ACCESS MODIFIERS IN CLASSES
   TS:  public / private / protected / readonly

   TypeScript example:
   class User {
     private _age: number = 0;

     get age(): number {
       return this._age;
     }

     set age(value: number) {
       if (value >= 0) this._age = value;
     }
   }

📘 See related: 08-objects.js for basic getter/setter examples
📘 See related: 23-proxy-reflect.js for Proxy interception of descriptors
*/
// ============================================
// CROSS-REFERENCES
// ============================================
console.log(`
📘 See related files for additional patterns:

Property Descriptors:
- 23-proxy-reflect.js (Proxy and Reflect API for property access)
- 19-symbol-deep.js (Symbols as property keys)
`);
