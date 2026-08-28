# Kirana Cakrawala (KCA)

Company profile site for KCA, an integrated aviation aftermarket partner (parts, component MRO, technical services, global supply network).
Astro 7, static output, hosted on Cloudflare Pages.
Content is hardcoded in typed modules for now; a Sanity Studio is scaffolded at `/admin` but the site does NOT render from it yet (that wiring is a future bead).

Read `docs/positioning.md` before writing any copy - it is the single source of truth for vision, mission, positioning, and commitment lines.
KCA is NOT a defense company: its sister company KCN (kiranacakra.co.id) is a layout reference only, and KCN must not be mentioned in site copy.
Plain dashes in prose, never the em dash character.

## Verify

```
npx astro check && npm run build
```

Both must exit zero before any work is considered done.
There is no test suite yet, so this verifies types and a production build - nothing more.
Then open the page in Chrome (dev server: `astro dev --background`, site at `localhost:4321`) and scroll it top to bottom at desktop and phone widths; be picky about what you see.

## Layout

- `src/content/home.ts` - the homepage content seam: typed interfaces + data. Inner pages follow the same pattern: one typed module per page under `src/content/`, components read from it and nothing else.
- `src/pages/index.astro` - the homepage, composing `src/components/home/*` sections inside `HomeLayout`.
- `src/content/what-we-do.ts` - the What We Do seam: the hub (`/what-we-do`) plus the four pillar pages (`PillarPage[]`, one per homepage pillar id, expanding missions 1-4). `src/pages/what-we-do/[slug].astro` is the single template; `src/pages/what-we-do/index.astro` the hub; sections live in `src/components/what-we-do/` (`PillarHero`, `PillarSwitcher`, `PillarOverview`, `PillarCapabilities`, `PillarProcess`, `PillarGrid`, `PillarCta`) and take the pillar as a prop.
- `src/content/news.ts` - the News & Articles seam: one flat `Article[]` (newest first; `body` is typed blocks - paragraph, heading, list, quote - that map onto Portable Text), `categoryLabels`, date helpers (`shortDate` for cards, `longDate` for article meta), and `articleCta` (each article closes on its related pillar's CTA). `src/pages/news/index.astro` is the listing (`PillarHero`, `ArticleFeed` with its client-side category filter, `PillarCta`); `src/pages/news/[slug].astro` the article template (`ArticleHero`, `ArticleBody`, `ArticleGrid`, `PillarCta`). Sections and the shared `ArticleCard` live in `src/components/news/`. The homepage `News` teaser renders `latestArticles(3)` from this module; `home.ts` holds only the teaser's head.
- `src/content/partners.ts` - the Partners seam: `partnerCategories` (`PartnerCategory[]`, one per `home.ecosystem.categories` entry, expanding mission 5 - what the integrated ecosystem means for OEMs, airlines, MROs, lessors, operators, financial institutions, and aviation investors; no company names or logos), `partnersPage` (hero, overview, section heads, CTA), `partnersLabels`, and `categoryHref(id)` (`/partners#<id>` opens that category's tab). `src/pages/partners/index.astro` composes `PillarHero`, `PillarOverview`, `PartnerCategories` (the tabbed category index/panel, deep-linkable by hash), `PartnerNetwork` (the dotted map, larger, with HQ-to-region arcs), `PillarGrid` (all four pillars) and `PillarCta`. Sections live in `src/components/partners/`; `NetworkMap` there is the one dotted-map component - the homepage `Partners` section renders it too.
- `src/content/contact.ts` - the Contact seam: `contactPage` (hero, `channels` - email, phone, head office as cards - the `inquiry` form definition as typed `FormField[]` plus its "what happens next" and "still exploring" asides, `office`, and a CTA back into What We Do and Partners), `contactLabels` (form states: sending, sent, failed, not connected), `inquiryForm` (the Web3Forms endpoint and subject), `inquiryTypes` (pillars + partnership + general), and the `mapEmbedUrl` / `directionsUrl` helpers (keyless Google Maps, geocoding the printed address). `src/pages/contact/index.astro` composes `PillarHero`, `ContactChannels`, `ContactForm`, `ContactOffice`, and `PillarCta`; sections live in `src/components/contact/`. The form posts JSON to Web3Forms with the `botcheck` honeypot; the page reads `PUBLIC_WEB3FORMS_KEY` at build time (public, send-only; set in `.env` locally and in the Cloudflare Pages build environment, placeholder in `.env.example`) and when it is empty the form renders with a visible "not yet connected" notice and a disabled submit rather than failing silently.
- `src/content/about.ts` - the About seam: `aboutPage` (hero, `intro` - the core positioning, both lines verbatim, as a scroll-lit statement, two paragraphs, and an "At a Glance" facts card linking to Partners - `vision` with the statement verbatim and its three outcomes, `mission` with all seven points as `Mission[]` where 1-4 are read from the pillar pages and 5 from `partnersPage` so the wording never drifts and each row links to the page that expands it, `governance` - mission 6 expanded into six `Principle` cards plus a link to the quality article - the pillars grid head, and a CTA into Contact and What We Do), `aboutLabels`, and the `MISSION_ANCHOR` / `GOVERNANCE_ANCHOR` in-page targets. `src/pages/about/index.astro` composes `PillarHero`, `AboutIntro`, `AboutVision` (navy band, image under tint, white `lightWords`), `AboutMission` (desktop: sticky head with a scroll-tied counter and rail, the row at the reading line lit; mobile: stacked rows), `AboutGovernance` (navy band, six cards), `PillarGrid` (all four pillars) and `PillarCta`; sections live in `src/components/about/`. The homepage `WhoWeAre` section and hero secondary button link into `/about`.
- `PillarHero`, `PillarOverview` (takes an `OverviewContent`), and `PillarCta` (in `src/components/what-we-do/`) are the shared inner-page hero, mission overview, and closing band - reuse them on new pages rather than writing another.
- `src/layouts/HomeLayout.astro` - the live site shell: sticky header with nav (desktop links + mobile overlay menu), footer with contact block. Inner pages use this layout. (`Layout.astro` is the legacy Sanity-era shell; do not use it for new pages.)
- `src/components/home/` - the homepage sections: `Hero`, `WhoWeAre`, `Domains` (four pillar panels, pinned on desktop), `Partners` (the shared `NetworkMap` + a category marquee linking into `/partners`), `Commitment`, `News`. Reuse their patterns and CSS vocabulary; new page sections go in `src/components/<page>/`.
- `src/lib/motion.ts` - GSAP setup and the ONLY entry points for animation: `motionReady` (desktop/mobile/reduced-motion contexts), `revealUp` (house scroll entrance), `scrambleIn` (label decode), `lightWords` (scroll-lit statement; pass `from`/`to` on navy bands), `whenVisible`, `REVEAL_START`.
- `src/styles/global.css` - design tokens (`--navy`, `--orange`, `--blue`, `--slate`, fonts, easings), `.container`, `.section`, `.section-label`, `.band-navy`, `.btn` system.
- `docs/positioning.md` - KCA copy source of truth. `IMAGE-SOURCES.md` - every placeholder image's origin and license; update it whenever an image is added or replaced.
- `src/lib/cms.ts`, `src/lib/types.ts`, `src/sanity/`, `sanity.config.ts`, `scripts/seed.mjs`, `src/components/*.astro` (top level) - the Sanity scaffold. Leave it alone; it is not wired to the live pages.
- `public/_redirects` - Cloudflare Pages SPA rewrite for Studio deep links; keep it.

## Design system (established by the homepage - inherit it, do not reinvent)

- Light ground with ILS hues: navy `#011E41` for headings and full-bleed `.band-navy` sections, orange `#F99C24` accent (section labels, CTAs, pins), blue `#0082CA` secondary, slate `#67788D` muted text; `--danger` exists for form validation only. Use the CSS variables, never hard-coded colors.
- Type: Cousine (mono, uppercase) for headings, labels, buttons, dates; Montserrat for body. Section labels use `.section-label` (renders the `/ LABEL` prefix).
- Buttons: `.btn.btn-primary` / `.btn.btn-ghost` with a trailing `<span class="btn-arrow">›</span>`. Stripe-style: color shift + chevron slide on hover, scale press. No magnetic effects, no ripples.
- Motion: every section animates on scroll through `revealUp` (fade-up, `REVEAL_START` trigger, 30-90ms staggers ordered by importance) inside a `motionReady` context, so reduced-motion visitors get a static page. Hover effects only inside `@media (hover: hover) and (pointer: fine)`. Press feedback on everything clickable. Keep UI motion under ~300ms; custom easing tokens `--ease-out-expo` / `--ease-out-quad`.
- Mobile: content on white first, imagery full-bleed below it; never put text over a dark image without a tint. Pinned/scroll-linked effects are desktop-only; mobile gets stacked cards with simple entrances.
- Images: free-license only (Wikimedia Commons PD/CC0/CC BY, Unsplash), aviation-aftermarket context, no visible airline or military livery/branding. Log every image in `IMAGE-SOURCES.md`.

## Conventions

- Nav hrefs in `src/content/home.ts` are absolute so the shared header and footer resolve from inner pages; every entry is a real route (`/about`, `/what-we-do`, `/partners`, `/news`, `/contact`). Inner pages link out through `aboutLink` and `contactLink` in `src/content/what-we-do.ts`, so those two routes change in one place.
- Shared header/footer live in `HomeLayout.astro`; page titles are `"<Page> - Kirana Cakrawala"`.
- Scoped `<style>` per component; shared utilities in `global.css`. Only `transform` and `opacity` animate.
- `?static=1` on any URL renders the page with no animation (final states) - use it for layout screenshots.

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.
The site is at `localhost:4321`, the Studio at `localhost:4321/admin`.

## Documentation

Astro: https://docs.astro.build - [Routing](https://docs.astro.build/en/guides/routing/), [Components](https://docs.astro.build/en/basics/astro-components/), [Styling](https://docs.astro.build/en/guides/styling/).
GSAP: https://gsap.com/docs/v3/ - ScrollTrigger and SplitText are the plugins in use.
