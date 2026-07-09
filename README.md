# ⚡ Flashy Cardy

A personal flashcard platform built with Next.js. Create decks, add cards manually or generate them with AI, and study with a built-in review session.

## Features

- **Auth & billing** via [Clerk](https://clerk.com) — sign in/up, user management, and paid plans (`PricingTable`).
- **Decks & cards** — create, edit, and delete decks and flashcards.
- **AI flashcard generation** — generate 20 cards for a deck from its title/description using OpenAI (`gpt-4o`), gated behind the Pro plan and the `ai_flashcard_generation` feature flag in Clerk.
- **Study mode** — review cards deck by deck.
- **Postgres + Drizzle ORM** for data storage (tested with [Neon](https://neon.tech)).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Clerk](https://clerk.com) for authentication and billing
- [Drizzle ORM](https://orm.drizzle.team) with PostgreSQL (`@neondatabase/serverless`)
- [AI SDK](https://sdk.vercel.ai) + `@ai-sdk/openai` for AI card generation
- Tailwind CSS + shadcn/ui components

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                            | Description                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string (e.g. from [Neon](https://neon.tech)).              |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key, from your [Clerk dashboard](https://dashboard.clerk.com). |
| `CLERK_SECRET_KEY`                  | Clerk secret key.                                                                |
| `OPENAI_API_KEY`                    | OpenAI API key, used for AI flashcard generation.                                |

To use AI flashcard generation, configure a Pro plan with an `ai_flashcard_generation` feature in your Clerk dashboard's Billing settings.

### 3. Set up the database

Push the Drizzle schema (`src/db/schema.ts`) to your database:

```bash
npx drizzle-kit push
```

### 4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

- `yarn dev` — start the development server
- `yarn build` — build for production
- `yarn start` — start the production server
- `yarn lint` — run ESLint
- `npx drizzle-kit push` — sync the database schema
- `npx drizzle-kit studio` — browse the database with Drizzle Studio

## Deploy

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new), configured with the same environment variables as above.
