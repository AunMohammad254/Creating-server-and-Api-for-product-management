# Fashion Products API - Testing Guide

This guide explains how to test the Fashion Products API using the provided manual testing tools.

## Prerequisites

1. **Node.js** installed on your system
2. **API Server** running on `http://localhost:3000`

## Quick Start

### 1. Start the API Server

```bash
npm start
```

The server will start on `http://localhost:3000` with the following endpoints:

- `GET /` - API Documentation and Testing Interface
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### 2. Run Automated Tests

```bash
npm test
```

This will run the manual-test.js script which performs comprehensive testing of all API endpoints.

## Testing Methods

### 1. Automated Testing with manual-test.js

The manual-test.js script provides automated testing of all API endpoints and validation rules.

### 2. Browser-Based Testing

Open manual-test.html in your browser for an interactive testing interface.

## Test Coverage

### Test Coverage

1. **GET Operations**
   - Get all products
   - Get single product by ID
   - Get non-existent product (404)
   - Invalid product ID format (400)
   - Negative product ID (400)

2. **POST Operations**
   - Create new product successfully
   - Create product with missing required fields (400)
   - Invalid price validation (400)
   - Invalid discount percentage (400)
   - Invalid rating (400)

3. **PUT Operations**
   - Update existing product
   - Update non-existent product (404)

4. **DELETE Operations**
   - Delete existing product
   - Delete non-existent product (404)

5. **Error Handling**
   - 404 for non-existent routes
   - Input validation errors

### Test Structure

Each test includes:
- **Name**: Descriptive test name
- **Description**: What the test validates
- **Request**: HTTP method, URL, headers, and body
- **Expectations**: Status codes and response validations

## Manual Testing

You can also test the API manually using the web interface:

1. Open `http://localhost:3000` in your browser
2. Use the interactive testing interface
3. Test all CRUD operations with the provided forms

## TestSprite Automated Testing

### Prerequisites
- TestSprite MCP server configured
- API server running on `http://localhost:3000`
- All dependencies installed via `npm install`

### Running TestSprite Tests

1. **Bootstrap TestSprite** (required before first run):
   ```bash
   # TestSprite will automatically detect project type and port
   # Default configuration: frontend test, port 3000
   ```

2. **Generate Test Plan**:
   - TestSprite automatically generates comprehensive test plans
   - Covers all CRUD operations and UI interactions
   - Includes error handling and edge cases

3. **Execute Tests**:
   - Tests run in headless Chrome browser
   - Automatic screenshot capture on failures
   - Detailed error reporting with troubleshooting steps

### TestSprite Test Features

- **Smart Confirmation Handling**: Tests use `?test=true` parameter to bypass UI confirmation dialogs
- **Comprehensive Error Testing**: Validates API error responses and UI error displays
- **Loading State Verification**: Checks UI loading indicators during API calls
- **Data Consistency Testing**: Verifies data integrity across multiple operations
- **Performance Monitoring**: Tracks API response times and identifies bottlenecks

### Test Reports

TestSprite generates detailed reports in multiple formats:
- `testsprite-mcp-test-report.html` - Interactive HTML report
- `testsprite-mcp-test-report.md` - Markdown summary
- `test_results.json` - Raw test data for analysis

## API Endpoints Reference

### GET /api/products
Returns all products with metadata.

**Response:**
```json
{
  "products": [...],
  "total": 5,
  "skip": 0,
  "limit": 5,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/products/:id
Returns a specific product by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Classic Denim Jacket",
  "description": "A timeless denim jacket...",
  "price": 59.99,
  "discountPercentage": 10.5,
  "rating": 4.8,
  "stock": 45,
  "brand": "Levi's",
  "category": "clothing",
  "thumbnail": "https://...",
  "images": ["https://..."]
}
```

### POST /api/products
Creates a new product.

**Required Fields:**
- `title` (string)
- `price` (number)

**Optional Fields:**
- `description` (string)
- `discountPercentage` (number, 0-100)
- `rating` (number, 0-5)
- `stock` (number, >= 0)
- `brand` (string)
- `category` (string)
- `thumbnail` (string)
- `images` (array of strings)

### PUT /api/products/:id
Updates an existing product (partial update supported).

### DELETE /api/products/:id
Deletes a product and returns deletion confirmation.

## Validation Rules

### Product ID
- Must be a positive integer
- Returns 400 for invalid format or negative values

### Price
- Must be a positive number
- Required for product creation

### Title
- Must be a non-empty string
- Required for product creation

### Discount Percentage
- Must be between 0 and 100
- Optional field

### Rating
- Must be between 0 and 5
- Optional field

### Stock
- Must be a non-negative integer
- Optional field

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message",
  "field": "fieldName",
  "received": "receivedValue"
}
```

### 404 Not Found
```json
{
  "message": "Product with ID 999 not found",
  "availableIds": [1, 2, 3, 4, 5]
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/products",
  "method": "GET"
}
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Set a different port
   PORT=3001 npm start
   ```

2. **TestSprite Connection Issues**
   - Ensure TestSprite MCP server is properly configured
   - Check your API key in the MCP configuration
   - Verify the server is running before running tests

3. **Test Failures**
   - Check that the API server is running
   - Verify the base URL in `testsprite.config.js`
   - Ensure all required fields are provided in test data

### TestSprite-Specific Troubleshooting

4. **TC010 Delete Product test failures**
   - **Issue**: UI confirmation dialogs block automated tests
   - **Solution**: Tests now use `?test=true` URL parameter to bypass confirmation dialogs
   - **Manual Testing**: Remove the test parameter to test with confirmation dialogs

5. **Test timeout issues**
   - **Issue**: Tests timing out due to slow server response
   - **Solution**: Increase timeout values in test files or optimize server performance
   - **Check**: Verify server is running and responsive at `http://localhost:3000`

6. **Generic failure assertions**
   - **Issue**: Tests failing with "generic failure assertion" messages
   - **Solution**: Updated tests now have specific assertions for expected outcomes
   - **Debug**: Check browser console logs in test results for detailed error information

7. **Rate limiting (429 errors)**
   - **Issue**: Too many rapid API requests causing rate limit errors
   - **Solution**: Add delays between test operations or implement request throttling
   - **Monitor**: Check server logs for rate limiting patterns

### Debug Mode

Run the server in development mode for detailed error messages:

```bash
NODE_ENV=development npm start
```

## Continuous Integration

To integrate testing into your CI/CD pipeline:

1. Add the test script to your CI configuration
2. Ensure the API server starts before running tests
3. Set appropriate timeouts for test execution

Example GitHub Actions workflow:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm start &
      - run: sleep 5
      - run: npm test
```

## Performance Testing

For performance testing, you can extend the TestSprite configuration with:

- Load testing scenarios
- Response time expectations
- Concurrent request testing
- Memory usage monitoring

## Security Testing

Consider adding security tests for:

- SQL injection prevention
- XSS protection
- Input sanitization
- Rate limiting
- Authentication (if implemented)

## Contributing

When adding new features:

1. Update the test configuration
2. Add comprehensive test cases
3. Include both positive and negative test scenarios
4. Document new endpoints and validation rules
5. Update this testing guide
