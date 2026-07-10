// Web Security Best Practices Demo
// 📘 For TypeScript comparison, see: 48-security-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Security
// 📘 OWASP: https://owasp.org/www-project-top-ten/
// 📌 Covers XSS, CSRF, CSP, secure storage, and input validation
// ⚠️ Partial browser environment — DOM/Web Crypto sections require a browser or jsdom; Node crypto sections run in Node

// ============================================
// Section 1: XSS (Cross-Site Scripting) Protection
// ============================================

console.log("\n=== XSS Protection ===");

// XSS Attack Types:
// 1. Reflected XSS: Malicious script in URL/input reflected back
// 2. Stored XSS: Malicious script stored in database
// 3. DOM-based XSS: Client-side script manipulation

// ❌ VULNERABLE: Direct innerHTML
function vulnerableRender(userInput) {
  document.body.innerHTML = userInput; // DANGEROUS!
  // If userInput = "<img src=x onerror=alert('XSS')>", script executes
}

// ✅ SAFE: Use textContent
function safeRender(userInput) {
  const div = document.createElement('div');
  div.textContent = userInput; // Escapes HTML
  document.body.appendChild(div);
}

// ✅ SAFE: DOMPurify library
console.log("DOMPurify usage:");
console.log(`
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror=alert("XSS")>';
const clean = DOMPurify.sanitize(dirty);
// Result: '<img src="x">' (onerror removed)

// Allow specific tags
const cleanHTML = DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  ALLOWED_ATTR: ['href']
});
`);

// Safe innerHTML alternatives
console.log("\nSafe alternatives to innerHTML:");
console.log("1. textContent - for plain text");
console.log("2. createElement + appendChild - for DOM manipulation");
console.log("3. DOMPurify.sanitize() - for trusted HTML");
console.log("4. Template literals with escaping");

// HTML escaping function (browser-only — requires DOM)
function escapeHTML(str) {
  // In Node.js, use a library like he or implement manually (see Node version below)
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  // Node.js fallback: manual entity escaping
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

console.log("Escaped:", escapeHTML('<script>alert("XSS")</script>'));

// Use cases:
// - User-generated content
// - Comments and reviews
// - Rich text editors
// - Dynamic HTML generation

// Common pitfalls:
// ⚠️ Using innerHTML with user input
// ⚠️ eval() with user data
// ⚠️ document.write() with untrusted content
// ⚠️ Inline event handlers with user data

// ============================================
// Section 2: CSRF (Cross-Site Request Forgery) Protection
// ============================================

console.log("\n=== CSRF Protection ===");

// CSRF Attack: Attacker tricks user into making unwanted requests

// ✅ CSRF Token pattern
console.log("CSRF Token implementation:");
console.log(`
// Server generates token
const csrfToken = crypto.randomUUID();
res.cookie('csrf-token', csrfToken, { httpOnly: true });

// Client includes token in requests
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ amount: 100, to: 'user123' })
});

// Server validates token
if (req.headers['x-csrf-token'] !== req.cookies['csrf-token']) {
  return res.status(403).json({ error: 'Invalid CSRF token' });
}
`);

// ✅ SameSite Cookie attribute
console.log("\nSameSite Cookie:");
console.log(`
// Strict: Cookie only sent for same-site requests
res.cookie('session', sessionId, { 
  sameSite: 'strict',
  secure: true,
  httpOnly: true
});

// Lax: Cookie sent for top-level navigation
res.cookie('session', sessionId, { 
  sameSite: 'lax',
  secure: true,
  httpOnly: true
});

// None: Cookie sent for all requests (requires Secure)
res.cookie('tracking', trackingId, { 
  sameSite: 'none',
  secure: true
});
`);

// ✅ Double Submit Cookie pattern
console.log("\nDouble Submit Cookie:");
console.log("1. Server sets CSRF token in cookie");
console.log("2. Client reads cookie and sends in header");
console.log("3. Server compares cookie value with header value");

// Use cases:
// - Form submissions
// - State-changing operations
// - API endpoints
// - Payment processing

// Common pitfalls:
// ⚠️ Not validating CSRF tokens
// ⚠️ Using GET for state-changing operations
// ⚠️ Weak token generation
// ⚠️ Not using SameSite cookies

// ============================================
// Section 3: Content Security Policy (CSP)
// ============================================

console.log("\n=== Content Security Policy ===");

// CSP prevents XSS by controlling resource loading

// ✅ CSP via meta tag
console.log("CSP meta tag:");
console.log(`
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://trusted.cdn.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
`);

// ✅ CSP via HTTP header
console.log("\nCSP HTTP header:");
console.log(`
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'nonce-{random}';
  img-src 'self' https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`);

// CSP directives
console.log("\nCommon CSP directives:");
console.log("- default-src: Fallback for other directives");
console.log("- script-src: JavaScript sources");
console.log("- style-src: CSS sources");
console.log("- img-src: Image sources");
console.log("- connect-src: Fetch, XHR, WebSocket sources");
console.log("- font-src: Font sources");
console.log("- frame-src: iframe sources");
console.log("- media-src: Audio/video sources");

// CSP nonce for inline scripts
console.log("\nCSP nonce usage:");
console.log(`
// Server generates nonce
const nonce = crypto.randomBytes(16).toString('base64');

// Include in CSP header
Content-Security-Policy: script-src 'nonce-\${nonce}'

// Use in inline script
<script nonce="\${nonce}">
  console.log('This script is allowed');
</script>
`);

// CSP reporting
console.log("\nCSP violation reporting:");
console.log(`
Content-Security-Policy: 
  default-src 'self'; 
  report-uri /csp-violation-report;
  report-to csp-endpoint;
`);

// Use cases:
// - Prevent XSS attacks
// - Control resource loading
// - Prevent clickjacking
// - Monitor security violations

// ============================================
// Section 4: Secure Storage
// ============================================

console.log("\n=== Secure Storage ===");

// ❌ INSECURE: Storing sensitive data in localStorage
console.log("❌ Don't store sensitive data in localStorage:");
console.log("localStorage.setItem('password', 'secret123'); // NEVER DO THIS");
console.log("localStorage.setItem('creditCard', '1234-5678'); // NEVER DO THIS");

// ✅ SECURE: Use httpOnly cookies for sensitive data
console.log("\n✅ Use httpOnly cookies:");
console.log(`
// Server-side only
res.cookie('session', sessionId, {
  httpOnly: true,  // Not accessible via JavaScript
  secure: true,    // Only sent over HTTPS
  sameSite: 'strict',
  maxAge: 3600000  // 1 hour
});
`);

// ✅ Encrypt sensitive data if must store client-side
console.log("\n✅ Encrypt data with Web Crypto API:");
console.log(`
async function encryptData(data, password) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Derive key from password
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
      salt: encoder.encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  return { encrypted, iv };
}
`);

// Secure cookie configuration
console.log("\nSecure cookie attributes:");
console.log("- httpOnly: Prevents JavaScript access");
console.log("- secure: Only sent over HTTPS");
console.log("- sameSite: CSRF protection");
console.log("- maxAge/expires: Limit lifetime");
console.log("- domain: Limit scope");
console.log("- path: Limit scope");

// Use cases:
// - Session tokens
// - Authentication data
// - User preferences (non-sensitive)
// - Temporary data

// Common pitfalls:
// ⚠️ Storing passwords client-side
// ⚠️ Storing tokens in localStorage
// ⚠️ Not using httpOnly for session cookies
// ⚠️ Not encrypting sensitive data

// ============================================
// Section 5: Input Validation
// ============================================

console.log("\n=== Input Validation ===");

// ✅ Whitelist validation
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateUsername(username) {
  // Only alphanumeric and underscore, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

console.log("Valid email:", validateEmail("user@example.com"));
console.log("Valid username:", validateUsername("user_123"));

// ✅ Sanitize input
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 1000);      // Limit length
}

