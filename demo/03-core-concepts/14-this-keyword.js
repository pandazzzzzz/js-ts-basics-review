// ============================================================================
// THIS KEYWORD - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. THIS BASIC RULES
// ============================================================================
/**
 * this Keyword - Dynamic binding determined at call time (ES1+)
 *
 * Key Principle:
 * - this is NOT bound when a function is defined
 * - this IS determined when a function is CALLED
 * - Same function can have different this values
 *
 * Five Binding Rules (in priority order):
 * 1. new binding: new Constructor() → this is the new object
 * 2. explicit binding: call/apply/bind → this is the provided context
 * 3. implicit binding: obj.method() → this is the caller object
 * 4. default binding: standalone call → this is global (undefined in strict)
 * 5. arrow functions: inherit this from lexical scope
 *
 * Use Cases:
 * - Object methods accessing instance properties
 * - Constructor functions
 * - Event handlers
 * - Callbacks with context
 *
 * Common Pitfalls:
 * - Assuming this is lexical (like in other languages)
 * - Losing this when extracting methods
 * - Confusion with arrow function this
 */

console.log("=== 1. this Basic Rules Demo ===");

// 1.1 Global context - this is global object (window/global/globalThis)
console.log("Global this === globalThis:", this === globalThis);

// In strict mode, global this is still globalThis
(function() {
  "use strict";
  console.log("Strict mode global this === globalThis:", this === globalThis);
})();

// 1.2 Object method - this is the calling object
let person = {
  name: "Alice",
  greet() {
    console.log("Hello, I'm", this.name);
  }
};

person.greet(); // "Hello, I'm Alice" - this is person

// 1.3 Method call determines this at call time
let obj1 = { name: "Object 1" };
let obj2 = { name: "Object 2" };

function introduce() {
  console.log("Hi, I'm", this.name);
}

obj1.introduce = introduce;
obj2.introduce = introduce;

console.log("\nDifferent this for same function:");
obj1.introduce(); // "Hi, I'm Object 1"
obj2.introduce(); // "Hi, I'm Object 2"

// 1.4 Method shorthand vs function property
let obj3 = {
  value: 1,
  // Method shorthand - this works correctly
  methodShorthand() {
    console.log("Shorthand this.value:", this.value);
  },
  // Function property - this also works when called as method
  functionProperty: function() {
    console.log("Function property this.value:", this.value);
  }
};

obj3.methodShorthand(); // 1
obj3.functionProperty(); // 1

// 1.5 Standalone function call - default binding
function standalone() {
  console.log("Standalone this:", this === globalThis);
}

standalone(); // true (this is globalThis)


// ============================================================================
// 2. THIS LOSS PROBLEMS
// ============================================================================
/**
 * this Loss - Common scenarios where this context is lost
 *
 * Causes:
 * 1. Assigning method to variable
 * 2. setTimeout/setInterval callbacks
 * 3. Array method callbacks (forEach, map, etc.)
 * 4. Event handlers
 * 5. Destructuring methods from objects
 *
 * Solutions:
 * 1. bind() the method
 * 2. Use arrow function wrapper
 * 3. Store this in a variable (var self = this)
 * 4. Use class field arrow functions
 *
 * Common Pitfalls:
 * - Extracting methods without binding
 * - Assuming this in callbacks
 * - Mixing arrow and regular functions incorrectly
 */

console.log("\n=== 2. this Loss Problems Demo ===");

// 2.1 Method assigned to variable - this is lost
let user = {
  name: "Bob",
  sayName() {
    console.log("My name is", this.name);
  }
};

let sayNameFunc = user.sayName;
console.log("\nMethod assigned to variable:");
sayNameFunc(); // "My name is undefined" - this is globalThis

// 2.2 setTimeout/setInterval - this is lost
let counter = {
  count: 0,
  increment() {
    this.count++;
    console.log("Count:", this.count);
  }
};

console.log("\nsetTimeout with method:");
setTimeout(counter.increment, 10); // count becomes NaN (this is globalThis)

