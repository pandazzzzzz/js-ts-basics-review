// Control Flow and Control Structures Demo
// 📘 For TypeScript comparison, see: 08-control-flow-ts-comparison.ts

// ============================================
// If/Else Statements
// ============================================

// if statement - Executes code block if condition is true (ES1)
// - Condition is evaluated as boolean (truthy/falsy)
// - Curly braces optional for single statement (but recommended)
// - Use case: conditional logic, validation, branching
const temperature = 25;

if (temperature > 30) {
  console.log("It's hot outside!");
}

// if-else statement - Provides alternative execution path (ES1)
// - else block executes when if condition is false
// - Use case: binary decisions, toggle behavior
const age = 20;

if (age >= 18) {
  console.log("You are an adult");
} else {
  console.log("You are a minor");
}

// if-else if-else chain - Multiple conditions (ES1)
// - Evaluates conditions in order, stops at first true
// - else is optional (catches all remaining cases)
// - Use case: multiple exclusive conditions, grading systems
const score = 85;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else if (score >= 60) {
  grade = "D";
} else {
  grade = "F";
}

console.log("If/Else Statements:");
console.log({ temperature, age, score, grade });

// Nested if statements - if inside if (ES1)
// - Can nest to any depth
// - Common pitfall: deep nesting reduces readability
// - Best practice: use early returns or guard clauses
const isLoggedIn = true;
const hasPermission = true;

if (isLoggedIn) {
  if (hasPermission) {
    console.log("Access granted");
  } else {
    console.log("Permission denied");
  }
} else {
  console.log("Please log in");
}

// Truthy and Falsy values in conditions (ES1)
// - Falsy: false, 0, -0, 0n, "", null, undefined, NaN
// - Everything else is truthy (including [], {}, "0", "false")
console.log("\nTruthy/Falsy in Conditions:");

if (0) {
  console.log("This won't print");
}

if ("") {
  console.log("This won't print");
}

if ([]) {
  console.log("Empty array is truthy!"); // This prints!
}

if ({}) {
  console.log("Empty object is truthy!"); // This prints!
}

// ============================================
// Switch Statements
// ============================================

// switch statement - Multi-way branch based on value (ES3)
// - Uses strict equality (===) for comparison
// - break statement prevents fall-through
// - default case is optional (catches unmatched values)
// - Use case: multiple discrete values, menu systems, state machines
const day = 3;
let dayName;

switch (day) {
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  case 4:
    dayName = "Thursday";
    break;
  case 5:
    dayName = "Friday";
    break;
  case 6:
    dayName = "Saturday";
    break;
  case 7:
    dayName = "Sunday";
    break;
  default:
    dayName = "Invalid day";
}

console.log("\nSwitch Statement:");
console.log({ day, dayName });

// Switch with fall-through - Intentional omission of break (ES3)
// - Multiple cases can share same code block
// - Common pitfall: forgetting break causes unintended fall-through
// - Use case: grouping similar cases, cascading logic
const month = 2;
let season;

switch (month) {
  case 12:
  case 1:
  case 2:
    season = "Winter";
    break;
  case 3:
  case 4:
  case 5:
    season = "Spring";
    break;
  case 6:
  case 7:
  case 8:
    season = "Summer";
    break;
  case 9:
  case 10:
  case 11:
    season = "Autumn";
    break;
  default:
    season = "Invalid month";
}

console.log({ month, season });

// Switch with expressions - Cases can be expressions (ES3)
// - Case values are evaluated at runtime
// - Can use variables and function calls
const value = 10;
const threshold = 5;
let category;

switch (true) {
  case value > threshold * 2:
    category = "High";
    break;
  case value > threshold:
    category = "Medium";
    break;
  case value > 0:
    category = "Low";
    break;
  default:
    category = "Zero or negative";
}

console.log({ value, threshold, category });

// Switch with block scope - Using {} for case blocks (ES6/ES2015)
// - Prevents variable declaration conflicts between cases
// - let/const are block-scoped within {}
const action = "create";

switch (action) {
  case "create": {
    const message = "Creating new item";
    console.log(message);
    break;
  }
  case "update": {
    const message = "Updating existing item"; // No conflict with above
    console.log(message);
    break;
  }
  case "delete": {
    const message = "Deleting item";
    console.log(message);
    break;
  }
  default: {
    const message = "Unknown action";
    console.log(message);
  }
}

// ============================================
// For Loops
// ============================================

