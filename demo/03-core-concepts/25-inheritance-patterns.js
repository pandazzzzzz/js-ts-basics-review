// Inheritance Patterns - Advanced Demo
// 📘 For TypeScript comparison, see: 25-inheritance-patterns-ts-comparison.ts
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces alternative ways to organize behavior without relying only on inheritance.
// The examples compare composition and other structural patterns that often appear in real-world JavaScript code.

// ============================================
// Table of Contents
// ============================================

// 1. COMPOSITION OVER INHERITANCE
// 2. FUNCTIONAL MIXINS
// 3. PARASITIC COMPOSITION
// 4. STRATEGY PATTERN
// 5. OBSERVER PATTERN
// 6. TEMPLATE METHOD PATTERN
// 7. VISITOR PATTERN
// 8. TRAITS PATTERN

// ============================================

// ============================================
// 1. COMPOSITION OVER INHERITANCE
// ============================================
/**
 * Composition Over Inheritance - Building objects by combining components (ES6)
 *
 * Characteristics:
 * - "has-a" relationships instead of "is-a"
 * - Objects composed of smaller, focused components
 * - More flexible than class inheritance
 * - Avoids deep inheritance hierarchies
 *
 * Use Cases:
 * - Building complex objects from simple parts
 * - Code reuse through mixins/traits
 * - Dynamic behavior composition
 * - Avoiding "class explosion"
 *
 * Common Pitfalls:
 * - Can create too many small objects
 * - Object graph complexity
 * - Memory overhead with many small components
 */

console.log("\n=== 1. Composition Over Inheritance Demo ===");

// 1.1 Bad: Deep inheritance hierarchy
console.log("\nBad: Deep inheritance (hard to maintain):");
console.log("  Animal → Mammal → Primate → Human → Developer");
console.log("  Can lead to 'class explosion' and fragile base class problem");

// 1.2 Good: Composition with mixins
function canEat(obj) {
  return {
    eat: () => console.log(`${obj.name} is eating`),
  };
}

function canSwim(obj) {
  return {
    swim: () => console.log(`${obj.name} is swimming`),
  };
}

function canFly(obj) {
  return {
    fly: () => console.log(`${obj.name} is flying`),
  };
}

function createDuck(name) {
  const duck = { name };
  return {
    ...duck,
    ...canEat(duck),
    ...canSwim(duck),
    ...canFly(duck),
  };
}

function createFish(name) {
  const fish = { name };
  return {
    ...fish,
    ...canEat(fish),
    ...canSwim(fish),
  };
}

const duck = createDuck("Duck");
const fish = createFish("Fish");

console.log("\nGood: Composition with mixins");
duck.eat();
duck.swim();
duck.fly();
fish.eat();
fish.swim();

// 1.3 Component composition
class Engine {
  constructor(horsepower) {
    this.horsepower = horsepower;
  }
  start() {
    console.log(`Engine with ${this.horsepower}HP started`);
  }
}

class Wheels {
  constructor(count) {
    this.count = count;
  }
  rotate() {
    console.log(`${this.count} wheels rotating`);
  }
}

class Car {
  constructor(name, engine, wheels) {
    this.name = name;
    this.engine = engine;
    this.wheels = wheels;
  }

  start() {
    console.log(`Starting ${this.name}...`);
    this.engine.start();
    this.wheels.rotate();
  }
}

const v8Engine = new Engine(450);
const fourWheels = new Wheels(4);
const sportsCar = new Car("Sports Car", v8Engine, fourWheels);

console.log("\nComponent composition:");
sportsCar.start();

// 1.4 Dependency injection composition
class Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
}

class Database {
  constructor(logger) {
    this.logger = logger;
  }
  query(sql) {
    this.logger.log(`Executing: ${sql}`);
    return { results: [] };
  }
}

const logger = new Logger();
const db = new Database(logger);

console.log("\nDependency injection:");
db.query("SELECT * FROM users");

// ============================================
// 2. FUNCTIONAL MIXINS
// ============================================
/**
 * Functional Mixins - Reusable functions that add behavior to objects (ES6)
 *
 * Characteristics:
 * - Pure functions that modify object prototypes
 * - Can be composed together
 * - No constructor chain issues
 * - More flexible than class inheritance
 *
 * Use Cases:
 * - Reusable behavior across unrelated classes
 * - Dynamic behavior modification
 * - Feature toggling
 * - Plugin systems
 *
 * Common Pitfalls:
 * - Can cause method collisions
 * - State management complexity
 * - Hard to debug mixed-in behavior
 */

