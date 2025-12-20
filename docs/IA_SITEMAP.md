# Information Architecture — Buffalo Projects

This document captures the finalized IA, primary navigation, and route aliases for the Buffalo Projects site.

## Public Routes

- `/` — Landing
- `/about` — About
- `/projects` — Explore Projects (canonical)
- `/explore` — Alias → redirects to `/projects`
- `/p/:code` — Short public project detail alias
- `/projects/:code` — Public project detail (legacy/canonical)
- `/resources` — Resource hub

## Authenticated Routes

- `/dashboard` — My Work hub
- `/groups` — Group/Class dashboards
- `/workspace/:code` — Authoring workspace (Canvas, Journal, Timeline)

## QA/Offline

- `/test` — In-app QA harness (dev gated)
- `/local` — Offline work gallery

## Primary Navigation

- Order: `Explore | My Work | Resources | About | [User Menu]`
- “My Work” routes to `/dashboard` when authenticated, or `/local` when offline-only.

## Accessibility Notes

- Global skip link to `#main-content` in header.
- Search inputs labeled with `aria-label` across Explore, Resources, Dashboard, Local Work.
- Workspace Save control announces status via `aria-live` (polite).

## Copy Guidelines

- Use “Explore” for community-facing project listings.
- Breadcrumbs for deep pages: `My Work > {Project Name}`.
