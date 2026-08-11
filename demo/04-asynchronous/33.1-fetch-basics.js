// Fetch API - Basics Demo
// 📘 For TypeScript comparison, see: 33-fetch-api-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file introduces Fetch API basics:
// 1. Basic GET requests with Promises
// 2. Response body methods (json, text, blob, arrayBuffer, formData)
// 3. Request configuration and POST/PUT/PATCH/DELETE methods
// 4. FormData for file uploads

// ============================================
// Table of Contents
// ============================================

// 1. Fetch API Basics (GET requests)
// 2. Response Handling Methods
// 3. POST/PUT/PATCH/DELETE Requests
// 4. FormData File Uploads

// ============================================

console.log("=== Fetch API Basics Demo ===\n");

const API_BASE = "https://jsonplaceholder.typicode.com";

// ============================================
// 1. Fetch API Basics (GET requests)
// ============================================
/**
 * Fetch API - Modern interface for making HTTP requests
 *
 * ES Specification: Fetch Standard (living standard)
 *
 * Characteristics:
 * - Promise-based HTTP client
 * - Clean, modern syntax
 * - Does NOT reject on HTTP error status (404, 500)
 * - Only rejects on network failure or CORS issues
 * - Requires manual check of response.ok or response.status
 * - Browser built-in (globally available in Node.js 18+)
 *
 * Use Cases:
 * - REST API consumption
 * - JSON data fetching
 * - File uploads/downloads
 */

console.log("1. Basic GET Request:");

// Using Promise chains
fetch(`${API_BASE}/posts/1`)
  .then(response => {
    console.log("   Response received, status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("   Fetched post:", data.title);
  })
  .catch(error => {
    console.error("   Fetch error:", error.message);
  });

// ============================================
// 2. Response Handling Methods
// ============================================
/**
 * Response Body Methods - All return Promises
 *
 * - response.json()       - Parse as JSON (most common)
 * - response.text()       - Get as plain text
 * - response.blob()       - Get as Blob (images, files)
 * - response.arrayBuffer() - Get as ArrayBuffer (binary data)
 * - response.formData()   - Get as FormData (multipart/form-data)
 *
 * Important: Body can only be read ONCE per response
 */

console.log("\n=== Response Methods Demo ===\n");

async function demonstrateResponseMethods() {
  try {
    // JSON response (most common for APIs)
    console.log("2. response.json() - JSON parsing:");
    const jsonResponse = await fetch(`${API_BASE}/posts/1`);
    const postData = await jsonResponse.json();
    console.log("   Post title:", postData.title);
    console.log("   Post body:", postData.body.substring(0, 50) + "...");

    // Text response (for HTML, plain text, etc.)
    console.log("\n3. response.text() - Plain text:");
    const textResponse = await fetch(`${API_BASE}/posts/1`);
    const textData = await textResponse.text();
    console.log("   Raw JSON string length:", textData.length);
    console.log("   First 80 chars:", textData.substring(0, 80) + "...");

    // Blob response (for images, files)
    console.log("\n4. response.blob() - Binary data:");
    const blobResponse = await fetch(`${API_BASE}/users/1/avatar`);
    if (blobResponse.ok) {
      const blobData = await blobResponse.blob();
      console.log("   Blob size:", blobData.size, "bytes");
      console.log("   Blob type:", blobData.type);
    } else {
      console.log("   (Avatar endpoint not available, skipping blob demo)");
    }

    // Inspecting response properties
    console.log("\n5. Response properties:");
    const inspectResponse = await fetch(`${API_BASE}/posts/1`);
    console.log("   response.ok:", inspectResponse.ok);           // true if status 200-299
    console.log("   response.status:", inspectResponse.status);   // 200, 404, 500, etc.
    console.log("   response.statusText:", inspectResponse.statusText); // "OK", "Not Found"
    console.log("   response.type:", inspectResponse.type);       // "cors", "basic", "opaque"
    console.log("   response.url:", inspectResponse.url);         // Final URL after redirects
    console.log("   response.headers:", [...inspectResponse.headers.entries()].length, "headers");

  } catch (error) {
    console.error("   Error in response methods demo:", error.message);
  }
}

demonstrateResponseMethods();

// ============================================
// 3. POST/PUT/PATCH/DELETE Requests
// ============================================
/**
 * POST Requests with Request Configuration
 *
 * Request Configuration Options:
 * - method: HTTP method (GET, POST, PUT, DELETE, etc.)
 * - headers: Custom headers (Content-Type, Authorization, etc.)
 * - body: Request body (JSON, FormData, Blob, etc.)
 * - mode: CORS mode (cors, no-cors, same-origin)
 * - credentials: Include cookies (omit, same-origin, include)
 * - cache: Cache control (default, no-cache, reload, etc.)
 * - redirect: Redirect handling (follow, error, manual)
 */

console.log("\n=== HTTP Methods Demo ===\n");

// POST with JSON body
async function createPost() {
  const newPost = {
    title: "My New Post",
    body: "This is the content of my new post.",
    userId: 1
  };

  console.log("6. POST with JSON body:");
  console.log("   Sending:", JSON.stringify(newPost));

  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const created = await response.json();
    console.log("   Created post with ID:", created.id);
    console.log("   Server response:", created);
  } catch (error) {
    console.error("   POST error:", error.message);
  }
}

