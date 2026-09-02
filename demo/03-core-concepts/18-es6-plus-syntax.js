// ES6+ Syntax Features Demo
// 📘 See: https://javascript.info/ (JavaScript.info - Modern JavaScript)
// 📘 See: https://developer.mozilla.org/en-US/docs/Web/JavaScript (MDN JavaScript Reference)
// 📘 For TypeScript comparison, see: 18-es6-plus-syntax-ts-comparison.ts
// 📌 Covers ES6/ES2015 through ES2023+ modern syntax features
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces modern JavaScript syntax in a gradual order.
// Start from the top and read through the sections one by one.
// The examples are intentionally small so the syntax patterns are easy to compare.

// ============================================
// Table of Contents
// ============================================

// 1. Spread Operator (ES6/ES2015)
// 2. Destructuring (ES6/ES2015)
// 3. Optional Chaining (?.) (ES2020)
// 4. Nullish Coalescing (??) (ES2020)
// 5. Default Parameters (ES6/ES2015)
// 6. Rest Parameters (ES6/ES2015)
// 7. Arrow Functions (ES6/ES2015)
// 8. Classes - Basic Syntax (ES6/ES2015)
// 9. Static Methods and Properties (ES6/ES2015 for methods, ES2022 for properties)
// 10. Private Fields (ES2022)
// 11. Getters and Setters (ES6/ES2015)
// 12. Class Inheritance and Method Overriding (ES6/ES2015)
// 13. Abstract Class Patterns (ES6/ES2015)
// 14. Class Common Pitfalls & Best Practices
// 15. Object Property Shorthand & Computed Property Names (ES6/ES2015)
// 16. NEW ARRAY METHODS (ES2022/ES2023)
// 17. STRING METHODS (ES2021/ES2022)
// 18. NUMERIC SEPARATORS (ES2021) AND BIGINT (ES2020)
// 19. LOGICAL ASSIGNMENT OPERATORS (ES2021)
// 20. PROMISE METHODS
// 21. MODERN FEATURES SUMMARY
// 22. ADDITIONAL ES2020-ES2024 FEATURES

// ============================================

// ============================================
// 1. Spread Operator (ES6/ES2015)
// ============================================

// Spread Operator - Expands iterables into individual elements (ES6/ES2015)
// - Works with arrays, objects, strings, and other iterables
// - Creates shallow copies
// - Useful for combining arrays/objects
// - Common in React for immutable state updates
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

console.log("Spread Operator:");
console.log({ arr2, obj2 });

// ============================================
// 2. Destructuring (ES6/ES2015)
// ============================================

// Destructuring - Extract values from arrays/objects into variables (ES6/ES2015)
// - Simplifies variable assignment
// - Supports default values
// - Works with nested structures
// - Can rename variables during extraction
const person = { name: "Alice", age: 30, city: "NYC" };
const { name, age } = person;

const numbers = [10, 20, 30, 40];
const [first, second, ...rest] = numbers;

console.log("\nDestructuring:");
console.log({ name, age, first, second, rest });

// ============================================
// 3. Optional Chaining (?.) (ES2020)
// ============================================

// Optional Chaining - Safe property access without nested if checks (ES2020)
// - Returns undefined instead of throwing TypeError for null/undefined
// - Works with properties, methods, and array access
// - Can be chained deeply with obj?.a?.b?.c
const user = {
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001",
  },
};

console.log("\nOptional Chaining:");
console.log("User city:", user?.address?.city); // "NYC"
console.log("Missing nested:", user?.profile?.email); // undefined
console.log("Optional method call:", user?.getName?.()); // undefined (method doesn't exist)

// Real-world example
function getUserName(obj) {
  return obj?.user?.name ?? "Anonymous";
}

console.log("With user:", getUserName({ user: { name: "Bob" } })); // "Bob"
console.log("Without user:", getUserName({})); // "Anonymous"

// ============================================
// 4. Nullish Coalescing (??) (ES2020)
// ============================================

// Nullish Coalescing - Fallback for null or undefined only (ES2020)
// - Only triggers on null or undefined (not falsy values like 0, "", false)
// - Safer alternative to || operator
// - Preserves "truthy but falsy" values like 0 and empty strings

const config = { timeout: 0, debug: "" };
const defaults = { timeout: 5000, debug: "verbose" };

console.log("\nNullish Coalescing:");
// ?? only activates on null/undefined
console.log("Timeout (??):", config.timeout ?? defaults.timeout); // 0 (preserved!)
console.log("Debug (??):", config.debug ?? defaults.debug); // "" (preserved!)

