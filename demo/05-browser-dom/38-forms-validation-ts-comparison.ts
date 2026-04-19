// TypeScript vs JavaScript: Forms and Validation Comparison
// 📘 For JavaScript examples, see: 37-forms-validation.js
// This file demonstrates TypeScript-specific type features for forms and validation

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: Form Element Precise Types
// ============================================

console.log("=== Section 1: Form Element Precise Types ===\n");

console.log("🧬 Precise Form Element Types:\n");

console.log(`
// TypeScript provides specific types for different form controls

const form = document.createElement('form');

// HTMLFormElement
const input = document.createElement('input');
// input: HTMLInputElement ✅

input.value = 'text';           // ✅ OK (string)
input.type = 'text';            // ✅ OK (string)
input.placeholder = 'Enter';    // ✅ OK (string)

// Special properties by input type
input.checked;                  // ✅ boolean (checkbox/radio)
input.files;                    // ✅ FileList | null (file input)

const select = document.createElement('select');
// select: HTMLSelectElement ✅

select.value;                   // ✅ string
select.selectedIndex;           // ✅ number
select.options;                 // ✅ HTMLOptionsCollection

const textarea = document.createElement('textarea');
// textarea: HTMLTextAreaElement ✅

textarea.value;                 // ✅ string
textarea.rows = 5;              // ✅ number
textarea.cols = 50;             // ✅ number

// ❌ TypeScript catches invalid property access
// input = document.createElement('input');
// input.rows;  // Error: Property 'rows' does not exist on HTMLInputElement
`);

console.log("\n📦 Accessing Form Controls with Types:\n");

console.log(`
const form = document.forms['loginForm'] as HTMLFormElement;
// form: HTMLFormElement ✅

// Type-safe control access
const username = form.elements.namedItem('username') as HTMLInputElement;
// username: HTMLInputElement ✅

// Or use bracket notation with assertion
const email = form.elements['email'] as HTMLInputElement;
email.value = 'test@example.com';  // ✅ OK

// ❌ Without assertion, TypeScript doesn't know the type
// const raw = form.elements['username'];
// raw.value;  // Error: Property 'value' does not exist on type 'HTMLFormControlsCollection'

// Generic utility function for safe element access
function getFormField<T extends HTMLElement>(
  form: HTMLFormElement,
  name: string
): T | null {
  const element = form.elements.namedItem(name);
  return element instanceof HTMLElement ? (element as T) : null;
}

// Usage
const inputField = getFormField<HTMLInputElement>(form, 'username');
if (inputField) {
  inputField.value = 'value';
}
`);

console.log("\n🎯 RadioNodeList Type Handling:\n");

console.log(`
// When multiple elements share the same name, returns RadioNodeList

// HTML:
// <input type="radio" name="gender" value="male">
// <input type="radio" name="gender" value="female">

const genderGroup = form.elements['gender'] as RadioNodeList;
// genderGroup: RadioNodeList ✅

// RadioNodeList has special properties
genderGroup.value;  // ✅ string (selected value)

// ❌ TypeScript catches invalid usage
// const radios = form.elements['gender'] as NodeListOf<HTMLInputElement>;
// radios.forEach(radio => radio.value);  // May work but not type-safe

// Better: QuerySelectorAll with specific type
const radios = form.querySelectorAll<HTMLInputElement>('input[name="gender"]');
radios.forEach(radio => {
  console.log(radio.value, radio.checked);
});
`);

// ============================================
// Section 2: Form Events with Type Safety
// ============================================

console.log("\n=== Section 2: Form Events with Type Safety ===\n");

console.log("🎯 Form Event Type Inference:\n");

console.log(`
const form = document.createElement('form');
const input = document.createElement('input');

// SubmitEvent - form submission
form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  const target = e.target as HTMLFormElement;

  const formData = new FormData(target);
  // formData: FormData ✅

  // Type-safe FormData iteration
  for (const [key, value] of formData.entries()) {
    // key: string ✅
    // value: string | File ✅
    console.log(\`\${key}: \${value}\`);
  }
});

// InputEvent - real-time input
input.addEventListener('input', (e: InputEvent) => {
  const target = e.target as HTMLInputElement;

  console.log(target.value);  // ✅ string
  console.log(target.type);   // ✅ string
});

// FocusEvent - focus/blur
input.addEventListener('focus', (e: FocusEvent) => {
  const target = e.target as HTMLInputElement;
  target.classList.add('focused');
});

// ChangeEvent - value change confirmation
select.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLSelectElement;
  console.log(target.value);
});
`);

console.log("\n📝 Event Target Type Guards:\n");

