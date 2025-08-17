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

/**
 * DOM Content Loaded Event Handler
 * @description Initializes the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Fashion Products API client loaded successfully');
  console.log('📅 Loaded at:', new Date().toISOString());
  
  // Initialize event listeners for API testing buttons
  initializeEventListeners();
  
  // Load initial data to display all products
  fetchAllProducts();
  
  // Add form validation listeners
  initializeFormValidation();
});

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
  
  // Disable button during request to prevent multiple clicks
  const button = event.target;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Loading...';
  
  // Re-enable button after a delay
  const enableButton = () => {
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
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
 * @description Formats and displays API responses in the response panel
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
    
    // Format the JSON with proper indentation and syntax highlighting
    const formattedJson = JSON.stringify(data, null, 2);
    
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
    
    // Scroll to response area for better UX
    responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Log to console with appropriate level
    if (isError) {
      console.error(`❌ ${action}:`, data);
    } else {
      console.log(`✅ ${action}:`, data);
    }
    
  } catch (error) {
    console.error('❌ Error displaying response:', error);
    // Fallback display
    const responseElement = document.getElementById('api-response');
    if (responseElement) {
      responseElement.innerHTML = `<pre class="json-response error">Error displaying response: ${error.message}</pre>`;
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
 * Fetch All Products
 * @description Retrieves all products from the API
 * @returns {Promise} Promise that resolves when the request completes
 */
function fetchAllProducts() {
  console.log('📥 Fetching all products...');
  
  return fetch(`${API_BASE}/api/products`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(`✅ Successfully fetched ${data.total || 0} products`);
      displayResponse(data, 'All Products Retrieved');
      return data;
    })
    .catch(error => {
      console.error('❌ Error fetching products:', error);
      displayResponse({
        error: 'Failed to fetch products',
        message: error.message,
        timestamp: new Date().toISOString(),
        endpoint: '/api/products',
        method: 'GET'
      }, 'Fetch Error', true);
      throw error;
    });
}

/**
 * Fetch Single Product
 * @description Retrieves a specific product by ID from the API
 * @param {number} id - The product ID to fetch
 * @returns {Promise} Promise that resolves when the request completes
 */
function fetchProduct(id) {
  console.log(`📥 Fetching product with ID: ${id}`);
  
  return fetch(`${API_BASE}/api/products/${id}`, {
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
        return response.json().then(errorData => {
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }).catch(() => {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log(`✅ Successfully fetched product: ${data.title || 'Unknown'}`);
      displayResponse(data, `Product ${id} Details`);
      return data;
    })
    .catch(error => {
      console.error(`❌ Error fetching product ${id}:`, error);
      displayResponse({
        error: `Failed to fetch product ${id}`,
        message: error.message,
        productId: id,
        timestamp: new Date().toISOString(),
        endpoint: `/api/products/${id}`,
        method: 'GET'
      }, 'Fetch Error', true);
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
  
  return fetch(`${API_BASE}/api/products`, {
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
      return response.json().then(errorData => {
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }).catch(() => {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ Product created successfully:', data);
    displayResponse(data, 'Product Created Successfully');
    
    // Clear form inputs if they exist
    if (titleInput) titleInput.value = '';
    if (priceInput) priceInput.value = '';
    
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
    displayResponse({
      error: 'Failed to create product',
      message: error.message,
      productData: newProduct,
      timestamp: new Date().toISOString(),
      endpoint: '/api/products',
      method: 'POST'
    }, 'Creation Error', true);
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
  
  return fetch(`${API_BASE}/api/products/${id}`, {
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
      return response.json().then(errorData => {
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }).catch(() => {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ Product updated successfully:', data);
    displayResponse(data, `Product ${id} Updated Successfully`);
    
    // Clear form inputs if they exist
    if (titleInput) titleInput.value = '';
    if (priceInput) priceInput.value = '';
    
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
    displayResponse({
      error: `Failed to update product ${id}`,
      message: error.message,
      productId: id,
      updateData: updates,
      timestamp: new Date().toISOString(),
      endpoint: `/api/products/${id}`,
      method: 'PUT'
    }, 'Update Error', true);
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
  
  // Validate product ID
  if (!id || isNaN(id) || id <= 0) {
    const error = 'Invalid product ID provided for deletion';
    console.error('❌', error);
    displayResponse({
      error: 'Invalid Product ID',
      message: error,
      providedId: id,
      timestamp: new Date().toISOString()
    }, 'Delete Error', true);
    return Promise.reject(new Error(error));
  }
  
  // Show confirmation dialog for destructive action
  const confirmDelete = confirm(`Are you sure you want to delete product ${id}? This action cannot be undone.`);
  
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
  
  return fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      return response.json().then(errorData => {
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }).catch(() => {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
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
    displayResponse({
      error: `Failed to delete product ${id}`,
      message: error.message,
      productId: id,
      timestamp: new Date().toISOString(),
      endpoint: `/api/products/${id}`,
      method: 'DELETE'
    }, 'Delete Error', true);
    throw error;
  });
}