// ✅ Validate file uploads
function validateFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  return true;
}

// ✅ SQL injection prevention (parameterized queries)
console.log("\nSQL injection prevention:");
console.log(`
// ❌ VULNERABLE
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// ✅ SAFE: Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// ✅ SAFE: ORM
const user = await User.findOne({ where: { id: userId } });
`);

// ✅ Command injection prevention
console.log("\nCommand injection prevention:");
console.log(`
// ❌ VULNERABLE
exec(\`ping \${userInput}\`);

// ✅ SAFE: Validate and sanitize
const validIP = /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/.test(userInput);
if (validIP) {
  exec('ping', [userInput]);
}
`);

// Use cases:
// - Form inputs
// - API parameters
// - File uploads
// - Search queries

// Common pitfalls:
// ⚠️ Trusting client-side validation only
// ⚠️ Not sanitizing input
// ⚠️ Weak regex patterns
// ⚠️ Not validating file types

// ============================================
// Section 6: Web Crypto API (Deep Dive)
// ============================================

console.log("\n=== Web Crypto API - Deep Dive ===");

/**
 * Web Crypto API - Cryptographic operations in the browser
 * 
 * crypto.subtle methods:
 * - encrypt/decrypt: Symmetric encryption
 * - sign/verify: Digital signatures
 * - digest: Hash functions
 * - generateKey: Key generation
 * - deriveKey/deriveBits: Key derivation
 * - importKey/exportKey: Key import/export
 * - wrapKey/unwrapKey: Key wrapping
 * 
 * Supported algorithms:
 * - AES-GCM, AES-CBC, AES-CTR: Symmetric encryption
 * - RSA-OAEP: Asymmetric encryption
 * - RSA-PSS, RSASSA-PKCS1-v1_5, ECDSA: Digital signatures
 * - SHA-256, SHA-384, SHA-512: Hash functions
 * - PBKDF2, HKDF: Key derivation
 * - HMAC: Message authentication
 */