console.log("\n=== 2. Functional Mixins Demo ===");

// 2.1 Basic mixin function
const Loggable = superclass =>
  class extends superclass {
    log(message) {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };

const Serializable = superclass =>
  class extends superclass {
    toJSON() {
      return JSON.stringify(this);
    }

    static fromJSON(json) {
      return Object.assign(new this(), JSON.parse(json));
    }
  };

class User {
  constructor(name) {
    this.name = name;
  }
}

class LoggableUser extends Loggable(User) {}
class LoggableSerializableUser extends Serializable(Loggable(User)) {}

console.log("Basic mixins:");
const logUser = new LoggableUser("Alice");
logUser.log("Hello from loggable user");

// 2.2 Mixin with state
const Timestampable = superclass =>
  class extends superclass {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }

    touch() {
      this.updatedAt = new Date();
    }
  };

class Document {
  constructor(content) {
    this.content = content;
  }
}

class TimestampedDocument extends Timestampable(Document) {}

console.log("\nMixin with state:");
const doc = new TimestampedDocument("Hello world");
console.log("Created at:", doc.createdAt);

// 2.3 Composable mixins with pipe
function mix(...mixins) {
  return superclass => mixins.reduce((cls, mixin) => mixin(cls), superclass);
}

const FullFeaturedUser = mix(Loggable, Serializable, Timestampable)(User);

console.log("\nComposed mixins:");
const fullUser = new FullFeaturedUser("Bob");
fullUser.log("Composed mixins work!");
console.log("Created at:", fullUser.createdAt);

// 2.4 Mixin collision detection
// When multiple mixins define methods with the same name,
// later mixins silently override earlier ones. Collision detection
// warns about name conflicts to prevent subtle bugs.
function mixWithCollisionDetection(...mixins) {
  return superclass => {
    const seen = new Map(); // methodName -> mixinName

    for (const mixin of mixins) {
      const mixinName = mixin.name || "anonymous";
      const proto = mixin(class {}).prototype;

      for (const name of Object.getOwnPropertyNames(proto)) {
        if (name === "constructor") continue;
        if (seen.has(name)) {
          console.warn(
            `Mixin collision: "${name}" defined by both ` +
              `${seen.get(name)} and ${mixinName}. ` +
              `${mixinName} will take precedence.`
          );
        } else {
          seen.set(name, mixinName);
        }
      }
    }

    return mixins.reduce((cls, m) => m(cls), superclass);
  };
}

// Example: two mixins both define a "serialize" method
const JSONSerializable = superclass =>
  class extends superclass {
    serialize() {
      return JSON.stringify({ ...this });
    }
  };

const FormSerializable = superclass =>
  class extends superclass {
    serialize() {
      return new URLSearchParams({ ...this }).toString();
    }
  };

console.log("\nMixin collision detection:");
console.log("Creating class with two mixins that both define 'serialize'...");
const CollidingUser = mixWithCollisionDetection(Loggable, JSONSerializable, FormSerializable)(User);
console.log("(Warning message above shows the collision)");

const collisionUser = new CollidingUser("Test");
console.log("serialize() result (last mixin wins):", collisionUser.serialize());

// 2.5 Conditional mixins
function withFeature(featureEnabled) {
  return featureEnabled
    ? superclass =>
        class extends superclass {
          feature() {
            console.log("Feature enabled");
          }
        }
    : superclass => superclass;
}

const MaybeWithFeature = withFeature(true)(User);
const maybeUser = new MaybeWithFeature("Test");

console.log("\nConditional mixin:");
if (maybeUser.feature) {
  maybeUser.feature();
}

// ============================================
// 3. PARASITIC COMPOSITION
// ============================================
/**
 * Parasitic Composition - Building objects by enhancing others (ES6)
 *
 * Characteristics:
 * - Create object, then augment it
 * - Similar to factory patterns
 * - Combines inheritance and composition
 * - Good for adding behavior to existing objects
 *
 * Use Cases:
 * - Enhancing existing objects
 * - Decorator pattern
 * - Dynamic feature addition
 * - Wrapping third-party objects
 *
 * Common Pitfalls:
 * - Can obscure object origin
 * - Harder to type check
 * - May copy more than intended
 */

