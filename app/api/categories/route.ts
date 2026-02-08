import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Get categories error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
