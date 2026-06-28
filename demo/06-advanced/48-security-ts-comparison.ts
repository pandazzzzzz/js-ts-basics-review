// TypeScript vs JavaScript: Web Security Comparison
// 📘 For JavaScript examples, see: 48-security.js
// This file demonstrates TypeScript-specific type features for web security

export {}; // Make this file a module

// ============================================
// Section 1: XSS Protection - Type Safety
// ============================================

console.log("=== XSS Protection - Type Safety ===\n");

// Branded types for sanitized strings
type SanitizedHTML = string & { readonly __brand: 'SanitizedHTML' };
type UnsafeHTML = string;

function sanitizeHTML(input: UnsafeHTML): SanitizedHTML {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML as SanitizedHTML;
}

function renderHTML(html: SanitizedHTML): void {
  document.body.innerHTML = html;
}

const userInput: UnsafeHTML = '<script>alert("XSS")</script>';
const safe = sanitizeHTML(userInput);
renderHTML(safe); // Type-safe

// renderHTML(userInput); // Error: UnsafeHTML not assignable to SanitizedHTML

// Type-safe DOMPurify wrapper
interface DOMPurifyConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  FORBID_TAGS?: string[];
}

class SafeHTMLRenderer {
  sanitize(dirty: string, config?: DOMPurifyConfig): SanitizedHTML {
    // In real code: return DOMPurify.sanitize(dirty, config) as SanitizedHTML;
    return dirty as SanitizedHTML;
  }

  render(element: HTMLElement, html: SanitizedHTML): void {
    element.innerHTML = html;
  }
}

console.log("Type-safe HTML sanitization prevents XSS");

// ============================================
// Section 2: CSRF Protection - Typed Tokens
// ============================================

console.log("\n=== CSRF Protection - Typed Tokens ===\n");

interface CSRFToken {
  value: string;
  expiresAt: Date;
}

class CSRFProtection {
  private token: CSRFToken | null = null;

  generateToken(): CSRFToken {
    return {
      value: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    };
  }

  validateToken(token: string): boolean {
    if (!this.token) return false;
    if (new Date() > this.token.expiresAt) return false;
    return this.token.value === token;
  }

  async fetchWithCSRF<T>(url: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      this.token = this.generateToken();
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': this.token.value
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Type-safe cookie options
interface SecureCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge?: number;
  domain?: string;
  path?: string;
}

function setSecureCookie(
  name: string,
  value: string,
  options: SecureCookieOptions
): void {
  const cookieString = `${name}=${value}; ${Object.entries(options)
    .map(([key, val]) => `${key}=${val}`)
    .join('; ')}`;
  document.cookie = cookieString;
}

console.log("Type-safe CSRF protection");

// ============================================
// Section 3: CSP - Type-Safe Configuration
// ============================================

console.log("\n=== CSP - Type-Safe Configuration ===\n");

type CSPDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'media-src'
  | 'object-src'
  | 'base-uri'
  | 'form-action'
  | 'frame-ancestors';

type CSPSource = 
  | "'self'"
  | "'none'"
  | "'unsafe-inline'"
  | "'unsafe-eval'"
  | string; // URLs

type CSPPolicy = Partial<Record<CSPDirective, CSPSource[]>>;

class CSPBuilder {
  private policy: CSPPolicy = {};

  addDirective(directive: CSPDirective, sources: CSPSource[]): this {
    this.policy[directive] = sources;
    return this;
  }

  build(): string {
    return Object.entries(this.policy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }
}

const csp = new CSPBuilder()
  .addDirective('default-src', ["'self'"])
  .addDirective('script-src', ["'self'", 'https://trusted.cdn.com'])
  .addDirective('style-src', ["'self'", "'unsafe-inline'"])
  .build();

console.log("CSP:", csp);

// ============================================
// Section 4: Secure Storage - Typed Encryption
// ============================================

console.log("\n=== Secure Storage - Typed Encryption ===\n");

interface EncryptedData {
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
}

class SecureStorage {
  async encrypt(data: string, password: string): Promise<EncryptedData> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const salt = crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    return { ciphertext, iv, salt };
  }

  async decrypt(
    encrypted: EncryptedData,
    password: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encrypted.salt as BufferSource,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: encrypted.iv as BufferSource },
      key,
      encrypted.ciphertext
    );

    return decoder.decode(decrypted);
  }
}

console.log("Type-safe encryption and decryption");

// ============================================
// Section 5: Input Validation - Type Guards
// ============================================

console.log("\n=== Input Validation - Type Guards ===\n");

// Branded types for validated inputs
type Email = string & { readonly __brand: 'Email' };
type Username = string & { readonly __brand: 'Username' };
type SafeString = string & { readonly __brand: 'SafeString' };

function isValidEmail(input: string): input is Email {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
}

function isValidUsername(input: string): input is Username {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(input);
}

