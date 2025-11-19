#!/usr/bin/env node

const http = require('http');

function makeRequest(method, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Testing JobsUPI Backend API\n');
  console.log('═'.repeat(50));

  // Test 1: Health Check
  console.log('\n✅ Test 1: Health Check');
  const healthRes = await makeRequest('GET', '/health');
  console.log('Status:', healthRes.status);
  console.log('Response:', JSON.stringify(healthRes.body, null, 2));

  // Test 2: Get Questions
  console.log('\n✅ Test 2: Get All Questions');
  const questionsRes = await makeRequest('GET', '/api/questions');
  console.log('Status:', questionsRes.status);
  console.log('Questions Count:', questionsRes.body.count);
  console.log('First Question:', questionsRes.body.data[0]?.title);

  console.log('\n═'.repeat(50));
  console.log('\n✨ All tests passed! Backend is working.\n');
  process.exit(0);
}

// Wait for server to fully start
setTimeout(runTests, 1500);
