#!/usr/bin/env node

const fs = require('fs');
const FormData = require('form-data');

/**
 * Test script for I2I (Image-to-Image) transformation API
 * This script demonstrates how to use the I2I API endpoint
 */

const API_BASE_URL = 'http://localhost:3000';
const TEST_IMAGE_PATH = '/tmp/test-image.jpg';

async function testI2ITransformation() {
  try {
    console.log('🧪 Testing I2I Transformation API...\n');

    // Check if test image exists
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      console.error(`❌ Test image not found at: ${TEST_IMAGE_PATH}`);
      console.log('Please ensure you have a test image available.');
      return;
    }

    // Prepare form data
    const form = new FormData();
    form.append('image', fs.createReadStream(TEST_IMAGE_PATH));
    form.append('transformPrompt', 'Transform this image into a beautiful watercolor painting with soft colors and artistic brush strokes');
    form.append('transformation_type', 'style_transfer');

    console.log('📤 Sending image transformation request...');
    console.log(`📁 Image: ${TEST_IMAGE_PATH}`);
    console.log('🎨 Prompt: Transform this image into a beautiful watercolor painting with soft colors and artistic brush strokes');
    console.log('🔄 Type: style_transfer\n');

    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(`${API_BASE_URL}/api/i2i/transform`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Transformation successful!\n');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
      
      if (result.transformedImageUrl) {
        console.log(`\n🖼️  Transformed image available at: ${result.transformedImageUrl}`);
      }
    } else {
      console.log('❌ Transformation failed!\n');
      console.log('📊 Error response:', JSON.stringify(result, null, 2));
      
      if (result.error === 'API keys not configured') {
        console.log('\n💡 Tip: You need to configure your Google AI API keys first.');
        console.log(`   Visit: ${API_BASE_URL}/admin/keys to set up your keys.`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the development server is running:');
      console.log('   npm run dev');
    }
  }
}

async function checkServerStatus() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_BASE_URL}/api/admin/keys/status`);
    const status = await response.json();
    
    console.log('🔧 Server Status Check:');
    console.log('📊 Response:', JSON.stringify(status, null, 2));
    console.log('');
    
    return response.ok;
  } catch (error) {
    console.log('❌ Server not reachable:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 I2I Integration Test Suite\n');
  console.log('=' .repeat(50));
  
  // Check server status first
  const serverOk = await checkServerStatus();
  
  if (!serverOk) {
    console.log('💡 Please start the development server first:');
    console.log('   npm run dev\n');
    return;
  }
  
  // Run I2I transformation test
  await testI2ITransformation();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completed!');
  
  console.log('\n📚 Next steps:');
  console.log(`   1. Visit ${API_BASE_URL}/admin/keys to configure API keys`);
  console.log(`   2. Visit ${API_BASE_URL} to access your app`);
  console.log('   3. Try the I2I transformation with real API keys\n');
}

// Run the test
main().catch(console.error);