createPost();

// PUT request (update existing resource)
async function updatePost() {
  const updatedPost = {
    id: 1,
    title: "Updated Title",
    body: "Updated content here.",
    userId: 1
  };

  console.log("\n7. PUT request (full update):");

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPost)
    });

    const result = await response.json();
    console.log("   Updated:", result.title);
  } catch (error) {
    console.error("   PUT error:", error.message);
  }
}

updatePost();

// PATCH request (partial update)
async function patchPost() {
  const partialUpdate = {
    title: "Partially Updated Title"
  };

  console.log("\n8. PATCH request (partial update):");

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(partialUpdate)
    });

    const result = await response.json();
    console.log("   Patched:", result.title);
  } catch (error) {
    console.error("   PATCH error:", error.message);
  }
}

patchPost();

// DELETE request
async function deletePost() {
  console.log("\n9. DELETE request:");

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      method: "DELETE"
    });

    console.log("   Delete status:", response.status); // 200 or 204 (no content)
  } catch (error) {
    console.error("   DELETE error:", error.message);
  }
}

deletePost();

// ============================================
// 4. FormData File Uploads
// ============================================
/**
 * FormData - Multipart form data for file uploads
 *
 * Important:
 * - Don't set Content-Type header with FormData
 * - Browser sets it automatically with boundary
 */

console.log("\n=== FormData Upload Demo ===\n");

async function uploadWithFormData() {
  console.log("10. FormData for file uploads:");

  const formData = new FormData();
  formData.append("title", "File Upload Post");
  formData.append("body", "Content with file attachment");
  formData.append("userId", "1");
  // formData.append("file", fileInput.files[0]); // In browser with actual file

  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      body: formData
      // Note: Don't set Content-Type header with FormData
      // Browser sets it automatically with boundary
    });

    const result = await response.json();
    console.log("   FormData upload result:", result);
  } catch (error) {
    console.error("   FormData error:", error.message);
  }
}

uploadWithFormData();

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

console.log("\nPitfall 1 - Fetch doesn't reject on HTTP errors:");
console.log("❌ fetch('/404') will NOT reject - promise resolves successfully");
console.log("✅ Always check response.ok or response.status before parsing");

console.log("\nPitfall 2 - Response body can only be read once:");
console.log("❌ Calling response.json() twice throws error");
console.log("✅ Use response.clone() if you need to read multiple times");

console.log("\nPitfall 3 - Forgetting Content-Type for JSON:");
console.log("❌ POST body as JSON without Content-Type header may fail");
console.log("✅ Always set headers: { 'Content-Type': 'application/json' }");

console.log("\nPitfall 4 - Credentials not sent cross-origin:");
console.log("❌ Cookies not sent cross-origin by default");
console.log("✅ Use credentials: 'include' for cross-origin requests with cookies");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Always check response.ok or response.status");
console.log("✅ Use try/catch with async/await");
console.log("✅ Set Content-Type: application/json for JSON requests");
console.log("✅ Don't set Content-Type with FormData (browser does it)");
console.log("✅ Use credentials: 'include' when cross-origin auth needed");
console.log("⚠️ Remember: fetch only rejects on network errors, not HTTP errors");
console.log("⚠️ Response body is consumed after first read");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 30-promises.js - Promise fundamentals");
console.log("📘 31-async-await.js - Async/await patterns");
console.log("📘 33.2-fetch-error-handling.js - Error handling patterns");
console.log("📘 33.3-fetch-practical-patterns.js - Advanced patterns");
console.log("📘 33.4-fetch-streams-advanced.js - Stream API and caching");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 33-fetch-api-ts-comparison.ts
*/