// Solution 1: bind
setTimeout(counter.increment.bind(counter), 10); // Works! count = 1

// Solution 2: Arrow function wrapper
setTimeout(() => counter.increment(), 10); // Works! count = 2

// 2.3 Array callback - this is lost
let numbers = {
  values: [1, 2, 3],
  multiplier: 2,

  multiply() {
    return this.values.map(function(val) {
      console.log("this in callback:", this); // globalThis or undefined
      return val * this.multiplier; // NaN or error
    });
  }
};

console.log("\nArray callback (broken):");
try {
  console.log(numbers.multiply());
} catch (e) {
  console.log("Error:", e.message);
}

// Solution: Pass thisArg to map
let numbersFixed = {
  values: [1, 2, 3],
  multiplier: 2,

  multiply() {
    return this.values.map(function(val) {
      return val * this.multiplier;
    }, this); // Pass this as second argument
  }
};

console.log("Array callback (fixed with thisArg):", numbersFixed.multiply());

// Solution: Arrow function
let numbersArrow = {
  values: [1, 2, 3],
  multiplier: 2,

  multiply() {
    return this.values.map(val => val * this.multiplier);
  }
};

console.log("Array callback (fixed with arrow):", numbersArrow.multiply());

// 2.4 Event handler - this is the element
// Note: In Node.js, we can't test DOM events, but here's the concept
console.log("\nEvent handler this (conceptual):");
console.log("In browser: this === event.currentTarget (the element)");
console.log("Arrow function: this === outer scope (often not what you want)");

// 2.5 Destructuring methods - this is lost
let calculator = {
  base: 10,
  add(x) {
    return this.base + x;
  }
};

let { add } = calculator;
console.log("\nDestructured method:");
console.log("add(5):", add(5)); // NaN - this is globalThis


// ============================================================================
// 3. EXPLICIT BINDING - call/apply/bind
// ============================================================================
/**
 * Explicit Binding - call, apply, bind methods (ES5)
 *
 * Function.prototype.call(context, arg1, arg2, ...)
 * - Calls function immediately with given this
 * - Arguments passed individually
 *
 * Function.prototype.apply(context, [argsArray])
 * - Calls function immediately with given this
 * - Arguments passed as array
 *
 * Function.prototype.bind(context)
 * - Returns NEW function with bound this
 * - Can be called later
 * - Supports partial application
 *
 * Use Cases:
 * - Borrowing methods from other objects
 * - Setting this in callbacks
 * - Creating bound methods for event handlers
 * - Partial application (currying)
 *
 * Common Pitfalls:
 * - bind returns new function, doesn't call it
 * - Arrow functions cannot be rebound
 * - Cannot unbind a bound function
 */

console.log("\n=== 3. Explicit Binding Demo ===");

// 3.1 call() - Call with specified this
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

let person1 = { name: "Charlie" };
let person2 = { name: "Diana" };

console.log("\ncall() examples:");
greet.call(person1, "Hello", "!"); // "Hello, I'm Charlie!"
greet.call(person2, "Hi", "!");    // "Hi, I'm Diana!"

// 3.2 apply() - Call with specified this and array arguments
let args = ["Hey", "!!!"];
greet.apply(person1, args); // "Hey, I'm Charlie!!!"

// 3.3 bind() - Create new function with bound this
let greetCharlie = greet.bind(person1);
console.log("\nbind() example:");
greetCharlie("Good morning", "."); // "Good morning, I'm Charlie."

// 3.4 Method borrowing with call/apply
let arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3
};

console.log("\nMethod borrowing:");
let result = Array.prototype.slice.call(arrayLike);
console.log("Array.from arrayLike:", result); // ['a', 'b', 'c']

// 3.5 bind for partial application (currying)
function multiply(a, b, c) {
  return a * b * c;
}

let double = multiply.bind(null, 2); // Partial application
console.log("\nPartial application:");
console.log("double(3, 4):", double(3, 4)); // 24 (2 * 3 * 4)

