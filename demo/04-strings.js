// Strings and Template Literals Demo
// 📘 For TypeScript comparison, see: 09-strings-ts-comparison.ts

// ============================================
// String Creation Methods
// ============================================

// String Literal - Most common way (ES1)
// - Created with single quotes, double quotes, or backticks
// - Immutable - cannot change individual characters
// - Primitive type, but can use methods (auto-boxing)
// - typeof returns "string"
const singleQuote = 'Hello World';
const doubleQuote = "Hello World";
const backtick = `Hello World`;

// String Constructor - Creates string object (ES1)
// - Rarely used, creates object wrapper
// - typeof returns "object" (not "string")
// - Use String() without 'new' for type conversion
const stringObject = new String("Hello"); // Object wrapper
const stringPrimitive = String(123); // Type conversion

console.log("=== String Creation ===");
console.log({ singleQuote, doubleQuote, backtick });
console.log("typeof singleQuote:", typeof singleQuote); // "string"
console.log("typeof stringObject:", typeof stringObject); // "object"
console.log("stringPrimitive:", stringPrimitive); // "123"

// Escape sequences (ES1)
const escaped = 'It\'s a string with "quotes"';
const newline = "Line 1\nLine 2";
const tab = "Column1\tColumn2";
const backslash = "Path: C:\\Users\\Name";
const unicode = "\u0048\u0065\u006C\u006C\u006F"; // "Hello"

console.log("\n=== Escape Sequences ===");
console.log(escaped);
console.log(newline);
console.log(tab);
console.log(backslash);
console.log("Unicode:", unicode);

// ============================================
// String Properties
// ============================================

const text = "JavaScript";

// length - Number of characters (ES1)
// - Read-only property
// - Counts UTF-16 code units (not always same as characters)
// - Empty string has length 0
console.log("\n=== String Properties ===");
console.log("text.length:", text.length); // 10

// ============================================
// String Methods - Extraction
// ============================================

const str = "Hello, World!";

// slice(start, end) - Extract substring (ES3)
// - Negative indices count from end
// - end is exclusive
// - Returns new string, doesn't modify original
// - Most flexible extraction method
console.log("\n=== slice() Method ===");
console.log("str.slice(0, 5):", str.slice(0, 5)); // "Hello"
console.log("str.slice(7):", str.slice(7)); // "World!"
console.log("str.slice(-6):", str.slice(-6)); // "World!"
console.log("str.slice(-6, -1):", str.slice(-6, -1)); // "World"

// substring(start, end) - Extract substring (ES1)
// - Negative values treated as 0
// - Swaps arguments if start > end
// - end is exclusive
// - Less flexible than slice
console.log("\n=== substring() Method ===");
console.log("str.substring(0, 5):", str.substring(0, 5)); // "Hello"
console.log("str.substring(7):", str.substring(7)); // "World!"
console.log("str.substring(-6):", str.substring(-6)); // "Hello, World!" (treats -6 as 0)
console.log("str.substring(5, 0):", str.substring(5, 0)); // "Hello" (swaps arguments)

// substr(start, length) - Extract substring (Deprecated)
// - Second parameter is LENGTH, not end position
// - Negative start counts from end
// - Deprecated, use slice() instead
// - Still works but avoid in new code
console.log("\n=== substr() Method (Deprecated) ===");
console.log("str.substr(0, 5):", str.substr(0, 5)); // "Hello"
console.log("str.substr(7, 5):", str.substr(7, 5)); // "World"
console.log("str.substr(-6, 5):", str.substr(-6, 5)); // "World"

// ============================================
// String Methods - Searching
// ============================================

const searchStr = "The quick brown fox jumps over the lazy dog";

// indexOf(searchValue, fromIndex) - Find first occurrence (ES1)
// - Returns index of first match, or -1 if not found
// - Case-sensitive
// - fromIndex is optional starting position
console.log("\n=== indexOf() Method ===");
console.log("indexOf('the'):", searchStr.indexOf('the')); // 31 (finds second "the")
console.log("indexOf('The'):", searchStr.indexOf('The')); // 0 (case-sensitive)
console.log("indexOf('cat'):", searchStr.indexOf('cat')); // -1 (not found)
console.log("indexOf('the', 32):", searchStr.indexOf('the', 32)); // 31

