// Design Patterns Demo
// 📘 For TypeScript comparison, see: 44-design-patterns-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
// 📘 Patterns: https://www.patterns.dev/
// 📌 Covers common design patterns in JavaScript

// ============================================
// Learning goals
// ============================================
// This file introduces several common JavaScript patterns.
// The examples are intentionally small so you can focus on the idea
// behind each pattern rather than on production-grade implementation details.

// ============================================
// Table of Contents
// ============================================

// 1. Factory and Abstract Factory
// 2. Singleton
// 3. Observer
// 4. Strategy
// 5. Decorator
// 6. Adapter and Facade
// 7. Command and State
// 8. Common pitfalls and best practices

// ============================================

// ============================================
// Section 1: Factory Pattern (ES5/ES6)
// - Simple Factory, Factory Method, Abstract Factory are pattern-level concepts
// - Uses ES6 classes, static methods, and inheritance
// ============================================

console.log("\n=== Factory Pattern ===");

// Simple Factory - Creates objects without exposing creation logic
class UserFactory {
  static createUser(type, name) {
    switch (type) {
      case 'admin':
        return { name, role: 'admin', permissions: ['read', 'write', 'delete'] };
      case 'editor':
        return { name, role: 'editor', permissions: ['read', 'write'] };
      case 'viewer':
        return { name, role: 'viewer', permissions: ['read'] };
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}

const admin = UserFactory.createUser('admin', 'Alice');
const editor = UserFactory.createUser('editor', 'Bob');
console.log("Admin:", admin);
console.log("Editor:", editor);

// Factory Method - Subclasses decide which class to instantiate
class NotificationFactory {
  createNotification() {
    throw new Error("createNotification() must be implemented");
  }

  send(message) {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailNotificationFactory extends NotificationFactory {
  createNotification() {
    return {
      send: (message) => console.log(`📧 Email: ${message}`)
    };
  }
}

class SMSNotificationFactory extends NotificationFactory {
  createNotification() {
    return {
      send: (message) => console.log(`📱 SMS: ${message}`)
    };
  }
}

const emailFactory = new EmailNotificationFactory();
const smsFactory = new SMSNotificationFactory();
emailFactory.send("Welcome to our service!");
smsFactory.send("Your verification code is 123456");

// Abstract Factory - Creates families of related objects
class UIFactory {
  createButton() {}
  createInput() {}
}

class DarkThemeFactory extends UIFactory {
  createButton() {
    return { render: () => console.log("🔘 Dark Button") };
  }
  createInput() {
    return { render: () => console.log("📝 Dark Input") };
  }
}

class LightThemeFactory extends UIFactory {
  createButton() {
    return { render: () => console.log("⚪ Light Button") };
  }
  createInput() {
    return { render: () => console.log("📄 Light Input") };
  }
}

function renderUI(factory) {
  const button = factory.createButton();
  const input = factory.createInput();
  button.render();
  input.render();
}

console.log("\nDark Theme:");
renderUI(new DarkThemeFactory());
console.log("\nLight Theme:");
renderUI(new LightThemeFactory());

// Use cases:
// - Object creation with complex logic
// - Creating different types of objects based on conditions
// - Decoupling object creation from usage

// Common pitfalls:
// ⚠️ Over-engineering simple object creation
// ⚠️ Creating too many factory classes
// ⚠️ Not handling unknown types properly

// ============================================
// Section 2: Singleton Pattern (ES5/ES6)
// - Uses ES6 classes, closures (ES3), and ES6 module system
// ============================================

console.log("\n=== Singleton Pattern ===");

// Ensures a class has only one instance
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = null;
    this.data = [];
    Database.instance = this;
  }

  connect() {
    if (!this.connection) {
      this.connection = "Connected to database";
      console.log("✅ Database connected");
    } else {
      console.log("⚠️ Already connected");
    }
  }

  query(sql) {
    console.log(`🔍 Executing: ${sql}`);
    return this.data;
  }

  insert(item) {
    this.data.push(item);
    console.log(`➕ Inserted: ${JSON.stringify(item)}`);
  }
}

const db1 = new Database();
const db2 = new Database();
console.log("Same instance?", db1 === db2); // true

db1.connect();
db1.insert({ id: 1, name: "Alice" });
db2.query("SELECT * FROM users");
console.log("db2 data:", db2.data); // Same data as db1

// Module Singleton (ES6 modules are singletons by default)
const ConfigManager = (() => {
  let instance;
  let config = {};

  function createInstance() {
    return {
      set(key, value) {
        config[key] = value;
      },
      get(key) {
        return config[key];
      },
      getAll() {
        return { ...config };
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();
config1.set('apiUrl', 'https://api.example.com');
console.log("config2 apiUrl:", config2.get('apiUrl')); // Same config

// Use cases:
// - Database connections
// - Configuration managers
// - Logging services
// - Cache managers

// Common pitfalls:
// ⚠️ Global state can make testing difficult
// ⚠️ Hidden dependencies
// ⚠️ Thread safety issues (not in JS, but in other languages)
// ⚠️ Violates Single Responsibility Principle

// ============================================
// Section 3: Observer Pattern (Pub/Sub) (ES5/ES6)
// - Uses ES6 classes, ES6 Map, and optional chaining (ES2020)
// ============================================

console.log("\n=== Observer Pattern ===");

// Subject maintains list of observers and notifies them of changes
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    );
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}

// Example: Stock price updates
class StockMarket extends EventEmitter {
  constructor() {
    super();
    this.prices = {};
  }

  updatePrice(symbol, price) {
    this.prices[symbol] = price;
    this.emit('priceUpdate', { symbol, price });
  }
}

const market = new StockMarket();

// Observer 1: Display
market.on('priceUpdate', ({ symbol, price }) => {
  console.log(`📊 Display: ${symbol} is now $${price}`);
});

// Observer 2: Alert
market.on('priceUpdate', ({ symbol, price }) => {
  if (price > 100) {
    console.log(`🚨 Alert: ${symbol} exceeded $100!`);
  }
});

// Observer 3: Logger (one-time)
market.once('priceUpdate', ({ symbol, price }) => {
  console.log(`📝 First update logged: ${symbol} = $${price}`);
});

market.updatePrice('AAPL', 150);
market.updatePrice('GOOGL', 95);
market.updatePrice('MSFT', 120);

// Use cases:
// - Event handling systems
// - Real-time data updates
// - Model-View updates (MVC)
// - Reactive programming

// Common pitfalls:
// ⚠️ Memory leaks if listeners not removed
// ⚠️ Unexpected order of execution
// ⚠️ Debugging can be difficult
// ⚠️ Performance issues with many observers

// ============================================
// Section 4: Strategy Pattern (ES5/ES6)
// - Uses ES6 classes, closures, and higher-order functions
// ============================================

console.log("\n=== Strategy Pattern ===");

// Defines a family of algorithms and makes them interchangeable
class PaymentStrategy {
  pay(amount) {
    throw new Error("pay() must be implemented");
  }
}

class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber) {
    super();
    this.cardNumber = cardNumber;
  }

  pay(amount) {
    console.log(`💳 Paid $${amount} with credit card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }

  pay(amount) {
    console.log(`🅿️ Paid $${amount} via PayPal (${this.email})`);
  }
}

class CryptoPayment extends PaymentStrategy {
  constructor(walletAddress) {
    super();
    this.walletAddress = walletAddress;
  }

  pay(amount) {
    console.log(`₿ Paid $${amount} with crypto to ${this.walletAddress.slice(0, 10)}...`);
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item, price) {
    this.items.push({ item, price });
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout() {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`\n🛒 Cart total: $${total}`);
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(total);
    } else {
      console.log("❌ No payment method selected");
    }
  }
}

const cart = new ShoppingCart();
cart.addItem("Laptop", 999);
cart.addItem("Mouse", 25);

// Try different payment strategies
cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456"));
cart.checkout();

cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
cart.checkout();

cart.setPaymentStrategy(new CryptoPayment("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"));
cart.checkout();

// Functional approach (without classes)
const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byAge: (a, b) => a.age - b.age,
  byDate: (a, b) => new Date(a.date) - new Date(b.date)
};

const users = [
  { name: "Charlie", age: 30, date: "2023-01-15" },
  { name: "Alice", age: 25, date: "2023-03-20" },
  { name: "Bob", age: 35, date: "2023-02-10" }
];

console.log("\nSorted by name:", users.slice().sort(sortStrategies.byName));
console.log("Sorted by age:", users.slice().sort(sortStrategies.byAge));

// Use cases:
// - Payment processing
// - Sorting algorithms
// - Validation rules
// - Compression algorithms

// Common pitfalls:
// ⚠️ Clients must be aware of different strategies
// ⚠️ Increased number of objects
// ⚠️ Overhead for simple cases

// ============================================
// Section 5: Decorator Pattern (ES5/ES6)
// - Uses ES6 classes, Proxy (ES6), and higher-order functions
// ============================================

console.log("\n=== Decorator Pattern ===");

// Adds new functionality to objects dynamically
class Coffee {
  cost() {
    return 5;
  }

  description() {
    return "Simple coffee";
  }
}

// Decorator base class
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }

  description() {
    return this.coffee.description() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ", sugar";
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 3;
  }

  description() {
    return this.coffee.description() + ", whipped cream";
  }
}

let myCoffee = new Coffee();
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);

myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);

myCoffee = new SugarDecorator(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);

myCoffee = new WhipDecorator(myCoffee);
console.log(`${myCoffee.description()} - $${myCoffee.cost()}`);

// Functional decorator approach
function withLogging(fn) {
  return function(...args) {
    console.log(`📝 Calling ${fn.name} with args:`, args);
    const result = fn(...args);
    console.log(`📝 Result:`, result);
    return result;
  };
}

function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`⏱️ ${fn.name} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const decoratedAdd = withTiming(withLogging(add));
console.log("\nDecorated function:");
decoratedAdd(5, 3);

// Use cases:
// - Adding features to objects dynamically
// - Middleware in Express.js
// - Higher-order components in React
// - Function composition

// Common pitfalls:
// ⚠️ Can create many small objects
// ⚠️ Decorators are not identical to original object
// ⚠️ Order of decorators matters
// ⚠️ Can be hard to debug


// ============================================
// 1. Section 6: Adapter Pattern (ES5/ES6)
// ============================================
// - Converts one interface to another expected by the client
// - Uses ES6 classes and composition

console.log("\n=== Adapter Pattern ===");

// Old/legacy API with incompatible interface
class OldPaymentSystem {
  processPayment(amountInCents, currencyCode) {
    console.log(`Paid ${amountInCents} ${currencyCode} via legacy system`);
    return { success: true, legacyId: "legacy_" + Date.now() };
  }
}

// Modern interface expected by the application
class ModernPaymentGateway {
  charge(amount, currency) {
    console.log(`Charged ${amount} ${currency} via modern gateway`);
    return { success: true, transactionId: "txn_" + Date.now() };
  }
}

// Adapter — makes OldPaymentSystem work with the modern interface
class PaymentAdapter {
  constructor(oldSystem) {
    this.oldSystem = oldSystem;
  }

  // Adapts the modern charge() call to the old processPayment() call
  charge(amount, currency) {
    const amountInCents = Math.round(amount * 100);
    return this.oldSystem.processPayment(amountInCents, currency);
  }
}

// Usage
const oldSystem = new OldPaymentSystem();
const adapter = new PaymentAdapter(oldSystem);
console.log("Through adapter:", JSON.stringify(adapter.charge(9.99, "USD")));

// Functional Adapter — simpler for function-level adaptation
function createAdapter(oldFn, transform) {
  return (...args) => {
    const transformed = transform(args);
    return oldFn(...transformed);
  };
}

function greetOld(name, age) {
  console.log(`Hello ${name}, you are ${age} years old`);
}

const greetNew = createAdapter(greetOld, ([obj]) => [obj.name, obj.age]);
console.log("\nFunctional adapter:");
greetNew({ name: "Alice", age: 30 });


// ============================================
// 2. Section 7: Facade Pattern (ES5/ES6)
// ============================================
// - Provides a simplified interface to a complex subsystem
// - Uses ES6 classes and composition

console.log("\n=== Facade Pattern ===");

// Complex subsystem with many classes and methods
class CPU {
  freeze() { return "CPU frozen"; }
  jump(position) { return `CPU jumping to ${position}`; }
  execute() { return "CPU executing"; }
}

class Memory {
  load(position, data) { return `Memory loaded "${data}" at ${position}`; }
}

class HardDrive {
  read(lba, size) { return `HardDrive reading ${size} bytes from ${lba}`; }
}

// Facade — provides a simple interface to the complex subsystem
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start() {
    console.log("Starting computer...");
    console.log("  " + this.cpu.freeze());
    console.log("  " + this.memory.load("0x00", "boot_loader"));
    console.log("  " + this.cpu.jump("0x00"));
    console.log("  " + this.cpu.execute());
    console.log("  " + this.hardDrive.read("0x1000", 4096));
    console.log("Computer started successfully!");
  }

  shutdown() {
    console.log("Shutting down... saving state, powering off.");
  }
}

const computer = new ComputerFacade();
computer.start();
computer.shutdown();

// Another Facade: simplified fetch wrapper
console.log("\nAPI Facade pattern (conceptual):");
console.log("  const api = new APIFacade('https://api.example.com');");
console.log("  const users = await api.get('/users');");
console.log("  // Facade hides fetch, error handling, JSON parsing, base URL");


// ============================================
// 3. Section 8: Command Pattern (ES5/ES6)
// ============================================
// - Encapsulates a request as an object, allowing parameterization and queuing
// - Uses ES6 classes and closures

console.log("\n=== Command Pattern ===");

// Command interface: { execute(), undo() }
// The Command pattern decouples the invoker from the receiver

// Receiver — the object that performs the actual work
class Calculator {
  constructor() {
    this.value = 0;
  }

  add(n) { this.value += n; }
  subtract(n) { this.value -= n; }
  multiply(n) { this.value *= n; }
  divide(n) { this.value /= n; }
}

// Concrete Commands — each wraps a specific operation
class AddCommand {
  constructor(calculator, amount) {
    this.calculator = calculator;
    this.amount = amount;
  }

  execute() {
    this.calculator.add(this.amount);
    return this.calculator.value;
  }

  undo() {
    this.calculator.subtract(this.amount);
    return this.calculator.value;
  }
}

class MultiplyCommand {
  constructor(calculator, amount) {
    this.calculator = calculator;
    this.amount = amount;
  }

  execute() {
    this.calculator.multiply(this.amount);
    return this.calculator.value;
  }

  undo() {
    this.calculator.divide(this.amount);
    return this.calculator.value;
  }
}

// Invoker — manages command history and execution
class CommandHistory {
  constructor() {
    this.history = [];
    this.redoStack = [];
  }

  execute(command) {
    const result = command.execute();
    this.history.push(command);
    this.redoStack = []; // Clear redo stack on new command
    return result;
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      this.redoStack.push(command);
      return command.undo();
    }
    return null;
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      this.history.push(command);
      return command.execute();
    }
    return null;
  }
}

// Usage
const calc = new Calculator();
const history = new CommandHistory();

console.log("Initial:", calc.value); // 0
console.log("Add 10:", history.execute(new AddCommand(calc, 10))); // 10
console.log("Multiply 3:", history.execute(new MultiplyCommand(calc, 3))); // 30
console.log("Undo:", history.undo()); // 10
console.log("Undo:", history.undo()); // 0
console.log("Redo:", history.redo()); // 10

// Functional Command Pattern — simpler for lightweight operations
function createCommand(execute, undo) {
  return { execute, undo };
}

const commands = [];
let counter = 0;

const incrementCmd = createCommand(
  () => ++counter,
  () => --counter
);

commands.push(incrementCmd);
console.log("\nFunctional command:", incrementCmd.execute()); // 1
console.log("Undo:", incrementCmd.undo()); // 0


// ============================================
// 4. Section 9: State Pattern (ES6)
// ============================================
// - Allows an object to alter its behavior when its internal state changes
// - Uses ES6 classes and polymorphism

console.log("\n=== State Pattern ===");

// Context — the object whose behavior changes with state
class TrafficLight {
  constructor() {
    this.state = new RedState(this);
  }

  setState(state) {
    this.state = state;
  }

  // Delegate behavior to current state
  change() {
    this.state.change();
  }

  getColor() {
    return this.state.getColor();
  }
}

// State interface (implicit in JS — duck typing)
// Each state implements: change(), getColor()

class RedState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Red → Green");
    this.light.setState(new GreenState(this.light));
  }

  getColor() {
    return "red";
  }
}

class GreenState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Green → Yellow");
    this.light.setState(new YellowState(this.light));
  }

  getColor() {
    return "green";
  }
}

