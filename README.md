# JobVerse

🌐 **Live Demo:**  
https://drive.google.com/file/d/1qdVtPp0E9nC2tal9ZrwDG4cY8xWQBpc_/view?usp=sharing

Premium job portal UI built with React, Tailwind CSS, Clerk, and Supabase.

---

## ✨ Features

- Modern landing page with a premium LinkedIn-style UI
- Job search with filters
- Saved jobs
- Candidate applications
- Recruiter job posting and applicant management
- Demo mode when environment variables are missing
- Supabase SQL setup for tables, policies, and storage buckets

---

## 📦 Environment Variables

Create a `.env` file from `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

---

## 🏗️ System Workflow Diagram

```text
+-----------+      +-------------------+      +-----------------------+
|   User    | ---> | React Frontend    | ---> | Clerk Authentication  |
+-----------+      +-------------------+      +-----------+-----------+
                                                         |
                                                JWT Token |
                                                         v
                                           +------------------------+
                                           |    Supabase API        |
                                           +-----------+------------+
                                                       |
          +-------------------------+------------------+-------------------------+
          |                         |                                            |
          v                         v                                            v
   +---------------+         +---------------+                         +------------------+
   |  companies    |         |     jobs      |                         |  applications    |
   +---------------+         +---------------+                         +------------------+
          |                         |                                            |
          +-------------------------+------------------+-------------------------+
                                                       |
                                                       v
                                          +-----------------------------+
                                          |     Storage Buckets         |
                                          | company-logo • resumes      |
                                          +-----------------------------+
```

---

## 🛠️ Supabase Setup

Run the SQL file below inside the **Supabase SQL Editor**:

```text
SUPABASE_SETUP.sql
```

This will create:

- `companies`
- `jobs`
- `saved_jobs`
- `applications`

Storage buckets:

- `company-logo`
- `resumes`

---

## 🔐 Clerk Setup

Create a JWT template in Clerk named:

```text
supabase
```

The application uses:

```javascript
session.getToken({ template: "supabase" });
```

So the template name **must** match exactly.

---

## 🚀 Installation

```bash
npm install
npm run dev
```

---

## 📦 Production Build

```bash
npm run build
```

---

## ⚠️ Important Note

Simply adding the environment variables is **not enough**.

You **must** also run the `SUPABASE_SETUP.sql` file in your Supabase project to create the required:

- Database tables
- Row-Level Security (RLS) policies
- Storage buckets

Without these, the application will not function correctly.
