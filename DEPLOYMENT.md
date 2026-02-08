# Complete Setup & Deployment Guide

## 🚀 Initial Setup (First Time)

### Step 1: Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if PostgreSQL is installed (optional - can use SQLite)
psql --version
```

### Step 2: Install Dependencies

```bash
cd ecommerce-platform
npm install
```

Expected output: All packages installed successfully

### Step 3: Database Configuration

#### Option A: PostgreSQL (Recommended for Production)

1. **Create Database**
   ```bash
   # Using psql
   createdb ecommerce
   
   # Or using SQL
   psql -U postgres
   CREATE DATABASE ecommerce;
   \q
   ```

2. **Update `.env.local`**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"
   ```

   Replace:
   - `username` with your PostgreSQL username
   - `password` with your PostgreSQL password

#### Option B: SQLite (Quick Testing)

1. **Update `prisma/schema.prisma`**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update `.env.local`**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

### Step 4: Configure Environment Variables

Edit `.env.local` with all required values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Optional for local dev

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@ecommerce.com"
ADMIN_PASSWORD="Admin@123"
```

### Step 5: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

Expected output:
```
✅ Admin user created
✅ Categories created
✅ Products created
🎉 Database seeding completed!
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the premium landing page!

## 🧪 Testing the Application

### Test API Endpoints

1. **Get Products**
   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Get Categories**
   ```bash
   curl http://localhost:3000/api/categories
   ```

3. **Login as Admin**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@ecommerce.com","password":"Admin@123"}'
   ```

### Test Stripe Integration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your test keys
3. Update `.env.local`
4. Use test card: `4242 4242 4242 4242`

## 📦 Building for Production

### Step 1: Build the Application

```bash
npm run build
```

This will:
- Compile TypeScript
- Optimize bundles
- Generate static pages
- Prepare for deployment

### Step 2: Test Production Build Locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Configure Database**
   - Use Vercel Postgres, or
   - Use external PostgreSQL (Supabase, Railway, etc.)

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Set Environment Variables**
   ```bash
   railway variables set JWT_SECRET="your-secret"
   railway variables set STRIPE_SECRET_KEY="sk_test_..."
   # ... add all other variables
   ```

### Option 3: Docker

1. **Create `Dockerfile`**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Create `docker-compose.yml`**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/ecommerce
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=ecommerce
         - POSTGRES_PASSWORD=postgres
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Run**
   ```bash
   docker-compose up
   ```

## 🔧 Post-Deployment Setup

### 1. Configure Stripe Webhooks

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 2. Set Up Custom Domain

#### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records

#### Railway
1. Go to Project Settings
2. Click "Generate Domain" or add custom domain
3. Configure DNS

### 3. Enable HTTPS

Most platforms (Vercel, Railway) provide automatic HTTPS.

For custom deployments:
- Use Let's Encrypt
- Configure Nginx/Caddy as reverse proxy

### 4. Configure CORS (if needed)

If using separate frontend/backend:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

## 🔒 Production Security Checklist

- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backups
- [ ] Set up error tracking
- [ ] Enable database connection pooling
- [ ] Use production Stripe keys
- [ ] Configure CSP headers
- [ ] Enable CORS properly
- [ ] Set up logging
- [ ] Configure firewall rules

## 📊 Monitoring & Maintenance

### Database Backups

#### PostgreSQL
```bash
# Backup
pg_dump -U username ecommerce > backup.sql

# Restore
psql -U username ecommerce < backup.sql
```

#### Automated Backups
- Vercel Postgres: Automatic daily backups
- Railway: Configure in dashboard
- AWS RDS: Enable automated backups

### Performance Monitoring

1. **Install Monitoring Tools**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to Layout**
   ```typescript
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

### Error Tracking

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**:
1. Check if PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Check firewall rules
4. Ensure database exists

### Prisma Generate Fails

**Error**: `Environment variable not found: DATABASE_URL`

**Solution**:
1. Ensure `.env.local` exists
2. Verify DATABASE_URL is set
3. Restart terminal/IDE

### Build Fails

**Error**: `Module not found`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Stripe Webhook Fails

**Error**: `Webhook signature verification failed`

**Solution**:
1. Verify STRIPE_WEBHOOK_SECRET is correct
2. Check webhook endpoint URL
3. Ensure raw body is passed to Stripe

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## 📈 Scaling Considerations

### Database
- Enable connection pooling (PgBouncer)
- Add read replicas
- Implement caching (Redis)
- Optimize queries with indexes

### Application
- Enable CDN for static assets
- Implement server-side caching
- Use ISR for product pages
- Add rate limiting

### Infrastructure
- Use load balancer
- Enable auto-scaling
- Set up CDN (Cloudflare)
- Implement queue system (Bull, BullMQ)

## 🎯 Next Steps After Deployment

1. **Add Analytics**
   - Google Analytics
   - Vercel Analytics
   - Custom event tracking

2. **SEO Optimization**
   - Add meta tags
   - Generate sitemap
   - Implement structured data
   - Optimize images

3. **Performance**
   - Enable image optimization
   - Implement lazy loading
   - Add service worker
   - Optimize bundle size

4. **Features**
   - Email notifications
   - Product reviews
   - Wishlist
   - Related products
   - Search autocomplete

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review error logs
3. Check Prisma/Next.js/Stripe docs
4. Verify environment variables

---

**🎉 Congratulations! Your e-commerce platform is now live!**
