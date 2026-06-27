// TypeScript vs JavaScript: Event System Comparison
// 📘 For JavaScript examples, see: 37-events.js
// This file demonstrates TypeScript-specific type features for event handling

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: Event Handler Type Inference
// ============================================

console.log("=== Section 1: Event Handler Type Inference ===\n");

console.log("🎯 Precise Event Type Inference:\n");

console.log(`
// TypeScript automatically infers the correct event type

const button = document.createElement('button');

// MouseEvent - mouse events
button.addEventListener('click', (e) => {
  // e: MouseEvent ✅
  console.log(e.clientX);   // ✅ OK (number)
  console.log(e.clientY);   // ✅ OK (number)
  console.log(e.button);    // ✅ OK (0=left, 1=middle, 2=right)

  // ❌ TypeScript catches invalid property access
  // e.key;  // Error: Property 'key' does not exist on type 'MouseEvent'
});

const input = document.createElement('input');

// KeyboardEvent - keyboard events
input.addEventListener('keydown', (e) => {
  // e: KeyboardEvent ✅
  console.log(e.key);       // ✅ OK (string)
  console.log(e.code);      // ✅ OK (string)
  console.log(e.ctrlKey);   // ✅ OK (boolean)

  // ❌ Invalid for keyboard events
  // e.clientX;  // Error: Property 'clientX' does not exist on type 'KeyboardEvent'
});

// InputEvent - input events
input.addEventListener('input', (e) => {
  // e: InputEvent ✅
  console.log(e.inputType); // ✅ OK (string)
  console.log(e.data);      // ✅ OK (string | null)
});

// FocusEvent - focus events
input.addEventListener('focus', (e) => {
  // e: FocusEvent ✅
  console.log(e.relatedTarget); // ✅ OK (EventTarget | null)
});

// CustomEvent - custom events
button.addEventListener('custom', (e) => {
  // e: Event (not CustomEvent unless 'custom' is in HTMLElementEventMap)
  console.log((e as CustomEvent).detail);    // cast needed to access detail
});
`);

console.log("\n📋 Common Event Types Reference:\n");

console.log(`
┌────────────────────┬──────────────────┬──────────────────────────────────┐
│ Event Type         │ TypeScript Type  │ Common Properties                    │
├────────────────────┼──────────────────┼──────────────────────────────────┤
│ click, mouse*      │ MouseEvent       │ clientX, clientY, button, buttons│
│ keydown, keyup     │ KeyboardEvent    │ key, code, ctrlKey, shiftKey     │
│ input              │ InputEvent       │ inputType, data                  │
│ change, submit     │ Event            │ target                           │
│ focus, blur        │ FocusEvent       │ relatedTarget                    │
│ scroll, wheel      │ WheelEvent       │ deltaX, deltaY, deltaZ           │
│ touch*             │ TouchEvent       │ touches, changedTouches          │
│ drag*              │ DragEvent        │ dataTransfer                     │
│ animation*         │ AnimationEvent   │ animationName                    │
│ transition*        │ TransitionEvent  │ propertyName                     │
└────────────────────┴──────────────────┴──────────────────────────────────┘
`);

console.log("\n🎨 Explicit Type Annotation:\n");

console.log(`
// When type inference is ambiguous, explicitly annotate

// Explicit type annotation
button.addEventListener('click', (e: MouseEvent) => {
  console.log(e.button);
});

// Function with explicit this (arrow functions cannot have a this parameter)
const handler = function (this: HTMLButtonElement, e: MouseEvent) {
  this.classList.add('active');
};

button.addEventListener('click', handler);

// ❌ Wrong: this is not properly typed
// button.addEventListener('click', function(e) {
//   this.classList.add('active');  // Error: this is any
// });

// ✅ Correct: Explicit this type
button.addEventListener('click', function(this: HTMLButtonElement, e: MouseEvent) {
  this.classList.add('active');  // ✅ OK
});
`);

// ============================================
// Section 2: addEventListener Type Safety
// ============================================

console.log("\n=== Section 2: addEventListener Type Safety ===\n");

console.log("🔧 addEventListener Generic Overload:\n");

console.log(`
const elem = document.createElement('div');

// Generic type safety - TypeScript knows the callback signature
elem.addEventListener('click', (e: MouseEvent) => {
  console.log(e.clientX);
});

// Note: arbitrary string event names are accepted (fall back to Event type)
// elem.addEventListener('nonexistent', (e) => { /* e: Event */ });  // no error

// ❌ Wrong handler type
// elem.addEventListener('click', (e: KeyboardEvent) => {
//   console.log(e.key);  // Error: Event type mismatch
// });
`);

