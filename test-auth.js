// Simple test script for authentication endpoints
// Run with: node test-auth.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api/user';

async function testAuth() {
    console.log('🧪 Testing Authentication System...\n');

    try {
        // Test 1: User Registration
        console.log('1. Testing User Registration...');
        const registerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
                firstname: 'Test',
                lastname: 'User',
                phone: '1234567890',
                company: 'Test Farm',
                role: 'customer'
            })
        });

        const registerData = await registerResponse.json();
        console.log('Registration Response:', registerData);
        console.log('Status:', registerResponse.status);
        console.log('');

        // Test 2: User Login
        console.log('2. Testing User Login...');
        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login Response:', loginData);
        console.log('Status:', loginResponse.status);
        console.log('');

        if (loginData.token) {
            // Test 3: Get User Profile (Protected Route)
            console.log('3. Testing Protected Route (Get Profile)...');
            const profileResponse = await fetch(`${BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const profileData = await profileResponse.json();
            console.log('Profile Response:', profileData);
            console.log('Status:', profileResponse.status);
            console.log('');

            // Test 4: Update User Profile
            console.log('4. Testing Profile Update...');
            const updateResponse = await fetch(`${BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: 'Updated',
                    lastname: 'Name'
                })
            });

            const updateData = await updateResponse.json();
            console.log('Update Response:', updateData);
            console.log('Status:', updateResponse.status);
            console.log('');

        } else {
            console.log('❌ Login failed, skipping protected route tests');
        }

        // Test 5: Health Check
        console.log('5. Testing Health Check...');
        const healthResponse = await fetch('http://localhost:3001/health');
        const healthData = await healthResponse.json();
        console.log('Health Response:', healthData);
        console.log('Status:', healthResponse.status);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testAuth();
}

export { testAuth };
