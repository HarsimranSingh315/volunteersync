// Test script for the fallback system - save as test-fallback.js
const axios = require('axios');
const FormData = require('form-data');

async function testFallbackSystem() {
  console.log('=== Testing Fallback System ===\n');

  try {
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
      filename: 'test-food.png',
      contentType: 'image/png'
    });

    console.log('Testing image analysis with fallback system...');
    console.log('This should work even if Spoonacular API is down.\n');

    const startTime = Date.now();
    
    const response = await axios.post('http://localhost:5000/api/spoonacular/images/analyze', formData, {
      headers: formData.getHeaders(),
      timeout: 30000 // 30 second timeout
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ SUCCESS! Image analysis completed in', duration, 'ms');
    console.log('\n=== Analysis Result ===');
    console.log('Food Name:', response.data.name);
    console.log('Category:', response.data.category);
    console.log('Calories:', response.data.calories);
    console.log('Health Score:', response.data.healthScore);
    console.log('Confidence:', response.data.confidence);
    console.log('Using Fallback:', response.data.fallback ? 'Yes' : 'No');
    console.log('Source:', response.data.source || 'fallback');
    
    if (response.data.message) {
      console.log('Message:', response.data.message);
    }

    if (response.data.nutrition) {
      console.log('\n=== Nutrition Info ===');
      if (response.data.nutrition.calories) {
        console.log('Calories:', response.data.nutrition.calories.value, response.data.nutrition.calories.unit);
      }
      if (response.data.nutrition.protein) {
        console.log('Protein:', response.data.nutrition.protein.value, response.data.nutrition.protein.unit);
      }
      if (response.data.nutrition.carbohydrates) {
        console.log('Carbs:', response.data.nutrition.carbohydrates.value, response.data.nutrition.carbohydrates.unit);
      }
      if (response.data.nutrition.fat) {
        console.log('Fat:', response.data.nutrition.fat.value, response.data.nutrition.fat.unit);
      }
    }

    console.log('\n🎉 Your image analysis is now working!');
    console.log('The system will:');
    console.log('1. Try Spoonacular API first (8 second timeout)');
    console.log('2. Fall back to intelligent analysis if API fails');
    console.log('3. Always provide useful results to users');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
  }
}

// Run the test
testFallbackSystem().catch(console.error);