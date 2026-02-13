// Prototypes and Inheritance Demo
// 📘 For TypeScript comparison, see: 16-prototypes-inheritance-ts-comparison.ts

// ============================================
// 1. PROTOTYPE BASICS
// ============================================

/**
 * Prototype - JavaScript's inheritance mechanism
 * 
 * ES Specification: ES3 (1999) - Core concept
 *                   ES5 (2009) - Object.create, Object.getPrototypeOf
 *                   ES6 (2015) - Class syntax, Object.setPrototypeOf
 * 
 * Characteristics:
 * - Every object has an internal [[Prototype]] link
 * - Accessed via __proto__ (deprecated) or Object.getPrototypeOf()
 * - Functions have a 'prototype' property used when called with 'new'
 * - Prototype chain enables property/method inheritance
 * - null is at the top of every prototype chain
 * 
 * Use Cases:
 * - Sharing methods across instances
 * - Implementing inheritance
 * - Understanding how classes work under the hood
 * - Memory-efficient object creation
 * 
 * Common Pitfalls:
 * - Confusing __proto__ with prototype property
 * - Modifying built-in prototypes (dangerous!)
 * - Prototype pollution security vulnerabilities
 * - Performance impact of long prototype chains
 */

console.log("=== Prototype Basics Demo ===\n");

// Every object has a prototype
const obj = { name: "Object" };
console.log("Object's prototype:", Object.getPrototypeOf(obj));
console.log("Is Object.prototype?", Object.getPrototypeOf(obj) === Object.prototype);

// Prototype chain visualization
console.log("\nPrototype chain:");
console.log("obj -> Object.prototype -> null");
console.log("obj.__proto__ === Object.prototype:", obj.__proto__ === Object.prototype);
console.log("Object.prototype.__proto__ === null:", Object.prototype.__proto__ === null);

// ============================================
// 2. __PROTO__ VS PROTOTYPE
// ============================================

/**
 * __proto__ vs prototype - Two different concepts!
 * 
 * __proto__:
 * - Property of ALL objects
 * - Points to the object's prototype (what it inherits from)
 * - Deprecated (use Object.getPrototypeOf() instead)
 * - Read/write access to prototype chain
 * 
 * prototype:
 * - Property of FUNCTIONS only
 * - Used when function is called with 'new' keyword
 * - Becomes the __proto__ of created instances
 * - Contains methods/properties shared by instances
 * 
 * Key Difference:
 * - __proto__ is the actual prototype link
 * - prototype is a template for creating __proto__ links
 */

console.log("\n=== __proto__ vs prototype Demo ===\n");

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

const dog = new Animal("Dog");

console.log("Function has 'prototype' property:");
console.log("  Animal.prototype:", Animal.prototype);
console.log("  Animal.prototype.speak:", typeof Animal.prototype.speak);

console.log("\nInstance has '__proto__' link:");
console.log("  dog.__proto__ === Animal.prototype:", dog.__proto__ === Animal.prototype);
console.log("  dog.speak():", dog.speak());

console.log("\nVisualization:");
console.log(`
  Animal (function)
    └─ prototype: { speak: [Function] }
  
  dog (instance)
    ├─ name: "Dog"
    └─ __proto__ ──> Animal.prototype
                       └─ speak: [Function]
`);

// ============================================
// 3. PROTOTYPE CHAIN MECHANISM
// ============================================

/**
 * Prototype Chain - Property lookup mechanism
 * 
 * When accessing a property:
 * 1. Check if property exists on object itself
 * 2. If not, check object's prototype (__proto__)
 * 3. If not, check prototype's prototype
 * 4. Continue until reaching null
 * 5. Return undefined if not found
 * 
 * This enables inheritance and method sharing
 */

console.log("\n=== Prototype Chain Demo ===\n");

const grandparent = {
  surname: "Smith",
  greet: function() {
    return `Hello from ${this.surname} family`;
  }
};

const parent = Object.create(grandparent);
parent.firstName = "John";

const child = Object.create(parent);
child.age = 10;

console.log("Property lookup:");
console.log("  child.age:", child.age);           // Own property
console.log("  child.firstName:", child.firstName); // From parent
console.log("  child.surname:", child.surname);     // From grandparent
console.log("  child.greet():", child.greet());     // From grandparent

