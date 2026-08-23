// Regular Expressions Demo
// 📘 For TypeScript comparison, see: 21-regex-ts-comparison.ts
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces regular expressions as a concise way to describe patterns in text.
// The examples progress from simple matching to groups, flags, and practical use cases.

// ============================================
// Table of Contents
// ============================================

// 1. CREATING REGULAR EXPRESSIONS
// 2. BASIC PATTERNS
// 3. REGULAR EXPRESSION METHODS
// 4. FLAGS
// 5. CAPTURING GROUPS
// 6. LOOKAHEAD AND LOOKBEHIND
// 7. PRACTICAL USE CASES
// 8. COMMON PITFALLS
// 9. BEST PRACTICES
// 10. TYPESCRIPT CONSIDERATIONS
// 11. NEWER REGEXP FEATURES (ES2024 & ES2025)

// ============================================

// ============================================
// 1. CREATING REGULAR EXPRESSIONS
// ============================================
/**
 * Regular Expression Creation - Two Methods (ES1+)
 *
 * Literal Notation:
 * - /pattern/flags
 * - Compiled at parse time
 * - More efficient for static patterns
 * - Escape slashes: \/
 *
 * RegExp Constructor:
 * - new RegExp(pattern, flags)
 * - Compiled at runtime
 * - Allows dynamic patterns
 * - Escape backslashes: \\
 *
 * Use Cases:
 * - Literal: Static patterns (most common)
 * - Constructor: Dynamic patterns from variables
 *
 * Common Pitfalls:
 * - Different escaping in constructor
 * - Empty pattern: /()/ vs new RegExp()
 */

console.log("=== 1. Creating Regular Expressions Demo ===");

// 1.1 Literal notation (most common)
let re1 = /abc/;
let re2 = /abc/gi; // With flags

console.log("Literal:", re1);
console.log("With flags:", re2);

// 1.2 RegExp constructor (dynamic patterns)
let pattern = "abc";
let re3 = new RegExp(pattern);
let re4 = new RegExp(pattern, "gi");

console.log("\nConstructor:", re3);
console.log("With flags:", re4);

// 1.3 Dynamic pattern from variable
let word = "hello";
let dynamicRe = new RegExp(word, "i");
console.log("\nDynamic pattern:", dynamicRe.test("HELLO")); // true

// 1.4 Escaping differences
let literalEscape = /\d+\.\d+/; // Match decimal like 3.14
let constructorEscape = new RegExp("\\d+\\.\\d+"); // Need double escape

console.log("\nEscaping comparison:");
console.log("Literal test:", literalEscape.test("3.14")); // true
console.log("Constructor test:", constructorEscape.test("3.14")); // true

// 1.5 Empty pattern
let empty1 = /()/;
let empty2 = new RegExp();
console.log("\nEmpty pattern:");
console.log("Empty literal:", empty1.test("")); // true
console.log("Empty constructor:", empty2.test("")); // true

// ============================================
// 2. BASIC PATTERNS
// ============================================
/**
 * Basic Pattern Components
 *
 * Character Classes:
 * - [abc] - Match a, b, or c
 * - [^abc] - Match not a, b, or c
 * - [a-z] - Range
 * - \d - Digits (0-9)
 * - \w - Word characters (a-z, A-Z, 0-9, _)
 * - \s - Whitespace
 * - . - Any character (except newline)
 *
 * Quantifiers:
 * - * - 0 or more
 * - + - 1 or more
 * - ? - 0 or 1
 * - {n} - Exactly n
 * - {n,} - n or more
 * - {n,m} - n to m
 *
 * Anchors:
 * - ^ - Start of string
 * - $ - End of string
 * - \b - Word boundary
 *
 * Common Pitfalls:
 * - Greedy vs lazy matching
 * - Special chars need escaping
 * - . doesn't match newline (without s flag)
 */

console.log("\n=== 2. Basic Patterns Demo ===");

// 2.1 Character classes
console.log("Character classes:");
console.log("[abc] test 'a':", /[abc]/.test("a")); // true
console.log("[abc] test 'd':", /[abc]/.test("d")); // false
console.log("[^abc] test 'd':", /[^abc]/.test("d")); // true
console.log("[a-z] test 'm':", /[a-z]/.test("m")); // true

// 2.2 Special character classes
console.log("\nSpecial classes:");
console.log("\\d (digit):", /\d/.test("5")); // true
console.log("\\w (word):", /\w/.test("a")); // true
console.log("\\s (space):", /\s/.test(" ")); // true
console.log(". (any):", /./.test("x")); // true

