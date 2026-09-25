# jameskidd.info

Personal site: a one-page resume plus a personal page. Next.js (App Router),
TypeScript, Tailwind v4, deployed on Vercel from this repo.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # what Vercel runs
npm run lint
npm run typecheck
```

Requires Node 20.9 or newer.

## Where things live

| Folder | What it is |
|---|---|
| `content/` | **Everything you edit.** One typed file per part of the site. |
| `tokens/tokens.json` | Colours, fonts, radii, type scale. Names match the Figma variables. |
| `app/` | Routes: `/` (home), `/personal`, 404, sitemap, robots, global CSS. |
| `components/` | The pieces that render `content/`. |
| `public/` | Photos, `resume.pdf`, favicon, the world atlas for the map. |
| `scripts/build-tokens.mjs` | Turns `tokens.json` into `app/tokens.css`. Runs automatically. |

## How to add a project

1. Open `content/projects.ts`.
2. Add an object to the list, where you want it to appear:

   ```ts
   {
     title: "Name of the thing",
     description: "One or two sentences.",
     tags: ["Python", "PostgreSQL"],
     links: { github: "https://github.com/james-kidd/thing" },
   },
   ```

   `links` takes any of `github`, `live`, `writeup` — at least one. Optional
   extras: `note` (a short phrase next to the title), `image` (drop a file
   in `public/photos/` and set `"/photos/thing.jpg"`), and `embed` (a URL,
   such as a Hugging Face Space, to show as a playable demo in "Try it out").
3. Push. Vercel builds and deploys.

If the object is missing a link or a URL is not `https://…`, `npm run
typecheck` (and the Vercel build) fails and tells you which entry. To remove
a project, delete its object; nothing else references it.

Roles (`experience.ts`), education, skills, milestones, photos and travel
data work the same way: one entry each, in the file named for it.

## Changing a colour or a font size

Edit the value in `tokens/tokens.json`. Colours have a `light` and a `dark`
value. The next `dev` or `build` regenerates `app/tokens.css`; commit both.
