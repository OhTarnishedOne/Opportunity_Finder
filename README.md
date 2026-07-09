# Opportunity Finder OS

Opportunity Finder OS is a local-first founder sales operating system for finding, scoring, prioritizing, and tracking consulting, fractional, startup, family office, and institutional opportunities that could produce $10K-$20K/month.

It answers one daily question:

> Who should Rico contact today, why are they a fit, what should he pitch, and what should he say?

The app is built as a modern SaaS-style MVP with Next.js, TypeScript, Tailwind CSS, shadcn-style UI components, Prisma ORM, SQLite, Recharts, and Zod. It does not include authentication, browser automation, paid APIs, or external AI calls. It includes a conservative local scraper for public pages that you explicitly paste into the sourcing page.

## Framework integration note

The prompt framework was merged into the existing Next.js platform rather than replacing it with Streamlit. The resulting app keeps the framework's local-first MVP workflow: manual lead entry, scoring, deterministic outreach, follow-up tracking, revenue forecasting, CSV import/export, SQLite storage, and no required external APIs.

The `/sourcing` page is optional. You can ignore it and run the app as a fully manual local MVP.

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

It also includes a separate Job Search Operator mode for senior IC and leadership roles at AI and fintech companies. That mode is for application strategy, target role definition, resume/LinkedIn positioning, and outreach assets; it does not replace the lead pipeline.

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

## Job Search Operator

Go to `/job-search` for the reusable system prompt and checklist for senior IC and leadership job search work.

Use this when evaluating:

- GTM / Solutions roles for AI or fintech products
- Product owner or senior IC roles for AI features
- Innovation or decision-intelligence roles at funds, family offices, fintech firms, or AI firms
- Founder/operator roles at AI, fintech, wealthtech, edtech, or decision-support startups

The operator prompt reinforces:

- founder/product/AI positioning
- real markets and trading-systems exposure
- near-term income needs
- de-prioritizing pure institutional quant researcher branding
- structured outputs: goal recap, targets, recommended roles/companies, application assets, and next 7 days plan

Before using the prompt, gather:

- latest resume or LinkedIn profile text
- income timing and target compensation range
- location flexibility and target titles
- target companies, job descriptions, or warm connections
- roles, industries, and work setups to avoid

## Public web sourcing automation

Go to `/sourcing` to paste public URLs and create draft leads from web pages.

Choose a sourcing mode before scraping:

- General
- Family Offices
- Startups
- Universities / Institutions
- Credit Unions / Wealth

Use **Family Offices** when collecting smaller or mid-size family office pages. This biases the draft lead toward family office category, scoring, budget assumptions, and outreach positioning.

Good sources:

- university program pages
- business school centers
- executive education pages
- accelerator cohort pages
- venture studio portfolio pages
- credit union financial wellness pages
- fintech, wealthtech, edtech, and AI company pages
- official staff, leadership, or program pages
- smaller and mid-size family office websites
- multi-family office and boutique wealth advisory pages
- next-gen wealth education, philanthropy, or family governance pages

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

Family office search prompts:

```text
"single family office" "next generation" education
"family office" "investment education" principal
"multi-family office" "innovation" "wealth"
"family office" "AI" investment education
"family office" "financial literacy" next gen
"family governance" "next generation" "investment education"
"family office services" "portfolio learning"
```

For smaller and mid-size family offices, prioritize warm paths and credibility signals. Many offices are discreet and may not publish direct emails. Use official contact forms, conference bios, public team pages, or trusted introductions instead of guessing contact details.

## CSV export

Use the `Export CSV` button on the lead table, visit `/import-export`, or download directly from:

```text
/api/leads/export
```

The export uses snake_case headers and includes source metadata fields for scraped leads.

## CSV import

Go to `/import-export` to upload or paste a CSV. The importer accepts snake_case headers, creates leads in SQLite, recalculates fit score, assigns priority, recommends an offer, and returns row-level errors for rows that cannot be imported.

Minimum useful CSV headers:

```text
company_name,category,website,location,contact_name,contact_title,contact_email,notes,urgency,ability_to_pay,fit_with_my_background,need_for_ai_product_help,relevance_to_lcs,accessibility_of_decision_maker,warm_intro_strength,remote_or_fractional_fit,stage,next_action
```

Scores should be 1-5. Missing score fields default conservatively.

## Listing verification

Opportunity Finder includes an active-posting verification layer for job and role opportunities so stale aggregator listings do not silently stay in the active pipeline.

Principles:

- The direct ATS URL is the source of truth.
- Aggregator URLs are treated as source leads, not evidence.
- Verification is advisory and never destructive.
- Stale listings are auto-parked, hidden from active views by default, removed from follow-up reminders, and kept as history.
- Failed checks become `ERROR` for retry/manual review, not `STALE`.

Supported provider detection:

- Greenhouse
- Lever
- Ashby
- Workday
- Other / unknown HTML pages

When a lead is created, imported, or sourced, the app attempts to canonicalize its URL:

- `canonicalUrl` stores the direct ATS/job URL when found.
- `sourceUrl` stores the original URL when it came from an aggregator or sourcing page.
- `atsProvider`, `atsBoardToken`, and `atsExternalId` are populated when recognizable.
- If no ATS link is found, the lead is still saved as `UNKNOWN`, but its fit score is capped below Strong Lead until availability is verified manually.

Verification states:

- `UNVERIFIED` - never checked
- `ACTIVE` - confirmed live
- `STALE` - confirmed closed or removed
- `ERROR` - check failed or needs manual review

Use the `Verify now` button on a lead detail page for a single check. Use `/verification` to review unverified or failed checks.

Batch verification endpoint:

```text
POST /api/verification/run
Authorization: Bearer $CRON_SECRET
```

The batch job checks due `ACTIVE`, `UNVERIFIED`, and retryable `ERROR` rows, excludes `STALE`, caps each run, and applies retry backoff for errors.

Vercel cron is configured in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/verification/run", "schedule": "0 11 * * *" }
  ]
}
```

For production, set `CRON_SECRET` before enabling the cron.

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
- `/job-search` - Reusable Job Search Operator prompt and execution checklist
- `/leads` - Lead list with search, filters, sorting, badges, and CSV export
- `/leads/new` - Add lead form
- `/leads/[id]` - Lead detail, score breakdown, suggested offer, outreach drafts, notes, and stage updates
- `/sourcing` - Public URL scraper that creates draft leads for review
- `/import-export` - CSV import and export
- `/scoring` - Scoring model and priority category reference
- `/verification` - Manual review queue for unverified and failed listing checks
- `/outreach` - Outreach generator
- `/forecast` - Revenue forecast
- `/followups` - Follow-up tracker
- `/settings` - Static scoring and revenue assumptions

## Future enhancements

- Editable scoring and revenue assumptions in the UI
- Authentication
- Vercel deployment profile
- PostgreSQL migration
- Activity timeline
- Relationship graph and intro path tracking
- More advanced enrichment after explicit approval
- Optional external AI generation after explicit approval and API key configuration
