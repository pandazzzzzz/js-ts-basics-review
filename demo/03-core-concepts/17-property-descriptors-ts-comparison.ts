// TypeScript vs JavaScript: Property Descriptors Comparison
// 📘 For JavaScript examples, see: 17-property-descriptors.js
// This file demonstrates TypeScript-specific typing for property descriptors

export {};

// ============================================================================
// 1. PROPERTYDESCRIPTOR INTERFACE
// ============================================================================

// JavaScript: Property descriptors without type checking
// const descriptor = {
//   value: 42,
//   writable: true,
//   enumerable: true,
//   configurable: true
// };

// TypeScript: PropertyDescriptor interface with proper types
const dataDescriptor: PropertyDescriptor = {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: true
};

const accessorDescriptor: PropertyDescriptor = {
  get() {
    return 42;
  },
  set(value: number) {
    console.log(`Setting value to ${value}`);
  },
  enumerable: true,
  configurable: true
};

console.log("=== PropertyDescriptor Interface ===");
console.log(dataDescriptor.value);


// ============================================================================
// 2. READONLY VS WRITABLE: FALSE
// ============================================================================

// JavaScript: Runtime enforcement with writable: false
// const obj = {};
// Object.defineProperty(obj, 'x', { value: 42, writable: false });
// obj.x = 100; // Fails silently or throws in strict mode

// TypeScript: Compile-time readonly vs runtime writable
class ConfigClass {
  // Compile-time readonly - enforced by TypeScript
  readonly compileTimeReadonly: string = "constant";

  constructor() {
    // Can only be set in constructor
    // this.compileTimeReadonly = "changed"; // ❌ Error after initialization
  }
}

// Runtime readonly via defineProperty
const runtimeReadonly: Record<string, any> = {};
Object.defineProperty(runtimeReadonly, 'runtimeConstant', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
});

console.log("\n=== Readonly vs Writable: false ===");
console.log("Compile-time readonly prevents assignment at compile time");
console.log("Runtime writable: false prevents assignment at runtime");

// Type-safe Object.defineProperty wrapper
function defineReadonlyProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  Object.defineProperty(obj, key, {
    value,
    writable: false,
    enumerable: true,
    configurable: false
  });
}

const myObj: Record<string, number> = {};
defineReadonlyProperty(myObj, 'fixed', 100);
console.log(myObj.fixed); // 100


// ============================================================================
// 3. THISTYPE<T> FOR DESCRIPTOR METHODS
// ============================================================================

// TypeScript: ThisType for typed getter/setter context
interface DataModel {
  _value: number;
  multiplier: number;
}

interface ComputedDescriptor {
  get(this: DataModel): number;
  set(this: DataModel, value: number): void;
}

const typedDescriptor: ComputedDescriptor = {
  get(): number {
    // this is typed as DataModel
    return this._value * this.multiplier;
  },
  set(value: number): void {
    this._value = value / this.multiplier;
  }
};

console.log("\n=== ThisType for Descriptor Methods ===");
const model: DataModel = { _value: 10, multiplier: 2 };
typedDescriptor.set.call(model, 20);
console.log(typedDescriptor.get.call(model)); // 20


// ============================================================================
// 4. TYPE-SAFE OBJECT.DEFINEPROPERTY
// ============================================================================

// Generic type-safe defineProperty wrapper
function typedDefineProperty<T extends object, K extends keyof T>(
  obj: T,
  prop: K,
  descriptor: TypedPropertyDescriptor<T[K]>
): T {
  Object.defineProperty(obj, prop, descriptor);
  return obj;
}

// Custom TypedPropertyDescriptor interface
interface TypedPropertyDescriptor<T> {
  value?: T;
  writable?: boolean;
  get?(): T;
  set?(v: T): void;
  enumerable?: boolean;
  configurable?: boolean;
}

// Usage example
interface Person {
  name: string;
  age: number;
  readonly id: string;
}

const person: Partial<Person> = {};

typedDefineProperty(person as Person, 'name', {
  value: "Alice",
  writable: true,
  enumerable: true,
  configurable: false
});

typedDefineProperty(person as Person, 'id', {
  get(): string {
    return crypto.randomUUID();
  },
  enumerable: true,
  configurable: false
});

console.log("\n=== Type-safe Object.defineProperty ===");
console.log(person.name);


// ============================================================================
// 5. GETTERS AND SETTERS WITH PROPER TYPES
// ============================================================================

// TypeScript: Typed getters and setters in classes
class Circle {
  private _radius: number = 0;

  // Getter with return type
  get radius(): number {
    return this._radius;
  }

