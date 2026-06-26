// Fetch API Demo
// 📘 For TypeScript comparison, see: 33-fetch-api-ts-comparison.ts

// ============================================
// 1. FETCH API BASICS
// ============================================

/**
 * Fetch API - Modern interface for making HTTP requests
 *
 * ES Specification: ES6 (Promise), Fetch Standard (living standard)
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
 * - Real-time data polling
 *
 * Common Pitfalls:
 * - Forgetting response.ok check (404/500 won't throw)
 * - Not awaiting response.json() (it's async)
 * - CORS configuration issues
 * - Credentials not sent by default
 */

console.log("=== Fetch API Basics Demo ===\n");

// Basic fetch GET request (returns Promise<Response>)
// Note: fetch is globally available in Node.js 18+ and all modern browsers.
// For browser, fetch is always available.

// Simple GET request
console.log("1. Basic GET Request:");

const API_BASE = "https://jsonplaceholder.typicode.com";

// Method 1: Using Promise chains (matches file 30-promises.js style)
fetch(`${API_BASE}/posts/1`)
  .then(response => {
    console.log("   Response received, status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Returns Promise<object>
  })
  .then(data => {
    console.log("   Fetched post:", data.title);
  })
  .catch(error => {
    console.error("   Fetch error:", error.message);
  });

// ============================================
// 2. RESPONSE HANDLING METHODS
// ============================================

/**
 * Response Body Methods - All return Promises
 *
 * - response.json()   - Parse as JSON (most common)
 * - response.text()   - Get as plain text
 * - response.blob()   - Get as Blob (images, files)
 * - response.arrayBuffer() - Get as ArrayBuffer (binary data)
 * - response.formData() - Get as FormData (multipart/form-data)
 *
 * Important: Body can only be read ONCE per response
 */

console.log("\n=== Response Methods Demo ===\n");

// Helper to demonstrate different response methods
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
// 3. POST REQUESTS AND CONFIGURATION
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

console.log("\n=== POST Request Demo ===\n");

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

// FormData for file uploads
async function uploadWithFormData() {
  console.log("\n10. FormData for file uploads:");

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
// 4. ERROR HANDLING
// ============================================

/**
 * Error Handling Patterns
 *
 * Important: Fetch ONLY rejects on:
 * - Network failure (no internet, DNS failure)
 * - CORS blocking
 * - Request blocked by browser
 *
 * Fetch does NOT reject on:
 * - HTTP 404 Not Found
 * - HTTP 500 Internal Server Error
 * - Any HTTP error status
 *
 * Always check response.ok or response.status!
 */

console.log("\n=== Error Handling Demo ===\n");

// Pattern 1: Check response.ok manually
async function handleErrorPattern1() {
  console.log("11. Manual response.ok check:");

  try {
    const response = await fetch(`${API_BASE}/posts/99999`); // Non-existent

    if (!response.ok) {
      // This is the correct way to handle HTTP errors
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("   Data:", data);
  } catch (error) {
    console.error("   Caught error:", error.message);
  }
}

handleErrorPattern1();

// Pattern 2: Handle network errors separately
async function handleErrorPattern2() {
  console.log("\n12. Separate network vs HTTP errors:");

  try {
    const response = await fetch(`${API_BASE}/invalid-endpoint`);

    if (response.status === 404) {
      console.log("   Resource not found (404)");
      return null;
    }

    if (response.status >= 500) {
      console.log("   Server error (5xx)");
      throw new Error("Server error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error or CORS
      console.error("   Network error:", error.message);
    } else {
      console.error("   HTTP error:", error.message);
    }
  }
}

handleErrorPattern2();

// Pattern 3: Timeout with Promise.race
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([fetch(url), timeoutPromise]);
}

async function handleTimeout() {
  console.log("\n13. Timeout pattern with Promise.race:");

  try {
    // Using a slow endpoint simulation
    const response = await fetchWithTimeout(`${API_BASE}/posts/1`, 10000);
    const data = await response.json();
    console.log("   Fetched within timeout:", data.id);
  } catch (error) {
    console.error("   Timeout or fetch error:", error.message);
  }
}

handleTimeout();

// Pattern 4: Error propagation in chains
async function errorPropagation() {
  console.log("\n14. Error propagation in chains:");

  fetch(`${API_BASE}/posts/1`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("   Chain step 1 - got data");
      return data.title;
    })
    .then(title => {
      console.log("   Chain step 2 - got title:", title);
      // Simulate an error in the chain
      throw new Error("Intentional chain error");
    })
    .catch(error => {
      console.error("   Caught in .catch():", error.message);
      // Can return fallback value
      return "Fallback title";
    })
    .then(result => {
      console.log("   Chain continues after catch:", result);
    })
    .finally(() => {
      console.log("   Finally: cleanup happens here");
    });
}

errorPropagation();

// ============================================
// 5. ASYNC/AWAIT WITH FETCH
// ============================================

/**
 * Async/Await with Fetch - Clean, readable syntax
 *
 * Benefits over Promise chains:
 * - Looks synchronous, easier to read
 * - Try/catch for error handling
 * - Easier debugging with breakpoints
 * - Better for complex conditional logic
 *
 * Note: See file 31-async-await.js for detailed async/await patterns
 */

console.log("\n=== Async/Await with Fetch Demo ===\n");

// Clean async/await fetch function
async function fetchPostClean(postId) {
  const response = await fetch(`${API_BASE}/posts/${postId}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

async function demonstrateAsyncAwait() {
  console.log("15. Clean async/await syntax:");

  try {
    const post = await fetchPostClean(1);
    console.log("   Fetched post:", post.title);
  } catch (error) {
    console.error("   Error:", error.message);
  }
}

demonstrateAsyncAwait();

// Sequential vs Parallel fetches
async function sequentialVsParallel() {
  console.log("\n16. Sequential vs Parallel fetches:");

  // Sequential (slower - waits for each request)
  console.log("   Sequential approach:");
  const startSeq = Date.now();

  try {
    const post1 = await fetch(`${API_BASE}/posts/1`).then(r => r.json());
    const post2 = await fetch(`${API_BASE}/posts/2`).then(r => r.json());
    const post3 = await fetch(`${API_BASE}/posts/3`).then(r => r.json());

    const endSeq = Date.now();
    console.log("   Sequential time:", endSeq - startSeq, "ms");
    console.log("   Got posts:", post1.id, post2.id, post3.id);
  } catch (error) {
    console.error("   Sequential error:", error.message);
  }

  // Parallel (faster - all requests start together)
  console.log("\n   Parallel approach (Promise.all):");
  const startPar = Date.now();

  try {
    const [post1, post2, post3] = await Promise.all([
      fetch(`${API_BASE}/posts/1`).then(r => r.json()),
      fetch(`${API_BASE}/posts/2`).then(r => r.json()),
      fetch(`${API_BASE}/posts/3`).then(r => r.json())
    ]);

    const endPar = Date.now();
    console.log("   Parallel time:", endPar - startPar, "ms");
    console.log("   Got posts:", post1.id, post2.id, post3.id);
  } catch (error) {
    console.error("   Parallel error:", error.message);
  }
}

sequentialVsParallel();

// ============================================
// 6. PRACTICAL PATTERNS
// ============================================

/**
 * Practical Fetch Patterns
 *
 * - API wrapper functions with base URL and defaults
 * - Retry logic with exponential backoff
 * - AbortController for cancellation
 * - Request caching/deduplication
 * - Sequential dependent API calls
 */

console.log("\n=== Practical Patterns Demo ===\n");

// Pattern 1: API wrapper with defaults
const createApiClient = (baseURL, defaultHeaders = {}) => {
  return {
    async get(endpoint, options = {}) {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...defaultHeaders,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },

    async post(endpoint, data, options = {}) {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...defaultHeaders,
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }
  };
};

async function useApiClient() {
  console.log("17. API client wrapper:");

  const api = createApiClient(API_BASE, {
    "X-Custom-Header": "MyApp/1.0"
  });

  try {
    const posts = await api.get("/posts/1");
    console.log("   Via API client:", posts.title);

    const created = await api.post("/posts", {
      title: "New Post",
      body: "Post content",
      userId: 1
    });
    console.log("   Created via API client, ID:", created.id);
  } catch (error) {
    console.error("   API client error:", error.message);
  }
}

useApiClient();

// Pattern 2: Retry with exponential backoff
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Server errors (5xx) might be temporary, retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error;

      // Network errors might be temporary, retry
      if (error instanceof TypeError) {
        // Network error, will retry
      }
    }

    if (attempt < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`   Retry attempt ${attempt}/${maxRetries}, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

async function demonstrateRetry() {
  console.log("\n18. Retry with exponential backoff:");

  try {
    // This should succeed on first try
    const data = await fetchWithRetry(`${API_BASE}/posts/1`, {}, 3);
    console.log("   Fetched with retry logic:", data.id);
  } catch (error) {
    console.error("   All retries exhausted:", error.message);
  }
}

demonstrateRetry();

// Pattern 3: AbortController for cancellation (DETAILED)
console.log("\n19. AbortController Deep Dive:");

/**
 * AbortController & AbortSignal - Cancel async operations
 * 
 * ES Specification: DOM Standard (living standard)
 * 
 * Characteristics:
 * - Cancel fetch requests
 * - Cancel multiple operations with one signal
 * - Timeout implementation
 * - Event-based cancellation
 * - Works with any API that accepts AbortSignal
 * 
 * Use Cases:
 * - Search-as-you-type (cancel previous requests)
 * - Component unmount cleanup
 * - Timeout implementation
 * - User-initiated cancellation
 * - Race conditions prevention
 */

// Basic AbortController usage
async function basicAbortExample() {
  console.log("\n19.1 Basic AbortController:");
  
  const controller = new AbortController();
  const signal = controller.signal;
  
  // Listen for abort event
  signal.addEventListener('abort', () => {
    console.log("   Signal aborted, reason:", signal.reason);
  });
  
  try {
    const fetchPromise = fetch(`${API_BASE}/posts/1`, { signal });
    
    // Abort after 100ms
    setTimeout(() => {
      controller.abort('Timeout after 100ms');
    }, 100);
    
    const response = await fetchPromise;
    const data = await response.json();
    console.log("   Completed before abort:", data.id);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✓ Request was aborted");
      console.log("   Abort reason:", signal.reason);
    } else {
      console.error("   Fetch error:", error.message);
    }
  }
}

basicAbortExample();

// Timeout implementation with AbortController
function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const { signal: originalSignal, ...restOptions } = options;
  
  // Combine with existing signal if provided
  if (originalSignal) {
    originalSignal.addEventListener('abort', () => {
      controller.abort(originalSignal.reason);
    });
  }
  
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Request timeout after ${timeoutMs}ms`));
  }, timeoutMs);
  
  return fetch(url, {
    ...restOptions,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function demonstrateTimeout() {
  console.log("\n19.2 Timeout with AbortController:");
  
  try {
    const response = await fetchWithTimeout(`${API_BASE}/posts/1`, {}, 10000);
    const data = await response.json();
    console.log("   ✓ Fetched within timeout:", data.id);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✗ Request timed out");
    } else {
      console.error("   Error:", error.message);
    }
  }
}

demonstrateTimeout();

// Cancel multiple operations with one signal
async function cancelMultipleOperations() {
  console.log("\n19.3 Cancel multiple operations:");
  
  const controller = new AbortController();
  const { signal } = controller;
  
  try {
    // Start multiple requests with same signal
    const requests = [
      fetch(`${API_BASE}/posts/1`, { signal }),
      fetch(`${API_BASE}/posts/2`, { signal }),
      fetch(`${API_BASE}/posts/3`, { signal })
    ];
    
    // Cancel all after 50ms
    setTimeout(() => {
      console.log("   Aborting all requests...");
      controller.abort('User cancelled');
    }, 50);
    
    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(r => r.json()));
    console.log("   ✓ All completed:", data.map(d => d.id));
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✓ All requests cancelled");
    }
  }
}

cancelMultipleOperations();

// Search-as-you-type pattern
class SearchController {
  constructor() {
    this.currentController = null;
  }
  
  async search(query) {
    // Cancel previous search
    if (this.currentController) {
      this.currentController.abort('New search started');
    }
    
    // Create new controller for this search
    this.currentController = new AbortController();
    const { signal } = this.currentController;
    
    try {
      const response = await fetch(`${API_BASE}/posts?q=${query}`, { signal });
      const results = await response.json();
      return results;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`   Search for "${query}" was cancelled`);
        return null;
      }
      throw error;
    }
  }
}

async function demonstrateSearchAsYouType() {
  console.log("\n19.4 Search-as-you-type pattern:");
  
  const searchController = new SearchController();
  
  // Simulate rapid typing
  searchController.search('java');      // Will be cancelled
  searchController.search('javasc');    // Will be cancelled
  const results = await searchController.search('javascript'); // Final search
  
  if (results) {
    console.log("   ✓ Search completed for: javascript");
  }
}

demonstrateSearchAsYouType();

// React component cleanup pattern
console.log("\n19.5 React component cleanup pattern:");
console.log(`
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`, { signal });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch user:', error);
        }
      }
    }
    
    fetchUser();
    
    // Cleanup: abort on unmount or userId change
    return () => {
      controller.abort('Component unmounted');
    };
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
`);

// Combining multiple AbortSignals
function combineSignals(...signals) {
  const controller = new AbortController();
  
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    
    signal.addEventListener('abort', () => {
      controller.abort(signal.reason);
    }, { once: true });
  }
  
  return controller.signal;
}

async function demonstrateCombinedSignals() {
  console.log("\n19.6 Combining multiple signals:");
  
  const userController = new AbortController();
  const timeoutController = new AbortController();
  
  // Timeout after 5 seconds
  setTimeout(() => {
    timeoutController.abort('Timeout');
  }, 5000);
  
  const combinedSignal = combineSignals(
    userController.signal,
    timeoutController.signal
  );
  
  try {
    // User cancels immediately
    setTimeout(() => {
      userController.abort('User cancelled');
    }, 10);
    
    const response = await fetch(`${API_BASE}/posts/1`, {
      signal: combinedSignal
    });
    const data = await response.json();
    console.log("   ✓ Completed:", data.id);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("   ✓ Cancelled by:", combinedSignal.reason);
    }
  }
}

