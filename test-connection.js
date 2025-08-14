// Simple connection test script
// Run with: node test-connection.js

import fetch from 'node-fetch';

async function testConnection() {
    console.log('🔍 Testing Backend Connection...\n');

    try {
        // Test 1: Health Check
        console.log('1. Testing Health Check...');
        const healthResponse = await fetch('http://localhost:3001/health');
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health Check Success:', healthData);
            console.log('Status:', healthResponse.status);
        } else {
            console.log('❌ Health Check Failed');
            console.log('Status:', healthResponse.status);
        }
        console.log('');

        // Test 2: Try to connect to user endpoint
        console.log('2. Testing User Endpoint...');
        const userResponse = await fetch('http://localhost:3001/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
                firstname: 'Test',
                lastname: 'User'
            })
        });

        if (userResponse.ok) {
            console.log('✅ User Endpoint Accessible');
        } else {
            const errorData = await userResponse.json();
            console.log('⚠️ User Endpoint Response:', errorData.message);
        }
        console.log('Status:', userResponse.status);

    } catch (error) {
        console.error('❌ Connection Test Failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Solution: Backend server is not running!');
            console.log('   Run: cd Backend && npm start');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n💡 Solution: Cannot reach localhost:3001');
            console.log('   Check if backend is running on correct port');
        }
    }
}

// Run test
testConnection();
