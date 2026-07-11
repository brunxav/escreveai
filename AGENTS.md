# EscreveAI

AI text generator app. User selects a text type, fills dynamic fields, AI generates ready-to-copy text.

## Stack

- Next.js 16.2.10 (App Router, Turbopack)
- React 19 + TypeScript 5
- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css, not v3 directives)
- OpenAI SDK v6.46.0 → **routed through OpenRouter** (not direct OpenAI)

## Key Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # production server
```

No lint, typecheck, or test scripts are configured.

## Environment

`.env` contains `OPENROUTER_API_KEY` (the active key). `.env.local` has a placeholder `OPENAI_API_KEY=nao-usado` (unused).

The API key is read server-side only in `src/app/api/generate/route.ts`. Never expose it to the client.

## Architecture

```
src/
├── app/
│   ├── layout.tsx           # Root layout, dark theme, Inter font
│   ├── page.tsx             # Landing + generator integrated ("use client")
│   ├── globals.css          # Tailwind v4 import + dark theme vars
│   └── api/generate/route.ts  # POST endpoint → OpenRouter
├── components/              # All client components ("use client")
│   ├── Header.tsx, Hero.tsx
│   ├── TextGenerator.tsx    # Main form + API call
│   ├── ResultCard.tsx       # Display + copy button
│   └── HistoryList.tsx      # Last 5 items
├── lib/
│   ├── openai.ts            # OpenAI client → baseURL: openrouter.ai/api/v1
│   └── prompts.ts           # Text type configs, system prompts, buildPrompt()
├── types/index.ts           # TextType, FieldConfig, TextTypeConfig, GeneratedText
└── hooks/useHistory.ts      # localStorage history, max 5 items
```

## AI Integration

- Client: `src/lib/openai.ts` — `new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY })`
- Model: `openrouter/free` (auto-routes to available free models)
- Route handler validates type/inputs, calls OpenAI SDK, returns `{ text }`
- Free models have rate limits — first request may succeed while subsequent ones fail with 429

## Conventions

- All components are client components (`"use client"`)
- Dark theme: `bg-gray-950` (page), `bg-gray-900` (cards), accent `violet-600`
- No database, no auth — history persisted in localStorage via `useHistory` hook
- 4 text types: email, linkedin, product, bio — each with dynamic fields defined in `prompts.ts`
- Copy uses Clipboard API with textarea+execCommand fallback

## Gotchas

- Tailwind v4: use `@import "tailwindcss"` in CSS, not `@tailwind` directives
- OpenRouter free tier: rate limits apply, model availability varies
- Hydration warnings from browser extensions (e.g., `cz-shortcut-listen`) are harmless in dev
- `buildPrompt()` returns JSON string — route handler does `JSON.parse()` on it