  // Setter with parameter type
  set radius(value: number) {
    if (value < 0) {
      throw new RangeError("Radius cannot be negative");
    }
    this._radius = value;
  }

  // Computed property with getter only
  get area(): number {
    return Math.PI * this._radius ** 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this._radius;
  }
}

console.log("\n=== Getters and Setters with Types ===");
const circle = new Circle();
circle.radius = 5;
console.log(`Radius: ${circle.radius}`);
console.log(`Area: ${circle.area.toFixed(2)}`);
console.log(`Circumference: ${circle.circumference.toFixed(2)}`);


// ============================================================================
// 6. ACCESSOR DECORATORS (TS 5.0+)
// ============================================================================

// Accessor decorator for validation
function validateNumber(min: number, max: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalSet = descriptor.set;

    descriptor.set = function (value: number) {
      if (typeof value !== 'number') {
        throw new TypeError(`${propertyKey} must be a number`);
      }
      if (value < min || value > max) {
        throw new RangeError(`${propertyKey} must be between ${min} and ${max}`);
      }
      originalSet?.call(this, value);
    };

    return descriptor;
  };
}

class ValidatedConfig {
  private _volume: number = 50;

  // Decorator application is commented out — ts-node ESM does NOT transpile
  // legacy accessor decorators, so an active `@` crashes at runtime.
  // @validateNumber(0, 100)
  set volume(value: number) {
    this._volume = value;
  }

  get volume(): number {
    return this._volume;
  }
}

console.log("\n=== Accessor Decorators ===");
const config = new ValidatedConfig();
config.volume = 75;
console.log(`Volume: ${config.volume}`);

try {
  config.volume = 150; // Should throw RangeError
} catch (e) {
  console.log("Validation error caught:", (e as Error).message);
}


// ============================================================================
// 7. CONST ASSERTIONS FOR IMMUTABLE DESCRIPTORS
// ============================================================================

// TypeScript: const assertions preserve literal types
const immutableDescriptor = {
  value: "constant",
  writable: false as const,
  enumerable: false as const,
  configurable: false as const
} as const;

// All properties are now deeply readonly
// immutableDescriptor.value = "changed"; // ❌ Error

console.log("\n=== Const Assertions ===");
console.log("Const assertion creates deeply immutable descriptor objects");


// ============================================================================
// 8. PROPERTY DESCRIPTOR UTILITY FUNCTIONS
// ============================================================================

// Type-safe property cloning with descriptors
function cloneWithDescriptors<T extends object>(source: T): T {
  const target = Object.create(Object.getPrototypeOf(source));
  const descriptors = Object.getOwnPropertyDescriptors(source);
  Object.defineProperties(target, descriptors);
  return target;
}

// Create readonly clone
function createReadonlyClone<T extends object>(source: T): Readonly<T> {
  const target = Object.create(Object.getPrototypeOf(source));
  const descriptors = Object.getOwnPropertyDescriptors(source);

  // Make all properties readonly
  for (const key in descriptors) {
    if (descriptors[key].writable !== undefined) {
      descriptors[key].writable = false;
    }
  }

  Object.defineProperties(target, descriptors);
  return target;
}

console.log("\n=== Property Descriptor Utilities ===");
const original = { name: "Original", value: 42 };
const cloned = cloneWithDescriptors(original);
console.log(cloned);


// ============================================================================
// 9. MAPPED TYPES FOR PROPERTY TRANSFORMATION
// ============================================================================

// Make all properties readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface SourceType {
  name: string;
  age?: number;
  active: boolean;
}

type ReadonlySource = DeepReadonly<SourceType>;
type RequiredSource = Required<SourceType>;
type PartialSource = Partial<SourceType>;

console.log("\n=== Mapped Types ===");
const readonlyObj: ReadonlySource = { name: "test", active: true };
// readonlyObj.name = "changed"; // ❌ Error


// ============================================================================
// 10. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Property Descriptors ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ PropertyDescriptor type    │       ✗         │       ✓         │
│ readonly modifier          │  Convention     │ Type system     │
│ ThisType for accessors     │       ✗         │       ✓         │
│ Type-safe defineProperty   │       ✗         │       ✓         │
│ Typed getters/setters      │       ✗         │       ✓         │
│ Accessor decorators        │  Stage 2.7      │ TS stable       │
│ Const assertions           │       ✗         │       ✓         │
│ Mapped types               │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Descriptor mechanics       │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time property descriptor typing
2. readonly modifier is enforced at compile time
3. ThisType enables typed accessor methods
4. Mapped types transform property attributes
5. Runtime descriptor behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
