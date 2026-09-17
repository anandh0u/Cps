# CPS Department Portal — Agent Notes

## Purpose

This project is the department information portal for **Cyber Physical System Engineering** at Government Engineering College Thrissur. It gives students and faculty one place to find department updates, people, events, news, and notifications.

## Stack

- React + Vite frontend in `artifacts/cps-department-portal`
- Express API in `artifacts/api-server`
- PostgreSQL + Drizzle ORM in `lib/db`
- OpenAPI source of truth in `lib/api-spec/openapi.yaml`
- Generated client hooks in `lib/api-client-react`
- Generated Zod schemas in `lib/api-zod`

## Local development

1. Copy `.env.example` to `.env` and provide `DATABASE_URL` and `SESSION_SECRET`.
2. Run `pnpm install`.
3. Apply the development schema with `pnpm --filter @workspace/db run push`.
4. Start the API and web workflows from Replit.
5. After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen`.

## Demo access

The first-build login flow uses:

- Email: `student@gec.ac.in`
- Password: `cps2026`

This is a preview credential only. Replace it with Clerk or another institution-managed identity provider before production use.

## Future modifications

- Add new API shapes to OpenAPI before changing frontend or route code.
- Keep each database model in `lib/db/src/schema` and export it from the schema barrel.
- Add CRUD endpoints for admin-maintained content when department staff need to edit students, faculty, events, news, or notifications.
- Replace the preview session route with managed authentication before publishing to real users.
- Add role-aware access for student, faculty, and department administrator views.
- Add pagination and server-side search if the directories grow beyond the seeded data size.
- Add image storage only through App Storage; keep object paths and metadata in PostgreSQL.