// 2.3 Quantifiers
console.log("\nQuantifiers:");
console.log("a* matches '':", /a*/.test("")); // true
console.log("a+ matches 'a':", /a+/.test("a")); // true
console.log("a? matches '':", /a?/.test("")); // true
console.log("a{3} matches 'aaa':", /a{3}/.test("aaa")); // true
console.log("a{2,4} matches 'aaa':", /a{2,4}/.test("aaa")); // true

// 2.4 Practical quantifier examples
let phoneRe = /\d{3}-\d{4}/;
console.log("\nPhone pattern:", phoneRe.test("123-4567")); // true

let emailRe = /\w+@\w+\.\w+/;
console.log("Email pattern:", emailRe.test("test@example.com")); // true

// 2.5 Anchors
console.log("\nAnchors:");
console.log("^hello matches 'hello world':", /^hello/.test("hello world")); // true
console.log("^hello matches 'say hello':", /^hello/.test("say hello")); // false
console.log("world$ matches 'hello world':", /world$/.test("hello world")); // true
console.log("world$ matches 'world hello':", /world$/.test("world hello")); // false
console.log(
  "\\bword\\b matches 'a word here':",
  /\bword\b/.test("a word here")
); // true
console.log("\\bword\\b matches 'a wording':", /\bword\b/.test("a wording")); // false

// 2.6 Full match with anchors
let exactRe = /^\d{3}-\d{4}$/;
console.log("\nExact match:");
console.log("Exact '123-4567':", exactRe.test("123-4567")); // true
console.log("Exact '123-4567 extra':", exactRe.test("123-4567 extra")); // false

// ============================================
// 3. REGULAR EXPRESSION METHODS
// ============================================
/**
 * RegExp Methods
 *
 * RegExp Object Methods:
 * - test(str) - Returns true/false
 * - exec(str) - Returns match array or null
 *
 * String Methods:
 * - match(re) - Returns match array
 * - matchAll(re) - Returns iterator (requires g flag, else TypeError)
 * - search(re) - Returns index or -1
 * - replace(re, replacement) - Replace matches
 * - split(re) - Split by pattern
 *
 * Common Pitfalls:
 * - match() vs matchAll() difference
 * - exec() with g flag updates lastIndex
 * - replace() special replacement patterns
 */

console.log("\n=== 3. RegExp Methods Demo ===");

// 3.1 test() method
let testRe = /hello/;
console.log("test() method:");
console.log("/hello/.test('hello world'):", testRe.test("hello world")); // true
console.log("/hello/.test('goodbye'):", testRe.test("goodbye")); // false

// 3.2 exec() method
let execRe = /(\w+)\s(\w+)/;
let str = "John Doe";
let match = execRe.exec(str);
console.log("\nexec() method:");
console.log("Full match:", match[0]); // "John Doe"
console.log("Group 1:", match[1]); // "John"
console.log("Group 2:", match[2]); // "Doe"
console.log("Index:", match.index); // 0
console.log("Input:", match.input); // "John Doe"

// 3.3 match() method
let matchStr = "The rain in Spain";
let matchRe = /ain/g;
console.log("\nmatch() method:");
console.log("Match all 'ain':", matchStr.match(matchRe)); // ['ain', 'ain', 'ain']

// 3.4 match() without g flag returns groups
let matchGroupRe = /(\d{4})-(\d{2})-(\d{2})/;
let dateStr = "2024-01-15";
let dateMatch = dateStr.match(matchGroupRe);
console.log("\nmatch() with groups:");
console.log("Full:", dateMatch[0]); // "2024-01-15"
console.log("Year:", dateMatch[1]); // "2024"
console.log("Month:", dateMatch[2]); // "01"
console.log("Day:", dateMatch[3]); // "15"

// 3.5 matchAll() - Get all matches with groups
let text = "2024-01-15 and 2023-12-25";
let globalRe = /(\d{4})-(\d{2})-(\d{2})/g;
console.log("\nmatchAll() method:");
for (let match of text.matchAll(globalRe)) {
  console.log(`Date: ${match[1]}-${match[2]}-${match[3]}`);
}

// 3.6 search() method
console.log("\nsearch() method:");
console.log("'hello' index in 'say hello':", "say hello".search(/hello/)); // 4
console.log("'goodbye' index:", "say hello".search(/goodbye/)); // -1

// 3.7 replace() method
console.log("\nreplace() method:");
console.log("Replace 'cat' with 'dog':", "I have a cat".replace(/cat/, "dog"));

// Replace all (with g flag)
console.log("Replace all 'a' with 'o':", "banana".replace(/a/g, "o")); // bonono

