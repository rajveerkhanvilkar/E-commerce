# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

#### Option A: Using PostgreSQL (Recommended for Production)
1. Create a PostgreSQL database:
```bash
createdb ecommerce
```

2. Update `.env.local` with your database URL:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/ecommerce?schema=public"
```

#### Option B: Using SQLite (Quick Local Testing)
If you don't have PostgreSQL, you can use SQLite for quick testing:

1. Update `prisma/schema.prisma` datasource to:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env.local`:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Configure Environment Variables

Update `.env.local` with all required values:

```env
# Database (use one of the options above)
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret" # Optional for local dev

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@ecommerce.com"
ADMIN_PASSWORD="Admin@123"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

- Email: `admin@ecommerce.com`
- Password: `Admin@123`

**⚠️ Change these in production!**

## Testing Stripe Payments

Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Make sure PostgreSQL is running:
```bash
# Check if PostgreSQL is running
pg_isready
```

2. Verify your DATABASE_URL is correct
3. Try using SQLite for quick testing (see Option B above)

### Prisma Generate Fails

If `npx prisma generate` fails:

1. Make sure DATABASE_URL is set in `.env.local`
2. The URL format must be valid
3. For PostgreSQL: `postgresql://user:password@host:port/database`
4. For SQLite: `file:./dev.db`

### Port Already in Use

If port 3000 is already in use:

```bash
# Run on a different port
PORT=3001 npm run dev
```

### Missing Dependencies

If you see module not found errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
ecommerce-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── .env.local            # Environment variables
└── package.json
```

## Next Steps

1. **Customize the design** - Update colors, fonts, and layouts in `app/globals.css`
2. **Add more products** - Use the admin panel or modify `prisma/seed.ts`
3. **Configure Stripe** - Set up webhooks for production
4. **Deploy** - Deploy to Vercel, Railway, or your preferred platform

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

**🎉 You're all set! Start building your e-commerce empire!**
