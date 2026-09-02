// TypeScript vs JavaScript: Proxy and Reflect Comparison
// 📘 For JavaScript examples, see: 23-proxy-reflect.js
// This file demonstrates TypeScript-specific typing for Proxy and Reflect

// 🎯 Difficulty: Advanced
export {};

// ============================================================================
// 1. PROXYHANDLER<T> INTERFACE
// ============================================================================

// JavaScript: Proxy handler without type checking
// const handler = {
//   get(target, prop) {
//     console.log(`Getting ${prop}`);
//     return target[prop];
//   }
// };

// TypeScript: ProxyHandler<T> interface with proper typing
interface User {
  name: string;
  age: number;
}

const userHandler: ProxyHandler<User> = {
  get(target, prop, receiver) {
    console.log(`Getting ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Setting ${String(prop)} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  },
};

const user: User = { name: "Alice", age: 30 };
const proxiedUser = new Proxy(user, userHandler);

console.log("=== ProxyHandler<T> Interface ===");
console.log(proxiedUser.name); // Getting name, then "Alice"

// ============================================================================
// 2. GENERIC PROXY TYPES
// ============================================================================

// TypeScript: Generic proxy factory function
function createLoggingProxy<T extends object>(obj: T): T {
  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      console.log(`[LOG] Getting property: ${String(prop)}`);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      console.log(`[LOG] Setting property: ${String(prop)} = ${value}`);
      return Reflect.set(target, prop, value, receiver);
    },
  };

  return new Proxy(obj, handler);
}

console.log("\n=== Generic Proxy Types ===");
const loggedObj = createLoggingProxy({ x: 1, y: 2 });
console.log(loggedObj.x);

// ============================================================================
// 3. REFLECT METHOD TYPES
// ============================================================================

// TypeScript: Reflect methods have proper return types
const reflectObj = { a: 1, b: 2 };

// Reflect.get returns any without type assertion
const aValue: number = Reflect.get(reflectObj, "a") as number;

// Reflect.set returns boolean
const setResult: boolean = Reflect.set(reflectObj, "c", 3);

// Reflect.has returns boolean
const hasB: boolean = Reflect.has(reflectObj, "b");

// Reflect.ownKeys returns (string | symbol)[]
const keys: (string | symbol)[] = Reflect.ownKeys(reflectObj);

console.log("\n=== Reflect Method Types ===");
console.log(`a value: ${aValue}`);
console.log(`set result: ${setResult}`);
console.log(`has b: ${hasB}`);
console.log(`own keys: ${keys}`);

// ============================================================================
// 4. TYPE-SAFE TRAP HANDLERS
// ============================================================================

// TypeScript: Type-safe trap handler implementation
class SafeProxyHandler<T extends object> {
  private validators: Map<keyof T, (value: unknown) => boolean>;

  constructor() {
    this.validators = new Map();
  }

  addValidator<K extends keyof T>(key: K, validator: (value: T[K]) => boolean): void {
    this.validators.set(key, validator as (value: unknown) => boolean);
  }

  getHandler(): ProxyHandler<T> {
    return {
      get: (target, prop, receiver) => {
        return Reflect.get(target, prop, receiver);
      },
      set: (target, prop, value, receiver) => {
        const validator = this.validators.get(prop as keyof T);
        if (validator && !validator(value)) {
          console.log(`Validation failed for ${String(prop)}`);
          return false;
        }
        return Reflect.set(target, prop, value, receiver);
      },
    };
  }
}

console.log("\n=== Type-safe Trap Handlers ===");
const safeHandler = new SafeProxyHandler<{ age: number; name: string }>();
safeHandler.addValidator("age", (v: number) => v >= 0 && v <= 150);
safeHandler.addValidator("name", (v: string) => v.length > 0);

const safeObj = new Proxy({ age: 25, name: "Bob" }, safeHandler.getHandler());
safeObj.age = 30; // ✅ OK
// safeObj.age = -5; // ❌ Validation fails

// ============================================================================
// 5. PROXY WITH CLASSES
// ============================================================================

// TypeScript: Proxy with class types
class DataService {
  private cache: Map<string, unknown> = new Map();

  get(key: string): unknown {
    return this.cache.get(key);
  }

  set(key: string, value: unknown): void {
    this.cache.set(key, value);
  }
}

const serviceProxy = new Proxy<DataService>(new DataService(), {
  get(target, prop, receiver) {
    console.log(`Accessing ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
});

console.log("\n=== Proxy with Classes ===");
serviceProxy.set("key", "value");

// ============================================================================
// 6. REVOCABLE PROXY TYPING
// ============================================================================

// TypeScript: Revocable proxy with proper typing
function createRevocableProxy<T extends object>(
  target: T,
  handler: ProxyHandler<T>
): { proxy: T; revoke: () => void } {
  const { proxy, revoke } = Proxy.revocable(target, handler);
  return { proxy, revoke };
}

console.log("\n=== Revocable Proxy Typing ===");
const revocable = createRevocableProxy(
  { secret: "data" },
  {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
  }
);

console.log(revocable.proxy.secret);
revocable.revoke();
// console.log(revocable.proxy.secret); // TypeError after revoke

// ============================================================================
// 7. REFLECT CONSTRUCT TYPING
// ============================================================================

// TypeScript: Reflect.construct with proper typing
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}

  introduce(): string {
    return `Hi, I'm ${this.name}, ${this.age} years old`;
  }
}

