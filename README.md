# Landed Local website

The marketing site for Landed Local, a Columbus, Ohio company that builds AI systems for local service businesses: answering calls, following up on leads and clearing admin work off the owner's plate, so they land more jobs without new hires.

## What's on the site

- Five services: AI receptionist, speed-to-lead and lead reactivation, workflow automation, CRM buildout, and custom AI tools
- What missed calls and slow follow-up cost a service business
- How it works: find the leaks, build the fix, measure it
- A 30-minute consultation, booked through a Cal.com calendar embedded on /book

## Tech

Astro, Tailwind CSS and a Cal.com embed. Built with Replit Agent.

## Run it locally

From the repository root:

```sh
pnpm install
pnpm --filter @workspace/landed-local run dev
```

To build and preview the static site:

```sh
pnpm --filter @workspace/landed-local run build
pnpm --filter @workspace/landed-local run serve
```

## Contact

George, george@landedlocal.com
