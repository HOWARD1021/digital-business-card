#!/usr/bin/env node

const { spawn } = require('child_process');

// 測試 API 端點
async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  const endpoints = [
    { name: 'Health Check', url: 'http://localhost:8787/health' },
    { name: 'I2I Health', url: 'http://localhost:8787/api/i2i/health' },
    { name: 'I2I Models', url: 'http://localhost:8787/api/i2i/models' },
    { name: 'Prompts API', url: 'http://localhost:8787/api/prompts?limit=5' },
    { name: 'Uploads Stats', url: 'http://localhost:8787/api/uploads/stats' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      console.log(`✅ ${endpoint.name}: Status ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}\n`);
    }
  }
}

// 測試前端是否可訪問
async function testFrontend() {
  console.log('🌐 Testing Frontend...\n');

  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Frontend: Accessible');
      console.log(`   Status: ${response.status} ${response.statusText}\n`);
    } else {
      console.log(`❌ Frontend: Status ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Frontend: Error - ${error.message}\n`);
  }
}

// 主測試函數
async function runTests() {
  console.log('🚀 Starting Digital Business Card Functionality Tests\n');
  console.log('=' * 60 + '\n');

  await testFrontend();
  await testAPI();

  console.log('=' * 60);
  console.log('✨ Tests completed!');
  console.log('\n📝 Manual Testing Checklist:');
  console.log('1. Open http://localhost:3000 in browser');
  console.log('2. Click on the card to flip it');
  console.log('3. Test portfolio, YouTube, and blog links');
  console.log('4. Test QR code button');
  console.log('5. Test WhatsApp button');
  console.log('6. Test social media icons');
}

// 執行測試
runTests().catch(console.error);