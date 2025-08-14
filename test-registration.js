import fetch from 'node-fetch';

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    
    const testData = {
      email: 'test@example.com',
      password: '123456',
      firstname: 'Test',
      lastname: 'User',
      phone: '1234567890',
      company: 'Test Company',
      role: 'customer'
    };

    console.log('Sending data:', testData);

    const response = await fetch('http://localhost:3001/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', data.message);
      if (data.errors) {
        console.log('Validation errors:', data.errors);
      }
    }

  } catch (error) {
    console.error('❌ Error testing registration:', error.message);
  }
}

testRegistration();
