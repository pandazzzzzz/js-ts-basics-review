// TypeScript vs JavaScript: Arrays Comparison
// 📘 For JavaScript examples, see: 03-arrays.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
export {};

// ============================================================================
// 1. ARRAY TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No type checking
// const jsNumbers = [1, 2, 3];
// jsNumbers.push("four"); // ✅ Allowed (runtime error risk)
// jsNumbers.push(true);   // ✅ Allowed (runtime error risk)

// TypeScript: Explicit type annotations
const tsNumbers: number[] = [1, 2, 3];
// tsNumbers.push("four"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// Alternative syntax (equivalent)
const tsNumbersAlt: Array<number> = [1, 2, 3];

console.log("=== Array Type Annotations ===");
console.log("Numbers:", tsNumbers);

// ⚠️ PITFALL: Type inference
const inferred = [1, 2, 3]; // Inferred as number[]
inferred.push(4); // ✅ OK
// inferred.push("five"); // ❌ Error

// ⚠️ PITFALL: Mixed type arrays
const mixed = [1, "two", true]; // Inferred as (number | string | boolean)[]
mixed.push(42); // ✅ OK
mixed.push("hello"); // ✅ OK
// mixed.push(null); // ❌ Error: null not in union type

// ✅ BEST PRACTICE: Be explicit with array types
const explicit: number[] = [1, 2, 3];
const unionArray: (number | string)[] = [1, "two", 3];


// ============================================================================
// 2. READONLY ARRAYS - IMMUTABILITY
// ============================================================================

// JavaScript: const only prevents reassignment, not mutation
// const jsArray = [1, 2, 3];
// jsArray.push(4);    // ✅ Allowed
// jsArray[0] = 99;    // ✅ Allowed
// jsArray = [4, 5, 6]; // ❌ Error: Assignment to constant variable

// TypeScript: readonly prevents mutation
const readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4);    // ❌ Error: Property 'push' does not exist on type 'readonly number[]'
// readonlyArray[0] = 99;    // ❌ Error: Index signature in type 'readonly number[]' only permits reading
// readonlyArray = [4, 5, 6]; // ❌ Error: Cannot assign to 'readonlyArray' because it is a constant

console.log("\n=== Readonly Arrays ===");
console.log("Readonly array:", readonlyArray);

// Alternative syntax
const readonlyAlt: ReadonlyArray<number> = [1, 2, 3];

// ⚠️ PITFALL: readonly is shallow
const nestedArray: readonly number[][] = [[1, 2], [3, 4]];
// nestedArray.push([5, 6]); // ❌ Error: Cannot push to outer array
nestedArray[0].push(99);     // ✅ Allowed! Inner array is mutable

console.log("Nested array after mutation:", nestedArray); // [[1, 2, 99], [3, 4]]

// ✅ SOLUTION: Deep readonly
const deepReadonly: readonly (readonly number[])[] = [[1, 2], [3, 4]];
// deepReadonly[0].push(99); // ❌ Error: Now inner arrays are readonly too


// ============================================================================
// 3. TUPLE TYPES - FIXED LENGTH & TYPES
// ============================================================================

// JavaScript: Arrays have no fixed length or per-position types
// const jsPair = [1, "hello"];
// jsPair.push(true);  // ✅ Allowed
// const [num, str] = jsPair; // No type checking

// TypeScript: Tuples have fixed length and per-position types
const tsPair: [number, string] = [1, "hello"];
const [num, str] = tsPair; // num: number, str: string

console.log("\n=== Tuple Types ===");
console.log("Tuple:", tsPair);
console.log("First element (number):", num);
console.log("Second element (string):", str);

// ⚠️ PITFALL: Tuple length not enforced with push/pop
const tuple: [number, string] = [1, "hello"];
tuple.push(999); // ⚠️ Allowed! (TypeScript limitation)
console.log("Tuple after push:", tuple); // [1, "hello", 999] - breaks tuple contract!

