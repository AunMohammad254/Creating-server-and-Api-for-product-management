/**
 * Fashion Products API Client
 * 
 * Client-side JavaScript for interacting with the Fashion Products API.
 * This script provides a user-friendly interface for testing all CRUD operations
 * including GET, POST, PUT, and DELETE requests.
 * 
 * @author Your Name
 * @version 1.0.0
 * @description Frontend client for Fashion Products API testing
 */

// API Configuration
const API_BASE = 'http://localhost:3000';
const API_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Global error handler for uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  displayResponse({
    error: 'Unhandled Promise Rejection',
    message: event.reason?.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  }, 'Global Error Handler', true);
  
  // Prevent the default browser behavior
  event.preventDefault();
});

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught error:', event.error);
  displayResponse({
    error: 'Uncaught Exception',
    message: event.error?.message || event.message || 'An unexpected error occurred',
    filename: event.filename,
    lineno: event.lineno,
    timestamp: new Date().toISOString()
  }, 'Global Error Handler', true);
});

/**
 * Button Loading State Management
 * @description Manages loading states for API test buttons
 * @param {HTMLElement} button - The button element to manage
 * @param {boolean} isLoading - Whether to set loading state
 */
function setButtonLoading(button, isLoading) {
  if (!button) return;
  
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Loading...';
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent.replace('Loading...', 'Test');
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    delete button.dataset.originalText;
  }
}

/**
 * DOM Content Loaded Event Handler
 * @description Initializes the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Fashion Products API client loaded successfully');
  console.log('📅 Loaded at:', new Date().toISOString());
  
  // Handle favicon 404 error by creating a default one
  handleFavicon();
  
  // Initialize event listeners for API testing buttons
  initializeEventListeners();
  
  // Check server connectivity before loading data
  checkServerConnectivity()
    .then(() => {
      // Load initial data to display all products
      return fetchAllProducts();
    })
    .catch((error) => {
      console.warn('⚠️ Server connectivity check failed:', error.message);
      displayResponse({
        error: 'Server Connection Failed',
        message: 'Unable to connect to the API server. Please ensure the server is running on localhost:3000',
        details: error.message,
        timestamp: new Date().toISOString()
      }, 'Connection Error', true);
    });
  
  // Add form validation listeners
  initializeFormValidation();
});

/**
 * Handle Favicon 404 Error
 * @description Creates a default favicon to prevent 404 errors
 */
