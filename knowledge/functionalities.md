# EduCrow — Functionalities Reference

> **Purpose:** This document describes every major feature of EduCrow, the components involved, and notable implementation details. Read this before making any changes to the codebase.

---

## 1. Landing Page (Public)

| Item | Detail |
|------|--------|
| **Route** | `/` (`src/pages/index.astro`) |
| **Purpose** | Marketing/hero page shown to unauthenticated visitors |
| **Layout** | `MainLayout` |
| **Key Behavior** | Full-screen gradient hero with animated title, sign-in/sign-up CTAs, and a 4-column feature preview grid (Coding Challenges, Learning Resources, Community, Track Progress). Uses a custom `animate-fade-in` CSS keyframe animation. |

---

## 2. Authentication (Sign In / Sign Up)

### Sign Up
| Item | Detail |
|------|--------|
| **Route** | `/signup` (`src/pages/signup.astro`) |
| **Purpose** | Create a new account |
| **Fields** | First Name, Last Name, Email, Phone Number, Password |
| **Backend** | Supabase Auth (`supabase.auth.signUp`). User metadata (first_name, last_name, phone_number) is stored via the `options.data` parameter. A row is also inserted into the public `users` table with columns: `uuid`, `email`, `first_name`, `last_name`, `phone_number`. |
| **Post-Success** | Redirects to `/index_org` (dashboard) |

### Sign In
| Item | Detail |
|------|--------|
| **Route** | `/signin` (`src/pages/signin.astro`) |
| **Purpose** | Authenticate an existing user |
| **Fields** | Email, Password |
| **Backend** | Supabase Auth (`supabase.auth.signInWithPassword`). On success, stores `userData` and `userSession` in `sessionStorage`. |
| **Post-Success** | Redirects to `/index_org` (dashboard) |
| **Error Handling** | Displays inline error message; shows a loading spinner during auth request |

> **Note:** Both pages create a separate Supabase client inline (hardcoded URL + anon key) in their `<script>` blocks, rather than using the shared `supabaseClient.js` utility.

---

## 3. Dashboard (Post-Login Home)

| Item | Detail |
|------|--------|
| **Route** | `/index_org` (`src/pages/index_org.astro`) |
| **Purpose** | Central hub shown after login; links to all major features |
| **Layout** | `MainLayout` (Navigation + Footer) |
| **Components** | `FeatureCard.astro` — renders 4 feature tiles |
| **Features Listed** | Coding Problems (`/problems`), AI Assistant (`/chatbot`), Video Tutorials (`/videos`), Cheat Sheets (`/cheatsheets`) |

---

## 4. Coding Problems (LeetCode-Style)

### Problem List
| Item | Detail |
|------|--------|
| **Route** | `/problems` (`src/pages/problems/index.astro`) |
| **Data Source** | Supabase — queries `problems` table with related `examples` (joined via `select('*, examples (*)')`) |
| **Display** | Grid of clickable cards showing title, description, and a color-coded difficulty badge (Easy = green, Medium = yellow, Hard = red) |

### Individual Problem Page
| Item | Detail |
|------|--------|
| **Route** | `/problems/[id]` (`src/pages/problems/[id].astro`) |
| **Static Generation** | Uses `getStaticPaths()` to pre-build pages for all problem IDs from Supabase |
| **Content** | Problem title, difficulty badge, description, and example I/O blocks (input, output, explanation) |
| **Code Editor** | `CodeEditor.jsx` (React, client-hydrated via `client:load`) |

### Code Editor Components
| Component | File | Purpose |
|-----------|------|---------|
| `CodeEditor.jsx` | `src/components/CodeEditor.jsx` | Main editor shell; uses **Monaco Editor** (`@monaco-editor/react`) with Chakra UI layout. Manages language and code state. |
| `LanguageSelector.jsx` | `src/components/LanguageSelector.jsx` | Chakra UI dropdown listing all 13 supported languages (from `LANGUAGE_VERSIONS` in `constants.js`). Selecting a language loads its boilerplate snippet. |
| `Output.jsx` | `src/components/Output.jsx` | "Run Code" button + output panel. Calls the **Piston API** (`https://emkc.org/api/v2/piston/execute`) via `api.js` to execute code server-side. Displays stdout/stderr with error styling. |

### Supported Languages (Code Execution)
Python, Java, C, C#, JavaScript, TypeScript, PHP, Ruby, Rust, Go, Kotlin, Swift, Scala — each with a pinned runtime version defined in `src/constants.js`.

### Problem Evaluator
| Item | Detail |
|------|--------|
| **File** | `src/utils/problemEvaluator.ts` |
| **Purpose** | Client-side evaluation for the "Two Sum" problem. Uses `new Function()` to execute user code against test cases. |
| **Status** | Only implemented for `twoSum`; not wired into the UI. |