console.log("\n📦 Options Object Type Safety:\n");

console.log(`
// Type-safe options object
elem.addEventListener('click', handler, {
  capture: false,   // ✅ boolean
  once: true,       // ✅ boolean
  passive: true,    // ✅ boolean
  signal: undefined // ✅ AbortSignal | undefined
});

// ❌ Invalid options
// elem.addEventListener('click', handler, {
//   invalidOption: true  // Error: Object literal may only specify known properties
// });

// ✅ Using AbortController for cleanup
const controller = new AbortController();
elem.addEventListener('click', handler, { signal: controller.signal });

// Later cleanup
controller.abort();  // Removes all listeners with this signal
`);

console.log("\n🎯 EventListenerObject Pattern:\n");

console.log(`
// Object-based listener (handleEvent pattern)
const listener: EventListenerObject = {
  handleEvent(e: Event) {
    console.log('Event:', e.type);
  }
};

elem.addEventListener('click', listener);

// Type-safe object listener with specific event type
const mouseListener: EventListenerObject = {
  handleEvent(e: MouseEvent) {
    console.log('Mouse position:', e.clientX, e.clientY);
  }
};

elem.addEventListener('click', mouseListener);

// ❌ TypeScript catches type mismatch
// const keyboardListener: EventListenerObject = {
//   handleEvent(e: KeyboardEvent) {
//     console.log(e.key);
//   }
// };
// elem.addEventListener('click', keyboardListener);  // Error: Type mismatch
`);

// ============================================
// Section 3: DOM Element Precise Types
// ============================================

console.log("\n=== Section 3: DOM Element Precise Types ===\n");

console.log("🧬 Generic Query Selector:\n");

console.log(`
// Explicit element type specification
const input = document.querySelector<HTMLInputElement>('#username');
// input: HTMLInputElement | null ✅

if (input) {
  input.value = 'text';       // ✅ OK
  input.type = 'text';        // ✅ OK
  input.placeholder = 'Enter'; // ✅ OK
  input.select();             // ✅ OK (method specific to HTMLInputElement)
}

// Multiple element type
const selects = document.querySelectorAll<HTMLSelectElement>('select');
// selects: NodeListOf<HTMLSelectElement> ✅

selects.forEach(select => {
  console.log(select.value);  // ✅ OK
  console.log(select.options); // ✅ OK (HTMLOptionsCollection)
});

// ❌ TypeScript catches invalid usage
// input = document.querySelector('#username');
// input.value;  // Error: Property 'value' does not exist on type 'Element | null'
`);

console.log("\n🎯 Event Target Type Safety:\n");

console.log(`
button.addEventListener('click', (e) => {
  // e.target may be any EventTarget
  const target = e.target as HTMLElement;  // Type assertion needed

  // Better: Type guard
  if (e.target instanceof HTMLElement) {
    e.target.classList.add('clicked');  // ✅ OK
  }

  // Even better: Use currentTarget (element with listener)
  const current = e.currentTarget as HTMLButtonElement;
  current.disabled = true;  // ✅ OK
});

// Type-safe event delegation
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  if (target.matches('.btn')) {
    const button = target as HTMLButtonElement;
    button.disabled = true;
  }

  // Or use closest with type assertion
  const button = (e.target as HTMLElement).closest('button');
  if (button) {
    (button as HTMLButtonElement).disabled = true;
  }
});
`);

// ============================================
// Section 4: Custom Events with Type Safety
// ============================================

console.log("\n=== Section 4: Custom Events with Type Safety ===\n");

console.log("🎨 Type-Safe Custom Event Creation:\n");

console.log(`
// Define event data interface
interface LoginData {
  userId: number;
  username: string;
  email: string;
  timestamp: number;
}

// Create type-safe custom event
const loginEvent = new CustomEvent<LoginData>('user-login', {
  bubbles: true,
  cancelable: true,
  detail: {
    userId: 123,
    username: 'john',
    email: 'john@example.com',
    timestamp: Date.now()
  }
});

// Dispatch event
document.dispatchEvent(loginEvent);

// ❌ TypeScript catches invalid detail
// const invalidEvent = new CustomEvent<LoginData>('login', {
//   detail: {
//     userId: 'string',  // Error: Type 'string' not assignable to 'number'
//     username: 'john'
//   }
// });
`);

