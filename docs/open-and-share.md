# How To Open And Share EcoHabit.my

## Open locally

```bash
cd "/Users/leo/Desktop/Personal Project/DEV Weekend Challenge_19Apr"
npm install
cp .env.example .env.local
npm run dev
```

Then open the local URL shown in the terminal, usually `http://localhost:5173`.

Set this in `.env.local`:

```bash
VITE_PUBLIC_APP_URL=https://your-live-url.com
```

## Push to GitHub

Recommended if you want:

- a clean code link in your DEV post
- an easy proof-of-build link for LinkedIn
- a backup of the project

Basic flow:

```bash
git add .
git commit -m "Describe your latest change"
git push
```

If you are setting up the repo for the first time:

```bash
git init
git add .
git commit -m "Build EcoHabit.my Earth Day MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Show it on LinkedIn

Best version:

1. Push the repo to GitHub
2. Deploy the app on Vercel or Netlify
3. Post 1 screenshot or a short screen recording
4. Add both the live link and GitHub link

If you do not have time to deploy:

1. Push to GitHub
2. Share a screenshot plus the DEV post link
3. Mention that it was built as a fast hackathon MVP

## Backboard Key

Do not put `BACKBOARD_API_KEY` in frontend Vite env.

Only add `BACKBOARD_API_KEY` when you create a server-side endpoint or serverless function.
For the current frontend-only build, the only required public env var is:

```bash
VITE_PUBLIC_APP_URL=https://your-live-url.com
```
