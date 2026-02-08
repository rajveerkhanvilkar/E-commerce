import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = signupSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                name: validatedData.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        })

        // Generate JWT token
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const response = NextResponse.json({
            user,
            message: 'User created successfully',
        })

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Signup error:', error)
        return NextResponse.json(
            { error: (error as any).message || 'Internal server error' },
            { status: 500 }
        )
    }
}
