# LifeOS AI — Netlify-ready starter

A responsive React + TypeScript starter for **LifeOS AI — Your Life. Your Goals. Your AI.** Includes a dashboard, planner, goals, a server-side AI chat endpoint, progress summary, theme switch, and optional Supabase Google OAuth connection.

## What works immediately

- Responsive dashboard with desktop sidebar and mobile bottom navigation.
- Add/complete/delete tasks and add/update/delete goals.
- Tasks, goals, display name, and theme are saved in the current browser's `localStorage`.
- Progress summary derived from the records actually in the browser.
- AI chat UI with a Netlify Function endpoint (requires an AI API key).
- Optional Google OAuth sign-in (requires Supabase setup).

## Important limitations

This is a starter MVP, not yet the full production specification. Tasks/goals are currently browser-local, not synchronized across devices or users. Supabase sign-in is scaffolded, but database reads/writes, onboarding, cloud memory, account export/deletion, and row-level security policies are not wired into the UI yet. Planner time slots are user-entered and not a conflict-aware calendar. No calendar provider is connected. Voice, speech-to-text, spoken responses, push notifications, reminders, and a true historical weekly report are not implemented. The progress page explicitly says it is not historical data. AI chat requires a server-side API key and may incur charges. Do not enter sensitive personal information in this starter until you have implemented and reviewed the full privacy/security controls.

## 1. Install prerequisites

1. Install a current Node.js LTS release from https://nodejs.org/ (Node 20+ recommended).
2. Install Visual Studio Code from https://code.visualstudio.com/ (recommended).
3. Extract this ZIP to a folder you can find, e.g. `Desktop/lifeos-ai`.

## 2. Run locally on Windows

1. Open the extracted `lifeos-ai` folder in VS Code.
2. In VS Code, select **Terminal → New Terminal**.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL Vite prints, usually `http://localhost:5173`.
5. To verify a production build, stop the dev server with Ctrl+C and run `npm run build`.

The frontend can run without external credentials. The AI response endpoint requires Netlify's local dev server to emulate Functions; for local function testing install the Netlify CLI and run `npx netlify dev` after setting the environment variables in `.env`.

## 3. Configure AI securely

1. Copy `.env.example` to `.env` for local configuration.
2. Set `OPENAI_API_KEY` to your own API key and optionally `OPENAI_MODEL` to a model available to your account.
3. Do **not** add `OPENAI_API_KEY` to a `VITE_` variable, React code, GitHub, or any publicly accessible file.
4. Run `npx netlify dev` to test the frontend and function together.
5. The function uses the OpenAI-compatible Chat Completions API and returns a helpful setup error if the key is missing. Provider API access and usage may be billed separately.

For deployment, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in Netlify's site environment variables, with access for Functions, then redeploy. Do not commit `.env`.

## 4. Optional Google sign-in using Supabase

1. Create a Supabase project at https://supabase.com/.
2. In the Supabase project, open **Authentication → Providers → Google** and follow Supabase's current Google provider instructions to configure OAuth credentials.
3. In **Authentication → URL Configuration**, add your local URL (e.g. `http://localhost:5173`) and deployed Netlify URL to the allowed redirect URLs. Use your actual site URL.
4. Copy the project's **Project URL** and **publishable/anon key** into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart the local server after changing `.env`.
6. In Netlify, add those same two frontend configuration variables in **Project configuration / Site configuration → Environment variables** and redeploy.

Only use the publishable/anon key in the frontend. **Never use the Supabase service-role key in frontend code.** Google sign-in only authenticates the user in this starter; it does not yet sync tasks/goals to a database. Do not treat localStorage as a secure multi-user database.

## 5. Deploy to Netlify (recommended: Git)

1. Create a GitHub repository and upload the contents of this extracted project folder (the files inside `lifeos-ai`, not a nested duplicate folder). Do not upload `.env` or API secrets.
2. Sign in at https://app.netlify.com/.
3. Choose **Add new site / Import an existing project**, connect GitHub, and select your repository.
4. Set the build command to `npm run build` and publish directory to `dist`. `netlify.toml` already contains these values and the Netlify Functions directory.
5. Click **Deploy**. Netlify will build and publish the app.
6. Add environment variables in the Netlify project settings. For the AI function, add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) with Functions scope. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only if configuring Supabase. Redeploy after changing variables.
7. For Google login, add your actual Netlify domain to Supabase's allowed redirect URLs and complete the Google OAuth provider setup.

The `netlify.toml` includes a single-page-app rewrite so refreshing a route returns the app. The AI function is available at `/.netlify/functions/ai-chat`.

## Project structure

```text
lifeos-ai/
├── netlify/
│   └── functions/
│       └── ai-chat.mjs      # server-side AI API endpoint
├── public/
├── src/
│   ├── App.tsx              # app screens and interactions
│   ├── main.tsx             # React entry point
│   └── styles.css           # responsive theme and components
├── .env.example             # placeholder environment variables only
├── index.html
├── netlify.toml              # build, function, and SPA routing config
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Before using with real personal data

Implement Supabase tables for profiles, tasks, goals, milestones, and conversations; enable Row Level Security and policies scoped to `auth.uid()`; wire all CRUD operations to the signed-in user; add explicit consent and account export/deletion flows; add rate limiting/abuse controls for AI requests; and test auth redirects, authorization, error handling, and data deletion. A Netlify Function should authenticate/authorize user requests before accessing private data. This starter AI endpoint only forwards chat text and does not retrieve the user's private profile.

## Update: login and navigation

- New welcome screen: Continue with Google, Sign in with email, Create account, Continue as guest.
- Page navigation now uses URLs like `#/home`, `#/planner`, `#/goals`, `#/ai`, `#/progress` (back button works).
- Google login uses Supabase PKCE flow. In Supabase, add your Netlify URL under Authentication → URL Configuration (Site URL and Redirect URLs), and enable the Google provider. Then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify environment variables and redeploy.
