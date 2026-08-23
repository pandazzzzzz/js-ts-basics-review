// TypeScript vs JavaScript: this Keyword Comparison
// 📘 For JavaScript examples, see: 14-this-keyword.js
// This file demonstrates TypeScript-specific this typing features

export {};

// ============================================================================
// 1. THIS PARAMETER TYPE ANNOTATIONS
// ============================================================================

// JavaScript: this type is implicit and error-prone
// function jsGreet() {
//   return `Hello, ${this.name}`; // this could be anything!
// }

// TypeScript: Explicit this parameter type annotation
interface User {
  name: string;
  age: number;
}

function greet(this: User): string {
  return `Hello, I'm ${this.name}`;
}

console.log("=== This Parameter Type Annotations ===");
const user: User = { name: "Alice", age: 25 };
console.log(greet.call(user)); // "Hello, I'm Alice"

// ⚠️ PITFALL: Calling without proper context causes compile error
// const standaloneGreet = greet;
// standaloneGreet(); // ❌ Error: The 'this' context of type 'void' is not assignable

// ✅ FIX: Bind the function or use arrow function
const boundGreet = greet.bind(user);
console.log(boundGreet()); // Works correctly

// ============================================================================
// 2. NO IMPLICIT THIS COMPILER OPTION
// ============================================================================

// With noImplicitThis: true in tsconfig.json
// TypeScript requires explicit this type when it can't be inferred

// Without this annotation, noImplicitThis would cause an error
function processItems(this: { items: string[] }, processor: (item: string) => void): void {
  this.items.forEach(processor);
}

const container = {
  items: ["a", "b", "c"],
  process: processItems,
};

console.log("\n=== No Implicit This ===");
container.process.call(container, item => console.log(item));

// ============================================================================
// 3. THISTYPE<T> UTILITY TYPE
// ============================================================================

// ThisType<T> is a marker interface for contextual this types
interface LoggerMethods {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface LoggerContext {
  prefix: string;
  level: "debug" | "info" | "warn" | "error";
}

// Using ThisType to specify what 'this' should be in methods
type LoggerWithThis = LoggerMethods & ThisType<LoggerContext>;

const loggerImplementation: LoggerWithThis = {
  log(message: string) {
    // this is typed as LoggerContext due to ThisType
    console.log(`[${this.prefix}] ${message}`);
  },
  warn(message: string) {
    console.warn(`[${this.prefix}] WARN: ${message}`);
  },
  error(message: string) {
    console.error(`[${this.prefix}] ERROR: ${message}`);
  },
};

console.log("\n=== ThisType Utility ===");
const loggerContext: LoggerContext = { prefix: "App", level: "info" };
loggerImplementation.log.call(loggerContext, "Application started");

// ============================================================================
// 3.5 THISTYPE IN COMPLEX SCENARIOS
// ============================================================================

// TypeScript: ThisType for mixin patterns
interface EventEmitter {
  on(event: string, handler: Function): void;
  emit(event: string, data: any): void;
}

interface EventContext {
  eventName: string;
  timestamp: number;
}

type EventHandler = (this: EventContext & EventEmitter, data: any) => void;

const eventMixin = {
  handlers: new Map<string, EventHandler[]>(),

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  },

  emit(event: string, data: any): void {
    const handlers = this.handlers.get(event) || [];
    const context: EventContext = {
      eventName: event,
      timestamp: Date.now(),
    };

    handlers.forEach(handler => {
      handler.call({ ...context, ...this }, data);
    });
  },
};

console.log("\n=== ThisType in Complex Scenarios ===");

// ============================================================================
// 4. ARROW FUNCTION THIS TYPING
// ============================================================================

// JavaScript: Arrow functions inherit this lexically but without type safety
// const jsObj = {
//   value: 42,
//   method: () => {
//     console.log(this.value); // this is not obj!
//   }
// };

// TypeScript: Proper typing for arrow function this
class Counter {
  count: number = 0;

  // Arrow function property - this is automatically bound
  increment = (): number => {
    this.count++;
    return this.count;
  };

  // Regular method - this needs binding
  incrementRegular(): number {
    this.count++;
    return this.count;
  }
}

console.log("\n=== Arrow Function This Typing ===");
const counter = new Counter();
const extractedIncrement = counter.increment; // Safe to extract!
console.log(extractedIncrement()); // 1
console.log(extractedIncrement()); // 2

// Regular method extraction loses this
const extractedRegular = counter.incrementRegular;
try {
  // extractedRegular(); // ❌ Runtime error: Cannot read properties of undefined
} catch (e) {
  console.log("Regular method loses this context");
}

// ============================================================================
// 5. THIS RETURN TYPE FOR FLUENT APIS
// ============================================================================

// TypeScript: 'this' type for method chaining
class FluentBuilder {
  private value: number = 0;

  add(n: number): this {
    this.value += n;
    return this; // 'this' type refers to the concrete subclass
  }

  multiply(n: number): this {
    this.value *= n;
    return this;
  }

  getValue(): number {
    return this.value;
  }
}

class ExtendedBuilder extends FluentBuilder {
  subtract(n: number): this {
    // @ts-ignore - accessing private for demo
    this.value -= n;
    return this;
  }
}

console.log("\n=== This Return Type ===");
const builder = new FluentBuilder();
const result = builder.add(10).multiply(2).add(5).getValue();
console.log(result); // 25

// Inheritance preserves 'this' type
const extended = new ExtendedBuilder();
const extendedResult = extended.add(10).subtract(3).multiply(2);
console.log(extendedResult.getValue()); // 14