// 3.8 replace() with capture groups
let nameRe = /(\w+)\s(\w+)/;
let name = "John Doe";
let swapped = name.replace(nameRe, "$2, $1");
console.log("\nReplace with groups:");
console.log("Swap 'John Doe':", swapped); // "Doe, John"

// 3.9 replace() with function
let text2 = "10 apples, 20 oranges, 30 bananas";
let replaced = text2.replace(/(\d+)/g, (match, num) => {
  return parseInt(num) * 2;
});
console.log("\nReplace with function:");
console.log("Double numbers:", replaced);

// 3.10 split() method
console.log("\nsplit() method:");
console.log("Split by comma:", "a,b,c".split(/,/)); // ['a', 'b', 'c']
console.log("Split by whitespace:", "one two   three".split(/\s+/)); // ['one', 'two', 'three']
console.log("Split by digits:", "abc123def456".split(/\d+/)); // ['abc', 'def', '']

// ============================================
// 4. FLAGS
// ============================================
/**
 * Regular Expression Flags
 *
 * Available Flags:
 * - g (global) - Find all matches, not just first
 * - i (ignoreCase) - Case-insensitive matching
 * - m (multiline) - ^ and $ match line boundaries
 * - s (dotAll) - . matches newline
 * - u (unicode) - Full Unicode support
 * - y (sticky) - Match only at lastIndex position
 *
 * Common Pitfalls:
 * - exec() with g flag updates lastIndex
 * - m flag affects ^ and $ behavior
 * - s flag needed for . to match newline
 */

console.log("\n=== 4. Flags Demo ===");

// 4.1 g flag - Global match
let globalStr = "cat and cat and cat";
console.log("Without g:", globalStr.match(/cat/)); // ['cat']
console.log("With g:", globalStr.match(/cat/g)); // ['cat', 'cat', 'cat']

// 4.2 i flag - Case insensitive
console.log("\nCase insensitive:");
console.log("Without i:", /HELLO/.test("hello")); // false
console.log("With i:", /HELLO/i.test("hello")); // true

// 4.3 m flag - Multiline
let multiStr = `line1
line2
line3`;

console.log("\nMultiline:");
console.log("Without m:", /^line2/.test(multiStr)); // false
console.log("With m:", /^line2/m.test(multiStr)); // true

// 4.4 s flag - dotAll (. matches newline)
let newlineStr = "hello\nworld";
console.log("\nDotAll:");
console.log("Without s:", /hello.world/.test(newlineStr)); // false
console.log("With s:", /hello.world/s.test(newlineStr)); // true

// 4.5 Combined flags
let combined = /HELLO/gim;
console.log("\nCombined flags (gim):");
console.log(
  "Find all HELLO (case insensitive):",
  "Hello\nhello\nHELLO".match(combined)
);

// 4.6 u flag - Unicode
console.log("\nUnicode flag:");
let emoji = /\u{1F600}/u; // Grinning face emoji
console.log("Emoji match:", emoji.test("😀")); // true

// 4.7 y flag - Sticky
let stickyStr = "table football foosball";
let stickyRe = /foo/y;
stickyRe.lastIndex = 6; // Start at position 6
console.log("\nSticky flag:");
console.log("Match at lastIndex:", stickyRe.exec(stickyStr)); // ['foo']

// ============================================
// 5. CAPTURING GROUPS
// ============================================
/**
 * Capturing Groups
 *
 * Group Types:
 * - (pattern) - Basic capturing group
 * - (?:pattern) - Non-capturing group
 * - (?<name>pattern) - Named capturing group
 * - \1, \2 - Backreferences
 *
 * Access Groups:
 * - match[1], match[2], etc.
 * - match.groups.name for named
 * - $1, $2 in replace
 *
 * Use Cases:
 * - Extract parts of match
 * - Backreferences for patterns
 * - Named groups for clarity
 *
 * Common Pitfalls:
 * - Groups are 1-indexed
 * - Non-capturing groups don't appear in results
 * - Nested groups count in order
 */

console.log("\n=== 5. Capturing Groups Demo ===");

// 5.1 Basic capturing group
let basicRe = /(\d{3})-(\d{4})/;
let phone = "123-4567";
let basicMatch = phone.match(basicRe);
console.log("Basic groups:");
console.log("Area code:", basicMatch[1]); // 123
console.log("Number:", basicMatch[2]); // 4567

// 5.2 Non-capturing group
let ncRe = /(?:Mr|Mrs|Ms)\.?\s+(\w+)/;
let nameMatch = "Mr. Smith".match(ncRe);
console.log("\nNon-capturing group:");
console.log("Full match:", nameMatch[0]); // "Mr. Smith"
console.log("Name only:", nameMatch[1]); // "Smith"

