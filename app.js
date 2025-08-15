/**
 * Fashion Products API Server
 * 
 * A RESTful API server built with Express.js that provides CRUD operations
 * for fashion products. This server includes comprehensive data validation,
 * error handling, and a web interface for testing API endpoints.
 * 
 * @author Aun Abbas
 * @version 1.0.0
 * @description RESTful API for fashion products with CRUD operations
 */

// Import required modules
const express = require('express');
const path = require('path');

// Initialize Express application
const app = express();

// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * MIDDLEWARE CONFIGURATION
 * Configure Express middleware for request parsing and static file serving
 */

// Parse JSON request bodies (with size limit for security)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
// This allows serving HTML, CSS, JS files directly
app.use(express.static(path.join(__dirname, 'public')));

/**
 * IN-MEMORY DATA STORAGE
 * 
 * Note: In a production environment, this should be replaced with a proper
 * database (MongoDB, PostgreSQL, MySQL, etc.). This in-memory storage is
 * only suitable for development and testing purposes.
 * 
 * Each product follows a consistent schema with the following properties:
 * - id: Unique identifier (number)
 * - title: Product name (string, required)
 * - description: Product description (string)
 * - price: Product price (number, required)
 * - discountPercentage: Discount percentage (number, 0-100)
 * - rating: Product rating (number, 0-5)
 * - stock: Available quantity (number, >= 0)
 * - brand: Product brand (string)
 * - category: Product category (string)
 * - thumbnail: Main product image URL (string)
 * - images: Array of additional image URLs (array of strings)
 */
let products = [
  {
    id: 1,
    title: "Classic Denim Jacket",
    description: "A timeless denim jacket that never goes out of style",
    price: 59.99,
    discountPercentage: 10.5,
    rating: 4.8,
    stock: 45,
    brand: "Levi's",
    category: "clothing",
    thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/1/1.jpg",
      "https://i.dummyjson.com/data/products/1/2.jpg",
      "https://i.dummyjson.com/data/products/1/3.jpg"
    ]
  },
  {
    id: 2,
    title: "Designer Handbag",
    description: "Elegant designer handbag with premium leather finish",
    price: 129.99,
    discountPercentage: 15,
    rating: 4.6,
    stock: 20,
    brand: "Michael Kors",
    category: "accessories",
    thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/2/1.jpg",
      "https://i.dummyjson.com/data/products/2/2.jpg"
    ]
  },
  {
    id: 3,
    title: "Running Shoes",
    description: "Lightweight running shoes with cushioned soles",
    price: 89.99,
    discountPercentage: 5,
    rating: 4.5,
    stock: 30,
    brand: "Nike",
    category: "footwear",
    thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/3/1.jpg",
      "https://i.dummyjson.com/data/products/3/2.jpg",
      "https://i.dummyjson.com/data/products/3/3.jpg"
    ]
  },
  {
    id: 4,
    title: "Summer Dress",
    description: "Light and flowy summer dress with floral pattern",
    price: 45.99,
    discountPercentage: 12,
    rating: 4.7,
    stock: 25,
    brand: "Zara",
    category: "clothing",
    thumbnail: "https://i.dummyjson.com/data/products/4/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/4/1.jpg",
      "https://i.dummyjson.com/data/products/4/2.jpg"
    ]
  },
  {
    id: 5,
    title: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots",
    price: 35.99,
    discountPercentage: 8,
    rating: 4.4,
    stock: 50,
    brand: "Fossil",
    category: "accessories",
    thumbnail: "https://i.dummyjson.com/data/products/5/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/5/1.jpg"
    ]
  }
];

/**
 * ROUTE HANDLERS
 * Define all API endpoints and their corresponding handlers
 */

/**
 * Root Route - Serve Landing Page
 * @route GET /
 * @description Serves the main HTML page with API documentation and testing interface
 * @access Public
 */
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get All Products
 * @route GET /api/products
 * @description Retrieve all products with pagination-like response format
 * @access Public
 * @returns {Object} Response object containing products array and metadata
 */
