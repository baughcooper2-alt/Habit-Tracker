# Daily — a light, friendly habit tracker

A habit tracker built for one thing: making it effortless to check things off
during a busy day — School Work, LSAT study, Gym, Water Intake, Calories,
Protein, Fat, or anything else you want to stay on top of. Install it to your
phone's home screen and your laptop's dock and it behaves like a real app.

## Features

- **Today view** — tap a habit to check it off, or use quick-add buttons
  (`+8`, `+16`, `+24`, …) for anything you track by amount (water, calories,
  protein, fat, minutes, whatever). Tap the number to type an exact value.
  A progress ring at the top shows how much of the day is done.
- **Yesterday/tomorrow navigation** — forgot to log something? Step back a
  day and fix it.
- **Stats** — a monthly calendar heatmap, a yearly GitHub-style contribution
  graph, month-by-month averages, and per-habit streaks (current streak,
  best streak, last-30-day completion rate).
- **Manage habits** — add, edit, reorder, and archive habits. Each habit has
  its own icon, pastel color, and either a simple check-off or a daily
  numeric target with custom quick-add amounts.
- **Installable (PWA)** — add it to your phone's home screen or your
  laptop's dock/taskbar and it opens full-screen, no browser chrome.
- **Synced everywhere** — one shared database, so checking something off on
  your phone shows up on your laptop too.
- Soft, light color palette throughout — no dark, heavy UI.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript + React
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) + PostgreSQL for data
- A small hand-rolled service worker + web app manifest for installability

No accounts, no login — it's meant for one person (you). If you deploy it
publicly, treat the URL itself as the "password": don't share it, and
consider putting your Vercel deployment behind
[Vercel's password protection](https://vercel.com/docs/deployment-protection)
(available on some plans) if you want an extra layer.

## Running it locally

You'll need Node 18+ and a Postgres database (local or remote).

```bash
npm install
cp .env.example .env
# edit .env with your DATABASE_URL / DIRECT_URL

npx prisma db push   # creates the tables
npm run db:seed      # adds starter habits: School Work, LSAT, Gym, Water, Calories, Protein, Fat
npm run dev          # http://localhost:3000
```

## Deploying so it's reachable from your phone and laptop

The easiest free path is **Vercel** (hosting) + **Neon** (Postgres). Both
have free tiers and take about 10 minutes total.

### 1. Create the database (Neon)

1. Go to [neon.tech](https://neon.tech) and sign up / log in.
2. Create a new project (any region close to you).
3. On the project dashboard, copy the **pooled connection string** — this is
   your `DATABASE_URL`. Also grab the **direct connection string** — this is
   your `DIRECT_URL`. (Neon shows both; if your provider only gives you one,
   use the same value for both variables.)

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the
   `baughcooper2-alt/Habit-Tracker` GitHub repo.
2. Under **Environment Variables**, add:
   - `DATABASE_URL` — the pooled Neon connection string
   - `DIRECT_URL` — the direct Neon connection string
3. Click **Deploy**.

That's it — the build itself creates the database tables and adds the
starter habits (School Work, LSAT, Gym, Water, Calories, Protein, Fat) the
first time it runs against an empty database. Later deploys just redeploy
the app; the seed step no-ops once habits already exist, and the schema
push only changes anything if `prisma/schema.prisma` changed.

### 3. Open it on your phone and laptop

Visit your `*.vercel.app` URL (or a custom domain, if you add one in Vercel's
project settings) on both devices.

- **iPhone (Safari):** tap the Share icon → "Add to Home Screen."
- **Android (Chrome):** tap the ⋮ menu → "Add to Home screen" / "Install app."
- **Laptop (Chrome/Edge):** click the install icon in the address bar, or the
  ⋮ menu → "Install Daily…"

It'll now open full-screen from an icon, like a native app, and both devices
read/write the same data.

## Customizing your habits

Open the **Habits** tab in the app — no code changes needed. You can:

- Add a habit as either **Check off** (boolean) or **Track amount**
  (numeric with a daily target and unit, e.g. `100 oz`, `2200 kcal`, `150 g`).
- Set custom quick-add buttons per habit (e.g. water: `8, 16, 24`).
- Pick an icon and pastel color.
- Reorder, edit, or archive habits at any time — archiving keeps history but
  removes it from Today/Stats; nothing is deleted unless you explicitly
  delete an archived habit.

## Known limitations

- **Offline:** the app shell (icons, layout) is cached for fast loading, but
  logging a habit still needs a network connection since data lives in a
  shared database. There's no offline queue/sync.
- **Single user, no auth:** anyone with the URL can see and edit the data.
  Fine for personal use behind an unguessable Vercel URL; add Vercel's
  deployment protection (or reintroduce auth) if that's not enough for you.
- `npm audit` flags a vulnerability inside Next.js's own bundled `postcss`
  dependency (not your project's top-level one). It's a low-risk, internal
  build-time dependency; keep an eye out for a newer Next.js 14.2.x patch
  release and bump `next` in `package.json` when one lands.