// Traditional for loop - Counter-based iteration (ES1)
// - Syntax: for (initialization; condition; increment)
// - All three parts are optional
// - Use case: known iteration count, array traversal, counting
console.log("\nTraditional For Loop:");

for (let i = 0; i < 5; i++) {
  console.log("Iteration:", i);
}

// For loop with array - Index-based array access (ES1)
// - Common pattern for array iteration
// - Provides index for position-dependent operations
const fruits = ["apple", "banana", "cherry"];

console.log("\nFor Loop with Array:");
for (let i = 0; i < fruits.length; i++) {
  console.log(`${i}: ${fruits[i]}`);
}

// For loop variations - Different initialization and increment (ES1)
console.log("\nFor Loop Variations:");

// Counting backwards
for (let i = 5; i > 0; i--) {
  console.log("Countdown:", i);
}

// Step by 2
for (let i = 0; i < 10; i += 2) {
  console.log("Even number:", i);
}

// Multiple variables
for (let i = 0, j = 10; i < 5; i++, j--) {
  console.log(`i: ${i}, j: ${j}`);
}

// Infinite loop (use with caution!)
// for (;;) {
//   console.log("This runs forever!");
//   break; // Need break to exit
// }

// for...in loop - Iterates over object keys (ES3)
// - Iterates over enumerable properties
// - Returns property names (keys) as strings
// - Includes inherited enumerable properties
// - Common pitfall: iterates over array indices as strings, not values
// - Use case: object property iteration, debugging
const person = {
  name: "Alice",
  age: 30,
  city: "New York"
};

console.log("\nFor...in Loop (Object):");
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}

// for...in with array - NOT RECOMMENDED (ES3)
// - Returns indices as strings, not numbers
// - May include inherited properties
// - Order not guaranteed
// - Best practice: use for...of or forEach for arrays
const numbers = [10, 20, 30];

console.log("\nFor...in Loop (Array - NOT RECOMMENDED):");
for (const index in numbers) {
  console.log(`index: ${index} (type: ${typeof index}), value: ${numbers[index]}`);
}

// for...of loop - Iterates over iterable values (ES6/ES2015)
// - Works with arrays, strings, Maps, Sets, NodeLists, etc.
// - Returns actual values, not indices
// - Cannot iterate over plain objects (not iterable)
// - Use case: array/collection iteration, modern preferred method
console.log("\nFor...of Loop (Array):");
for (const fruit of fruits) {
  console.log("Fruit:", fruit);
}

// for...of with strings - Iterates over characters (ES6/ES2015)
const text = "Hello";

console.log("\nFor...of Loop (String):");
for (const char of text) {
  console.log("Character:", char);
}

// for...of with array entries - Get index and value (ES6/ES2015)
// - entries() returns [index, value] pairs
// - Destructuring makes it clean
console.log("\nFor...of with entries():");
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}

// for...of with Map - Iterates over key-value pairs (ES6/ES2015)
const userRoles = new Map([
  ["alice", "admin"],
  ["bob", "user"],
  ["charlie", "moderator"]
]);

console.log("\nFor...of Loop (Map):");
for (const [username, role] of userRoles) {
  console.log(`${username}: ${role}`);
}

// for...of with Set - Iterates over unique values (ES6/ES2015)
const uniqueNumbers = new Set([1, 2, 3, 4, 5]);

console.log("\nFor...of Loop (Set):");
for (const num of uniqueNumbers) {
  console.log("Number:", num);
}

// ============================================
// While Loops
// ============================================

// while loop - Executes while condition is true (ES1)
// - Condition checked before each iteration
// - May not execute at all if condition initially false
// - Use case: unknown iteration count, event-driven loops
console.log("\nWhile Loop:");

let count = 0;
while (count < 5) {
  console.log("Count:", count);
  count++;
}

// while with complex condition - Multiple conditions (ES1)
let x = 0;
let y = 10;

console.log("\nWhile with Complex Condition:");
while (x < 5 && y > 5) {
  console.log(`x: ${x}, y: ${y}`);
  x++;
  y--;
}

// while with break - Early exit (ES1)
let n = 0;

console.log("\nWhile with Break:");
while (true) {
  console.log("n:", n);
  n++;
  if (n >= 3) {
    break; // Exit loop
  }
}

// ============================================
// Do-While Loops
// ============================================

