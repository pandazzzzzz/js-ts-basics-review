# JavaScript vs TypeScript: Key Differences Quick Reference

## 🎯 Critical Points to Remember

### 1. Type System

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| Type Checking | Runtime only | Compile-time + Runtime |
| Type Annotations | ❌ Not available | ✅ Required/Optional |
| Type Inference | ❌ No | ✅ Yes |
| Type Safety | ❌ No | ✅ Yes |

### 2. Null and Undefined Handling ⚠️ MAJOR DIFFERENCE

```javascript
// JavaScript - Always allows null/undefined
let jsNumber = 42;
jsNumber = null;      // ✅ OK (dangerous!)
jsNumber = undefined; // ✅ OK (dangerous!)
```

```typescript
// TypeScript with strictNullChecks: true (recommended)
let tsNumber: number = 42;
tsNumber = null;      // ❌ Error
tsNumber = undefined; // ❌ Error

// ✅ Correct way: Use union types
let safeNumber: number | null = 42;
safeNumber = null; // ✅ OK
```

**🔴 CRITICAL**: Always enable `strictNullChecks` in `tsconfig.json`!

### 3. Common Pitfalls & Confusions

#### Pitfall 1: typeof null (Both JS & TS)
```javascript
typeof null === "object" // ✅ true (historical bug!)
typeof undefined === "undefined" // ✅ true

// ✅ Correct null check:
value === null // Use strict equality
```

#### Pitfall 2: NaN Comparison
```javascript
NaN === NaN // ❌ false (always!)
Number.isNaN(NaN) // ✅ true (correct way)
```

#### Pitfall 3: Type Assertions Don't Validate
```typescript
// ⚠️ TypeScript won't catch this runtime error:
let wrong = (42 as any) as string;
wrong.toUpperCase(); // 💥 Runtime error!

// ✅ Use type guards instead:
if (typeof value === "string") {
  value.toUpperCase(); // Safe!
}
```

#### Pitfall 4: 'any' Defeats TypeScript
```typescript
let dangerous: any = 42;
dangerous.nonExistentMethod(); // ❌ No error, but crashes at runtime!

// ✅ Use 'unknown' instead:
let safe: unknown = 42;
// safe.nonExistentMethod(); // ✅ Error caught at compile time
```

### 4. TypeScript Special Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| `any` | Disables type checking | ❌ Avoid! Only for migration |
| `unknown` | Type-safe any | ✅ When type is truly unknown |
| `never` | Never returns | Functions that throw/infinite loop |
| `void` | No return value | Functions with no return |
| `null` | Intentional empty | Explicitly empty values |
| `undefined` | Not initialized | Missing/optional values |

### 5. Union Types (TypeScript Feature)

```typescript
// ✅ Restrict to specific values
type Status = "pending" | "approved" | "rejected";
let status: Status = "pending"; // ✅ OK
// status = "invalid"; // ❌ Error

// ✅ Allow multiple types
let flexible: string | number = "hello";
flexible = 42; // ✅ OK

// ✅ Nullable types
let nullable: string | null = null; // ✅ OK
```

### 6. Type Narrowing (TypeScript Feature)

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}
```

### 7. Optional Chaining & Nullish Coalescing (Both JS & TS)

```javascript
// Optional Chaining (?.) - ES2020+
const port = config?.server?.port; // undefined if any part is null/undefined

// Nullish Coalescing (??) - ES2020+
const defaultPort = port ?? 3000; // Use 3000 only if port is null/undefined

// ⚠️ CONFUSION: ?? vs ||
const a = 0 || 100;  // 100 (0 is falsy)
const b = 0 ?? 100;  // 0 (0 is not null/undefined)
```

### 8. Variable Declarations (Same in Both)

| Keyword | Scope | Hoisting | Reassignable | Redeclarable |
|---------|-------|----------|--------------|--------------|
| `var` | Function | Yes (undefined) | ✅ Yes | ✅ Yes |
| `let` | Block | TDZ* | ✅ Yes | ❌ No |
| `const` | Block | TDZ* | ❌ No | ❌ No |

*TDZ = Temporal Dead Zone (ReferenceError before declaration)

### 9. Best Practices Checklist

#### ✅ DO:
- [ ] Enable `strictNullChecks` in TypeScript
- [ ] Use `const` by default, `let` when needed
- [ ] Use union types for nullable values (`string | null`)
- [ ] Prefer `unknown` over `any`
- [ ] Use type guards instead of type assertions
- [ ] Be explicit with function parameter types
- [ ] Use literal types for fixed value sets
- [ ] Use optional chaining (`?.`) for safe property access
- [ ] Use nullish coalescing (`??`) for default values

#### ❌ DON'T:
- [ ] Use `var` (use `const` or `let`)
- [ ] Use `any` unless absolutely necessary
- [ ] Disable strict mode in TypeScript
- [ ] Use type assertions without validation
- [ ] Ignore TypeScript errors with `@ts-ignore`
- [ ] Mix `null` and `undefined` carelessly
- [ ] Rely on implicit type widening

### 10. Migration Tips: JS → TS

1. **Start with `any`**, gradually add types
2. **Enable strict mode** incrementally:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "strictNullChecks": true,
       "noImplicitAny": true
     }
   }
   ```
