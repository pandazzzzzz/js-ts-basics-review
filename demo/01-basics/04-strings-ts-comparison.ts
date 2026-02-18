// TypeScript String Comparison
// 📘 Companion to: 04-strings.js

// ============================================
// 1. String Type Annotations
// ============================================

{
  // Basic string type
  const greeting: string = "Hello, World!";
  const name: string = 'Alice';
  const message: string = `Welcome ${name}`;

  // Example usage
  function exampleBasicTypes() {
    console.log(greeting, name, message);
  }
  exampleBasicTypes();

  // String vs string (primitive vs object)
  const primitiveStr: string = "hello";
  const objectStr: String = new String("hello"); // Not recommended
  // const wrong: string = new String("hello"); // ❌ Error: String object not assignable to string

  console.log("=== String Type Annotations ===");
  console.log({ greeting, name, message });
  console.log("typeof primitiveStr:", typeof primitiveStr); // "string"
  console.log("typeof objectStr:", typeof objectStr); // "object"
}

// ============================================
// 2. String Literal Types
// ============================================

// Restrict to specific string values
type Status = "active" | "inactive" | "pending";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Color = "red" | "green" | "blue";

const userStatus: Status = "active"; // ✅ OK
// const invalidStatus: Status = "unknown"; // ❌ Error

// Function with literal type parameters
function setStatus(status: Status): void {
  console.log(`Status set to: ${status}`);
}

console.log("\n=== String Literal Types ===");
setStatus("active"); // ✅ OK
// setStatus("invalid"); // ❌ Error: Argument not assignable

// Const assertions for literal types
const direction2 = "north" as const; // Type: "north" (not string)
const directions2 = ["north", "south", "east", "west"] as const;
type Direction2 = typeof directions2[number]; // "north" | "south" | "east" | "west"

console.log("direction type:", direction2);
console.log("directions:", directions2);

// ============================================
// 3. Template Literal Types (TS 4.1+)
// ============================================

// Combine string literal types
type Quantity = "one" | "two" | "few";
type Animal = "cat" | "dog" | "bird";
type QuantityAnimal = `${Quantity} ${Animal}`;
// Result: "one cat" | "one dog" | "one bird" | "two cat" | ...

const petDescription: QuantityAnimal = "two cat";
// const invalid: QuantityAnimal = "three cat"; // ❌ Error

console.log("\n=== Template Literal Types ===");
console.log("petDescription:", petDescription);

// Event name patterns
type EventName = `on${Capitalize<string>}`;
const clickHandler: EventName = "onClick"; // ✅ OK
const mouseHandler: EventName = "onMouseMove"; // ✅ OK
// const invalid: EventName = "click"; // ❌ Error: doesn't start with "on"

// API endpoint patterns
type HttpProtocol = "http" | "https";
type Domain = "api.example.com" | "api.test.com";
type Endpoint = `${HttpProtocol}://${Domain}`;

const apiUrl: Endpoint = "https://api.example.com";
console.log("API URL:", apiUrl);

// CSS property patterns
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;
// Note: This is a simplified example, actual implementation would need more work

// ============================================
// 4. String Utility Types
// ============================================

// Built-in string manipulation types
type OriginalText = "hello world";
type UpperText = Uppercase<OriginalText>; // "HELLO WORLD"
type LowerText = Lowercase<OriginalText>; // "hello world"
type CapitalText = Capitalize<OriginalText>; // "Hello world"
type UncapitalText = Uncapitalize<"Hello World">; // "hello World"

console.log("\n=== String Utility Types ===");

// Practical example: HTTP headers
type HttpHeader = "content-type" | "authorization" | "accept";
type HttpHeaderCapitalized = Capitalize<HttpHeader>;
// "Content-type" | "Authorization" | "Accept"

const header: HttpHeaderCapitalized = "Content-type";
console.log("HTTP Header:", header);

// Example: Environment variables
type EnvVar = "api_key" | "database_url" | "port";
type EnvVarUpper = Uppercase<EnvVar>;
// "API_KEY" | "DATABASE_URL" | "PORT"