console.log("\n📢 Listening to Custom Events with Types:\n");

console.log(`
// Option 1: Explicit type annotation
document.addEventListener('user-login', (e: CustomEvent<LoginData>) => {
  console.log(e.detail.userId);   // ✅ number
  console.log(e.detail.username); // ✅ string
  console.log(e.detail.email);    // ✅ string
});

// Option 2: Extend global Event type map (recommended for reuse)
declare global {
  interface DocumentEventMap {
    'user-login': CustomEvent<LoginData>;
    'cart-updated': CustomEvent<CartData>;
  }
}

interface CartData {
  items: Product[];
  total: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Now TypeScript automatically recognizes custom event types!
document.addEventListener('user-login', (e) => {
  // e: CustomEvent<LoginData> ✅ Auto-inferred!
  console.log(e.detail.userId);
});

document.addEventListener('cart-updated', (e) => {
  // e: CustomEvent<CartData> ✅
  console.log(e.detail.total);
});

// ✅ Component communication example
class ShoppingCart extends EventTarget {
  private items: Product[] = [];

  addItem(product: Product) {
    this.items.push(product);

    // Dispatch with proper typing
    this.dispatchEvent(new CustomEvent<CartData>('cart-updated', {
      detail: {
        items: this.items,
        total: this.items.reduce((sum, p) => sum + p.price * p.quantity, 0)
      }
    }));
  }
}

const cart = new ShoppingCart();
cart.addEventListener('cart-updated', (e) => {
  console.log('Cart total:', e.detail.total);  // ✅ Auto-typed!
});
`);

console.log("\n🏗️ Generic Event Utility Functions:\n");

console.log(`
// Type-safe event delegation utility
function delegate<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement
>(
  parent: HTMLElement,
  eventType: K,
  selector: string,
  handler: (event: HTMLElementEventMap[K], target: T) => void
): void {
  parent.addEventListener(eventType, (e) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target) {
      handler(e as HTMLElementEventMap[K], target as T);
    }
  });
}

// Usage
const container = document.createElement('div');

// Type-safe delegation with inferred event type
delegate(container, 'click', '.btn', (e, target) => {
  // e: MouseEvent ✅
  // target: HTMLElement ✅
  console.log('Clicked:', target.textContent);
});

// With specific element type
delegate<HTMLButtonElement>(container, 'click', '.btn', (e, button) => {
  // button: HTMLButtonElement ✅
  button.disabled = true;
});

// ❌ TypeScript catches invalid selector/event combination
// delegate(container, 'keydown', '.btn', (e, target) => {
//   // Error if selector doesn't match expected interaction
// });
`);

// ============================================
// Section 5: Form Events with Type Safety
// ============================================

console.log("\n=== Section 5: Form Events with Type Safety ===\n");

console.log("📝 Form Element Event Types:\n");

console.log(`
const form = document.createElement('form');
const textInput = document.createElement('input');
textInput.type = 'text';

const numberInput = document.createElement('input');
numberInput.type = 'number';

const select = document.createElement('select');

// Input event with proper typing
textInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  console.log(target.value);  // ✅ string

  // Type guard for specific input types
  if (target.type === 'number') {
    const num = parseFloat(target.value);
    console.log(num);
  }
});

// Submit event with type safety
form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(form);
  // formData: FormData ✅

  console.log(formData.get('username'));

  // Type-safe form iteration
  for (const [key, value] of formData.entries()) {
    console.log(\`\${key}: \${value}\`);
  }
});

// Select change event
select.addEventListener('change', (e) => {
  const target = e.target as HTMLSelectElement;

  console.log(target.value);        // ✅ string
  console.log(target.selectedIndex); // ✅ number
  console.log(target.options);       // ✅ HTMLOptionsCollection

  // Type-safe option iteration
  const selectedOptions = Array.from(target.options).filter(opt => opt.selected);
  selectedOptions.forEach(opt => {
    console.log(opt.value, opt.text);  // ✅ string
  });
});
`);

console.log("\n🔒 Event Target Type Narrowing:\n");

