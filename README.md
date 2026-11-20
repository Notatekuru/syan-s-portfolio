# Mind Melody

An expressive personal portfolio exploring people through psychology, music, and research. Built as an interactive, responsive experience for Syan.

## Features

- A responsive, editorial-style hero with custom sound-wave artwork and subtle motion
- Interactive mood check-in with mood-matched listening ideas
- Draggable mood notes and a horizontally scrollable project gallery
- A private-feeling, mysterious Chapter 18 project card that links to its separate experience
- Expandable research questions and a live music-and-mood slider
- Keyboard-friendly section navigation, reduced-motion support, and responsive layouts
- Social links for GitHub, Instagram, and email

## Tech stack

- Next.js 16 (App Router)
- React 19 and TypeScript
- Tailwind CSS 4
- Lucide React icons
- Vercel Analytics

## Preview

[Open the deployed site](https://your-domain.vercel.app) — replace this placeholder after deploying to Vercel.

## Run locally

Requires Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open (https://syan-s-portfolio.vercel.app/) in your browser.

## Export static HTML

Build the static site with `pnpm build`. The HTML entry point and its required assets will be written to `out/`.
Serve that folder over HTTP (for example, with Python 3):

```bash
python -m http.server 8000 --directory out
```

Then open (https://syan-s-portfolio.vercel.app/)0). The page is pre-rendered HTML with local JavaScript and CSS assets; it is not a single-file HTML document.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in the [Vercel dashboard](https://vercel.com/new).
3. Keep the detected Next.js settings and deploy. No environment variables are required for the portfolio.

Vercel automatically creates deployments for future pushes to the connected repository.