// Reflect.construct returns the constructed instance
const personInstance: Person = Reflect.construct(Person, ["Alice", 25]);

console.log("\n=== Reflect Construct Typing ===");
console.log(personInstance.introduce());

// ============================================================================
// 8. PROXY FOR VALIDATION
// ============================================================================

// TypeScript: Typed validation proxy
interface ValidationRules {
  [key: string]: (value: unknown) => boolean;
}

function createValidatedProxy<T extends Record<string, unknown>>(
  target: T,
  rules: ValidationRules
): T {
  return new Proxy(target, {
    set(target, prop, value, receiver): boolean {
      const propName = String(prop);
      const rule = rules[propName];

      if (rule && !rule(value)) {
        throw new Error(`Validation failed for ${propName}`);
      }

      return Reflect.set(target, prop, value, receiver);
    },
  });
}

console.log("\n=== Proxy for Validation ===");
const validatedConfig = createValidatedProxy(
  { port: 3000, debug: true },
  {
    port: v => typeof v === "number" && v > 0 && v < 65536,
    debug: v => typeof v === "boolean",
  }
);

validatedConfig.port = 8080; // ✅ OK
// validatedConfig.port = -1; // ❌ Throws error

// ============================================================================
// 9. MEMBRANE PATTERN WITH TYPES
// ============================================================================

// TypeScript: Membrane pattern with full typing
class Membrane {
  private wrapped = new WeakMap<object, object>();
  private unwrapped = new WeakMap<object, object>();

  wrap<T extends object>(value: T): T {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    if (this.wrapped.has(value)) {
      return this.wrapped.get(value) as T;
    }

    const proxy = new Proxy(value, {
      get: (target, prop, receiver) => {
        const result = Reflect.get(target, prop, receiver);
        if (typeof result === "object" && result !== null) {
          return this.wrap(result as object);
        }
        return result;
      },
      set: (target, prop, value, receiver) => {
        return Reflect.set(target, prop, this.unwrap(value), receiver);
      },
    });

    this.wrapped.set(value, proxy);
    this.unwrapped.set(proxy, value);

    return proxy;
  }

  unwrap<T extends object>(proxy: T): T {
    if (typeof proxy !== "object" || proxy === null) {
      return proxy;
    }

    if (this.unwrapped.has(proxy)) {
      return this.unwrapped.get(proxy) as T;
    }

    return proxy;
  }
}

console.log("\n=== Membrane Pattern with Types ===");
const membrane = new Membrane();
const originalObj = { nested: { value: 42 } };
const wrappedObj = membrane.wrap(originalObj);
console.log(wrappedObj.nested.value);

// ============================================================================
// 10. PARTIAL PROXY IMPLEMENTATION
// ============================================================================

// TypeScript: Partial proxy with only some traps
const partialHandler: ProxyHandler<Record<string, number>> = {
  // Only implement get trap
  get(target, prop, receiver) {
    console.log(`Getting ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
  // Other traps use default behavior
};

console.log("\n=== Partial Proxy Implementation ===");
const partialProxy = new Proxy({ x: 1, y: 2 }, partialHandler);
console.log(partialProxy.x);

// ============================================================================
// 11. ADVANCED: PROXY FOR AUTO-IMPLEMENTATION
// ============================================================================

// TypeScript: Proxy for automatic interface implementation
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

function createMockRepository<T extends { id: unknown }, ID = number>(): Repository<T, ID> {
  return new Proxy({} as Repository<T, ID>, {
    get(target, prop) {
      return async (...args: unknown[]) => {
        console.log(`Mock ${String(prop)} called with`, args);

        if (prop === "findAll") {
          return [];
        }
        if (prop === "findById") {
          return null;
        }
        if (prop === "save") {
          return args[0];
        }
        if (prop === "delete") {
          return undefined;
        }

        return null;
      };
    },
  });
}

console.log("\n=== Proxy for Auto-implementation ===");
const mockRepo = createMockRepository<{ id: number; name: string }, number>();
mockRepo.findById(1);
mockRepo.findAll();

// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Proxy & Reflect ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ ProxyHandler<T> interface  │       ✗         │       ✓         │
│ Generic proxy types        │       ✗         │       ✓         │
│ Reflect method types       │  Inferred       │  Explicit      │
│ Type-safe trap handlers    │       ✗         │       ✓         │
│ Proxy with classes         │  Runtime only   │  Typed         │
│ Revocable proxy typing     │       ✗         │       ✓         │
│ Membrane pattern types     │       ✗         │       ✓         │
│ Reflect.construct typing   │  Inferred       │  Explicit      │
│ Runtime behavior           │    Same         │    Same         │
│ Proxy mechanics            │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript provides ProxyHandler<T> generic interface
2. Reflect methods have explicit return types
3. Generic proxy factories enable reuse
4. Type-safe trap handlers prevent errors
5. Runtime proxy behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
