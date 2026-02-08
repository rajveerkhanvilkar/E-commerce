import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')!

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message)
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const orderId = session.metadata?.orderId

                if (orderId) {
                    // Update order status
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { status: 'PROCESSING' },
                    })

                    // Get order items and update product stock
                    const order = await prisma.order.findUnique({
                        where: { id: orderId },
                        include: {
                            items: true,
                        },
                    })

                    if (order) {
                        // Decrease product stock
                        for (const item of order.items) {
                            await prisma.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: {
                                        decrement: item.quantity,
                                    },
                                },
                            })
                        }

                        // Clear user's cart
                        await prisma.cartItem.deleteMany({
                            where: { userId: order.userId },
                        })
                    }
                }
                break
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session
                const orderId = session.metadata?.orderId

                if (orderId) {
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { status: 'CANCELLED' },
                    })
                }
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}
