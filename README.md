# Project Tracker — Full Stack (React + TypeScript, Node.js + Express, PostgreSQL)

This repository contains a minimal but production-minded Project Tracker application:
- Backend: Node.js + Express + TypeScript, JWT Authentication, PostgreSQL (pg)
- Frontend: React + TypeScript + Vite, TailwindCSS
- Advanced feature: Multi-tenant data isolation (Organizations)

## What is included
- `backend/` — Express API with auth and projects endpoints
- `frontend/` — React app with signup/login and projects list / create
- `db/migrations/init.sql` — SQL to create tables
- `.env.example` files explaining environment variables

## How to run locally

### 1) PostgreSQL
Create a Postgres database and run the SQL migration:
```bash
psql -h <host> -U <user> -d <db> -f db/migrations/init.sql
```

### 2) Backend
```bash
cd backend
cp .env.example .env
# edit .env with your DB connection & JWT_SECRET
npm install
npm run dev
```
Server default: `http://localhost:4000`

### 3) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend default: `http://localhost:5173`

## Endpoints (summary)
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- GET /api/analytics/summary
- POST /api/ingest/init
- POST /api/pipeline/callback
- POST /api/ingest/status/:id
- POST /api/jobs/recompute-metrics
- GET /api/jobs/status/:id

All project endpoints require `Authorization: Bearer <token>` and are scoped to the user's organization.

## Deployment notes
- Provide environment variables (DATABASE_URL, JWT_SECRET, PORT)
- Build frontend with `npm run build` and host on Vercel/Netlify/Render
- Backend can be deployed on Railway/Render. Use NODE_ENV=production.

## Architecture notes (short)
- Simple three-layer separation: routes → controllers (inlined) → db layer (`db.ts`).
- JWT-based auth, per-organization isolation enforced at query level.
- Audit logs recorded for mutating actions.
- Improvements: move to connection pool, use migrations tool (Prisma/TypeORM/Flyway), add validations with Zod, add tests and CI, add rate limiting & background workers.

## Advanced features implemented
- Multi-tenant Data Isolation (Organizations)
- Audit logs table that records user actions