console.log("\nPrototype chain:");
console.log("  child -> parent -> grandparent -> Object.prototype -> null");

console.log("\nHasOwnProperty check:");
console.log("  child.hasOwnProperty('age'):", child.hasOwnProperty('age'));
console.log("  child.hasOwnProperty('firstName'):", child.hasOwnProperty('firstName'));
console.log("  child.hasOwnProperty('surname'):", child.hasOwnProperty('surname'));

// ============================================
// 4. OBJECT.CREATE() - PROTOTYPE-BASED INHERITANCE
// ============================================

/**
 * Object.create(proto) - Create object with specified prototype
 * 
 * ES Specification: ES5 (2009)
 * 
 * Characteristics:
 * - Creates new object with specified prototype
 * - More explicit than constructor functions
 * - Can pass null to create object with no prototype
 * - Optional second parameter for property descriptors
 * 
 * Use Cases:
 * - Prototypal inheritance without constructors
 * - Creating objects with specific prototype
 * - Implementing inheritance patterns
 */

console.log("\n=== Object.create() Demo ===\n");

const vehicle = {
  type: "Vehicle",
  start: function() {
    return `${this.type} is starting`;
  },
  stop: function() {
    return `${this.type} is stopping`;
  }
};

const car = Object.create(vehicle);
car.type = "Car";
car.wheels = 4;

console.log("car.start():", car.start());
console.log("car.wheels:", car.wheels);
console.log("car inherits from vehicle:", Object.getPrototypeOf(car) === vehicle);

// Creating object with no prototype
const bareObject = Object.create(null);
bareObject.name = "Bare";
console.log("\nObject with no prototype:");
console.log("  bareObject.toString:", bareObject.toString); // undefined
console.log("  bareObject.hasOwnProperty:", bareObject.hasOwnProperty); // undefined

// Object.create with property descriptors
const person = Object.create(Object.prototype, {
  name: {
    value: "Alice",
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: false
  }
});

console.log("\nObject with property descriptors:");
console.log("  person.name:", person.name);
console.log("  person.age:", person.age);
// person.age = 31; // Won't change (writable: false)
console.log("  After trying to change age:", person.age);

// ============================================
// 5. CONSTRUCTOR FUNCTIONS AND 'NEW' KEYWORD
// ============================================

/**
 * Constructor Functions - Traditional way to create objects
 * 
 * ES Specification: ES3 (1999)
 * 
 * When using 'new' keyword:
 * 1. Creates new empty object
 * 2. Sets object's __proto__ to constructor's prototype
 * 3. Calls constructor with 'this' bound to new object
 * 4. Returns the object (unless constructor returns object)
 * 
 * Characteristics:
 * - Convention: Constructor names start with capital letter
 * - 'this' refers to new instance
 * - Methods on prototype are shared across instances
 * - Properties on 'this' are instance-specific
 * 
 * Common Pitfalls:
 * - Forgetting 'new' keyword (this becomes global)
 * - Putting methods on 'this' instead of prototype (memory waste)
 */

console.log("\n=== Constructor Functions Demo ===\n");

function Person(name, age) {
  this.name = name;
  this.age = age;
  
  // ❌ Bad: Method on instance (created for each instance)
  // this.greet = function() { return `Hi, I'm ${this.name}`; };
}

// ✅ Good: Method on prototype (shared across instances)
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

console.log("alice.greet():", alice.greet());
console.log("bob.greet():", bob.greet());
console.log("Methods are shared:", alice.greet === bob.greet);

console.log("\nWhat 'new' does:");
console.log(`
  1. const obj = {};
  2. obj.__proto__ = Person.prototype;
  3. Person.call(obj, "Alice", 30);
  4. return obj;
`);