// ============================================================================
// 6. THIS IN CLASS METHODS
// ============================================================================

// TypeScript automatically infers this type from class context
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}

  // this is implicitly typed as Person
  introduce(): string {
    return `Hi, I'm ${this.name}, ${this.age} years old`;
  }

  // Static methods have this typed as the constructor
  static createAdult(name: string): Person {
    return new Person(name, 18);
  }
}

console.log("\n=== This in Class Methods ===");
const person = new Person("Bob", 30);
console.log(person.introduce());

// ============================================================================
// 7. THIS IN INTERFACES AND OBJECT LITERALS
// ============================================================================

interface Chainable<T> {
  option<U>(key: string, value: U): Chainable<T & { [K in keyof U]: U[K] }>;
  get(): T;
}

function chainable<T = {}>(): Chainable<T> {
  // Type the builder as Chainable<T> so `this` is polymorphic and statically
  // checked — no `any` needed to make method chaining type-check.
  const result: Chainable<T> = {
    option<U>(this: Chainable<T>, key: string, value: U): Chainable<T & { [K in keyof U]: U[K] }> {
      // Real implementations accumulate into an internal record; the cast below
      // models the widening that the mapped type in the signature promises.
      return { ...this, [key]: value } as Chainable<T & { [K in keyof U]: U[K] }>;
    },
    get(): T {
      return this as unknown as T;
    },
  };

  return result;
}

console.log("\n=== This in Interfaces ===");
const chained = chainable().option("foo", 123).option("bar", "hello").get();

console.log(chained);

// ============================================================================
// 8. CALL/APPLY/BIND WITH THIS TYPES
// ============================================================================

// TypeScript enforces this parameter types in call/apply/bind
function introduce(this: Person, greeting: string): string {
  return `${greeting}, I'm ${this.name}`;
}

const anotherPerson = new Person("Charlie", 35);

console.log("\n=== Call/Apply/Bind with This Types ===");

// call with explicit this
console.log(introduce.call(person, "Hello"));
console.log(introduce.call(anotherPerson, "Hi"));

// apply with explicit this
console.log(introduce.apply(person, ["Greetings"]));

// bind returns properly typed function
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce("Hey"));

// ============================================================================
// 9. THIS IN ASYNC CONTEXTS
// ============================================================================

class AsyncProcessor {
  data: string[] = [];

  // Arrow function preserves this in async context
  processAsync = async (items: string[]): Promise<void> => {
    this.data = items;
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log(`Processed ${this.data.length} items`);
  };

  // Regular async method - this works when called as method
  async processRegular(items: string[]): Promise<void> {
    this.data = items;
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log(`Processed ${this.data.length} items`);
  }
}

console.log("\n=== This in Async Contexts ===");
const processor = new AsyncProcessor();
processor.processAsync(["a", "b", "c"]); // Works - arrow function

// ============================================================================
// 10. COMMON PITFALLS: JS VS TS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Object literal arrow method
const badObject = {
  value: 42,
  // ❌ Don't do this - arrow method doesn't get object's this
  getValue: () => {
    // return this.value; // ❌ Error or wrong this
    return "wrong";
  },
};

const goodObject = {
  value: 42,
  // ✅ Use regular function for object methods
  getValue() {
    return this.value;
  },
};

console.log("Good object:", goodObject.getValue()); // 42

// PITFALL 2: Nested arrow functions
class Outer {
  value = "outer";

  method() {
    // Arrow inherits this from method, which is correct here
    const inner = () => {
      console.log(this.value); // ✅ Correct - "outer"
    };
    inner();
  }
}

new Outer().method();

// PITFALL 3: Extracting constructor methods
class MyClass {
  data = 42;

  getData() {
    return this.data;
  }
}

const instance = new MyClass();
const unboundMethod = instance.getData;
// unboundMethod(); // ❌ Error: this is undefined

const boundMethod = instance.getData.bind(instance);
console.log("Bound method:", boundMethod()); // 42

// ============================================================================
// 11. BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== Best Practices ===");
console.log(`
✅ DO:
1. Use this parameter type annotations for standalone functions
2. Use arrow functions for class methods that need stable this
3. Use regular functions for object methods
4. Enable noImplicitThis in tsconfig.json
5. Use 'this' return type for fluent APIs
6. Bind methods when extracting them
7. Use ThisType<T> for complex this contexts

❌ DON'T:
1. Use arrow functions as object methods
2. Forget to bind methods before extracting
3. Assume this is always available in callbacks
4. Mix arrow and regular functions incorrectly
5. Ignore noImplicitThis compiler errors

⚠️ WATCH OUT FOR:
1. Arrow functions don't have their own this
2. Method extraction loses this context
3. Static methods have this as constructor
4. this in async callbacks needs careful handling
5. Event handlers often lose this context
`);

// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: this Keyword ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ this parameter types       │       ✗         │       ✓         │
│ noImplicitThis option      │       ✗         │       ✓         │
│ ThisType<T> utility        │       ✗         │       ✓         │
│ this return type           │       ✗         │       ✓         │
│ Compile-time this checks   │       ✗         │       ✓         │
│ Arrow function this        │  Dynamic        │  Typed         │
│ Method binding errors      │  Runtime        │  Compile-time  │
│ Runtime behavior           │    Same         │    Same         │
│ this binding rules         │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time this type checking
2. this parameter annotations prevent common mistakes
3. noImplicitThis catches implicit this usage
4. ThisType<T> enables contextual this typing
5. Runtime this binding follows JavaScript rules
`);

console.log("=== TypeScript provides type safety for this at compile time ===");