console.log("\n=== 3. Parasitic Composition Demo ===");

// 3.1 Basic parasitic enhancement
function createPerson(name) {
  return { name };
}

function createEmployee(name, title) {
  const person = createPerson(name);
  person.title = title;
  person.getTitle = () => person.title;
  return person;
}

const emp = createEmployee("Alice", "Engineer");
console.log("Basic parasitic composition:");
console.log("Employee:", emp.name, emp.getTitle());

// 3.2 Parasitic inheritance
function inheritPrototype(subType, superType) {
  const prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function Animal2(name) {
  this.name = name;
}

Animal2.prototype.eat = function () {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal2.call(this, name);
  this.breed = breed;
}

inheritPrototype(Dog, Animal2);

Dog.prototype.bark = function () {
  console.log(`${this.name} says woof!`);
};

const dog = new Dog("Buddy", "Golden Retriever");
console.log("\nParasitic inheritance:");
dog.eat();
dog.bark();

// 3.3 Factory with parasitic composition
function withLogging(obj) {
  const logger = {
    log: msg => console.log(`[${obj.name || "unknown"}] ${msg}`),
  };
  return { ...obj, ...logger };
}

function withCaching(obj, cacheKey) {
  const cache = new Map();
  return {
    ...obj,
    getCache: key => cache.get(key),
    setCache: (key, value) => cache.set(key, value),
  };
}

const baseService = { name: "UserService", fetch: () => ({ id: 1 }) };
const enhancedService = withCaching(withLogging(baseService), "users");

console.log("\nFactory composition:");
enhancedService.log("Fetching user");
enhancedService.setCache("user:1", { id: 1, name: "Bob" });
console.log("Cached value:", enhancedService.getCache("user:1"));

// ============================================
// 4. STRATEGY PATTERN
// ============================================
/**
 * Strategy Pattern - Encapsulating interchangeable algorithms (ES6)
 *
 * Characteristics:
 * - Family of algorithms encapsulated
 * - Interchangeable at runtime
 * - Eliminates conditional logic
 * - Open/Closed principle compliant
 *
 * Use Cases:
 * - Payment processing
 * - Sorting algorithms
 * - Validation rules
 * - Pricing strategies
 *
 * Common Pitfalls:
 * - Can increase object count
 * - Overkill for simple cases
 * - Context/strategy communication
 */

console.log("\n=== 4. Strategy Pattern Demo ===");

// 4.1 Payment strategies
class PaymentStrategy {
  pay(amount) {
    throw new Error("Implement pay method");
  }
}

class CreditCardStrategy extends PaymentStrategy {
  constructor(cardNumber) {
    super();
    this.cardNumber = cardNumber;
  }
  pay(amount) {
    console.log(`Paid $${amount} with credit card ending in ${this.cardNumber.slice(-4)}`);
    return { success: true, method: "credit_card" };
  }
}

class PayPalStrategy extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }
  pay(amount) {
    console.log(`Paid $${amount} with PayPal: ${this.email}`);
    return { success: true, method: "paypal" };
  }
}

class BitcoinStrategy extends PaymentStrategy {
  constructor(walletAddress) {
    super();
    this.walletAddress = walletAddress;
  }
  pay(amount) {
    console.log(`Paid $${amount} in Bitcoin to ${this.walletAddress}`);
    return { success: true, method: "bitcoin" };
  }
}

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount) {
    return this.strategy.pay(amount);
  }
}

console.log("Payment strategies:");
const processor = new PaymentProcessor(new CreditCardStrategy("4111-1111-1111-1111"));
processor.processPayment(100);

processor.setStrategy(new PayPalStrategy("user@example.com"));
processor.processPayment(50);

processor.setStrategy(new BitcoinStrategy("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"));
processor.processPayment(200);

// 4.2 Sorting strategies
class SortStrategy {
  sort(arr) {
    throw new Error("Implement sort");
  }
}

class BubbleSort extends SortStrategy {
  sort(arr) {
    console.log("Using bubble sort");
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }
}