function handleFavicon() {
  try {
    // Check if favicon already exists
    const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    
    if (!existingFavicon) {
      // Create a simple SVG favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      favicon.href = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <rect width="32" height="32" fill="#3498db"/>
          <text x="16" y="20" font-family="Arial" font-size="16" fill="white" text-anchor="middle">API</text>
        </svg>
      `);
      document.head.appendChild(favicon);
      console.log('✅ Default favicon created successfully');
    }
  } catch (error) {
    console.warn('⚠️ Failed to create favicon:', error.message);
  }
}

/**
 * Check Server Connectivity
 * @description Verifies that the API server is running and accessible
 * @returns {Promise} Promise that resolves if server is accessible
 */
function checkServerConnectivity() {
  console.log('🔍 Checking server connectivity...');
  
  return fetchWithTimeout(`${API_BASE}/api/products`, {
    method: 'HEAD',
    headers: {
      'Accept': 'application/json'
    }
  }, 5000)
    .then(response => {
      if (response.ok) {
        console.log('✅ Server connectivity confirmed');
        return true;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    })
    .catch(error => {
      console.error('❌ Server connectivity check failed:', error);
      throw new Error(`Cannot connect to API server: ${error.message}`);
    });
}

/**
 * Initialize Event Listeners
 * @description Sets up event listeners for all interactive elements
 */
function initializeEventListeners() {
  // Add event listeners for API testing buttons
  const testButtons = document.querySelectorAll('.test-api-btn');
  if (testButtons.length > 0) {
    testButtons.forEach(button => {
      button.addEventListener('click', handleApiTest);
    });
    console.log(`✅ Initialized ${testButtons.length} API test buttons`);
  } else {
    console.warn('⚠️ No API test buttons found');
  }
}

/**
 * Initialize Form Validation
 * @description Sets up real-time form validation for input fields
 */
function initializeFormValidation() {
  const priceInput = document.getElementById('product-price');
  const titleInput = document.getElementById('product-title');
  const idInput = document.getElementById('product-id');
  
  // Validate price input
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 0) {
        e.target.style.borderColor = '#e74c3c';
        e.target.title = 'Price must be a positive number';
      } else {
        e.target.style.borderColor = '#2ecc71';
        e.target.title = '';
      }
    });
  }
  
  // Validate title input
  if (titleInput) {
    titleInput.addEventListener('input', (e) => {
      if (e.target.value.trim() === '') {
        e.target.style.borderColor = '#e74c3c';
        e.target.title = 'Title cannot be empty';
      } else {
        e.target.style.borderColor = '#2ecc71';
        e.target.title = '';
      }
    });
  }
  
  // Validate ID input
  if (idInput) {
    idInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (isNaN(value) || value <= 0) {
        e.target.style.borderColor = '#e74c3c';
        e.target.title = 'ID must be a positive number';
      } else {
        e.target.style.borderColor = '#2ecc71';
        e.target.title = '';
      }
    });
  }
}

/**
 * API Test Button Click Handler
 * @description Handles clicks on API testing buttons and routes to appropriate functions
 * @param {Event} event - The click event from the button
 */
function handleApiTest(event) {
  const endpoint = event.target.dataset.endpoint;
  const method = event.target.dataset.method;
  
  // Log the action for debugging
  console.log(`🔄 API Test: ${method} ${endpoint}`);
  
  // Set button to loading state to prevent multiple clicks
  const button = event.target;
  setButtonLoading(button, true);
  
  // Re-enable button after a delay
  const enableButton = () => {
    setTimeout(() => {
      setButtonLoading(button, false);
    }, 1000);
  };
  
  try {
    // Get product ID from input field for operations that need it
    const productIdInput = document.getElementById('product-id');
    const productId = productIdInput ? parseInt(productIdInput.value) : 1;
    
    // Validate product ID for operations that require it
    if (['get-one', 'update', 'delete'].includes(endpoint)) {
      if (isNaN(productId) || productId <= 0) {
        displayResponse({
          error: 'Invalid Product ID',
          message: 'Please enter a valid positive number for Product ID',
          received: productIdInput ? productIdInput.value : 'undefined'
        }, 'Validation Error');
        enableButton();
        return;
      }
    }
    
    // Route to appropriate API function based on endpoint
    switch(endpoint) {
      case 'get-all':
        fetchAllProducts().finally(enableButton);
        break;
      case 'get-one':
        fetchProduct(productId).finally(enableButton);
        break;
      case 'create':
        createProduct().finally(enableButton);
        break;
      case 'update':
        updateProduct(productId).finally(enableButton);
        break;
      case 'delete':
        deleteProduct(productId).finally(enableButton);
        break;
      default:
        console.error('❌ Unknown endpoint:', endpoint);
        displayResponse({
          error: 'Unknown Endpoint',
          message: `The endpoint '${endpoint}' is not recognized`,
          availableEndpoints: ['get-all', 'get-one', 'create', 'update', 'delete']
        }, 'Client Error');
        enableButton();
    }
  } catch (error) {
    console.error('❌ Error in handleApiTest:', error);
    displayResponse({
      error: 'Client Error',
      message: error.message,
      stack: error.stack
    }, 'Client Error');
    enableButton();
  }
}

/**
 * Display API Response in UI
 * @description Formats and displays API responses in the response panel with enhanced validation and formatting
 * @param {Object|Array} data - The response data to display
 * @param {string} action - Description of the action performed
 * @param {boolean} isError - Whether this is an error response
 */
function displayResponse(data, action, isError = false) {
  try {
    const responseElement = document.getElementById('api-response');
    const statusElement = document.getElementById('response-status');
    
    if (!responseElement) {
      console.warn('⚠️ Response element not found in DOM');
      return;
    }
    
    // Validate and clean response data
    let displayData = data;
    if (data === null || data === undefined) {
      displayData = { message: 'No data received', timestamp: new Date().toISOString() };
    }
    
    // Enhanced data formatting with better error handling
    let formattedJson;
    try {
      // Handle different data types
      if (typeof displayData === 'string') {
        try {
          // Try to parse if it's a JSON string
          displayData = JSON.parse(displayData);
        } catch {
          // Keep as string if not valid JSON
        }
      }
      
      // Clean up circular references and functions
      const cleanData = JSON.parse(JSON.stringify(displayData, (key, value) => {
        if (typeof value === 'function') {
          return '[Function]';
        }
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack
          };
        }
        return value;
      }));
      
      // Add metadata for error responses
      if (isError && typeof cleanData === 'object') {
        cleanData.responseMetadata = {
          displayedAt: new Date().toISOString(),
          errorType: action,
          userAgent: navigator.userAgent,
          url: window.location.href
        };
      }
      
      formattedJson = JSON.stringify(cleanData, null, 2);
    } catch (formatError) {
      console.warn('Error formatting response data:', formatError);
      formattedJson = `Error formatting data: ${formatError.message}\n\nRaw data: ${String(displayData)}`;
    }
    
    // Create syntax-highlighted HTML
    const highlightedJson = syntaxHighlightJson(formattedJson);
    
    // Update the response display
    responseElement.innerHTML = `<pre class="json-response ${isError ? 'error' : 'success'}">${highlightedJson}</pre>`;
    
    // Update status message with timestamp and styling
    if (statusElement) {
      const timestamp = new Date().toLocaleTimeString();
      statusElement.textContent = `${action} - ${timestamp}`;
      statusElement.style.display = 'block';
      statusElement.className = isError ? 'error-status' : 'success-status';
    }
    
    // Scroll to response area for better UX with improved positioning
    responseElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest',
      inline: 'nearest'
    });
    
    // Log to console with appropriate level
    if (isError) {
      console.error(`❌ ${action}:`, displayData);
    } else {
      console.log(`✅ ${action}:`, displayData);
    }
    
  } catch (error) {
    console.error('❌ Error displaying response:', error);
    // Enhanced fallback display
    const responseElement = document.getElementById('api-response');
    if (responseElement) {
      const fallbackData = {
        error: 'Display Error',
        message: `Failed to display response: ${error.message}`,
        originalAction: action,
        timestamp: new Date().toISOString()
      };
      responseElement.innerHTML = `<pre class="json-response error">${JSON.stringify(fallbackData, null, 2)}</pre>`;
    }
  }
}

/**
 * Apply Syntax Highlighting to JSON
 * @description Adds basic syntax highlighting to JSON strings
 * @param {string} json - The JSON string to highlight
 * @returns {string} HTML string with syntax highlighting
 */
function syntaxHighlightJson(json) {
  // Basic JSON syntax highlighting
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
    .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}

/**
 * API FUNCTIONS
 * These functions handle all HTTP requests to the Fashion Products API
 */

/**
 * Fetch with Timeout and Retry Logic
 * @description Enhanced fetch function with timeout and retry capabilities
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} retries - Number of retry attempts
 * @returns {Promise} Promise that resolves with the response
 */
function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    // Add abort signal to options
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };

    const attemptFetch = (attempt) => {
      fetch(url, fetchOptions)
        .then(response => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          
          // Check if we should retry
          if (attempt < retries && (error.name === 'AbortError' || error.message.includes('fetch'))) {
            console.warn(`⚠️ Fetch attempt ${attempt + 1} failed, retrying in ${RETRY_DELAY}ms...`);
            setTimeout(() => {
              attemptFetch(attempt + 1);
            }, RETRY_DELAY * attempt); // Exponential backoff
          } else {
            reject(error);
          }
        });
    };

    attemptFetch(0);
  });
}

/**
 * Validate API Endpoint URL
 * @description Validates that the API endpoint URL is properly formatted
 * @param {string} endpoint - The endpoint to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateApiEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    console.error('❌ Invalid API endpoint URL:', endpoint);
    return false;
  }
}

/**
 * Fetch All Products
 * @description Retrieves all products from the API with enhanced error handling
 * @returns {Promise} Promise that resolves when the request completes
 */
function fetchAllProducts() {
  console.log('📥 Fetching all products...');
  
  const endpoint = `${API_BASE}/api/products`;
  
  // Validate endpoint URL
  if (!validateApiEndpoint(endpoint)) {
    const error = new Error('Invalid API endpoint URL');
    displayResponse({
      error: 'Invalid Endpoint',
      message: error.message,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }
  
  return fetchWithTimeout(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // Try to get error details from response
        return response.text().then(text => {
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { message: text || response.statusText };
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response data received');
      }
      
      console.log(`✅ Successfully fetched ${data.total || 0} products`);
      displayResponse(data, 'All Products Retrieved');
      return data;
    })
    .catch(error => {
      console.error('❌ Error fetching products:', error);
      
      let errorMessage = error.message;
      let errorType = 'Fetch Error';
      
      // Categorize error types
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorType = 'Timeout Error';
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorType = 'Network Error';
        errorMessage = 'Network error occurred. Please check if the server is running.';
      }
      
      displayResponse({
        error: errorType,
        message: errorMessage,
        originalError: error.message,
        timestamp: new Date().toISOString(),
        endpoint: '/api/products',
        method: 'GET',
        troubleshooting: [
          'Ensure the API server is running on localhost:3000',
          'Check your network connection',
          'Verify CORS settings if making cross-origin requests'
        ]
      }, errorType, true);
      throw error;
    });
}

/**
 * Fetch Single Product
 * @description Retrieves a specific product by ID from the API with enhanced error handling
 * @param {number} id - The product ID to fetch
 * @returns {Promise} Promise that resolves when the request completes
 */
function fetchProduct(id) {
  console.log(`📥 Fetching product with ID: ${id}`);
  
  // Validate product ID
  if (!id || isNaN(id) || id <= 0) {
    const error = new Error('Invalid product ID provided');
    displayResponse({
      error: 'Invalid Product ID',
      message: error.message,
      providedId: id,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }
  
  const endpoint = `${API_BASE}/api/products/${id}`;
  
  // Validate endpoint URL
  if (!validateApiEndpoint(endpoint)) {
    const error = new Error('Invalid API endpoint URL');
    displayResponse({
      error: 'Invalid Endpoint',
      message: error.message,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }
  
  return fetchWithTimeout(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // Try to get error message from response
        return response.text().then(text => {
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { message: text || response.statusText };
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response data received');
      }
      
      console.log(`✅ Successfully fetched product: ${data.title || 'Unknown'}`);
      displayResponse(data, `Product ${id} Details`);
      return data;
    })
    .catch(error => {
      console.error(`❌ Error fetching product ${id}:`, error);
      
      let errorMessage = error.message;
      let errorType = 'Fetch Error';
      
      // Categorize error types
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorType = 'Timeout Error';
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorType = 'Network Error';
        errorMessage = 'Network error occurred. Please check if the server is running.';
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        errorType = 'Product Not Found';
        errorMessage = `Product with ID ${id} was not found.`;
      }
      
      displayResponse({
        error: errorType,
        message: errorMessage,
        originalError: error.message,
        productId: id,
        timestamp: new Date().toISOString(),
        endpoint: `/api/products/${id}`,
        method: 'GET',
        troubleshooting: [
          'Verify the product ID is correct',
          'Ensure the API server is running on localhost:3000',
          'Check if the product exists in the database'
        ]
      }, errorType, true);
      throw error;
    });
}

/**
 * Create New Product
 * @description Creates a new product by sending a POST request to the API
 * @returns {Promise} Promise that resolves when the request completes
 */
function createProduct() {
  console.log('📝 Creating new product...');
  
  // Get values from form inputs with fallback defaults
  const titleInput = document.getElementById('product-title');
  const priceInput = document.getElementById('product-price');
  
  const productTitle = titleInput ? titleInput.value.trim() : 'New Fashion Item';
  const productPrice = priceInput ? parseFloat(priceInput.value) : 79.99;
  
  // Client-side validation
  const validationErrors = [];
  
  if (!productTitle || productTitle.length < 2) {
    validationErrors.push('Product title must be at least 2 characters long');
  }
  
  if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
    validationErrors.push('Product price must be a valid number greater than 0');
  } else if (productPrice > 999999) {
    validationErrors.push('Product price cannot exceed $999,999');
  }
  
  if (validationErrors.length > 0) {
    console.warn('⚠️ Validation errors:', validationErrors);
    displayResponse({
      error: 'Validation Failed',
      errors: validationErrors,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(new Error('Validation failed'));
  }
  
  // Prepare comprehensive product data
  const newProduct = {
    title: productTitle,
    description: `High-quality ${productTitle.toLowerCase()} perfect for fashion enthusiasts`,
    price: productPrice,
    discountPercentage: 5,
    rating: 0,
    stock: 50,
    brand: 'Fashion Brand',
    category: 'clothing',
    thumbnail: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Fashion+Item',
    images: [
      'https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Image+1',
      'https://via.placeholder.com/600x600/4ECDC4/FFFFFF?text=Image+2'
    ]
  };
  
  console.log('📤 Sending product data:', newProduct);
  
  const endpoint = `${API_BASE}/api/products`;
  
  // Validate endpoint URL
  if (!validateApiEndpoint(endpoint)) {
    const error = new Error('Invalid API endpoint URL');
    displayResponse({
      error: 'Invalid Endpoint',
      message: error.message,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }

  return fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
  .then(response => {
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      return response.text().then(text => {
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || response.statusText };
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    // Validate response data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data received');
    }
    
    console.log('✅ Product created successfully:', data);
    displayResponse(data, 'Product Created Successfully');
    
    // Clear form inputs if they exist
    if (titleInput) {
      titleInput.value = '';
      titleInput.style.borderColor = '';
    }
    if (priceInput) {
      priceInput.value = '';
      priceInput.style.borderColor = '';
    }
    
    // Refresh the product list after a short delay
    console.log('🔄 Refreshing product list...');
    setTimeout(() => {
      fetchAllProducts().catch(err => {
        console.warn('Failed to refresh product list:', err.message);
      });
    }, 1000);
    
    return data;
  })
  .catch(error => {
    console.error('❌ Error creating product:', error);
    
    let errorMessage = error.message;
    let errorType = 'Creation Error';
    
    // Categorize error types
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorType = 'Timeout Error';
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      errorType = 'Network Error';
      errorMessage = 'Network error occurred. Please check if the server is running.';
    } else if (error.message.includes('400') || error.message.includes('validation')) {
      errorType = 'Validation Error';
      errorMessage = 'Product data validation failed. Please check your input.';
    }
    
    displayResponse({
      error: errorType,
      message: errorMessage,
      originalError: error.message,
      productData: newProduct,
      timestamp: new Date().toISOString(),
      endpoint: '/api/products',
      method: 'POST',
      troubleshooting: [
        'Verify all required fields are filled correctly',
        'Ensure the API server is running on localhost:3000',
        'Check that product data meets validation requirements'
      ]
    }, errorType, true);
    throw error;
  });
}

/**
 * Update Product
 * @description Updates an existing product by sending a PUT request to the API
 * @param {number} id - The ID of the product to update
 * @returns {Promise} Promise that resolves when the request completes
 */
function updateProduct(id) {
  console.log(`📝 Updating product with ID: ${id}`);
  
  // Validate product ID
  if (!id || isNaN(id) || id <= 0) {
    const error = 'Invalid product ID provided for update';
    console.error('❌', error);
    displayResponse({
      error: 'Invalid Product ID',
      message: error,
      providedId: id,
      timestamp: new Date().toISOString()
    }, 'Update Error', true);
    return Promise.reject(new Error(error));
  }
  
  // Get values from form inputs with fallback defaults
  const titleInput = document.getElementById('product-title');
  const priceInput = document.getElementById('product-price');
  
  const productTitle = titleInput ? titleInput.value.trim() : 'Updated Product Name';
  const productPrice = priceInput ? parseFloat(priceInput.value) : 99.99;
  
  // Client-side validation
  const validationErrors = [];
  
  if (productTitle && productTitle.length < 2) {
    validationErrors.push('Product title must be at least 2 characters long');
  }
  
  if (productPrice && (isNaN(productPrice) || productPrice <= 0)) {
    validationErrors.push('Product price must be a valid number greater than 0');
  } else if (productPrice && productPrice > 999999) {
    validationErrors.push('Product price cannot exceed $999,999');
  }
  
  if (validationErrors.length > 0) {
    console.warn('⚠️ Validation errors:', validationErrors);
    displayResponse({
      error: 'Validation Failed',
      errors: validationErrors,
      productId: id,
      timestamp: new Date().toISOString()
    }, 'Update Validation Error', true);
    return Promise.reject(new Error('Validation failed'));
  }
  
  // Prepare update data (only include non-empty values)
  const updates = {};
  if (productTitle && productTitle !== 'Updated Product Name') {
    updates.title = productTitle;
  }
  if (productPrice && productPrice !== 99.99) {
    updates.price = productPrice;
  }
  
  // Check if there are any updates to make
  if (Object.keys(updates).length === 0) {
    const message = 'No valid updates provided';
    console.warn('⚠️', message);
    displayResponse({
      error: 'No Updates',
      message: message,
      productId: id,
      timestamp: new Date().toISOString()
    }, 'Update Warning', true);
    return Promise.reject(new Error(message));
  }
  
  console.log('📤 Sending update data:', updates);
  
  const endpoint = `${API_BASE}/api/products/${id}`;
  
  // Validate endpoint URL
  if (!validateApiEndpoint(endpoint)) {
    const error = new Error('Invalid API endpoint URL');
    displayResponse({
      error: 'Invalid Endpoint',
      message: error.message,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }

  return fetchWithTimeout(endpoint, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
  .then(response => {
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      return response.text().then(text => {
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || response.statusText };
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    // Validate response data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data received');
    }
    
    console.log('✅ Product updated successfully:', data);
    displayResponse(data, `Product ${id} Updated Successfully`);
    
    // Clear form inputs if they exist
    if (titleInput) {
      titleInput.value = '';
      titleInput.style.borderColor = '';
    }
    if (priceInput) {
      priceInput.value = '';
      priceInput.style.borderColor = '';
    }
    
    // Refresh the product list after a short delay
    console.log('🔄 Refreshing product list...');
    setTimeout(() => {
      fetchAllProducts().catch(err => {
        console.warn('Failed to refresh product list:', err.message);
      });
    }, 1000);
    
    return data;
  })
  .catch(error => {
    console.error(`❌ Error updating product ${id}:`, error);
    
    let errorMessage = error.message;
    let errorType = 'Update Error';
    
    // Categorize error types
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorType = 'Timeout Error';
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      errorType = 'Network Error';
      errorMessage = 'Network error occurred. Please check if the server is running.';
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      errorType = 'Product Not Found';
      errorMessage = `Product with ID ${id} was not found.`;
    } else if (error.message.includes('400') || error.message.includes('validation')) {
      errorType = 'Validation Error';
      errorMessage = 'Product update data validation failed. Please check your input.';
    }
    
    displayResponse({
      error: errorType,
      message: errorMessage,
      originalError: error.message,
      productId: id,
      updateData: updates,
      timestamp: new Date().toISOString(),
      endpoint: `/api/products/${id}`,
      method: 'PUT',
      troubleshooting: [
        'Verify the product ID exists',
        'Check that update data is valid',
        'Ensure the API server is running on localhost:3000'
      ]
    }, errorType, true);
    throw error;
  });
}

/**
 * Delete Product
 * @description Deletes a product by sending a DELETE request to the API
 * @param {number} id - The ID of the product to delete
 * @returns {Promise} Promise that resolves when the request completes
 */
function deleteProduct(id) {
  console.log(`🗑️ Deleting product with ID: ${id}`);
  
  // Enhanced validation for product ID
  if (!id) {
    const errorMsg = 'Product ID is required for deletion';
    console.error('❌ Missing product ID');
    displayResponse({ error: errorMsg, hint: 'Please enter a product ID in the input field' }, 'Validation Error');
    return Promise.reject(new Error(errorMsg));
  }
  
  if (isNaN(id)) {
    const errorMsg = 'Product ID must be a valid number';
    console.error('❌ Invalid product ID format:', id);
    displayResponse({ error: errorMsg, hint: 'Please enter a numeric product ID (e.g., 1, 2, 3)' }, 'Validation Error');
    return Promise.reject(new Error(errorMsg));
  }
  
  if (id <= 0) {
    const errorMsg = 'Product ID must be a positive number';
    console.error('❌ Invalid product ID value:', id);
    displayResponse({ error: errorMsg, hint: 'Product IDs start from 1' }, 'Validation Error');
    return Promise.reject(new Error(errorMsg));
  }
  
  // Show confirmation dialog for destructive action (skip in test mode)
  const isTestMode = window.location.search.includes('test=true') || window.testMode === true;
  let confirmDelete = true;
  
  if (!isTestMode) {
    confirmDelete = confirm(`Are you sure you want to delete product ${id}? This action cannot be undone.`);
  }
  
  if (!confirmDelete) {
    console.log('🚫 Product deletion cancelled by user');
    displayResponse({
      message: 'Product deletion cancelled by user',
      productId: id,
      timestamp: new Date().toISOString()
    }, 'Delete Cancelled');
    return Promise.resolve({ cancelled: true });
  }
  
  console.log('📤 Sending delete request...');
  
  const endpoint = `${API_BASE}/api/products/${id}`;
  
  // Validate endpoint URL
  if (!validateApiEndpoint(endpoint)) {
    const error = new Error('Invalid API endpoint URL');
    displayResponse({
      error: 'Invalid Endpoint',
      message: error.message,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    }, 'Validation Error', true);
    return Promise.reject(error);
  }

  return fetchWithTimeout(endpoint, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      return response.text().then(text => {
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || response.statusText };
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      });
    }
    
    // Handle empty response for successful deletion
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return { message: `Product ${id} deleted successfully`, id: id };
    }
  })
  .then(data => {
    // Validate response data
    if (!data || typeof data !== 'object') {
      data = { message: `Product ${id} deleted successfully`, id: id };
    }
    
    console.log('✅ Product deleted successfully:', data);
    displayResponse(data, `Product ${id} Deleted Successfully`);
    
    // Refresh the product list after a short delay
    console.log('🔄 Refreshing product list...');
    setTimeout(() => {
      fetchAllProducts().catch(err => {
        console.warn('Failed to refresh product list:', err.message);
      });
    }, 1000);
    
    return data;
  })
  .catch(error => {
    console.error(`❌ Error deleting product ${id}:`, error);
    
    let errorMessage = error.message;
    let errorType = 'Delete Error';
    let troubleshooting = 'Please try again or contact support if the problem persists.';
    
    // Enhanced error handling with specific messages and recovery suggestions
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorType = 'Timeout Error';
      errorMessage = 'Delete request timed out after 10 seconds';
      troubleshooting = 'The server is taking too long to respond. Please check server status and try again.';
    } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      errorType = 'Network Error';
      errorMessage = 'Network connection failed';
      troubleshooting = 'Please check your internet connection, ensure the server is running on http://localhost:3000, and verify firewall settings.';
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      errorType = 'Product Not Found';
      errorMessage = `Product with ID ${id} does not exist`;
      troubleshooting = 'The product may have already been deleted, or the ID is incorrect. Use "Get All Products" to see available products.';
    } else if (error.message.includes('403') || error.message.includes('forbidden')) {
      errorType = 'Permission Error';
      errorMessage = 'Access denied for delete operation';
      troubleshooting = 'You may not have sufficient permissions to delete this product. Contact your administrator.';
    } else if (error.message.includes('500')) {
      errorType = 'Server Error';
      errorMessage = 'Server error occurred during deletion';
      troubleshooting = 'There was an internal server error. Please try again later or contact support.';
    } else if (error.message.includes('429')) {
      errorType = 'Rate Limit Error';
      errorMessage = 'Too many requests - rate limit exceeded';
      troubleshooting = 'Please wait a moment before trying again. The server is temporarily limiting requests.';
    }
    
    displayResponse({
      error: errorType,
      message: errorMessage,
      originalError: error.message,
      productId: id,
      timestamp: new Date().toISOString(),
      endpoint: `/api/products/${id}`,
      method: 'DELETE',
      troubleshooting: troubleshooting,
      detailedSteps: [
        'Verify the product ID exists',
        'Check if the product has already been deleted',
        'Ensure the API server is running on localhost:3000',
        'Verify you have permission to delete products',
        'Check browser console for additional error details'
      ]
    }, errorType, true);
    throw error;
  });
}