demonstrateCombinedSignals();

// AbortSignal.timeout() - Modern API (DOM Standard, not ES specification)
async function demonstrateSignalTimeout() {
  console.log("\n19.7 AbortSignal.timeout() (Modern):");
  
  try {
    // Modern browsers support AbortSignal.timeout()
    if (typeof AbortSignal.timeout === 'function') {
      const response = await fetch(`${API_BASE}/posts/1`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      const data = await response.json();
      console.log("   ✓ Fetched with timeout:", data.id);
    } else {
      console.log("   AbortSignal.timeout() not supported");
      console.log("   Use fetchWithTimeout() helper instead");
    }
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.log("   ✗ Request timed out");
    }
  }
}

demonstrateSignalTimeout();

// AbortSignal.any() - DEPRECATED/withdrawn
// NOTE: AbortSignal.any() was removed from the spec due to web compatibility issues.
// Do not use. Use the combineSignals helper above instead.
console.log("\n19.8 AbortSignal.any() (Deprecated - Do Not Use):");
console.log(`
// WARNING: AbortSignal.any() was withdrawn from the spec.
// Use the combineSignals helper function (above) instead:
const combinedSignal = combineSignals(userController.signal, AbortSignal.timeout(5000));

fetch(url, { signal: combinedSignal });
// Aborts when ANY signal aborts
`);