app.get('/api/products', (req, res) => {
  try {
    // In a real application, you might want to implement actual pagination
    // Query parameters like ?page=1&limit=10 could be supported here
    const response = {
      products,
      total: products.length,
      skip: 0,
      limit: products.length,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get Single Product by ID
 * @route GET /api/products/:id
 * @description Retrieve a specific product by its unique identifier
 * @access Public
 * @param {string} id - Product ID (must be a valid number)
 * @returns {Object} Product object or error message
 */
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Validate ID parameter - must be a positive integer
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ 
        message: 'Invalid product ID. ID must be a positive number.',
        received: req.params.id
      });
    }
    
    // Find product in the products array
    const product = products.find(p => p.id === id);
    
    // Handle product not found
    if (!product) {
      return res.status(404).json({ 
        message: `Product with ID ${id} not found`,
        availableIds: products.map(p => p.id)
      });
    }
    
    // Return the found product
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Create New Product
 * @route POST /api/products
 * @description Create a new product with comprehensive validation
 * @access Public
 * @param {Object} req.body - Product data
 * @param {string} req.body.title - Product title (required)
 * @param {number} req.body.price - Product price (required)
 * @param {string} [req.body.description] - Product description
 * @param {number} [req.body.discountPercentage] - Discount percentage (0-100)
 * @param {number} [req.body.rating] - Product rating (0-5)
 * @param {number} [req.body.stock] - Available stock (>= 0)
 * @param {string} [req.body.brand] - Product brand
 * @param {string} [req.body.category] - Product category
 * @param {string} [req.body.thumbnail] - Thumbnail image URL
 * @param {Array} [req.body.images] - Array of image URLs
 * @returns {Object} Created product object
 */
app.post('/api/products', (req, res) => {
  try {
    const newProduct = req.body;
    
    // Validate required fields
    if (!newProduct.title || newProduct.title.trim() === '') {
      return res.status(400).json({ 
        message: 'Title is required and cannot be empty',
        field: 'title'
      });
    }
    
    if (newProduct.price === undefined || newProduct.price === null) {
      return res.status(400).json({ 
        message: 'Price is required',
        field: 'price'
      });
    }
    
    // Validate data types and ranges
    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ 
        message: 'Price must be a valid positive number',
        field: 'price',
        received: newProduct.price
      });
    }
    
    // Validate optional fields
    if (newProduct.stock !== undefined) {
      const stock = parseInt(newProduct.stock);
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ 
          message: 'Stock must be a valid non-negative integer',
          field: 'stock',
          received: newProduct.stock
        });
      }
    }
    
    if (newProduct.discountPercentage !== undefined) {
      const discount = parseFloat(newProduct.discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return res.status(400).json({ 
          message: 'Discount percentage must be a number between 0 and 100',
          field: 'discountPercentage',
          received: newProduct.discountPercentage
        });
      }
    }
    
    if (newProduct.rating !== undefined) {
      const rating = parseFloat(newProduct.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ 
          message: 'Rating must be a number between 0 and 5',
          field: 'rating',
          received: newProduct.rating
        });
      }
    }
    
    // Generate new unique ID
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const productId = maxId + 1;
    
    // Create product object with validated data and defaults
    const productToCreate = {
      id: productId,
      title: newProduct.title.trim(),
      description: newProduct.description || '',
      price: parseFloat(newProduct.price),
      discountPercentage: newProduct.discountPercentage ? parseFloat(newProduct.discountPercentage) : 0,
      rating: newProduct.rating ? parseFloat(newProduct.rating) : 0,
      stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
      brand: newProduct.brand || '',
      category: newProduct.category || '',
      thumbnail: newProduct.thumbnail || '',
      images: Array.isArray(newProduct.images) ? newProduct.images : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to products array
    products.push(productToCreate);
    
    // Log the creation for debugging
    console.log(`New product created with ID: ${productId}`);
    
    // Return created product with 201 status
    res.status(201).json(productToCreate);
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Update Product
 * @route PUT /api/products/:id
 * @description Update an existing product with partial data
 * @access Public
 * @param {string} id - Product ID (must be a valid positive number)
 * @param {Object} req.body - Updated product data (partial)
 * @returns {Object} Updated product object
 */
app.put('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    // Validate ID parameter
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ 
        message: 'Invalid product ID. ID must be a positive number.',
        received: req.params.id
      });
    }
    
    // Find product by ID
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ 
        message: `Product with ID ${id} not found`,
        availableIds: products.map(p => p.id)
      });
    }
    
    // Validate update fields (only validate provided fields)
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim() === '') {
        return res.status(400).json({ 
          message: 'Title cannot be empty',
          field: 'title'
        });
      }
    }
    
    if (updates.price !== undefined) {
      const price = parseFloat(updates.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ 
          message: 'Price must be a valid positive number',
          field: 'price',
          received: updates.price
        });
      }
    }
    
    if (updates.stock !== undefined) {
      const stock = parseInt(updates.stock);
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ 
          message: 'Stock must be a valid non-negative integer',
          field: 'stock',
          received: updates.stock
        });
      }
    }
    
    if (updates.discountPercentage !== undefined) {
      const discount = parseFloat(updates.discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return res.status(400).json({ 
          message: 'Discount percentage must be a number between 0 and 100',
          field: 'discountPercentage',
          received: updates.discountPercentage
        });
      }
    }
    
    if (updates.rating !== undefined) {
      const rating = parseFloat(updates.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ 
          message: 'Rating must be a number between 0 and 5',
          field: 'rating',
          received: updates.rating
        });
      }
    }
    
    // Prepare sanitized updates
    const sanitizedUpdates = {};
    
    if (updates.title !== undefined) sanitizedUpdates.title = updates.title.trim();
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description;
    if (updates.price !== undefined) sanitizedUpdates.price = parseFloat(updates.price);
    if (updates.discountPercentage !== undefined) sanitizedUpdates.discountPercentage = parseFloat(updates.discountPercentage);
    if (updates.rating !== undefined) sanitizedUpdates.rating = parseFloat(updates.rating);
    if (updates.stock !== undefined) sanitizedUpdates.stock = parseInt(updates.stock);
    if (updates.brand !== undefined) sanitizedUpdates.brand = updates.brand;
    if (updates.category !== undefined) sanitizedUpdates.category = updates.category;
    if (updates.thumbnail !== undefined) sanitizedUpdates.thumbnail = updates.thumbnail;
    if (updates.images !== undefined && Array.isArray(updates.images)) sanitizedUpdates.images = updates.images;
    
    // Add updatedAt timestamp
    sanitizedUpdates.updatedAt = new Date().toISOString();
    
    // Update product with sanitized data
    products[productIndex] = { ...products[productIndex], ...sanitizedUpdates };
    
    // Log the update for debugging
    console.log(`Product ${id} updated successfully`);
    
    // Return updated product
    res.json(products[productIndex]);
    
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Delete Product
 * @route DELETE /api/products/:id
 * @description Delete a product by its ID
 * @access Public
 * @param {string} id - Product ID (must be a valid positive number)
 * @returns {Object} Success message with deleted product data
 */