### Static Problem Data
| File | Detail |
|------|--------|
| `src/data/problems.js` | 4 sample problems (Two Sum, Container With Most Water, Valid Parentheses, Reverse Linked List) with examples. |
| `src/data/problems.ts` | TypeScript interface (`Problem`) + 1 problem with `testCases`. This is a newer version with test-case support; appears unused in favor of Supabase data. |

---

## 5. AI Coding Assistant (Chatbot)

| Item | Detail |
|------|--------|
| **Route** | `/chatbot` (`src/pages/chatbot.astro`) |
| **Purpose** | AI-powered Q&A assistant for coding questions |
| **Backend** | **Groq API** (model: `llama3-70b-8192`). Called directly from client-side JavaScript using `fetch` against `https://api.groq.com/openai/v1/chat/completions`. |
| **System Prompt** | Instructed to provide explanations only (no code pasting), avoid emojis and markdown formatting, and guide the student conceptually. |
| **Conversation Memory** | Full conversation history is maintained in a `conversationHistory` array and sent with each request for context continuity. |
| **UI** | Chat bubble interface — user messages right-aligned in indigo, AI responses left-aligned in gray. Input field + Send button at bottom. Disables input during API call. |

---

## 6. Video Tutorials

### Language Selection
| Item | Detail |
|------|--------|
| **Route** | `/videos` (`src/pages/videos.astro`) |
| **Purpose** | Choose a programming language to browse its tutorials |
| **Components** | `AnimatedButton.astro` — animated cards for each of the 4 languages (JavaScript, Python, Java, C++) |

### Language-Specific Tutorials
| Item | Detail |
|------|--------|
| **Route** | `/videos/[languageId]` (`src/pages/videos/[languageId].astro`) |
| **Static Generation** | `getStaticPaths()` from `programmingLanguages` data |
| **Components** | `VideoCard.astro` (thumbnail, title, difficulty badge, duration, "Watch Now" link), `DifficultyFilter.astro` |
| **Data** | Sourced from `src/data/video-tutorials.ts`, which aggregates per-language files in `src/data/tutorials/` |
| **Behavior** | Each card links to an external YouTube URL (`target="_blank"`). Cards have fade-in-up animation with staggered delays. |

### Difficulty Filter
| Item | Detail |
|------|--------|
| **Component** | `DifficultyFilter.astro` |
| **Options** | All, Beginner, Intermediate, Advanced |
| **Behavior** | Client-side JavaScript toggles visibility of `[data-video-difficulty]` elements by adding/removing the `hidden` class. Active button gets indigo styling. |

### Tutorial Data (Per Language)
| File | Tutorials Count |
|------|----------------|
| `javascript-tutorials.ts` | ~10 |
| `python-tutorials.ts` | 10 |
| `java-tutorials.ts` | ~10 |
| `cpp-tutorials.ts` | ~5 |

Each tutorial has: `id`, `languageId`, `title`, `description`, `thumbnail` (placehold.co), `duration`, `difficulty`, `youtubeUrl`.

---

## 7. Cheatsheets

### Language Selection
| Item | Detail |
|------|--------|
| **Route** | `/cheatsheets` (`src/pages/cheatsheets.astro`) |
| **Purpose** | Choose a language to view its cheatsheets |
| **Components** | Same `AnimatedButton.astro` used by Videos |

### Language-Specific Cheatsheets
| Item | Detail |
|------|--------|
| **Route** | `/cheatsheets/[languageId]` (`src/pages/cheatsheets/[languageId].astro`) |
| **Data** | Sourced from `src/data/cheatsheets.ts` — filtered by `languageId` |
| **Display** | Grid of cards with title + description. Each card has a "View Cheatsheet →" button. |
| **Modal Behavior** | Clicking the button opens a **full-screen modal overlay** (created dynamically via JS). The cheatsheet `content` (Markdown string) is rendered to HTML using `marked.parse()`. Modal dismisses on backdrop click or Close button. |
| **Prose Styles** | Global `.prose` styles applied for headings, paragraphs, code blocks, and pre blocks. |

### Available Cheatsheets
| Language | Sheets |
|----------|--------|
| JavaScript | Array Methods, Promises & Async/Await |
| Python | Lists and Tuples |
| Java | Collections Framework, Streams API |
| C++ | STL Containers, Memory Management |

---

## 8. Navigation

| Item | Detail |
|------|--------|
| **Component** | `Navigation.astro` |
| **Links** | Home (`/index_org`), Problems (`/problems`), AI Help (`/chatbot`), Videos (`/videos`), Cheat Sheets (`/cheatsheets`) |
| **Style** | White background, shadow, horizontal link bar. Hidden on mobile (`hidden md:flex`). Brand name "CodeLearning" links to dashboard. |
| **Note** | No mobile hamburger menu is implemented. |

---

## 9. Footer

| Item | Detail |
|------|--------|
| **Component** | `Footer.astro` |
| **Content** | Dark gray background (`bg-gray-800`), text content is commented out. Currently renders an empty footer. |