// lastIndexOf(searchValue, fromIndex) - Find last occurrence (ES1)
// - Returns index of last match, or -1 if not found
// - Searches backwards from end or fromIndex
// - Case-sensitive
console.log("\n=== lastIndexOf() Method ===");
console.log("lastIndexOf('the'):", searchStr.lastIndexOf('the')); // 31
console.log("lastIndexOf('o'):", searchStr.lastIndexOf('o')); // 41
console.log("lastIndexOf('o', 20):", searchStr.lastIndexOf('o', 20)); // 17

// includes(searchString, position) - Check if contains substring (ES6/ES2015)
// - Returns boolean
// - Case-sensitive
// - More readable than indexOf() !== -1
console.log("\n=== includes() Method ===");
console.log("includes('fox'):", searchStr.includes('fox')); // true
console.log("includes('cat'):", searchStr.includes('cat')); // false
console.log("includes('FOX'):", searchStr.includes('FOX')); // false (case-sensitive)

// startsWith(searchString, position) - Check if starts with substring (ES6/ES2015)
// - Returns boolean
// - Case-sensitive
// - position is optional starting position
console.log("\n=== startsWith() Method ===");
console.log("startsWith('The'):", searchStr.startsWith('The')); // true
console.log("startsWith('quick'):", searchStr.startsWith('quick')); // false
console.log("startsWith('quick', 4):", searchStr.startsWith('quick', 4)); // true

// endsWith(searchString, length) - Check if ends with substring (ES6/ES2015)
// - Returns boolean
// - Case-sensitive
// - length is optional string length to consider
console.log("\n=== endsWith() Method ===");
console.log("endsWith('dog'):", searchStr.endsWith('dog')); // true
console.log("endsWith('lazy'):", searchStr.endsWith('lazy')); // false
console.log("endsWith('lazy', 40):", searchStr.endsWith('lazy', 40)); // true

// ============================================
// String Methods - Modification
// ============================================

const modStr = "  Hello World  ";

// repeat(count) - Repeat string (ES6/ES2015)
// - Returns new string repeated count times
// - count must be non-negative integer
// - Useful for padding, formatting
console.log("\n=== repeat() Method ===");
console.log("'Ha'.repeat(3):", 'Ha'.repeat(3)); // "HaHaHa"
console.log("'-'.repeat(10):", '-'.repeat(10)); // "----------"
console.log("'0'.repeat(5):", '0'.repeat(5)); // "00000"

// trim() - Remove whitespace from both ends (ES5)
// - Removes spaces, tabs, newlines
// - Returns new string, doesn't modify original
// - Useful for user input
console.log("\n=== trim() Method ===");
console.log("Before trim:", `"${modStr}"`); // "  Hello World  "
console.log("After trim:", `"${modStr.trim()}"`); // "Hello World"

// trimStart() / trimLeft() - Remove whitespace from start (ES2019)
// - trimLeft() is alias for trimStart()
// - Only removes from beginning
console.log("\n=== trimStart() Method ===");
console.log("trimStart():", `"${modStr.trimStart()}"`); // "Hello World  "

// trimEnd() / trimRight() - Remove whitespace from end (ES2019)
// - trimRight() is alias for trimEnd()
// - Only removes from end
console.log("\n=== trimEnd() Method ===");
console.log("trimEnd():", `"${modStr.trimEnd()}"`); // "  Hello World"

// padStart(targetLength, padString) - Pad from start (ES2017)
// - Pads string to reach target length
// - padString defaults to space
// - Useful for formatting numbers, alignment
console.log("\n=== padStart() Method ===");
console.log("'5'.padStart(3, '0'):", '5'.padStart(3, '0')); // "005"
console.log("'42'.padStart(5, '0'):", '42'.padStart(5, '0')); // "00042"
console.log("'Hi'.padStart(10):", `"${'Hi'.padStart(10)}"`); // "        Hi"
console.log("'7'.padStart(4, 'ab'):", '7'.padStart(4, 'ab')); // "aba7"

