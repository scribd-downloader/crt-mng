# Certificate Manager

Production-quality bilingual Certificate & Application Management SaaS.

**Important:** This is document preparation / application-management software. It is **not** an official government certificate issuer or verification system unless configured by an authorized organization.

## Features

- Birth, Death, Marriage, Divorce registration forms (English + Urdu)
- Live A4 bilingual preview matching reference form styling
- PDF / JPG export and print
- On-screen Urdu keyboard
- Local-only certificate storage (Dexie / IndexedDB)
- Subscription SaaS with manual WhatsApp payment activation
- Admin panel for customers, plans, licenses, settings
- Signed license tokens + offline grace period
- PWA installable app shell

## Tech Stack

- Next.js 15, React 19, TypeScript, Tailwind CSS
- Prisma + PostgreSQL (accounts / subscriptions only)
- Dexie.js (local certificate data)
- html2canvas + jsPDF
- Zod, React Hook Form patterns, Zustand
- jose (JWT sessions + RS256 licenses)

## Privacy Architecture

| Cloud (PostgreSQL) | Local (IndexedDB) |
|---|---|
| User email, password hash | Certificate form data |
| Subscription / plan / expiry | Names, CNIC, addresses |
| License / device metadata | Drafts, signatures, templates |
| Admin logs (no cert content) | Generated documents |

Certificate data is **never** sent to the server.

## Installation

```bash
npm install
cp .env.example .env
# Edit DATABASE_URL, AUTH_SECRET, WhatsApp number, etc.
```

### Database

```bash
npx prisma db push
npm run db:seed
```

Seed creates:

- Monthly & Yearly plans
- App settings
- Admin user: `admin@certificatemanager.local` / `Admin123!`
- RSA license keys in `.env` (if missing)

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example`:

- `DATABASE_URL` — PostgreSQL connection
- `AUTH_SECRET` — session JWT secret (min 32 chars)
- `LICENSE_PRIVATE_KEY` / `LICENSE_PUBLIC_KEY` — RS256 PEM (escaped `\n`)
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_APP_URL`
- `OFFLINE_GRACE_DAYS` (default 7)
- `LICENSE_VALIDITY_HOURS` (default 168)

## Customer Flow

1. Register / login
2. Contact WhatsApp to purchase
3. Pay manually; provide account email
4. Admin activates subscription
5. Customer uses certificate modules while active

## Admin

Login as admin → `/admin`

- Activate / extend / suspend / cancel subscriptions
- Reset device licenses
- Edit plans and app settings
- View audit logs (no certificate contents)

## License & Offline

1. Client calls `POST /api/license/status` with device ID
2. Server issues signed RS256 license token
3. Client stores token locally
4. Offline use allowed within grace period after last validation
5. After grace expires, internet revalidation is required
6. Expired subscription locks create/edit; **local data is not deleted**

## Local IndexedDB

Database: `CertificateDB`

Tables: `documents`, `drafts`, `templates`, `settings`

Backup / restore from **Settings** (JSON file; not uploaded automatically).

## PDF / JPG / Print

- Single source of truth: `*CertificateDocument` components
- Same DOM used for preview, print, JPG, PDF
- A4 portrait (`210mm × 297mm`) with print CSS

## Urdu Fonts

Place `NotoNastaliqUrdu-Regular.woff2` in `public/fonts/`.

Download from Google Fonts (Noto Nastaliq Urdu). Until then, the browser may fall back to system serif fonts.

## PWA

- `public/manifest.json`
- `public/sw.js` (app shell only; APIs not cached for license bypass)
- Add icons: `public/icons/icon-192.png`, `icon-512.png`

## Security

- Password hashing with bcrypt
- HttpOnly session cookies
- Server-side auth & admin guards
- Secure headers in `next.config.ts`
- No certificate fields in URLs, logs, or API payloads
- Private license key stays server-side only

## Project Structure

```
src/app/                 # Pages & API routes
src/components/          # UI, certificates, bilingual, keyboard
src/lib/                 # auth, license, indexeddb, pdf, subscription
src/types/certificate.ts
prisma/schema.prisma
```

## Acceptance Checklist

- [ ] Register & login
- [ ] Admin activates subscription
- [ ] Fill Birth/Death/Marriage/Divorce (EN + UR)
- [ ] Urdu keyboard, live preview
- [ ] Save draft, reopen, recover
- [ ] JPG / PDF / Print
- [ ] Offline within grace period
- [ ] Expire subscription → locked, data retained
- [ ] Renew → access restored
- [ ] Admin cannot see certificate contents