class YellowState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Yellow → Red");
    this.light.setState(new RedState(this.light));
  }

  getColor() {
    return "yellow";
  }
}

// Usage
const light = new TrafficLight();
console.log("Current:", light.getColor()); // red
light.change(); // Red → Green
console.log("Current:", light.getColor()); // green
light.change(); // Green → Yellow
console.log("Current:", light.getColor()); // yellow
light.change(); // Yellow → Red
console.log("Current:", light.getColor()); // red

// Functional State Pattern — for simpler state machines
function createStateMachine(initialState, transitions) {
  let current = initialState;

  return {
    getState: () => current,
    transition(action) {
      const next = transitions[current]?.[action];
      if (next) {
        console.log(`${current} --${action}--> ${next}`);
        current = next;
      } else {
        console.log(`Invalid transition: ${current} --${action}--> ?`);
      }
      return current;
    }
  };
}

// Example: Simple order state machine
const orderMachine = createStateMachine("pending", {
  pending: { pay: "paid", cancel: "cancelled" },
  paid: { ship: "shipped", refund: "refunded" },
  shipped: { deliver: "delivered" },
  delivered: {},
  cancelled: {},
  refunded: {}
});

console.log("\nOrder State Machine:");
orderMachine.transition("pay"); // pending --pay--> paid
orderMachine.transition("ship"); // paid --ship--> shipped
orderMachine.transition("deliver"); // shipped --deliver--> delivered
orderMachine.transition("pay"); // Invalid (already delivered)