// padEnd(targetLength, padString) - Pad from end (ES2017)
// - Pads string to reach target length
// - padString defaults to space
// - Useful for formatting, alignment
console.log("\n=== padEnd() Method ===");
console.log("'5'.padEnd(3, '0'):", '5'.padEnd(3, '0')); // "500"
console.log("'Hi'.padEnd(10):", `"${'Hi'.padEnd(10)}"`); // "Hi        "
console.log("'7'.padEnd(4, 'ab'):", '7'.padEnd(4, 'ab')); // "7aba"

// ============================================
// String Methods - Splitting and Joining
// ============================================

const csvData = "apple,banana,cherry,date";
const sentence = "The quick brown fox";

// split(separator, limit) - Split string into array (ES3)
// - Returns array of substrings
// - separator can be string or regex
// - limit is optional max array length
// - Empty separator splits every character
console.log("\n=== split() Method ===");
console.log("split(','):", csvData.split(',')); // ["apple", "banana", "cherry", "date"]
console.log("split(' '):", sentence.split(' ')); // ["The", "quick", "brown", "fox"]
console.log("split(' ', 2):", sentence.split(' ', 2)); // ["The", "quick"]
console.log("split(''):", "Hello".split('')); // ["H", "e", "l", "l", "o"]

// ============================================
// String Methods - Replacement
// ============================================

const replaceStr = "The cat sat on the mat. The cat was happy.";

// replace(searchValue, replaceValue) - Replace first match (ES3)
// - Only replaces first occurrence
// - searchValue can be string or regex
// - replaceValue can be string or function
// - Returns new string
console.log("\n=== replace() Method ===");
console.log("replace('cat', 'dog'):", replaceStr.replace('cat', 'dog'));
// "The dog sat on the mat. The cat was happy."
console.log("replace(/cat/g, 'dog'):", replaceStr.replace(/cat/g, 'dog'));
// "The dog sat on the mat. The dog was happy."

// replaceAll(searchValue, replaceValue) - Replace all matches (ES2021)
// - Replaces all occurrences
// - searchValue can be string or global regex
// - More convenient than replace with global regex
console.log("\n=== replaceAll() Method ===");
console.log("replaceAll('cat', 'dog'):", replaceStr.replaceAll('cat', 'dog'));
// "The dog sat on the mat. The dog was happy."
console.log("replaceAll('the', 'a'):", replaceStr.replaceAll('the', 'a'));
// "The cat sat on a mat. The cat was happy."

// Replace with function
const withNumbers = "I have 5 apples and 3 oranges";
const doubled = withNumbers.replace(/\d+/g, (match) => match * 2);
console.log("Replace with function:", doubled);
// "I have 10 apples and 6 oranges"

// ============================================
// String Methods - Case Conversion
// ============================================

const mixedCase = "Hello World";

// toLowerCase() - Convert to lowercase (ES1)
// - Returns new string in lowercase
// - Locale-independent
console.log("\n=== toLowerCase() Method ===");
console.log("toLowerCase():", mixedCase.toLowerCase()); // "hello world"

// toUpperCase() - Convert to uppercase (ES1)
// - Returns new string in uppercase
// - Locale-independent
console.log("\n=== toUpperCase() Method ===");
console.log("toUpperCase():", mixedCase.toUpperCase()); // "HELLO WORLD"

// toLocaleLowerCase() - Locale-aware lowercase (ES3)
// - Respects locale-specific rules
// - Important for Turkish, Lithuanian, etc.
console.log("\n=== toLocaleLowerCase() Method ===");
console.log("toLocaleLowerCase():", mixedCase.toLocaleLowerCase()); // "hello world"
console.log("Turkish İ:", "İstanbul".toLocaleLowerCase('tr')); // "istanbul"

