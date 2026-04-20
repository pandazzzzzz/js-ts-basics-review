// ============================================================================
// CLASSES (ES6+) - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. CLASS BASIC SYNTAX
// ============================================================================
/**
 * Class Syntax - ES6 class definition (ES6/ES2015)
 *
 * Class Declaration:
 * - class Name { ... }
 * - Hoisted but not accessible before definition (TDZ)
 * - Cannot be called without 'new'
 *
 * Class Expression:
 * - const Name = class { ... }
 * - Can be anonymous or named
 * - Same rules as declaration
 *
 * Constructor:
 * - Special method for creating instances
 * - Only one constructor per class
 * - 'new' creates this, constructor initializes
 *
 * Methods:
 * - Defined without 'function' keyword
 * - Added to prototype (enumerable: false)
 * - Can use shorthand syntax
 *
 * Common Pitfalls:
 * - Forgetting 'new' keyword
 * - Multiple constructors (not allowed)
 * - Methods are not auto-bound
 */

console.log("=== 1. Class Basic Syntax Demo ===");

// 1.1 Class declaration
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
  }

  getOlder() {
    this.age++;
  }
}

let alice = new Person("Alice", 25);
alice.introduce(); // "Hi, I'm Alice, 25 years old"

// 1.2 Class expression
const Animal = class {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
};

let dog = new Animal("Dog");
dog.speak();

// 1.3 Named class expression
const Calculator = class MathCalc {
  // MathCalc is only accessible inside the class
  square(x) {
    return x * x;
  }
};

// MathCalc is not accessible outside
// console.log(typeof MathCalc); // ReferenceError

// 1.4 Constructor rules
class StrictPerson {
  constructor(name) {
    this.name = name;
    // Cannot have multiple constructors
  }

  // This is a method, not a constructor
  constructor2() {
    console.log("This is just a method");
  }
}

// 1.5 Calling class without 'new'
console.log("\nClass without 'new':");
try {
  Person("Bob"); // TypeError
} catch (error) {
  console.log("Error:", error.message);
}

// 1.6 Class methods are on prototype
console.log("\nMethod on prototype:");
console.log("alice.introduce === Person.prototype.introduce:",
  alice.introduce === Person.prototype.introduce); // true

// 1.7 typeof class is function
console.log("\ntypeof class:", typeof Person); // "function"
console.log("Class is constructor:", Person.prototype.constructor === Person); // true

// 1.8 Class methods are non-enumerable
console.log("\nClass methods non-enumerable:");
console.log("Object.keys(alice):", Object.keys(alice)); // ['name', 'age']
console.log("Methods not in keys:", !Object.keys(alice).includes('introduce'));


// ============================================================================
// 2. CLASS INHERITANCE
// ============================================================================
/**
 * Class Inheritance - extends and super keywords (ES6)
 *
 * extends Keyword:
 * - Creates prototype chain
 * - Child.prototype.__proto__ = Parent.prototype
 * - Child.__proto__ = Parent (for statics)
 *
 * super Keyword:
 * - super() - Call parent constructor
 * - super.method() - Call parent method
 * - Must be called before using 'this' in subclass
 *
 * Method Overriding:
 * - Subclass can override parent methods
 * - super.method() to call parent version
 *
 * Common Pitfalls:
 * - Forgetting super() in subclass constructor
 * - Using this before super()
 * - Confusing super in static vs instance methods
 */

console.log("\n=== 2. Class Inheritance Demo ===");

// 2.1 Basic extends
class Shape {
  constructor(color) {
    this.color = color;
  }

  describe() {
    console.log(`A ${this.color} shape`);
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color); // Must call super() first!
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

let redCircle = new Circle("red", 5);
redCircle.describe(); // "A red shape" (inherited method)
console.log("Circle area:", redCircle.getArea().toFixed(2));

// 2.2 Method overriding
class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  // Override parent method
  describe() {
    console.log(`A ${this.color} rectangle (${this.width}x${this.height})`);
  }

  // Call parent method with super
  describeAsShape() {
    super.describe(); // Call parent version
  }

  getArea() {
    return this.width * this.height;
  }
}

let blueRect = new Rectangle("blue", 4, 6);
console.log("\nMethod overriding:");
blueRect.describe(); // "A blue rectangle (4x6)"
blueRect.describeAsShape(); // "A blue shape"