// || activates on any falsy value (wrong for 0, "", false)
console.log("Timeout (||):", config.timeout || defaults.timeout); // 5000 (wrong!)
console.log("Debug (||):", config.debug || defaults.debug); // "verbose" (wrong!)

// Practical use case
function getPort(port) {
  return port ?? 3000; // Only use default if port is null/undefined
}

console.log("Port 8080:", getPort(8080)); // 8080
console.log("Port 0 (valid):", getPort(0)); // 0 (correctly preserved!)
console.log("Port null:", getPort(null)); // 3000
console.log("Port undefined:", getPort(undefined)); // 3000

// ============================================
// 5. Default Parameters (ES6/ES2015)
// ============================================

// Default Parameters - Provide default values for function parameters (ES6/ES2015)
// - Evaluated at call time
// - Can reference earlier parameters
// - Replaces need for || operator checks
// NOTE: For nullish coalescing fallback (??), see section 4 above
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log("\nDefault Parameters:");
console.log(greet()); // "Hello, Guest!"
console.log(greet("Bob")); // "Hello, Bob!"

// ============================================
// 6. Rest Parameters (ES6/ES2015)
// ============================================

// Rest Parameters - Collect remaining arguments into an array (ES6/ES2015)
// - Must be last parameter
// - Creates a real array (not arguments object)
// - Works with arrow functions
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("\nRest Parameters:");
console.log(sum(1, 2, 3, 4, 5)); // 15

// ============================================
// 7. Arrow Functions (ES6/ES2015)
// ============================================

// Arrow Functions - Shorter syntax with lexical this binding (ES6/ES2015)
// - Lexically binds 'this' from enclosing scope
// - Cannot be used as constructors
// - No arguments object
// - Implicit return for single expressions
const counter = {
  count: 0,
  increment() {
    // Arrow function preserves 'this' from enclosing scope
    setTimeout(() => {
      this.count++;
      console.log("\nArrow Function 'this':", this.count);
    }, 100);
  },
};

counter.increment();

// ============================================
// 8. Classes - Basic Syntax (ES6/ES2015)
// ============================================

// Classes - Syntactic sugar over prototype-based inheritance (ES6/ES2015)
// - Constructor method for initialization
// - Instance methods defined in class body
// - Inheritance with extends keyword
// - super() calls parent constructor
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks!`;
  }
}

const dog = new Dog("Max", "Golden Retriever");
console.log("\nBasic Classes:");
console.log(dog.speak()); // "Max barks!"

// ============================================
// 9. Static Methods and Properties (ES6/ES2015 for methods, ES2022 for properties)
// ============================================

// Static Methods - Methods called on the class itself, not instances (ES6/ES2015)
// Static Properties - Properties that belong to the class, not instances (ES2022)
// - Useful for utility functions
// - Shared across all instances
// - Cannot access instance properties via 'this'
// - Often used for factory methods or constants
class MathUtils {
  // Static property (ES2022)
  static PI = 3.14159;
  static version = "1.0.0";

  // Static method (ES6/ES2015)
  static square(x) {
    return x * x;
  }

  static circleArea(radius) {
    return this.PI * this.square(radius);
  }

  // Instance method for comparison
  instanceMethod() {
    return "This is an instance method";
  }
}

console.log("\nStatic Methods and Properties:");
console.log("MathUtils.PI:", MathUtils.PI);
console.log("MathUtils.square(5):", MathUtils.square(5));
console.log("MathUtils.circleArea(3):", MathUtils.circleArea(3));

// Static methods are not available on instances
const mathInstance = new MathUtils();
console.log("Instance method:", mathInstance.instanceMethod());
// console.log(mathInstance.square(5)); // TypeError: mathInstance.square is not a function

// ============================================
// 10. Private Fields (ES2022)
// ============================================

// Private Fields - Fields that are only accessible within the class (ES2022)
// - Declared with # prefix
// - Cannot be accessed from outside the class
// - Not inherited by subclasses
// - Provides true encapsulation
// - Different from convention-based _private naming
class BankAccount {
  // Private fields (ES2022)
  #balance = 0;
  #accountNumber;

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
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

  getAccountInfo() {
    return `Account ${this.#accountNumber}: $${this.#balance}`;
  }
}

console.log("\nPrivate Fields:");
const account = new BankAccount("ACC-001", 1000);
console.log("Initial balance:", account.getBalance());
account.deposit(500);
console.log("After deposit:", account.getBalance());
account.withdraw(200);
console.log("After withdrawal:", account.getBalance());
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class

// ============================================
// 11. Getters and Setters (ES6/ES2015)
// ============================================

