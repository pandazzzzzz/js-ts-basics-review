// TypeScript vs JavaScript: DOM Manipulation Comparison
// 📘 For JavaScript examples, see: 36-dom-manipulation.js
// This file demonstrates TypeScript-specific type features for DOM manipulation

// 🎯 Difficulty: Intermediate
export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: Creating Elements - Type Precision
// ============================================

console.log("=== Section 1: Creating Elements - TypeScript Type Precision ===\n");

console.log("🧬 createElement Type Inference:\n");

console.log(`
// TypeScript provides automatic type inference for common elements

const div = document.createElement('div');
// div: HTMLDivElement ✅

div.id = 'myDiv';           // ✅ OK
div.textContent = 'Hello';  // ✅ OK
div.value;                  // ❌ Error: Property 'value' doesn't exist

const input = document.createElement('input');
// input: HTMLInputElement ✅

input.type = 'text';        // ✅ OK
input.value = 'text';       // ✅ OK
input.placeholder = 'Enter'; // ✅ OK
input.submit();             // ❌ Error: 'submit' is not a method on HTMLInputElement

// 📋 Common createElement Return Types:
const anchor = document.createElement('a');       // HTMLAnchorElement
const button = document.createElement('button');  // HTMLButtonElement
const canvas = document.createElement('canvas');  // HTMLCanvasElement
const form = document.createElement('form');      // HTMLFormElement
const img = document.createElement('img');        // HTMLImageElement
const li = document.createElement('li');          // HTMLLIElement
const select = document.createElement('select');  // HTMLSelectElement
const table = document.createElement('table');    // HTMLTableElement
const textarea = document.createElement('textarea'); // HTMLTextAreaElement
const video = document.createElement('video');    // HTMLVideoElement
`);

console.log("\n🎨 createElementNS Namespace Support:\n");

console.log(`
// SVG element creation with proper typing
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
// svg: SVGSVGElement ✅

const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
// circle: SVGCircleElement ✅

circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
circle.setAttribute('fill', 'red');

// SVG-specific properties
const svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement;
svgRect.x.baseVal.value = 10;  // ✅ SVGAnimatedLength
svgRect.width.baseVal.value = 100; // ✅ OK
`);

console.log("\n📄 createTextNode Type:\n");

console.log(`
const textNode = document.createTextNode('Hello');
// textNode: Text ✅

textNode.data;          // ✅ string
textNode.nodeValue;     // ✅ string | null
textNode.textContent;   // ✅ string | null

// ⚠️ Text node doesn't have element properties
textNode.className;     // ❌ Error
`);

console.log("\n🔄 cloneNode Return Type:\n");

console.log(`
// ⚠️ cloneNode returns Node, needs type assertion
const original = document.createElement('div');
const shallow = original.cloneNode(false);
// shallow: Node ❌ Not specific enough

// ✅ Type assertion for precise typing
const cloned = original.cloneNode(true) as HTMLDivElement;
// cloned: HTMLDivElement ✅

cloned.id = 'cloned-id';
cloned.textContent = 'Cloned content';
`);

console.log("\n📦 DocumentFragment Type:\n");

console.log(`
// DocumentFragment has dedicated type
const fragment = document.createDocumentFragment();
// fragment: DocumentFragment ✅

fragment.appendChild(document.createElement('div'));
fragment.append(document.createElement('span')); // DOM API (ParentNode.append) — WHATWG DOM

// ✅ Type-safe batch insertion
function createFragment<T extends Node>(
  items: T[],
  renderer: (item: T) => HTMLElement
): DocumentFragment {
  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(renderer(item)));
  return frag;
}

const items = ['A', 'B', 'C'];
const frag = createFragment(items, text => {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
});
`);

// ============================================
// Section 2: Insertion Methods - Type Safety
// ============================================

console.log("\n=== Section 2: Insertion Methods - Type Safety ===\n");

console.log("🔧 Modern Insertion Methods Type Signatures:\n");