// toLocaleUpperCase() - Locale-aware uppercase (ES3)
// - Respects locale-specific rules
console.log("\n=== toLocaleUpperCase() Method ===");
console.log("toLocaleUpperCase():", mixedCase.toLocaleUpperCase()); // "HELLO WORLD"

// ============================================
// String Methods - Other Useful Methods
// ============================================

// concat() - Concatenate strings (ES3)
// - Joins multiple strings
// - Template literals or + operator preferred
console.log("\n=== concat() Method ===");
console.log("concat():", "Hello".concat(" ", "World", "!")); // "Hello World!"

// charAt(index) - Get character at index (ES1)
// - Returns character at position
// - Returns empty string if out of bounds
console.log("\n=== charAt() Method ===");
console.log("charAt(0):", "Hello".charAt(0)); // "H"
console.log("charAt(4):", "Hello".charAt(4)); // "o"
console.log("charAt(10):", "Hello".charAt(10)); // ""

// charCodeAt(index) - Get UTF-16 code at index (ES1)
// - Returns numeric code
// - Returns NaN if out of bounds
console.log("\n=== charCodeAt() Method ===");
console.log("charCodeAt(0):", "Hello".charCodeAt(0)); // 72 (H)
console.log("charCodeAt(4):", "Hello".charCodeAt(4)); // 111 (o)

// codePointAt(index) - Get Unicode code point (ES6/ES2015)
// - Handles Unicode characters beyond BMP
// - Better than charCodeAt for emoji and special characters
console.log("\n=== codePointAt() Method ===");
console.log("codePointAt(0):", "😀".codePointAt(0)); // 128512
console.log("codePointAt(0):", "A".codePointAt(0)); // 65

// String.fromCharCode() - Create string from UTF-16 codes (ES1)
// - Static method
// - Takes multiple code values
console.log("\n=== String.fromCharCode() ===");
console.log("fromCharCode(72, 101, 108, 108, 111):", 
  String.fromCharCode(72, 101, 108, 108, 111)); // "Hello"

// String.fromCodePoint() - Create string from code points (ES6/ES2015)
// - Static method
// - Handles full Unicode range
console.log("\n=== String.fromCodePoint() ===");
console.log("fromCodePoint(128512):", String.fromCodePoint(128512)); // "😀"
console.log("fromCodePoint(65, 66, 67):", String.fromCodePoint(65, 66, 67)); // "ABC"

// match() - Match against regex (ES3)
// - Returns array of matches or null
// - With global flag, returns all matches
console.log("\n=== match() Method ===");
console.log("match(/[0-9]+/):", "I have 5 apples".match(/[0-9]+/)); // ["5"]
console.log("match(/[0-9]+/g):", "I have 5 apples and 3 oranges".match(/[0-9]+/g)); // ["5", "3"]

// search() - Search with regex (ES3)
// - Returns index of first match or -1
// - Similar to indexOf but uses regex
console.log("\n=== search() Method ===");
console.log("search(/[0-9]/):", "I have 5 apples".search(/[0-9]/)); // 7
console.log("search(/cat/):", "dog".search(/cat/)); // -1

// ============================================
// Template Literals (ES6/ES2015)
// ============================================

// Basic template literal
// - Use backticks instead of quotes
// - Can span multiple lines
// - Preserves whitespace and newlines
const name = "Alice";
const age = 30;

console.log("\n=== Template Literals ===");
const greeting = `Hello, ${name}!`;
console.log(greeting); // "Hello, Alice!"

// Multi-line strings
// - No need for \n or string concatenation
// - Preserves indentation and line breaks
const multiLine = `
  This is a
  multi-line
  string
`;
console.log("Multi-line string:", multiLine);

// Better formatting for multi-line
const poem = `Roses are red,
Violets are blue,
JavaScript is awesome,
And so are you!`;
console.log("\nPoem:");
console.log(poem);

// ============================================
// String Interpolation with ${}
// ============================================

// Expression interpolation
// - Can embed any JavaScript expression
// - Automatically converts to string
// - More readable than concatenation
console.log("\n=== String Interpolation ===");