class QuickSort extends SortStrategy {
  sort(arr) {
    console.log("Using quick sort");
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter(x => x <= pivot);
    const right = arr.slice(1).filter(x => x > pivot);
    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }
  sort(arr) {
    return this.strategy.sort(arr);
  }
}

console.log("\nSort strategies:");
const smallSorter = new Sorter(new BubbleSort());
console.log(smallSorter.sort([3, 1, 4, 1, 5]));

const largeSorter = new Sorter(new QuickSort());
console.log(largeSorter.sort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]));

// ============================================
// 5. OBSERVER PATTERN
// ============================================
/**
 * Observer Pattern - One-to-many dependency (ES6)
 *
 * Characteristics:
 * - Subject maintains list of observers
 * - Notifies observers on state change
 * - Loose coupling between components
 * - Supports dynamic subscription
 *
 * Use Cases:
 * - Event handling systems
 * - UI updates from state changes
 * - Message broadcasting
 * - Stock price updates
 *
 * Common Pitfalls:
 * - Memory leaks if not unsubscribed
 * - Unexpected notification order
 * - Performance with many observers
 */

console.log("\n=== 5. Observer Pattern Demo ===");

// 5.1 Subject and Observer
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log("Observer received:", data);
  }
}

class NewsPublisher extends Subject {
  publishNews(news) {
    console.log(`\nPublishing news: ${news}`);
    this.notify(news);
  }
}

class NewsSubscriber {
  constructor(name) {
    this.name = name;
  }
  update(news) {
    console.log(`${this.name} received news: ${news}`);
  }
}

const publisher = new NewsPublisher();
const sub1 = new NewsSubscriber("Alice");
const sub2 = new NewsSubscriber("Bob");

publisher.subscribe(sub1);
publisher.subscribe(sub2);

publisher.publishNews("JavaScript 2024 released!");

// 5.2 Event emitter style
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }

  emit(event, ...data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...data));
    }
  }

  once(event, listener) {
    const onceWrapper = (...data) => {
      listener(...data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}

const emitter = new EventEmitter();
emitter.on("click", (x, y) => console.log(`Click at (${x}, ${y})`));
emitter.once("init", () => console.log("Initialized once"));

console.log("\nEvent emitter:");
emitter.emit("click", 100, 200);
emitter.emit("init");
emitter.emit("init"); // Doesn't log

// 5.3 Reactive style
class ReactiveValue {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = [];
  }

  get() {
    return this.value;
  }

  set(newValue) {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.value); // Initial call
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.value));
  }
}

console.log("\nReactive value:");
const counter = new ReactiveValue(0);
const unsubscribe = counter.subscribe(val => console.log("Counter:", val));
counter.set(1);
counter.set(2);
unsubscribe();
counter.set(3); // No output

// ============================================
// 6. TEMPLATE METHOD PATTERN
// ============================================
/**
 * Template Method Pattern - Skeleton algorithm in superclass (ES6)
 *
 * Characteristics:
 * - Defines algorithm skeleton
 * - Subclasses override steps
 * - Inversion of control
 * - Enforces consistent structure
 *
 * Use Cases:
 * - Report generation
 * - Data processing pipelines
 * - Game AI
 * - Test frameworks
 *
 * Common Pitfalls:
 * - Can be rigid
 * - Overriding too many steps
 * - Complexity with many hooks
 */

console.log("\n=== 6. Template Method Pattern Demo ===");

// 6.1 Data processor template
class DataProcessor {
  // Template method - defines algorithm skeleton
  process(data) {
    const validated = this.validate(data);
    const transformed = this.transform(validated);
    const saved = this.save(transformed);
    this.notify(saved);
    return saved;
  }

  // These methods can/must be overridden
  validate(data) {
    return data; // Default: no validation
  }

  transform(data) {
    return data; // Default: no transformation
  }

  save(data) {
    throw new Error("Implement save method");
  }

  notify(data) {
    console.log("Processing complete:", data);
  }
}

class CSVProcessor extends DataProcessor {
  validate(data) {
    if (!data.includes(",")) {
      throw new Error("CSV data must contain commas");
    }
    return data;
  }

  transform(data) {
    return data.split(",").map(row => row.trim());
  }

  save(data) {
    console.log("Saving CSV rows to database");
    return { type: "csv", rows: data };
  }
}

class JSONProcessor extends DataProcessor {
  validate(data) {
    JSON.parse(data); // Will throw if invalid
    return data;
  }