console.log(`
// append/prepend/before/after accept Node | string | DocumentFragment
const parent = document.createElement('div');

parent.append('Text');                          // ✅ string
parent.append(document.createElement('span'));  // ✅ Node
parent.append(document.createDocumentFragment()); // ✅ DocumentFragment
parent.append('Text', document.createElement('b')); // ✅ Multiple

// ❌ TypeScript catches invalid types
parent.append(123);     // ❌ Error: Argument of type 'number' not assignable
parent.append(null);    // ❌ Error: 'null' is not valid

// ⚠️ Note: These methods return void
const result = parent.append('test');
// result: void (undefined at runtime)
`);

console.log("\n📜 Traditional Insertion Methods Return Types:\n");

console.log(`
const child = document.createElement('div');

// appendChild returns added Node
const added = parent.appendChild(child);
// added: Node ✅

// insertBefore returns added Node
const ref = document.createElement('div');
parent.appendChild(ref);
const inserted = parent.insertBefore(child, ref);
// inserted: Node ✅

// replaceChild returns removed Node
const removed = parent.replaceChild(child, ref);
// removed: Node ✅

// ⚠️ Returns Node, not specific element type - may need narrowing
`);

console.log("\n🎯 insertAdjacent* Type Parameters:\n");

console.log(`
const elem = document.createElement('div');

// insertAdjacentHTML accepts only valid position strings
elem.insertAdjacentHTML('beforeend', '<span>Content</span>'); // ✅ OK

// TypeScript checks position parameter
elem.insertAdjacentHTML('invalid', '<span>Content</span>'); // ❌ Error

// Available positions: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

// Element version
elem.insertAdjacentElement('afterbegin', document.createElement('div')); // ✅ OK

// Text version
elem.insertAdjacentText('beforeend', 'Some text'); // ✅ OK
`);

// ============================================
// Section 3: Element Removal - Type Considerations
// ============================================

console.log("\n=== Section 3: Element Removal - Type Considerations ===\n");

console.log("🗑️ Removal Methods:\n");

console.log(`
const elem = document.createElement('div');

// Modern remove() method
elem.remove();  // ✅ Simple, returns void

// Traditional removeChild method
if (elem.parentNode) {
  const removed = elem.parentNode.removeChild(elem);
  // removed: Node ✅
  // elem still accessible but removed from DOM
}

// ❌ Can't remove if no parent
elem.parentNode.removeChild(elem); // ❌ Error: parentNode may be null

// ✅ Safe removal pattern
function safeRemove(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

// ✅ Or use optional chaining
elem.parentNode?.removeChild(elem);
`);

console.log("\n⚠️ Element Persists After Removal:\n");

console.log(`
const elem = document.createElement('div');
document.body.appendChild(elem);

elem.remove();
// elem still exists in memory!

console.log(elem.textContent);  // ✅ Still accessible
elem.textContent = 'Modified';  // ✅ Can still modify

// But elem.parentNode is null
if (elem.parentNode === null) {
  console.log('Not in DOM anymore');
}
`);

// ============================================
// Section 4: Batch Operations - Type-Safe Patterns
// ============================================

console.log("\n=== Section 4: Batch Operations - Type-Safe Patterns ===\n");

console.log("🚀 Performance Optimization with TypeScript:\n");

console.log(`
// ❌ Slow: Multiple reflows with type warnings
const container = document.createElement('div');
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  container.appendChild(div);
}

// ✅ Fast: DocumentFragment with proper typing
function bulkInsert(
  container: HTMLElement,
  count: number,
  renderer: (index: number) => HTMLElement
): void {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(renderer(i));
  }
  container.appendChild(fragment);
}

// Usage
bulkInsert(container, 100, i => {
  const div = document.createElement('div');
  div.textContent = \`Item \${i}\`;
  return div;
});

// Generic type-safe version
function createElements<T>(
  items: T[],
  createFn: (item: T, index: number) => HTMLElement
): DocumentFragment {
  const frag = document.createDocumentFragment();
  items.forEach((item, index) => {
    frag.appendChild(createFn(item, index));
  });
  return frag;
}
`);

console.log("\n📋 Template Clone Pattern with Types:\n");