console.log(`
// Type guard for form elements
function isInputElement(elem: Element): elem is HTMLInputElement {
  return elem instanceof HTMLInputElement;
}

function isSelectElement(elem: Element): elem is HTMLSelectElement {
  return elem instanceof HTMLSelectElement;
}

form.addEventListener('input', (e) => {
  if (isInputElement(e.target)) {
    // TypeScript knows this is HTMLInputElement
    console.log('Input value:', e.target.value);
    console.log('Input type:', e.target.type);
  } else if (isSelectElement(e.target)) {
    console.log('Select value:', e.target.value);
  }
});

// Combined type guard
function isFormField(elem: Element): elem is
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return elem instanceof HTMLInputElement ||
         elem instanceof HTMLSelectElement ||
         elem instanceof HTMLTextAreaElement;
}
`);

// ============================================
// Section 3: Constraint Validation API Types
// ============================================

console.log("\n=== Section 3: Constraint Validation API Types ===\n");

console.log("🔒 ValidityState Type:\n");

console.log(`
const input = document.createElement('input');

// ValidityState interface (automatically available)
interface ValidityState {
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

// Type-safe validation state access
const validity = input.validity;
// validity: ValidityState ✅

if (validity.valueMissing) {
  showError('This field is required');
} else if (validity.typeMismatch) {
  showError('Please enter correct format');
} else if (validity.patternMismatch) {
  showError('Does not match required pattern');
}

// Type-safe validation check
function getValidationError(input: HTMLInputElement): string | null {
  const v = input.validity;

  if (v.valueMissing) return 'This field is required';
  if (v.typeMismatch) return 'Invalid format';
  if (v.patternMismatch) return 'Does not match pattern';
  if (v.tooLong) return 'Exceeds maximum length';
  if (v.tooShort) return 'Below minimum length';
  if (v.rangeUnderflow) return 'Below minimum value';
  if (v.rangeOverflow) return 'Exceeds maximum value';
  if (v.stepMismatch) return 'Invalid step value';
  if (v.customError) return input.validationMessage;

  return null;
}
`);

console.log("\n🔧 FormData Type Safety:\n");

console.log(`
const form = document.createElement('form');

// FormData type is automatically inferred
const formData = new FormData(form);
// formData: FormData ✅

// Get value with type handling
const value = formData.get('username');
// value: string | File | null ✅

// Type guard for string values
function isString(value: string | File | null): value is string {
  return typeof value === 'string';
}

const username = formData.get('username');
if (isString(username)) {
  console.log('Username:', username.toUpperCase());  // ✅ OK
}

// Type-safe iteration
for (const [key, val] of formData.entries()) {
  // key: string ✅
  if (isString(val)) {
    console.log(\`\${key}: \${val}\`);
  } else if (val instanceof File) {
    console.log(\`\${key}: File \${val.name}\`);
  }
}

// Get all values for a key
const photos = formData.getAll('photos');
// photos: (string | File)[] ✅

// Type-safe filtering
const files = photos.filter(p => p instanceof File) as File[];
files.forEach(file => console.log(file.name));
`);

console.log("\n🎨 CSS Validation Pseudo-classes with TypeScript:\n");

console.log(`
// While CSS is not TypeScript, you can create type-safe validation UI

type ValidationState = 'valid' | 'invalid' | 'pristine' | 'dirty';

interface FormField {
  element: HTMLInputElement;
  state: ValidationState;
  errorMessage?: string;
}

class ValidatedInput {
  private element: HTMLInputElement;
  private state: ValidationState = 'pristine';

  constructor(input: HTMLInputElement) {
    this.element = input;
    this.init();
  }

  private init() {
    this.element.addEventListener('input', () => {
      this.state = 'dirty';
      this.updateUI();
    });

    this.element.addEventListener('blur', () => {
      this.validate();
    });
  }

  private validate() {
    const valid = this.element.checkValidity();
    this.state = valid ? 'valid' : 'invalid';
    this.updateUI();
  }

  private updateUI() {
    const classes = ['is-valid', 'is-invalid', 'is-pristine', 'is-dirty'];
    classes.forEach(cls => this.element.classList.remove(cls));

    this.element.classList.add(\`is-\${this.state}\`);

    if (this.state === 'invalid') {
      this.element.setCustomValidity('Please correct this field');
    } else {
      this.element.setCustomValidity('');
    }
  }
}

// Usage
const validated = new ValidatedInput(
  document.querySelector<HTMLInputElement>('#email')!
);
`);

// ============================================
// Section 4: Custom Validation with Type Safety
// ============================================

console.log("\n=== Section 4: Custom Validation with Type Safety ===\n");

console.log("🔐 Type-Safe Validation Rules:\n");