// ✅ SOLUTION: Use readonly tuples
const readonlyTuple: readonly [number, string] = [1, "hello"];
// readonlyTuple.push(999); // ❌ Error: Property 'push' does not exist

// Optional tuple elements
type Point2D = [number, number];
type Point3D = [number, number, number?]; // z is optional

const point2D: Point3D = [10, 20];       // ✅ OK
const point3D: Point3D = [10, 20, 30];   // ✅ OK

const [x, y, z] = point2D; // z: number | undefined
console.log("Point 2D:", { x, y, z });

// Named tuple elements (TypeScript 4.0+)
type RGB = [red: number, green: number, blue: number];
const color: RGB = [255, 128, 0];
console.log("Color:", color);


// ============================================================================
// 4. ARRAY METHOD TYPE SAFETY
// ============================================================================

console.log("\n=== Array Method Type Safety ===");

// map() - Type transformation
const numbers: number[] = [1, 2, 3];
const strings = numbers.map(n => n.toString()); // Inferred as string[]
console.log("Mapped to strings:", strings);

// ❌ Type error caught at compile time
// const wrong = numbers.map(n => n.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'number'

// filter() - Type narrowing issue
const mixedArray: (number | string)[] = [1, "two", 3, "four"];
const numbersOnly = mixedArray.filter(x => typeof x === "number"); // Still (number | string)[]

// ⚠️ PITFALL: filter() doesn't narrow types automatically
// numbersOnly[0].toFixed(2); // ❌ Error: Property 'toFixed' does not exist on type 'string | number'

// ✅ SOLUTION: Use type predicate (type guard)
const isNumber = (x: any): x is number => typeof x === "number";
const properlyFiltered = mixedArray.filter(isNumber); // Now number[]
console.log("Properly filtered:", properlyFiltered);
console.log("First element fixed:", properlyFiltered[0].toFixed(2)); // ✅ OK

// reduce() - Accumulator type inference
const sum = numbers.reduce((acc, n) => acc + n, 0); // number
console.log("Sum:", sum);

// ⚠️ PITFALL: Empty object needs type assertion
const numberMap = numbers.reduce((acc, n) => {
  acc[n] = n * 2;
  return acc;
}, {} as Record<number, number>); // Need type assertion
console.log("Number map:", numberMap);

// find() - Returns T | undefined
const found = numbers.find(n => n > 2); // number | undefined
// found.toFixed(2); // ❌ Error: Object is possibly 'undefined'

// ✅ SOLUTIONS:
// 1. Optional chaining
console.log("Found with optional chaining:", found?.toFixed(2));

// 2. Type narrowing
if (found !== undefined) {
  console.log("Found with type narrowing:", found.toFixed(2)); // ✅ OK
}

// 3. Non-null assertion (use carefully!)
// console.log("Found with assertion:", found!.toFixed(2)); // ⚠️ Runtime error if undefined


// ============================================================================
// 5. ARRAY DESTRUCTURING WITH TYPES
// ============================================================================

console.log("\n=== Array Destructuring with Types ===");

// Basic destructuring with type annotation
const [first, second, ...rest]: [number, number, ...number[]] = [1, 2, 3, 4, 5];
console.log({ first, second, rest }); // first: number, second: number, rest: number[]

// Tuple destructuring
const coordinate: [number, number] = [10, 20];
const [coordX, coordY] = coordinate; // coordX: number, coordY: number
console.log("Coordinates:", { coordX, coordY });

// ⚠️ PITFALL: Destructuring beyond tuple length
const pair: [number, string] = [1, "hello"];
const [a, b, c] = pair; // c: undefined (but TypeScript doesn't warn!)
console.log("Destructured:", { a, b, c });


// ============================================================================
// 6. CONST ASSERTIONS FOR LITERAL TYPES
// ============================================================================

console.log("\n=== Const Assertions ===");

// Without const assertion
const mutableArray = [1, 2, 3]; // number[]
mutableArray.push(4); // ✅ OK
mutableArray[0] = 99; // ✅ OK

