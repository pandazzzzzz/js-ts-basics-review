// Forms and Validation Demo
// 📘 javascript.info Part 2 > "Forms, controls"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms
// ⚠️ Browser environment only

// ============================================
// Section 1: Form Element Access
// ============================================
// Description: Multiple ways to access and manipulate forms and their controls
// ES Spec: HTML5 Forms API
// Characteristics:
//   - document.forms returns named forms collection
//   - form.elements returns form controls
//   - Supports accessing by name attribute
// Use Cases: Form data collection, dynamic form generation, batch validation
// Common Pitfalls: Same-name controls return collection instead of single element

console.log("=== Section 1: Form Element Access ===\n");

if (typeof document !== 'undefined') {
  console.log("✅ Browser environment detected, following code is executable:\n");

  // 1.1 document.forms - Collection of all forms in page
  console.log("1. document.forms - Forms collection");
  console.log(`
// HTML:
// <form name="login" id="loginForm">
//   <input name="username">
// </form>

// Access methods:
document.forms[0];           // First form (index access）
document.forms['login'];     // Access by name attribute
document.forms.login;        // Short form
document.getElementById('loginForm'); // Access by ID

// ⚠️ Note: document.forms is live HTMLCollection
  `);

  // 1.2 form.elements - Collection of controls in form
  console.log("\n2. form.elements - Form controls collection");
  console.log(`
const form = document.forms['login'];

// Access controls:
form.elements[0];            // First control (index）
form.elements['username'];   // Access by name
form.elements.username;      // Short form
form.username;               // More simplified form (recommended）

// ⚠️ Trap: If multiple controls have same name, returns RadioNodeList
// <input type="radio" name="gender" value="male">
// <input type="radio" name="gender" value="female">
form.gender;  // RadioNodeList, not single element!
  `);

  // 1.3 Value access for different input types
  console.log("\n3. Value access for different input types:");

  console.log(`
// Text input
const input = form.querySelector('input[type="text"]');
input.value;                 // Get/set current value
input.value = 'new value';   // Set value

// Multi-line text
const textarea = form.querySelector('textarea');
textarea.value;              // Get/set content
// ⚠️ Note: textarea.innerHTML is not user input content!

// Dropdown select
const select = form.querySelector('select');
select.value;                // Selected option's value
select.selectedIndex;        // Selected item's index
select.options[0].value;     // Specific option's value

// Multi-select dropdown
for (let option of select.options) {
  if (option.selected) {
    console.log(option.value);
  }
}

// Checkbox
const checkbox = form.querySelector('input[type="checkbox"]');
checkbox.checked;            // true/false
checkbox.indeterminate = true; // Third state (half-selected）

// Radio button group
const radios = form.querySelectorAll('input[name="gender"]');
const selected = [...radios].find(r => r.checked)?.value;

// File upload
const fileInput = form.querySelector('input[type="file"]');
fileInput.files;             // FileList object
fileInput.files[0];          // First file
  `);

} else {
  console.log("⚠️ Non-browser environment, form access examples shown in code form");
}

// FormData API — Programmatic form data handling
console.log("\n📝 FormData API:\n");
console.log(`
// FormData provides a way to construct and manipulate form data
// Can be created from a <form> element or from scratch

// From a form element:
// const formData = new FormData(document.querySelector('form'));

// From scratch:
const formData = new FormData();
formData.append('username', 'Alice');
formData.append('email', 'alice@example.com');
formData.append('avatar', fileInput.files[0]); // File upload
formData.set('username', 'Bob'); // Overwrite existing key
console.log('get username:', formData.get('username')); // 'Bob'
console.log('getAll interests:', formData.getAll('interests')); // []
console.log('has email:', formData.has('email')); // true

// Iteration:
for (const [key, value] of formData.entries()) {
  console.log(key + ':', value);
}
// Or: formData.keys(), formData.values()

// Sending with fetch:
// fetch('/api/upload', { method: 'POST', body: formData });

// Delete a field:
formData.delete('avatar');
console.log('has avatar after delete:', formData.has('avatar')); // false

// Key differences from plain objects:
// - Supports multiple values for the same key (append vs set)
// - Handles file uploads natively
// - Automatically sets Content-Type to multipart/form-data with fetch
// - Works with <form> elements for easy data extraction
`);


