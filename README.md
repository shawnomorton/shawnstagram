# Brandgram — Instagram-style UGC Portfolio

A static portfolio site styled like an Instagram profile. The home feed is a grid of **brands** you've worked with; clicking a brand opens its own "profile page" with the photos, videos, and stories you created for them.

No build step, no dependencies — just HTML/CSS/JS, so it deploys straight to GitHub Pages.

## Structure

```
├── index.html          Home page (your profile + brand grid)
├── brand.html          Brand page (rendered from the URL: brand.html?b=<slug>)
├── config.js           ★ THE ONLY FILE YOU EDIT — all your content lives here
├── favicon.svg
├── assets/
│   ├── css/style.css
│   └── js/             shared.js (viewers), home.js, brand.js
└── content/            Your media, one folder per brand
    ├── profile.jpg
    └── <brand-slug>/   logo.jpg, cover.jpg, posts, stories, videos...
```

## Adding your content

1. **Your profile** — edit the `profile` object in `config.js` (username, bio, avatar, website) and replace `content/profile.jpg`.

2. **A brand** — create a folder in `content/` and add an object to the `brands` array:

```js
{
  slug: "acme",                          // becomes the URL: brand.html?b=acme
  name: "Acme Skincare",
  handle: "acmeskincare",
  logo: "content/acme/logo.jpg",         // brand page avatar
  cover: "content/acme/cover.jpg",       // home grid tile
  location: "Lisbon, Portugal",
  description: "What you delivered for them.",
  deliverables: "3 reels · 8 photos",    // shown on the home tile
  link: "https://acme.com",              // "" hides the button
  stories: [
    { type: "image", src: "content/acme/story1.jpg" },
    { type: "video", src: "content/acme/story2.mp4" },
  ],
  posts: [
    { type: "image", src: "content/acme/post1.jpg", caption: "..." },
    { type: "video", src: "content/acme/reel1.mp4",
      thumb: "content/acme/reel1_thumb.jpg", caption: "..." },
  ]
}
```

3. Delete the placeholder demo brands and images in `content/` when you're done.

### Media tips

- **Posts**: square (1:1) or 4:5 crops look best in the grid
- **Stories**: vertical 9:16 (1080×1920)
- **Video posts**: always include a `thumb` image so the grid loads fast; keep files under ~50 MB (over 100 MB won't push to GitHub without Git LFS)
- Compress videos with HandBrake or `ffmpeg` (H.264 MP4 plays everywhere)

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `my-portfolio`)
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/my-portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**
4. Your site goes live at `https://yourusername.github.io/my-portfolio/` in a minute or two

To preview locally, run `python3 -m http.server` in the folder and open `http://localhost:8000`.

## Features

- Home feed = brand gallery with logo + deliverables overlay
- Per-brand pages with post grid, video support, and captions
- Full-screen story viewer with auto-advancing progress bars (images 5s, videos play through; tap left/right or use arrow keys)
- Lightbox post viewer with prev/next navigation
- Fully responsive (mobile looks like the real app)
- Keyboard accessible; Escape closes viewers

## A note on the design

This intentionally mimics Instagram's layout as a portfolio device (like [huntergram](https://hunterirving.com/huntergram)). The footer includes a "not affiliated with Instagram" line — keep it there. Avoid using Instagram's actual name, logo, or wordmark.
