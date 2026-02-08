import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    comparePrice: z.number().positive().optional(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    categoryId: z.string().min(1, 'Category is required'),
    featured: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const featured = searchParams.get('featured')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const where: any = {}

        if (category) {
            where.category = { slug: category }
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (featured === 'true') {
            where.featured = true
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                take: limit,
                skip: offset,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            products,
            total,
            limit,
            offset,
        })
    } catch (error) {
        console.error('Get products error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = productSchema.parse(body)

        const slug = slugify(validatedData.name)

        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        })

        if (existingProduct) {
            return NextResponse.json(
                { error: 'Product with this name already exists' },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                ...validatedData,
                slug,
            },
            include: {
                category: true,
            },
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Create product error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
