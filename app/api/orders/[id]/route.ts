import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const { id } = await params

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Verify ownership (or admin)
        if (order.userId !== payload.userId && payload.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Get order error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
