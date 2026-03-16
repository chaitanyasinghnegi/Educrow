# EduCrow

An interactive coding learning platform built with Astro, React, and Tailwind CSS. EduCrow provides a structured environment for learning programming through hands-on coding challenges, AI-assisted guidance, curated video tutorials, and quick-reference cheatsheets also.

---

## Features

- **Coding Problems** — LeetCode-style problem set with a built-in Monaco code editor. Supports 13 languages (Python, Java, C, C#, JavaScript, TypeScript, PHP, Ruby, Rust, Go, Kotlin, Swift, Scala). Code runs remotely via the Piston API.
- **AI Coding Assistant** — Conversational chatbot powered by Groq (Llama 3 70B). Guides students conceptually without giving away answers.
- **Video Tutorials** — Curated YouTube tutorial links for JavaScript, Python, Java, and C++, filterable by difficulty (Beginner / Intermediate / Advanced).
- **Cheatsheets** — Language-specific quick-reference sheets rendered from Markdown in a full-screen modal.
- **Authentication** — Sign up / sign in with Supabase Auth. User profiles stored in a `users` table.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro v4.15 |
| UI Library | React v18.2 |
| CSS | Tailwind CSS v3.4 |
| Component Library | Chakra UI v2.8 (React components only) |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Database & Auth | Supabase |
| AI / LLM | Groq API (Llama 3 70B) |
| Code Execution | Piston API |
| Markdown Rendering | Marked |

---

## Project Structure

```
src/
├── api.js                  # Piston API client
├── constants.js            # Language versions + boilerplate snippets
├── components/             # Astro + React UI components
├── data/                   # Static data (problems, tutorials, cheatsheets, languages)
├── layouts/                # MainLayout (Navigation + Footer wrapper)
├── pages/                  # File-based routing
│   ├── index.astro         # Public landing page
│   ├── index_org.astro     # Post-login dashboard
│   ├── signin.astro
│   ├── signup.astro
│   ├── chatbot.astro
│   ├── problems/
│   ├── videos/
│   └── cheatsheets/
└── utils/
    ├── supabaseClient.js   # Shared Supabase client
    └── problemEvaluator.ts
supabase/
├── migrations/             # SQL schema migrations
└── seed.sql
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- A [Groq](https://console.groq.com/) API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The Groq API key is currently hardcoded in `src/pages/chatbot.astro`. Move it to `.env` before deploying.

### Database Setup

Run the migration and seed files against your Supabase project:

```
supabase/migrations/001_initial_schema.sql
supabase/seed.sql
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## Architecture Notes

- **Rendering:** All pages use static site generation (SSG). Problem pages are pre-built at build time using data fetched from Supabase via `getStaticPaths()`.
- **Code execution** happens at runtime on the client side through the Piston API — there is no server-side test-case judging.
- **Authentication sessions** are stored in `sessionStorage` after sign-in.

---

## Roadmap

- [ ] Mobile navigation menu (hamburger/drawer)
- [ ] User progress tracking (problems solved, videos watched, streaks)
- [ ] Community / discussion forum per problem
- [ ] Offline off-loading of courses