// Best practices
console.log("\n19.9 AbortController Best Practices:");
console.log("  ✅ Always handle AbortError separately");
console.log("  ✅ Cancel previous requests in search/autocomplete");
console.log("  ✅ Clean up on component unmount (React/Vue)");
console.log("  ✅ Implement timeouts for all network requests");
console.log("  ✅ Provide meaningful abort reasons");
console.log("  ✅ Use AbortSignal.timeout() when available");
console.log("  ✅ Combine signals for complex cancellation logic");
console.log("  ⚠️ Don't reuse AbortController (create new for each operation)");
console.log("  ⚠️ Remember to clear timeouts in finally blocks");
console.log("  ⚠️ Check signal.aborted before starting operations\n");

// Pattern 4: Sequential dependent API calls
async function sequentialDependentCalls() {
  console.log("\n20. Sequential dependent API calls:");

  try {
    // First, get a user
    const user = await fetch(`${API_BASE}/users/1`).then(r => r.json());
    console.log("   Got user:", user.name);

    // Then, get posts by that user
    const userPosts = await fetch(`${API_BASE}/posts?userId=${user.id}`).then(r => r.json());
    console.log("   User has", userPosts.length, "posts");

    // Get comments on first post
    if (userPosts.length > 0) {
      const comments = await fetch(`${API_BASE}/posts/${userPosts[0].id}/comments`).then(r => r.json());
      console.log("   First post has", comments.length, "comments");
    }
  } catch (error) {
    console.error("   Sequential calls error:", error.message);
  }
}