const a = 5;
const b = 10;
console.log(`Sum: ${a + b}`); // "Sum: 15"
console.log(`Product: ${a * b}`); // "Product: 50"

// Function calls in interpolation
function getGreeting() {
  return "Good morning";
}
console.log(`${getGreeting()}, ${name}!`); // "Good morning, Alice!"

// Object property access
const user = { name: "Bob", role: "Developer" };
console.log(`User: ${user.name} (${user.role})`); // "User: Bob (Developer)"

// Conditional expressions
const isLoggedIn = true;
console.log(`Status: ${isLoggedIn ? 'Online' : 'Offline'}`); // "Status: Online"

// Array methods
const numbers = [1, 2, 3, 4, 5];
console.log(`Numbers: ${numbers.join(', ')}`); // "Numbers: 1, 2, 3, 4, 5"

// Nested template literals
const items = ['apple', 'banana', 'cherry'];
const list = `Items:
${items.map(item => `  - ${item}`).join('\n')}`;
console.log(list);

// ============================================
// Tagged Template Literals
// ============================================

// Tagged templates - Custom string processing
// - Function receives template parts and values
// - Can process and transform template
// - Useful for sanitization, formatting, i18n

// Basic tagged template
function simple(strings, ...values) {
  console.log("Strings:", strings); // Array of string parts
  console.log("Values:", values); // Array of interpolated values
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] || '');
  }, '');
}

console.log("\n=== Tagged Template Literals ===");
const result = simple`Hello ${name}, you are ${age} years old`;
console.log("Result:", result);

// HTML escaping tag
function html(strings, ...values) {
  const escape = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? escape(values[i]) : '');
  }, '');
}

const userInput = '<script>alert("XSS")</script>';
const safeHTML = html`<div>User input: ${userInput}</div>`;
console.log("\nSafe HTML:", safeHTML);
// <div>User input: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>

// Currency formatting tag
function currency(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    const formatted = value !== undefined 
      ? `$${value.toFixed(2)}` 
      : '';
    return result + str + formatted;
  }, '');
}

const price = 19.99;
const tax = 2.5;
console.log(currency`Total: ${price + tax}`); // "Total: $22.49"

// Highlighting tag
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    const highlighted = value !== undefined 
      ? `**${value}**` 
      : '';
    return result + str + highlighted;
  }, '');
}

console.log(highlight`Hello ${name}, you are ${age} years old`);
// "Hello **Alice**, you are **30** years old"

// SQL query builder (demonstration only - use parameterized queries in production!)
function sql(strings, ...values) {
  // This is for demonstration only!
  // In production, use proper parameterized queries
  return {
    text: strings.reduce((result, str, i) => {
      return result + str + (values[i] !== undefined ? `$${i + 1}` : '');
    }, ''),
    values: values
  };
}

const userId = 42;
const userName = "Alice";
const query = sql`SELECT * FROM users WHERE id = ${userId} AND name = ${userName}`;
console.log("\nSQL Query:", query);
// { text: "SELECT * FROM users WHERE id = $1 AND name = $2", values: [42, "Alice"] }

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: slice vs substring
// slice: Negative indices work, no argument swapping
// substring: Negative treated as 0, swaps if start > end
const testStr = "Hello World";
console.log("\nslice vs substring:");
console.log("slice(3, 8):", testStr.slice(3, 8)); // "lo Wo"
console.log("substring(3, 8):", testStr.substring(3, 8)); // "lo Wo"
console.log("slice(-5):", testStr.slice(-5)); // "World"
console.log("substring(-5):", testStr.substring(-5)); // "Hello World" (treats -5 as 0)
console.log("slice(8, 3):", testStr.slice(8, 3)); // "" (empty)
console.log("substring(8, 3):", testStr.substring(8, 3)); // "lo Wo" (swaps arguments)

// Pitfall 2: String immutability
// Strings cannot be modified in place
const immutable = "Hello";
immutable[0] = "J"; // Silently fails (strict mode throws error)
console.log("\nString immutability:", immutable); // Still "Hello"

