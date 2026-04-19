# EcoHabit.my

EcoHabit.my is a responsive Earth Day web app built for the DEV Weekend Challenge. It is a Malaysia-flavoured daily action picker designed around local routines like LRT commutes, tapau habits, tumbler use, pasar runs, and AC-heavy home life, while still reading clearly to global judges.

## Concept

- English-first UI for global judges
- 15 seeded eco actions with local nouns and inline context
- Welcome modal, streak logic, and local-only persistence with `localStorage`
- Anonymous community pledge wall with seeded entries
- Personalized action prompt for situation-based suggestions
- Screenshot-friendly share card with QR code for DEV and LinkedIn

## Stack

- React
- TypeScript
- Vite
- Plain CSS

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set this in `.env.local`:

```bash
VITE_PUBLIC_APP_URL=https://your-live-url.com
```

## Build

```bash
npm run build
npm run lint
```

## Demo Flow

1. Land on the app and dismiss the welcome modal.
2. Use the personalized prompt or browse the Malaysia-flavoured action list.
3. Complete 2-3 actions and watch points plus streak update.
4. Add a pledge to the community wall.
5. End on the share card and export/share flow.

## Repo Notes

- DEV submission draft: `docs/devto-submission.md`
- LinkedIn copy: `docs/linkedin-post.md`
- Demo script: `docs/demo-script.md`
- Deployment/share notes: `docs/open-and-share.md`