const envKey: EnvVarUpper = "API_KEY";
console.log("Environment variable:", envKey);

// ============================================
// 5. Type-Safe String Methods
// ============================================

// String methods with proper return types
function processString(input: string): string {
  const trimmed: string = input.trim();
  const upper: string = trimmed.toUpperCase();
  const replaced: string = upper.replace("HELLO", "HI");
  return replaced;
}

console.log("\n=== Type-Safe String Methods ===");
console.log("Processed:", processString("  hello world  "));

// Methods that can return null
function findPattern(text: string, pattern: RegExp): RegExpMatchArray | null {
  return text.match(pattern);
}

const matchResult = findPattern("Hello 123", /\d+/);
if (matchResult) {
  console.log("Found:", matchResult[0]); // Type narrowing ensures result is not null
}

// split returns string array
function splitText(text: string, separator: string): string[] {
  return text.split(separator);
}

const parts: string[] = splitText("a,b,c", ",");
console.log("Parts:", parts);

// ============================================
// 6. Nullable Strings
// ============================================

// String with null/undefined
type NullableString = string | null;
type OptionalString = string | undefined;
type MaybeString = string | null | undefined;

function greet(name: NullableString): string {
  // Type guard
  if (name === null) {
    return "Hello, Guest!";
  }
  return `Hello, ${name}!`;
}

console.log("\n=== Nullable Strings ===");
console.log(greet("Alice"));
console.log(greet(null));

// Optional chaining with strings
function getLength(str: MaybeString): number {
  return str?.length ?? 0;
}

console.log("Length of 'hello':", getLength("hello")); // 5
console.log("Length of null:", getLength(null)); // 0
console.log("Length of undefined:", getLength(undefined)); // 0

// Nullish coalescing
function getDisplayName(name: MaybeString): string {
  return name ?? "Anonymous";
}

console.log("Display name:", getDisplayName(undefined)); // "Anonymous"
console.log("Display name:", getDisplayName("Bob")); // "Bob"

// ============================================
// 7. String Index Signatures
// ============================================

// Object with string keys
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: "你好",
  goodbye: "再见",
  thanks: "谢谢"
};

console.log("\n=== String Index Signatures ===");
console.log("Translation:", translations["hello"]);

// Record utility type (preferred)
type TranslationMap = Record<string, string>;

const messages: TranslationMap = {
  success: "Operation successful",
  error: "An error occurred"
};

console.log("Message:", messages["success"]);

// Specific keys with index signature
interface Config {
  apiKey: string;
  endpoint: string;
  [key: string]: string | number; // Allow additional properties
}

const config: Config = {
  apiKey: "abc123",
  endpoint: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

console.log("Config:", config);

// ============================================
// 8. Tagged Template Type Safety
// ============================================

// Type-safe tagged template function
function htmlTag(strings: TemplateStringsArray, ...values: (string | number)[]): string {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? String(values[i]) : '';
    return result + str + value;
  }, '');
}

console.log("\n=== Tagged Template Type Safety ===");
const userAge: number = 30;
const userName2: string = "Alice";
const htmlOutput = htmlTag`<div>Name: ${userName2}, Age: ${userAge}</div>`;
console.log("HTML:", htmlOutput);

// SQL query builder with types
interface SqlQuery {
  text: string;
  values: (string | number)[];
}

function sqlQuery(strings: TemplateStringsArray, ...values: (string | number)[]): SqlQuery {
  const text = strings.reduce((result, str, i) => {
    return result + str + (values[i] !== undefined ? `$${i + 1}` : '');
  }, '');
  return { text, values };
}

const userId2: number = 42;
const sqlResult = sqlQuery`SELECT * FROM users WHERE id = ${userId2}`;
console.log("SQL Query:", sqlResult);

// ============================================
// 9. String Enums
// ============================================

// String enum for named constants
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR"
}

function log(level: LogLevel, message: string): void {
  console.log(`[${level}] ${message}`);
}