// Getters and Setters - Computed properties with validation (ES6/ES2015)
// - get: Define a property that is computed when accessed
// - set: Define a property with validation when assigned
// - Appear as properties, not methods (no parentheses)
// - Useful for computed values and validation
// - Can have getter without setter (read-only property)
class Temperature {
  #celsius = 0;

  constructor(celsius = 0) {
    this.#celsius = celsius;
  }

  // Getter - computed property
  get celsius() {
    return this.#celsius;
  }

  // Setter - with validation
  set celsius(value) {
    if (typeof value !== "number") {
      throw new TypeError("Temperature must be a number");
    }
    if (value < -273.15) {
      throw new RangeError("Temperature cannot be below absolute zero");
    }
    this.#celsius = value;
  }

  // Computed property - Fahrenheit
  get fahrenheit() {
    return (this.#celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = ((value - 32) * 5) / 9; // Uses celsius setter for validation
  }

  // Read-only property (getter without setter)
  get kelvin() {
    return this.#celsius + 273.15;
  }
}

console.log("\nGetters and Setters:");
const temp = new Temperature(25);
console.log("Celsius:", temp.celsius); // Uses getter
console.log("Fahrenheit:", temp.fahrenheit); // Computed
console.log("Kelvin:", temp.kelvin); // Read-only

temp.fahrenheit = 86; // Uses setter
console.log("After setting Fahrenheit to 86:");
console.log("Celsius:", temp.celsius);

// ============================================
// 12. Class Inheritance and Method Overriding (ES6/ES2015)
// ============================================

// Class Inheritance - Extend classes to create specialized versions (ES6/ES2015)
// - extends keyword creates inheritance relationship
// - super() calls parent constructor (required in child constructor)
// - super.method() calls parent method
// - Method overriding: child method replaces parent method
// - Child can extend parent behavior by calling super.method()
class Vehicle {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    this.speed = 0;
  }

  accelerate(amount) {
    this.speed += amount;
    return `${this.brand} ${this.model} accelerating to ${this.speed} mph`;
  }

  brake() {
    this.speed = 0;
    return `${this.brand} ${this.model} stopped`;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }
}

class ElectricCar extends Vehicle {
  constructor(brand, model, batteryCapacity) {
    super(brand, model); // Call parent constructor
    this.batteryCapacity = batteryCapacity;
    this.batteryLevel = 100;
  }

  // Method overriding - completely replace parent method
  accelerate(amount) {
    if (this.batteryLevel > 0) {
      this.speed += amount;
      this.batteryLevel -= amount * 0.1; // Electric cars use battery
      return `${this.brand} ${this.model} silently accelerating to ${this.speed} mph (Battery: ${this.batteryLevel.toFixed(1)}%)`;
    }
    return "Battery depleted!";
  }

  // Extending parent behavior - call super then add more
  brake() {
    const result = super.brake(); // Call parent brake method
    this.batteryLevel = Math.min(100, this.batteryLevel + 5); // Regenerative braking
    return `${result} (Regenerative braking: ${this.batteryLevel.toFixed(1)}%)`;
  }

  // New method specific to ElectricCar
  charge() {
    this.batteryLevel = 100;
    return "Battery fully charged";
  }

  // Override getInfo to add battery info
  getInfo() {
    return `${super.getInfo()} - ${this.batteryCapacity}kWh battery`;
  }
}

console.log("\nClass Inheritance and Method Overriding:");
const tesla = new ElectricCar("Tesla", "Model 3", 75);
console.log(tesla.getInfo());
console.log(tesla.accelerate(30));
console.log(tesla.accelerate(20));
console.log(tesla.brake());
console.log(tesla.charge());

// ============================================
// 13. Abstract Class Patterns (ES6/ES2015)
// ============================================

// Abstract Class Pattern - Base classes that should not be instantiated directly
// - JavaScript doesn't have built-in abstract classes
// - Pattern: throw error in constructor if instantiated directly
// - Pattern: throw error in methods that must be overridden
// - Provides template for subclasses
// - Enforces implementation of required methods
class Shape {
  constructor(type) {
    // Prevent direct instantiation of Shape
    if (new.target === Shape) {
      throw new TypeError("Cannot instantiate abstract class Shape directly");
    }
    this.type = type;
  }

  // Abstract method - must be overridden by subclasses
  area() {
    throw new Error("Method 'area()' must be implemented by subclass");
  }

  // Abstract method - must be overridden by subclasses
  perimeter() {
    throw new Error("Method 'perimeter()' must be implemented by subclass");
  }

  // Concrete method - can be used by all subclasses
  describe() {
    return `This is a ${this.type} with area ${this.area()} and perimeter ${this.perimeter()}`;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super("rectangle");
    this.width = width;
    this.height = height;
  }

