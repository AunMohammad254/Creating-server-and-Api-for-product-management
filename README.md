# 🛍️ Fashion Products API

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](#)

A comprehensive REST API for managing fashion products built with Node.js and Express. This project features a modern, responsive web interface for API testing and documentation, complete with enhanced error handling, input validation, and beautiful UI components.

### 🌐 Live Preview
Check out the live preview of the API documentation and testing interface: [Live Preview](https://fashion-product-api.netlify.app/)

## ✨ Features

### 🔧 Core API Functionality
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for products
- **Data Validation**: Comprehensive server-side and client-side validation
- **Error Handling**: Robust error handling with detailed error messages
- **Auto-generated IDs**: Automatic product ID generation and management
- **Timestamps**: Automatic creation and update timestamps
- **In-memory Storage**: Fast in-memory data storage (easily replaceable with database)

### 🎨 Enhanced User Interface
- **Modern Design**: Beautiful, responsive web interface with glassmorphism effects
- **Real-time Validation**: Live form validation with visual feedback
- **Interactive Testing**: Built-in API testing interface with method-specific buttons
- **Syntax Highlighting**: JSON response syntax highlighting
- **Loading States**: Visual loading indicators for better UX
- **Responsive Design**: Mobile-first responsive design

### 🛡️ Security & Validation
- **Input Sanitization**: Comprehensive input validation and sanitization
- **Error Boundaries**: Graceful error handling and user feedback
- **Rate Limiting Ready**: Structure prepared for rate limiting implementation
- **CORS Ready**: Easy CORS configuration for production deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Products CRUD operation(Using own api)"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to access the API documentation and testing interface.

### Production Deployment

```bash
# Start in production mode
npm start

# Or with PM2 for production
npm install -g pm2
pm2 start app.js --name "fashion-api"
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Currently, no authentication is required. This can be easily added for production use.

### Endpoints Overview

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | ✅ |
| GET | `/api/products/:id` | Get single product | ✅ |
| POST | `/api/products` | Create new product | ✅ |
| PUT | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ |

### 📖 Detailed API Reference

#### Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "total": 25,
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
      "price": 9.99,
      "discountPercentage": 7.17,
      "rating": 4.94,
      "stock": 5,
      "brand": "Essence",
      "category": "beauty",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Single Product
```http
GET /api/products/:id
```

**Parameters:**
- `id` (required): Product ID (positive integer)

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "title": "Essence Mascara Lash Princess",
    "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
    "price": 9.99,
    "discountPercentage": 7.17,
    "rating": 4.94,
    "stock": 5,
    "brand": "Essence",
    "category": "beauty",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Add New Product
```
POST /api/products
```
Request body example:
```json
{
  "title": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "discountPercentage": 10,
  "rating": 4.5,
  "stock": 30,
  "brand": "Brand Name",
  "category": "Category Name",
  "thumbnail": "thumbnail-url.jpg",
  "images": ["image1-url.jpg", "image2-url.jpg"]
}
```

### Update Product
```
PUT /api/products/:id
```

### Delete Product
```
DELETE /api/products/:id
```

## Data Structure

Each product has the following properties:

- `id`: Unique identifier
- `title`: Product name
- `description`: Product description
- `price`: Product price
- `discountPercentage`: Discount percentage (optional)
- `rating`: Product rating (optional)
- `stock`: Available stock (optional)
- `brand`: Product brand
- `category`: Product category
- `thumbnail`: URL to product thumbnail image
- `images`: Array of product image URLs

## License

ISC