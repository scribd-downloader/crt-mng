# Certificate Manager — Vercel Deployment & Usage Guide

Certificate Manager is a Next.js web application built with Prisma ORM and Next.js App Router.

---

## 🚀 Quick Start: Deploying to Vercel

### Step 1: Provision a Hosted PostgreSQL Database
Because Vercel serverless functions run in stateless environments, a hosted PostgreSQL database is required. You can use any managed PostgreSQL provider:
- **Neon** ([neon.tech](https://neon.tech)) — Recommended (Free tier available)
- **Supabase** ([supabase.com](https://supabase.com))
- **Vercel Postgres** ([vercel.com/storage/postgres](https://vercel.com/storage/postgres))
- **Railway** ([railway.app](https://railway.app))

Obtain your database connection URL. It should look like:
```env
DATABASE_URL="postgresql://username:password@ep-sample-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

### Step 2: Deploy on Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
3. In **Environment Variables**, add the following:

| Variable Name | Description | Example / Recommended Value |
|---|---|---|
| `DATABASE_URL` | Hosted PostgreSQL Connection String | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | 32+ character random secret key for JWT session cookies | `random-32-character-secret-key-here` |
| `ADMIN_EMAIL` | Default Administrator Login Email (Optional) | `admin@certificatemanager.local` |
| `ADMIN_PASSWORD` | Default Administrator Password (Optional) | `Admin123!` |
| `NEXT_PUBLIC_APP_NAME` | Application Title | `Certificate Manager` |
| `NEXT_PUBLIC_APP_URL` | Production Web URL | `https://your-app.vercel.app` |

4. Click **Deploy**. Vercel will automatically run `prisma generate && next build`.

---

### Step 3: Database Schema Migration (First Deployment)

To push the database schema to your hosted PostgreSQL database:

Run the schema push command locally or in GitHub Actions pointing to your production database:
```bash
npx prisma db push
```

Alternatively, the application contains an **automatic self-healing seed system**. Upon your first login or user registration, the system automatically initializes:
- Default Plans (**Monthly Plan**, **Yearly Plan**)
- Application Settings
- Initial Admin Account (`ADMIN_EMAIL` & `ADMIN_PASSWORD`)

---

## 🔐 Credentials & Testing

### Administrator Login
- **URL:** `/login`
- **Email:** `admin@certificatemanager.local` (or value of `ADMIN_EMAIL`)
- **Password:** `Admin123!` (or value of `ADMIN_PASSWORD`)
- **Access:** Admin Dashboard (`/admin`)

### New User Registration & Login
1. Navigate to `/register`.
2. Enter Name (optional), Email, and Password (must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, and 1 number).
3. Click **Create Account**. You will be redirected to `/login?registered=1` with a success confirmation message.
4. Sign in with your new user credentials to access the Customer Dashboard (`/dashboard`).

---

## 🛠️ Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/certificate_manager?schema=public"
   AUTH_SECRET="your-32-character-development-secret-key"
   ```
3. Generate Prisma client & sync database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).