// ============================================
// Section 2: Form Events
// ============================================
// Description: Form-related events for responding to user interaction
// ES Spec: HTML5 Events
// Characteristics:
//   - focus/blur don't bubble, focusin/focusout bubble
//   - input triggers real-time, change triggers on confirmation
// Use Cases: Real-time validation, auto-save, user experience optimization
// Common Pitfalls: change vs input confusion, blur timing issues

console.log("\n=== Section 2: Form Events ===\n");

console.log("🎯 Focus Events:\n");
console.log(`
// focus / blur - Don't bubble
input.addEventListener('focus', (e) => {
  e.target.classList.add('focused');
});

input.addEventListener('blur', (e) => {
  e.target.classList.remove('focused');
  validateField(e.target);  // Common: validate on blur
});

// focusin / focusout - Bubble (can delegate）
form.addEventListener('focusin', (e) => {
  console.log('Some child element got focus:', e.target.name);
});
`);

console.log("\n⌨️ Input Events:\n");
console.log(`
// input - Triggers for every value change (real-time）
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  debounce(() => searchSuggestions(query), 300);
});

// change - Triggers when focus lost and value changed (select/checkbox/radio triggers immediately）
select.addEventListener('change', (e) => {
  console.log('Selected:', e.target.value);
});

// Comparison:
// ┌─────────┬────────────────────┬─────────────────────────────┐
// │ Event   │ Trigger            │ Use Case                    │
// ├─────────┼────────────────────┼─────────────────────────────┤
// │ input   │ Every keystroke/paste│ Real-time search, char count   │
// │ change  │ Confirm change       │ Filter, setting save           │
// │ blur    │ Lose focus           │ Field validation                │
// └─────────┴────────────────────┴─────────────────────────────┘
`);

console.log("\n📤 Submit Events:\n");
console.log(`
// submit - Triggers when form submits (click button or press Enter）
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Stop default submit

  if (!form.checkValidity()) {
    form.reportValidity();  // Show validation errors
    return;
  }

  const formData = new FormData(form);
  fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
});

// Programmatic submit (doesn't trigger submit event）
form.submit();  // ❌ Direct submit, bypasses validation and submit event

// Trigger custom validated submit
if (validateCustom(form)) {
  form.requestSubmit();  // ✅ Triggers submit event (HTML Living Standard)
}
`);

// ============================================
// Section 3: Constraint Validation API
// ============================================
// Description: HTML5 built-in form validation API
// ES Spec: HTML5 Constraint Validation
// Characteristics:
//   - Based on HTML attributes declarative validation
//   - Can set custom error messages
//   - CSS :valid/:invalid pseudo-classes for styling
// Use Cases: Client-side pre-validation, instant feedback
// Common Pitfalls: Relying only on client validation (not secure）

console.log("\n=== Section 3: Constraint Validation API ===\n");

console.log("🔒 HTML5 Validation Attributes:\n");
console.log(`
<!-- Required field -->
<input required>

<!-- Type validation -->
<input type="email">
<input type="url">
<input type="number">
<input type="tel">

<!-- Length limits -->
<input minlength="3" maxlength="20">
<textarea minlength="10"></textarea>

<!-- Value range (number/date/range only）-->
<input type="number" min="0" max="100" step="5">
<input type="date" min="2024-01-01" max="2024-12-31">

<!-- Pattern match (regular expression）-->
<input pattern="[A-Za-z]{3}">
<input pattern="\\d{4}-\\d{2}-\\d{2}">  <!-- Note escaping -->

<!-- Custom error message -->
<input required oninvalid="this.setCustomValidity('Please fill this field')">
`);

console.log("\n🔧 JavaScript Validation API:\n");
console.log(`
// Check validity
const isValid = input.checkValidity();   // Returns boolean, doesn't show prompt
const isFormValid = form.checkValidity();

// Report validation results (shows browser default prompt）
input.reportValidity();  // Returns boolean, reports problems to the user if invalid

// Force show validation UI (even if unmodified）
form.classList.add('was-validated');  // Bootstrap style
`);

