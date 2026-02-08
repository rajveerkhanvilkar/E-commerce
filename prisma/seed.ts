import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'
import { slugify } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecommerce.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    })

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Admin User',
                password: await hashPassword(adminPassword),
                role: 'ADMIN',
            },
        })
        console.log('✅ Admin user created')
    } else {
        console.log('ℹ️  Admin user already exists')
    }

    // Create categories
    const categories = [
        {
            name: 'Electronics',
            slug: 'electronics',
            description: 'Latest gadgets and electronic devices',
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
        },
        {
            name: 'Fashion',
            slug: 'fashion',
            description: 'Trendy clothing and accessories',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
        },
        {
            name: 'Home & Living',
            slug: 'home-living',
            description: 'Furniture and home decor',
            image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
        },
        {
            name: 'Sports & Outdoors',
            slug: 'sports-outdoors',
            description: 'Equipment for active lifestyles',
            image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        },
        {
            name: 'Books',
            slug: 'books',
            description: 'Books for every reader',
            image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
        },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
    }
    console.log('✅ Categories created')

    // Get category IDs
    const electronicsCategory = await prisma.category.findUnique({
        where: { slug: 'electronics' },
    })
    const fashionCategory = await prisma.category.findUnique({
        where: { slug: 'fashion' },
    })
    const homeCategory = await prisma.category.findUnique({
        where: { slug: 'home-living' },
    })

    // Create products
    const products = [
        {
            name: 'Wireless Noise-Cancelling Headphones',
            description:
                'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and frequent travelers.',
            price: 299.99,
            comparePrice: 399.99,
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
            ],
            stock: 50,
            featured: true,
            categoryId: electronicsCategory!.id,
        },
        {
            name: 'Smart Watch Pro',
            description:
                'Advanced fitness tracking, heart rate monitoring, GPS, and smartphone notifications. Water-resistant up to 50m with 7-day battery life.',
            price: 399.99,
            comparePrice: 499.99,
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
            ],
            stock: 35,
            featured: true,
            categoryId: electronicsCategory!.id,
        },
        {
            name: '4K Ultra HD Camera',
            description:
                'Professional mirrorless camera with 24MP sensor, 4K video recording, and interchangeable lens system. Includes 18-55mm kit lens.',
            price: 1299.99,
            images: [
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
            ],
            stock: 15,
            featured: false,
            categoryId: electronicsCategory!.id,
        },
        {
            name: 'Premium Leather Jacket',
            description:
                'Genuine leather jacket with classic design. Soft, durable, and perfect for any season. Available in black and brown.',
            price: 249.99,
            comparePrice: 349.99,
            images: [
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
            ],
            stock: 25,
            featured: true,
            categoryId: fashionCategory!.id,
        },
        {
            name: 'Designer Sunglasses',
            description:
                'UV400 protection with polarized lenses. Lightweight titanium frame with premium finish. Comes with protective case.',
            price: 179.99,
            images: [
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
            ],
            stock: 40,
            featured: false,
            categoryId: fashionCategory!.id,
        },
        {
            name: 'Modern Minimalist Desk Lamp',
            description:
                'LED desk lamp with adjustable brightness and color temperature. Touch controls, USB charging port, and sleek aluminum design.',
            price: 89.99,
            images: [
                'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
            ],
            stock: 60,
            featured: false,
            categoryId: homeCategory!.id,
        },
        {
            name: 'Ergonomic Office Chair',
            description:
                'Premium mesh office chair with lumbar support, adjustable armrests, and tilt mechanism. Designed for all-day comfort.',
            price: 349.99,
            comparePrice: 449.99,
            images: [
                'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
            ],
            stock: 20,
            featured: true,
            categoryId: homeCategory!.id,
        },
        {
            name: 'Wireless Keyboard & Mouse Combo',
            description:
                'Sleek wireless keyboard and mouse set with quiet keys, long battery life, and ergonomic design. Perfect for home or office.',
            price: 79.99,
            images: [
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
            ],
            stock: 75,
            featured: false,
            categoryId: electronicsCategory!.id,
        },
    ]

    for (const product of products) {
        const slug = slugify(product.name)
        await prisma.product.upsert({
            where: { slug },
            update: {},
            create: {
                ...product,
                slug,
            },
        })
    }
    console.log('✅ Products created')

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
