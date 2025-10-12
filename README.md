# Clinic Reservation (Next.js + Tailwind + Supabase)

This is a minimal clinic reservation prototype (no-login). Built with:
- Next.js (App Router)
- Tailwind CSS
- Supabase (Postgres) for database
- One server API route to create reservations

## Quick start (local)

1. Install dependencies:
```bash
npm install
```

2. Create a Supabase project and run the SQL in `supabase/seed.sql` to create tables and seed doctors.

3. Copy environment variables to `.env.local` (example in `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Run the dev server:
```bash
npm run dev
# open http://localhost:3000
```

## Deploy
- Push to GitHub and deploy on Vercel (auto-detects Next.js).
- Add the environment variables in Vercel project settings.

## Notes
- `SUPABASE_SERVICE_ROLE_KEY` must be kept secret (server-only). Do not commit it.
- This app intentionally keeps things simple for a trial. Consider adding:
  - Row-Level Security and safe server checks for production
  - Prevent double-booking on server side