console.log("\n📋 validity Object Properties:\n");
console.log(`
const input = document.querySelector('input');
const v = input.validity;

// Boolean properties:
v.valueMissing      // Required but not filled
v.typeMismatch      // Format doesn't match type (like email doesn't have @）
v.patternMismatch   // Doesn't match pattern regex
v.tooLong           // Exceeds maxlength
v.tooShort          // Less than minlength
v.rangeOverflow     // Exceeds max
v.rangeUnderflow    // Below min
v.stepMismatch      // Doesn't match step
v.badInput          // Browser can't parse input
v.customError       // Custom error set by setCustomValidity()
v.valid             // All above are false (valid）

// Usage examples:
if (v.valueMissing) {
  showError('This field is required');
} else if (v.patternMismatch) {
  showError('Please enter correct format');
}
`);

console.log("\n✏️ Custom Validation Messages:\n");
console.log(`
// Set custom error
input.setCustomValidity('Username already taken');

// Clear custom error (important!）
input.setCustomValidity('');

// Complete example: Dynamic validation
usernameInput.addEventListener('input', async (e) => {
  const value = e.target.value;

  if (value.length < 3) {
    e.target.setCustomValidity('Username needs at least 3 characters');
  } else {
    // Async check availability
    const isAvailable = await checkUsername(value);
    if (!isAvailable) {
      e.target.setCustomValidity('This username is already in use');
    } else {
      e.target.setCustomValidity('');  // ✅ Must clear!
    }
  }

  e.target.reportValidity();
});
`);

console.log("\n🎨 CSS Validation Styles:\n");
console.log(`
/* Valid state */
input:valid {
  border-color: green;
}

/* Invalid state */
input:invalid {
  border-color: red;
}

/* Only show after user interaction (avoid initial red）*/
input:not(:placeholder-shown):invalid {
  border-color: red;
}

/* With was-validated class */
form.was-validated input:invalid {
  border-color: red;
}

/* Required marker */
input:required {
  background-image: url('required-icon.svg');
}
`);

// ============================================
// Section 4: Custom Validation Logic
// ============================================
// Description: Beyond HTML5 validation complex business rules
// ES Spec: N/A (Application Logic)
// Characteristics:
//   - Combines multiple validation rules
//   - Cross-field dependency validation
//   - Async server validation
// Use Cases: Password strength, duplicate password, uniqueness check
// Common Pitfalls: Validation timing issues, improper debounce handling

console.log("\n=== Section 4: Custom Validation Logic ===\n");

console.log("⏱️ Real-time Validation vs Submit-time Validation:\n");
console.log(`
// Strategy 1: Real-time validation (user input)
// ✅ Instant feedback
// ❌ May show errors early, bothering user
input.addEventListener('input', debounce((e) => {
  validateField(e.target);
}, 500));

// Strategy 2: Blur validation (recommended）
// ✅ User completes input before validating
// ❌ Slightly delayed feedback
input.addEventListener('blur', (e) => {
  validateField(e.target);
});

// Strategy 3: Submit-time validation
// ✅ Unified handling of all fields
// ❌ Errors discovered late
form.addEventListener('submit', (e) => {
  if (!validateAll()) {
    e.preventDefault();
  }
});

// Best practice: Mixed strategies
// - Simple format validation: Real-time (with debounce）
// - Complex business rules: On blur
// - Final safety net: On submit
`);

console.log("\n🔐 Common Validation Patterns:\n");
console.log(`
// Email validation
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
// More strict RFC 5322 compliant regex is longer, usually use above simplified version

// Phone number validation (China mainland）
const phoneRegex = /^1[3-9]\\d{9}$/;

// Password strength
function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  return { strength, checks };
}

// Duplicate password validation
function validateMatch(password, confirm) {
  if (confirm !== password) {
    return 'Two entered passwords don\'t match';
  }
  return '';
}
`);

console.log("\n💡 Debounce Function Implementation:\n");
console.log(`
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage scenarios: Search suggestions, real-time validation
searchInput.addEventListener('input', debounce((e) => {
  fetchSuggestions(e.target.value);
}, 300));
`);