let triple = multiply.bind(null, 3);
console.log("triple(4, 5):", triple(4, 5)); // 60 (3 * 4 * 5)

// 3.6 bind with setTimeout
let timer = {
  seconds: 0,
  tick() {
    this.seconds++;
    console.log("Seconds:", this.seconds);
  }
};

console.log("\nbind with setTimeout:");
setTimeout(timer.tick.bind(timer), 100); // Works correctly

// 3.7 Difference summary
console.log("\n=== call vs apply vs bind Summary ===");
console.log("call(obj, a, b)   - Call immediately, args individually");
console.log("apply(obj, [a,b]) - Call immediately, args as array");
console.log("bind(obj)         - Return new function, call later");

// 3.8 null/undefined this in non-strict vs strict mode
function showThis() {
  console.log("this with null bind:", this === globalThis);
}

console.log("\nnull/undefined this:");
showThis.call(null);    // true in non-strict (this becomes globalThis)
showThis.call(undefined); // true in non-strict

(function() {
  "use strict";
  console.log("Strict mode null:", this === undefined); // true
}).call(null);


// ============================================================================
// 4. ARROW FUNCTION this
// ============================================================================
/**
 * Arrow Functions and this - Lexical this binding (ES6)
 *
 * Key Characteristics:
 * - Arrow functions have NO own this
 * - this is inherited from enclosing lexical scope
 * - Cannot be rebound with call/apply/bind
 * - Cannot be used as constructors
 * - No arguments object
 *
 * When to Use:
 * - Callbacks where you want outer this
 * - Array method callbacks
 * - Event handlers needing outer context
 *
 * When NOT to Use:
 * - Object methods that need dynamic this
 * - Constructor functions
 * - Methods that will be called with different this
 *
 * Common Pitfalls:
 * - Using arrow functions as object methods
 * - Expecting arrow function this to change
 * - Trying to bind arrow functions
 */

console.log("\n=== 4. Arrow Function this Demo ===");

// 4.1 Arrow function inherits outer this
let outerThis = this;

let arrowFunc = () => {
  console.log("Arrow function this === outer this:", this === outerThis);
};

arrowFunc(); // true

// 4.2 Arrow function in object method - captures outer this
let objWithArrow = {
  name: "ArrowObj",
  regularMethod() {
    console.log("Regular method this.name:", this.name);
  },
  arrowMethod: () => {
    console.log("Arrow method this:", this === globalThis); // globalThis!
  }
};

console.log("\nArrow function as object method:");
objWithArrow.regularMethod(); // "ArrowObj"
objWithArrow.arrowMethod();   // undefined (this is globalThis, not objWithArrow)

// 4.3 Arrow function in callback - preserves this
let counter2 = {
  count: 0,

  startRegular() {
    setInterval(function() {
      console.log("Regular callback this:", this); // globalThis
      this.count++; // Doesn't work!
    }, 1000);
  },

  startArrow() {
    setInterval(() => {
      console.log("Arrow callback this.count:", this.count); // Works!
      this.count++;
    }, 1000);
  }
};

console.log("\nArrow in callback (won't actually run setTimeout):");
console.log("Arrow preserves outer this - this is counter2");

// 4.4 Cannot rebind arrow function this
let arrow = () => {
  console.log("Arrow this:", this === globalThis);
};

console.log("\nCannot rebind arrow function:");
arrow.call({ name: "test" }); // Still uses outer this
arrow.bind({ name: "test" })(); // Still uses outer this

// 4.5 Nested arrow functions
function outer() {
  console.log("outer this:", this === globalThis);

  return () => {
    console.log("inner arrow this:", this === globalThis);

    return () => {
      console.log("nested arrow this:", this === globalThis);
    };
  };
}

outer()()(); // All true - all inherit same this

// 4.6 Arrow function in class (good practice)
class Timer {
  constructor() {
    this.seconds = 0;
  }

  // Arrow function as class property - binds this automatically
  tick = () => {
    this.seconds++;
    console.log("Timer seconds:", this.seconds);
  };