console.log(`
// Type guard for form elements
function isFormElement(elem: Element): elem is
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return elem instanceof HTMLInputElement ||
         elem instanceof HTMLSelectElement ||
         elem instanceof HTMLTextAreaElement;
}

form.addEventListener('input', (e) => {
  if (e.target instanceof HTMLInputElement) {
    // TypeScript knows this is HTMLInputElement
    console.log(e.target.value);
    console.log(e.target.type);
  } else if (e.target instanceof HTMLSelectElement) {
    console.log(e.target.value);
    console.log(e.target.selectedIndex);
  }
});

// Type guard for specific input types
function isTextInput(elem: Element): elem is HTMLInputElement {
  return elem instanceof HTMLInputElement && elem.type === 'text';
}

function isCheckbox(elem: Element): elem is HTMLInputElement {
  return elem instanceof HTMLInputElement && elem.type === 'checkbox';
}

form.addEventListener('change', (e) => {
  if (isCheckbox(e.target)) {
    console.log('Checkbox:', e.target.checked);  // ✅ boolean
  } else if (isTextInput(e.target)) {
    console.log('Text:', e.target.value);  // ✅ string
  }
});
`);

// ============================================
// Section 6: Advanced Type Patterns
// ============================================

console.log("\n=== Section 6: Advanced Type Patterns ===\n");

console.log("⚡ Event Handler Type Utilities:\n");

console.log(`
// Generic event handler type
type EventHandler<T extends Event = Event> = (event: T) => void;

// Specific handler types
type ClickHandler = EventHandler<MouseEvent>;
type KeyHandler = EventHandler<KeyboardEvent>;
type InputHandler = EventHandler<InputEvent>;

// Type-safe handler assignment
const handleClick: ClickHandler = (e) => {
  console.log('Clicked at:', e.clientX, e.clientY);
};

const handleKey: KeyHandler = (e) => {
  if (e.key === 'Enter') {
    console.log('Enter pressed');
  }
};

// ✅ Handler is properly typed
button.addEventListener('click', handleClick);
input.addEventListener('keydown', handleKey);

// ❌ TypeScript prevents wrong handler assignment
// button.addEventListener('click', handleKey);  // Error: Type mismatch
`);

console.log("\n🔌 This Context Type Patterns:\n");

console.log(`
// Pattern 1: Use currentTarget (recommended)
button.addEventListener('click', (e) => {
  const target = e.currentTarget as HTMLButtonElement;
  target.disabled = true;  // ✅ OK
});

// Pattern 2: Explicit this parameter
button.addEventListener('click', function(this: HTMLButtonElement, e: MouseEvent) {
  this.disabled = true;  // ✅ OK
});

// Pattern 3: Type assertion on this
button.addEventListener('click', function(e) {
  (this as HTMLButtonElement).disabled = true;  // ✅ OK
});

// Pattern 4: Arrow function + currentTarget (no this issue)
button.addEventListener('click', (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  btn.disabled = true;
});

// ❌ Avoid: Arrow function's this is wrong
// button.addEventListener('click', (e) => {
//   this.disabled = true;  // this is outer scope, not button!
// });
`);

console.log("\n🎯 Event Delegation with Type Safety:\n");

console.log(`
// Type-safe event delegation for dynamic lists
function createList<T>(items: T[], render: (item: T) => HTMLElement): HTMLUListElement {
  const ul = document.createElement('ul');

  items.forEach(item => {
    const li = render(item);
    ul.appendChild(li);
  });

  // Type-safe delegation
  ul.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest('[data-action]');
    if (!button) return;

    const action = (button as HTMLElement).dataset.action;
    const li = (button as HTMLElement).closest('li');

    if (li && action === 'delete') {
      li.remove();
    }
  });

  return ul;
}

// Usage
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todos: Todo[] = [
  { id: 1, text: 'Learn TypeScript', completed: false },
  { id: 2, text: 'Build project', completed: false }
];

const todoList = createList(todos, todo => {
  const li = document.createElement('li');
  li.innerHTML = \`
    <span>\${todo.text}</span>
    <button data-action="delete">Delete</button>
  \`;
  return li;
});
`);

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Use generic querySelector<T> for precise element types");
console.log("2. Leverage TypeScript's automatic event type inference");
console.log("3. Use type guards (instanceof) for narrowing event.target");
console.log("4. Prefer currentTarget over this for type safety");
console.log("5. Define interfaces for custom event detail data");
console.log("6. Extend global Event type maps for reusable custom events");
console.log("7. Use explicit this parameter for regular functions\n");

console.log("❌ DON'T:\n");
console.log("1. Don't use 'as any' to bypass type checking");
console.log("2. Don't ignore event.target type assertion needs");
console.log("3. Don't use arrow functions when you need this to be the element");
console.log("4. Don't forget to handle null returns from query methods");
console.log("5. Don't create untyped custom events without interfaces\n");
