const http = require('http');

function testEndpoint(path, name) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n✅ ${name} (${path})`);
        console.log('Status:', res.statusCode);
        try {
          console.log('Response:', JSON.parse(data));
        } catch (e) {
          console.log('Response:', data);
        }
        resolve();
      });
    }).on('error', (e) => {
      console.log(`❌ ${name} - Error:`, e.message);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  await testEndpoint('/health', 'Health Check');
  await testEndpoint('/api/questions', 'Get All Questions');
  console.log('\n✨ Tests complete!');
  process.exit(0);
}

// Wait a moment for server to be ready
setTimeout(runTests, 1000);
