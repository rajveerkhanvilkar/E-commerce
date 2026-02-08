const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseData);

        if (res.statusCode === 200) {
            console.log('\n✓ Signup successful!');
        } else {
            console.log('\n✗ Signup failed');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();
