// Web Security Best Practices Demo
// 📘 For TypeScript comparison, see: 48-security-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Security
// 📘 OWASP: https://owasp.org/www-project-top-ten/
// 📌 Covers XSS, CSRF, CSP, secure storage, and input validation
// ⚠️ Partial browser environment — DOM/Web Crypto sections require a browser or jsdom; Node crypto sections run in Node

export {};

// ============================================
// Learning goals
// ============================================
// This file covers core web security concepts and mitigation patterns:
// 1. XSS protection techniques
// 2. CSRF prevention methods
// 3. Content Security Policy implementation
// 4. Secure storage best practices
// 5. Input validation and sanitization
// 6. Web Crypto API basics
// 7. OWASP Top 10 considerations
// 8. Modern security features (Trusted Types, COOP/COEP)

// ============================================
// Table of Contents
// ============================================
// 1. XSS (Cross-Site Scripting) Protection
// 2. CSRF (Cross-Site Request Forgery) Protection
// 3. Content Security Policy (CSP)
// 4. Secure Storage
// 5. Input Validation
// 6. Web Crypto API
// 7. OWASP Top 10 Additional Considerations
// 8. Trusted Types & Cross-Origin Isolation
// ============================================

console.log("=== Web Security Best Practices Demo ===\n");

// ============================================
// 1. XSS (Cross-Site Scripting) Protection
// ============================================
console.log("1. XSS Protection:");

// Attack Types: Reflected (URL/input), Stored (database), DOM-based (client-side)

// ❌ VULNERABLE: Direct innerHTML with user input
function vulnerableRender(userInput) {
  document.body.innerHTML = userInput; // DANGEROUS! Executes arbitrary HTML/JS
}

// ✅ SAFE: Use textContent (auto-escapes HTML)
function safeRender(userInput) {
  const div = document.createElement("div");
  div.textContent = userInput;
  document.body.appendChild(div);
}

// ✅ SAFE: Sanitize HTML with DOMPurify for rich content
console.log(
  "  DOMPurify: Sanitizes untrusted HTML - import DOMPurify from 'dompurify'; const clean = DOMPurify.sanitize(dirty);"
);

// HTML escaping function
function escapeHTML(str) {
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

console.log("  Escaped HTML:", escapeHTML('<script>alert("XSS")</script>'));
console.log(
  "  ⚠️  Avoid: innerHTML with user input, eval(), document.write(), inline event handlers with untrusted data"
);

// ============================================
// 2. CSRF (Cross-Site Request Forgery) Protection
// ============================================
console.log("\n2. CSRF Protection:");
console.log(
  "  Attack: Tricks user into making unwanted state-changing requests"
);

// ✅ Protection Methods:
console.log(
  "  1. CSRF Tokens: Server-generated token included in request headers/forms, validated server-side"
);
console.log(
  "  2. SameSite Cookies: Strict (same-site only), Lax (top-level navigation), None (cross-site, requires Secure)"
);
console.log(
  "  3. Double Submit Cookie: CSRF token in cookie + header, server compares values"
);

console.log(
  "\n  Secure cookie example: res.cookie('session', id, { sameSite: 'strict', secure: true, httpOnly: true });"
);
console.log("  ⚠️  Never use GET requests for state-changing operations");

// ============================================
// 3. Content Security Policy (CSP)
// ============================================
console.log("\n3. Content Security Policy (CSP):");
console.log(
  "  Prevents XSS and resource injection by whitelisting allowed content sources"
);

// ✅ Implementation:
console.log(
  '  - Meta tag: <meta http-equiv="Content-Security-Policy" content="default-src \'self\';">'
);
console.log(
  "  - HTTP Header: Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}';"
);

console.log("\n  Common directives:");
console.log(
  "  default-src (fallback), script-src, style-src, img-src, connect-src, frame-ancestors (clickjacking protection)"
);
console.log(
  "  Nonce: Random per-request value for allowing specific inline scripts/styles"
);
console.log(
  "  Reporting: Use report-uri / report-to to collect violation reports without enforcing"
);

// ============================================
// 4. Secure Storage
// ============================================
console.log("\n4. Secure Storage:");

// ❌ INSECURE: Never store sensitive data in localStorage/sessionStorage (vulnerable to XSS)
console.log(
  "  ❌ localStorage.setItem('password', 'secret123'); // NEVER DO THIS"
);

// ✅ SECURE:
console.log(
  "  1. HttpOnly Cookies: For session tokens, not accessible via JavaScript"
);
console.log(
  "  2. Encryption: Use Web Crypto API to encrypt sensitive data if must store client-side"
);
console.log(
  "  3. Secure attributes: Always use secure: true (HTTPS only), sameSite: strict, short maxAge"
);

console.log(
  "\n  Secure cookie attributes: httpOnly, secure, sameSite, maxAge, domain, path"
);

// ============================================
// 5. Input Validation
// ============================================
console.log("\n5. Input Validation:");

// ✅ Whitelist validation (never blacklist)
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

console.log("  Valid email:", validateEmail("user@example.com"));
console.log("  Valid username:", validateUsername("user_123"));

// ✅ Sanitization
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, "").slice(0, 1000);
}