// ============================================
// 6.1 Hash Functions (SHA-256, SHA-384, SHA-512)
// ============================================

console.log("\n6.1 Hash Functions:");

// SHA-256 hash
async function hashSHA256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

console.log(`
// SHA-256 Example
const message = "Hello, World!";
const hash = await hashSHA256(message);
console.log('SHA-256:', hash);
// Output: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
`);

// Different hash algorithms
async function demonstrateHashAlgorithms() {
  const message = "Hello, World!";
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // SHA-256 (32 bytes)
  const sha256 = await crypto.subtle.digest('SHA-256', data);
  console.log('SHA-256 length:', sha256.byteLength, 'bytes');
  
  // SHA-384 (48 bytes)
  const sha384 = await crypto.subtle.digest('SHA-384', data);
  console.log('SHA-384 length:', sha384.byteLength, 'bytes');
  
  // SHA-512 (64 bytes)
  const sha512 = await crypto.subtle.digest('SHA-512', data);
  console.log('SHA-512 length:', sha512.byteLength, 'bytes');
}

console.log("\nHash algorithm comparison:");
console.log("  SHA-256: 256 bits (32 bytes) - Most common");
console.log("  SHA-384: 384 bits (48 bytes) - More secure");
console.log("  SHA-512: 512 bits (64 bytes) - Most secure");

// Use cases for hashing
console.log("\nHash function use cases:");
console.log("  - Password hashing (with salt)");
console.log("  - File integrity verification");
console.log("  - Digital signatures");
console.log("  - Blockchain");
console.log("  - Content addressing");

// ============================================
// 6.2 Symmetric Encryption (AES)
// ============================================

console.log("\n6.2 Symmetric Encryption (AES):");

// AES-GCM encryption (recommended)
async function encryptAESGCM(plaintext, password) {
  const encoder = new TextEncoder();
  
  // Derive key from password
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(plaintext)
  );
  
  return {
    encrypted: new Uint8Array(encrypted),
    iv: iv,
    salt: salt
  };
}

async function decryptAESGCM(encryptedData, password) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Derive same key from password
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encryptedData.salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encryptedData.iv },
    key,
    encryptedData.encrypted
  );
  
  return decoder.decode(decrypted);
}

console.log(`
// AES-GCM Encryption Example
const plaintext = "Secret message";
const password = "my-secure-password";

const encrypted = await encryptAESGCM(plaintext, password);
console.log('Encrypted:', encrypted.encrypted);
console.log('IV:', encrypted.iv);
console.log('Salt:', encrypted.salt);

const decrypted = await decryptAESGCM(encrypted, password);
console.log('Decrypted:', decrypted); // "Secret message"
`);

// AES modes comparison
console.log("\nAES Encryption Modes:");
console.log("  AES-GCM (Galois/Counter Mode):");
console.log("    ✓ Authenticated encryption");
console.log("    ✓ Detects tampering");
console.log("    ✓ Recommended for most use cases");
console.log("    - Requires unique IV for each encryption");
console.log("\n  AES-CBC (Cipher Block Chaining):");
console.log("    ✓ Well-established");
console.log("    - No authentication (use with HMAC)");
console.log("    - Padding oracle attacks possible");
console.log("\n  AES-CTR (Counter Mode):");
console.log("    ✓ Parallelizable");
console.log("    - No authentication (use with HMAC)");
console.log("    - Requires unique IV");

// Key sizes
console.log("\nAES Key Sizes:");
console.log("  - 128 bits: Fast, secure for most uses");
console.log("  - 192 bits: More secure");
console.log("  - 256 bits: Maximum security");

// ============================================
// 6.3 Asymmetric Encryption (RSA)
// ============================================

console.log("\n6.3 Asymmetric Encryption (RSA):");

// Generate RSA key pair
async function generateRSAKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  return keyPair;
}

// RSA encryption
async function encryptRSA(plaintext, publicKey) {
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoder.encode(plaintext)
  );
  
  return new Uint8Array(encrypted);
}

// RSA decryption
async function decryptRSA(encrypted, privateKey) {
  const decoder = new TextDecoder();
  const decrypted = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encrypted
  );
  
  return decoder.decode(decrypted);
}

console.log(`
// RSA Encryption Example
const keyPair = await generateRSAKeyPair();

const plaintext = "Secret message";
const encrypted = await encryptRSA(plaintext, keyPair.publicKey);
console.log('Encrypted:', encrypted);

const decrypted = await decryptRSA(encrypted, keyPair.privateKey);
console.log('Decrypted:', decrypted); // "Secret message"
`);

console.log("\nRSA vs AES:");
console.log("  RSA (Asymmetric):");
console.log("    ✓ Public/private key pair");
console.log("    ✓ No shared secret needed");
console.log("    ✓ Digital signatures");
console.log("    - Slower than AES");
console.log("    - Limited message size");
console.log("\n  AES (Symmetric):");
console.log("    ✓ Fast encryption");
console.log("    ✓ Unlimited message size");
console.log("    - Requires shared secret");
console.log("    - Key distribution problem");

