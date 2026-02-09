import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.findMany({
                select: { total: true },
            }),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json(
            {
                totalProducts: 0,
                totalOrders: 0,
                totalUsers: 0,
                totalRevenue: 0,
            },
            { status: 200 }
        );
    }
}
