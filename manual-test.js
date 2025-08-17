// Manual API Test Script for Fashion Products API
const http = require('http');

// Configuration
const API_HOST = 'localhost';
const API_PORT = 3000;
const API_BASE = '/api/products';

// Test cases
const tests = [
  // GET Tests
  { name: 'Get All Products', method: 'GET', path: API_BASE },
  { name: 'Get Single Product', method: 'GET', path: `${API_BASE}/1` },
  { name: 'Get Non-existent Product', method: 'GET', path: `${API_BASE}/999` },
  { name: 'Invalid Product ID Format', method: 'GET', path: `${API_BASE}/abc` },
  { name: 'Negative Product ID', method: 'GET', path: `${API_BASE}/-1` },
  
  // POST Tests
  { 
    name: 'Create New Product', 
    method: 'POST', 
    path: API_BASE,
    data: {
      title: "Test Product",
      description: "A test product for API testing",
      price: 29.99,
      discountPercentage: 5,
      rating: 4.5,
      stock: 100,
      brand: "TestBrand",
      category: "test",
      thumbnail: "https://example.com/thumbnail.jpg",
      images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    },
    expectedStatus: 201
  },
  { 
    name: 'Create Product Missing Required Fields', 
    method: 'POST', 
    path: API_BASE,
    data: {
      description: "Product without title and price"
    },
    expectedStatus: 400
  },
  { 
    name: 'Invalid Price in POST Request', 
    method: 'POST', 
    path: API_BASE,
    data: {
      title: "Test Product",
      price: -10
    },
    expectedStatus: 400
  },
  { 
    name: 'Invalid Discount Percentage', 
    method: 'POST', 
    path: API_BASE,
    data: {
      title: "Test Product",
      price: 29.99,
      discountPercentage: 150
    },
    expectedStatus: 400
  },
  { 
    name: 'Invalid Rating', 
    method: 'POST', 
    path: API_BASE,
    data: {
      title: "Test Product",
      price: 29.99,
      rating: 6
    },
    expectedStatus: 400
  },
  
  // PUT Tests
  { 
    name: 'Update Product', 
    method: 'PUT', 
    path: `${API_BASE}/1`,
    data: {
      title: "Updated Denim Jacket",
      price: 69.99,
      stock: 50
    },
    expectedStatus: 200
  },
  { 
    name: 'Update Non-existent Product', 
    method: 'PUT', 
    path: `${API_BASE}/999`,
    data: {
      title: "Updated Product"
    },
    expectedStatus: 404
  },
  { 
    name: 'Update Product with Invalid Price', 
    method: 'PUT', 
    path: `${API_BASE}/1`,
    data: {
      price: -50
    },
    expectedStatus: 400
  },
  
  // DELETE Tests
  { 
    name: 'Delete Product', 
    method: 'DELETE', 
    path: `${API_BASE}/5`,
    expectedStatus: 200
  },
  { 
    name: 'Delete Non-existent Product', 
    method: 'DELETE', 
    path: `${API_BASE}/999`,
    expectedStatus: 404
  },
  
  // Non-existent Route Test
  {
    name: '404 Non-existent Route',
    method: 'GET',
    path: '/api/nonexistent',
    expectedStatus: 404
  }
];

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
          });
        } catch (error) {
          // Provide more detailed error information
          const responsePreview = responseData ? responseData.substring(0, 100) + '...' : '';
          const errorMessage = `Failed to parse JSON response for ${method} ${path}: ${error.message}. Response starts with: ${responsePreview}`;
          console.error(errorMessage);
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
            error: errorMessage,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('======================');

  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  const testResults = [];

  for (const test of tests) {
    try {
      console.log(`\n🧪 Running Test: ${test.name}`);
      console.log(`${test.method} ${test.path}`);
      if (test.data) {
        console.log('Request Data:');
        console.log(JSON.stringify(test.data, null, 2));
      }
      
      const response = await makeRequest(test.method, test.path, test.data);
      
      console.log(`Status Code: ${response.statusCode}`);
      console.log('Response Data:');
      console.log(JSON.stringify(response.data, null, 2));
      
      // Validation
      const expectedStatus = test.expectedStatus || {
        'Get All Products': 200,
        'Get Single Product': 200,
        'Get Non-existent Product': 404,
        'Invalid Product ID Format': 400,
        'Negative Product ID': 400,
        'Create New Product': 201,
        'Create Product Missing Required Fields': 400,
        'Invalid Price in POST Request': 400,
        'Invalid Discount Percentage': 400,
        'Invalid Rating': 400,
        'Update Product': 200,
        'Update Non-existent Product': 404,
        'Update Product with Invalid Price': 400,
        'Delete Product': 200,
        'Delete Non-existent Product': 404,
        '404 Non-existent Route': 404
      }[test.name];
      
      // Additional validations based on test name
      let additionalValidationPassed = true;
      let validationMessage = '';
      
      switch(test.name) {
        case 'Get All Products':
          if (!Array.isArray(response.data.products)) {
            additionalValidationPassed = false;
            validationMessage = 'Response should contain products array';
          } else if (typeof response.data.total !== 'number') {
            additionalValidationPassed = false;
            validationMessage = 'Response should contain total count';
          }
          break;
          
        case 'Get Single Product':
          if (response.data.id !== 1) {
            additionalValidationPassed = false;
            validationMessage = `Expected product ID 1, got ${response.data.id}`;
          }
          break;
          
        case 'Get Non-existent Product':
        case 'Update Non-existent Product':
        case 'Delete Non-existent Product':
          if (!response.data.message || !response.data.message.includes('not found')) {
            additionalValidationPassed = false;
            validationMessage = 'Response should indicate product not found';
          }
          break;
          
        case 'Create New Product':
          if (response.data.title !== 'Test Product') {
            additionalValidationPassed = false;
            validationMessage = `Expected title 'Test Product', got '${response.data.title}'`;
          }
          break;
      }
      
      const testPassed = response.statusCode === expectedStatus && additionalValidationPassed;
      
      if (testPassed) {
        console.log(`✅ Test Passed: ${test.name}`);
        passedTests++;
        testResults.push({ name: test.name, status: 'PASSED' });
      } else {
        let failureReason = '';
        if (response.statusCode !== expectedStatus) {
          failureReason = `returned status ${response.statusCode}, expected ${expectedStatus}`;
        } else {
          failureReason = validationMessage;
        }
        console.log(`❌ Test Failed: ${test.name} - ${failureReason}`);
        failedTests++;
        testResults.push({ name: test.name, status: 'FAILED', reason: failureReason });
      }
    } catch (error) {
      console.error(`❌ Error running test ${test.name}:`, error.message);
      failedTests++;
      testResults.push({ name: test.name, status: 'ERROR', reason: error.message });
    }
  }

  // Print detailed summary
  console.log('\n📊 Test Results Summary:');
  console.log('======================');
  testResults.forEach(result => {
    const icon = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️';
    console.log(`${icon} ${result.name}: ${result.status}${result.reason ? ` - ${result.reason}` : ''}`);
  });
  
  console.log('\n======================');
  console.log(`🧪 API Tests Completed: ${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / tests.length) * 100)}%`);
  
  return {
    total: tests.length,
    passed: passedTests,
    failed: failedTests,
    skipped: skippedTests,
    results: testResults
  };
}

// Run the tests
runTests().catch(console.error);