// With const assertion
const literalArray = [1, 2, 3] as const; // readonly [1, 2, 3]
// literalArray.push(4);  // ❌ Error: Property 'push' does not exist
// literalArray[0] = 99;  // ❌ Error: Cannot assign to '0' because it is a read-only property

type FirstElement = typeof literalArray[0]; // 1 (literal type, not number)
console.log("Literal array:", literalArray);

// Const assertion with objects in arrays
const config = [
  { name: "dev", port: 3000 },
  { name: "prod", port: 8080 }
] as const;

// config[0].port = 4000; // ❌ Error: Cannot assign to 'port' because it is a read-only property
type ConfigName = typeof config[0]["name"]; // "dev" (literal type)


// ============================================================================
// 7. ARRAY UTILITY TYPES
// ============================================================================

console.log("\n=== Array Utility Types ===");

// Extract element type from array type
type StringArray = string[];
type ElementType = StringArray[number]; // string

// Non-empty array type
type NonEmptyArray<T> = [T, ...T[]];

const validNonEmpty: NonEmptyArray<number> = [1, 2, 3]; // ✅ OK
// const invalidNonEmpty: NonEmptyArray<number> = []; // ❌ Error: Source has 0 element(s) but target requires 1

console.log("Non-empty array:", validNonEmpty);

// Fixed-length array types
type Pair<T> = [T, T];
type Triple<T> = [T, T, T];

const pairExample: Pair<number> = [1, 2]; // ✅ OK
const tripleExample: Triple<string> = ["a", "b", "c"]; // ✅ OK

// Variadic tuple types (TypeScript 4.0+)
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]


// ============================================================================
// 8. SPARSE ARRAYS AND UNDEFINED
// ============================================================================

console.log("\n=== Sparse Arrays ===");

// JavaScript: Sparse arrays have "holes"
// const jsSparse = [1, , 3]; // [1, empty, 3]

// TypeScript: Sparse arrays are typed as (T | undefined)[]
const tsSparse: (number | undefined)[] = [1, undefined, 3];
console.log("Sparse array:", tsSparse);
console.log("Length:", tsSparse.length); // 3
console.log("Has index 1:", 1 in tsSparse); // true (unlike JS sparse arrays)

// ⚠️ PITFALL: Array constructor creates sparse arrays
const sparseFromConstructor = new Array(3); // [empty × 3]
console.log("Sparse from constructor:", sparseFromConstructor);

// ✅ BEST PRACTICE: Use Array.from or fill
const filledArray = Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
const filledWithValue = new Array(3).fill(0); // [0, 0, 0]
console.log("Filled arrays:", { filledArray, filledWithValue });


// ============================================================================
// 9. ARRAY METHODS RETURN TYPES
// ============================================================================

console.log("\n=== Array Methods Return Types ===");

const testArray: number[] = [1, 2, 3, 4, 5];

// Methods that return new arrays
const mapped: number[] = testArray.map(n => n * 2);
const filtered: number[] = testArray.filter(n => n > 2);
const sliced: number[] = testArray.slice(1, 3);
const concatenated: number[] = testArray.concat([6, 7]);

// Methods that return single values
const reduced: number = testArray.reduce((a, b) => a + b, 0);
const foundValue: number | undefined = testArray.find(n => n > 3);
const foundIndex: number = testArray.findIndex(n => n > 3); // -1 if not found
const includes: boolean = testArray.includes(3);
const some: boolean = testArray.some(n => n > 4);
const every: boolean = testArray.every(n => n > 0);

// Methods that return void
testArray.forEach(n => console.log(n)); // void

console.log("Method return types verified");


// ============================================================================
// 10. COMMON PITFALLS: JS vs TS ARRAYS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Array<T> vs T[] - They're equivalent!
type ArraySyntax1 = Array<number>;
type ArraySyntax2 = number[];
// Both are the same, but T[] is more concise for simple types