// 2.3 super() must be called before using this
console.log("\nsuper() before this:");
class ValidChild extends Shape {
  constructor(color, name) {
    super(color); // First!
    this.name = name; // Then use this
  }
}

class InvalidChild extends Shape {
  constructor(color, name) {
    // console.log(this.name); // ReferenceError if uncommented
    super(color);
    this.name = name;
  }
}

// 2.4 Inheritance chain
console.log("\nInheritance chain:");
console.log("redCircle instanceof Circle:", redCircle instanceof Circle); // true
console.log("redCircle instanceof Shape:", redCircle instanceof Shape); // true
console.log("redCircle instanceof Object:", redCircle instanceof Object); // true

// 2.5 Prototype chain verification
console.log("\nPrototype chain:");
console.log("Circle.prototype.__proto__ === Shape.prototype:",
  Circle.prototype.__proto__ === Shape.prototype); // true
console.log("Circle.__proto__ === Shape:",
  Circle.__proto__ === Shape); // true (for statics)


// ============================================================================
// 3. STATIC PROPERTIES AND METHODS
// ============================================================================
/**
 * Static Properties and Methods (ES6 + ES2022)
 *
 * Static Keyword:
 * - static property - Class-level property
 * - static method() - Class-level method
 * - Accessed on class, not instances
 *
 * Inheritance:
 * - Static members are inherited
 * - ChildClass.staticMethod() works
 *
 * Use Cases:
 * - Utility functions
 * - Factory methods
 * - Class-level configuration
 * - Constants
 *
 * Common Pitfalls:
 * - Cannot access static from instance
 * - Cannot access instance from static (without parameter)
 * - this in static refers to class
 */

console.log("\n=== 3. Static Properties and Methods Demo ===");

// 3.1 Static method
class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

console.log("Static method:", MathUtils.add(5, 3)); // 8
// console.log(new MathUtils().add(5, 3)); // TypeError

// 3.2 Static property (ES2022)
class Config {
  static VERSION = "1.0.0";
  static API_URL = "https://api.example.com";

  static getInfo() {
    return `Version ${Config.VERSION}`;
  }
}

console.log("\nStatic property:");
console.log("Config.VERSION:", Config.VERSION);
console.log("Config.getInfo():", Config.getInfo());

// 3.3 Static method with inheritance
class Parent {
  static staticProp = "Parent value";

  static staticMethod() {
    return "Parent method";
  }
}

class Child extends Parent {}

console.log("\nStatic inheritance:");
console.log("Child.staticProp:", Child.staticProp); // "Parent value"
console.log("Child.staticMethod():", Child.staticMethod()); // "Parent method"

// 3.4 Static method as factory
class Vehicle {
  constructor(type, wheels) {
    this.type = type;
    this.wheels = wheels;
  }

  static createCar() {
    return new Vehicle("car", 4);
  }

  static createBike() {
    return new Vehicle("bike", 2);
  }

  static createTruck() {
    return new Vehicle("truck", 6);
  }
}

console.log("\nFactory pattern:");
let car = Vehicle.createCar();
console.log("Car:", car.type, car.wheels);

// 3.5 this in static methods
class Animal2 {
  static species = "Animalia";

  static describe() {
    console.log("this === Animal2:", this === Animal2);
    return `Kingdom: ${this.species}`;
  }
}

class Dog2 extends Animal2 {
  static species = "Canis lupus familiaris";
}

console.log("\nthis in static:");
console.log(Animal2.describe()); // Kingdom: Animalia
console.log(Dog2.describe()); // Kingdom: Canis lupus familiaris

// 3.6 Static block (ES2022)
class ClassWithStaticBlock {
  static x = 10;
  static y;

  static {
    // Static initialization block
    this.y = this.x * 2;
    console.log("Static block executed");
  }
}

console.log("\nStatic block:");
console.log("ClassWithStaticBlock.y:", ClassWithStaticBlock.y); // 20


// ============================================================================
// 4. PRIVATE AND PROTECTED PROPERTIES
// ============================================================================
/**
 * Private and Protected Properties (ES2022)
 *
 * Private Fields (#):
 * - #fieldName - Truly private
 * - Only accessible inside class body
 * - SyntaxError if accessed outside
 * - Includes methods: #method()
 *
 * Underscore Convention (_):
 * - _fieldName - By convention private
 * - Not enforced by language
 * - Still accessible ( WeakMap alternative)
 *
 * Private Getters/Setters:
 * - get #prop() { }
 * - set #prop(value) { }
 *
 * Private Static Fields:
 * - static #field
 * - Only accessible in class body
 *
 * Common Pitfalls:
 * - # must be part of the name
 * - Cannot access from subclass
 * - Different from string "#field"
 */

