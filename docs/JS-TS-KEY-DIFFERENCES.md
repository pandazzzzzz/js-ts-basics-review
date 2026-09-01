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

// ⚠️ CRITICAL PITFALL: ?? vs || with numeric 0
const zeroPort = 0;
const wrong = zeroPort || 3000;  // 3000 (0 is falsy - WRONG!)
const right = zeroPort ?? 3000;  // 0 (0 is not nullish - CORRECT!)
```

### 8. Logical Assignment Operators (ES2021)

| Operator | Behavior | Use Case |
|----------|---------|----------|
| `||=` | Assign if falsy | Set defaults for falsy values |
| `&&=` | Assign if truthy | Update only when truthy |
| `??=` | Assign if nullish | Set defaults preserving 0, "", false |

```javascript
let config = { port: 0 };
config.port ??= 3000; // Stays 0 (not nullish)
config.host ??= "localhost"; // Becomes "localhost" (undefined)
```

⚠️ **Critical**: `??=` preserves `0`, `""`, `false` unlike `||=`

**See**: `demo/06-advanced/39-es2022-plus-features.js`

### 9. Variable Declarations (Same in Both)

| Keyword | Scope | Hoisting | Reassignable | Redeclarable |
|---------|-------|----------|--------------|--------------|
| `var` | Function | Yes (undefined) | ✅ Yes | ✅ Yes |
| `let` | Block | TDZ* | ✅ Yes | ❌ No |
| `const` | Block | TDZ* | ❌ No | ❌ No |

*TDZ = Temporal Dead Zone (ReferenceError before declaration)

### 10. Best Practices Checklist

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
- [ ] Use logical assignment (`??=`) for defaults preserving `0`, `""`, `false`
- [ ] Use `Object.hasOwn()` instead of `hasOwnProperty` (ES2022)
- [ ] Use immutable array methods (`toSorted`, etc.) for safety (ES2023)

#### ❌ DON'T:
- [ ] Use `var` (use `const` or `let`)
- [ ] Use `any` unless absolutely necessary
- [ ] Disable strict mode in TypeScript
- [ ] Use type assertions without validation
- [ ] Ignore TypeScript errors with `@ts-ignore`
- [ ] Mix `null` and `undefined` carelessly
- [ ] Rely on implicit type widening

### 11. Migration Tips: JS → TS

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

### 12. Quick Syntax Reference

> **Note**: See demo files for comprehensive examples with TypeScript comparisons

**Basic Types**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`

**Union Types**: `string | number` - multiple possible types

**Literal Types**: `"on" | "off"` - specific values only

**Arrays**: `number[]` or `Array<number>`

**Objects**: 
```typescript
interface User {
  name: string;
  age: number;
  email?: string;      // Optional
  readonly id: number; // Readonly
}
```

**Functions**: 
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

**Type Guards**: `typeof value === "string"` - runtime type narrowing

**See**: 
- `demo/01-basics/01-variables-ts-comparison.ts` - Type annotations
- `demo/02-data-structures/08-objects-ts-comparison.ts` - Interfaces
- `demo/06-advanced/47-metaprogramming-ts-comparison.ts` - Advanced types

### 13. TypeScript Utility Types

| Type | Purpose |
|------|---------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties readonly |
| `Pick<T, K>` | Select specific properties |
| `Omit<T, K>` | Remove specific properties |

**See**: `demo/06-advanced/47-metaprogramming-ts-comparison.ts` for utility types examples

### 14. Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Type 'null' is not assignable to type 'number'` | strictNullChecks enabled | Use `number \| null` |
| `Object is possibly 'null'` | Accessing nullable object | Use optional chaining `?.` or null check |
| `Cannot find name 'X'` | Variable not declared | Add declaration or import |
| `Type 'any' is not assignable to type 'X'` | Implicit any | Add explicit type annotation |
| `Property 'X' does not exist on type 'Y'` | Wrong type or typo | Check type definition or property name |

### 15. Advanced Function Concepts

> **Note**: See `demo/02-data-structures/07-functions.js` for comprehensive examples (16 sections)

**IIFE** (Immediately Invoked Function Expression): Module pattern for encapsulation

**Pure Functions**: Same input → same output, no side effects

**Function Composition**: 
- `compose(f, g)(x)` = f(g(x)) - right-to-left
- `pipe(f, g)(x)` = g(f(x)) - left-to-right

**See**: `demo/02-data-structures/07-functions.js` sections 13-16

### 16. Modern ES Features (ES2021-ES2027)

#### Immutable Array Methods (ES2023)
| Method | Description | Mutates? |
|--------|-------------|----------|
| `toSorted()` | Returns sorted copy | No |
| `toReversed()` | Returns reversed copy | No |
| `toSpliced()` | Returns spliced copy | No |
| `with(i, v)` | Returns copy with value | No |

#### Resource Management (ES2027 / TS 5.2+)
```typescript
// using declaration - automatic cleanup (ES2027, Stage 4)
using file = new FileHandle("data.txt");
// file[Symbol.dispose]() called at block end

await using db = new DatabaseConnection();
// db[Symbol.asyncDispose]() called at block end
```

Note: `using` reached conditional Stage 4 in May 2025; all conditions were met and it advanced to full Stage 4 in May 2026 (ES2027). TypeScript 5.2+ supports the syntax.

**See**: `demo/06-advanced/39-es2022-plus-features.js`

---

## 📚 Resources

- **JavaScript**: [JavaScript.info](https://javascript.info) · [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Practice Files**: 49 numbered demo files (01-50, 28 reserved) in `demo/` folder, each with TypeScript comparison and a structured learning-goals intro

---

**Last Updated**: 2026-08-20
**Based on**: ES2027 and TypeScript 5.x
**Reviewed**: ✅ Verified against MDN, TypeScript official docs, TC39 proposals