3. **Add types to function signatures** first
4. **Use union types** for nullable values
5. **Replace `any` with `unknown`** where possible
6. **Add interfaces** for object shapes
7. **Use type guards** for runtime checks

### 11. Quick Syntax Reference

```typescript
// Type Annotations
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;

// Union Types
let id: string | number = "123";

// Literal Types
let status: "on" | "off" = "on";

// Arrays
let numbers: number[] = [1, 2, 3];
let mixed: (string | number)[] = [1, "two", 3];

// Objects
interface User {
  name: string;
  age: number;
  email?: string; // Optional
  readonly id: number; // Readonly
}

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Type Aliases
type Point = { x: number; y: number };

// Type Assertions
let value = someValue as string;

// Non-null Assertion (use carefully!)
let name = user!.name;

// Type Guards
if (typeof value === "string") {
  // value is string here
}
```

### 12. Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Type 'null' is not assignable to type 'number'` | strictNullChecks enabled | Use `number \| null` |
| `Object is possibly 'null'` | Accessing nullable object | Use optional chaining `?.` or null check |
| `Cannot find name 'X'` | Variable not declared | Add declaration or import |
| `Type 'any' is not assignable to type 'X'` | Implicit any | Add explicit type annotation |
| `Property 'X' does not exist on type 'Y'` | Wrong type or typo | Check type definition or property name |

### 13. Advanced Function Concepts

#### IIFE (Immediately Invoked Function Expression)
```javascript
// Module pattern with IIFE
const myModule = (function() {
  let privateVar = 0;
  return {
    increment: () => ++privateVar,
    getValue: () => privateVar
  };
})();
```

#### Pure Functions
```javascript
// ✅ Pure function - same input always gives same output, no side effects
const add = (a, b) => a + b;

// ❌ Impure function - depends on external state
let total = 0;
const addToTotal = (n) => total += n;
```

#### Function Composition
```typescript
// Compose functions right-to-left
const compose = <T>(...fns: Function[]) => 
  (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe functions left-to-right
const pipe = <T>(...fns: Function[]) => 
  (x: T) => fns.reduce((acc, fn) => fn(acc), x);
```

**See**: `demo/data-structures/06-functions.js` sections 13-16 for comprehensive examples

---

## 📚 Resources

- **JavaScript**: [JavaScript.info](https://javascript.info)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Practice Files**:
  - `demo/01-basics/01-variables.js` + `demo/01-basics/01-variables-ts-comparison.ts`
  - `demo/02-data-structures/06-arrays.js` + `demo/02-data-structures/06-arrays-ts-comparison.ts`
  - `demo/02-data-structures/07-functions.js` + `demo/02-data-structures/07-functions-ts-comparison.ts` (16 sections, 1100+ lines)
  - `demo/02-data-structures/08-objects.js` + `demo/02-data-structures/08-objects-ts-comparison.ts`
  - `demo/02-data-structures/09-destructuring.js` + `demo/02-data-structures/09-destructuring-ts-comparison.ts`
  - `demo/02-data-structures/10-map-set.js` + `demo/02-data-structures/10-map-set-ts-comparison.ts`
  - `demo/02-data-structures/11-json.js` + `demo/02-data-structures/11-json-ts-comparison.ts`
  - `demo/02-data-structures/12-date-time.js` + `demo/02-data-structures/12-date-time-ts-comparison.ts`
  - `demo/03-core-concepts/13-scope-closures.js`
  - `demo/03-core-concepts/20-error-handling.js`
  - `demo/03-core-concepts/15-prototypes-inheritance.js`
  - `demo/03-core-concepts/18-modern-features.js`
  - `demo/04-asynchronous/24-event-loop-callbacks.js`
  - `demo/04-asynchronous/25-promises.js`
  - `demo/04-asynchronous/26-async-await.js`
  - `demo/04-asynchronous/27-modules.js`

---

**Last Updated**: 2026-02-16  
**Based on**: ES2020+ and TypeScript 5.x