// Correct way: create new string
const modified = "J" + immutable.slice(1);
console.log("Modified correctly:", modified); // "Jello"

// Pitfall 3: Template literal gotchas
// Backticks preserve ALL whitespace
const badIndent = `
    This has
    lots of
    spaces
`;
console.log("\nBad indentation:", badIndent);

// Better: Use trim or careful formatting
const goodIndent = `
This has
better
formatting
`.trim();
console.log("Good formatting:", goodIndent);

// Pitfall 4: indexOf vs includes
// indexOf returns -1 for not found, includes returns boolean
const checkStr = "Hello World";
console.log("\nindexOf vs includes:");
console.log("indexOf('World'):", checkStr.indexOf('World')); // 6
console.log("includes('World'):", checkStr.includes('World')); // true
console.log("indexOf('xyz'):", checkStr.indexOf('xyz')); // -1
console.log("includes('xyz'):", checkStr.includes('xyz')); // false

// Common mistake: using indexOf in boolean context
if (checkStr.indexOf('Hello')) { // ❌ Wrong! indexOf returns 0, which is falsy
  console.log("This won't print");
}
if (checkStr.indexOf('Hello') !== -1) { // ✅ Correct
  console.log("This will print");
}
if (checkStr.includes('Hello')) { // ✅ Better
  console.log("This is clearest");
}

// Pitfall 5: replace() only replaces first match
const replaceTest = "cat cat cat";
console.log("\nreplace() vs replaceAll():");
console.log("replace('cat', 'dog'):", replaceTest.replace('cat', 'dog')); // "dog cat cat"
console.log("replaceAll('cat', 'dog'):", replaceTest.replaceAll('cat', 'dog')); // "dog dog dog"
console.log("replace(/cat/g, 'dog'):", replaceTest.replace(/cat/g, 'dog')); // "dog dog dog"

// Pitfall 6: Comparing strings
// Use === for exact comparison
// Use localeCompare() for locale-aware sorting
console.log("\nString comparison:");
console.log("'a' < 'b':", 'a' < 'b'); // true (lexicographic)
console.log("'A' < 'a':", 'A' < 'a'); // true (uppercase comes first in Unicode)
console.log("'10' < '2':", '10' < '2'); // true (lexicographic, not numeric)
console.log("'ä'.localeCompare('z'):", 'ä'.localeCompare('z')); // -1 (locale-aware)

// Pitfall 7: Empty string vs null vs undefined
console.log("\nEmpty string checks:");
const empty = "";
const nullStr = null;
const undefinedStr = undefined;
console.log("empty === '':", empty === ''); // true
console.log("empty.length:", empty.length); // 0
console.log("Boolean(empty):", Boolean(empty)); // false
// console.log("nullStr.length:", nullStr.length); // ❌ TypeError!
// console.log("undefinedStr.length:", undefinedStr.length); // ❌ TypeError!

// Safe check
console.log("empty?.length:", empty?.length); // 0
console.log("nullStr?.length:", nullStr?.length); // undefined
console.log("undefinedStr?.length:", undefinedStr?.length); // undefined

// Pitfall 8: Unicode and emoji
// Some characters take multiple code units
const emoji = "😀";
console.log("\nUnicode pitfalls:");
console.log("emoji.length:", emoji.length); // 2 (not 1!)
console.log("emoji.charAt(0):", emoji.charAt(0)); // � (invalid)
console.log("emoji.codePointAt(0):", emoji.codePointAt(0)); // 128512 (correct)
console.log("[...emoji].length:", [...emoji].length); // 1 (correct with spread)

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

// 1. Use template literals for string interpolation
const firstName = "John";
const lastName = "Doe";
// ❌ Avoid: const fullName = firstName + " " + lastName;
// ✅ Prefer: 
const fullName = `${firstName} ${lastName}`;
console.log("1. Template literals:", fullName);

// 2. Use includes() instead of indexOf() for existence checks
const text2 = "Hello World";
// ❌ Avoid: if (text2.indexOf('World') !== -1)
// ✅ Prefer:
if (text2.includes('World')) {
  console.log("2. Use includes() for checks");
}

