# Kirana Cakrawala

Company profile site built with [Astro](https://astro.build), content managed in [Sanity](https://www.sanity.io), hosted on [Cloudflare Pages](https://pages.cloudflare.com).

Editors manage everything from the Sanity Studio dashboard mounted at `/admin`: page sections (add, remove, reorder), text, images, and brand colors.
The site is fully static; publishing in the Studio triggers a rebuild via webhook.

## Stack

- **Astro** renders the site as static HTML at build time.
- **Sanity** stores the content and serves the `/admin` dashboard (embedded Studio).
- **Cloudflare Pages** builds and hosts the site (free tier, unlimited bandwidth).
- Images are served straight from Sanity's CDN with on-the-fly resizing via `@sanity/image-url`.

## First-time setup

1. Create a Sanity project: log in at [sanity.io/manage](https://www.sanity.io/manage) and create a new project, or run `npx sanity@latest init --bare` and copy the printed project ID.
2. Copy `.env.example` to `.env` and fill in `PUBLIC_SANITY_PROJECT_ID`.
3. Add CORS origins for the Studio: in [sanity.io/manage](https://www.sanity.io/manage) under **API → CORS origins**, add `http://localhost:4321` (with credentials) and later your production domain.
4. (Recommended) Seed initial content: create a token with Editor permissions under **API → Tokens**, put it in `.env` as `SANITY_WRITE_TOKEN`, and run `npm run seed`.
5. Run `npm run dev` and open `http://localhost:4321` for the site and `http://localhost:4321/admin` for the dashboard.

Until `PUBLIC_SANITY_PROJECT_ID` is set, the site renders placeholder content and `/admin` is not mounted.

## Content model

- **Site Settings** (singleton): company name, tagline, logo, primary/accent colors, footer text.
  Colors flow into the site as CSS variables, so the whole theme follows the dashboard.
- **Page**: a title, a slug, and an array of sections.
  The homepage is the page with slug `home`.
- **Sections**: `Hero`, `About`, `Services`, `Gallery`, `Contact`.
  Editors drag to reorder them; the frontend renders whatever order the array is in.

To add a new section type: define it in `src/sanity/schemaTypes/sections.ts`, register it in `index.ts` and in the `page` schema's `sections` array, add a matching interface in `src/lib/types.ts`, and map it to a component in `src/components/SectionRenderer.astro`.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, create a Pages project from the repo with build command `npm run build` and output directory `dist`.
3. Set the environment variables `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` in the Pages project settings.
4. Add your `*.pages.dev` (and custom) domain to Sanity's CORS origins so `/admin` works in production.

### Rebuild on publish

1. In Cloudflare Pages, create a **Deploy Hook** and copy its URL.
2. In [sanity.io/manage](https://www.sanity.io/manage) under **API → Webhooks**, add a GROQ-powered webhook that POSTs to that URL on create, update, and delete.

Publishing content in the Studio now redeploys the site automatically (typically live within a couple of minutes).

A failed content fetch during a build intentionally fails the deploy, so a Sanity outage can never replace the live site with placeholder content.

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321` (site + `/admin`)    |
| `npm run build`   | Production build to `./dist/`                       |
| `npm run preview` | Preview the production build locally                |
| `npm run seed`    | Create initial Site Settings + homepage in Sanity   |