  // Implement abstract method
  area() {
    return this.width * this.height;
  }

  // Implement abstract method
  perimeter() {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(radius) {
    super("circle");
    this.radius = radius;
  }

  // Implement abstract method
  area() {
    return Math.PI * this.radius * this.radius;
  }

  // Implement abstract method
  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}

console.log("\nAbstract Class Pattern:");
const rect = new Rectangle(5, 3);
console.log(rect.describe());

const circle = new Circle(4);
console.log(circle.describe());

// This would throw an error:
// const shape = new Shape("generic"); // TypeError: Cannot instantiate abstract class Shape directly

// ============================================
// 14. Class Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: 'this' binding in class methods
class Counter {
  count = 0;

  increment() {
    this.count++;
  }
}

const counterInstance = new Counter();
const incrementFn = counterInstance.increment;
// incrementFn(); // TypeError: Cannot read property 'count' of undefined

// Solution 1: Bind in constructor
class CounterBound {
  count = 0;

  constructor() {
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
  }
}

// Solution 2: Use arrow function (class field)
class CounterArrow {
  count = 0;

  increment = () => {
    this.count++;
  };
}

console.log("'this' binding solutions work correctly");

// Pitfall 2: Forgetting super() in child constructor
class Parent {
  constructor(name) {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    // Must call super() before accessing 'this'
    super(name);
    this.age = age;
  }
}

console.log("super() must be called before accessing 'this'");

// Pitfall 3: Private fields are not inherited
class Base {
  #privateField = "base private";

  getPrivate() {
    return this.#privateField;
  }
}

class Derived extends Base {
  // Cannot access parent's #privateField
  // getParentPrivate() {
  //   return this.#privateField; // SyntaxError
  // }
}

console.log("Private fields are not accessible in subclasses");

// Best Practice 1: Use static methods for utility functions
class StringUtils {
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static reverse(str) {
    return str.split("").reverse().join("");
  }
}

console.log("Static utility:", StringUtils.capitalize("hello"));

// Best Practice 2: Use getters for computed properties
class UserProfile {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const userProfile = new UserProfile("John", "Doe");
console.log("Computed property:", userProfile.fullName);

// Best Practice 3: Use private fields for true encapsulation
class SecureData {
  #data;

  constructor(data) {
    this.#data = data;
  }

  getData() {
    // Add validation or logging here
    return this.#data;
  }
}

console.log("Private fields provide true encapsulation");

// ============================================
// NOTE: MODULES (import/export)
// ============================================
/*
 * Modules (import/export) are covered in detail in demo/04-asynchronous/32-modules.js
 *
 * ES6 introduced native module system with import/export syntax:
 * - export: Make values available to other modules
 * - import: Use values from other modules
 * - default export: Single main export per module
 * - named exports: Multiple exports per module
 *
 * See demo/04-asynchronous/32-modules.js for comprehensive coverage of:
 * - import and export syntax
 * - default vs named exports
 * - dynamic imports
 * - module scope
 * - ES Modules vs CommonJS
 */

// ============================================
// 15. Object Property Shorthand & Computed Property Names (ES6/ES2015)
// ============================================
/**
 * Object Property Shorthand - Simplify object creation when variable name matches property name (ES6)
 * Computed Property Names - Dynamically compute property keys at object creation (ES6)
 *
 * Use Cases:
 * - Shorter, cleaner object initialization
 * - Dynamic property keys from variables/expressions
 * - Reduces duplication when creating objects from variables
 */

console.log("\n=== Object Property Shorthand ===");

// Property shorthand and computed property names demo
// Wrapped in a block to keep demo variables scoped locally
{
  // Without shorthand (pre-ES6)
  const name = "Alice";
  const age = 30;
  const email = "alice@example.com";

  const userOld = {
    name: name,
    age: age,
    email: email,
  };
  console.log("Pre-ES6 object:", userOld);

  // With property shorthand (ES6+)
  const userNew = {
    name, // Same as name: name
    age, // Same as age: age
    email, // Same as email: email
  };
  console.log("ES6 shorthand object:", userNew); // Same as userOld
}

console.log("\n=== Computed Property Names ===");

{
  // Dynamic key from variable
  const key = "user_id";
  const user = {
    name: "Bob",
    [key]: 12345, // Computed property name
    [`${key}_hash`]: "abc123", // Computed with template literal
  };
  console.log("User with computed keys:", user);
  console.log("user[key]:", user[key]); // 12345

  // Dynamic method names
  const methodName = "greet";
  const obj = {
    [methodName]() {
      return "Hello!";
    },
  };
  console.log("Dynamic method call:", obj.greet()); // "Hello!"

  // Common use case: mapping arrays to objects
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  // Create map by id
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));
  console.log("User map by id:", userMap);
  console.log("userMap[2]:", userMap[2]); // { id: 2, name: "Bob" }
}

