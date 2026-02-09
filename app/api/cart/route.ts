import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be positive').default(1),
})

export async function GET(request: NextRequest) {
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

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: payload.userId },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const total = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )

        return NextResponse.json({
            items: cartItems,
            total,
            count: cartItems.length,
        })
    } catch (error) {
        console.error('Get cart error:', error)
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

        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = addToCartSchema.parse(body)

        // Check if product exists and has stock
        const product = await prisma.product.findUnique({
            where: { id: validatedData.productId },
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        if (product.stock < validatedData.quantity) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        // Check if item already in cart
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: payload.userId,
                    productId: validatedData.productId,
                },
            },
        })

        let cartItem

        if (existingCartItem) {
            // Update quantity
            cartItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + validatedData.quantity,
                },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            })
        } else {
            // Create new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: payload.userId,
                    productId: validatedData.productId,
                    quantity: validatedData.quantity,
                },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            })
        }

        return NextResponse.json(cartItem, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Add to cart error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
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

        await prisma.cartItem.deleteMany({
            where: { userId: payload.userId },
        })

        return NextResponse.json({ message: 'Cart cleared successfully' })
    } catch (error) {
        console.error('Clear cart error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
