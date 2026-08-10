// Functions - Patterns TypeScript Comparison
// 📘 Complementary to: 07.3-functions-patterns.js

export {};

console.log("=== Functions - Patterns TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. FUNCTION BINDING TYPES
 *    JS:  call/apply/bind work with 'this' at runtime
 *    TS:  bind() returns typed function with preserved parameter types
 *
 * 2. METHOD DEFINITION TYPES
 *    JS:  Object methods with shorthand syntax
 *    TS:  Methods in interfaces/classes have full type support
 *
 * 3. FUNCTION PROPERTIES
 *    JS:  name, length, prototype exist on functions
 *    TS:  Properties are typed, arrow functions have no prototype
 *
 * 4. IIFE AND MODULE PATTERN
 *    JS:  (function() {})() returns exports object
 *    TS:  Can type the returned object for type-safe API
 */

// Example 1: Typed function binding
console.log("1. Typed function binding:");
interface User {
  name: string;
  greet(greeting: string, punctuation: string): string;
}

const user: User = {
  name: 'David',
  greet(greeting: string, punctuation: string): string {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

console.log("  user.greet.call({ name: 'Eve' }, 'Hi', '.'):", user.greet.call({ name: 'Eve' }, 'Hi', '.'));

console.log("  user.greet.apply({ name: 'Frank' }, ['Hey', '?']):", user.greet.apply({ name: 'Frank' }, ['Hey', '?']));

const greetEve: (greeting: string, punctuation: string) => string = user.greet.bind({ name: 'Eve' });
console.log("  greetEve('Good morning', '!'):", greetEve('Good morning', '!'));

const sayHello: (punctuation: string) => string = user.greet.bind(user, 'Hello');
console.log("  sayHello('!'):", sayHello('!'));

// Example 2: Method definitions
console.log("\n2. Method definitions:");
interface Calculator {
  value: number;
  add(n: number): Calculator;
  subtract(n: number): Calculator;
  readonly result: number;
  reset(value: number): void;
}

const calculator: Calculator = {
  value: 0,

  add(n: number): Calculator {
    this.value += n;
    return this;
  },

  subtract(n: number): Calculator {
    this.value -= n;
    return this;
  },

  get result(): number {
    return this.value;
  },

  set reset(value: number) {
    this.value = value;
  }
};

calculator.add(10).subtract(3);
console.log("  Calculator result:", calculator.result);
calculator.reset = 0;
console.log("  After reset:", calculator.result);

class Counter {
  private count: number = 0;

  constructor(initial?: number) {
    if (initial !== undefined) {
      this.count = initial;
    }
  }

  increment(): number {
    return ++this.count;
  }

  decrement(): number {
    return --this.count;
  }
}

const c: Counter = new Counter(5);
c.increment();
console.log("  Class counter:", c);

// Example 3: Function properties
console.log("\n3. Function properties:");
function namedFunction(a: number, b: number): number {
  return a + b;
}

const anonymousFn: (a: number, b: number) => number = (a, b) => a + b;
const namedExpr: (a: number, b: number) => number = function myName(a, b) { return a + b; };
const arrowFn: (n: number) => number = n => n * n;

console.log("  Function names:");
console.log("  namedFunction.name:", namedFunction.name);
console.log("  anonymousFn.name:", anonymousFn.name);
console.log("  namedExpr.name:", namedExpr.name);
console.log("  arrowFn.name:", arrowFn.name);

console.log("\n  Function length:");
console.log("  namedFunction.length:", namedFunction.length);
console.log("  anonymousFn.length:", anonymousFn.length);

console.log("\n  Function prototype:");
console.log("  namedFunction.prototype:", namedFunction.prototype);
console.log("  arrowFn.prototype:", arrowFn.prototype);

// Example 4: IIFE with typed exports
console.log("\n4. IIFE with typed exports:");
interface CounterModule {
  increment(): number;
  decrement(): number;
  getCount(): number;
  setCount(value: number): boolean;
}

const CounterModule: CounterModule = (function(): CounterModule {
  let count: number = 0;

  function validateCount(value: number): boolean {
    return value >= 0;
  }

  return {
    increment(): number {
      return ++count;
    },
    decrement(): number {
      return --count;
    },
    getCount(): number {
      return count;
    },
    setCount(value: number): boolean {
      if (validateCount(value)) {
        count = value;
        return true;
      }
      return false;
    }
  };
})();

console.log("  CounterModule.increment():", CounterModule.increment());
console.log("  CounterModule.increment():", CounterModule.increment());
console.log("  CounterModule.getCount():", CounterModule.getCount());

// Example 5: Namespace pattern
console.log("\n5. Namespace pattern:");
type LoggerFn = (message: string) => void;

interface Utils {
  greet(name: string): void;
  getVersion(): string;
}

const utils: Utils = (function() {
  const version: string = '1.0.0';

  function greet(name: string): void {
    console.log(`[MyApp v${version}] Hello, ${name}!`);
  }

  function getVersion(): string {
    return version;
  }

  return { greet, getVersion };
})();

utils.greet('World');
console.log("  Version:", utils.getVersion());

// Example 6: Tail call optimization
console.log("\n6. Tail call optimization:");
function factorialTCO(n: number, accumulator: number = 1): number {
  if (n <= 1) return accumulator;
  return factorialTCO(n - 1, n * accumulator);
}

console.log("  factorialTCO(5):", factorialTCO(5));

// Example 7: Pure function types
console.log("\n7. Pure function types:");
type BinaryOp = (a: number, b: number) => number;

const pureAdd: BinaryOp = (a, b) => a + b;
console.log("  pureAdd(5, 3):", pureAdd(5, 3));
console.log("  pureAdd(5, 3):", pureAdd(5, 3));

interface Obj {
  a: number;
  [key: string]: any;
}

const pureAddProperty = (obj: Obj): Obj => ({ ...obj, processed: true });

const original: Obj = { a: 1 };
const modified: Obj = pureAddProperty(original);
console.log("  Original:", original);
console.log("  Modified:", modified);

/**
 * 📋 Key Takeaways:
 * - bind() preserves function parameter types in returned function
 * - call/apply types are checked against function signature
 * - IIFE can return typed objects for type-safe modules
 */