console.log("\n=== 4. Private and Protected Properties Demo ===");

// 4.1 Private field with #
class BankAccount {
  #balance = 0; // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount(100);
console.log("Balance:", account.getBalance()); // 100
account.deposit(50);
console.log("After deposit:", account.getBalance()); // 150

// Private field is not accessible outside
console.log("\nPrivate field access:");
console.log("'#balance' in account:", "#balance" in account); // false
console.log("account.#balance would be SyntaxError");

// 4.2 Private method
class Counter {
  #count = 0;

  increment() {
    this.#validate();
    this.#count++;
  }

  #validate() {
    // Private method
    if (this.#count >= Number.MAX_SAFE_INTEGER) {
      throw new Error("Counter overflow");
    }
  }

  getCount() {
    return this.#count;
  }
}

let counter = new Counter();
counter.increment();
console.log("\nPrivate method - Count:", counter.getCount());

// 4.3 Underscore convention (not truly private)
class Person2 {
  constructor(name) {
    this._name = name; // Convention: "protected"
  }

  getName() {
    return this._name;
  }
}

let p = new Person2("Test");
console.log("\nUnderscore convention:");
console.log("_name accessible:", p._name); // Still accessible!

// 4.4 Private getter/setter
class Temperature {
  #celsius = 0;

  get celsius() {
    return this.#celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      throw new Error("Below absolute zero");
    }
    this.#celsius = value;
  }

  get fahrenheit() {
    return this.#celsius * 1.8 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }
}

let temp = new Temperature();
temp.celsius = 25;
console.log("\nPrivate getter/setter:");
console.log("Celsius:", temp.celsius);
console.log("Fahrenheit:", temp.fahrenheit);

// 4.5 Private static field
class ClassWithPrivateStatic {
  static #secret = "hidden value";

  static getSecret() {
    return ClassWithPrivateStatic.#secret;
  }
}

console.log("\nPrivate static field:");
console.log("Secret:", ClassWithPrivateStatic.getSecret());

// 4.6 Private field in subclass (cannot access parent's private)
class ParentPrivate {
  #privateField = "parent private";

  getPrivateValue() {
    return this.#privateField;
  }
}

class ChildPrivate extends ParentPrivate {
  // Cannot access parent's #privateField
  // childPrivateField = this.#privateField; // SyntaxError!

  getParentValue() {
    return this.getPrivateValue(); // Must use parent's public method
  }
}

let childPriv = new ChildPrivate();
console.log("\nSubclass cannot access parent private:");
console.log("Via parent method:", childPriv.getParentValue());

// 4.7 WeakMap for private data (pre-ES2022 alternative)
const privateData = new WeakMap();

class LegacyPrivate {
  constructor(value) {
    privateData.set(this, { value });
  }

  getValue() {
    return privateData.get(this).value;
  }
}

let legacy = new LegacyPrivate("secret");
console.log("\nWeakMap private:");
console.log("Value:", legacy.getValue());


// ============================================================================
// 5. INSTANCEOF AND TYPE CHECKING
// ============================================================================
/**
 * instanceof and Type Checking
 *
 * instanceof Operator:
 * - Tests if prototype in prototype chain
 * - obj instanceof Constructor
 * - Works with class hierarchy
 *
 * Symbol.hasInstance:
 * - Customize instanceof behavior
 * - Static method on class
 *
 * Object.prototype.toString:
 * - More reliable type detection
 * - Uses Symbol.toStringTag
 *
 * Common Pitfalls:
 * - instanceof fails across realms (iframes)
 * - Primitives return false
 * - Can be customized (may be misleading)
 */

console.log("\n=== 5. instanceof and Type Checking Demo ===");

// 5.1 Basic instanceof
console.log("Array instanceof Array:", [] instanceof Array); // true
console.log("Date instanceof Date:", new Date() instanceof Date); // true
console.log("Promise instanceof Promise:", Promise.resolve() instanceof Promise); // true

// 5.2 instanceof with class hierarchy
class Base {}
class Derived extends Base {}

