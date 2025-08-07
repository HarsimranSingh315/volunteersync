// Debug test script - save as test-upload.js and run with: node test-upload.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAPI() {
  console.log('=== API Debug Test ===\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000
    });
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
    console.log('\nTrying to connect to server...');
    
    // Try a simple connection test
    try {
      const testResponse = await axios.get('http://localhost:5000', { timeout: 3000 });
      console.log('Server is responding on port 5000');
    } catch (connectError) {
      console.log('Cannot connect to server on port 5000:', connectError.code);
      console.log('Make sure your server is running with: node server.js');
      return;
    }
    return;
  }

  // Test 2: Search endpoint (working one)
  try {
    console.log('\n2. Testing search endpoint...');
    const searchResponse = await axios.get('http://localhost:5000/api/spoonacular/ingredients/search?query=apple');
    console.log('✅ Search test passed:', searchResponse.data);
  } catch (error) {
    console.log('❌ Search test failed:', error.message);
  }

  // Test 3: File upload test (if you have an image file)
  try {
    console.log('\n3. Testing file upload...');
    
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });

    console.log('Testing local upload endpoint...');
    const testResponse = await axios.post('http://localhost:5000/api/test-upload', formData, {
      headers: formData.getHeaders(),
      timeout: 10000
    });
    console.log('✅ Local upload test passed:', testResponse.data);

    console.log('\nTesting Spoonacular image analysis...');
    const analysisResponse = await axios.post('http://localhost:5000/api/spoonacular/images/analyze', formData, {
      headers: formData.getHeaders(),
      timeout: 60000
    });
    console.log('✅ Image analysis test passed:', analysisResponse.data);

  } catch (error) {
    console.log('❌ File upload test failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    console.log('Code:', error.code);
  }

  console.log('\n=== Test Complete ===');
}

// Run the test
testAPI().catch(console.error);