sequentialDependentCalls();

// ============================================
// 8. STREAM API (ADVANCED)
// ============================================

/**
 * Stream API - Read response body incrementally
 *
 * ES Specification: Streams API (living standard)
 *
 * Characteristics:
 * - response.body provides ReadableStream
 * - Read data in chunks instead of all at once
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

console.log("\n=== Stream API Demo ===\n");

// Basic stream reading
async function readStream() {
  console.log("21. Basic stream reading:");

  try {
    const response = await fetch(`${API_BASE}/posts/1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("  ✓ Stream reading complete");
        break;
      }

      // Decode chunk
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

// Stream with progress tracking
async function downloadWithProgress(url, onProgress) {
  console.log("\n22. Download with progress tracking:");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress) {
        const percent = total ? Math.round((loaded / total) * 100) : 'unknown';
        console.log(`  Progress: ${loaded}/${total || '?'} bytes (${percent}%)`);
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
  downloadWithProgress(`${API_BASE}/posts/1`, (loaded, total, percent) => {
    // Progress callback
  });
}, 2000);

// Stream transformation
async function transformStream() {
  console.log("\n23. Stream transformation:");

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

      // Count newlines (simplified)
      const newlines = chunk.split('\n').length - 1;
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

// Cancelable stream reading
async function cancelableStream() {
  console.log("\n24. Cancelable stream reading:");

  const controller = new AbortController();

  try {
    const response = await fetch(`${API_BASE}/posts/1`, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    let byteCount = 0;

    console.log("  Starting to read stream...");

    // Cancel after 50ms
    setTimeout(() => {
      console.log("  Cancelling stream...");
      controller.abort('User cancelled');
    }, 50);

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
      if (error.name === 'AbortError') {
        console.log(`  ✓ Stream cancelled after ${byteCount} bytes`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("  Error:", error.message);
    }
  }
}

setTimeout(() => {
  cancelableStream();
}, 4000);

// Stream vs non-stream comparison
async function compareReadingMethods() {
  console.log("\n25. Stream vs non-stream comparison:");

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

// Stream best practices
console.log("\n26. Stream API Best Practices:");
console.log("  ✅ Use streams for large files (>1MB)");
console.log("  ✅ Implement progress tracking for user feedback");
console.log("  ✅ Use TextDecoder for text streams");
console.log("  ✅ Handle AbortError for cancellation");
console.log("  ✅ Combine chunks properly at the end");
console.log("  ✅ Use { stream: true } in TextDecoder");
console.log("  ✅ Clean up resources in finally blocks");
console.log("  ⚠️ Don't forget to call reader.releaseLock() when done");
console.log("  ⚠️ Remember response.body can only be read once");
console.log("  ⚠️ Streams are not supported in very old browsers");

// ============================================
// 9. COMMON PITFALLS
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

console.log("\n=== Common Pitfalls Demo ===\n");

// Pitfall 1: Assuming fetch rejects on 404
async function pitfall_404() {
  console.log("21. Pitfall: fetch doesn't reject on 404:");

  // WRONG: This won't catch 404!
  fetch(`${API_BASE}/posts/999999`)
    .then(response => {
      console.log("   Response received (even for 404!):", response.status);
      // response.ok is false, but Promise is resolved!
      return response.json();
    })
    .then(data => {
      console.log("   Data (empty object from 404):", data);
    })
    .catch(error => {
      // This only catches network errors, not 404!
      console.error("   This won't run for 404!");
    });
}

pitfall_404();

// Pitfall 2: CORS issues (browser only)
console.log("\n22. CORS note:");
console.log("   - CORS is a browser security feature");
console.log("   - Server must include Access-Control-Allow-Origin header");
console.log("   - For development: use proxy or disable CORS");
console.log("   - In Node.js, CORS is not an issue");

// Pitfall 3: Credentials not sent by default
async function pitfall_credentials() {
  console.log("\n23. Credentials (cookies) note:");

  // Without credentials, cookies/auth headers not sent to same origin
  const withoutCredentials = await fetch(`${API_BASE}/posts/1`, {
    // credentials: 'include' // Need this to send cookies
  });
  console.log("   Without credentials option, cookies NOT sent");

  // With credentials
  const withCredentials = await fetch(`${API_BASE}/posts/1`, {
    credentials: "include" // Send cookies for cross-origin requests
  });
  console.log("   With credentials: 'include', cookies ARE sent");
}

pitfall_credentials();

// Pitfall 4: Forgetting Content-Type
async function pitfall_contentType() {
  console.log("\n24. Content-Type header:");

  // WRONG: Server won't parse body as JSON
  await fetch(`${API_BASE}/posts`, {
    method: "POST",
    body: JSON.stringify({ title: "Test" })
    // Missing: Content-Type: application/json
  }).then(r => r.json()).then(d => console.log("   Without Content-Type:", d));

  // CORRECT: Server knows it's JSON
  await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test" })
  }).then(r => r.json()).then(d => console.log("   With Content-Type:", d.id));
}

// pitfall_contentType(); // Commented to avoid duplicate POST

// Pitfall 5: Not closing response body (memory leak)
async function pitfall_memoryLeak() {
  console.log("\n25. Memory leak from unclosed responses:");
  console.log("   - Always consume response body (json(), text(), etc.)");
  console.log("   - Or explicitly clone and ignore: response.clone()");

  // GOOD: Body consumed
  const goodResponse = await fetch(`${API_BASE}/posts/1`);
  await goodResponse.json(); // Body consumed, connection can be reused

  // BAD: Body not consumed (in long-running apps)
  const badResponse = await fetch(`${API_BASE}/posts/1`);
  // Forgot to consume body - connection stays open
  console.log("   Always consume response body to avoid memory leaks");
}

pitfall_memoryLeak();

// ============================================
// 8. BEST PRACTICES SUMMARY
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
 *
 * Related Files:
 * - 30-promises.js: Promise fundamentals
 * - 31-async-await.js: Async/await patterns
 * - 32-modules.js: Module organization for API clients
 */