console.log("\n=== String Enums ===");
log(LogLevel.Info, "Application started");
log(LogLevel.Error, "Something went wrong");

// Const enum (inlined at compile time)
const enum DirectionEnum {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST"
}

function move(direction: DirectionEnum): void {
  console.log(`Moving ${direction}`);
}

move(DirectionEnum.North);

// ============================================
// 10. Discriminated Unions with Strings
// ============================================

// Type-safe state management
type LoadingState = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handleState(state: LoadingState): string {
  switch (state.status) {
    case "idle":
      return "Ready to load";
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`;
    case "error":
      return `Error: ${state.error}`;
  }
}

console.log("\n=== Discriminated Unions ===");
console.log(handleState({ status: "idle" }));
console.log(handleState({ status: "success", data: "Hello" }));
console.log(handleState({ status: "error", error: "Failed" }));

// ============================================
// 11. Type Guards for Strings
// ============================================

// typeof type guard
function processValue(value: string | number): string {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}

console.log("\n=== Type Guards ===");
console.log("Process string:", processValue("hello"));
console.log("Process number:", processValue(42.567));

// Custom type guard
function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function greetUser(name: string | null | undefined): string {
  if (isNonEmptyString(name)) {
    // TypeScript knows name is string here
    return `Hello, ${name}!`;
  }
  return "Hello, Guest!";
}

console.log(greetUser("Alice"));
console.log(greetUser(null));
console.log(greetUser(""));

// ============================================
// 12. Readonly Strings
// ============================================

// Readonly string properties
interface User {
  readonly id: string;
  name: string;
}

const user2: User = {
  id: "user-123",
  name: "Alice"
};

console.log("\n=== Readonly Strings ===");
// user2.id = "new-id"; // ❌ Error: Cannot assign to 'id' because it is a read-only property
user2.name = "Bob"; // ✅ OK
console.log("User:", user2);

// Readonly array of strings
const colors: readonly string[] = ["red", "green", "blue"];
console.log("First color:", colors[0]);
// colors.push("yellow"); // ❌ Error: Property 'push' does not exist on readonly array
// colors[0] = "orange"; // ❌ Error: Index signature in type 'readonly string[]' only permits reading

// ReadonlyArray type
const fruits: ReadonlyArray<string> = ["apple", "banana", "cherry"];
console.log("Fruits:", fruits);

// ============================================
// 13. String Validation with Type Predicates
// ============================================

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Type predicate for branded types
type Email = string & { readonly __brand: "Email" };

function validateEmail(email: string): email is Email {
  return isValidEmail(email);
}

function sendEmail(to: Email, subject: string, body: string): void {
  console.log(`Sending email to ${to}: ${subject}`);
}

console.log("\n=== String Validation ===");
const userEmail = "alice@example.com";
if (validateEmail(userEmail)) {
  sendEmail(userEmail, "Hello", "Welcome!");
}

// ============================================
// 14. Generic String Functions
// ============================================

// Generic function with string constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

console.log("\n=== Generic String Functions ===");
const personName: string = getProperty(person, "name");
const personAge: number = getProperty(person, "age");
console.log("Name:", personName);
console.log("Age:", personAge);

// Generic string transformation
function transform<T extends string>(
  value: T,
  transformer: (s: string) => string
): string {
  return transformer(value);
}

const transformed = transform("hello", (s) => s.toUpperCase());
console.log("Transformed:", transformed);

// ============================================
// 15. Advanced Template Literal Types
// ============================================

// Path builder
type PathSegment = string;
type Path<T extends string = string> = T;
type JoinPath<A extends string, B extends string> = `${A}/${B}`;

type ApiPath = JoinPath<"api", "users">; // "api/users"
type UserPath = JoinPath<ApiPath, "profile">; // "api/users/profile"

const apiEndpoint: UserPath = "api/users/profile";
console.log("\n=== Advanced Template Literal Types ===");
console.log("API Endpoint:", apiEndpoint);

// CSS class builder
type Modifier = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";
type ButtonClass = `btn-${Modifier}-${Size}`;

const buttonClass: ButtonClass = "btn-primary-lg";
console.log("Button class:", buttonClass);

// Event handler types
type DOMEvent = "click" | "focus" | "blur" | "change";
type EventHandler = `on${Capitalize<DOMEvent>}`;

const handlers: Record<EventHandler, () => void> = {
  onClick: () => console.log("Clicked"),
  onFocus: () => console.log("Focused"),
  onBlur: () => console.log("Blurred"),
  onChange: () => console.log("Changed")
};

handlers.onClick();

// ============================================
// 16. String Manipulation with Mapped Types
// ============================================

// Convert object keys to uppercase
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<K & string>]: T[K];
};

type Original = {
  name: string;
  age: number;
};

type Uppercased = UppercaseKeys<Original>;
// { NAME: string; AGE: number; }

const data: Uppercased = {
  NAME: "Alice",
  AGE: 30
};

console.log("\n=== String Manipulation with Mapped Types ===");
console.log("Uppercased data:", data);

// Add prefix to keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${K & string}`]: T[K];
};