console.log("\nHybrid encryption (RSA + AES):");
console.log("  1. Generate random AES key");
console.log("  2. Encrypt data with AES key");
console.log("  3. Encrypt AES key with RSA public key");
console.log("  4. Send encrypted data + encrypted key");

// ============================================
// 6.4 Digital Signatures
// ============================================

console.log("\n6.4 Digital Signatures:");

// Generate signing key pair
async function generateSigningKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );
  
  return keyPair;
}

// Sign message
async function signMessage(message, privateKey) {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(message)
  );
  
  return new Uint8Array(signature);
}

// Verify signature
async function verifySignature(message, signature, publicKey) {
  const encoder = new TextEncoder();
  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signature,
    encoder.encode(message)
  );
  
  return isValid;
}

console.log(`
// Digital Signature Example
const keyPair = await generateSigningKeyPair();

const message = "Important document";
const signature = await signMessage(message, keyPair.privateKey);
console.log('Signature:', signature);

const isValid = await verifySignature(message, signature, keyPair.publicKey);
console.log('Valid:', isValid); // true

// Tampered message
const tamperedMessage = "Important document (modified)";
const isValidTampered = await verifySignature(
  tamperedMessage, 
  signature, 
  keyPair.publicKey
);
console.log('Valid (tampered):', isValidTampered); // false
`);

console.log("\nDigital Signature Algorithms:");
console.log("  RSASSA-PKCS1-v1_5:");
console.log("    ✓ Widely supported");
console.log("    ✓ Compatible with many systems");
console.log("\n  RSA-PSS:");
console.log("    ✓ More secure than PKCS1");
console.log("    ✓ Probabilistic padding");
console.log("\n  ECDSA:");
console.log("    ✓ Smaller keys than RSA");
console.log("    ✓ Faster than RSA");
console.log("    ✓ Modern standard");

// Use cases
console.log("\nDigital Signature Use Cases:");
console.log("  - Document signing");
console.log("  - Software distribution");
console.log("  - API authentication (JWT)");
console.log("  - Blockchain transactions");
console.log("  - Email signing (S/MIME)");

// ============================================
// 6.5 Key Generation and Management
// ============================================

console.log("\n6.5 Key Generation and Management:");

// Generate symmetric key
async function generateAESKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

// Export key
async function exportKey(key) {
  const exported = await crypto.subtle.exportKey('jwk', key);
  return exported;
}

// Import key
async function importKey(jwk, algorithm, usages) {
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    algorithm,
    true,
    usages
  );
  
  return key;
}

console.log(`
// Key Generation Example
const key = await generateAESKey();
console.log('Generated key:', key);

// Export key (for storage)
const exported = await exportKey(key);
console.log('Exported key (JWK):', exported);

// Import key (from storage)
const imported = await importKey(
  exported,
  { name: 'AES-GCM', length: 256 },
  ['encrypt', 'decrypt']
);
console.log('Imported key:', imported);
`);

// Key formats
console.log("\nKey Formats:");
console.log("  raw: Raw bytes (symmetric keys)");
console.log("  pkcs8: Private key format");
console.log("  spki: Public key format");
console.log("  jwk: JSON Web Key (most flexible)");

// Key derivation (PBKDF2)
console.log("\nKey Derivation (PBKDF2):");
console.log(`
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  return key;
}
`);

console.log("\nKey Derivation Use Cases:");
console.log("  - Password-based encryption");
console.log("  - Key stretching");
console.log("  - Derive multiple keys from one password");

// Key storage best practices
console.log("\nKey Storage Best Practices:");
console.log("  ✅ Never store keys in localStorage");
console.log("  ✅ Use IndexedDB for client-side key storage");
console.log("  ✅ Encrypt keys before storage");
console.log("  ✅ Use key wrapping for key storage");
console.log("  ✅ Store keys server-side when possible");
console.log("  ✅ Use hardware security modules (HSM) for production");
console.log("  ⚠️ Never log or expose keys");
console.log("  ⚠️ Rotate keys regularly");
console.log("  ⚠️ Use strong key derivation (high iterations)");

// ============================================
// 6.6 Practical Applications
// ============================================

console.log("\n6.6 Practical Applications:");

console.log("\n1. Secure Password Storage:");
console.log(`
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );
  
  return {
    hash: new Uint8Array(hash),
    salt: salt
  };
}

async function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = await hashPassword(password);
  // Compare hash with storedHash
  return hash.every((byte, i) => byte === storedHash[i]);
}
`);

console.log("\n2. End-to-End Encryption (E2EE):");
console.log(`
// User A generates key pair
const keyPairA = await generateRSAKeyPair();

// User B generates key pair
const keyPairB = await generateRSAKeyPair();

// User A encrypts message for User B
const message = "Secret message";
const encrypted = await encryptRSA(message, keyPairB.publicKey);

// User B decrypts message
const decrypted = await decryptRSA(encrypted, keyPairB.privateKey);
`);