// do-while loop - Executes at least once (ES3)
// - Condition checked after each iteration
// - Guaranteed to execute at least once
// - Use case: menu systems, input validation, "do then check"
console.log("\nDo-While Loop:");

let counter = 0;
do {
  console.log("Counter:", counter);
  counter++;
} while (counter < 5);

// do-while executes even when condition is false (ES3)
console.log("\nDo-While (Condition Initially False):");

let falseCondition = 10;
do {
  console.log("This executes once:", falseCondition);
  falseCondition++;
} while (falseCondition < 5); // Condition is false, but body executed once

// do-while for input validation pattern (ES3)
// - Common pattern: keep asking until valid input
let attempts = 0;
let isValid = false;

console.log("\nDo-While Input Validation Pattern:");
do {
  attempts++;
  console.log(`Attempt ${attempts}`);
  // Simulate validation
  isValid = attempts >= 3;
} while (!isValid);

console.log("Valid input received!");

// ============================================
// Break Statement
// ============================================

// break - Exits loop immediately (ES1)
// - Terminates innermost loop or switch
// - Control transfers to statement after loop
// - Use case: early exit, search operations, error conditions
console.log("\nBreak Statement:");

for (let i = 0; i < 10; i++) {
  if (i === 5) {
    console.log("Breaking at i =", i);
    break; // Exit loop when i is 5
  }
  console.log("i:", i);
}

// break in nested loops - Only exits innermost loop (ES1)
console.log("\nBreak in Nested Loops:");

for (let i = 0; i < 3; i++) {
  console.log("Outer loop i:", i);
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      console.log("  Breaking inner loop at j:", j);
      break; // Only exits inner loop
    }
    console.log("  Inner loop j:", j);
  }
}

// break with label - Exit outer loop from inner loop (ES1)
// - Labels allow breaking out of nested loops
// - Syntax: labelName: for (...) { ... break labelName; }
// - Use case: matrix search, nested iteration early exit
console.log("\nBreak with Label:");

outerLoop: for (let i = 0; i < 3; i++) {
  console.log("Outer i:", i);
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      console.log("  Breaking outer loop at i:", i, "j:", j);
      break outerLoop; // Exits outer loop
    }
    console.log("  Inner j:", j);
  }
}

// break in switch - Prevents fall-through (ES3)
// - Already covered in switch section
// - Essential to prevent unintended case execution

// ============================================
// Continue Statement
// ============================================

// continue - Skips current iteration, continues with next (ES1)
// - Jumps to next iteration of loop
// - In for loop: jumps to increment expression
// - In while/do-while: jumps to condition check
// - Use case: skip invalid items, filter during iteration
console.log("\nContinue Statement:");

for (let i = 0; i < 5; i++) {
  if (i === 2) {
    console.log("Skipping i =", i);
    continue; // Skip rest of this iteration
  }
  console.log("Processing i:", i);
}

// continue in while loop (ES1)
console.log("\nContinue in While Loop:");

let m = 0;
while (m < 5) {
  m++;
  if (m === 3) {
    console.log("Skipping m =", m);
    continue;
  }
  console.log("Processing m:", m);
}

// continue in nested loops - Only affects innermost loop (ES1)
console.log("\nContinue in Nested Loops:");

for (let i = 0; i < 3; i++) {
  console.log("Outer i:", i);
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      console.log("  Skipping inner j:", j);
      continue; // Only skips inner loop iteration
    }
    console.log("  Inner j:", j);
  }
}

// continue with label - Skip outer loop iteration (ES1)
// - Labels allow continuing outer loop from inner loop
// - Less common than break with label
console.log("\nContinue with Label:");

outerContinue: for (let i = 0; i < 3; i++) {
  console.log("Outer i:", i);
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      console.log("  Continuing outer loop at j:", j);
      continue outerContinue; // Continues outer loop
    }
    console.log("  Inner j:", j);
  }
  console.log("End of outer iteration"); // This won't print when continue executes
}

// continue with for...of - Skip array elements (ES6/ES2015)
const items = [1, 2, 3, 4, 5];

console.log("\nContinue with For...of:");
for (const item of items) {
  if (item % 2 === 0) {
    console.log("Skipping even number:", item);
    continue;
  }
  console.log("Processing odd number:", item);
}

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Switch fall-through (forgetting break)
console.log("\nPitfall 1: Switch Fall-through");
const level = 2;
let access = "";

