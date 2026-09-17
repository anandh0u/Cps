# CPS Department Portal

A responsive department information hub for Cyber Physical System Engineering at Government Engineering College Thrissur.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cps-department-portal` — responsive React web app
- `artifacts/api-server/src/routes/department.ts` — department and session endpoints
- `lib/db/src/schema/department.ts` — department database models
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `agent.md` — future modification notes and production handoff guidance

## Architecture decisions

- API contracts are defined in OpenAPI first, then generated into typed React Query hooks and Zod validators.
- Department content is stored in PostgreSQL through Drizzle rather than hardcoded in the frontend.
- The initial sign-in flow is intentionally a preview session with a clearly documented demo credential; managed authentication should replace it before production.
- The web app lives at the root preview path so the department portal is the primary product surface.

## Product

- Login screen for portal access
- Department overview with counts, highlights, events, news, and notifications
- Searchable student directory
- Faculty directory with specialization and office details
- Events, news, and notification views

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `SESSION_SECRET` is required by the API server.
- Run API codegen after every OpenAPI change before importing new hooks or schemas.
- Use the managed workflows rather than starting Vite or Express directly when previewing.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