// PITFALL 2: Empty array initialization
const emptyArray = []; // Inferred as any[]
emptyArray.push(1);    // ✅ OK
emptyArray.push("two"); // ✅ OK (dangerous!)

// ✅ SOLUTION: Specify type
const typedEmpty: number[] = [];
typedEmpty.push(1);    // ✅ OK
// typedEmpty.push("two"); // ❌ Error

// PITFALL 3: Readonly doesn't prevent reassignment of elements (only mutation)
const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers[0] = 99; // ❌ Error: Index signature only permits reading
// But you can still create a new array and assign it to a new variable

// PITFALL 4: Tuple push/pop not prevented
const mutableTuple: [number, string] = [1, "hello"];
mutableTuple.push(999); // ⚠️ Allowed (TypeScript limitation)
console.log("Mutable tuple after push:", mutableTuple);

// PITFALL 5: Type widening with const
const widenedArray = [1, 2, 3]; // number[] (widened)
const literalArrayConst = [1, 2, 3] as const; // readonly [1, 2, 3] (literal)


// ============================================================================
// 11. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Always specify array types explicitly for function parameters and return values
2. Use readonly for arrays that shouldn't be mutated
3. Use tuples for fixed-length arrays with different types per position
4. Use type predicates with filter() for proper type narrowing
5. Use const assertions (as const) for literal array types
6. Prefer T[] syntax for simple types, Array<T> for complex types
7. Use NonEmptyArray<T> type for arrays that must have at least one element
8. Handle undefined properly when using find(), findIndex(), etc.
9. Use Array.from() or fill() instead of Array constructor for initialization
10. Enable strict mode in tsconfig.json for better type safety

❌ DON'T:
1. Use any[] unless absolutely necessary
2. Rely on implicit any for empty arrays
3. Forget that readonly is shallow for nested arrays
4. Use push/pop on tuples (use readonly tuples instead)
5. Ignore undefined possibility from find() and similar methods
6. Mix null and undefined in array types carelessly
7. Use type assertions instead of type guards with filter()
8. Create sparse arrays with Array constructor
9. Forget to specify accumulator type in reduce() for complex objects
10. Use non-null assertion (!) without proper validation

⚠️ WATCH OUT FOR:
1. filter() doesn't narrow types automatically - use type predicates
2. readonly is shallow - nested arrays/objects are still mutable
3. Tuple length not enforced with push/pop - use readonly tuples
4. Empty array [] inferred as any[] - always specify type
5. find() returns T | undefined - handle undefined case
6. reduce() with empty object needs type assertion
7. Const assertion makes array deeply readonly
8. Array constructor creates sparse arrays
9. Type widening with const vs as const
10. Destructuring beyond tuple length doesn't error

🎯 MIGRATION TIPS: JS → TS
1. Add type annotations to all array declarations
2. Replace any[] with proper types
3. Use readonly for immutable arrays
4. Convert fixed-length arrays to tuples
5. Add type predicates to filter() calls
6. Handle undefined from find() and similar methods
7. Use const assertions for literal arrays
8. Replace Array constructor with Array.from() or fill()
9. Enable strictNullChecks in tsconfig.json
10. Use utility types like NonEmptyArray<T> where appropriate

📘 SUMMARY: TYPESCRIPT BENEFITS FOR ARRAYS
✅ Compile-time type safety prevents runtime errors
✅ Better IDE autocomplete and refactoring
✅ Self-documenting code with explicit types
✅ Readonly arrays prevent accidental mutations
✅ Tuples provide fixed-length type safety
✅ Type predicates enable proper type narrowing
✅ No runtime performance cost (types are erased)

⚠️ Learning curve for advanced types
⚠️ Some edge cases (tuple push, shallow readonly)
⚠️ Requires build step

🎯 RECOMMENDATION: Use TypeScript for production code, especially in teams!
*/

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime behavior follows JavaScript rules ===");