// BAD: Missing break statements
switch (level) {
  case 1:
    access += "Read ";
  case 2:
    access += "Write ";
  case 3:
    access += "Delete ";
  default:
    access += "Admin";
}
console.log("Without breaks:", access); // "Write Delete Admin" (unintended!)

// GOOD: With break statements
access = "";
switch (level) {
  case 1:
    access = "Read";
    break;
  case 2:
    access = "Write";
    break;
  case 3:
    access = "Delete";
    break;
  default:
    access = "Admin";
}
console.log("With breaks:", access); // "Write" (intended)

// Pitfall 2: for...in vs for...of confusion
console.log("\nPitfall 2: for...in vs for...of");
const arr = ["a", "b", "c"];

// for...in returns indices (strings)
console.log("for...in (indices):");
for (const i in arr) {
  console.log(`  ${i} (${typeof i})`); // "0", "1", "2" (strings!)
}

// for...of returns values
console.log("for...of (values):");
for (const val of arr) {
  console.log(`  ${val}`); // "a", "b", "c"
}

// Best Practice: Use for...of for arrays, for...in for objects

// Pitfall 3: Infinite loops
console.log("\nPitfall 3: Infinite Loops");

// BAD: Condition never becomes false
// let infinite = 0;
// while (infinite < 10) {
//   console.log(infinite);
//   // Forgot to increment! infinite++ missing
// }

// GOOD: Ensure loop variable changes
let finite = 0;
while (finite < 3) {
  console.log("Finite:", finite);
  finite++; // Loop variable incremented
}

// Pitfall 4: Modifying array during iteration
console.log("\nPitfall 4: Modifying Array During Iteration");
const nums = [1, 2, 3, 4, 5];

// BAD: Modifying array while iterating (can skip elements)
// for (let i = 0; i < nums.length; i++) {
//   if (nums[i] % 2 === 0) {
//     nums.splice(i, 1); // Removes element, shifts indices
//   }
// }

// GOOD: Iterate backwards when removing
const toFilter = [1, 2, 3, 4, 5];
for (let i = toFilter.length - 1; i >= 0; i--) {
  if (toFilter[i] % 2 === 0) {
    toFilter.splice(i, 1);
  }
}
console.log("Filtered (backwards):", toFilter); // [1, 3, 5]

// BETTER: Use filter() method
const filtered = [1, 2, 3, 4, 5].filter(n => n % 2 !== 0);
console.log("Filtered (method):", filtered); // [1, 3, 5]

// Pitfall 5: Off-by-one errors
console.log("\nPitfall 5: Off-by-one Errors");

// BAD: <= with length causes out of bounds
const list = ["a", "b", "c"];
console.log("Array length:", list.length); // 3
// for (let i = 0; i <= list.length; i++) {
//   console.log(list[i]); // Last iteration: undefined
// }

// GOOD: < with length
for (let i = 0; i < list.length; i++) {
  console.log("Item:", list[i]); // All valid items
}

// Pitfall 6: Variable scope in loops
console.log("\nPitfall 6: Variable Scope in Loops");

// BAD: var is function-scoped, not block-scoped
// for (var k = 0; k < 3; k++) {
//   setTimeout(() => console.log("var k:", k), 0);
// }
// Prints: 3, 3, 3 (k is 3 after loop ends)

// GOOD: let is block-scoped
for (let k = 0; k < 3; k++) {
  setTimeout(() => console.log("let k:", k), 10);
}
// Prints: 0, 1, 2 (each iteration has its own k)

// Pitfall 7: Truthy/falsy in conditions
console.log("\nPitfall 7: Truthy/Falsy Confusion");

const emptyString = "";
const zero = 0;
const emptyArray = [];

// These are falsy
if (!emptyString) console.log("Empty string is falsy");
if (!zero) console.log("Zero is falsy");

// This is truthy!
if (emptyArray) console.log("Empty array is truthy!");

// Best Practice: Be explicit
if (emptyArray.length === 0) console.log("Array is empty (explicit check)");

// Pitfall 8: Nested loop performance
console.log("\nPitfall 8: Nested Loop Performance");

// BAD: O(n²) complexity
const matrix = [[1, 2], [3, 4], [5, 6]];
console.log("Nested loops (O(n²)):");
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(`  [${i}][${j}] = ${matrix[i][j]}`);
  }
}

// Best Practice: Consider flat() or reduce() for better readability
const flattened = matrix.flat();
console.log("Flattened:", flattened); // [1, 2, 3, 4, 5, 6]

