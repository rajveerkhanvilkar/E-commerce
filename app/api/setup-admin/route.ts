import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        const adminEmail = 'admin@ecommerce.com';
        const adminPassword = 'Admin@123';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        let message = 'Admin already exists';

        if (!existingAdmin) {
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    name: 'Admin User',
                    password: await hashPassword(adminPassword),
                    role: 'ADMIN',
                },
            });
            message = '✅ Admin user created! Email: admin@ecommerce.com, Pass: Admin@123';
        }

        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed: " + error.message });
    }
}
