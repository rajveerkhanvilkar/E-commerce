import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateCartItemSchema = z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
})

export async function PATCH(
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
        const body = await request.json()
        const validatedData = updateCartItemSchema.parse(body)

        // Get cart item with product
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: { product: true },
        })

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            )
        }

        // Verify ownership
        if (cartItem.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Check stock
        if (cartItem.product.stock < validatedData.quantity) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        const updatedCartItem = await prisma.cartItem.update({
            where: { id },
            data: { quantity: validatedData.quantity },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedCartItem)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Update cart item error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
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

        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
        })

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            )
        }

        // Verify ownership
        if (cartItem.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        await prisma.cartItem.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Item removed from cart' })
    } catch (error) {
        console.error('Delete cart item error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
