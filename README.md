
# Company Breakdowns & Valuations — Blog Starter (No-Code Edits)

This is a static site built with **Vite + React + Tailwind**. You can edit posts by changing a single file: **`src/posts.json`** in GitHub's web editor — no coding tools required.

## How to Deploy (Vercel)

1. Create a free GitHub account (if you don’t have one).
2. Create a new repository and upload this folder (or just upload the ZIP).
3. Go to vercel.com → **Add New Project** → **Import GitHub Repo** → select your repo.
4. Framework: **Vite**, Build command: `npm run build`, Output directory: `dist` (Vercel detects automatically).
5. Click **Deploy**. Your site URL will be ready once the build finishes.

## How to Edit Posts (No Code)

- In your GitHub repository, open `src/posts.json`.
- Click the pencil icon to edit in the browser.
- Use the existing posts as templates. Each post supports:
  - `title`, `ticker`, `company`, `sector`, `date`, `tags`, `summary`
  - `valuation` block (`method`, `base`, `current`, `upsidePct`)
  - `content` with `thesis`, `catalysts`, `risks`, `dcf`, `multiples`, `quickMetrics`, `links`
- Commit changes; Vercel will auto-redeploy in ~1–2 minutes.

## Local Preview (optional)

```
npm install
npm run dev
```

## Customisation

- Change the blog title in `src/App.tsx`.
- Replace sample thumbnails with your own images/links.
- Tailwind is set up in `tailwind.config.js` and `src/index.css`.

## Notes

- All data is client-side from `src/posts.json`. If you later want a real CMS (Sanity, Contentful, Notion), you can upgrade easily.