let obj = new Derived();
console.log("\ninstanceof hierarchy:");
console.log("obj instanceof Derived:", obj instanceof Derived); // true
console.log("obj instanceof Base:", obj instanceof Base); // true
console.log("obj instanceof Object:", obj instanceof Object); // true

// 5.3 Custom instanceof with Symbol.hasInstance
class EvenNumber {
  static [Symbol.hasInstance](obj) {
    return typeof obj === "number" && obj % 2 === 0;
  }
}

console.log("\nCustom instanceof:");
console.log("4 instanceof EvenNumber:", 4 instanceof EvenNumber); // true
console.log("3 instanceof EvenNumber:", 3 instanceof EvenNumber); // false
console.log("'4' instanceof EvenNumber:", "4" instanceof EvenNumber); // false

// 5.4 Object.prototype.toString for type checking
console.log("\nObject.prototype.toString:");
console.log("Array:", Object.prototype.toString.call([])); // [object Array]
console.log("Date:", Object.prototype.toString.call(new Date())); // [object Date]
console.log("RegExp:", Object.prototype.toString.call(/regex/)); // [object RegExp]
console.log("Custom:", Object.prototype.toString.call({})); // [object Object]

// 5.5 Custom toStringTag
class CustomType {
  get [Symbol.toStringTag]() {
    return "CustomType";
  }
}

let custom = new CustomType();
console.log("\nCustom toStringTag:");
console.log(Object.prototype.toString.call(custom)); // [object CustomType]


// ============================================================================
// 6. MIXIN PATTERN
// ============================================================================
/**
 * Mixin Pattern - Alternative to Multiple Inheritance
 *
 * What is Mixin:
 * - Object with methods to be "mixed in"
 * - Copied to class prototype
 * - JavaScript has single inheritance
 * - Mixins provide "multiple inheritance" alternative
 *
 * Implementation:
 * - Object.assign(target, mixin)
 * - Manual copy
 * - Function that returns mixin
 *
 * Use Cases:
 * - Event handling
 * - Serialization
 * - Validation
 * - Logging
 *
 * Common Pitfalls:
 * - Method name conflicts
 * - No constructor support
 * - Ordering matters
 */

console.log("\n=== 6. Mixin Pattern Demo ===");

// 6.1 Basic mixin with Object.assign
let sayMixin = {
  say(phrase) {
    console.log(phrase);
  }
};