// ============================================
// 5. Section 10: Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Overusing Singletons
console.log("\nPitfall 1: Overusing Singletons");
console.log("  Singletons create global state that is difficult to test and debug");
console.log("  They hide dependencies and make unit testing nearly impossible");
console.log("  Fix: Use dependency injection instead of relying on global singletons");

// Pitfall 2: Abstract Factory Complexity
console.log("\nPitfall 2: Abstract Factory Over-Engineering");
console.log("  Creating factory families for simple object creation adds unnecessary complexity");
console.log("  Abstract Factory should only be used when you need families of related objects");
console.log("  Fix: Start with a simple factory; introduce abstract factory only when genuinely needed");

// Pitfall 3: Observer Memory Leaks
console.log("\nPitfall 3: Observer Memory Leaks");
console.log("  Failing to unsubscribe from events causes memory leaks and stale callbacks");
console.log("  Accumulated listeners can also cause the same handler to fire multiple times");
console.log("  Fix: Always call .off() / .removeEventListener() when components unmount or are destroyed");

// Pitfall 4: Too Many Strategies
console.log("\nPitfall 4: Too Many Strategy Classes");
console.log("  Creating a strategy for every minor variation leads to class explosion");
console.log("  Each strategy class adds overhead and increases cognitive load");
console.log("  Fix: Use configuration objects or functional approaches for simple variations");

