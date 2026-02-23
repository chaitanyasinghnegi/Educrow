# EduCrow — Technical Architecture

> **Purpose:** Documents the technology stack, folder structure, data flow, and third-party integrations. Read this before making any structural changes.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | [Astro](https://astro.build/) | v4.15 |
| **UI Library** | React | v18.2 |
| **CSS Framework** | Tailwind CSS | v3.4 |
| **Component Library** | Chakra UI | v2.8 (React components only) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | v4.6 |
| **Markdown Rendering** | Marked | v12 |
| **Syntax Highlighting** | `@astrojs/prism` | v3.2 (available, usage not prominent) |
| **Database & Auth** | Supabase (`@supabase/supabase-js`) | v2.49 |
| **AI / LLM** | Groq API (Llama 3 70B) | REST API |
| **Code Execution** | Piston API (via Axios) | REST API |
| **HTTP Client** | Axios | v1.6 |
| **Language** | TypeScript / JavaScript | TS via Astro config |
| **Build Tool** | Astro CLI | `astro dev` / `astro build` |

---

## Folder Structure

```
EduCrow/
├── .env                          # Environment variables (Supabase URL + anon key)
├── astro.config.mjs              # Astro config (Tailwind + React integrations)
├── tailwind.config.mjs           # Tailwind config (minimal, no extensions)
├── tsconfig.json                 # Extends astro/tsconfigs/base
├── package.json                  # Dependencies and scripts
├── public/                       # Static assets (favicon)
├── utils/
│   └── supabase/                 # Empty directory (unused)
├── knowledge/                    # Agent knowledge base (this folder)
└── src/
    ├── api.js                    # Piston API client (executeCode function)
    ├── constants.js              # Language versions + code snippet boilerplates
    ├── theme.js                  # Chakra UI theme (dark mode config)
    ├── env.d.ts                  # Astro environment type declarations
    ├── layouts/
    │   ├── MainLayout.astro      # Primary layout (Navigation + Footer + slot)
    │   └── Layout.astro          # Alternative layout (dark theme, unused by pages)
    ├── components/
    │   ├── Navigation.astro      # Top navigation bar
    │   ├── Footer.astro          # Footer (content commented out)
    │   ├── CodeEditor.jsx        # Monaco Editor wrapper (React)
    │   ├── LanguageSelector.jsx  # Language dropdown (React + Chakra)
    │   ├── Output.jsx            # Code execution output panel (React + Chakra)
    │   ├── FeatureCard.astro     # Dashboard feature tile
    │   ├── AnimatedButton.astro  # Animated language selection button
    │   ├── VideoCard.astro       # Video tutorial card
    │   ├── DifficultyFilter.astro# Filter bar for video difficulty
    │   ├── LanguageCard.astro    # Language selection card (alternative)
    │   └── Card.astro            # Dark-themed link card (for Layout.astro)
    ├── pages/
    │   ├── index.astro           # Landing page (public)
    │   ├── index_org.astro       # Dashboard (post-login)
    │   ├── signin.astro          # Sign in page
    │   ├── signup.astro          # Sign up page
    │   ├── chatbot.astro         # AI coding assistant
    │   ├── problems/
    │   │   ├── index.astro       # Problems list
    │   │   └── [id].astro        # Individual problem + code editor
    │   ├── videos.astro          # Video language selection
    │   ├── videos/
    │   │   ├── index.astro       # (duplicate of videos.astro)
    │   │   └── [languageId].astro# Language-specific video tutorials
    │   ├── cheatsheets.astro     # Cheatsheet language selection
    │   ├── cheatsheets/
    │   │   ├── index.astro       # (duplicate of cheatsheets.astro)
    │   │   └── [languageId].astro# Language-specific cheatsheets
    │   └── api/                  # Empty (no API routes implemented)
    ├── data/
    │   ├── programming-languages.ts  # 4 languages (JS, Python, Java, C++)
    │   ├── video-tutorials.ts        # Aggregates all tutorial data
    │   ├── tutorials/
    │   │   ├── javascript-tutorials.ts
    │   │   ├── python-tutorials.ts
    │   │   ├── java-tutorials.ts
    │   │   └── cpp-tutorials.ts
    │   ├── cheatsheets.ts            # All cheatsheet content (inline markdown)
    │   ├── problems.js               # 4 sample problems (legacy)
    │   └── problems.ts               # Problem interface + 1 problem with test cases
    └── utils/
        ├── supabaseClient.js         # Shared Supabase client (uses env vars)
        └── problemEvaluator.ts       # Client-side Two Sum evaluator
```

---

## Data Flow

### Authentication Flow
```
User → signin/signup page → Supabase Auth API
                              ↓
                    Session stored in sessionStorage
                              ↓
                    Redirect to /index_org (dashboard)
```

### Coding Problems Flow
```
Build Time:  Supabase DB (problems + examples tables)
                    ↓
             getStaticPaths() fetches all problem IDs
                    ↓
             Static HTML pages generated for each problem

Runtime:     User writes code in Monaco Editor
                    ↓
             "Run Code" → Piston API (code execution)
                    ↓
             stdout/stderr displayed in Output panel
```

> **Important:** Problems are fetched from Supabase at **build time** (SSG). Code execution happens at **runtime** via the Piston API. There is no server-side judging against test cases — the user runs code freely and sees output.

### AI Chatbot Flow
```
User types question → conversationHistory array updated
                        ↓
                  Groq API (llama3-70b-8192)
                        ↓
                  Response appended to chat UI
                  + added to conversationHistory
```

### Video Tutorials Flow
```
Static Data (src/data/tutorials/*.ts)
        ↓
  getStaticPaths() generates per-language pages
        ↓
  Videos displayed as cards → click opens YouTube (external)
```

### Cheatsheets Flow
```
Static Data (src/data/cheatsheets.ts, inline markdown)
        ↓
  getStaticPaths() generates per-language pages
        ↓
  Click "View Cheatsheet" → JS creates modal
        ↓
  marked.parse() converts markdown → HTML in modal
```

---

## Third-Party Services & APIs

| Service | Purpose | URL / Endpoint |
|---------|---------|----------------|
| **Supabase** | Authentication + Problems database | `https://mmvfltzxrzknsylvtzbb.supabase.co` |
| **Groq API** | AI chatbot (Llama 3 70B model) | `https://api.groq.com/openai/v1/chat/completions` |
| **Piston API** | Remote code execution (13 languages) | `https://emkc.org/api/v2/piston/execute` |
| **placehold.co** | Placeholder thumbnail images for video cards | `https://placehold.co/600x400/...` |
| **YouTube** | External video hosting (tutorial links) | `https://www.youtube.com/watch?v=...` |

---

## Supabase Tables (Known)

| Table | Columns (inferred) | Usage |
|-------|-------------------|-------|
| `problems` | `id`, `title`, `difficulty`, `description`, etc. | Stores coding problems |
| `examples` | `input`, `output`, `explanation`, FK to `problems` | Problem examples (joined in queries) |
| `users` | `uuid`, `email`, `first_name`, `last_name`, `phone_number` | User profiles (created on sign-up) |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

> **Note:** The `supabaseClient.js` utility uses `import.meta.env.VITE_*` variables, but the auth pages (`signin.astro`, `signup.astro`) hardcode the Supabase URL and key directly. The Groq API key is also hardcoded in `chatbot.astro`.

---

## Rendering Strategy

| Page | Strategy |
|------|----------|
| Landing, Dashboard, Auth pages | Static (SSG, no dynamic data) |
| Problems list & detail | Static (SSG) — data fetched from Supabase at build time |
| Video & Cheatsheet pages | Static (SSG) — data from local TypeScript files |
| Code Editor | Client-side React hydration (`client:load`) |
| AI Chatbot | Client-side JavaScript (no SSR) |
| Difficulty Filter | Client-side JavaScript (DOM manipulation) |