function validateEmail(input: string): Email {
  if (!isValidEmail(input)) {
    throw new Error('Invalid email');
  }
  return input;
}

function validateUsername(input: string): Username {
  if (!isValidUsername(input)) {
    throw new Error('Invalid username');
  }
  return input;
}

// Type-safe API with validated inputs
interface UserRegistration {
  email: Email;
  username: Username;
  password: string;
}

async function registerUser(data: UserRegistration): Promise<void> {
  // data.email and data.username are guaranteed to be valid
  console.log('Registering user:', data);
}

// Usage
const emailInput = "user@example.com";
const usernameInput = "user_123";

if (isValidEmail(emailInput) && isValidUsername(usernameInput)) {
  await registerUser({
    email: emailInput,
    username: usernameInput,
    password: "secret"
  });
}

// Generic validator
interface Validator<T> {
  validate(input: string): T;
  isValid(input: string): boolean;
}

class EmailValidator implements Validator<Email> {
  validate(input: string): Email {
    if (!this.isValid(input)) {
      throw new Error('Invalid email');
    }
    return input as Email;
  }

  isValid(input: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);
  }
}

console.log("Type guards ensure validated inputs");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use branded types for sanitized/validated data");
console.log("2. Type CSRF tokens and cookie options");
console.log("3. Build type-safe CSP configurations");
console.log("4. Type encryption/decryption operations");
console.log("5. Use type guards for input validation");