console.log(`
// Define template interface
interface CardData {
  title: string;
  content: string;
}

// Create reusable template
const createCardTemplate = (): HTMLDivElement => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h3></h3><p></p>';
  return card;
};

// Clone and populate with type safety
function createCard(data: CardData): HTMLDivElement {
  const card = createCardTemplate().cloneNode(true) as HTMLDivElement;
  const title = card.querySelector('h3');
  const content = card.querySelector('p');

  if (title && content) {
    title.textContent = data.title;
    content.textContent = data.content;
  }

  return card;
}

// Or use generic with assertion
function createCardSafe(data: CardData): HTMLDivElement {
  const card = createCardTemplate().cloneNode(true) as HTMLDivElement;
  const title = card.querySelector('h3') as HTMLHeadingElement;
  const content = card.querySelector('p') as HTMLParagraphElement;

  title.textContent = data.title;
  content.textContent = data.content;

  return card;
}
`);

console.log("\n⚡ Offline Operations Type Pattern:\n");

console.log(`
// Detached DOM manipulation
function offlineUpdate<T extends HTMLElement>(
  element: T,
  updates: (elem: T) => void
): T {
  if (!element.parentNode) {
    updates(element);
    return element;
  }

  const parent = element.parentNode;
  const nextSibling = element.nextSibling;

  parent.removeChild(element);
  updates(element);
  parent.insertBefore(element, nextSibling);

  return element;
}

// Usage
const div = document.createElement('div');
offlineUpdate(div, elem => {
  elem.style.width = '100px';
  elem.style.height = '100px';
  elem.style.backgroundColor = 'red';
});
`);

// ============================================
// Section 5: Table and Form APIs - Precise Types
// ============================================

console.log("\n=== Section 5: Table and Form APIs - Precise Types ===\n");

console.log("📊 HTMLTableElement Type Features:\n");

console.log(`
const table = document.createElement('table');
// table: HTMLTableElement ✅

// Type-safe property access
table.rows;              // HTMLCollectionOf<HTMLTableRowElement> ✅
table.tBodies;           // HTMLCollectionOf<HTMLTableSectionElement> ✅
table.tHead;             // HTMLTableSectionElement | null ✅
table.caption;           // HTMLTableCaptionElement | null ✅

// Type-safe methods
const row = table.insertRow();
// row: HTMLTableRowElement ✅

row.cells;               // HTMLCollectionOf<HTMLTableCellElement> ✅
row.sectionRowIndex;     // number ✅
row.rowIndex;            // number ✅

const cell = row.insertCell();
// cell: HTMLTableCellElement ✅

cell.colSpan;            // number ✅
cell.rowSpan;            // number ✅
cell.cellIndex;          // number ✅

// Type-safe row operations
function addTableRow(
  table: HTMLTableElement,
  cells: string[]
): HTMLTableRowElement {
  const row = table.insertRow();
  cells.forEach(text => {
    const cell = row.insertCell();
    cell.textContent = text;
  });
  return row;
}

// Usage
addTableRow(table, ['John', '25', 'Engineer']);
`);

console.log("\n🔽 HTMLSelectElement Type Features:\n");

console.log(`
const select = document.createElement('select');
// select: HTMLSelectElement ✅

select.options;           // HTMLOptionsCollection ✅
select.length;            // number ✅
select.selectedIndex;     // number ✅
select.value;             // string ✅
select.multiple;          // boolean ✅

// Type-safe option creation
const option = new Option('Label', 'value', false, false);
// option: HTMLOptionElement ✅

option.text;              // string ✅
option.value;             // string ✅
option.selected;          // boolean ✅
option.disabled;          // boolean ✅

// Type-safe addition
select.add(option);                    // ✅ OK
select.add(option, 0);                 // ✅ Insert at index
select.add(option, select.options[0]); // ✅ Insert before existing

// ❌ TypeScript catches invalid usage
select.add('string');  // ❌ Error: Argument not HTMLOptionElement

// Type-safe removal
select.remove(0);      // ✅ OK
`);

console.log("\n📋 Other Form Element Types:\n");