console.log("\n=== Best Practices Summary ===");
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

See also:
- 30-promises.js: Promise fundamentals and Promise.all/race/allSettled
- 31-async-await.js: Async/await syntax and error handling
- 32-modules.js: Organizing API clients as modules
`);

// ============================================
// 9. CACHE API INTEGRATION
// ============================================
/**
 * Cache API — Store Request/Response pairs for offline and performance
 *
 * Part of the Service Worker API but also available in window context.
 * Stores Request → Response mappings for programmatic caching.
 *
 * Key methods:
 * - caches.open(name): Open (or create) a named cache
 * - cache.put(request, response): Store a response
 * - cache.match(request): Find a matching cached response
 * - cache.add(url): Fetch + store (shortcut)
 * - cache.addAll(urls): Fetch + store multiple
 * - cache.delete(request): Remove from cache
 * - cache.keys(): List all cached requests
 * - caches.delete(name): Delete entire cache
 * - caches.keys(): List all cache names
 */

console.log("\n=== 9. Cache API Integration ===");

console.log(`
// Cache API is available in window and Service Worker contexts

// Open a cache (creates if doesn't exist)
const myCache = await caches.open('api-cache-v1');

// Fetch and cache pattern — network-first with cache fallback
async function fetchWithCache(url) {
  try {
    // Try network first
    const response = await fetch(url);
    // Cache the fresh response (clone because body can only be read once)
    const cache = await caches.open('dynamic-cache');
    cache.put(url, response.clone());
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(url);
    if (cachedResponse) {
      console.log('Serving from cache:', url);
      return cachedResponse;
    }
    throw new Error('Network failed and no cache available');
  }
}

