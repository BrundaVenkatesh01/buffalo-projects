# Repository Guidelines

## Project Structure & Module Organization

Buffalo Projects ships from `src/`, grouped by responsibility: `components/` houses design system elements and UI widgets, `pages/` defines React Router shells, `services/` handles Firebase, Gemini, and analytics clients, `stores/` provides Zustand state, and `utils/` collects pure helpers. Configuration lives in `src/config`, while Vitest globals load from `src/test/setup.ts`. End-to-end specs and screenshots stay in `tests/`. Static assets belong in `public/`, generated output lands in `dist/`, and deployment automation lives in `deploy.sh` plus Firebase configs under the repo root.

## Build, Test, and Development Commands

Run `npm install` to sync dependencies with the lockfile. `npm run dev` starts Vite locally, `npm run build` type-checks then bundles for production, and `npm run preview` serves the built app. Quality gates include `npm run typecheck`, `npm run lint`, `npm run lint:fix`, and `npm run format`. Use `npm run check` or `npm run check:deep` before PR submission.

## Coding Style & Naming Conventions

Prettier (two-space indent, consistent quotes) formats the codebase; run `npm run format` before committing large changes. ESLint enforces sorted imports, `import type` for type-only usage, and bans stray `console.log`. Components and Zustand stores use PascalCase filenames, hooks start with `use`, and utilities remain camelCase. Favor path aliases from `vite.config.ts` such as `@/components/Button`.

## Testing Guidelines

Vitest runs under JSDOM with coverage thresholds of ≥70% lines/statements and ≥60% branches/functions; execute `npm run test` for a full pass or `npm run test:watch` while iterating. Playwright suites live in `tests/`; start them with `npm run test:e2e` or scope to Chromium via `npm run test:e2e -- --project=chromium`. Refresh stored screenshots when UI flows change.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits (example: `feat: add onboarding wizard`). Do not use emojis in commit messages or PR titles. Let Lefthook’s hooks pass; rerun linting or tests when they fail. Pull requests should summarize intent, link issues, call out environment or config changes, and list verification steps such as `npm run build`, unit tests, and updated Playwright evidence.

## Security & Configuration Tips

Copy `.env.local` values from `docs/DEVELOPMENT_GUIDE.md`; never commit secrets. Provision Firebase, analytics, and Gemini keys via Vercel environment settings. Scrub sensitive info from Playwright artifacts and coordinate production changes through `DEPLOY.md`.