// ✅ File upload validation: Check MIME type, file size, and scan content
// ✅ SQL Injection: Use parameterized queries / ORMs, never string concatenation
console.log(
  "\n  SQL Injection Prevention: Use parameterized queries: db.query('SELECT * FROM users WHERE id = ?', [userId])"
);
console.log(
  "  Command Injection: Never pass user input to shell commands; use safe APIs with parameterized inputs"
);

// ============================================
// 6. Web Crypto API
// ============================================
console.log("\n6. Web Crypto API:");
console.log(
  "  Native browser/Node API for cryptographic operations: hashing, encryption, signing, key generation"
);

console.log("\n  Common use cases:");
console.log(
  "  - Hashing: SHA-256 for password hashing (use with salt, 100k+ iterations via PBKDF2)"
);
console.log(
  "  - Encryption: AES-GCM for symmetric encryption, RSA-OAEP for asymmetric"
);
console.log("  - Signing: ECDSA/RSA-PSS for data integrity");
console.log(
  "  - Random number generation: crypto.getRandomValues() for secure randomness (never Math.random())"
);

console.log(
  "\n  Example: const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('data'));"
);
console.log(
  "  ⚠️  Never implement custom cryptography; use standard algorithms and well-audited libraries"
);

// ============================================
// 7. OWASP Top 10 Additional Considerations
// ============================================
console.log("\n7. OWASP Top 10 Considerations:");
console.log(
  "  A01: Broken Access Control - Enforce authorization checks on every request"
);
console.log(
  "  A02: Cryptographic Failures - Use strong, up-to-date algorithms, never hardcode secrets"
);
console.log(
  "  A03: Injection - Sanitize all inputs, use parameterized queries"
);
console.log(
  "  A04: Insecure Design - Build security into architecture, not as an afterthought"
);
console.log(
  "  A05: Security Misconfiguration - Keep systems patched, remove debug features, use secure defaults"
);
console.log(
  "  A07: Identification and Authentication Failures - Use MFA, implement secure session management, rate limit login attempts"
);
console.log(
  "  A08: Software and Data Integrity Failures - Verify dependencies, use subresource integrity (SRI) for CDN resources"
);
console.log(
  "  A10: Server-Side Request Forgery (SSRF) - Validate and restrict outbound requests from server"
);

// ============================================
// 8. Trusted Types & Cross-Origin Isolation
// ============================================
console.log("\n8. Modern Security Features:");

// Trusted Types
console.log(
  "  Trusted Types: Prevent DOM XSS by enforcing type checks for dangerous sink functions (innerHTML, eval, etc.)"
);
console.log(
  "  Enable via CSP: Content-Security-Policy: require-trusted-types-for 'script';"
);

// COOP/COEP
console.log(
  "  Cross-Origin Isolation: COOP (Cross-Origin Opener Policy) + COEP (Cross-Origin Embedder Policy)"
);
console.log(
  "  Isolates your site from cross-origin documents, enables SharedArrayBuffer and high-resolution timers"
);
console.log(
  "  Headers: Cross-Origin-Opener-Policy: same-origin; Cross-Origin-Embedder-Policy: require-corp"
);

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");
console.log("❌ Storing sensitive data in localStorage");
console.log("❌ Using innerHTML with untrusted user input");
console.log("❌ Not validating CSRF tokens on state-changing requests");
console.log("❌ Using insecure cryptographic algorithms (MD5, SHA-1, AES-ECB)");
console.log(
  "❌ Trusting client-side validation only (always validate server-side)"
);
console.log("❌ Hardcoding secrets in source code / client-side bundles");
console.log("❌ Not using HTTPS for all traffic");
console.log("❌ Disabling security features for 'convenience' in production");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");
console.log("✅ Defense in depth: Apply multiple layers of security controls");
console.log(
  "✅ Use secure defaults: Features should be secure by default, opt-in for less secure behavior"
);
console.log(
  "✅ Least privilege: Give users/processes only the permissions they need"
);
console.log("✅ Sanitize all inputs: Both client-side and server-side");
console.log("✅ Encrypt data in transit (HTTPS) and at rest");
console.log(
  "✅ Keep dependencies updated: Regularly patch security vulnerabilities"
);
console.log("✅ Implement proper logging and monitoring for security events");
console.log("✅ Conduct regular security audits and penetration testing");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
📘 See TypeScript comparison file: 48-security-ts-comparison.ts
Covers:
- Type-safe input validation with Zod/Yup
- Typed CSP directives and security headers
- Web Crypto API type definitions
- Secure session and token type guards
*/

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 43-storage-network.js - Browser storage API details");
console.log("📘 33-fetch-api.js - Network request security patterns");
console.log("📘 38-forms-validation.js - Form input validation techniques");
console.log("📘 OWASP Top 10 Documentation: https://owasp.org/Top10/");
