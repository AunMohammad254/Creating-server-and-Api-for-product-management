// Express.js server with CRUD operations for fashion products

// Import required modules
// Note: You need to install Express.js using npm install express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Sample fashion products data
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

// Root route - Landing page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// API Routes

// GET all products
app.get('/api/products', (req, res) => {
  res.json({
    products,
    total: products.length,
    skip: 0,
    limit: products.length
  });
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Validate ID parameter
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  res.json(product);
});

// POST create new product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  
  // Validate required fields
if (!newProduct.title || !newProduct.price) {
  return res.status(400).json({ message: 'Title and price are required fields' });
}

// Validate data types
if (isNaN(parseFloat(newProduct.price))) {
  return res.status(400).json({ message: 'Price must be a valid number' });
}

if (newProduct.stock && isNaN(parseInt(newProduct.stock))) {
  return res.status(400).json({ message: 'Stock must be a valid integer' });
}

if (newProduct.discountPercentage && isNaN(parseFloat(newProduct.discountPercentage))) {
  return res.status(400).json({ message: 'Discount percentage must be a valid number' });
}

if (newProduct.rating && isNaN(parseFloat(newProduct.rating))) {
  return res.status(400).json({ message: 'Rating must be a valid number' });
}
  
  // Generate new ID (max ID + 1)
  const maxId = Math.max(...products.map(p => p.id), 0);
  newProduct.id = maxId + 1;
  
  // Add default values if not provided
  newProduct.rating = newProduct.rating || 0;
  newProduct.stock = newProduct.stock || 0;
  newProduct.discountPercentage = newProduct.discountPercentage || 0;
  newProduct.brand = newProduct.brand || '';
  newProduct.category = newProduct.category || '';
  newProduct.thumbnail = newProduct.thumbnail || '';
  newProduct.images = newProduct.images || [];
  
  // Add to products array
  products.push(newProduct);
  
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  // Validate ID parameter
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  // Find product by ID
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  // Validate updates
  if (updates.price && isNaN(parseFloat(updates.price))) {
    return res.status(400).json({ message: 'Price must be a valid number' });
  }
  
  if (updates.stock && isNaN(parseInt(updates.stock))) {
    return res.status(400).json({ message: 'Stock must be a valid integer' });
  }
  
  // Update product
  products[productIndex] = { ...products[productIndex], ...updates };
  
  res.json(products[productIndex]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Validate ID parameter
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  // Remove product from array
  const deletedProduct = products[index];
  products.splice(index, 1);
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// Error handling middleware
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Handle 404 errors for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});