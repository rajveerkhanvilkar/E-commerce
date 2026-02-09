import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://neondb_owner:npg_mCaVUOf1Adh5@ep-nameless-dew-ai0kaw7d-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
    }
});

export async function GET() {
    try {
        // Test connection
        await prisma.$connect();

        // Try to count users
        const userCount = await prisma.user.count();

        return NextResponse.json({
            success: true,
            message: 'Database connected!',
            userCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
