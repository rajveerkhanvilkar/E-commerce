const { execSync } = require('child_process');

// Set the DATABASE_URL environment variable
process.env.DATABASE_URL = 'postgresql://postgres:5432@localhost:5432/ecom';

try {
    console.log('Pushing database schema...');
    execSync('npx prisma db push --force-reset', {
        stdio: 'inherit',
        env: process.env
    });
    console.log('✓ Database schema pushed successfully!');
} catch (error) {
    console.error('✗ Failed to push schema:', error.message);
    process.exit(1);
}
