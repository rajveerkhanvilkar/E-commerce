const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'ecom',
    user: 'postgres',
    password: '5432'
});

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        const result = await client.query('SELECT version()');
        console.log('PostgreSQL version:', result.rows[0].version);

        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