console.log("\n📝 Complete Validation Example:\n");
console.log(`
class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = new Map();
    this.init();
  }

  init() {
    // Validate single field on blur
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });

    // Validate all on submit
    this.form.addEventListener('submit', (e) => {
      if (!this.validateAll()) {
        e.preventDefault();
        this.focusFirstError();
      }
    });
  }

  validateField(field) {
    const rules = this.getRules(field);
    for (const rule of rules) {
      const error = rule(field.value, field);
      if (error) {
        this.showError(field, error);
        return false;
      }
    }
    this.clearError(field);
    return true;
  }

  validateAll() {
    let isValid = true;
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!this.validateField(field)) isValid = false;
    });
    return isValid;
  }

  getRules(field) {
    const rules = [];
    if (field.required) {
      rules.push(v => v.trim() ? '' : 'This field is required');
    }
    if (field.dataset.validate === 'email') {
      rules.push(v => /^[^\\s@]+@[^\\s@]+$/.test(v) ? '' : 'Please enter valid email address');
    }
    return rules;
  }

  showError(field, message) {
    this.errors.set(field, message);
    field.setCustomValidity(message);
    // Update UI...
  }

  clearError(field) {
    this.errors.delete(field);
    field.setCustomValidity('');
  }
}

// Usage
new FormValidator(document.getElementById('myForm'));
`);

// ============================================
// Section 5: Clipboard and Selection
// ============================================
// Description: Accessing clipboard and text selection APIs
// ES Spec: Clipboard API, Selection API
// Characteristics:
//   - Clipboard operations need user gesture to trigger
//   - Async API returns Promise
// Use Cases: Copy to clipboard, rich text editor, formatted paste
// Common Pitfalls: Permission issues, synchronous API deprecated

console.log("\n=== Section 5: Clipboard and Selection ===\n");

console.log("📋 Clipboard Events:\n");
console.log(`
// copy / cut / paste events
input.addEventListener('copy', (e) => {
  console.log('User copied content');
  // Can modify copied data
  e.clipboardData.setData('text/plain', 'Modified: ' + window.getSelection().toString());
  e.preventDefault();  // Stop default copy behavior
});

input.addEventListener('paste', (e) => {
  e.preventDefault();

  // Get pasted content
  const text = e.clipboardData.getData('text/plain');

  // Clean or transform content
  const cleaned = text.replace(/<script.*?>.*?<\\/script>/gi, '');

  // Insert into input box (modern: setRangeText; execCommand('insertText') is deprecated)
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  input.setRangeText(cleaned, start, end, 'end');
});
`);

console.log("\n📎 Clipboard API (Modern Async Way）:\n");
console.log(`
// Write to clipboard (requires secure context HTTPS or localhost）
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copy successful');
  } catch (err) {
    console.error('Copy failed:', err);
    // Fallback solution
    fallbackCopy(text);
  }
}

// Read from clipboard (requires user authorization）
async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Clipboard content:', text);
    return text;
  } catch (err) {
    console.error('Read failed:', err);
  }
}

// Fallback solution (note: document.execCommand is deprecated across all browsers)
// Consider using a polyfill or modern alternative
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
`);

console.log("\n🖱️ Text Selection Operations:\n");
console.log(`
// Select text in input box
input.select();           // Select all
input.setSelectionRange(2, 5);  // Select specified range

// Get selection info
input.selectionStart;     // Selection start position
input.selectionEnd;       // Selection end position
input.selectionDirection; // 'forward', 'backward', 'none'

// Replace selected text
const start = input.selectionStart;
const end = input.selectionEnd;
const value = input.value;
input.value = value.substring(0, start) + 'REPLACEMENT' + value.substring(end);

// Programmatic set selection
input.focus();
input.setSelectionRange(0, input.value.length);  // Full select effect
`);

console.log("\n📖 Selection API (Page Text Selection）:\n");
console.log(`
// Get current selection
const selection = window.getSelection();

// Selection info
selection.toString();     // Selected text content
selection.rangeCount;     // Number of selected ranges

// Create selection
const range = document.createRange();
range.selectNodeContents(element);  // Select all content of element
range.selectNode(element);          // Select entire element
range.setStart(node, offset);       // Set start point
range.setEnd(node, offset);         // Set end point

// Apply selection
selection.removeAllRanges();
selection.addRange(range);

// Clear selection
selection.removeAllRanges();
`);