  // Regular method - need to bind in constructor or use call
  tickRegular() {
    this.seconds++;
  }
}

console.log("\nArrow function in class:");
let arrowTimer = new Timer();
let arrowTimerTick = arrowTimer.tick; // Can extract without losing this
arrowTimerTick(); // Works! seconds = 1


// ============================================================================
// 5. CONSTRUCTOR this
// ============================================================================
/**
 * this in Constructors - new binding (ES1+)
 *
 * new Keyword Steps:
 * 1. Create new empty object
 * 2. Set new object's prototype to Constructor.prototype
 * 3. Call constructor with this = new object
 * 4. Return new object (unless constructor returns object)
 *
 * Constructor Patterns:
 * - Function constructors (ES5)
 * - Class constructors (ES6)
 * - Factory functions (alternative)
 *
 * Return Value Rules:
 * - return primitive → ignored, returns this
 * - return object → returns that object instead
 *
 * Common Pitfalls:
 * - Forgetting new keyword
 * - Returning wrong value from constructor
 * - Arrow functions as constructors
 */

console.log("\n=== 5. Constructor this Demo ===");

// 5.1 Basic constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.introduce = function() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
  };
}

let alice = new Person("Alice", 25);
alice.introduce(); // "Hi, I'm Alice, 25 years old"

// 5.2 new keyword creates new this
console.log("\nnew keyword creates new this:");
let bob = new Person("Bob", 30);
bob.introduce();

console.log("alice !== bob:", alice !== bob); // true - different instances

// 5.3 Forgetting new - this becomes globalThis
console.log("\nForgetting new (pollutes global):");
let charlie = Person("Charlie", 35); // Missing new!
console.log("charlie is undefined:", charlie === undefined); // true
console.log("name added to global:", globalThis.name); // "Charlie"
delete globalThis.name; // Clean up

// 5.4 Return value in constructor
function WeirdConstructor(name) {
  this.name = name;

  // Return primitive - ignored
  return 42;
}

let weird1 = new WeirdConstructor("Test1");
console.log("\nReturn primitive (ignored):");
console.log("weird1.name:", weird1.name); // "Test1"

function WeirdConstructor2(name) {
  this.name = name;

  // Return object - used instead of this
  return { custom: "object" };
}

let weird2 = new WeirdConstructor2("Test2");
console.log("\nReturn object (used instead):");
console.log("weird2:", weird2); // { custom: "object" }
console.log("weird2.name:", weird2.name); // undefined

// 5.4 Constructor with this.method vs prototype.method
function EfficientPerson(name) {
  this.name = name;
  // Method defined here - new copy per instance
}

// Method on prototype - shared by all instances
EfficientPerson.prototype.introduce = function() {
  console.log(`I'm ${this.name}`);
};

let p1 = new EfficientPerson("P1");
let p2 = new EfficientPerson("P2");
console.log("\nPrototype method (shared):");
console.log("p1.introduce === p2.introduce:", p1.introduce === p2.introduce); // true


// ============================================================================
// 6. CLASS this
// ============================================================================
/**
 * this in Classes - ES6 class syntax (ES6)
 *
 * Class this Rules:
 * - Same as constructor functions
 * - Methods are on prototype by default
 * - Constructor this is the new instance
 *
 * this Loss in Classes:
 * - Extracting methods: const { method } = instance
 * - Callbacks: array.map(instance.method)
 * - Event handlers: element.onclick = instance.method
 *
 * Solutions:
 * 1. bind in constructor
 * 2. Arrow function class property (class fields)
 * 3. Wrapper function
 *
 * Common Pitfalls:
 * - Method extraction without binding
 * - Assuming class methods auto-bind
 * - Arrow functions in class body (not as properties)
 */

console.log("\n=== 6. Class this Demo ===");

// 6.1 Basic class with this
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

let dog = new Animal("Dog");
dog.speak(); // "Dog makes a sound"

// 6.2 Method extraction loses this
let speakFunc = dog.speak;
console.log("\nMethod extraction loses this:");
try {
  speakFunc(); // TypeError or undefined name
} catch (e) {
  console.log("Error:", e.message);
}