console.log("\n3. File Encryption:");
console.log(`
async function encryptFile(file, password) {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  // Derive key from password
  const key = await deriveKeyFromPassword(password);
  
  // Encrypt file
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  
  return { encrypted, iv };
}
`);

console.log("\n4. JWT Token Signing:");
console.log(`
async function signJWT(payload, privateKey) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const encoder = new TextEncoder();
  
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(payload));
  const message = \`\${headerB64}.\${payloadB64}\`;
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(message)
  );
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return \`\${message}.\${signatureB64}\`;
}
`);

console.log("\n5. Secure Random Token Generation:");
console.log(`
function generateSecureToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const token = generateSecureToken();
console.log('Secure token:', token);
`);

// ============================================
// 6.7 Security Best Practices
// ============================================

console.log("\n6.7 Web Crypto API Best Practices:");

console.log("\nEncryption:");
console.log("  ✅ Use AES-GCM for authenticated encryption");
console.log("  ✅ Generate unique IV for each encryption");
console.log("  ✅ Use 256-bit keys for maximum security");
console.log("  ✅ Never reuse IVs with the same key");
console.log("  ⚠️ Don't use ECB mode (insecure)");
console.log("  ⚠️ Don't use CBC without authentication");

console.log("\nKey Management:");
console.log("  ✅ Use PBKDF2 with high iterations (600,000+ as of 2025 OWASP standard)");
console.log("  ✅ Consider Argon2id for password hashing (Node.js 24.7.0+ built-in crypto.argon2; older Node via argon2 npm package)");
console.log("  ✅ Generate random salts for each key derivation");
console.log("  ✅ Store keys securely (IndexedDB, not localStorage)");
console.log("  ✅ Use key wrapping for key storage");
console.log("  ⚠️ Never hardcode keys in source code");
console.log("  ⚠️ Rotate keys regularly");

console.log("\nPassword Hashing Recommendations (2025):");
console.log("  ✅ PREFER: Argon2id for new implementations");
console.log("     - Winner of 2015 Password Hashing Competition");
console.log("     - Configurable: time_cost=2, memory_cost=19456, parallelism=1");
console.log("     - Resistant to GPU and side-channel attacks");

console.log("  ✅ ACCEPTABLE: PBKDF2 with high iterations");
console.log("     - PBKDF2-HMAC-SHA256: 600,000+ iterations");
console.log("     - PBKDF2-HMAC-SHA512: 220,000+ iterations");
console.log("     - Well-tested, widely available via Web Crypto API");

console.log("  ⚠️ LEGACY: bcrypt (consider migration)");
console.log("     - Fixed work factor limits security");
console.log("     - Still acceptable but Argon2id preferred");

console.log("  Implementation:");
console.log("  - Node.js 24.7.0+: built-in crypto.argon2('argon2id', ...)");
console.log("  - Older Node.js: use argon2 npm package");
console.log("  - Browsers: Use argon2 package via WebAssembly");
console.log("  - PBKDF2: Available natively via Web Crypto API in both Node.js and browsers");

console.log("\nHashing:");
console.log("  ✅ Use SHA-256 or stronger");
console.log("  ✅ Use salt for password hashing");
console.log("  ✅ Use PBKDF2/bcrypt/scrypt for passwords");
console.log("  ⚠️ Don't use MD5 or SHA-1 (broken)");

console.log("\nDigital Signatures:");
console.log("  ✅ Use RSA-PSS or ECDSA");
console.log("  ✅ Verify signatures before trusting data");
console.log("  ✅ Use 2048-bit RSA or 256-bit ECDSA minimum");
console.log("  ⚠️ Protect private keys carefully");

console.log("\nGeneral:");
console.log("  ✅ Use crypto.getRandomValues() for random data");
console.log("  ✅ Handle errors gracefully");
console.log("  ✅ Use HTTPS for all crypto operations");
console.log("  ✅ Keep crypto libraries updated");
console.log("  ⚠️ Don't implement your own crypto algorithms");
console.log("  ⚠️ Don't trust client-side crypto alone\n");

// ============================================
// 7. OWASP TOP 10 ADDITIONAL CONSIDERATIONS
// ============================================
/**
 * OWASP Top 10 (2021) — Additional coverage beyond XSS/CSRF/Injection
 *
 * This file covers: XSS (A03: Injection), CSRF (A01: Broken Access Control subset),
 * Input Validation (A03), CSP (A05: Security Misconfiguration).
 *
 * Below are key additional areas from the OWASP Top 10:
 */

console.log("\n=== 7. OWASP Top 10 Additional Coverage ===");