console.log(`
// Define validation rule type
type ValidationRule = (value: string, field?: HTMLInputElement) => string | null;

// Email validation rule
const emailRule: ValidationRule = (value) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(value) ? null : 'Please enter valid email address';
};

// Required rule
const requiredRule: ValidationRule = (value) => {
  return value.trim() ? null : 'This field is required';
};

// Min length rule
const minLengthRule = (min: number): ValidationRule => {
  return (value) => {
    return value.length >= min ? null : \`Minimum \${min} characters required\`;
  };
};

// Combine rules
function combineRules(...rules: ValidationRule[]): ValidationRule {
  return (value, field) => {
    for (const rule of rules) {
      const error = rule(value, field);
      if (error) return error;
    }
    return null;
  };
}

// Usage
const emailValidator = combineRules(requiredRule, emailRule, minLengthRule(5));

const emailInput = document.querySelector<HTMLInputElement>('#email')!;
emailInput.addEventListener('blur', () => {
  const error = emailValidator(emailInput.value);
  if (error) {
    showError(emailInput, error);
  }
});
`);

console.log("\n📊 Validation Result Type:\n");

console.log(`
// Define validation result structure
interface ValidationResult {
  valid: boolean;
  errors: Map<string, string>;
}

// Type-safe form validator
class FormValidator {
  private form: HTMLFormElement;
  private validators = new Map<string, ValidationRule[]>();

  constructor(form: HTMLFormElement) {
    this.form = form;
  }

  addValidator(fieldName: string, ...rules: ValidationRule[]) {
    this.validators.set(fieldName, rules);
    return this;
  }

  validateField(field: HTMLInputElement): string | null {
    const rules = this.validators.get(field.name) || [];
    for (const rule of rules) {
      const error = rule(field.value, field);
      if (error) return error;
    }
    return null;
  }

  validateAll(): ValidationResult {
    const errors = new Map<string, string>();
    let valid = true;

    this.validators.forEach((rules, fieldName) => {
      const field = this.form.elements.namedItem(fieldName);
      if (field instanceof HTMLInputElement) {
        const error = this.validateField(field);
        if (error) {
          errors.set(fieldName, error);
          valid = false;
        }
      }
    });

    return { valid, errors };
  }
}

// Usage with type safety
const validator = new FormValidator(
  document.querySelector<HTMLFormElement>('#signupForm')!
);

validator
  .addValidator('username', requiredRule, minLengthRule(3))
  .addValidator('email', requiredRule, emailRule)
  .addValidator('password', requiredRule, minLengthRule(8));

form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  const result = validator.validateAll();

  if (result.valid) {
    // Form is valid, submit
    console.log('Form valid, submitting...');
  } else {
    // Show errors
    result.errors.forEach((error, field) => {
      console.error(\`\${field}: \${error}\`);
    });
  }
});
`);

console.log("\n💬 Error Message Type Definitions:\n");

console.log(`
// Define error message types for i18n support
type ValidationErrorType =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'match'
  | 'custom';

interface ValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
  value?: any;
}

// Error message map
const errorMessages: Record<ValidationErrorType, (context?: any) => string> = {
  required: () => 'This field is required',
  email: () => 'Please enter valid email address',
  minLength: ({ length }) => \`Minimum \${length} characters required\`,
  maxLength: ({ length }) => \`Maximum \${length} characters allowed\`,
  pattern: () => 'Does not match required pattern',
  match: () => 'Values do not match',
  custom: ({ message }) => message || 'Invalid input'
};

// Usage
function showError(type: ValidationErrorType, field: string, context?: any): ValidationError {
  const message = errorMessages[type](context);
  return { type, field, message, value: context?.value };
}
`);

// ============================================
// Section 5: Clipboard and Selection Types
// ============================================

console.log("\n=== Section 5: Clipboard and Selection Types ===\n");

console.log("📋 Clipboard API Type Safety:\n");

console.log(`
// Clipboard API return types
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

async function readFromClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.error('Read failed:', err);
    return null;
  }
}

// Type-safe clipboard event handling
input.addEventListener('paste', async (e: ClipboardEvent) => {
  e.preventDefault();

  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.kind === 'string' && item.type === 'text/plain') {
      item.getAsString((text: string) => {
        input.value = text;
      });
    } else if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file) {
        // Handle file paste
        console.log('File pasted:', file.name);
      }
    }
  }
});
`);

console.log("\n🎯 Selection API Type Safety:\n");