// Pitfall 5: Complex Decorator Chains
console.log("\nPitfall 5: Complex Decorator Chains");
console.log("  Long chains of decorators become hard to reason about and debug");
console.log("  Each decorator adds a layer of indirection that compounds over time");
console.log("  Fix: Limit decorator depth; consider composition or middleware patterns instead");

// ============================================
// 6. Section 11: Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Use patterns for real problems, not hypothetical ones");
console.log("2. Keep patterns simple - start small and add complexity only when needed");
console.log("3. Prefer composition over inheritance and deep class hierarchies");
console.log("4. Document pattern usage so the team understands when and why they are applied");

console.log("\n❌ DON'T:");
console.log("1. Over-engineer simple code with unnecessary patterns");
console.log("2. Force patterns where a straightforward solution works");
console.log("3. Use design patterns when a simpler alternative would be clearer");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Complexity creep - patterns should simplify, not complicate");
console.log("2. Testing difficulties - some patterns (Singleton, Observer) complicate unit tests");
console.log("3. Performance overhead - extra abstraction layers can impact performance");


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. FACTORY PATTERN
   JS:  Dynamic object creation without type safety
   TS:  Generic factories with type parameters
   TS:  interface Product { id: string; }
   TS:  class Factory<T extends Product> { create(): T }