// A01: Broken Access Control
console.log("\nA01: Broken Access Control:");
console.log(`
// Always verify authorization on the server — never trust client-side checks
// Client-side hiding (display:none, disabled buttons) is NOT security

// ❌ INSECURE: Client-side only check
if (user.role === 'admin') {
  showAdminPanel(); // Panel exists, just hidden for non-admins
}

// ✅ SECURE: Server validates every request
async function deleteUser(userId) {
  const response = await fetch(\`/api/users/\${userId}\`, {
    method: 'DELETE',
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  // Server checks: Is the requester authenticated? Do they have permission?
  if (response.status === 403) throw new Error('Access denied');
}

// Key practices:
// - Deny by default — whitelist, not blacklist
// - Implement proper session management (httpOnly, Secure, SameSite cookies)
// - Use JWT with short expiration + refresh tokens
// - Validate permissions on every request, not just at login
`);

// A02: Cryptographic Failures
console.log("\nA02: Cryptographic Failures:");
console.log(`
// ❌ INSECURE: Weak/outdated algorithms
// - MD5, SHA-1 for password hashing
// - ECB mode for encryption
// - Hardcoded keys in source code
// - Insufficient key length (< 2048-bit RSA, < 128-bit AES)

// ✅ SECURE: Modern cryptographic practices
// - Use PBKDF2, bcrypt, or Argon2id for passwords (see Section 6)
// - Use AES-256-GCM for symmetric encryption
// - Use RSA 4096+ or ECC (P-256+) for asymmetric
// - Store keys in environment variables or secrets manager
// - Use HTTPS (TLS 1.3) for all communications

// Never implement your own crypto — use standard libraries
// Web Crypto API (Section 6) provides secure implementations
`);

// A04: Insecure Design
console.log("\nA04: Insecure Design:");
console.log(`
// Security should be part of the design phase, not an afterthought

// Key practices:
// - Threat modeling during design (STRIDE, attack trees)
// - Security requirements alongside functional requirements
// - Rate limiting on all API endpoints
// - Account lockout after N failed attempts
// - Secure defaults (opt-in to insecurity, not opt-out)

// Example: Rate limiting pattern
const attempts = new Map();
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;
  attempts.set(key, record);
  return record.count <= maxAttempts;
}
`);

// A05: Security Misconfiguration
console.log("\nA05: Security Misconfiguration (beyond CSP):");
console.log(`
// Beyond CSP (Section 3), also consider:
// - HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY (or SAMEORIGIN) — clickjacking prevention
// - Referrer-Policy: strict-origin-when-cross-origin
// - Permissions-Policy: camera=(), microphone=() — disable unused features
// - Remove server version headers (Server, X-Powered-By)
// - Disable unnecessary HTTP methods (TRACE, OPTIONS if not needed)
`);

// A07: Identification and Authentication Failures
console.log("\nA07: Authentication Failures:");
console.log(`
// Key practices:
// - Multi-factor authentication (MFA/2FA)
// - No weak password policies (minimum length, complexity)
// - Secure password reset flows (time-limited tokens, email verification)
// - Session timeout and proper logout (invalidate server-side session)
// - Prevent credential stuffing (rate limiting, CAPTCHA, breach detection)

// Example: Secure password reset token
// const token = crypto.randomBytes(32).toString('hex'); // 64-char hex
// Store hashed token with expiry (e.g., 15 minutes)
// const hashedToken = await crypto.subtle.digest('SHA-256',
//   new TextEncoder().encode(token));
// Send raw token via email; verify hashed version on use
`);

// A08: Software and Data Integrity Failures
console.log("\nA08: Software & Data Integrity:");
console.log(`
// - Use Subresource Integrity (SRI) for CDN scripts
//   <script src="..." integrity="sha384-..."></script>
// - Verify package integrity (npm audit, lockfile hashes)
// - CI/CD pipeline security (review dependencies, scan for CVEs)
// - Signed commits and tags (git verify-commit)
// - Deserialize data safely (avoid eval(), use JSON.parse with reviver)
`);


// ============================================
// Section 8: Trusted Types & Cross-Origin Isolation (COOP/COEP)
// ============================================

console.log("\n=== 8. Trusted Types & Cross-Origin Isolation (COOP/COEP) ===");

// NOTE: Trusted Types and COOP/COEP are Web Platform / browser security
// features delivered via CSP HTTP headers and DOM APIs. They are NOT
// ECMAScript spec features, so no verification block (HTTP header / browser
// feature, not an ES feature). Examples are commented out because they
// require a browser environment and the headers to be set.