// Cache-first pattern — check cache first, fall back to network
async function cacheFirst(url) {
  const cached = await caches.match(url);
  if (cached) return cached;

  const response = await fetch(url);
  const cache = await caches.open('static-cache');
  cache.put(url, response.clone());
  return response;
}

// Pre-cache resources (typically in Service Worker install event)
// const cache = await caches.open('app-shell-v1');
// await cache.addAll([
//   '/',
//   '/styles/main.css',
//   '/scripts/app.js',
//   '/images/logo.png'
// ]);

// Clean up old caches (version management)
const cacheNames = await caches.keys();
for (const name of cacheNames) {
  if (name !== 'api-cache-v2') {
    await caches.delete(name); // Remove outdated caches
    console.log('Deleted old cache:', name);
  }
}

// Check cache size
const cache = await caches.open('api-cache-v1');
const keys = await cache.keys();
console.log('Cached entries:', keys.length);

// Cache API vs other storage:
// - localStorage: synchronous, string-only, 5-10MB, simple key-value
// - IndexedDB: async, structured data, large capacity, complex API
// - Cache API: async, Request/Response pairs, designed for HTTP caching
// - Best for: API responses, static assets, offline support
`);


// ============================================
// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPED RESPONSE DATA
   JS:  const post = await fetch(url).then(r => r.json());
   TS:  interface Post { id: number; title: string; }
        const post = await fetch(url).then(r => r.json()) as Post;

   Benefits:
   - Type-safe response data
   - Better IDE autocomplete
   - Compile-time error checking

2. GENERIC FETCH WRAPPER
   JS:  async function fetchApi(url) {
          const response = await fetch(url);
          return await response.json();
        }
   TS:  async function fetchApi<T>(url: string): Promise<T> {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json() as T;
        }

   Benefits:
   - Type-safe generic functions
   - Reusable typed API client
   - Better type inference

3. REQUEST OPTIONS TYPES
   JS:  const options = { method: 'POST', body: data };
   TS:  const options: RequestInit = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };

   Benefits:
   - Type-safe request options
   - Catches header typos
   - Validated body types

4. RESPONSE TYPE GUARDS
   JS:  if (response.ok) { // handle success }
   TS:  function isSuccess(response: Response): response is Response & { ok: true } {
          return response.ok;
        }

   Benefits:
   - Narrow response types
   - Better type safety
   - Explicit error handling

5. ERROR TYPE UNIONS
   JS:  try { await fetch(url); } catch (error) { // handle error }
   TS:  type FetchError = NetworkError | HttpError | ParseError;
        catch (error: unknown) {
          if (error instanceof Error) { // handle }
        }

   Benefits:
   - Type-safe error handling
   - Better error categorization
   - Explicit error types

6. TYPED API CLIENT CLASS
   JS:  class ApiClient {
          async get(endpoint) { // fetch and return }
          async post(endpoint, data) { // fetch and return }
        }
   TS:  class ApiClient {
          async get<T>(endpoint: string): Promise<T> { // fetch and return }
          async post<T>(endpoint: string, data: unknown): Promise<T> { // fetch and return }
        }

   Benefits:
   - Type-safe API methods
   - Generic response types
   - Better IDE support

⚠️ COMMON CONFUSION POINTS:

1. RESPONSE BODY CAN ONLY BE READ ONCE
   - Use response.clone() if you need to read multiple times
   - Or store the parsed result

2. AS CAST VS TYPE ASSERTION
   - Both work but have different syntax
   - const data = await response.json() as Post;
   - const data = <Post>await response.json();

3. MIXING JS AND TS FETCH CODE
   - Type assertions don't change runtime behavior
   - Still need proper error handling
   - TypeScript only catches compile-time errors

📘 See 33-fetch-api-ts-comparison.ts for detailed examples!
*/