type Config2 = {
  host: string;
  port: number;
};

type EnvConfig = Prefixed<Config2, "APP_">;
// { APP_host: string; APP_port: number; }

const envConfig: EnvConfig = {
  APP_host: "localhost",
  APP_port: 3000
};

console.log("Env config:", envConfig);

// ============================================
// 17. Const Assertions and Literal Types
// ============================================

// Without const assertion
const config1 = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
// Type: { apiUrl: string; timeout: number; }

// With const assertion
const config2 = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// Type: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; }

console.log("\n=== Const Assertions ===");
console.log("Config1 apiUrl type: string");
console.log("Config2 apiUrl type: literal 'https://api.example.com'");

// Tuple with const assertion
const tuple1 = ["hello", 42];
// Type: (string | number)[]

const tuple2 = ["hello", 42] as const;
// Type: readonly ["hello", 42]

console.log("Tuple1:", tuple1);
console.log("Tuple2:", tuple2);

// ============================================
// 18. String Branding for Type Safety
// ============================================

// Branded types for domain-specific strings
type UserId = string & { readonly __brand: "UserId" };
type ProductId = string & { readonly __brand: "ProductId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

function getUserById(id: UserId): void {
  console.log(`Fetching user: ${id}`);
}

function getProductById(id: ProductId): void {
  console.log(`Fetching product: ${id}`);
}

console.log("\n=== String Branding ===");
const userId3 = createUserId("user-123");
const productId = createProductId("prod-456");

getUserById(userId3); // ✅ OK
// getUserById(productId); // ❌ Error: ProductId not assignable to UserId
getProductById(productId); // ✅ OK

// ============================================
// 19. Exhaustiveness Checking with Strings
// ============================================

type Action = "create" | "read" | "update" | "delete";

function handleAction(action: Action): string {
  switch (action) {
    case "create":
      return "Creating...";
    case "read":
      return "Reading...";
    case "update":
      return "Updating...";
    case "delete":
      return "Deleting...";
    default:
      // Exhaustiveness check
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

console.log("\n=== Exhaustiveness Checking ===");
console.log(handleAction("create"));
console.log(handleAction("read"));

// ============================================
// 20. String Comparison and Localization
// ============================================

// Type-safe locale comparison
type Locale = "en-US" | "zh-CN" | "ja-JP" | "de-DE";

function compareStrings(a: string, b: string, locale: Locale): number {
  return a.localeCompare(b, locale);
}

console.log("\n=== String Comparison ===");
console.log("Compare 'a' and 'b':", compareStrings("a", "b", "en-US"));
console.log("Compare '苹果' and '香蕉':", compareStrings("苹果", "香蕉", "zh-CN"));

// Type-safe case conversion with locale
function toLocaleUpperCase(str: string, locale: Locale): string {
  return str.toLocaleUpperCase(locale);
}

console.log("Turkish İ:", toLocaleUpperCase("istanbul", "en-US"));

console.log("\n=== TypeScript String Features Complete ===");
