# Kirana Cakrawala

Company profile site built with [Astro](https://astro.build), content managed in [Sanity](https://www.sanity.io), hosted on [Cloudflare Pages](https://pages.cloudflare.com).

Editors manage everything from the Sanity Studio dashboard mounted at `/admin`: the bands each page is built from (reorder by dragging, switch one off with its Hidden toggle), every string, every picture, and the pillar, article, partner category, and map pin collections.
The site is fully static; publishing in the Studio triggers a rebuild via webhook.

**Editing the site?** You want `docs/EDITING.md`, which assumes no technical knowledge and none of the rest of this file.

## Stack

- **Astro** renders the site as static HTML at build time.
- **Sanity** stores the content and serves the `/admin` dashboard (embedded Studio).
- **Cloudflare Pages** builds and hosts the site (free tier, unlimited bandwidth).
- Images are served straight from Sanity's CDN with on-the-fly resizing via `@sanity/image-url`.

## First-time setup

1. Create a Sanity project: log in at [sanity.io/manage](https://www.sanity.io/manage) and create a new project, or run `npx sanity@latest init --bare` and copy the printed project ID.
2. Copy `.env.example` to `.env` and fill in `PUBLIC_SANITY_PROJECT_ID`.
3. Add CORS origins for the Studio: in [sanity.io/manage](https://www.sanity.io/manage) under **API → CORS origins**, add `http://localhost:4321` (with credentials) and later your production domain.
4. Run `npm run dev` and open `http://localhost:4321` for the site and `http://localhost:4321/admin` for the dashboard.

The dataset already holds the site's content; a fresh project needs it imported (`npx sanity dataset import ./backup.tar.gz production`) before anything will build.
`PUBLIC_SANITY_PROJECT_ID` is required - without it the build stops rather than rendering placeholders.

## Content model

- **Site Settings** (singleton): company name, abbreviation, tagline, the closing-band picture, the main navigation, and the contact details the footer and the Contact page both read.
- **Pages** (six singletons: Home, About Us, What We Do, News & Articles, Partners, Contact Us): each is a title, its SEO fields, and one array of sections. Editors drag to reorder; the site renders whatever order the array is in and skips anything marked Hidden.
- **Collections**: Pillars, Articles, Partner Categories, and Map Pins. The bands that show them hold references, so a pillar's name or picture is edited once and follows everywhere.

`docs/content-model.md` is the full map: what the Studio holds, what the site derives from it at build time, and what stays in code.

To add a new section type: define it in `src/sanity/schemaTypes/sections.ts`, register it in `index.ts` and in the page type's `sections` array in `pages.ts`, add its interface and GROQ projection in the matching `src/content/*.ts` module, and render it in that page's template.

## Deploying, and rebuild on publish

`docs/publishing.md` is the runbook: the Pages project and its three build variables, the deploy hook, the Sanity webhook that calls it (exact filter, projection and payload), the CORS origins, and how to prove the chain works end to end.

The short version: publishing a document in the Studio fires a webhook at a Cloudflare deploy hook, which rebuilds the site from the dataset, and the change is live about two minutes later.

A failed content fetch during a build intentionally fails the deploy, so a Sanity outage can never replace the live site with placeholder content.

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321` (site + `/admin`)    |
| `npm run build`   | Production build to `./dist/`                       |
| `npm run preview` | Preview the production build locally                |
