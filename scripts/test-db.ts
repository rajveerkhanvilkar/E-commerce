
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connection successful!');

        // Try a simple query
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);

        await prisma.$disconnect();
    } catch (e: any) {
        console.error('Connection failed:', e.message);
        process.exit(1);
    }
}

main();
