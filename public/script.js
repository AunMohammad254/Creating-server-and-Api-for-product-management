// Client-side JavaScript for interacting with the Fashion Products API

document.addEventListener('DOMContentLoaded', () => {
  console.log('Fashion Products API client loaded');
  
  // Add event listeners for API testing buttons
  const testButtons = document.querySelectorAll('.test-api-btn');
  if (testButtons.length > 0) {
    testButtons.forEach(button => {
      button.addEventListener('click', handleApiTest);
    });
  }
  
  // Initialize by showing all products
  fetchAllProducts();
});

// Example function to handle API test button clicks
function handleApiTest(event) {
  const endpoint = event.target.dataset.endpoint;
  const method = event.target.dataset.method;
  
  // Get product ID from input field for operations that need it
  const productIdInput = document.getElementById('product-id');
  const productId = productIdInput ? parseInt(productIdInput.value) : 1;
  
  // Example API calls based on the button clicked
  switch(endpoint) {
    case 'get-all':
      fetchAllProducts();
      break;
    case 'get-one':
      fetchProduct(productId);
      break;
    case 'create':
      createProduct();
      break;
    case 'update':
      updateProduct(productId);
      break;
    case 'delete':
      deleteProduct(productId);
      break;
    default:
      console.log('Unknown endpoint');
  }
}

// Function to display API responses in the UI
function displayResponse(data, action) {
  const responseElement = document.getElementById('api-response');
  if (responseElement) {
    // Format the JSON with syntax highlighting
    responseElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    
    // Add a status message
    const statusElement = document.getElementById('response-status');
    if (statusElement) {
      statusElement.textContent = `${action} - ${new Date().toLocaleTimeString()}`;
      statusElement.style.display = 'block';
    }
  }
  console.log(`${action}:`, data);
}

// API functions

// Get all products
function fetchAllProducts() {
  fetch('/api/products')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayResponse(data, 'All products');
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      displayResponse({ error: 'Failed to fetch products', details: error.message }, 'Error');
    });
}

// Get a single product
function fetchProduct(id) {
  fetch(`/api/products/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayResponse(data, 'Product details');
    })
    .catch(error => {
      console.error(`Error fetching product ${id}:`, error);
      displayResponse({ error: `Failed to fetch product ${id}`, details: error.message }, 'Error');
    });
}

// Create a new product
function createProduct() {
  // Get values from form if they exist, otherwise use defaults
  const productTitle = document.getElementById('product-title') ? 
    document.getElementById('product-title').value : 'New Fashion Item';
  const productPrice = document.getElementById('product-price') ? 
    parseFloat(document.getElementById('product-price').value) : 79.99;
    
  const newProduct = {
    title: productTitle,
    description: 'A trendy new fashion item',
    price: productPrice,
    discountPercentage: 5,
    rating: 0,
    stock: 50,
    brand: 'Fashion Brand',
    category: 'clothing',
    thumbnail: 'https://example.com/thumbnail.jpg',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  };
  
  fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || `HTTP error! Status: ${response.status}`);
      });
    }
    return response.json();
  })
  .then(data => {
    displayResponse(data, 'Created product');
    // Refresh the product list
    setTimeout(fetchAllProducts, 1000);
  })
  .catch(error => {
    console.error('Error creating product:', error);
    displayResponse({ error: 'Failed to create product', details: error.message }, 'Error');
  });
}

// Update a product
function updateProduct(id) {
  // Get values from form if they exist, otherwise use defaults
  const productTitle = document.getElementById('product-title') ? 
    document.getElementById('product-title').value : 'Updated Product Name';
  const productPrice = document.getElementById('product-price') ? 
    parseFloat(document.getElementById('product-price').value) : 99.99;
    
  const updates = {
    title: productTitle,
    price: productPrice
  };
  
  fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || `HTTP error! Status: ${response.status}`);
      });
    }
    return response.json();
  })
  .then(data => {
    displayResponse(data, 'Updated product');
    // Refresh the product list
    setTimeout(fetchAllProducts, 1000);
  })
  .catch(error => {
    console.error(`Error updating product ${id}:`, error);
    displayResponse({ error: `Failed to update product ${id}`, details: error.message }, 'Error');
  });
}

// Delete a product
function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || `HTTP error! Status: ${response.status}`);
      });
    }
    return response.json();
  })
  .then(data => {
    displayResponse(data, 'Deleted product');
    // Refresh the product list
    setTimeout(fetchAllProducts, 1000);
  })
  .catch(error => {
    console.error(`Error deleting product ${id}:`, error);
    displayResponse({ error: `Failed to delete product ${id}`, details: error.message }, 'Error');
  });
}