// 8.1 Trusted Types - DOM XSS prevention at the browser level
// Trusted Types locks down dangerous DOM sinks (innerHTML, eval,
// document.write, insertAdjacentHTML, etc.) so they only accept a
// "TrustedHTML" object instead of a raw string. This makes DOM-based XSS
// impossible by construction instead of relying on careful sanitization.
//
// Enable via Content-Security-Policy (report-only first, then enforce):
//   Content-Security-Policy: require-trusted-types-for 'script';
//   Content-Security-Policy: trusted-types myPolicy default;
console.log("\n8.1 Trusted Types (DOM XSS hardening):");
console.log("Header: Content-Security-Policy: require-trusted-types-for 'script'");
console.log(`
// Without Trusted Types (raw string -> dangerous sink):
element.innerHTML = userInput; // ❌ blocked once policy is enforced

// With Trusted Types: only a TrustedHTML value may be assigned.
// Define a policy that produces TrustedHTML (your single sanitization point):
const escapePolicy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (input) => DOMPurify.sanitize(input) // sanitize here, once
});

// Now assign the TrustedHTML object:
element.innerHTML = escapePolicy.createHTML(userInput); // ✅ allowed

// Default policy (optional) auto-wraps raw strings so legacy code keeps
// working while still going through your sanitizer:
trustedTypes.createPolicy('default', {
  createHTML: (input) => DOMPurify.sanitize(input)
});
`);
console.log("Benefits:");
console.log("  - DOM XSS sinks refuse raw strings at runtime");
console.log("  - Centralizes all sanitization into named policies");
console.log("  - Report-only mode ('report-uri') eases rollout");
console.log("Pitfalls:");
console.log("  - Requires migrating every innerHTML/insertAdjacentHTML call");
console.log("  - Third-party scripts may break; allowlist via trusted-types");

// 8.2 COOP / COEP - Cross-Origin Isolation
// Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP)
// together create a "cross-origin isolated" context. This is REQUIRED to
// enable powerful APIs that share memory across origins safely:
//   - SharedArrayBuffer (and Atomics) in all browsers (post-Spectre)
//   - SharedArrayBuffer in Workers
//   - performance.measureUserAgentSpecificMemory()
//   - JS Self-Profiling API
//
// Related (already covered in 41-typed-arrays.js): SharedArrayBuffer needs
// this isolation. This section gives the dedicated header treatment.
console.log("\n8.2 COOP / COEP (Cross-Origin Isolation):");
console.log("Headers required for cross-origin isolation:");
console.log(`
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
`);
console.log("What each header does:");
console.log("  COOP: same-origin");
console.log("    - Isolates the browsing context group from other documents");
console.log("    - Prevents cross-origin windows from sharing the context");
console.log("    - Blocks cross-origin window.opener access");
console.log("  COEP: require-corp");
console.log("    - Requires all cross-origin resources to opt in via CORP");
console.log("      (Cross-Origin-Resource-Policy) or explicit CORS");
console.log("    - Prevents loading unauthenticated cross-origin resources");
console.log("  => Together they grant crossOriginIsolated === true");

// Detecting isolation at runtime (works in browser; Node has no window)
console.log("\nRuntime detection:");
console.log(`
// In a browser window/worker context:
if (typeof self !== 'undefined' && self.crossOriginIsolated) {
  // ✅ Safe to use SharedArrayBuffer here
  const sab = new SharedArrayBuffer(1024);
} else {
  // ❌ Not isolated — SharedArrayBuffer unavailable or unshared
  console.warn("Cross-origin isolation not enabled; SAB unavailable.");
}
`);

// 8.3 Common pitfalls for COOP/COEP
console.log("COOP/COEP pitfalls:");
console.log("  - All cross-origin resources need CORP or CORS headers");
console.log("    (images, scripts, iframes, fonts, workers)");
console.log("  - COEP: credentialless is a friendlier alternative to");
console.log("    require-corp for sites loading many third-party resources");
console.log("  - COOP same-origin breaks some window.open()/opener flows");
console.log("  - Service workers must also serve correct CORP headers");
console.log("  - Set headers on ALL responses, including subresources");

// 8.4 Related security headers recap
console.log("\nRelated security headers (recap):");
console.log("  - Content-Security-Policy: resource allowlist (Section 3)");
console.log("  - require-trusted-types-for 'script': Trusted Types (8.1)");
console.log("  - Cross-Origin-Opener-Policy: COOP (8.2)");
console.log("  - Cross-Origin-Embedder-Policy: COEP (8.2)");
console.log("  - Cross-Origin-Resource-Policy: per-resource opt-in for COEP");
console.log("  - Strict-Transport-Security: force HTTPS (Section 7 / A05)");
console.log("  - X-Content-Type-Options: nosniff (Section 7 / A05)");
console.log("  - X-Frame-Options / frame-ancestors: clickjacking (Section 3)");


// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: XSS through innerHTML
console.log("\nPitfall 1: XSS through innerHTML");
console.log("  Setting innerHTML with unsanitized user input allows script injection");
console.log("  Fix: Always sanitize with DOMPurify or use textContent");

// Pitfall 2: CSRF token not verified server-side
console.log("\nPitfall 2: CSRF token not verified server-side");
console.log("  Client-side token generation alone provides zero protection");
console.log("  Fix: Server must generate, store, and verify tokens");

// Pitfall 3: Storing tokens in localStorage
console.log("\nPitfall 3: Storing tokens in localStorage");
console.log("  localStorage is accessible via JavaScript (XSS extraction)");
console.log("  Fix: Use HttpOnly, Secure, SameSite cookies");