// 3. Use startsWith() and endsWith() for prefix/suffix checks
const filename = "document.pdf";
// ❌ Avoid: if (filename.slice(-4) === '.pdf')
// ✅ Prefer:
if (filename.endsWith('.pdf')) {
  console.log("3. Use endsWith() for suffix checks");
}

// 4. Use trim() for user input
const userInput2 = "  hello@example.com  ";
const cleaned = userInput2.trim().toLowerCase();
console.log("4. Cleaned input:", cleaned);

// 5. Use slice() instead of substring() or substr()
// slice() is more consistent and flexible
const str2 = "Hello World";
console.log("5. Use slice():", str2.slice(0, 5));

// 6. Use replaceAll() for replacing all occurrences (ES2021+)
const text3 = "foo foo foo";
// ❌ Avoid: text3.replace(/foo/g, 'bar')
// ✅ Prefer:
console.log("6. Use replaceAll():", text3.replaceAll('foo', 'bar'));

// 7. Use padStart()/padEnd() for formatting
const id = "42";
const paddedId = id.padStart(5, '0');
console.log("7. Padded ID:", paddedId); // "00042"

// 8. Use split() with limit for performance
const longText = "a,b,c,d,e,f,g,h,i,j";
const firstThree = longText.split(',', 3);
console.log("8. Split with limit:", firstThree); // ["a", "b", "c"]

// 9. Use spread operator for Unicode-aware operations
const text4 = "Hello 😀 World";
console.log("9. Unicode-aware length:", [...text4].length); // 13 (correct)
console.log("   Regular length:", text4.length); // 14 (counts emoji as 2)

// 10. Use tagged templates for sanitization
// Always sanitize user input in templates
function sanitize(strings, ...values) {
  const escape = (str) => String(str)
    .replace(/[<>'"&]/g, char => {
      const entities = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' };
      return entities[char];
    });
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? escape(values[i]) : '');
  }, '');
}

const untrusted = '<script>alert("xss")</script>';
console.log("10. Sanitized:", sanitize`User: ${untrusted}`);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. STRING TYPE ANNOTATION
   JS:  const name = "Alice";
   TS:  const name: string = "Alice";
   
   Benefits:
   - Explicit type declaration
   - Compile-time type checking
   - Better IDE support

2. STRING LITERAL TYPES
   JS:  const status = "active"; // Can be any string
   TS:  const status: "active" | "inactive" | "pending" = "active";
   
   Benefits:
   - Restrict to specific string values
   - Catch typos at compile time
   - Better autocomplete

3. TEMPLATE LITERAL TYPES (TS 4.1+)
   JS:  // No equivalent
   TS:  type Color = "red" | "blue";
        type Quantity = "one" | "two";
        type SeussFish = `${Quantity} ${Color} fish`;
        // "one red fish" | "one blue fish" | "two red fish" | "two blue fish"
   
   Benefits:
   - Type-safe string combinations
   - Powerful type transformations
   - Better API design

4. STRING METHODS RETURN TYPES
   JS:  const result = "hello".toUpperCase(); // string
   TS:  const result: string = "hello".toUpperCase();
   
   - TypeScript knows all string method return types
   - Type inference works automatically
   - No need to annotate in most cases

5. TAGGED TEMPLATE TYPE SAFETY
   JS:  function tag(strings, ...values) { }
   TS:  function tag(strings: TemplateStringsArray, ...values: any[]): string { }
   
   Benefits:
   - Type-safe template tag functions
   - Better parameter checking
   - Return type enforcement

6. STRING INDEX SIGNATURES
   JS:  const obj = { key: "value" };
   TS:  interface StringMap {
          [key: string]: string;
        }
        const obj: StringMap = { key: "value" };
   
   Benefits:
   - Type-safe dynamic keys
   - Enforce value types
   - Better object typing