// 6.3 Solution 1: bind in constructor
class BoundAnimal {
  constructor(name) {
    this.name = name;
    this.speak = this.speak.bind(this);
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

let boundDog = new BoundAnimal("BoundDog");
let boundSpeak = boundDog.speak;
console.log("\nBound method:");
boundSpeak(); // "BoundDog makes a sound"

// 6.4 Solution 2: Arrow function class property
class ArrowAnimal {
  constructor(name) {
    this.name = name;
  }

  // Arrow function as property - auto-binds this
  speak = () => {
    console.log(`${this.name} makes a sound`);
  };
}

let arrowDog = new ArrowAnimal("ArrowDog");
let arrowSpeak = arrowDog.speak;
console.log("\nArrow function property:");
arrowSpeak(); // "ArrowDog makes a sound"

// 6.5 Class with inheritance and this
class Parent {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello from ${this.name}`);
  }
}

class Child extends Parent {
  greet() {
    super.greet(); // this still refers to Child instance
    console.log(`Child greeting from ${this.name}`);
  }
}

let child = new Child("Child");
console.log("\nInheritance this:");
child.greet(); // Works correctly with this

// 6.6 Static methods don't have instance this
class MathUtil {
  static PI = 3.14159;

  static calculate() {
    // this in static method refers to the class, not instance
    console.log("this in static:", this === MathUtil);
  }
}

console.log("\nStatic method this:");
MathUtil.calculate(); // true


// ============================================================================
// 7. COMMON PITFALLS AND globalThis
// ============================================================================
/**
 * Common Pitfalls and Modern Solutions
 *
 * Pitfalls:
 * 1. Nested function this
 * 2. Chained method this
 * 3. Destructured method this
 * 4. Callback this
 *
 * Modern Solutions:
 * 1. globalThis (ES2020)
 * 2. Arrow functions
 * 3. Class field syntax
 * 4. bind()
 *
 * Best Practices:
 * - Use strict mode
 * - Be explicit about this binding
 * - Use arrow functions for callbacks
 * - Document this expectations
 */

console.log("\n=== 7. Common Pitfalls and globalThis Demo ===");

// 7.1 Nested function this
let nestedObj = {
  name: "Outer",
  outer() {
    function inner() {
      console.log("Inner this:", this === globalThis); // true in non-strict
    }
    inner();
  }
};

console.log("\nNested function this:");
nestedObj.outer();

// Solution: Arrow function
let nestedFixed = {
  name: "Outer",
  outer() {
    const inner = () => {
      console.log("Arrow inner this:", this.name); // "Outer"
    };
    inner();
  }
};

nestedFixed.outer();

// 7.2 Method chaining and this
let chainObj = {
  value: 0,

  add(n) {
    this.value += n;
    return this; // Return this for chaining
  },

  multiply(n) {
    this.value *= n;
    return this;
  }
};

console.log("\nMethod chaining:");
console.log("Result:", chainObj.add(5).multiply(2).value); // 10

// 7.3 globalThis (ES2020)
console.log("\nglobalThis (ES2020):");
console.log("globalThis exists:", typeof globalThis !== "undefined");
console.log("globalThis in Node:", globalThis === global); // true in Node.js

// Before ES2020, different environments had different globals:
// - Browser: window
// - Node.js: global
// - Web Workers: self
// Now: globalThis works everywhere

// 7.4 'use strict' affects default binding
console.log("\nStrict mode default binding:");
(function() {
  "use strict";
  function strictFunc() {
    console.log("Strict this is undefined:", this === undefined);
  }
  strictFunc();
})();

// 7.5 Indirect this reference (eval)
console.log("\nIndirect this:");
let indirect = eval;
console.log("indirect('this') === globalThis:", indirect("this") === globalThis);


// ============================================================================
// BEST PRACTICES
// ============================================================================
/**
 * this Best Practices
 *
 * 1. USE STRICT MODE
 *    - Prevents accidental global binding
 *    - Makes errors explicit
 *
 * 2. BE EXPLICIT ABOUT BINDING
 *    - bind() in constructor or at call site
 *    - Use arrow functions for callbacks
 *    - Document this expectations
 *
 * 3. PREFER ARROW FUNCTIONS FOR CALLBACKS
 *    - Preserves outer this
 *    - Cleaner syntax
 *    - No need to bind
 *
 * 4. AVOID ARROW FUNCTIONS AS METHODS
 *    - Methods need dynamic this
 *    - Use regular functions for methods
 *
 * 5. USE globalThis FOR GLOBAL ACCESS
 *    - Cross-environment compatible
 *    - ES2020 standard
 */

console.log("\n=== this Best Practices Demo ===");

// Good: Strict mode
"use strict";

// Good: Arrow function for callback
let processor = {
  data: [1, 2, 3],
  multiplier: 2,
  process() {
    return this.data.map(x => x * this.multiplier);
  }
};

// Good: bind in constructor for event-style callbacks
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`Clicked: ${this.label}`);
  }
}

// Avoid: Arrow function as method
let badObj = {
  value: 42,
  // Don't do this - can't access this.value dynamically
  getValue: () => this.value // undefined!
};

// Do this instead
let goodObj = {
  value: 42,
  getValue() {
    return this.value;
  }
};


// ============================================================================
// SUMMARY
// ============================================================================
/**
 * this Keyword Summary
 *
 * Binding Rules (Priority Order):
 * 1. new binding - new Constructor()
 * 2. explicit binding - call/apply/bind
 * 3. implicit binding - obj.method()
 * 4. default binding - standalone call (undefined in strict)
 * 5. arrow functions - lexical this
 *
 * Key Takeaways:
 * - this is determined at CALL time, not definition
 * - Arrow functions have lexical this (can't be rebound)
 * - bind() returns a NEW function
 * - globalThis is the modern way to access global
 *
 * When to Use What:
 * - Object methods: regular function
 * - Callbacks: arrow function
 * - Event handlers: arrow or bound function
 * - Constructors: regular function with new
 */

console.log("\n=== this Keyword Demo Complete ===");


// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. THIS PARAMETER TYPE
   TS:  function greet(this: User, greeting: string) {}
   TS:  Compile-time this type checking

   TypeScript example:
   interface User {
     name: string;
   }

   function greet(this: User, greeting: string) {
     return `${greeting}, ${this.name}`;
   }

2. NO IMPLICIT THIS
   TS:  noImplicitThis: true in tsconfig
   TS:  Requires explicit this type annotation

   TypeScript example:
   // Error without this parameter type
   function sayName(this: Person) {
     console.log(this.name);
   }

3. THIS TYPE IN CLASSES
   TS:  Methods inherit this type from class

   TypeScript example:
   class Animal {
     name: string;
     speak() {
       // this is typed as Animal
       console.log(this.name);
     }
   }

4. THIS RETURN TYPE (Fluent API)
   TS:  Methods return 'this' type for chaining

   TypeScript example:
   class Builder {
     setValue(v: number): this {
       // return type is the concrete subclass
       return this;
     }
   }

5. THIS IN ARROW FUNCTIONS
   TS:  Arrow functions capture this type from context

   TypeScript example:
   class Timer {
     seconds: number = 0;
     tick = () => {
       // this is typed as Timer
       this.seconds++;
     };
   }

📘 See related: 06-functions.js (call/apply/bind)
📘 See related: 23-classes.js (this in classes)
*/
// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

this Binding & Context:
- 13-scope-closures.js (lexical scope and closures)
- 16-classes.js (this in classes and constructors)

Prototypes & Inheritance:
- 15-prototypes-inheritance.js (prototype-based this)
- 25-inheritance-patterns.js (advanced patterns involving this)

Advanced Patterns:
- 24-function-patterns-advanced.js (bind, call, apply patterns)
- 23-proxy-reflect.js (Proxy and this interaction)
`);