// ============================================
// 16. NEW ARRAY METHODS (ES2022/ES2023)
// ============================================

// Array.from() - Create array from array-like or iterable
console.log("\nArray.from():");
console.log("Array.from('hello'):", Array.from("hello")); // ['h', 'e', 'l', 'l', 'o']
console.log(
  "Array.from([1, 2, 3], x => x*2):",
  Array.from([1, 2, 3], x => x * 2)
); // [2, 4, 6]
// Note: mapFn receives (element, index) - with {length}, use index for sequence
console.log(
  "Array.from({length: 3}, (_, i) => i*2):",
  Array.from({ length: 3 }, (_, i) => i * 2)
); // [0, 2, 4]

// Array.of() - Create array from arguments
console.log("\nArray.of():");
console.log("Array.of(5):", Array.of(5)); // [5]
console.log("Array.of(1, 2, 3):", Array.of(1, 2, 3)); // [1, 2, 3]
console.log("Array(5):", Array(5)); // [, , , , ] (empty slots - different!)

// Object.fromEntries() - Convert.entries to object
console.log("\nObject.fromEntries():");
const entries = [
  ["name", "Alice"],
  ["age", 30],
];
console.log("From entries:", Object.fromEntries(entries)); // { name: 'Alice', age: 30 }

// Array.prototype.at() - Access with negative indices (ES2022)
console.log("\nArray.at():");
const arr = [10, 20, 30, 40, 50];
console.log("arr[0]:", arr[0]); // 10
console.log("arr.at(0):", arr.at(0)); // 10
console.log("arr.at(-1):", arr.at(-1)); // 50 (last element)
console.log("arr.at(-2):", arr.at(-2)); // 40 (second to last)

// Array.prototype.findLast() (ES2023)
console.log("\nArray.findLast():");
const nums = [1, 2, 3, 4, 5];
console.log(
  "findLast even:",
  nums.findLast(n => n % 2 === 0)
); // 4
console.log(
  "findLast > 3:",
  nums.findLast(n => n > 3)
); // 5

// Immutable Array Methods (ES2023) - Return new arrays instead of mutating
console.log("\nImmutable Array Methods (ES2023):");
const original = [3, 1, 2];

// toSorted() - Returns new sorted array (vs sort() which mutates)
const sorted = original.toSorted(); // [1, 2, 3]
console.log("original after toSorted:", original); // [3, 1, 2] (unchanged!)
console.log("toSorted result:", sorted); // [1, 2, 3]
// Compare with sort(): original.sort() would mutate original to [1, 2, 3]

// toReversed() - Returns new reversed array (vs reverse() which mutates)
const reversed = original.toReversed(); // [2, 1, 3]
console.log("original after toReversed:", original); // [3, 1, 2] (unchanged!)
console.log("toReversed result:", reversed); // [2, 1, 3]

// toSpliced(start, deleteCount, ...items) - Returns new spliced array (vs splice() which mutates)
const spliced = original.toSpliced(1, 1, 99); // [3, 99, 2]
console.log("original after toSpliced:", original); // [3, 1, 2] (unchanged!)
console.log("toSpliced result:", spliced); // [3, 99, 2]

// with(index, value) - Returns new array with element replaced (vs arr[i] = val which mutates)
const replaced = original.with(0, 100); // [100, 1, 2]
console.log("original after with:", original); // [3, 1, 2] (unchanged!)
console.log("with result:", replaced); // [100, 1, 2]

// These methods enable functional/immutable array programming patterns
// without needing to copy the array first (e.g., [...arr].sort())

// ============================================
// 17. STRING METHODS (ES2021/ES2022)
// ============================================

// String.prototype.replaceAll() (ES2021)
console.log("\nString.replaceAll():");
const text = "hello world hello";
console.log("replaceAll('hello', 'hi'):", text.replaceAll("hello", "hi")); // "hi world hi"
console.log("replace() first only:", text.replace("hello", "hi")); // "hi world hello"

// String.prototype.trimStart/trimEnd() aliases (ES2019)
console.log("\nString trimming:");
const padded = "   hello   ";
console.log("trimStart:", '"' + padded.trimStart() + '"'); // "hello   "
console.log("trimEnd:", '"' + padded.trimEnd() + '"'); // "   hello"
console.log("trim:", '"' + padded.trim() + '"'); // "hello"

// ============================================
// ============================================
// 18. NUMERIC SEPARATORS (ES2021) AND BIGINT (ES2020)
// ============================================

