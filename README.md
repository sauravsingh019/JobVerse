# JobVerse

Premium job portal UI built with React, Tailwind, Clerk, and Supabase.

## What is already included

- Modern landing page and premium LinkedIn-style UI
- Job search with filters
- Saved jobs
- Candidate applications
- Recruiter job posting and applicant management
- Demo mode when env keys are missing
- Supabase setup SQL for required tables, policies, and storage buckets

## What you need to add

Create a `.env` file from `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

## Supabase setup

Run the SQL in [SUPABASE_SETUP.sql](./SUPABASE_SETUP.sql) inside the Supabase SQL editor.

This creates:

- `companies`
- `jobs`
- `saved_jobs`
- `applications`
- storage buckets: `company-logo`, `resumes`

## Clerk setup

In Clerk, create a JWT template named `supabase`.

The app uses:

- `session.getToken({ template: "supabase" })`

So this template name must match.

## Install and run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Important note

If you only add keys but do not run the Supabase SQL setup, the app will not fully work because the database tables and storage buckets are required.
