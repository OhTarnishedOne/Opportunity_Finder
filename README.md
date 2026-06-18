# Opportunity Finder OS

Opportunity Finder OS is a local-first founder sales operating system for finding, scoring, prioritizing, and tracking consulting, fractional, startup, family office, and institutional opportunities that could produce $10K-$20K/month.

It answers one daily question:

> Who should Rico contact today, why are they a fit, what should he pitch, and what should he say?

The app is built as a modern SaaS-style MVP with Next.js, TypeScript, Tailwind CSS, shadcn-style UI components, Prisma ORM, SQLite, Recharts, and Zod. It does not include authentication, browser automation, paid APIs, or external AI calls. It includes a conservative local scraper for public pages that you explicitly paste into the sourcing page.

## Why this exists

Rico is positioned as a founder/operator and AI product builder, not a pure software engineer. The central proof-of-work is LCS Engine: a shipped decision intelligence platform for investing education that teaches users to think under uncertainty by making predictions about real economic events and measuring how well their confidence matches outcomes.

Opportunity Finder OS turns that proof into a practical daily workflow for:

- AI product strategy
- decision intelligence
- financial literacy
- investing education
- family office innovation
- fintech product development
- institutional pilots for credit unions, HBCUs, workforce programs, and wealth platforms

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Prisma ORM
- SQLite for local development
- Recharts dashboard charts
- Zod validation

The project is local-first today and structured so it can later be deployed to Vercel and migrated from SQLite to PostgreSQL.

## Install and run locally

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Prisma and SQLite setup

Prisma uses the schema in `prisma/schema.prisma` and the local SQLite database URL configured by `prisma.config.ts`.

Default local database:

```env
DATABASE_URL="file:./dev.db"
```

You can copy `.env.example` to `.env` if you want to override it explicitly.

Useful commands:

```bash
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

The seed file creates 12 realistic dummy leads across family offices, RIAs, fintech startups, AI startups, credit unions, HBCU/workforce programs, edtech, venture studios, accelerators, prediction market companies, investment platforms, and wealthtech companies. All emails use placeholder addresses like `contact@example.com`.

## Scoring system

Each lead uses a 1-5 score for:

- ability to pay
- fit with Rico's background
- need for AI product help
- relevance to LCS Engine
- relevance to decision intelligence
- family office / wealth fit
- institutional education fit
- accessibility of decision maker
- warm intro strength
- urgency
- remote / fractional fit

The app converts weighted factors into a 0-100 fit score.

Priority levels:

- 85-100: Must Contact
- 70-84: Strong Lead
- 55-69: Worth Testing
- 40-54: Low Priority
- Below 40: Ignore for Now

## Offer recommendations

The app deterministically recommends offers from lead category and fit score, including:

- Fractional AI Product Lead
- AI Product Strategy Consultant
- Family Office Innovation Scout
- Decision Intelligence Consultant
- Investment Education Platform Consultant
- AI Financial Literacy Consultant
- Startup Operator-in-Residence
- LCS Institutional Pilot
- LCS Licensing Conversation
- Calibration/Prediction Lab Workshop
- AI Workflow Audit
- Product Strategy Sprint

Outreach is generated from templates and lead fields only. No OpenAI, Anthropic, or external AI API calls are used.

## Revenue forecast

The forecast page shows:

- conservative monthly revenue
- realistic monthly revenue
- best-case monthly revenue
- active conversations needed to hit $10K/month
- active conversations needed to hit $20K/month
- pipeline value by category
- pipeline value by stage

Default assumptions:

- 10% of cold leads become calls
- 30% of warm leads become calls
- 25% of calls become proposals
- 30% of proposals close
- Average starter project: $3,000
- Average retainer: $7,500/month
- Premium retainer: $15,000/month
- Institutional pilot/license: $20,000

## How to add leads

1. Go to `/leads/new`.
2. Add company, category, contact, budget, notes, and personalized angle.
3. Score each factor from 1-5.
4. Save the lead.
5. Review the generated fit score, priority, suggested offer, and outreach drafts.

## Public web sourcing automation

Go to `/sourcing` to paste public URLs and create draft leads from web pages.

Good sources:

- university program pages
- business school centers
- executive education pages
- accelerator cohort pages
- venture studio portfolio pages
- credit union financial wellness pages
- fintech, wealthtech, edtech, and AI company pages
- official staff, leadership, or program pages

Safety rules:

- Paste specific public URLs only; the app does not run broad crawling.
- Do not paste LinkedIn, logged-in directories, private communities, or social platforms.
- The scraper checks basic `robots.txt` disallow rules before fetching a submitted URL.
- Do not guess private emails. If a public email is not visible, use a contact form or warm intro.
- Treat every scraped lead as a draft that needs manual review before outreach.

The scraper tries to extract:

- organization name
- likely category
- website
- possible public contact name/title
- public email if visible on the page
- public LinkedIn/company link if linked from the page
- source URL
- source confidence
- notes with scraped evidence
- deterministic score, priority, offer, and revenue potential

Recommended workflow:

1. Research 5-10 public source pages.
2. Paste them into `/sourcing`.
3. Review created draft leads from the result links.
4. Correct contact names, titles, categories, and notes.
5. Find warm intro paths.
6. Generate outreach only after manual verification.

## CSV export

Use the `Export CSV` button on the lead table or visit:

```text
/api/leads/export
```

The export uses snake_case headers and includes source metadata fields for scraped leads.

CSV import is intentionally not included in this MVP. TODO: add a validated CSV import flow that previews parsed rows, highlights errors, and applies scoring before writing to SQLite.

## Daily workflow

1. Add, import, or source new leads.
2. Score them.
3. Review top 10 opportunities.
4. Generate outreach for 3-5 leads.
5. Send messages manually.
6. Update stages.
7. Review follow-ups due.
8. Track likely monthly revenue.

## Weekly workflow

1. Add 20 new leads.
2. Contact 10 high-fit leads.
3. Follow up with all stale leads.
4. Book 2-3 discovery calls.
5. Send 1-2 proposals.
6. Review revenue forecast.
7. Improve outreach based on replies.
8. Refine UI/design and scoring assumptions.

## Routes

- `/` - Dashboard
- `/leads` - Lead list with search, filters, sorting, badges, and CSV export
- `/leads/new` - Add lead form
- `/leads/[id]` - Lead detail, score breakdown, suggested offer, outreach drafts, notes, and stage updates
- `/sourcing` - Public URL scraper that creates draft leads for review
- `/outreach` - Outreach generator
- `/forecast` - Revenue forecast
- `/followups` - Follow-up tracker
- `/settings` - Static scoring and revenue assumptions

## Future enhancements

- CSV import with validation preview
- Editable scoring and revenue assumptions in the UI
- Authentication
- Vercel deployment profile
- PostgreSQL migration
- Activity timeline
- Relationship graph and intro path tracking
- More advanced enrichment after explicit approval
- Optional external AI generation after explicit approval and API key configuration
