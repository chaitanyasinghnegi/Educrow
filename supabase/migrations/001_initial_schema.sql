-- ============================================================
-- EduCrow — Initial Schema Migration
-- Created: 2026-02-23
-- Tables: users, problems, examples, submissions, user_progress
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. USERS (profiles linked to Supabase Auth)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  uuid        uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  phone_number text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = uuid);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = uuid);

-- Users can insert their own profile (during sign-up)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = uuid);


-- ──────────────────────────────────────────────
-- 2. PROBLEMS (LeetCode-style coding challenges)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.problems (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  difficulty  text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read problems
CREATE POLICY "Public read access for problems"
  ON public.problems FOR SELECT
  USING (true);


-- ──────────────────────────────────────────────
-- 3. EXAMPLES (problem input/output examples)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.examples (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  problem_id  bigint NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  input       text NOT NULL,
  output      text NOT NULL,
  explanation text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;

-- Anyone can read examples (same as problems)
CREATE POLICY "Public read access for examples"
  ON public.examples FOR SELECT
  USING (true);

-- Index for faster joins on problem_id
CREATE INDEX IF NOT EXISTS idx_examples_problem_id ON public.examples(problem_id);


-- ──────────────────────────────────────────────
-- 4. SUBMISSIONS (user code submissions)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.submissions (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id  bigint NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code        text NOT NULL,
  language    text NOT NULL,
  status      text DEFAULT 'attempted' CHECK (status IN ('attempted', 'passed', 'failed')),
  output      text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON public.submissions(problem_id);


-- ──────────────────────────────────────────────
-- 5. USER_PROGRESS (track completion across content)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id   bigint REFERENCES public.problems(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('problem', 'video', 'cheatsheet')),
  content_id   text NOT NULL,
  completed    boolean DEFAULT false,
  completed_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, content_type, content_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);


-- ──────────────────────────────────────────────
-- 6. AUTO-PROFILE TRIGGER (creates user profile on auth signup)
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (uuid, email, first_name, last_name, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.raw_user_meta_data ->> 'phone_number'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