  transform(data) {
    return JSON.parse(data);
  }

  save(data) {
    console.log("Saving JSON object to database");
    return { type: "json", data };
  }

  notify(data) {
    console.log(`JSON with ${Object.keys(data.data).length} keys saved`);
  }
}

console.log("Template method:");
const csvProcessor = new CSVProcessor();
try {
  csvProcessor.process("a,b,c,d");
} catch (e) {
  console.log(e.message);
}

const jsonProcessor = new JSONProcessor();
jsonProcessor.process('{"name": "Test", "value": 42}');

// 6.2 Game AI template
class GameAI {
  // Template method
  takeTurn() {
    this.collectResources();
    this.buildStructures();
    this.buildUnits();
    this.attack();
  }

  collectResources() {
    console.log("Collecting default resources");
  }

  buildStructures() {
    // Optional hook
  }

  buildUnits() {
    // Optional hook
  }

  attack() {
    throw new Error("Implement attack strategy");
  }
}

class OrcAI extends GameAI {
  collectResources() {
    console.log("Orcs collect gold and lumber");
  }

  buildStructures() {
    console.log("Orcs build barracks and war mill");
  }

  attack() {
    console.log("Orcs charge with brute force!");
  }
}

class ElfAI extends GameAI {
  collectResources() {
    console.log("Elves collect magic and lumber");
  }

  buildUnits() {
    console.log("Elves train archers and mages");
  }

  attack() {
    console.log("Elves attack from range with precision!");
  }
}

console.log("\nGame AI:");
const orc = new OrcAI();
orc.takeTurn();

console.log();
const elf = new ElfAI();
elf.takeTurn();

// ============================================
// 7. VISITOR PATTERN
// ============================================
/**
 * Visitor Pattern - Operations on objects without modifying classes (ES6)
 *
 * Characteristics:
 * - Separates algorithm from object structure
 * - Open/Closed principle
 * - Double dispatch
 * - Easy to add new operations
 *
 * Use Cases:
 * - AST traversal and transformation
 * - Report generation
 * - Serialization
 * - Type checking
 *
 * Common Pitfalls:
 * - Hard to add new element types
 * - Can become complex
 * - Violates encapsulation
 */

console.log("\n=== 7. Visitor Pattern Demo ===");

// 7.1 File system visitor
class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }

  accept(visitor) {
    visitor.visitFile(this);
  }
}

class Directory {
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
  }

  accept(visitor) {
    visitor.visitDirectory(this);
  }
}

class FileSystemVisitor {
  visitFile(file) {
    throw new Error("Implement visitFile");
  }

  visitDirectory(directory) {
    throw new Error("Implement visitDirectory");
  }
}

class SizeCalculator extends FileSystemVisitor {
  constructor() {
    super();
    this.totalSize = 0;
  }

  visitFile(file) {
    this.totalSize += file.size;
  }

  visitDirectory(directory) {
    directory.children.forEach(child => child.accept(this));
  }
}

class FileLister extends FileSystemVisitor {
  constructor() {
    super();
    this.files = [];
  }

  visitFile(file) {
    this.files.push(file.name);
  }

  visitDirectory(directory) {
    directory.children.forEach(child => child.accept(this));
  }
}

const root = new Directory("root", [
  new File("file1.txt", 100),
  new File("file2.txt", 200),
  new Directory("subdir", [new File("file3.txt", 300)]),
]);

const sizeCalc = new SizeCalculator();
root.accept(sizeCalc);

const fileLister = new FileLister();
root.accept(fileLister);

console.log("File system visitor:");
console.log("Total size:", sizeCalc.totalSize, "bytes");
console.log("Files:", fileLister.files);

// 7.2 Expression evaluator
class NumberNode {
  constructor(value) {
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitNumber(this);
  }
}

class AddNode {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitAdd(this);
  }
}

class MultiplyNode {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitMultiply(this);
  }
}

class Evaluator {
  visitNumber(node) {
    return node.value;
  }

  visitAdd(node) {
    return node.left.accept(this) + node.right.accept(this);
  }

  visitMultiply(node) {
    return node.left.accept(this) * node.right.accept(this);
  }
}

class Printer {
  visitNumber(node) {
    return String(node.value);
  }