// 5.3 Named capturing groups
let namedRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
let dateMatch2 = "2024-06-15".match(namedRe);
console.log("\nNamed groups:");
console.log("Year:", dateMatch2.groups.year); // 2024
console.log("Month:", dateMatch2.groups.month); // 06
console.log("Day:", dateMatch2.groups.day); // 15

// 5.4 Backreferences
let backRefRe = /(\w+)\s+\1/;
console.log("\nBackreferences:");
console.log("'hello hello' matches:", backRefRe.test("hello hello")); // true
console.log("'hello world' matches:", backRefRe.test("hello world")); // false

// 5.5 Backreference in replace
let swapRe = /(\w+)\s+(\w+)/;
console.log("\nBackreference in replace:");
console.log("Swap name:", "John Doe".replace(swapRe, "$2 $1"));

// 5.6 Backreference in pattern (find duplicates)
let duplicateRe = /\b(\w+)\s+\1\b/g;
let dupStr = "This is is a test test";
console.log("\nFind duplicates:");
console.log("Duplicates:", dupStr.match(duplicateRe)); // ['is is', 'test test']

// ============================================
// 6. LOOKAHEAD AND LOOKBEHIND
// ============================================
/**
 * Lookahead and Lookbehind Assertions
 *
 * Types:
 * - (?=pattern) - Positive lookahead
 * - (?!pattern) - Negative lookahead
 * - (?<=pattern) - Positive lookbehind (ES2018)
 * - (?<!pattern) - Negative lookbehind (ES2018)
 *
 * Characteristics:
 * - Assertions don't consume characters
 * - Only check if pattern matches
 * - Not included in results
 *
 * Use Cases:
 * - Validate password requirements
 * - Match with context conditions
 * - Extract values with units
 *
 * Common Pitfalls:
 * - Lookbehind needs ES2018+
 * - JS lookbehind supports variable-length patterns (unlike PCRE (fixed-length) and Java (limited variable-length))
 * - Can be complex to read
 */

console.log("\n=== 6. Lookahead and Lookbehind Demo ===");

// 6.1 Positive lookahead
let posLookahead = /\d+(?=px)/;
console.log("Positive lookahead:");
console.log("'100px' matches:", "width: 100px".match(posLookahead)); // ['100']
console.log("'100em' matches:", "width: 100em".match(posLookahead)); // null

// 6.2 Negative lookahead
let negLookahead = /\d+(?!px)/;
console.log("\nNegative lookahead:");
console.log("'100em' matches:", "width: 100em".match(negLookahead)); // ['100']
console.log("'100px' matches:", "width: 100px".match(negLookahead)); // ['10'] (greedy \d+ backtracks)

// 6.3 Password validation with lookahead
let passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
console.log("\nPassword validation:");
console.log("'Password1' valid:", passwordRe.test("Password1")); // true
console.log("'password' valid:", passwordRe.test("password")); // false

// 6.4 Positive lookbehind
let posLookbehind = /(?<=\$)\d+/;
console.log("\nPositive lookbehind:");
console.log("'$100' matches:", "price: $100".match(posLookbehind)); // ['100']
console.log("'100' alone matches:", "just 100".match(posLookbehind)); // null

// 6.5 Negative lookbehind
let negLookbehind = /(?<!\$)\d+/;
console.log("\nNegative lookbehind:");
console.log("'100' alone matches:", "just 100".match(negLookbehind)); // ['100']
console.log("'$100' matches:", "price: $100".match(negLookbehind)); // ['00'] (\$ is literal $, lookbehind fails before 100)

// 6.6 Lookahead with replacement
let fruits = ["ripe orange A", "green orange B", "ripe orange C"];
console.log("\nLookahead replacement:");
let replacedFruits = fruits.map(fruit =>
  fruit.replace(/(?<=ripe )orange/, "apple")
);
console.log(replacedFruits);

// 6.7 Possessive Quantifiers - Greedy without backtracking (JS does NOT support a++)
console.log("\nPossessive Quantifiers:");

// JavaScript does NOT support possessive quantifiers (a++). The pattern below is
// NOT a true possessive simulation — it's an atomic-ish lookahead that still
// backtracks. A real possessive `a++ab` would never match "aaab" (a++ is greedy
// and refuses to give back chars), but this lookahead pattern DOES match.
let possessiveRe = /(a+(?![^a]))ab/; // a+ not followed by non-'a', then 'ab'
console.log("Lookahead pattern:", "aaab".match(possessiveRe)); // ['aaab', 'aa'] (matches, unlike true possessive)

// Standard greedy quantifier allows backtracking
let standardRe = /a+ab/;
console.log("Standard greedy:", "aaab".match(standardRe)); // ["aaab"]