7. CONST ASSERTIONS
   JS:  const tuple = ["hello", 42];
   TS:  const tuple = ["hello", 42] as const;
        // Type: readonly ["hello", 42]
   
   Benefits:
   - Literal types instead of widened types
   - Immutable tuples
   - More precise types

8. STRING UTILITY TYPES
   TS:  type Uppercase<S> = intrinsic;
        type Lowercase<S> = intrinsic;
        type Capitalize<S> = intrinsic;
        type Uncapitalize<S> = intrinsic;
   
   Example:
   type Greeting = "hello world";
   type Loud = Uppercase<Greeting>; // "HELLO WORLD"
   
   Benefits:
   - Type-level string transformations
   - Compile-time string manipulation
   - Advanced type patterns

⚠️ COMMON CONFUSION POINTS:

1. STRING VS STRING LITERAL TYPES
   - string: Any string value
   - "hello": Only the literal "hello"
   
   type AnyString = string;        // ✅ Can be any string
   type Specific = "hello";        // ✅ Only "hello"
   const x: Specific = "world";    // ❌ Error

2. TEMPLATE LITERAL TYPES VS TEMPLATE LITERALS
   - Template literals: Runtime string creation
   - Template literal types: Compile-time type creation
   
   const runtime = `Hello ${name}`;           // Runtime
   type CompileTime = `Hello ${string}`;      // Compile-time type

3. STRING | NULL | UNDEFINED
   - strictNullChecks affects string handling
   - Must handle null/undefined explicitly
   
   function greet(name: string | null) {
     console.log(name.toUpperCase()); // ❌ Error: name might be null
     console.log(name?.toUpperCase()); // ✅ OK with optional chaining
   }

4. STRING ENUMS VS UNION TYPES
   - String enums: Named constants
   - Union types: Inline string literals
   
   enum Status { Active = "active", Inactive = "inactive" }
   type StatusUnion = "active" | "inactive";
   
   // Both work, enums provide namespace

5. TYPE WIDENING
   - let widens to string
   - const narrows to literal type
   
   let x = "hello";    // Type: string
   const y = "hello";  // Type: "hello"

6. TAGGED TEMPLATE TYPES
   - TemplateStringsArray is special type
   - Has raw property for unescaped strings
   
   function tag(strings: TemplateStringsArray, ...values: any[]) {
     console.log(strings.raw); // Unescaped strings
   }

7. STRING METHODS AND NULL SAFETY
   - String methods don't accept null/undefined
   - Use optional chaining or type guards
   
   function process(str: string | null) {
     return str?.toUpperCase() ?? "DEFAULT";
   }

8. REGEX AND STRING METHODS
   - match() can return null
   - Must handle null case
   
   const result = "hello".match(/\d+/);
   console.log(result[0]); // ❌ Error: result might be null
   console.log(result?.[0]); // ✅ OK

🎯 BEST PRACTICES:

1. USE STRING LITERAL TYPES FOR CONSTANTS
   ✅ type Direction = "north" | "south" | "east" | "west";

2. USE TEMPLATE LITERAL TYPES FOR PATTERNS
   ✅ type EventName = `on${Capitalize<string>}`;

3. USE CONST ASSERTIONS FOR LITERAL ARRAYS
   ✅ const colors = ["red", "blue"] as const;

4. ANNOTATE FUNCTION PARAMETERS
   ✅ function greet(name: string): string { }

5. USE OPTIONAL CHAINING FOR NULLABLE STRINGS
   ✅ const upper = str?.toUpperCase();

6. USE NULLISH COALESCING FOR DEFAULTS
   ✅ const name = input ?? "Guest";

7. USE TYPE GUARDS FOR STRING CHECKS
   ✅ if (typeof value === "string") { }

8. USE STRING ENUMS FOR NAMED CONSTANTS
   ✅ enum Status { Active = "active" }

9. USE UTILITY TYPES FOR TRANSFORMATIONS
   ✅ type Upper = Uppercase<"hello">;

10. ENABLE STRICT NULL CHECKS
    ✅ "strictNullChecks": true in tsconfig.json

📘 See 09-strings-ts-comparison.ts for detailed examples!
*/
