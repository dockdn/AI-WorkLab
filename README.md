# AI WorkLab

AI WorkLab is a polished Next.js application for scenario-based AI training. The current version focuses on construction professionals and includes a real server-side OpenAI evaluation path with a clearly labeled mock fallback for local development.

## What is included

- Professional landing page, industry selection, construction overview, workshop overview, and scenario workspace
- Typed local content for industries, workshops, scenarios, and skill framing
- Secure server-side prompt evaluation through `/api/evaluate-prompt`
- Deterministic mock evaluator preserved for development fallback
- Client-side draft and progress persistence using `localStorage`
- Focused validation, rate limiting, and automated tests around evaluation behavior

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Lucide React
- OpenAI JavaScript SDK
- Zod
- Vitest
- ESLint

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`.
3. Add your server-side environment variables:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_MODEL` is optional. If you omit it, the app falls back to `gpt-4.1-mini`.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `OPENAI_API_KEY` is missing in local development, the app intentionally uses clearly labeled `Prototype feedback` from the mock evaluator instead of silently pretending the result came from the live API.

## Verification

```bash
npm run test
npm run lint
npm run build
```

The build script uses webpack mode for compatibility in restricted environments.

## Important files

- `src/app/practice/construction/client-communication/1/page.tsx`: scenario workspace entry
- `src/components/workspace/prompt-composer.tsx`: client submission flow and loading/error handling
- `src/components/workspace/evaluation-panel.tsx`: shared evaluation UI for live and mock results
- `src/app/api/evaluate-prompt/route.ts`: secure server-side evaluation route
- `src/lib/evaluation/mock.ts`: deterministic development fallback evaluator
- `src/lib/evaluation/validation.ts`: request validation
- `src/lib/evaluation/rate-limit.ts`: isolated in-memory MVP rate limiter
- `src/lib/evaluation/scenarios.ts`: trusted canonical scenario lookup and rubric
- `src/lib/openai/client.ts`: server-only OpenAI client
- `src/lib/openai/config.ts`: centralized model selection
- `src/lib/openai/schema.ts`: strict structured-output schemas
- `src/lib/openai/evaluate-prompt.ts`: OpenAI Responses API evaluation service

## Deployment

When deploying to Vercel, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the project’s Environment Variables settings. Do not commit secrets to GitHub.

GitHub stores the source code. Vercel runs the server-side Next.js application, including the secure API route that reads the OpenAI environment variables.

## Costs

OpenAI API usage is billed separately based on the selected model and token usage. Set billing limits with your provider account and monitor usage as you test and deploy.

## Current limitations

- The in-memory rate limiter is suitable for development or a single instance only, not multi-instance production scale
- No authentication or database yet
- Progress is still stored only in the browser on the local machine
- Only the first construction workshop and first scenario are interactive in this version
