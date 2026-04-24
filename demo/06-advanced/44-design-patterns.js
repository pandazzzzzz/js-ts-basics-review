// Design Patterns Demo
// 📘 For TypeScript comparison, see: 44-design-patterns-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
// 📘 Patterns: https://www.patterns.dev/posts/classic-design-patterns
// 📌 Covers common design patterns in JavaScript

// ============================================
// Section 1: Factory Pattern
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
// Section 2: Singleton Pattern
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
// Section 3: Observer Pattern (Pub/Sub)
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
// Section 4: Strategy Pattern
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
// Section 5: Decorator Pattern
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
// Common Pitfalls
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
// Best Practices
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