// ============================================
// Best Practices & Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Always do server-side validation (client-side validation can be bypassed）");
console.log("2. Use FormData object to collect form data");
console.log("3. Provide clear error messages and guidance");
console.log("4. Use debounce for real-time validation");
console.log("5. Leverage HTML5 validation attributes to reduce JS code");
console.log("6. Test keyboard navigation and accessibility\n");

console.log("❌ DON'T:\n");
console.log("1. Don't rely solely on client-side validation");
console.log("2. Don't show validation errors too early (wait for user to complete input）");
console.log("3. Don't block UI during validation (async validation）");
console.log("4. Don't forget to clear setCustomValidity errors");
console.log("5. Don't use synchronous clipboard API (deprecated）\n");

console.log("📚 Reference Documentation:\n");
console.log("- MDN Forms: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms");
console.log("- Constraint Validation: https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation");
console.log("- Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API");
console.log("- FormData: https://developer.mozilla.org/en-US/docs/Web/API/FormData\n");

console.log("♿ Form Accessibility (ARIA):\n");
console.log(`
// Accessible form validation patterns

// 1. Associate error messages with inputs using aria-describedby
input.setAttribute('aria-describedby', 'email-error');
const errorDiv = document.getElementById('email-error');
errorDiv.setAttribute('role', 'alert'); // Announced by screen readers

// 2. Mark invalid fields with aria-invalid
input.setAttribute('aria-invalid', 'true'); // or 'false' when valid
// Screen readers announce: "invalid entry"

// 3. Required fields with aria-required
input.setAttribute('aria-required', 'true');
// Complements the HTML5 'required' attribute

// 4. Accessible error summary at form top
const errorSummary = document.getElementById('error-summary');
errorSummary.setAttribute('role', 'alert');
errorSummary.setAttribute('tabindex', '-1'); // Make focusable
errorSummary.focus(); // Move focus to errors

// 5. Live region for dynamic validation feedback
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite'); // Announce changes
liveRegion.setAttribute('aria-atomic', 'true'); // Announce entire content

// 6. inputmode for mobile keyboard optimization
input.setAttribute('inputmode', 'numeric'); // Numeric keyboard on mobile
// Values: text, numeric, decimal, tel, email, url, search, none

// 7. Autocomplete attributes for better UX
input.setAttribute('autocomplete', 'email'); // Standardized values
// Common: name, email, tel, address, cc-number, new-password, current-password
`);


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 TYPESCRIPT VS JAVASCRIPT - FORM TYPE DIFFERENCES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. FORM ELEMENT PRECISE TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const input = document.getElementById('name');
  input.value;  // ✅ May have no value at runtime

TypeScript:
  const input = document.getElementById('name');           // HTMLElement | null
  input.value;                                             // ❌ Error

  // Correct way
  const input = document.getElementById('name') as HTMLInputElement;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. form.elements TYPE HANDLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const username = form.elements['username'].value;

TypeScript:
  const username = (form.elements.namedItem('username') as HTMLInputElement).value;
  // Or
  const username = (form.elements['username'] as HTMLInputElement).value;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EVENT TYPE REFINEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript:
  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
  });

  input.addEventListener('input', (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value);
  });

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. FormData TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript:
  const formData = new FormData(form);

  // Get values type handling
  const value = formData.get('field');  // string | File | null

  // Iterate
  for (const [key, value] of formData.entries()) {
    // key: string, value: string | File
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. VALIDATION API TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript:
  interface ValidityStateFlags {
    valueMissing: boolean;
    typeMismatch: boolean;
    patternMismatch: boolean;
    tooLong: boolean;
    tooShort: boolean;
    rangeUnderflow: boolean;
    rangeOverflow: boolean;
    stepMismatch: boolean;
    badInput: boolean;
    customError: boolean;
    valid: boolean;
  }

  // Type guard check
  function isFormField(element: Element): element is HTMLInputElement {
    return element instanceof HTMLInputElement;
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 SUMMARY: TYPESCRIPT FORM DEVELOPMENT ADVANTAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Precise form control types
✅ Event object type inference
✅ FormData type safety
✅ Validation state type checking
✅ Better IDE autocomplete support

⚠️ Notes:
  - form.elements needs type assertion
  - event.target usually needs type narrowing
  - File and string need to be distinguished when handling

🎯 RECOMMENDATION: Complex form applications strongly recommend TypeScript!
*/
