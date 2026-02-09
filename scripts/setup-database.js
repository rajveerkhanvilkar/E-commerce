const { execSync } = require('child_process');

// Set environment variable
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_mCaVUOf1Adh5@ep-nameless-dew-ai0kaw7d-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

console.log('🔄 Pushing database schema to Neon...\n');

try {
    // Run prisma db push
    execSync('npx prisma db push --accept-data-loss', {
        stdio: 'inherit',
        env: process.env
    });

    console.log('\n✅ Database schema pushed successfully!');
    console.log('\n🔄 Generating Prisma Client...\n');

    // Run prisma generate
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: process.env
    });

    console.log('\n✅ Prisma Client generated successfully!');
    console.log('\n🎉 Database setup complete!');
    console.log('\nNext step: Run "npm run db:seed" to add sample data');

} catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
}