console.log(`
const input = document.querySelector<HTMLInputElement>('#input')!;

// Input selection properties
input.selectionStart;  // number | null ✅
input.selectionEnd;    // number | null ✅
input.selectionDirection; // 'forward' | 'backward' | 'none' ✅

// Type-safe selection range
function getSelectedText(input: HTMLInputElement): string {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start !== null && end !== null) {
    return input.value.substring(start, end);
  }

  return '';
}

// Type-safe set selection
function selectRange(input: HTMLInputElement, start: number, end: number): void {
  input.focus();
  input.setSelectionRange(start, end);
}

// Selection API for page text
const selection = window.getSelection();
// selection: Selection | null ✅

if (selection) {
  const text = selection.toString();  // string ✅

  // Create type-safe range
  const range = document.createRange();
  // range: Range ✅

  range.selectNodeContents(document.body);
  selection.removeAllRanges();
  selection.addRange(range);
}
`);

// ============================================
// Section 6: Advanced Type Patterns
// ============================================

console.log("\n=== Section 6: Advanced Type Patterns ===\n");

console.log("⚙️ Generic Form Builder:\n");

console.log(`
// Type-safe form field configuration
interface FormFieldConfig<T extends HTMLElement> {
  name: string;
  type: string;
  label: string;
  validator?: ValidationRule;
  props?: Partial<T>;
}

// Generic form builder
class FormBuilder {
  private form = document.createElement('form');
  private fields = new Map<string, HTMLElement>();

  addField<T extends HTMLInputElement>(
    config: FormFieldConfig<T>
  ): FormBuilder {
    const field = document.createElement('input') as T;
    field.name = config.name;
    field.type = config.type;

    if (config.props) {
      Object.assign(field, config.props);
    }

    const label = document.createElement('label');
    label.textContent = config.label;
    label.htmlFor = config.name;

    const wrapper = document.createElement('div');
    wrapper.appendChild(label);
    wrapper.appendChild(field);
    this.form.appendChild(wrapper);

    this.fields.set(config.name, field);
    return this;
  }

  build(): HTMLFormElement {
    return this.form;
  }

  getFormData(): Record<string, string> {
    const data: Record<string, string> = {};
    this.fields.forEach((field, name) => {
      if (field instanceof HTMLInputElement) {
        data[name] = field.value;
      }
    });
    return data;
  }
}

// Usage
const form = new FormBuilder()
  .addField<HTMLInputElement>({
    name: 'username',
    type: 'text',
    label: 'Username',
    validator: combineRules(requiredRule, minLengthRule(3)),
    props: { placeholder: 'Enter username', required: true }
  })
  .addField<HTMLInputElement>({
    name: 'email',
    type: 'email',
    label: 'Email',
    validator: combineRules(requiredRule, emailRule),
    props: { placeholder: 'Enter email', required: true }
  })
  .build();
`);

console.log("\n✨ Async Validation with Type Safety:\n");

console.log(`
// Async validator type
type AsyncValidator = (
  value: string,
  field: HTMLInputElement
) => Promise<string | null>;

// Async username availability check
const usernameAvailableValidator: AsyncValidator = async (value) => {
  if (value.length < 3) {
    return 'Username needs at least 3 characters';
  }

  try {
    const response = await fetch(\`/api/check-username?username=\${value}\`);
    const data = await response.json();

    if (!data.available) {
      return 'This username is already taken';
    }

    return null;
  } catch (err) {
    return 'Failed to check availability';
  }
};

// Debounced async validator
function debounceAsyncValidator(
  validator: AsyncValidator,
  delay: number = 500
): AsyncValidator {
  const timeouts = new Map<HTMLInputElement, number>();

  return async (value: string, field: HTMLInputElement) => {
    // Clear previous timeout
    const prevTimeout = timeouts.get(field);
    if (prevTimeout) clearTimeout(prevTimeout);

    return new Promise<string | null>((resolve) => {
      const timeout = setTimeout(async () => {
        const error = await validator(value, field);
        resolve(error);
      }, delay);

      timeouts.set(field, timeout as unknown as number);
    });
  };
}

// Usage
const debouncedValidator = debounceAsyncValidator(usernameAvailableValidator);

usernameInput.addEventListener('input', async (e) => {
  const target = e.target as HTMLInputElement;
  const error = await debouncedValidator(target.value, target);

  if (error) {
    showError(target, error);
  } else {
    clearError(target);
  }
});
`);

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Use specific form element types (HTMLInputElement, HTMLSelectElement)");
console.log("2. Always assert form.elements access with proper types");
console.log("3. Use type guards (instanceof) for event target narrowing");
console.log("4. Define validation rules as typed functions");
console.log("5. Use FormData with type guards for string vs File");
console.log("6. Create reusable type-safe validator utilities\n");

console.log("❌ DON'T:\n");
console.log("1. Don't use 'as any' for form element access");
console.log("2. Don't ignore ValidityState type safety");
console.log("3. Don't forget to handle FormData value union types");
console.log("4. Don't create untyped validation error objects");
console.log("5. Don't skip null checks on optional form fields\n");
