// Fetch API - Streams & Advanced Demo
// 📘 For TypeScript comparison, see: 33.4-fetch-streams-advanced-ts-comparison.ts
//
// 📌 Part of the split Fetch API series (33.1-33.4). For the consolidated
// all-in-one version with the full Table of Contents, see: 33-fetch-api.js

// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file covers advanced Fetch topics:
// 1. Stream API - read response body incrementally
// 2. Stream patterns (progress tracking, transformation, cancellation)
// 3. Common pitfalls and their solutions
// 4. Best practices summary

// ============================================
// Table of Contents
// ============================================

// 1. Stream API Basics
// 2. Stream Patterns (Progress, Transform, Cancel, Compare)
// 3. Common Pitfalls
// 4. Best Practices Summary

// ============================================

console.log("=== Fetch API Streams & Advanced Demo ===\n");

const API_BASE = "https://jsonplaceholder.typicode.com";

// ============================================
// 1. Stream API Basics
// ============================================
/**
 * Stream API - Read response body incrementally
 *
 * Characteristics:
 * - response.body provides ReadableStream (Streams Standard, ES2017+)
 * - Read data in chunks instead of all at once (ES2017)
 * - Efficient for large files or data
 * - Low memory usage
 * - Can pause and resume reading
 *
 * Use Cases:
 * - Large file downloads
 * - Real-time data processing
 * - Progress tracking
 * - Data transformation
 */

console.log("1. Basic stream reading:");

async function readStream() {
  try {
    const response = await fetch(`${API_BASE}/posts/1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("  ✓ Stream reading complete");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      console.log(`  Received chunk: ${value.length} bytes`);
    }

    console.log(`  Total size: ${result.length} bytes`);
  } catch (error) {
    console.error("  Stream error:", error.message);
  }
}

readStream();

// ============================================
// 2. Stream Patterns
// ============================================

// 2.1 Download with progress tracking
console.log("\n2. Download with progress tracking:");

async function downloadWithProgress(url, onProgress) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const total = parseInt(contentLength || "0", 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress) {
        const percent = total ? Math.round((loaded / total) * 100) : 0;
        onProgress(loaded, total, percent);
        console.log(`  Progress: ${loaded}/${total || "?"} bytes (${percent}%)`);
      }
    }

    // Combine chunks
    const result = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    console.log("  ✓ Download complete");
    return result;
  } catch (error) {
    console.error("  Download error:", error.message);
    throw error;
  }
}

setTimeout(() => {
  downloadWithProgress(`${API_BASE}/posts/1`);
}, 2000);

// 2.2 Stream transformation
console.log("\n3. Stream transformation:");

async function transformStream() {
  try {
    const response = await fetch(`${API_BASE}/posts/1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let lineCount = 0;
    let charCount = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("  ✓ Stream processing complete");
        console.log(`  Lines: ${lineCount}, Characters: ${charCount}`);
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      charCount += chunk.length;

      const newlines = chunk.split("\n").length - 1;
      lineCount += newlines;

      console.log(`  Processed ${chunk.length} characters`);
    }
  } catch (error) {
    console.error("  Transform error:", error.message);
  }
}

setTimeout(() => {
  transformStream();
}, 3000);

// 2.3 Cancelable stream reading
console.log("\n4. Cancelable stream reading:");

async function cancelableStream() {
  const controller = new AbortController();

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    let byteCount = 0;

    console.log("  Starting to read stream...");

    // Cancel after 30ms
    setTimeout(() => {
      console.log("  Cancelling stream...");
      controller.abort("User cancelled");
    }, 30);

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("  Stream completed naturally");
          break;
        }

        byteCount += value.length;
        console.log(`  Read ${value.length} bytes`);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`  ✓ Stream cancelled after ${byteCount} bytes`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("  Error:", error.message);
    }
  }
}

setTimeout(() => {
  cancelableStream();
}, 4000);

// 2.4 Stream vs non-stream comparison
console.log("\n5. Stream vs non-stream comparison:");

async function compareReadingMethods() {
  // Method 1: Read entire response at once
  console.log("  Method 1: Read all at once");
  const start1 = Date.now();
  const response1 = await fetch(`${API_BASE}/posts/1`);
  const data1 = await response1.json();
  const time1 = Date.now() - start1;
  console.log(`    Time: ${time1}ms, Size: ~${JSON.stringify(data1).length} bytes`);

  // Method 2: Read as stream
  console.log("\n  Method 2: Read as stream");
  const start2 = Date.now();
  const response2 = await fetch(`${API_BASE}/posts/1`);
  const reader2 = response2.body.getReader();
  let byteCount = 0;

  while (true) {
    const { done, value } = await reader2.read();
    if (done) break;
    byteCount += value.length;
  }

  const time2 = Date.now() - start2;
  console.log(`    Time: ${time2}ms, Size: ${byteCount} bytes`);

  console.log("\n  Comparison:");
  console.log(`    Non-stream: ${time1}ms`);
  console.log(`    Stream: ${time2}ms`);
  console.log("    Streams are better for large files, real-time processing");
}

setTimeout(() => {
  compareReadingMethods();
}, 5000);