// Numeric Separators (ES2021) - Improve readability of large numbers
console.log("\nNumeric Separators (ES2021):");
const billion = 1_000_000_000; // Much more readable than 1000000000
console.log("1_000_000_000:", billion); // 1000000000
const hex = 0xff_ff_ff_ff;
console.log("0xFF_FF_FF_FF:", hex); // 4294967295
const binary = 0b1010_0101_1100_0011;
console.log("0b1010_0101_1100_0011:", binary);
const price = 1_299_99; // Can be used anywhere within digits
console.log("1_299_99:", price); // 129999
// Note: underscores cannot be at start/end of number or adjacent to decimal point

// BigInt (ES2020) - Arbitrary precision integers
console.log("\nBigInt (ES2020):");
const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
console.log("Number.MAX_SAFE_INTEGER:", maxSafe);
console.log("Beyond safe integer:", maxSafe + 1 === maxSafe + 2); // true (precision loss!)

// BigInt creation: append 'n' suffix or use BigInt() function
const big1 = 9007199254740991n;
const big2 = BigInt("9007199254740992");
const big3 = BigInt(42); // From regular number (safe for small values)

console.log("BigInt literal:", big1);
console.log("BigInt from string:", big2);
console.log("BigInt from number:", big3);

// BigInt arithmetic (cannot mix with Number)
const bigSum = big1 + 1n;
console.log("big1 + 1n:", bigSum); // 9007199254740992n
// const bad = big1 + 1; // TypeError: Cannot mix BigInt and other types

// BigInt comparison (can compare with Number using == but not ===)
console.log("1n == 1:", 1n == 1); // true (loose equality)
console.log("1n === 1:", 1n === 1); // false (strict equality, different types)

// BigInt limitations
// - Cannot be used with Math methods (Math.abs(5n) → TypeError)
// - Cannot be serialized with JSON.stringify (throws TypeError)
// - No fractional values (5n / 2n = 2n, not 2.5n)
console.log("5n / 2n:", 5n / 2n); // 2n (truncated toward zero)

// Object.hasOwn() (ES2022) - Safer alternative to Object.prototype.hasOwnProperty
console.log("\nObject.hasOwn() (ES2022):");
const obj = { key: "value" };
console.log("Object.hasOwn(obj, 'key'):", Object.hasOwn(obj, "key")); // true
console.log("Object.hasOwn(obj, 'toString'):", Object.hasOwn(obj, "toString")); // false
// Safer than obj.hasOwnProperty() which can be overridden
// Also works on objects created with Object.create(null)

// Hashbang Grammar (ES2023) - Standardized shebang support
// #!/usr/bin/env node
// This line is now officially recognized by the ECMAScript spec
// It can appear at the very start of a JS file for CLI scripts
console.log("\nHashbang Grammar (ES2023):");
console.log("ES2023 standardized the hashbang (#!) grammar for CLI scripts");
console.log("Example: #!/usr/bin/env node at the top of a .js file");

// ============================================
// 19. LOGICAL ASSIGNMENT OPERATORS (ES2021)
// ============================================

// &&= (and-assignment), ||= (or-assignment), ??= (nullish-assignment)
console.log("\nLogical assignment operators:");
let a = 5;
a &&= 10; // a = a && 10 → 10 (both truthy)
console.log("a &&= 10:", a);

let b = 0;
b &&= 10; // b = b && 10 → 0 (falsy, no change)
console.log("b &&= 10:", b);

let c = null;
c ??= "default"; // c = c ?? "default" → "default"
console.log("c ??= 'default':", c);

let d = "value";
d ??= "default"; // d = d ?? "default" → "value" (already set)
console.log("d ??= 'default':", d);

// ============================================
// 20. PROMISE METHODS
// ============================================

// Promise.prototype.finally() - Clean up after promise (ES2018/ES9)
// Note: Already covered in earlier sections, here as quick reference
console.log("\nPromise.finally():");

function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data fetched"), 100);
  });
}

fetchData()
  .then(result => console.log("  Result:", result))
  .catch(error => console.log("  Error:", error))
  .finally(() => console.log("  Cleanup - always runs"));

// Promise.any() - First fulfilled promise (ES2021)
console.log("\nPromise.any() - First success:");
async function demoPromiseAny() {
  try {
    const result = await Promise.any([
      Promise.reject(new Error("Source 1 failed")),
      Promise.resolve("Data from Source 2"),
      Promise.resolve("Data from Source 3"),
    ]);
    console.log("  First success:", result);
  } catch (error) {
    console.log("  All failed");
  }
}
demoPromiseAny().catch(() => {});

