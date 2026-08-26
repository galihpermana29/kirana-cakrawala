# Kirana Cakrawala

Company profile site: Astro 7 (static output) + Sanity CMS (Studio embedded at `/admin`) + Cloudflare Pages hosting.
Content lives in Sanity project `ipx0k2h7`, dataset `production`; pages are arrays of typed section blocks that editors reorder in the Studio.

## Verify

```
npx astro check && npm run build
```

Both commands must exit zero before any work is considered done.
There is no test suite yet, so this verifies types and a production build - nothing more.
The build fetches live content from Sanity when `PUBLIC_SANITY_PROJECT_ID` is set in `.env`; a content fetch failure fails the build on purpose (never weaken this - it protects deploys from silently shipping placeholder content).

## Layout

- `src/pages/index.astro` - the homepage; fetches Site Settings + the page with slug `home`.
- `src/components/` - one component per section type, mapped in `SectionRenderer.astro`.
- `src/layouts/Layout.astro` - HTML shell, header/footer, injects CMS colors as CSS variables.
- `src/lib/cms.ts` - Sanity client + GROQ queries; `fallback.ts` is the placeholder content used when Sanity is unconfigured or empty; `types.ts` mirrors the schemas; `image.ts` builds Sanity CDN image URLs.
- `src/sanity/schemaTypes/` - the content model (`siteSettings`, `page`, section objects in `sections.ts`).
- `sanity.config.ts` - the embedded Studio (structure tool with Site Settings singleton, color input plugin).
- `scripts/seed.mjs` - idempotent initial-content seeder (`npm run seed`, needs `SANITY_WRITE_TOKEN`).
- `public/_redirects` - Cloudflare Pages SPA rewrite for Studio deep links; keep it.

## Conventions

- Adding a section type touches four places, always together: define it in `src/sanity/schemaTypes/sections.ts`, register it in `schemaTypes/index.ts` and in `page.ts`'s `sections` array, add its interface to `src/lib/types.ts` (and the `Section` union), and map it to a component in `SectionRenderer.astro`.
- Every image field is optional; components must render sensibly with `image?.asset` absent, and must guard with `image?.asset` before calling `urlFor()`.
- Images are served from Sanity's CDN via `urlFor(...).width(...).url()` - never through `astro:assets`.
- Theme colors come only from the CSS variables in `src/styles/global.css` (`--color-primary`, `--color-accent`, etc.), overridden per-site by Sanity Site Settings in `Layout.astro`; never hard-code brand colors in components.
- Styles are scoped `<style>` blocks in each `.astro` component; shared utility classes (`.container`, `.section`, `.button`) live in `global.css`.
- Plain dashes in prose, never the em dash character.

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.
The site is at `localhost:4321`, the Studio at `localhost:4321/admin`.

## Documentation

Full Astro documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)

Sanity: https://www.sanity.io/docs - schema types, GROQ, and the image URL builder are the relevant areas.