// 2.5 Stream best practices
console.log("\n6. Stream API Best Practices:");
console.log("  ✅ Use streams for large files (>1MB)");
console.log("  ✅ Implement progress tracking for user feedback");
console.log("  ✅ Use TextDecoder for text streams");
console.log("  ✅ Handle AbortError for cancellation");
console.log("  ✅ Combine chunks properly at the end");
console.log("  ✅ Use { stream: true } in TextDecoder");
console.log("  ⚠️ Don't forget to call reader.releaseLock() when done");
console.log("  ⚠️ Remember response.body can only be read once");

// ============================================
// 3. Common Pitfalls
// ============================================
/**
 * Common Pitfalls and Solutions
 *
 * 1. No automatic rejection on HTTP errors (404/500)
 * 2. CORS issues in browser
 * 3. Credentials (cookies) not sent by default
 * 4. Forgetting Content-Type header for JSON
 * 5. Memory leaks from unclosed responses
 * 6. Mixing callbacks with async/await
 */

console.log("\n=== Common Pitfalls ===\n");

// Pitfall 1: Assuming fetch rejects on 404
console.log("7. Pitfall: fetch doesn't reject on 404:");

fetch(`${API_BASE}/posts/999999`)
  .then(response => {
    console.log("   Response received (even for 404!):", response.status);
    return response.json();
  })
  .then(data => {
    console.log("   Data (empty object from 404):", data);
  })
  .catch(error => {
    console.error("   This won't run for 404! Only network errors:", error.message);
  });

// Pitfall 2: CORS issues (browser only)
console.log("\n8. CORS note:");
console.log("   - CORS is a browser security feature");
console.log("   - Server must include Access-Control-Allow-Origin header");
console.log("   - For development: use proxy or disable CORS");
console.log("   - In Node.js, CORS is not an issue");

// Pitfall 3: Credentials not sent by default
async function pitfallCredentials() {
  console.log("\n9. Credentials (cookies) note:");

  const withoutCredentials = await fetch(`${API_BASE}/posts/1`);
  console.log("   Default credentials ('same-origin'): cookies sent to same origin");

  const withCredentials = await fetch(`${API_BASE}/posts/1`, {
    credentials: "include",
  });
  console.log("   With credentials: 'include', cookies ARE sent to any origin");
}

pitfallCredentials();

// Pitfall 4: Forgetting Content-Type
console.log("\n10. Content-Type header:");

fetch(`${API_BASE}/posts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Content-Type Test" }),
})
  .then(r => r.json())
  .then(d => console.log("   With Content-Type:", d.id));

// Pitfall 5: Not closing response body (memory leak)
console.log("\n11. Memory leak from unclosed responses:");
console.log("   - Always consume response body (json(), text(), etc.)");
console.log("   - Or explicitly clone and ignore: response.clone()");

async function pitfallMemoryLeak() {
  // GOOD: Body consumed
  const goodResponse = await fetch(`${API_BASE}/posts/1`);
  await goodResponse.json(); // Body consumed, connection can be reused

  // BAD: Body not consumed (in long-running apps)
  const badResponse = await fetch(`${API_BASE}/posts/1`);
  // Forgot to consume body - connection stays open
  console.log("   Always consume response body to avoid memory leaks");
}

pitfallMemoryLeak();

// ============================================
// 4. Best Practices Summary
// ============================================
/**
 * Fetch API Best Practices
 *
 * 1. Always check response.ok or response.status
 * 2. Use async/await for cleaner code
 * 3. Handle errors with try/catch
 * 4. Use AbortController for cancellable requests
 * 5. Set Content-Type header for JSON POST/PUT/PATCH
 * 6. Use credentials: 'include' for cross-origin with auth
 * 7. Always consume response body (prevent memory leaks)
 * 8. Use Promise.all for parallel requests
 * 9. Implement retry logic for flaky networks
 * 10. Create API wrapper for consistent error handling
 */

console.log("\n=== Best Practices Summary ===\n");

console.log(`
Fetch API Best Practices:
-------------------------
1. Always check response.ok - fetch doesn't reject on HTTP errors
2. Use async/await for cleaner, more readable code
3. Wrap fetch calls in try/catch for error handling
4. Use AbortController for cancellable requests (e.g., on unmount)
5. Set 'Content-Type: application/json' for JSON bodies
6. Use credentials: 'include' for cross-origin requests with cookies
7. Always consume response body (json(), text()) to prevent memory leaks
8. Use Promise.all for parallel requests, not sequential awaits
9. Implement retry logic with exponential backoff for resilience
10. Create API wrapper classes for consistent error handling

Stream API Best Practices:
-------------------------
11. Use streams for large files (>1MB) to save memory
12. Implement progress tracking for user feedback
13. Use TextDecoder for text processing of streams
14. Handle AbortError for cancellation
15. Always clean up resources (reader.releaseLock())
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 33.1-fetch-basics.js - Fetch basics and HTTP methods");
console.log("📘 33.2-fetch-error-handling.js - Error handling and async/await");
console.log("📘 33.3-fetch-practical-patterns.js - Advanced patterns and AbortController");
console.log("📘 30-promises.js - Promise fundamentals");
console.log("📘 31-async-await.js - Async/await patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 33.4-fetch-streams-advanced-ts-comparison.ts
*/