// Pitfall 9: Continue in wrong place
console.log("\nPitfall 9: Continue Placement");

// BAD: Code after continue never executes
for (let i = 0; i < 3; i++) {
  continue;
  console.log("This never prints:", i); // Unreachable code
}

// GOOD: Continue with condition
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log("Prints except 2:", i);
}

// Pitfall 10: Switch without default
console.log("\nPitfall 10: Switch Without Default");

const status = "unknown";
let message;

// BAD: No default case
switch (status) {
  case "active":
    message = "Active";
    break;
  case "inactive":
    message = "Inactive";
    break;
  // No default! message stays undefined for other values
}
console.log("Without default:", message); // undefined

// GOOD: Always include default
switch (status) {
  case "active":
    message = "Active";
    break;
  case "inactive":
    message = "Inactive";
    break;
  default:
    message = "Unknown status";
}
console.log("With default:", message); // "Unknown status"

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices ===");

// 1. Use const/let, not var
// 2. Prefer for...of over for...in for arrays
// 3. Always use break in switch (unless intentional fall-through)
// 4. Include default case in switch statements
// 5. Use early returns instead of deep nesting
// 6. Be explicit with conditions (avoid truthy/falsy confusion)
// 7. Watch for off-by-one errors (< vs <=)
// 8. Don't modify arrays during iteration
// 9. Use array methods (map, filter, reduce) when appropriate
// 10. Add comments for complex loop logic

// Example: Early return pattern
function processValue(val) {
  // Guard clauses at the top
  if (val === null) return "Null value";
  if (val === undefined) return "Undefined value";
  if (val < 0) return "Negative value";
  
  // Main logic without nesting
  return `Processing: ${val}`;
}

console.log("\nEarly Return Pattern:");
console.log(processValue(null));
console.log(processValue(undefined));
console.log(processValue(-5));
console.log(processValue(42));

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE NARROWING IN CONDITIONALS
   JS:  if (typeof x === "string") { x.toUpperCase(); }
   TS:  Same syntax, but TypeScript narrows x to string type in if block
   TS:  Provides autocomplete and type safety within the block

2. SWITCH EXHAUSTIVENESS CHECKING
   JS:  No compile-time check for missing cases
   TS:  With union types, can enforce all cases handled
   TS:  type Status = "active" | "inactive";
   TS:  switch (status) { case "active": ...; case "inactive": ...; }
   TS:  TypeScript ensures all Status values are covered

3. LOOP TYPE INFERENCE
   JS:  for (const item of items) { ... }
   TS:  Same syntax, but item type is inferred from items array type
   TS:  const items: string[] = ["a", "b"];
   TS:  for (const item of items) { item.toUpperCase(); // item is string }

4. FOR...IN WITH INDEX SIGNATURE
   JS:  for (const key in obj) { console.log(obj[key]); }
   TS:  Requires index signature or type assertion
   TS:  const obj: { [key: string]: number } = { a: 1, b: 2 };
   TS:  for (const key in obj) { console.log(obj[key]); // OK }

5. NEVER TYPE FOR UNREACHABLE CODE
   JS:  No concept of unreachable code types
   TS:  function fail(): never { throw new Error(); }
   TS:  Used for exhaustiveness checking in switch statements

6. CONTROL FLOW ANALYSIS
   JS:  No compile-time flow analysis
   TS:  Tracks variable assignments through control flow
   TS:  let x: string | number = "hello";
   TS:  if (typeof x === "string") { x.toUpperCase(); // x is string }
   TS:  else { x.toFixed(2); // x is number }

7. DISCRIMINATED UNIONS WITH SWITCH
   JS:  No special handling
   TS:  type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };
   TS:  switch (shape.kind) {
   TS:    case "circle": return shape.radius; // shape is circle type
   TS:    case "square": return shape.size; // shape is square type
   TS:  }

8. LABELED STATEMENTS
   JS:  Labels work with any statement
   TS:  Same as JavaScript, no additional type checking
   TS:  Labels are rarely used in modern code

⚠️ COMMON CONFUSION POINTS:
- TypeScript doesn't change runtime behavior of control flow
- Type narrowing only works within the conditional block
- for...in still returns string keys in TypeScript
- Switch fall-through behavior is identical to JavaScript
- Labels work the same but are discouraged in both languages
- Exhaustiveness checking requires union types and proper switch structure

📘 See 08-control-flow-ts-comparison.ts for detailed examples!
*/

