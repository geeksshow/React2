import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api/user';

async function testProfileUpdate() {
  try {
    console.log('Testing profile update endpoint...');
    
    // First, try to login to get a token
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed, trying to register first...');
      
      const registerResponse = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstname: 'Test',
          lastname: 'User',
          phone: '1234567890',
          company: 'Test Company'
        })
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        console.error('Registration failed:', error);
        return;
      }

      console.log('Registration successful, now trying to login...');
      
      // Try login again
      const loginResponse2 = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      if (!loginResponse2.ok) {
        const error = await loginResponse2.json();
        console.error('Login failed:', error);
        return;
      }
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('Login successful, token received');
    console.log('User data:', loginData.user);

    // Now test profile update
    const updateResponse = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        firstname: 'Updated',
        lastname: 'Name',
        phone: '9876543210',
        company: 'Updated Company',
        img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      })
    });

    if (updateResponse.ok) {
      const updateData = await updateResponse.json();
      console.log('Profile update successful:', updateData);
    } else {
      const error = await updateResponse.json();
      console.error('Profile update failed:', error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testProfileUpdate();
