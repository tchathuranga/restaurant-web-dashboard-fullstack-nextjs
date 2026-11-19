# Sri Vihar Dashboard

Admin dashboard for the Sri Vihar restaurant website. Staff use it to manage the menu, news, promotions, gallery, vacancies, page banners and branches. The public website reads the same database.

Built with Next.js 16 (App Router), React 19, MUI, Redux Toolkit, Prisma 7 and MariaDB/MySQL. Images are stored on Cloudinary.

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the values, then create the tables:

```bash
npm run db:deploy
```

```bash
npm run dev
```

Open http://localhost:3000 and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Runs the production build through `server.js` (used by cPanel) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create and apply a migration during development |
| `npm run db:deploy` | Apply existing migrations (production) |

## Project structure

```
prisma/              Schema and migrations (this repo owns the migrations)
server.js            Startup file for cPanel's Node.js app runner
src/
  proxy.ts           Blocks every page and API route without a valid session
  app/               Pages and API routes
    api/             REST endpoints, one folder per resource
  components/        UI, grouped by feature (common, menu, news, ...)
  constants/         Built-in defaults and lookup tables
  redux/             Client auth state
  server/            Server-only code: database, auth, Cloudinary, validation
  services/          Browser-side API calls, all through apiClient.ts
  types/             Shared TypeScript types
  generated/         Prisma client (generated, not committed)
```

Rules of thumb:

- Code in `src/server` must never be imported by a client component.
- Components load and save data through `src/services`. The only direct `fetch` calls are the session check and sign-out.
- Every API route answers with `{ success, data?, error?, message? }`.

## Authentication

Login is checked on the server against `ADMIN_USERNAME` and `ADMIN_PASSWORD`. A successful login sets a signed, httpOnly session cookie that lasts 12 hours. `src/proxy.ts` rejects any request without it, so API routes do not need their own checks. If the three auth variables are missing, nobody can sign in.

## Database

The Prisma schema is duplicated in the website repo. When you change `prisma/schema.prisma` here, copy it there too.