// ============================================
// 21. MODERN FEATURES SUMMARY
// ============================================
console.log("\n=== Modern JavaScript Features Summary ===");
console.log(`
Key modern features (ES2020-ES2023):
- Optional chaining (?.) - Safe property access
- Nullish coalescing (??) - Fallback for null/undefined
- Array.from() / of() - New array creation
- Object.fromEntries() - Convert entries to object
- String.replaceAll() - Replace all occurrences
- Array.at() - Negative index access
- Logical assignment (&&=, ||=, ??=) - Short-circuit assignment
- Promise.finally() - Clean up after promise
- Promise.any() - First fulfilled promise
- TypedArray methods - copyWithin(), at(), etc.
`);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. ACCESS MODIFIERS
   JS:  Only # for private fields (ES2022)
   TS:  public, private, protected, readonly modifiers

2. ABSTRACT CLASSES
   JS:  Pattern with new.target check and throwing errors
   TS:  Built-in abstract keyword for classes and methods

3. INTERFACES
   JS:  No interface concept (use duck typing)
   TS:  Interface keyword for type contracts

4. METHOD SIGNATURES
   JS:  No type annotations
   TS:  Full type annotations for parameters and return types
*/

/*
 * verification:
 *   feature: Decorators
 *   status: Stage 2.7
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/README.md
 */

// ══════════════════════════════════════════
// ⚠️ PROPOSAL SECTION — not current standard, syntax may change
// ══════════════════════════════════════════

// 5. DECORATORS (Stage 2.7 proposal - not current standard, see 50-reserved.js)
//    JS:  Stage 2.7 proposal (nearing Stage 3, not yet finalized)
//    TS:  Stage 2.7 decorators supported in TS 5.0+ (experimentalDecorators: false)
//
// ⚠️ COMMON CONFUSION POINTS:
// - TypeScript's private is compile-time only; JS # is runtime
// - TypeScript abstract classes cannot be instantiated; JS needs pattern
// - TypeScript interfaces have no runtime representation
// - Class field initialization order matters in both languages
//
// 📘 See 18-es6-plus-syntax-ts-comparison.ts for detailed examples!
// ══════════════════════════════════════════

// ============================================
// 22. ADDITIONAL ES2020-ES2024 FEATURES
// ============================================

// This section consolidates additional modern features not covered above.
// Each feature gets a short 2-4 line demo. Cross-references point to the
// demo file that covers the topic in depth.

console.log("\n=== Additional ES2020-ES2024 Features ===");

// 22.1 Promise.allSettled (ES2020)
// - Waits for all promises to settle (never rejects)
// - Each result is { status, value/reason }
console.log("\nPromise.allSettled (ES2020):");
Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("x"))]).then(results =>
  console.log(
    "  Settled results:",
    results.map(r => r.status)
  )
);
// 📘 See demo/04-asynchronous/30-promises.js for full coverage of Promise combinators

// 22.2 String.prototype.matchAll (ES2020)
// - Returns an iterator of all matches (including capture groups)
// - Requires the global (g) flag
console.log("\nString.matchAll (ES2020):");
const matchAllRe = /(\w)(\d)/g;
const matchAllInput = "a1 b2 c3";
const allMatches = [...matchAllInput.matchAll(matchAllRe)];
console.log(
  "  Matches:",
  allMatches.map(m => m[0])
); // ['a1', 'b2', 'c3']

// 22.3 globalThis (ES2020)
// - Universal top-level this that works across browsers, Node.js, workers
console.log("\nglobalThis (ES2020):");
console.log("  globalThis === globalThis:", globalThis === globalThis); // true
// Same object regardless of environment (window in browsers, global in Node)