  visitAdd(node) {
    return `(${node.left.accept(this)} + ${node.right.accept(this)})`;
  }

  visitMultiply(node) {
    return `(${node.left.accept(this)} * ${node.right.accept(this)})`;
  }
}

// (2 + 3) * 4
const expression = new MultiplyNode(
  new AddNode(new NumberNode(2), new NumberNode(3)),
  new NumberNode(4)
);

const evaluator = new Evaluator();
const printer = new Printer();

console.log("\nExpression evaluator:");
console.log("Expression:", printer.visitMultiply(expression));
console.log("Result:", evaluator.visitMultiply(expression));

// ============================================
// 8. TRAITS PATTERN
// ============================================
/**
 * Traits - Composable units of behavior (ES6)
 *
 * Characteristics:
 * - Fine-grained reusable behavior
 * - Explicit composition
 * - Conflict resolution required
 * - Stateless by convention
 *
 * Use Cases:
 * - Cross-cutting concerns
 * - Shared behavior without inheritance
 * - Mixin with conflict resolution
 *
 * Common Pitfalls:
 * - Conflict handling complexity
 * - State management in traits
 * - Overusing traits
 */

console.log("\n=== 8. Traits Pattern Demo ===");

// 8.1 Basic traits
const TEquality = {
  equals(other) {
    return this === other;
  },
};

const TSerializable = {
  serialize() {
    return JSON.stringify(this);
  },
  static: {
    deserialize(json) {
      return Object.assign(new this(), JSON.parse(json));
    },
  },
};

const TLoggable = {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  },
};

// 8.2 Trait composer with conflict resolution
function composeTraits(...traits) {
  const composed = {};
  const conflicts = new Map();

  traits.forEach(trait => {
    Object.keys(trait).forEach(key => {
      if (composed[key] && composed[key] !== trait[key]) {
        conflicts.set(key, (conflicts.get(key) || 0) + 1);
      }
      composed[key] = trait[key];
    });
  });

  if (conflicts.size > 0) {
    console.warn("Trait conflicts:", Array.from(conflicts.keys()));
  }

  return composed;
}

function applyTraits(cls, ...traits) {
  const composed = composeTraits(...traits);
  Object.assign(cls.prototype, composed);
  return cls;
}

class Entity {
  constructor(id) {
    this.id = id;
  }
}

applyTraits(Entity, TEquality, TLoggable, TSerializable);

const entity = new Entity(123);
console.log("Traits applied:");
entity.log("Entity created");
console.log("Serialized:", entity.serialize());
console.log("Equals self:", entity.equals(entity));

// ============================================
// BEST PRACTICES
// ============================================
/**
 * Inheritance Patterns Best Practices
 *
 * 1. PREFER COMPOSITION OVER INHERITANCE
 *    - More flexible and maintainable
 *    - Avoids fragile base class problem
 *    - Easier to test in isolation
 *
 * 2. USE STRATEGY FOR ALGORITHMS
 *    - When multiple implementations exist
 *    - For runtime switching of behavior
 *    - To eliminate conditional logic
 *
 * 3. OBSERVER FOR EVENT BROADCAST
 *    - One-to-many relationships
 *    - Loose coupling between components
 *    - Remember to unsubscribe!
 *
 * 4. TEMPLATE FOR ALGORITHM SKELETONS
 *    - Fixed steps with varying implementations
 *    - Enforce consistent structure
 *    - Clear extension points
 *
 * 5. MIXINS/TRAITS FOR REUSE
 *    - Cross-cutting concerns
 *    - Avoid deep inheritance trees
 *    - Handle conflicts explicitly
 */

console.log("\n=== Inheritance Patterns Best Practices Demo ===");

// Good: Composition
class UserService {
  constructor(logger, db) {
    this.logger = logger;
    this.db = db;
  }

  createUser(data) {
    this.logger.log("Creating user");
    return this.db.insert("users", data);
  }
}

// Good: Strategy for validation
const ValidatorStrategy = {
  email: value => value.includes("@"),
  phone: value => /^\d{10}$/.test(value),
  required: value => value && value.length > 0,
};

class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(data) {
    const errors = {};
    for (const [field, rules] of Object.entries(this.rules)) {
      for (const rule of rules) {
        if (!ValidatorStrategy[rule](data[field])) {
          errors[field] = errors[field] || [];
          errors[field].push(`${field} failed ${rule} validation`);
        }
      }
    }
    return Object.keys(errors).length ? errors : null;
  }
}

