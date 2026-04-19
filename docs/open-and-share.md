# How To Open And Share EcoHabit.my

## Open locally

```bash
cd "/Users/leo/Desktop/Personal Project/DEV Weekend Challenge_19Apr"
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually `http://localhost:5173`.

## Push to GitHub

Recommended if you want:

- a clean code link in your DEV post
- an easy proof-of-build link for LinkedIn
- a backup of the project

Basic flow:

```bash
git init
git add .
git commit -m "Build EcoHabit.my Earth Day MVP"
git branch -M main
git remote add origin <your-github-repo-url>
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