let sayHiMixin = {
  sayHi() {
    this.say(`Hi ${this.name}!`);
  },
  sayBye() {
    this.say(`Bye ${this.name}!`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// Copy methods from mixins to prototype
Object.assign(User.prototype, sayMixin, sayHiMixin);

let user = new User("John");
console.log("Mixin methods:");
user.sayHi(); // Hi John!
user.sayBye(); // Bye John!

// 6.2 Event mixin
let eventMixin = {
  on(event, handler) {
    if (!this._eventHandlers) {
      this._eventHandlers = {};
    }
    if (!this._eventHandlers[event]) {
      this._eventHandlers[event] = [];
    }
    this._eventHandlers[event].push(handler);
  },

  off(event, handler) {
    if (this._eventHandlers && this._eventHandlers[event]) {
      const index = this._eventHandlers[event].indexOf(handler);
      if (index > -1) {
        this._eventHandlers[event].splice(index, 1);
      }
    }
  },

  trigger(event, ...args) {
    if (this._eventHandlers && this._eventHandlers[event]) {
      this._eventHandlers[event].forEach(handler => handler(...args));
    }
  }
};

class EventEmitter {
  // Mix in event capabilities
}
Object.assign(EventEmitter.prototype, eventMixin);

let emitter = new EventEmitter();
console.log("\nEvent mixin:");
emitter.on("data", (data) => console.log("Received:", data));
emitter.trigger("data", "Hello World");

// 6.3 Mixin with inheritance
let canFly = {
  fly() {
    console.log(`${this.name} is flying!`);
  }
};

let canSwim = {
  swim() {
    console.log(`${this.name} is swimming!`);
  }
};

class Duck {
  constructor(name) {
    this.name = name;
  }
}

// Multiple mixins = "multiple inheritance"
Object.assign(Duck.prototype, canFly, canSwim);

let donald = new Duck("Donald");
console.log("\nMultiple mixins:");
donald.fly();
donald.swim();

// 6.4 Mixin factory function
function createTimestampMixin() {
  return {
    getTimestamp() {
      return Date.now();
    },
    log(message) {
      console.log(`[${this.getTimestamp()}] ${message}`);
    }
  };
}

class Service {}
Object.assign(Service.prototype, createTimestampMixin());

let service = new Service();
console.log("\nMixin factory:");
service.log("Service started");


// ============================================================================
// 7. RELATIONSHIP WITH PROTOTYPES
// ============================================================================
/**
 * Classes and Prototypes - Syntax Sugar Over Prototypes
 *
 * Class = Prototype Syntax Sugar:
 * - class Foo { } ≈ function Foo() { }
 * - Foo.prototype.method ≈ prototype.method
 * - extends sets up prototype chain
 *
 * Prototype Chain:
 * - instance.__proto__ → Class.prototype
 * - Class.prototype.__proto__ → Parent.prototype
 * - Class.__proto__ → Parent (statics)
 *
 * When to Use Class vs Prototype:
 * - Class: Modern, cleaner syntax
 * - Prototype: More control, older code
 * - Both create same structure
 *
 * Common Pitfalls:
 * - Thinking class is fundamentally different
 * - Forgetting methods are on prototype
 * - Confusing __proto__ and prototype
 */

console.log("\n=== 7. Relationship with Prototypes Demo ===");

// 7.1 Class is prototype syntax sugar
function PersonFunc(name) {
  this.name = name;
}
PersonFunc.prototype.introduce = function() {
  console.log(`Hi, I'm ${this.name}`);
};

class PersonClass {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

console.log("Both create similar structures:");
let funcPerson = new PersonFunc("Func");
let classPerson = new PersonClass("Class");

console.log("Function prototype:", PersonFunc.prototype);
console.log("Class prototype:", PersonClass.prototype);

// 7.2 Prototype chain verification
console.log("\nPrototype chain:");
console.log("funcPerson.__proto__ === PersonFunc.prototype:",
  funcPerson.__proto__ === PersonFunc.prototype); // true
console.log("classPerson.__proto__ === PersonClass.prototype:",
  classPerson.__proto__ === PersonClass.prototype); // true

// 7.3 extends sets up prototype chain
class Parent2 {}
class Child2 extends Parent2 {}

console.log("\nextends prototype chain:");
console.log("Child2.prototype.__proto__ === Parent2.prototype:",
  Child2.prototype.__proto__ === Parent2.prototype); // true
console.log("Child2.__proto__ === Parent2:",
  Child2.__proto__ === Parent2); // true

// 7.4 Converting class to prototype
class ModernClass {
  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

// Equivalent prototype version
function LegacyClass(value) {
  this.value = value;
}
LegacyClass.prototype.getValue = function() {
  return this.value;
};

console.log("\nEquivalent behavior:");
console.log("Modern:", new ModernClass(42).getValue());
console.log("Legacy:", new LegacyClass(42).getValue());

// 7.5 When to use class vs prototype
console.log("\nWhen to use:");
console.log("- Class: New code, cleaner syntax, team familiarity");
console.log("- Prototype: Library code, maximum compatibility, advanced patterns");


// ============================================================================
// BEST PRACTICES
// ============================================================================
/**
 * Class Best Practices
 *
 * 1. USE CLASSES FOR OOP PATTERNS
 *    - Clear inheritance hierarchies
 *    - Factory patterns with static methods
 *    - Encapsulation with private fields
 *
 * 2. PREFER COMPOSITION OVER INHERITANCE
 *    - Deep inheritance chains are fragile
 *    - Mixins for cross-cutting concerns
 *    - Composition for flexibility
 *
 * 3. USE PRIVATE FIELDS FOR ENCAPSULATION
 *    - # for true privacy
 *    - Avoid _ convention when possible
 *    - Document private API clearly
 *
 * 4. BIND METHODS WHEN NEEDED
 *    - Arrow functions for callbacks
 *    - bind() in constructor
 *    - Class field syntax
 *
 * 5. KEEP CLASSES FOCUSED
 *    - Single responsibility
 *    - Small, testable methods
 *    - Clear public API
 */

console.log("\n=== Class Best Practices Demo ===");

// Good: Clear, focused class
class Logger {
  #prefix;

  constructor(prefix) {
    this.#prefix = prefix;
  }

  log(message) {
    console.log(`[${this.#prefix}] ${message}`);
  }
}

// Good: Composition over deep inheritance
class Bird2 {}
const canFly2 = { fly() {} };
const canSing2 = { sing() {} };

class Canary2 extends Bird2 {
  constructor() {
    super();
    Object.assign(this, canFly2, canSing2);
  }
}

// Avoid: Deep inheritance chains
// class Animal -> class Mammal -> class Carnivore -> class Felidae -> class Cat


// ============================================================================
// COMMON PITFALLS
// ============================================================================
console.log("\n=== Class Common Pitfalls Demo ===");

// Pitfall 1: Forgetting new
try {
  class Test {}
  Test(); // TypeError
} catch (e) {
  console.log("Pitfall 1 - Forgot new:", e.message);
}

// Pitfall 2: Method not bound
class Unbound {
  value = 42;
  getValue() {
    return this.value;
  }
}
let unbound = new Unbound();
let extracted = unbound.getValue;
try {
  console.log("Pitfall 2 - Unbound method:", extracted()); // undefined or error
} catch (e) {
  console.log("Pitfall 2 - Unbound method error:", e.message);
}

// Pitfall 3: this before super
try {
  class Parent3 { constructor() { this.x = 1; } }
  class Child3 extends Parent3 {
    constructor() {
      console.log(this.x); // ReferenceError
      super();
    }
  }
  new Child3();
} catch (e) {
  console.log("Pitfall 3 - this before super:", e.message);
}

// Pitfall 4: Accessing private from outside
class WithPrivate {
  #secret = "hidden";
}
let wp = new WithPrivate();
console.log("Pitfall 4 - Private not accessible:", "#secret" in wp); // false


// ============================================================================
// SUMMARY
// ============================================================================
/**
 * Class Summary
 *
 * Key Concepts:
 * 1. Class is prototype syntax sugar
 * 2. extends/super for inheritance
 * 3. static for class-level members
 * 4. # for true private fields
 * 5. instanceof for type checking
 * 6. Mixin for code reuse
 *
 * When to Use:
 * - Clear inheritance hierarchies
 * - Factory patterns
 * - Encapsulation needed
 * - OOP patterns
 *
 * When to Avoid:
 * - Simple data containers (use objects)
 * - Deep inheritance chains
 * - When composition is clearer
 */

console.log("\n=== Classes Demo Complete ===");

// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. ACCESS MODIFIERS
   JS:  # private fields (runtime enforcement)
   TS:  public / private / protected (compile-time checks)

   TypeScript example:
   class User {
     public name: string;      // Default, accessible everywhere
     private age: number;      // Only accessible in class
     protected email: string;  // Accessible in class and subclasses
   }

2. ABSTRACT CLASSES
   JS:  no native support, manual throw required
   TS:  abstract class / abstract method

   TypeScript example:
   abstract class Animal {
     abstract makeSound(): void;

     move() {
       console.log("Moving");
     }
   }

3. INTERFACES & IMPLEMENTS
   JS:  no interface concept
   TS:  interface + implements contract

   TypeScript example:
   interface Flyable {
     fly(): void;
   }

   class Bird implements Flyable {
     fly() { console.log("Flying"); }
   }

4. PARAMETER PROPERTIES
   JS:  constructor(name) { this.name = name; }
   TS:  constructor(public name: string) {} // shorthand

   TypeScript example:
   class Person {
     constructor(
       public name: string,
       private age: number
     ) {}
   }

5. DECORATORS (Stage 3 / TS 5.0+)
   JS:  proposal stage
   TS:  @decorator syntax available

   TypeScript example:
   @sealed
   class Greeter {
     @log
     greet() { }
   }

6. READONLY PROPERTY
   JS:  Object.defineProperty or # with convention
   TS:  readonly keyword

   TypeScript example:
   class Config {
     readonly apiKey: string = "secret";
   }

📘 See 16-classes-ts-comparison.ts for detailed TypeScript examples!
📘 See related: 15-prototypes-inheritance.js for prototype relationship
*/
// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

Classes & Inheritance:
- 14-this-keyword.js (this in classes)
- 15-prototypes-inheritance.js (prototype chain underlying classes)
- 25-inheritance-patterns.js (composition and design patterns)

Advanced Patterns:
- 24-function-patterns-advanced.js (higher-order functions for classes)
- 28-memory-management.js (object pooling)
`);
