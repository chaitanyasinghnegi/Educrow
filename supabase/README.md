# EduCrow — Supabase Database

## Schema Overview

| Table | Purpose |
|-------|---------|
| `users` | User profiles linked to Supabase Auth (`auth.users`) |
| `problems` | LeetCode-style coding challenges |
| `examples` | Input/output examples for each problem |
| `submissions` | User code submissions for problems |
| `user_progress` | Tracks completion across problems, videos, and cheatsheets |

## Entity Relationships

```
auth.users (Supabase Auth)
  ├── users.uuid (1:1 profile)
  ├── submissions.user_id (1:many)
  └── user_progress.user_id (1:many)

problems
  ├── examples.problem_id (1:many)
  ├── submissions.problem_id (1:many)
  └── user_progress.problem_id (optional FK)
```

## Row Level Security (RLS)

All tables have RLS enabled:

- **users** — Users can read/update/insert only their own profile
- **problems** — Public read access (including anonymous)
- **examples** — Public read access (including anonymous)
- **submissions** — Users can read/insert only their own submissions
- **user_progress** — Users can read/insert/update only their own progress

## Migrations

Migration files are in `supabase/migrations/`. To apply:

```bash
# Migrations are applied via the Supabase dashboard or CLI
# Current migrations:
# 001_initial_schema.sql — Creates all 5 tables with RLS policies
```

## Seed Data

`supabase/seed.sql` contains sample data for development:
- 4 coding problems (Two Sum, Container With Most Water, Valid Parentheses, Reverse Linked List)
- 12 examples across all problems

To seed the database, run `seed.sql` against your Supabase project via the SQL Editor in the dashboard.

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
