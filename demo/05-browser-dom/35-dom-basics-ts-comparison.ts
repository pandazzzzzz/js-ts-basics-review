// TypeScript vs JavaScript: DOM Basics Comparison
// 📘 For JavaScript examples, see: 35-dom-basics.js
// This file demonstrates TypeScript-specific type features for DOM manipulation

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: DOM Tree Structure - Type Safety
// ============================================

console.log("=== Section 1: DOM Tree Structure - TypeScript Types ===\n");

console.log("🔒 TypeScript provides precise types for DOM nodes:\n");
console.log(`
// TypeScript provides precise types for DOM nodes
const elementNode: typeof Node.ELEMENT_NODE = 1;
const textNode: typeof Node.TEXT_NODE = 3;
const commentNode: typeof Node.COMMENT_NODE = 8;
const documentNode: typeof Node.DOCUMENT_NODE = 9;
const doctypeNode: typeof Node.DOCUMENT_TYPE_NODE = 10;
`);

console.log("\n📋 DOM Navigation - Type Safety:\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - DOM NAVIGATION                          │
├─────────────────────────────────────────────────────────────────────┤
│ JavaScript:                                                         │
│   const elem = document.getElementById('myId');                    │
│   elem.parentNode          // any type                              │
│   elem.childNodes          // NodeList (no type check)              │
│                                                                     │
│ TypeScript:                                                         │
│   const elem = document.getElementById('myId');                    │
│   // elem: HTMLElement | null                                       │
│   if (elem?.parentNode) {                                          │
│     elem.parentNode;       // Node | null                           │
│   }                                                                 │
│   elem.parentElement       // Element | null                        │
│   elem.children            // HTMLCollection                        │
│   elem.firstElementChild   // Element | null                        │
└─────────────────────────────────────────────────────────────────────┘
`);

// ============================================
// Section 2: Searching and Getting Elements
// ============================================

console.log("\n=== Section 2: Element Selection - Type Safety ===\n");

console.log("🔍 Generic Query Selector Methods:\n");

console.log(`
// ❌ JavaScript - No type inference
const input = document.querySelector('.field');
input.value;  // Runtime error! Element doesn't have 'value'

// ✅ TypeScript - Explicit generic type
const input = document.querySelector<HTMLInputElement>('.field');
// input: HTMLInputElement | null

if (input) {
  input.value;  // ✅ OK - TypeScript knows this is HTMLInputElement
}

// ✅ Using type assertion
const div = document.getElementById('container') as HTMLDivElement;
div.innerHTML = '<p>Hello</p>';  // ✅ OK

// ✅ Non-null assertion (use when you're certain element exists)
const mustExist = document.getElementById('required')!;
// mustExist: HTMLElement (not nullable)
`);

console.log("\n📊 Live vs Static Collections - Type Differences:\n");

console.log(`
┌─────────────────────┬──────────────────┬─────────────────────────────┐
│ Method              │ JS Return        │ TS Return Type              │
├─────────────────────┼──────────────────┼─────────────────────────────┤
│ getElementById      │ Element/null     │ HTMLElement | null          │
│ querySelector       │ Element/null     │ Element | null              │
│ querySelectorAll    │ NodeList         │ NodeList<Element>           │
│ getElementsByTagName│ HTMLCollection   │ HTMLCollectionOf<T>         │
│ getElementsByClass  │ HTMLCollection   │ HTMLCollectionOf<Element>   │
│ children            │ HTMLCollection   │ HTMLCollection              │
└─────────────────────┴──────────────────┴─────────────────────────────┘

// TypeScript generic collection example:
const inputs = document.getElementsByTagName('input');
// inputs: HTMLCollectionOf<HTMLInputElement>

for (let i = 0; i < inputs.length; i++) {
  inputs[i].value;  // ✅ TypeScript knows these are HTMLInputElement
}
`);

console.log("\n⚠️ Live Collection Trap - Type-Safe Handling:\n");

console.log(`
// ❌ Wrong: Iterating live collection while modifying
const items = document.getElementsByClassName('item');
for (let i = 0; i < items.length; i++) {
  items[i].remove();  // Skips elements!
}

// ✅ Correct: Convert to array first (type-safe way)
const items = document.getElementsByClassName('item');
[...items].forEach(item => item.remove());
// item: Element (inferred from HTMLCollectionOf)

// ✅ Or iterate in reverse
for (let i = items.length - 1; i >= 0; i--) {
  items[i].remove();
}
`);

// ============================================
// Section 3: Node Properties and Content
// ============================================

console.log("\n=== Section 3: Content Properties - Type Safety ===\n");

console.log("📝 Content Property Types:\n");

console.log(`
// TypeScript provides precise return types for content properties
const elem = document.getElementById('content');

if (elem) {
  // innerHTML: string
  elem.innerHTML = '<strong>Bold</strong>';

  // textContent: string | null
  elem.textContent = 'Plain text';

  // outerHTML: string (getter), void (setter)
  console.log(elem.outerHTML);

  // innerText: string (triggers reflow)
  elem.innerText = 'Rendered text';
}

// ⚠️ Text node specific - need type guard
const node = elem.firstChild;
if (node.nodeType === Node.TEXT_NODE) {
  // TypeScript still needs narrowing for text-specific properties
  const textNode = node as Text;
  console.log(textNode.data);      // ✅ OK
  console.log(textNode.nodeValue); // ✅ OK
}
`);

console.log("\n🔧 Hidden Property Type:\n");

console.log(`
// hidden property is boolean in TypeScript
element.hidden = true;   // ✅ OK
element.hidden = false;  // ✅ OK
element.hidden = 'true'; // ❌ Error: Type 'string' is not assignable to 'boolean'
`);

// ============================================
// Section 4: Attribute Operations
// ============================================

console.log("\n=== Section 4: Attributes - Type Safety ===\n");

console.log("📖 Attribute vs Property - TypeScript View:\n");

console.log(`
// Standard attributes auto-sync with known types
const input = document.getElementById('name') as HTMLInputElement;

// Property access (type-safe)
input.id;           // string
input.className;    // string (not 'class'!)
input.value;        // string
input.disabled;     // boolean
input.checked;      // boolean

// Attribute access (always returns string | null)
input.getAttribute('value');  // string | null
input.setAttribute('value', 'test');  // value converted to string
input.removeAttribute('disabled');
input.hasAttribute('required');  // boolean

// ⚠️ Important: getAttribute always returns string or null
const value = input.getAttribute('disabled');
// value: string | null (not boolean!)
// Need to check existence, not truthiness
const isDisabled = input.hasAttribute('disabled');  // ✅ Correct
`);

console.log("\n📦 dataset Type Safety:\n");

console.log(`
// dataset provides Record<string, string> type
const user = document.getElementById('user') as HTMLElement;

// All dataset values are strings
user.dataset.id;         // string | undefined
user.dataset.userRole;   // string | undefined (auto camelCase)

// Setting converts to string
user.dataset.status = 'active';
user.dataset.count = String(42);  // Numbers need explicit conversion

// Type-safe pattern for numeric data attributes
interface UserData {
  id: string;
  role: string;
  count?: number;
}

function getUserData(element: HTMLElement): UserData {
  return {
    id: element.dataset.id!,
    role: element.dataset.userRole!,
    count: element.dataset.count ? parseInt(element.dataset.count, 10) : undefined
  };
}
`);

console.log("\n📊 Common Attribute Mappings:\n");

console.log(`
┌────────────────┬─────────────────────┬─────────────────────┐
│ HTML Attribute │ TypeScript Property │ Type                │
├────────────────┼─────────────────────┼─────────────────────┤
│ class          │ className           │ string              │
│ for            │ htmlFor             │ string              │
│ readonly       │ readOnly            │ boolean             │
│ maxlength      │ maxLength           │ number              │
│ colspan        │ colSpan             │ number              │
│ rowspan        │ rowSpan             │ number              │
│ tabindex       │ tabIndex            │ number              │
│ contenteditable│ contentEditable     │ string              │
└────────────────┴─────────────────────┴─────────────────────┘
`);

// ============================================
// Section 5: Styles and Classes
// ============================================

console.log("\n=== Section 5: Styles and Classes - Type Safety ===\n");

console.log("🏷️ className vs classList:\n");

console.log(`
// className is string type
element.className = 'btn primary large';  // Replaces all classes
const classes: string = element.className;

// classList provides DOMTokenList interface (type-safe methods)
element.classList.add('active', 'highlight');     // ✅ OK
element.classList.remove('old');                   // ✅ OK
element.classList.toggle('active');                // Returns boolean
element.classList.toggle('active', condition);     // Conditional toggle
element.classList.contains('active');              // Returns boolean
element.classList.replace('old', 'new');           // ES2018+

// Iteration with type inference
for (const className of element.classList) {
  // className: string
  console.log(className);
}

// Convert to array (useful for filtering)
const classArray: string[] = [...element.classList];
`);

console.log("\n🎨 Inline Style Type Safety:\n");

console.log(`
// style property is CSSStyleDeclaration type
element.style.color = 'red';              // ✅ OK
element.style.backgroundColor = '#f0f0f0'; // ✅ OK (camelCase)
element.style.fontSize = '16px';          // ✅ OK

// ❌ TypeScript catches invalid properties
element.style.invalidProperty = 'value';  // Error: Property does not exist

// Values must be strings with units
element.style.width = '100px';  // ✅ OK
element.style.width = 100;      // ❌ Error: Type 'number' not assignable

// Remove style by setting empty string
element.style.color = '';  // Reverts to CSS/default

// cssText for bulk operations
element.style.cssText = 'color: red; background: blue;';  // Overwrites
element.style.cssText += 'border: 1px solid black';       // Appends
`);

console.log("\n👁️ getComputedStyle Type:\n");

console.log(`
// getComputedStyle returns Readonly<CSSStyleDeclaration>
const styles = getComputedStyle(element);

// Read-only - cannot modify
styles.width = '100px';  // ❌ Error: Cannot assign to 'width'

// Returns resolved/computed values
styles.width;   // "100px" (absolute value)
styles.color;   // "rgb(255, 0, 0)" (normalized)

// Get pseudo-element styles
const afterStyles = getComputedStyle(element, '::after');

// Type-safe property access
const fontSize: string = styles.fontSize;
const display: string = styles.display;
`);

console.log("\n🎯 CSS Variables Type Support:\n");

console.log(`
// CSS custom properties via setProperty/getPropertyValue
element.style.setProperty('--theme-color', '#ff6600');
const color = getComputedStyle(element).getPropertyValue('--theme-color');
// color: string

// Utility functions with proper types
function setCSSVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(\`--\${name}\`, value);
}

function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(\`--\${name}\`).trim();
}

// Usage
setCSSVariable('primary-color', '#007bff');
const primary = getCSSVariable('primary-color');
`);

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Use generic query selectors: querySelector<T>()");
console.log("2. Check for null before accessing element properties");
console.log("3. Use element-specific types (HTMLInputElement, etc.)");
console.log("4. Prefer classList over className for class manipulation");
console.log("5. Use hasAttribute() for boolean checks, not getAttribute()");
console.log("6. Use type guards for narrowing element types\n");

console.log("❌ DON'T:\n");
console.log("1. Don't use non-null assertion (!) unless certain element exists");
console.log("2. Don't forget that getAttribute returns string | null");
console.log("3. Don't use style for reading computed styles (use getComputedStyle)");
console.log("4. Don't modify getComputedStyle result (it's readonly)\n");
