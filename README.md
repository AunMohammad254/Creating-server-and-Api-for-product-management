# Fashion Products API

A RESTful API for fashion products with CRUD operations built with Express.js.

## Features

- Get all products
- Get a single product by ID
- Add a new product
- Update an existing product
- Delete a product
- Landing page with API documentation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository or download the files
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Get All Products
```
GET /api/products
```

### Get Single Product
```
GET /api/products/:id
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