// Pitfall 4: Weak CSP (allowing unsafe-inline)
console.log("\nPitfall 4: Weak CSP (allowing unsafe-inline)");
console.log("  'unsafe-inline' allows inline scripts, defeating CSP purpose");
console.log("  Fix: Use nonce-based or hash-based CSP");

// Pitfall 5: Trusting client-side validation
console.log("\nPitfall 5: Trusting client-side validation");
console.log("  Client validation can be bypassed via browser dev tools");
console.log("  Fix: Always enforce validation server-side");

// Pitfall 6: Not sanitizing user input
console.log("\nPitfall 6: Not sanitizing user input");
console.log("  Raw user input in DOM/URLs/SQL enables injection attacks");
console.log("  Fix: Sanitize and validate at every entry point");

// Pitfall 7: Using eval() on user data
console.log("\nPitfall 7: Using eval() on user data");
console.log("  eval() executes arbitrary code from user input");
console.log("  Fix: Use JSON.parse() and safe alternatives");

// Pitfall 8: Predictable CSRF tokens
console.log("\nPitfall 8: Predictable CSRF tokens");
console.log("  Math.random() or timestamps are guessable");
console.log("  Fix: Use crypto.getRandomValues() for secure randomness");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Sanitize all input before rendering or processing");
console.log("2. Use Content-Security-Policy headers to restrict script sources");
console.log("3. Use HttpOnly, Secure, SameSite cookies for sensitive tokens");
console.log("4. Validate all input server-side, never rely solely on client validation");
console.log("5. Use CSP headers for defense in depth");
console.log("6. Implement rate limiting for sensitive endpoints");
console.log("7. Use secure, random CSRF tokens");
console.log("8. Keep all security libraries updated");
console.log("9. Use HTTPS for all communication");
console.log("10. Implement proper error handling (no stack traces in production)");

console.log("\n❌ DON'T:");
console.log("1. Don't trust any user input without sanitization");
console.log("2. Don't store secrets, tokens, or credentials in client-side code");
console.log("3. Don't use eval() or Function() with user-supplied data");
console.log("4. Don't use 'unsafe-inline' in CSP");
console.log("5. Don't implement your own crypto algorithms");
console.log("6. Don't skip server-side validation");
console.log("7. Don't store sensitive data in localStorage");
console.log("8. Don't expose stack traces in production errors");
console.log("9. Don't trust client-side validation alone");
console.log("10. Don't hardcode secrets in source code");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. XSS vectors: innerHTML, DOM manipulation, URL parameters, event handlers");
console.log("2. CSRF bypasses: missing token validation, SameSite cookie gaps, CORS misconfigurations");
console.log("3. Token exposure: localStorage, URL parameters, error messages, logging");
console.log("4. Injection attacks: SQL, NoSQL, OS commands, LDAP");
console.log("5. Security headers missing or misconfigured");
console.log("6. Third-party library vulnerabilities");
console.log("7. Client-side crypto limitations");
console.log("8. Mixed content (HTTP + HTTPS)");

// ============================================
// TypeScript Comparison Notes (Updated)
// ============================================
/*
🔍 Key Differences in TypeScript:

1. XSS PROTECTION
   TS:  Type-safe sanitization functions
   TS:  function sanitize(input: string): string
   TS:  DOMPurify types: DOMPurify.sanitize(dirty, config)

2. CSRF PROTECTION
   TS:  Typed CSRF token interfaces
   TS:  interface CSRFToken { token: string; expiresAt: Date; }
   TS:  Type-safe cookie options

3. CSP CONFIGURATION
   TS:  Type-safe CSP directive builders
   TS:  interface CSPDirectives { 'script-src': string[]; }
   TS:  Compile-time CSP validation

4. SECURE STORAGE
   TS:  Typed encryption/decryption functions
   TS:  interface EncryptedData { data: ArrayBuffer; iv: Uint8Array; }
   TS:  Type-safe cookie configuration

5. INPUT VALIDATION
   TS:  Type guards for validation
   TS:  function isValidEmail(input: string): input is Email
   TS:  Branded types for validated inputs

⚠️ SECURITY CHECKLIST:
- ✅ Sanitize all user input
- ✅ Use CSP headers
- ✅ Implement CSRF protection
- ✅ Use httpOnly, secure cookies
- ✅ Validate and sanitize on server
- ✅ Use parameterized queries
- ✅ Encrypt sensitive data
- ✅ Keep dependencies updated
- ✅ Use HTTPS everywhere
- ✅ Implement rate limiting

🔧 BEST PRACTICES:
- Never trust client-side validation
- Always validate on server
- Use security headers (CSP, HSTS, X-Frame-Options)
- Implement proper authentication and authorization
- Log security events
- Regular security audits
- Follow principle of least privilege

📘 See related:
- 43-storage-network.js (Storage APIs)
- 33-fetch-api.js (Network requests)
- 38-forms-validation.js (Form validation)
*/