console.log("Good patterns:");
const validator = new Validator({
  email: ["required", "email"],
  phone: ["phone"],
});

const result = validator.validate({
  email: "test@example.com",
  phone: "1234567890",
});

console.log("Validation result:", result);

// ============================================
// COMMON PITFALLS
// ============================================
console.log("\n=== Inheritance Patterns Common Pitfalls Demo ===");

// Pitfall 1: Deep inheritance hierarchy
console.log("\nPitfall 1 - Deep inheritance:");
console.log("Avoid: class Animal → Mammal → Primate → Human → Developer");
console.log("Prefer: Composition of behaviors");

// Pitfall 2: Forgetting to unsubscribe observers
console.log("\nPitfall 2 - Memory leaks with observers:");
console.log("Always unsubscribe when done with observers");

// Pitfall 3: Ignoring trait conflicts
console.log("\nPitfall 3 - Trait conflicts:");
console.log("Always handle method name conflicts explicitly");

// Pitfall 4: Over-engineering with patterns
console.log("\nPitfall 4 - Over-engineering:");
console.log("Use patterns when they solve actual problems, not for 'elegance'");

// ============================================
// SUMMARY
// ============================================
/**
 * Inheritance Patterns Summary
 *
 * Key Concepts:
 * 1. Composition over inheritance for flexibility
 * 2. Strategy: interchangeable algorithms
 * 3. Observer: one-to-many event broadcasting
 * 4. Template Method: algorithm skeletons
 * 5. Visitor: operations on object structures
 * 6. Mixins/Traits: composable behavior
 *
 * When to Use:
 * - Need flexible object composition
 * - Multiple algorithm implementations
 * - Event-driven systems
 * - Reusable cross-cutting concerns
 *
 * When to Avoid:
 * - Simple one-off cases
 * - Performance-critical code
 * - When KISS principle applies
 */

console.log("\n=== Inheritance Patterns Advanced Demo Complete ===");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. INTERFACES FOR COMPOSITION
   TS:  interface Flyable { fly(): void }
   TS:  class Bird implements Flyable { ... }

   TypeScript example:
   interface Loggable {
     log(message: string): void;
   }

   class UserService implements Loggable {
     log(message: string): void {
       console.log(message);
     }
   }

2. MIXINS WITH TYPE SAFETY
   TS:  type Constructor<T = {}> = new (...args: any[]) => T;
   TS:  function Loggable<T extends Constructor>(Base: T) { ... }

   TypeScript example:
   type Constructor<T = {}> = new (...args: any[]) => T;

   function Loggable<T extends Constructor>(Base: T) {
     return class extends Base {
       log(message: string) {
         console.log(message);
       }
     };
   }

3. STRATEGY WITH GENERICS
   TS:  interface Strategy<T> { execute(data: T): T }

   TypeScript example:
   interface PaymentStrategy {
     pay(amount: number): PaymentResult;
   }

   class CreditCardStrategy implements PaymentStrategy {
     pay(amount: number): PaymentResult {
       return { success: true, method: 'credit_card' };
     }
   }

4. OBSERVER WITH TYPES
   TS:  interface Observer<T> { update(data: T): void }

   TypeScript example:
   interface Observer<T> {
     update(data: T): void;
   }

   class Subject<T> {
     private observers: Observer<T>[] = [];
     subscribe(observer: Observer<T>) { ... }
     notify(data: T) { ... }
   }

5. DECORATORS (EXPERIMENTAL)
   TS:  @loggable class MyClass { ... }

   TypeScript example:
   function loggable(target: Function) {
     console.log(`Class ${target.name} created`);
   }

   @loggable
   class User { ... }

📘 See related files:
- 15-prototypes-inheritance.js (prototypes)
- 16-classes.js (ES6 classes)
- 24-function-patterns-advanced.js (functional patterns)
*/

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 15-prototypes-inheritance.js - Prototypal inheritance");
console.log("📘 16-classes.js - ES6 class syntax");
console.log("📘 24-function-patterns-advanced.js - Functional patterns & composition");
console.log("📘 44-design-patterns.js - More design patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 25-inheritance-patterns-ts-comparison.ts
*/
