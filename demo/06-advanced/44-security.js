// Web Security Best Practices Demo
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Security
// 📘 OWASP: https://owasp.org/www-project-top-ten/
// 📌 Covers XSS, CSRF, CSP, secure storage, and input validation

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

// HTML escaping function
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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
Content-Security-Policy: script-src 'nonce-${nonce}'

// Use in inline script
<script nonce="${nonce}">
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
// TypeScript Comparison Notes
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
- 39-storage-network.js (Storage APIs)
- 28-fetch-api.js (Network requests)
- 32-forms-validation.js (Form validation)
*/
