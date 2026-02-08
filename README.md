# Enterprise E-Commerce Platform

A production-ready, enterprise-grade e-commerce web application built with Next.js, TypeScript, PostgreSQL, and Stripe.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Framer Motion** for animations
- **Lucide Icons**
- **React Hook Form** + **Zod** validation

### Backend
- **Next.js API Routes**
- **PostgreSQL** database
- **Prisma ORM**
- **JWT** authentication
- **bcryptjs** password hashing

### Payments
- **Stripe** (test mode)

## 📋 Features

✅ **Authentication**
- User signup/login with JWT
- Password hashing with bcryptjs
- HTTP-only cookie sessions
- Role-based access control (User/Admin)

✅ **Product Management**
- Product listing with pagination
- Category filtering
- Smart search with debounce
- Product detail pages with image gallery
- Admin panel for CRUD operations
- Inventory tracking

✅ **Shopping Cart**
- Add/remove items
- Quantity management
- Persistent cart (database-backed)
- Real-time stock validation

✅ **Checkout & Orders**
- Secure checkout flow
- Address form with validation
- Stripe payment integration
- Order history
- Order status tracking

✅ **UI/UX**
- Premium, modern design
- Fully responsive (mobile/tablet/desktop)
- Smooth animations and transitions
- Loading states and skeletons
- Toast notifications
- Empty states
- Error handling

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Stripe account (for test keys)

### 1. Clone and Install

```bash
cd ecommerce-platform
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb ecommerce
```

Update `.env.local` with your database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # For webhooks (optional for local dev)

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@ecommerce.com"
ADMIN_PASSWORD="Admin@123"
```

### 4. Initialize Database

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Database (Optional)

Create a seed script or manually add categories and products through the admin panel.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ecommerce-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── products/          # Product CRUD
│   │   ├── cart/              # Cart management
│   │   ├── orders/            # Order management
│   │   ├── checkout/          # Checkout & Stripe
│   │   ├── categories/        # Category listing
│   │   └── webhooks/          # Stripe webhooks
│   ├── (auth)/                # Auth pages (login/signup)
│   ├── (shop)/                # Shop pages (products/cart/checkout)
│   ├── admin/                 # Admin dashboard
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Layout components (Header, Footer)
│   ├── product/               # Product components
│   ├── cart/                  # Cart components
│   └── admin/                 # Admin components
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # Auth utilities
│   └── utils.ts               # Helper functions
├── hooks/
│   └── use-toast.ts           # Toast hook
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.local                 # Environment variables
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/checkout` - Create checkout session

### Categories
- `GET /api/categories` - List all categories

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 🎨 Design System

The application uses a premium design system with:

- **Typography**: Inter font family with proper font features
- **Colors**: HSL-based color system for light/dark modes
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth, subtle transitions
- **Components**: Reusable shadcn/ui components

## 🧪 Testing Stripe

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment, especially:

- `DATABASE_URL` - Production PostgreSQL URL
- `JWT_SECRET` - Strong random secret
- `STRIPE_SECRET_KEY` - Production Stripe key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- `NEXT_PUBLIC_APP_URL` - Production URL

## 📝 Admin Access

After seeding or creating an admin user, login with:

- Email: `admin@ecommerce.com`
- Password: `Admin@123`

(Change these in production!)

## 🔒 Security Features

- Password hashing with bcryptjs
- HTTP-only cookies for JWT
- CSRF protection
- Input validation with Zod
- SQL injection protection (Prisma)
- XSS protection (React)

## 📄 License

MIT

## 👨‍💻 Developer

Built with ❤️ as a portfolio project demonstrating enterprise-level development skills.