console.log("\n❌ DON'T:");
console.log("1. Don't use any for security-critical code");
console.log("2. Don't skip type validation");
console.log("3. Don't trust client-side types alone");
console.log("4. Don't ignore type errors in security code");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - Web Security                            │
├─────────────────────────────────────────────────────────────────────┤
│ XSS Protection:                                                     │
│   JavaScript: String-based sanitization                            │
│   TypeScript: Branded types for SanitizedHTML                      │
│                                                                      │
│ CSRF Protection:                                                    │
│   JavaScript: Plain token strings                                  │
│   TypeScript: Typed CSRFToken interface                            │
│                                                                      │
│ CSP Configuration:                                                  │
│   JavaScript: String-based directives                              │
│   TypeScript: Type-safe CSPPolicy builder                          │
│                                                                      │
│ Secure Storage:                                                     │
│   JavaScript: Untyped encryption                                   │
│   TypeScript: Typed EncryptedData interface                        │
│                                                                      │
│ Input Validation:                                                   │
│   JavaScript: Boolean validation                                   │
│   TypeScript: Type guards with branded types                       │
└─────────────────────────────────────────────────────────────────────┘
`);


// ============================================
// WEB CRYPTO API TYPES (DEEP DIVE)
// ============================================

console.log("\n=== Web Crypto API Types - Deep Dive ===\n");

// TypeScript: Full type definitions for Web Crypto API
// crypto.subtle is typed as SubtleCrypto

// Hash functions with types
async function hashSHA256Typed(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data: Uint8Array = encoder.encode(message);
  const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
  const hashArray: Uint8Array = new Uint8Array(hashBuffer);
  const hashHex: string = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// Typed hash algorithm parameter
type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

async function hashWithAlgorithm(
  message: string,
  algorithm: HashAlgorithm
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return await crypto.subtle.digest(algorithm, data);
}

// AES encryption with full types
interface AESEncryptedData {
  encrypted: Uint8Array;
  iv: Uint8Array;
  salt: Uint8Array;
}

async function encryptAESGCMTyped(
  plaintext: string,
  password: string
): Promise<AESEncryptedData> {
  const encoder = new TextEncoder();
  
  // Import password key
  const passwordKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Generate salt
  const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  
  // Derive encryption key
  const key: CryptoKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    } as Pbkdf2Params,
    passwordKey,
    { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
    false,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv } as AesGcmParams,
    key,
    encoder.encode(plaintext)
  );
  
  return {
    encrypted: new Uint8Array(encrypted),
    iv: iv,
    salt: salt
  };
}

async function decryptAESGCMTyped(
  encryptedData: AESEncryptedData,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Import password key
  const passwordKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive same key
  const key: CryptoKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encryptedData.salt,
      iterations: 100000,
      hash: 'SHA-256'
    } as Pbkdf2Params,
    passwordKey,
    { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
    false,
    ['encrypt', 'decrypt']
  );
  
  // Decrypt
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encryptedData.iv } as AesGcmParams,
    key,
    encryptedData.encrypted as BufferSource
  );
  
  return decoder.decode(decrypted);
}

// RSA key pair generation with types
interface RSAKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

async function generateRSAKeyPairTyped(): Promise<CryptoKeyPair> {
  const keyPair: CryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    } as RsaHashedKeyGenParams,
    true,
    ['encrypt', 'decrypt']
  );
  
  return keyPair;
}

// RSA encryption with types
async function encryptRSATyped(
  plaintext: string,
  publicKey: CryptoKey
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' } as RsaOaepParams,
    publicKey,
    encoder.encode(plaintext)
  );
  
  return new Uint8Array(encrypted);
}

async function decryptRSATyped(
  encrypted: Uint8Array,
  privateKey: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' } as RsaOaepParams,
    privateKey,
    encrypted as BufferSource
  );
  
  return decoder.decode(decrypted);
}

// Digital signatures with types
async function generateSigningKeyPairTyped(): Promise<CryptoKeyPair> {
  const keyPair: CryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    } as RsaHashedKeyGenParams,
    true,
    ['sign', 'verify']
  );
  
  return keyPair;
}

async function signMessageTyped(
  message: string,
  privateKey: CryptoKey
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const signature: ArrayBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(message)
  );
  
  return new Uint8Array(signature);
}

async function verifySignatureTyped(
  message: string,
  signature: Uint8Array,
  publicKey: CryptoKey
): Promise<boolean> {
  const encoder = new TextEncoder();
  const isValid: boolean = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signature as BufferSource,
    encoder.encode(message)
  );
  
  return isValid;
}

// Key export/import with types
type KeyFormat = 'raw' | 'pkcs8' | 'spki' | 'jwk';

async function exportKeyTyped(
  key: CryptoKey,
  format: KeyFormat = 'jwk'
): Promise<JsonWebKey | ArrayBuffer> {
  if (format === 'jwk') {
    return await crypto.subtle.exportKey('jwk', key);
  } else {
    return await crypto.subtle.exportKey(format, key);
  }
}

async function importAESKeyTyped(
  jwk: JsonWebKey
): Promise<CryptoKey> {
  const key: CryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
    true,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

// Generic crypto utility class
class CryptoUtils {
  static async hash(
    data: string,
    algorithm: HashAlgorithm = 'SHA-256'
  ): Promise<string> {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest(algorithm, encoder.encode(data));
    const array = new Uint8Array(buffer);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  static async generateAESKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  static async encrypt(
    data: string,
    key: CryptoKey
  ): Promise<{ encrypted: Uint8Array; iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv } as AesGcmParams,
      key,
      encoder.encode(data)
    );
    
    return {
      encrypted: new Uint8Array(encrypted),
      iv
    };
  }
  
  static async decrypt(
    encrypted: Uint8Array,
    iv: Uint8Array,
    key: CryptoKey
  ): Promise<string> {
    const decoder = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv } as AesGcmParams,
      key,
      encrypted as BufferSource
    );
    
    return decoder.decode(decrypted);
  }
}

// Usage with full type safety
async function demonstrateCryptoUtils(): Promise<void> {
  // Hash
  const hash: string = await CryptoUtils.hash('Hello, World!');
  console.log('Hash:', hash);
  
  // Encrypt/Decrypt
  const key: CryptoKey = await CryptoUtils.generateAESKey();
  const { encrypted, iv } = await CryptoUtils.encrypt('Secret message', key);
  const decrypted: string = await CryptoUtils.decrypt(encrypted, iv, key);
  console.log('Decrypted:', decrypted);
}

// Type-safe password hashing
interface PasswordHash {
  hash: Uint8Array;
  salt: Uint8Array;
  iterations: number;
}

async function hashPasswordTyped(password: string): Promise<PasswordHash> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  
  const passwordKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash: ArrayBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    } as Pbkdf2Params,
    passwordKey,
    256
  );
  
  return {
    hash: new Uint8Array(hash),
    salt,
    iterations
  };
}

async function verifyPasswordTyped(
  password: string,
  storedHash: PasswordHash
): Promise<boolean> {
  const encoder = new TextEncoder();
  
  const passwordKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash: ArrayBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: storedHash.salt,
      iterations: storedHash.iterations,
      hash: 'SHA-256'
    } as Pbkdf2Params,
    passwordKey,
    256
  );
  
  const newHash = new Uint8Array(hash);
  return newHash.every((byte, i) => byte === storedHash.hash[i]);
}

console.log("\nWeb Crypto API TypeScript Features:");
console.log("  - Full type definitions for all crypto operations");
console.log("  - Type-safe algorithm parameters");
console.log("  - Typed key generation and management");
console.log("  - Type-safe encryption/decryption");
console.log("  - Typed digital signatures");
console.log("  - Generic crypto utility classes");

console.log("\nBest Practices:");
console.log("  ✅ Use explicit types for crypto operations");
console.log("  ✅ Define interfaces for encrypted data");
console.log("  ✅ Type algorithm parameters");
console.log("  ✅ Create type-safe utility classes");
console.log("  ✅ Use branded types for sensitive data");
console.log("  ✅ Type key formats and usages");

console.log("\n📘 See 48-security.js for detailed Web Crypto API examples!");