app.delete('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Validate ID parameter
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ 
        message: 'Invalid product ID. ID must be a positive number.',
        received: req.params.id
      });
    }
    
    // Find product index
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        message: `Product with ID ${id} not found`,
        availableIds: products.map(p => p.id)
      });
    }
    
    // Store product data before deletion
    const deletedProduct = { ...products[index] };
    
    // Remove product from array
    products.splice(index, 1);
    
    // Log the deletion for debugging
    console.log(`Product ${id} deleted successfully`);
    
    // Return success response with deleted product data
    res.json({
      message: 'Product deleted successfully',
      deletedProduct,
      remainingProducts: products.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * MIDDLEWARE FOR ERROR HANDLING AND 404 ROUTES
 * These middleware functions handle errors and undefined routes
 */

/**
 * Global Error Handler Middleware
 * @description Catches and handles all unhandled errors in the application
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error('=== ERROR OCCURRED ===');
  console.error('Time:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.url);
  console.error('Error:', err.stack);
  console.error('=====================');
  
  // Determine error status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Prepare error response
  const errorResponse = {
    message: err.message || 'Internal server error occurred',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };
  
  // Include stack trace only in development mode for security
  if (NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }
  
  res.status(statusCode).json(errorResponse);
});

/**
 * 404 Route Handler
 * @description Handles requests to non-existent routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'PUT /api/products/:id',
      'DELETE /api/products/:id'
    ]
  });
});

/**
 * SERVER STARTUP
 * Start the Express server and handle startup events
 */

/**
 * Start the HTTP server
 * @description Starts the server on the specified port with error handling
 */
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Fashion Products API Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📊 Initial Products: ${products.length}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  console.log('Available endpoints:');
  console.log('  GET    /                    - API Documentation');
  console.log('  GET    /api/products        - Get all products');
  console.log('  GET    /api/products/:id    - Get single product');
  console.log('  POST   /api/products        - Create new product');
  console.log('  PUT    /api/products/:id    - Update product');
  console.log('  DELETE /api/products/:id    - Delete product');
  console.log('='.repeat(50));
});

/**
 * Handle server startup errors
 */
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
    console.error('   You can set a different port using: PORT=3001 npm start');
  } else {
    console.error('❌ Server startup error:', error.message);
  }
  process.exit(1);
});

/**
 * Graceful shutdown handling
 */
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Export the app for testing purposes
module.exports = app;