// 6.8 RegExp `d` flag — Match Indices (ES2022)
/*
 * verification:
 *   feature: RegExp Match Indices
 *   status: ES2022
 *   stage4Date: 2021-05
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nRegExp `d` flag - Match Indices (ES2022):");
// The `d` flag adds an `.indices` property to match results,
// providing start/end positions of the overall match and each capture group
const dRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d;
const dMatch = dRe.exec("2024-03-15");
console.log("match[0]:", dMatch[0]); // "2024-03-15"
console.log("match.indices[0]:", dMatch.indices[0]); // [0, 10] - overall match position
console.log("match.indices[1]:", dMatch.indices[1]); // [0, 4] - group 1 (year)
console.log("match.indices[2]:", dMatch.indices[2]); // [5, 7] - group 2 (month)
console.log("match.indices[3]:", dMatch.indices[3]); // [8, 10] - group 3 (day)
console.log("match.indices.groups:", dMatch.indices.groups);
// { year: [0, 4], month: [5, 7], day: [8, 10] }
// The `d` flag also sets `hasIndices` property on the regex:
console.log("dRe.hasIndices:", dRe.hasIndices); // true

// Useful for error reporting — know exactly where a match occurred in the source string
const source = "Error at line 42: Invalid input";
const errorRe = /line (\d+)/d;
const errorMatch = errorRe.exec(source);
if (errorMatch) {
  console.log(
    `Found "${errorMatch[0]}" at position ${errorMatch.indices[0][0]}-${errorMatch.indices[0][1]}`
  );
  console.log(
    `Line number "${errorMatch[1]}" at position ${errorMatch.indices[1][0]}-${errorMatch.indices[1][1]}`
  );
}

// 6.9 Optimization tips
console.log("\nOptimization Tips:");

// 1. Use character classes instead of alternation
let charClass = /[abc]/; // Better than /a|b|c/

// 2. Avoid capturing groups if not needed
let nonCapture = /(?:\d+)/; // Better than /(\d+)/ if you don't need groups

// 3. Be specific with anchors
let anchored = /^\d{3}-\d{4}$/; // Better than /\d{3}-\d{4}/ for exact match

console.log("Character class test:", charClass.test("a"));
console.log("Non-capturing group:", "123".match(nonCapture));
console.log("Anchored pattern:", anchored.test("123-456"));

// ============================================
// 7. PRACTICAL USE CASES
// ============================================
/**
 * Practical Regular Expression Use Cases
 *
 * Common Patterns:
 * - Email validation
 * - URL parsing
 * - Phone numbers
 * - Dates
 * - Credit cards
 * - Data extraction
 *
 * Best Practices:
 * - Test patterns thoroughly
 * - Document complex patterns
 * - Consider edge cases
 * - Use verbose patterns for complexity
 */

console.log("\n=== 7. Practical Use Cases Demo ===");

// 7.1 Email validation (simplified)
let emailRe3 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log("Email validation:");
console.log("test@example.com:", emailRe3.test("test@example.com")); // true
console.log("invalid@:", emailRe3.test("invalid@")); // false

// 7.2 URL extraction
let urlRe = /https?:\/\/[^\s]+/g;
let text3 = "Visit https://example.com or http://test.org";
console.log("\nURL extraction:");
console.log("URLs found:", text3.match(urlRe));

