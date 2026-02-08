import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
})

const checkoutSchema = z.object({
    shippingAddress: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        addressLine1: z.string().min(1, 'Address is required'),
        addressLine2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
        phone: z.string().min(1, 'Phone is required'),
    }),
})

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
        const validatedData = checkoutSchema.parse(body)

        // Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: payload.userId },
            include: {
                product: true,
            },
        })

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            )
        }

        // Validate stock for all items
        for (const item of cartItems) {
            if (item.product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${item.product.name}` },
                    { status: 400 }
                )
            }
        }

        // Calculate total
        const total = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: payload.userId,
                total,
                shippingAddress: validatedData.shippingAddress,
                status: 'PENDING',
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                        images: item.product.images.slice(0, 1),
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
            metadata: {
                orderId: order.id,
            },
        })

        // Update order with Stripe session ID
        await prisma.order.update({
            where: { id: order.id },
            data: { stripeSessionId: session.id },
        })

        return NextResponse.json({
            sessionId: session.id,
            sessionUrl: session.url,
            orderId: order.id,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Checkout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