// 22.4 Error.cause (ES2022)
// - Pass an underlying cause when wrapping/throwing errors
// - Useful for error chaining without losing the original stack
/*
 * verification:
 *   feature: Error.cause
 *   status: ES2022
 *   stage4Date: 2021-10
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nError.cause (ES2022):");
function loadConfig() {
  try {
    throw new Error("File not found");
  } catch (err) {
    throw new Error("Config load failed", { cause: err });
  }
}
try {
  loadConfig();
} catch (e) {
  console.log("  Top error:", e.message, "| cause:", e.cause.message);
}

// 22.5 Class static block (ES2022)
// - static { ... } runs once during class evaluation
// - Useful for complex static initialization that needs its own scope
/*
 * verification:
 *   feature: Class Static Block
 *   status: ES2022
 *   stage4Date: 2021-08
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nClass static block (ES2022):");
class ConfigLoader {
  static settings = {};
  static {
    // Runs once during class evaluation; private scope for setup logic
    ConfigLoader.settings.version = "1.0";
    ConfigLoader.settings.loadedAt = Date.now();
  }
}
console.log("  ConfigLoader.settings:", ConfigLoader.settings);
// 📘 See demo/03-core-concepts/16-classes.js for in-depth class features

// 22.6 Top-level await (ES2022)
// - Allows `await` at the top level of an ES Module
// - This file is NOT an ESM (it uses CommonJS-style top-level code), so the
//   syntax below is commented out. It works in .mjs files or with "type":"module".
/*
 * verification:
 *   feature: Top-level await
 *   status: ES2022
 *   stage4Date: 2021-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nTop-level await (ES2022):");
console.log("  // In an ES Module (.mjs or type:module) you can write:");
console.log("  // const data = await fetch('https://api.example.com').then(r => r.json());");
console.log("  // No async IIFE wrapper needed at module top level");

// 22.7 WeakRef / FinalizationRegistry (ES2021)
// - WeakRef: hold a weak reference to an object (doesn't prevent GC)
// - FinalizationRegistry: callback when an object is garbage collected
/*
 * verification:
 *   feature: WeakRef
 *   status: ES2021
 *   stage4Date: 2020-07
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nWeakRef / FinalizationRegistry (ES2021):");
let weakTarget = { data: "cache-me" };
const weakRef = new WeakRef(weakTarget);
console.log("  WeakRef.deref():", weakRef.deref()); // { data: 'cache-me' }
weakTarget = null; // strong reference dropped; eligible for GC
// FinalizationRegistry callbacks are non-deterministic — don't rely on timing.
// 📘 See demo/03-core-concepts/27-memory-management.js for full coverage

// 22.8 Object.groupBy / Map.groupBy (ES2024)
// - Group iterable elements by a key function
// - Object.groupBy returns a plain object (null-prototype); Map.groupBy returns a Map
/*
 * verification:
 *   feature: Object.groupBy
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nObject.groupBy / Map.groupBy (ES2024):");
const inventory = [
  { name: "apple", type: "fruit" },
  { name: "carrot", type: "veg" },
  { name: "banana", type: "fruit" },
];
const grouped = Object.groupBy(inventory, item => item.type);
console.log("  Object.groupBy:", Object.keys(grouped)); // ['fruit', 'veg']
const groupedMap = Map.groupBy(inventory, item => item.type);
console.log("  Map.groupBy keys:", [...groupedMap.keys()]); // ['fruit', 'veg']

// 22.9 Promise.withResolvers (ES2024)
// - Returns { promise, resolve, reject } without a manual constructor
// - Cleaner than the `let resolve; new Promise(r => resolve = r)` pattern
/*
 * verification:
 *   feature: Promise.withResolvers
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nPromise.withResolvers (ES2024):");
const { promise: p, resolve: res } = Promise.withResolvers();
p.then(v => console.log("  withResolvers resolved:", v));
res("done");
// 📘 See demo/04-asynchronous/30-promises.js for full coverage

// 22.10 RegExp v flag (ES2024)
// - Unicode set operations in character classes (union, intersection, subtraction)
// - Syntax: [\p{Letter}&&\p{ASCII}] (intersection), [\p{ASCII}--\p{Decimal_Number}] (subtraction)
/*
 * verification:
 *   feature: RegExp v flag
 *   status: ES2024
 *   stage4Date: 2023-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nRegExp v flag (ES2024):");
try {
  // ASCII letters excluding decimal numbers (set subtraction)
  const vRe = /[\p{ASCII}&&\p{Letter}]/v;
  console.log("  /[\p{ASCII}&&\p{Letter}]/v.test('A'):", vRe.test("A")); // true
} catch (err) {
  console.log("  v flag not supported in this runtime:", err.message);
}
// 📘 See demo/03-core-concepts/21-regex.js for in-depth regex coverage

// 22.11 Symbol as WeakMap keys (ES2023)
// - Symbols (not just objects) may now be used as WeakMap/WeakSet/WeakRef keys
// - Useful for keyed caches/metadata without an object identity
/*
 * verification:
 *   feature: Symbols as WeakMap keys
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nSymbol as WeakMap keys (ES2023):");
const symWm = new WeakMap();
const symKey = Symbol("metadata");
symWm.set(symKey, "symbol-keyed value");
console.log("  WeakMap.get(symbolKey):", symWm.get(symKey)); // 'symbol-keyed value'

// ============================================
// CROSS-REFERENCES
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 09-destructuring.js - Destructuring assignment");
console.log("📘 16-classes.js - Classes");
console.log("📘 32-modules.js - ES Modules");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 18-es6-plus-syntax-ts-comparison.ts
*/