// Manual implementation of 'new'
function createInstance(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

const charlie = createInstance(Person, "Charlie", 35);
console.log("Manual 'new':", charlie.greet());

// ============================================
// 6. INHERITANCE PATTERNS USING PROTOTYPES
// ============================================

/**
 * Prototypal Inheritance - Implementing inheritance
 * 
 * Pattern 1: Constructor + prototype chain
 * Pattern 2: Object.create()
 * Pattern 3: ES6 classes (syntactic sugar)
 * 
 * Best Practice:
 * - Use ES6 classes for cleaner syntax
 * - Understand prototypes for debugging
 * - Avoid deep inheritance hierarchies
 */

console.log("\n=== Inheritance Patterns Demo ===\n");

// Pattern 1: Constructor inheritance
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const myDog = new Dog("Buddy", "Golden Retriever");
console.log("Pattern 1 - Constructor inheritance:");
console.log("  myDog.eat():", myDog.eat());
console.log("  myDog.bark():", myDog.bark());
console.log("  myDog instanceof Dog:", myDog instanceof Dog);
console.log("  myDog instanceof Animal:", myDog instanceof Animal);

// Pattern 2: Object.create() inheritance
const animalMethods = {
  eat() {
    return `${this.name} is eating`;
  },
  sleep() {
    return `${this.name} is sleeping`;
  }
};

const dogMethods = Object.create(animalMethods);
dogMethods.bark = function() {
  return `${this.name} barks!`;
};

function createDog(name, breed) {
  const dog = Object.create(dogMethods);
  dog.name = name;
  dog.breed = breed;
  return dog;
}

const myDog2 = createDog("Max", "Labrador");
console.log("\nPattern 2 - Object.create() inheritance:");
console.log("  myDog2.eat():", myDog2.eat());
console.log("  myDog2.bark():", myDog2.bark());

// ============================================
// 7. ES6 CLASSES AND PROTOTYPES
// ============================================

/**
 * ES6 Classes - Syntactic sugar over prototypes
 * 
 * ES Specification: ES6/ES2015
 * 
 * Characteristics:
 * - Cleaner syntax for constructor functions
 * - 'extends' keyword for inheritance
 * - 'super' keyword to call parent methods
 * - Still uses prototypes under the hood
 * - Methods are on prototype by default
 * 
 * Key Point: Classes are just functions!
 */

console.log("\n=== ES6 Classes and Prototypes Demo ===\n");

class Vehicle {
  constructor(type) {
    this.type = type;
  }
  
  start() {
    return `${this.type} is starting`;
  }
}

class Car extends Vehicle {
  constructor(type, brand) {
    super(type); // Call parent constructor
    this.brand = brand;
  }
  
  start() {
    return `${super.start()} - ${this.brand}`;
  }
  
  honk() {
    return "Beep beep!";
  }
}

const myCar = new Car("Car", "Toyota");
console.log("myCar.start():", myCar.start());
console.log("myCar.honk():", myCar.honk());

console.log("\nClasses are functions:");
console.log("  typeof Vehicle:", typeof Vehicle);
console.log("  typeof Car:", typeof Car);

console.log("\nMethods are on prototype:");
console.log("  Car.prototype.start:", typeof Car.prototype.start);
console.log("  Car.prototype.honk:", typeof Car.prototype.honk);
console.log("  myCar.start === Car.prototype.start:", myCar.start === Car.prototype.start);

console.log("\nPrototype chain:");
console.log("  myCar -> Car.prototype -> Vehicle.prototype -> Object.prototype -> null");
console.log("  myCar instanceof Car:", myCar instanceof Car);
console.log("  myCar instanceof Vehicle:", myCar instanceof Vehicle);
console.log("  myCar instanceof Object:", myCar instanceof Object);

// ============================================
// 8. OBJECT.GETPROTOTYPEOF AND OBJECT.SETPROTOTYPEOF
// ============================================

/**
 * Object.getPrototypeOf(obj) - Get object's prototype
 * Object.setPrototypeOf(obj, proto) - Set object's prototype
 * 
 * ES Specification: ES5 (getPrototypeOf), ES6 (setPrototypeOf)
 * 
 * Characteristics:
 * - getPrototypeOf: Safe way to access prototype (replaces __proto__)
 * - setPrototypeOf: Change prototype after creation (slow!)
 * 
 * Common Pitfalls:
 * - setPrototypeOf is very slow (avoid in performance-critical code)
 * - Prefer Object.create() for setting prototype at creation
 */

console.log("\n=== Object.getPrototypeOf/setPrototypeOf Demo ===\n");

const animal = {
  type: "Animal",
  makeSound() {
    return "Some sound";
  }
};

const cat = {
  name: "Whiskers"
};

console.log("Before setting prototype:");
console.log("  cat.makeSound:", cat.makeSound); // undefined

// Set prototype
Object.setPrototypeOf(cat, animal);

console.log("\nAfter setting prototype:");
console.log("  cat.makeSound():", cat.makeSound());
console.log("  Object.getPrototypeOf(cat) === animal:", Object.getPrototypeOf(cat) === animal);

// ⚠️ Performance warning
console.log("\n⚠️ Performance Warning:");
console.log("  Object.setPrototypeOf is SLOW!");
console.log("  Prefer Object.create() when possible:");
console.log("  const cat = Object.create(animal);");

// ============================================
// 9. PROTOTYPE PROPERTY LOOKUP
// ============================================

/**
 * Property Lookup - How JavaScript finds properties
 * 
 * Reading properties:
 * - Searches up prototype chain
 * - Returns first match found
 * - Returns undefined if not found
 * 
 * Writing properties:
 * - Always creates/updates on object itself
 * - Never modifies prototype
 * - Exception: Setters on prototype
 * 
 * Deleting properties:
 * - Only deletes own properties
 * - Reveals prototype property if exists
 */

console.log("\n=== Property Lookup Demo ===\n");

const proto = {
  x: 10,
  y: 20
};

const obj1 = Object.create(proto);
obj1.x = 30; // Shadows prototype property

console.log("Reading properties:");
console.log("  obj1.x:", obj1.x); // 30 (own property)
console.log("  obj1.y:", obj1.y); // 20 (from prototype)
console.log("  obj1.z:", obj1.z); // undefined (not found)

console.log("\nOwn vs inherited:");
console.log("  obj1.hasOwnProperty('x'):", obj1.hasOwnProperty('x')); // true
console.log("  obj1.hasOwnProperty('y'):", obj1.hasOwnProperty('y')); // false

console.log("\nDeleting properties:");
delete obj1.x;
console.log("  After delete obj1.x:", obj1.x); // 10 (reveals prototype property)

// Writing to prototype property
obj1.y = 40;
console.log("  obj1.y:", obj1.y); // 40 (own property now)
console.log("  proto.y:", proto.y); // 20 (unchanged)

// ============================================
// 10. COMPARING APPROACHES
// ============================================

console.log("\n=== Comparing Approaches Demo ===\n");

// Approach 1: Constructor function
function PersonConstructor(name) {
  this.name = name;
}
PersonConstructor.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

// Approach 2: Object.create()
const personProto = {
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};
function createPerson(name) {
  const person = Object.create(personProto);
  person.name = name;
  return person;
}

// Approach 3: ES6 Class
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const p1 = new PersonConstructor("Alice");
const p2 = createPerson("Bob");
const p3 = new PersonClass("Charlie");

console.log("All approaches work:");
console.log("  Constructor:", p1.greet());
console.log("  Object.create:", p2.greet());
console.log("  ES6 Class:", p3.greet());

console.log("\nComparison:");
console.log(`
┌─────────────────────┬──────────────┬────────────────┬─────────────┐
│ Feature             │ Constructor  │ Object.create  │ ES6 Class   │
├─────────────────────┼──────────────┼────────────────┼─────────────┤
│ Syntax              │ Traditional  │ Functional     │ Modern      │
│ 'new' required      │ Yes          │ No             │ Yes         │
│ instanceof works    │ Yes          │ No*            │ Yes         │
│ Inheritance         │ Manual       │ Manual         │ 'extends'   │
│ super keyword       │ No           │ No             │ Yes         │
│ Readability         │ Medium       │ Good           │ Best        │
│ ES Version          │ ES3          │ ES5            │ ES6         │
└─────────────────────┴──────────────┴────────────────┴─────────────┘

* instanceof works if you set up constructor property correctly
`);

// ============================================
// 11. COMMON PITFALLS
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: Modifying built-in prototypes
console.log("Pitfall 1: Modifying built-in prototypes");
console.log("  ❌ NEVER DO THIS:");
console.log("  Array.prototype.myMethod = function() { ... }");
console.log("  Reason: Affects all arrays globally, breaks code");

// Pitfall 2: Forgetting 'new' keyword
console.log("\nPitfall 2: Forgetting 'new' keyword");
function BadConstructor(name) {
  this.name = name; // 'this' is global without 'new'!
}

// ❌ Without 'new'
// const bad = BadConstructor("Test"); // 'this' is global!

// ✅ With 'new'
const good = new BadConstructor("Test");
console.log("  ✅ With 'new':", good.name);

// Pitfall 3: Prototype pollution
console.log("\nPitfall 3: Prototype pollution");
console.log("  Security vulnerability:");
console.log("  const obj = JSON.parse('{\"__proto__\": {\"isAdmin\": true}}');");
console.log("  Can pollute Object.prototype!");
console.log("  ✅ Use Object.create(null) for user data");

// Pitfall 4: Performance - long prototype chains
console.log("\nPitfall 4: Long prototype chains");
console.log("  ❌ Deep inheritance hierarchies are slow");
console.log("  ✅ Prefer composition over deep inheritance");

// Pitfall 5: Confusing __proto__ and prototype
console.log("\nPitfall 5: Confusing __proto__ and prototype");
function Example() {}
const instance = new Example();
console.log("  instance.__proto__ === Example.prototype:", instance.__proto__ === Example.prototype);
console.log("  instance.prototype:", instance.prototype); // undefined!
console.log("  Example.__proto__:", typeof Example.__proto__); // function

// ============================================
// 12. BEST PRACTICES
// ============================================

console.log("\n=== Best Practices ===\n");
console.log(`
1. USE ES6 CLASSES
   ✅ class Person { constructor(name) { this.name = name; } }
   - Cleaner syntax
   - Better tooling support
   - Easier to understand

2. AVOID MODIFYING BUILT-IN PROTOTYPES
   ❌ Array.prototype.myMethod = ...
   ✅ Create utility functions instead

3. USE Object.getPrototypeOf() INSTEAD OF __proto__
   ❌ obj.__proto__
   ✅ Object.getPrototypeOf(obj)

4. PREFER COMPOSITION OVER INHERITANCE
   ✅ Shallow hierarchies
   ✅ Mixins and composition
   ❌ Deep inheritance chains

5. USE Object.create(null) FOR DICTIONARIES
   ✅ const dict = Object.create(null);
   - No prototype pollution
   - No inherited properties

6. ALWAYS USE 'new' WITH CONSTRUCTORS
   ✅ const obj = new Constructor();
   - Or use ES6 classes (enforces 'new')

7. PUT METHODS ON PROTOTYPE, NOT INSTANCE
   ❌ this.method = function() { ... }
   ✅ Constructor.prototype.method = function() { ... }
   - Memory efficient
   - Shared across instances

8. UNDERSTAND PROTOTYPES FOR DEBUGGING
   - Know how to inspect prototype chain
   - Understand property lookup
   - Use console.dir() to see prototypes

9. AVOID Object.setPrototypeOf()
   ❌ Object.setPrototypeOf(obj, proto)
   ✅ Object.create(proto)
   - setPrototypeOf is very slow
   - Set prototype at creation time

10. USE instanceof CAREFULLY
    - Only works with constructor functions
    - Can be fooled by prototype manipulation
    - Consider duck typing for flexibility
`);

// ============================================
// 13. PRACTICAL EXAMPLE - SHAPE HIERARCHY
// ============================================

console.log("\n=== Practical Example - Shape Hierarchy ===\n");

class Shape {
  constructor(color) {
    this.color = color;
  }
  
  describe() {
    return `A ${this.color} shape`;
  }
  
  area() {
    throw new Error("area() must be implemented by subclass");
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
  
  describe() {
    return `${super.describe()} - Rectangle ${this.width}x${this.height}`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
  
  describe() {
    return `${super.describe()} - Circle with radius ${this.radius}`;
  }
}

const rect = new Rectangle("red", 10, 5);
const circle = new Circle("blue", 7);

console.log("Rectangle:");
console.log("  Description:", rect.describe());
console.log("  Area:", rect.area());

console.log("\nCircle:");
console.log("  Description:", circle.describe());
console.log("  Area:", circle.area().toFixed(2));

console.log("\nPrototype chain:");
console.log("  rect instanceof Rectangle:", rect instanceof Rectangle);
console.log("  rect instanceof Shape:", rect instanceof Shape);
console.log("  rect instanceof Object:", rect instanceof Object);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. CLASS SYNTAX WITH TYPES
   JS:  class Person {
          constructor(name) {
            this.name = name;
          }
        }
   
   TS:  class Person {
          name: string;
          constructor(name: string) {
            this.name = name;
          }
        }
   
   Benefits:
   - Type-safe properties
   - Better IDE support
   - Compile-time error checking

2. ABSTRACT CLASSES (TS-Only)
   JS:  // No native abstract classes
   
   TS:  abstract class Shape {
          abstract area(): number;
          describe() {
            return "A shape";
          }
        }
   
   Benefits:
   - Enforce method implementation
   - Cannot instantiate abstract classes
   - Better design patterns

3. INTERFACES (TS-Only)
   JS:  // No interfaces
   
   TS:  interface Drawable {
          draw(): void;
        }
        
        class Circle implements Drawable {
          draw() { ... }
        }
   
   Benefits:
   - Contract enforcement
   - Multiple interface implementation
   - Structural typing

4. ACCESS MODIFIERS (TS-Only)
   JS:  // Only # for private (ES2022)
   
   TS:  class Person {
          public name: string;
          private age: number;
          protected id: number;
        }
   
   Benefits:
   - public: Accessible everywhere
   - private: Only within class
   - protected: Within class and subclasses

5. READONLY PROPERTIES (TS-Only)
   JS:  // Use Object.defineProperty
   
   TS:  class Person {
          readonly id: number;
          constructor(id: number) {
            this.id = id;
          }
        }
   
   Benefits:
   - Immutable after initialization
   - Compile-time enforcement
   - Better intent communication

6. STATIC MEMBERS WITH TYPES
   JS:  class Math {
          static PI = 3.14159;
        }
   
   TS:  class Math {
          static readonly PI: number = 3.14159;
        }
   
   Benefits:
   - Type-safe static members
   - Readonly enforcement
   - Better documentation

7. GENERICS IN CLASSES (TS-Only)
   JS:  // No generics
   
   TS:  class Box<T> {
          private value: T;
          constructor(value: T) {
            this.value = value;
          }
          getValue(): T {
            return this.value;
          }
        }
   
   Benefits:
   - Type-safe generic classes
   - Reusable with any type
   - Type inference

8. CONSTRUCTOR PARAMETER PROPERTIES (TS-Only)
   JS:  class Person {
          constructor(name, age) {
            this.name = name;
            this.age = age;
          }
        }
   
   TS:  class Person {
          constructor(
            public name: string,
            private age: number
          ) {}
        }
   
   Benefits:
   - Shorter syntax
   - Automatic property creation
   - Less boilerplate

9. METHOD OVERLOADING (TS-Only)
   JS:  // No method overloading
   
   TS:  class Calculator {
          add(a: number, b: number): number;
          add(a: string, b: string): string;
          add(a: any, b: any): any {
            return a + b;
          }
        }
   
   Benefits:
   - Multiple signatures
   - Type-safe overloads
   - Better API design

10. DECORATORS (TS Experimental)
    JS:  // Stage 3 proposal
    
    TS:  @sealed
         class Person {
           @readonly
           name: string;
         }
    
    Benefits:
    - Metadata and annotations
    - Aspect-oriented programming
    - Framework integration

⚠️ COMMON CONFUSION POINTS:

1. PRIVATE FIELDS: # vs private
   JS:  class Person { #age = 30; }  // ES2022 private
   TS:  class Person { private age = 30; }  // TS private
   
   - JS #: Runtime privacy (truly private)
   - TS private: Compile-time only (becomes public in JS)

2. ABSTRACT CLASSES vs INTERFACES
   - Abstract classes: Can have implementation
   - Interfaces: Only contracts, no implementation
   - Classes can implement multiple interfaces
   - Classes can only extend one abstract class

3. PROTECTED vs PRIVATE
   - private: Only within class
   - protected: Within class AND subclasses
   - Both are compile-time only in TS

4. READONLY vs CONST
   - readonly: For class properties
   - const: For variables
   - readonly can be set in constructor

5. STATIC vs INSTANCE MEMBERS
   - Static: Belong to class itself
   - Instance: Belong to each instance
   - Static members not inherited by instances

📘 See 16-prototypes-inheritance-ts-comparison.ts for detailed examples!
*/