console.log(`
// HTMLFormElement
const form = document.createElement('form');
// form: HTMLFormElement ✅

form.elements;           // HTMLFormControlsCollection ✅
form.length;             // number ✅
form.name;               // string ✅
form.submit();           // void ✅
form.reset();            // void ✅

// Access by name with type assertion
const field = form.elements.namedItem('username') as HTMLInputElement;
field.value = 'test';

// HTMLInputElement
const input = document.createElement('input');
input.type = 'text';     // ✅ OK
input.value = 'text';    // ✅ OK
input.checked = true;    // ✅ OK (checkbox/radio specific)
input.files;             // FileList | null ✅ (file input specific)

// HTMLTextAreaElement
const textarea = document.createElement('textarea');
textarea.value = 'text'; // ✅ OK
textarea.rows = 5;       // ✅ number
textarea.cols = 50;      // ✅ number
textarea.selectionStart; // ✅ number
textarea.selectionEnd;   // ✅ number

// Type-safe selection
function selectText(element: HTMLInputElement | HTMLTextAreaElement): void {
  element.select();
  element.setSelectionRange(0, element.value.length);
}
`);

// ============================================
// Section 6: Type Guards and Utilities
// ============================================

console.log("\n=== Section 6: Type Guards and Utilities ===\n");

console.log("🛡️ Type Guard Functions:\n");

console.log(`
// Narrowing element types
function isInputElement(elem: Element): elem is HTMLInputElement {
  return elem instanceof HTMLInputElement;
}

function isTableRow(elem: Element): elem is HTMLTableRowElement {
  return elem instanceof HTMLTableRowElement;
}

function isSVGElement(elem: Element): elem is SVGElement {
  return elem instanceof SVGElement;
}

// Usage
const elem = document.querySelector('#field');
if (elem && isInputElement(elem)) {
  console.log(elem.value);  // ✅ TypeScript knows it's HTMLInputElement
  console.log(elem.type);   // ✅ OK
}
`);

console.log("\n⚙️ Type-Safe Utility Functions:\n");

console.log(`
// Safe element creation with props
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Partial<HTMLElementTagNameMap[K]>
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) Object.assign(el, props);
  return el;
}

// Usage
const button = createElement('button', {
  textContent: 'Click me',
  disabled: false,
  type: 'button'
}); // Returns: HTMLButtonElement ✅

const input = createElement('input', {
  type: 'text',
  placeholder: 'Enter text',
  value: ''
}); // Returns: HTMLInputElement ✅

// Generic element getter
function getElement<T extends HTMLElement>(selector: string): T {
  const elem = document.querySelector<T>(selector);
  if (!elem) {
    throw new Error(\`Element not found: \${selector}\`);
  }
  return elem;
}

// Optional element getter
function maybeGetElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

// Array of elements
function getElements<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}
`);

console.log("\n🔌 Type Assertions for DOM Navigation:\n");

console.log(`
// Better: Use element-specific properties (no assertion needed)
const parent = elem.parentElement;        // Element | null ✅
const next = elem.nextElementSibling;     // Element | null ✅
const first = container.firstElementChild; // Element | null ✅

// If you must assert, be specific
const nodeParent = elem.parentNode as HTMLElement;      // Not Document
const nodeNext = elem.nextSibling as HTMLElement;       // Not Text/Comment
const nodeFirst = container.firstChild as HTMLElement;  // Not Text/Comment

// Safer: Use type guards
function isElement(node: Node | null): node is Element {
  return node !== null && node.nodeType === Node.ELEMENT_NODE;
}

if (isElement(elem.firstChild)) {
  console.log(elem.firstChild.tagName);
}
`);

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Use generic querySelector: querySelector<T>()");
console.log("2. Leverage createElement type inference for precise types");
console.log("3. Use type guards (instanceof) for narrowing element types");
console.log("4. Use element-specific navigation (parentElement, nextElementSibling)");
console.log("5. Assert cloneNode return types when needed");
console.log("6. Create type-safe utility functions for common patterns");
console.log("7. Use HTMLElementTagNameMap for generic element creation\n");

console.log("❌ DON'T:\n");
console.log("1. Don't use 'as any' to bypass type checking");
console.log("2. Don't forget type assertions for cloneNode (returns Node)");
console.log("3. Don't use parentNode/nextSibling without type guard or assertion");
console.log("4. Don't ignore null returns from query methods");
console.log("5. Don't mix text nodes and element nodes without checking\n");