2. SINGLETON PATTERN
   TS:  Private constructor for better encapsulation
   TS:  class Singleton { private constructor() {} }
   TS:  static getInstance(): Singleton

3. OBSERVER PATTERN
   TS:  Type-safe event emitters
   TS:  interface Events { click: MouseEvent; load: void; }
   TS:  emit<K extends keyof Events>(event: K, data: Events[K])

4. STRATEGY PATTERN
   TS:  Interface-based strategies
   TS:  interface Strategy<T> { execute(data: T): Result; }
   TS:  Compile-time strategy validation

5. DECORATOR PATTERN
   TS:  Decorator metadata with reflect-metadata
   TS:  @decorator syntax for classes and methods
   TS:  Type preservation through decorators

⚠️ BROWSER/RUNTIME SUPPORT:
- All patterns work in modern browsers (ES6+)
- Decorator syntax requires TypeScript or Babel
- Class syntax: Chrome 49+, Firefox 45+, Safari 9+, Node.js 6+

🔧 BEST PRACTICES:
- Use patterns to solve real problems, not for over-engineering
- Prefer composition over inheritance
- Keep patterns simple and maintainable
- Document pattern usage for team understanding

📘 See related:
- 16-classes.js (Class syntax and inheritance)
- 23-proxy-reflect.js (Proxy pattern)
- 07-functions.js (Higher-order functions for functional patterns)
*/


// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 25-inheritance-patterns.js - Inheritance patterns");
console.log("📘 24.1-function-composition.js - Function composition");
console.log("📘 23-proxy-reflect.js - Proxy patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 44-design-patterns-ts-comparison.ts
*/