// 7.3 Phone number formats
let usPhoneRe = /^(\+1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
console.log("\nUS Phone validation:");
console.log("123-456-7890:", usPhoneRe.test("123-456-7890")); // true
console.log("(123) 456-7890:", usPhoneRe.test("(123) 456-7890")); // true
console.log("123.456.7890:", usPhoneRe.test("123.456.7890")); // true

// 7.4 Extract data from string
let logEntry = "[2024-01-15 10:30:45] ERROR: Database connection failed";
let logRe = /\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+(\w+):\s+(.+)/;
let logMatch = logEntry.match(logRe);
console.log("\nLog parsing:");
console.log("Date:", logMatch[1]);
console.log("Time:", logMatch[2]);
console.log("Level:", logMatch[3]);
console.log("Message:", logMatch[4]);

// 7.5 Extract HTML tag content
let html = "<h1>Hello World</h1>";
let tagRe = /<(\w+)>(.*?)<\/\1>/;
let tagMatch = html.match(tagRe);
console.log("\nHTML tag extraction:");
console.log("Tag:", tagMatch[1]); // h1
console.log("Content:", tagMatch[2]); // Hello World

// 7.6 CSV parsing (simple)
let csv = "John,25,New York,Jane,30,Los Angeles";
let csvRe = /([^,]+)/g;
console.log("\nCSV parsing:");
console.log("Fields:", csv.match(csvRe));

// ============================================
// 7.7 UNICODE PROPERTY ESCAPES (u flag)
// ============================================
/**
 * Unicode Property Escapes (u flag)
 *
 * Syntax: \p{Property=Value} or \p{Property}
 * Negation: \P{Property=Value} (uppercase P)
 *
 * Common Properties:
 * - \p{L}  : Letter (any language)
 * - \p{N}  : Number (any script)
 * - \p{P}  : Punctuation
 * - \p{S}  : Symbol
 * - \p{Z}  : Separator (spaces)
 * - \p{Emoji} : Emoji characters
 * - \p{ASCII} : ASCII range
 * - \p{Letter} : Letter characters
 * - \p{White_Space} : Whitespace characters
 *
 * Requires 'u' flag for Unicode mode
 */

console.log("\n=== 7.7 Unicode Property Escapes Demo ===");

// Match any letter (including non-ASCII like 中文, α, ñ)
let anyLetter = /\p{L}+/gu;
console.log("Any letter:", "Hello中文αñ".match(anyLetter));

// Match any number (including Arabic numerals)
let anyNumber = /\p{N}+/gu;
console.log("Any number:", "123٤٥٦中文".match(anyNumber));

// Match emojis
let emojiRe = /\p{Emoji}+/gu;
console.log("Emojis:", "Hello 🌍🎉 World 👍".match(emojiRe));

// Match punctuation
let punctRe = /\p{P}+/gu;
console.log("Punctuation:", "Hello, world! (test)".match(punctRe));

// Combining properties - Letters and numbers
let alphaNum = /[\p{L}\p{N}]+/gu;
console.log("Alpha-num:", "Hello123中文456".match(alphaNum));

// Script matching - Cyrillic letters
let cyrillic = /\p{Script=Cyrillic}+/gu;
console.log("Cyrillic:", "Hello Привет World".match(cyrillic));

// Name validation with Unicode support
let unicodeNameRe = /[\p{L}\p{M}\p{Z}]+/gu;
console.log("Names:", "José María 中文".match(unicodeNameRe));

// ============================================
// 8. COMMON PITFALLS
// ============================================
/**
 * Regular Expression Pitfalls
 *
 * Common Issues:
 * 1. Greedy vs Lazy matching
 * 2. Catastrophic backtracking
 * 3. Special characters need escaping
 * 4. LastIndex with global flag
 * 5. Unicode and emoji handling
 *
 * Performance Tips:
 * - Be specific with patterns
 * - Avoid nested quantifiers
 * - Use non-capturing groups when possible
 * - Anchor patterns when possible
 */

console.log("\n=== 8. Common Pitfalls Demo ===");

// 8.1 Greedy vs Lazy
let greedyStr = "<div>content1</div><div>content2</div>";
let greedyRe = /<div>.*<\/div>/;
let lazyRe = /<div>.*?<\/div>/;

console.log("Greedy match:", greedyStr.match(greedyRe)[0].length, "chars");
console.log("Lazy match:", greedyStr.match(lazyRe)[0].length, "chars");

// 8.2 Special characters need escaping
let specialStr = "cost: $100";
let wrongRe = /$100/; // $ is anchor!
let correctRe = /\$100/;

console.log("\nSpecial chars:");
console.log("Wrong pattern matches:", wrongRe.test(specialStr)); // false
console.log("Correct pattern matches:", correctRe.test(specialStr)); // true

// 8.3 lastIndex with global flag
let lastIndexRe = /test/g;
let lastIndexStr = "test1 test2 test3";

console.log("\nlastIndex behavior:");
lastIndexRe.exec(lastIndexStr);
console.log("After first exec, lastIndex:", lastIndexRe.lastIndex);
lastIndexRe.exec(lastIndexStr);
console.log("After second exec, lastIndex:", lastIndexRe.lastIndex);

// Reset for next use
lastIndexRe.lastIndex = 0;

// 8.4 Nested quantifiers (performance issue)
// BAD: /(a+)+$/ can cause catastrophic backtracking
// Good: Be specific with patterns
let goodRe2 = /^a+$/;
console.log("\nPerformance:");
console.log("Good pattern is fast:", goodRe2.test("aaaaaa")); // true

// ============================================
// 9. BEST PRACTICES
// ============================================
/**
 * Regular Expression Best Practices
 *
 * 1. TEST PATTERNS THOROUGHLY
 *    - Use regex101.com or similar tools
 *    - Test edge cases
 *    - Test performance
 *
 * 2. DOCUMENT COMPLEX PATTERNS
 *    - Add comments explaining pattern
 *    - Use verbose mode if available
 *    - Document what pattern matches
 *
 * 3. USE APPROPRIATE FLAGS
 *    - g for global match
 *    - i for case insensitive
 *    - m for multiline
 *
 * 4. PREFER NON-CAPTURING GROUPS
 *    - (?:pattern) when capture not needed
 *    - Slightly better performance
 *    - Cleaner results
 *
 * 5. ESCAPE SPECIAL CHARACTERS
 *    - . * + ? ^ $ { } ( ) | [ ] \ /
 *    - Use utility function for dynamic patterns
 */

console.log("\n=== 9. Best Practices Demo ===");

// Good: Documented pattern
// Match ISO date format: YYYY-MM-DD
let isoDateRe = /^\d{4}-\d{2}-\d{2}$/;
console.log("ISO date pattern documented:", isoDateRe.test("2024-01-15"));

// Good: Non-capturing group when capture not needed
let ncGroupRe = /(?:Mr|Mrs)\s+\w+/;

// Good: Escape function for dynamic patterns
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let searchTerm = "test.txt"; // Contains special char .
let escapedRe = new RegExp(escapeRegExp(searchTerm));
console.log("\nEscaped pattern:", escapedRe.test("test.txt"));

// Good: Anchored pattern for exact match
let exactMatchRe = /^\d+$/; // Only digits, entire string
console.log("Anchored exact match:", exactMatchRe.test("12345")); // true

// ============================================
// 10. TYPESCRIPT CONSIDERATIONS
// ============================================
/**
 * TypeScript and Regular Expressions
 *
 * Type Safety:
 * - RegExp has proper typing
 * - String methods work with RegExp
 * - Match results can be typed
 *
 * Template Literal Types:
 * - Type-safe pattern strings
 * - Compile-time validation
 *
 * Best Practices:
 * - Type match results
 * - Handle null cases
 * - Use type guards
 */

console.log("\n=== 10. TypeScript Considerations Demo ===");

// In TypeScript, you would do:
// const regex: RegExp = /pattern/;
// const str: string = "test";
// const match: RegExpMatchArray | null = str.match(regex);

// Type guard for match results (JavaScript version)
function safeMatch(str, regex) {
  const match = str.match(regex);
  return match;
}

// Handle null case
let result = safeMatch("test", /\d+/);
if (result) {
  console.log("Match found:", result);
} else {
  console.log("No match found");
}

console.log("\n=== Regular Expressions Demo Complete ===");

// ============================================
// 11. NEWER REGEXP FEATURES (ES2024 & ES2025)
// ============================================
/**
 * Newer RegExp Features
 *
 * ES2024:
 * - /v flag (RegExp v flag) — Unicode "set notation" in character classes:
 *   intersection (&&), subtraction (--), nested classes, and string properties.
 *
 * ES2025:
 * - RegExp.escape(string) — Escape a literal string for safe use in a RegExp.
 * - Duplicate Named Capture Groups — same group name in alternation branches.
 * - RegExp Modifiers — inline flag changes scoped to a group: (?i:...), (?-i:...).
 *
 * Common Pitfalls:
 * - /v flag changes semantics of existing [\p{...}] patterns (set mode)
 * - RegExp.escape handles all syntax chars, not just the historical subset
 * - Duplicate named groups only work across separate alternation branches
 */

console.log("\n=== 11. Newer RegExp Features (ES2024 & ES2025) Demo ===");

// 11.1 RegExp v flag — Unicode set operations (ES2024)
/*
 * verification:
 *   feature: RegExp v flag
 *   status: ES2024
 *   stage4Date: 2023-05
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nRegExp v flag - set operations (ES2024):");

// Intersection: letters that are also ASCII (excludes é, 中, etc.)
let asciiLetterRe = new RegExp("[\\p{Letter}&&\\p{ASCII}]", "v");
console.log("'A' is ASCII letter:", asciiLetterRe.test("A")); // true
console.log("'é' is ASCII letter:", asciiLetterRe.test("é")); // false (letter but not ASCII)
console.log("'5' is ASCII letter:", asciiLetterRe.test("5")); // false (ASCII but not letter)

// Subtraction: letters minus ASCII = non-ASCII letters
let nonAsciiLetterRe = new RegExp("[\\p{Letter}--\\p{ASCII}]", "v");
console.log("'中' is non-ASCII letter:", nonAsciiLetterRe.test("中")); // true

// String properties (v flag enables multi-code-point string properties)
let emojiKeycapRe = new RegExp("\\p{RGI_Emoji}", "v");
console.log("'😀' is RGI emoji:", emojiKeycapRe.test("😀")); // true

// 11.2 RegExp.escape — escape a literal string for use in a regex (ES2025)
/*
 * verification:
 *   feature: RegExp.escape
 *   status: ES2025
 *   stage4Date: 2025-02
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nRegExp.escape (ES2025):");

// RegExp.escape turns a literal string into a pattern that matches it verbatim,
// so special regex chars like . and * are no longer metacharacters.
if (typeof RegExp.escape === "function") {
  const escaped = RegExp.escape("a.b*");
  console.log("RegExp.escape('a.b*'):", JSON.stringify(escaped));
  // The escaped pattern matches the literal string "a.b*"
  console.log("matches 'a.b*':", new RegExp(escaped).test("a.b*")); // true
  console.log("does NOT match 'aXbX':", new RegExp(escaped).test("aXbX")); // false

  // Practical use: safely build a regex from user input
  const userInput = "price: $5.00 (each)";
  const safeRe = new RegExp(RegExp.escape(userInput));
  console.log(
    "user input match:",
    safeRe.test("The price: $5.00 (each) is firm")
  ); // true
} else {
  console.log(
    "RegExp.escape not supported in this runtime (needs Node 24+ / ES2025)"
  );
}

// 11.3 Duplicate Named Capture Groups (ES2025)
/*
 * verification:
 *   feature: Duplicate Named Capture Groups
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nDuplicate Named Capture Groups (ES2025):");

// Before ES2025, reusing a group name in alternation branches was a SyntaxError.
// Now the same name can appear in separate alternatives; whichever branch matches
// populates groups.name (the other is undefined).
try {
  const dupNamedRe = /^(?:(?<a>x)|(?<a>y))$/;
  console.log("'x' match groups:", dupNamedRe.exec("x").groups); // { a: 'x' }
  console.log("'y' match groups:", dupNamedRe.exec("y").groups); // { a: 'y' }

  // Practical: parse "key:value" OR "key=value" into the same named groups
  const kvRe = /^(?:(?<key>\w+):(?<value>\w+)|(?<key>\w+)=(?<value>\w+))$/;
  const colonMatch = kvRe.exec("name:Alice");
  const eqMatch = kvRe.exec("name=Bob");
  console.log(
    "colon form:",
    colonMatch.groups.key,
    "=",
    colonMatch.groups.value
  ); // name = Alice
  console.log("equals form:", eqMatch.groups.key, "=", eqMatch.groups.value); // name = Bob
} catch (e) {
  console.log("Duplicate named groups not supported:", e.message);
}

// 11.4 RegExp Modifiers — inline flag scoping (ES2025)
/*
 * verification:
 *   feature: RegExp Modifiers
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nRegExp Modifiers (ES2025):");

// (?flags:...) applies flags only inside that group; (?-flags:...) removes them.
// Useful when only part of a pattern needs case-insensitivity or dotAll.
try {
  // (?i:foo) — match "foo" case-insensitively while the rest stays case-sensitive
  const caseInsensitivePart = /label: (?i:foo)/;
  console.log("'label: FOO' matches:", caseInsensitivePart.test("label: FOO")); // true (i scoped to foo)
  console.log("'LABEL: foo' matches:", caseInsensitivePart.test("LABEL: foo")); // false (label is case-sensitive)

  // (?-i:...) removes a flag inherited from the whole regex
  const mixedRe = /HELLO (?-i:world)/i; // whole regex is i, but "world" is case-sensitive
  console.log("'hello WORLD' matches:", mixedRe.test("hello WORLD")); // false (world is case-sensitive)
  console.log("'hello world' matches:", mixedRe.test("hello world")); // true
} catch (e) {
  console.log("RegExp modifiers not supported:", e.message);
}

// ============================================
// SUMMARY
// ============================================
/**
 * Regular Expressions Summary
 *
 * Key Concepts:
 * 1. Two creation methods: literal and RegExp constructor
 * 2. Character classes, quantifiers, anchors
 * 3. Methods: test, exec, match, matchAll, search, replace, split
 * 4. Flags: g, i, m, s, u, y
 * 5. Capturing groups and backreferences
 * 6. Lookahead and lookbehind assertions
 * 7. Practical patterns for common tasks
 *
 * When to Use:
 * - Pattern matching and validation
 * - Text parsing and extraction
 * - Search and replace operations
 *
 * When to Avoid:
 * - HTML parsing (use DOM/parser)
 * - Complex nested structures
 * - When string methods suffice
 */

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 04-strings.js - Strings and string methods");
console.log("📘 22-iterators-generators.js - Iterators and generators");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 21-regex-ts-comparison.ts
*/
