# Kirana Cakrawala (KCA)

Company profile site for KCA, an integrated aviation aftermarket partner (parts, component MRO, technical services, global supply network).
Astro 7, static output, hosted on Cloudflare Pages.
The Sanity dataset is the only content there is: every page fetches it at build time, and the Studio at `/admin` is the dashboard the site is edited from.
Copy, pictures, the order of the bands on a page, and whether a band shows at all are all edited there - `docs/content-model.md` is the field-by-field map of what lives where.
The modules under `src/content/` are types and GROQ queries only; there is no content in the repo and no fallback, so a fetch that fails or a document that is missing fails the build rather than publishing a page with a hole in it.

Read `docs/positioning.md` before writing any copy - it is the single source of truth for vision, mission, positioning, and commitment lines.
KCA is NOT a defense company: its sister company KCN (kiranacakra.co.id) is a layout reference only, and KCN must not be mentioned in site copy.
Plain dashes in prose, never the em dash character.

## Verify

```
npx astro check && npm run build
```

Both must exit zero before any work is considered done.
Work that touches `src/sanity/` adds `npx sanity schema validate` and, with the env sourced, `SANITY_AUTH_TOKEN=$SANITY_WRITE_TOKEN npx sanity documents validate --yes` - see `docs/content-model.md`.
The build reads the dataset, so it needs `PUBLIC_SANITY_PROJECT_ID` in `.env`; no token is required to read.
There is no test suite yet, so this verifies types and a production build - nothing more.
Then open the page in Chrome (dev server: `astro dev --background`, site at `localhost:4321`) and scroll it top to bottom at desktop and phone widths; be picky about what you see.

## Layout

- `src/lib/sanity.ts` - the one connection to the dataset: the client, the `IMAGE` projection, `fetchDocument` / `fetchList` (which throw, naming the missing document, rather than returning nothing), and `once`, which fetches each document a single time per build. Every picture is resolved to a Sanity CDN url through `@sanity/image-url` here, so components only ever see `{ src, alt, sourceUrl }`.
- `src/content/home.ts` - the shared vocabulary every other module builds on: the routes, the small repeated shapes (`NavItem`, `SourcedImage`, `SectionIntro`, `PillarSummary`, `MapPin`), the GROQ fragments that project them, `visibleSections`, `pageQuery`, the derived-link helpers (`telHref`, `mailHref`, `addressLines`, `locality`, `pad`), `getSiteSettings`, and the homepage's own sections and `getHomePage`. The other five modules import from it and never from each other.
- `src/pages/index.astro` - the homepage: it renders the bands the Home page holds in Sanity, in the stored order, skipping the hidden ones. Every page singleton follows this shape - fetch the page and Site Settings, map `visibleSections(page.sections)` onto one component per `_type`.
- `src/content/what-we-do.ts` - the What We Do seam: `getWhatWeDoPage()` for the hub singleton (`/what-we-do`) and `getPillars()` for the Pillar collection, whose four documents expand missions 1-4. A pillar page is a fixed template, not a section array, so the copy the four share - the head of their cross-link band - sits on the hub as `otherPillarsHead` and cannot drift. `src/pages/what-we-do/[slug].astro` is that template (its `getStaticPaths` fetches the collection); sections live in `src/components/what-we-do/` (`PillarHero`, `PillarSwitcher`, `PillarOverview`, `PillarCapabilities`, `PillarProcess`, `PillarGrid`, `PillarCta`) and take their data as props.
- `src/content/news.ts` - the News & Articles seam: `getArticles()` (the collection, newest first) and `getNewsPage()` (the listing singleton, plus the `continueReadingHead` every article's cross-link band uses). An article `body` is Portable Text, so an editor gets paragraphs, headings, bullets, bold, italics, and links, with a pull quote as its own block type; `ArticleBody` groups consecutive bullet blocks back into one list and renders each block's runs through `ArticleSpans`. Reading time, the archive order, and the related and adjacent articles are derived from the collection, never stored. `articleCta` closes an article on its pillar's band, or on the listing page's band for company news. `src/pages/news/index.astro` is the listing (`PillarHero`, `ArticleFeed` with its client-side category filter, `PillarCta`); `src/pages/news/[slug].astro` the article template. Sections and the shared `ArticleCard` live in `src/components/news/`. The homepage teaser renders the newest articles, cut to the `count` its section stores.
- `src/content/partners.ts` - the Partners seam: `getPartnersPage()`. The seven partner categories (mission 5 - what the integrated ecosystem means for OEMs, airlines, MROs, lessors, operators, financial institutions, and aviation investors; no company names or logos) and the map pins are collections, resolved through the references on the bands that show them, so the tabs here, the homepage marquee, and the dotted map read the same documents. A category is deep-linked as `/partners#<key>`, which opens its tab. `src/pages/partners/index.astro` composes `PillarHero`, `PillarOverview`, `PartnerCategories` (the tabbed category index/panel, deep-linkable by hash), `PartnerNetwork` (the dotted map, larger, with HQ-to-region arcs), `PillarGrid` (all four pillars) and `PillarCta`. Sections live in `src/components/partners/`; `NetworkMap` there is the one dotted-map component - the homepage `Partners` section renders it too.
- `src/content/contact.ts` - the Contact seam: `getContactPage()`, `contactLabels` (form states: sending, sent, failed, not connected), `inquiryForm(settings)` (the Web3Forms endpoint and subject), and the `mapEmbedUrl` / `directionsUrl` helpers (keyless Google Maps, geocoding the printed address). The address, mailbox, and number are never stored twice: a channel card says which detail from Site Settings it shows (`kind`), and `contactChannels()` derives its value and its link from there, so the cards, the footer, and the map cannot disagree. The inquiry form's fields, its dropdown options, and both asides are stored on the band and edited in the Studio. `src/pages/contact/index.astro` composes `PillarHero`, `ContactChannels`, `ContactForm`, `ContactOffice`, and `PillarCta`; sections live in `src/components/contact/`. The form posts JSON to Web3Forms with the `botcheck` honeypot; the page reads `PUBLIC_WEB3FORMS_KEY` at build time (public, send-only; set in `.env` locally and in the Cloudflare Pages build environment, placeholder in `.env.example`) and when it is empty the form renders with a visible "not yet connected" notice and a disabled submit rather than failing silently.
- `src/content/about.ts` - the About seam: `getAboutPage()` and the `MISSION_ANCHOR` / `GOVERNANCE_ANCHOR` in-page targets. Its bands are the core positioning verbatim as a scroll-lit statement with an "At a Glance" facts card, the vision and its three outcomes, all seven mission points (each with the link to the page that expands it), and mission 6 expanded into six principle cards beside a reference to the quality article. A mission point is printed both here and on the page that expands it, and the schema says so in the field description - change both together. `src/pages/about/index.astro` composes `PillarHero`, `AboutIntro`, `AboutVision` (navy band, image under tint, white `lightWords`), `AboutMission` (desktop: sticky head with a scroll-tied counter and rail, the row at the reading line lit; mobile: stacked rows), `AboutGovernance` (navy band, six cards), `PillarGrid` (all four pillars) and `PillarCta`; sections live in `src/components/about/`. The homepage `WhoWeAre` section and hero secondary button link into `/about`.
- `PillarHero`, `PillarOverview` (takes an `OverviewContent`), and `PillarCta` (in `src/components/what-we-do/`) are the shared inner-page hero, mission overview, and closing band - reuse them on new pages rather than writing another.
- `src/layouts/HomeLayout.astro` - the site shell: sticky header with nav (desktop links + mobile overlay menu), footer with contact block. It awaits `getSiteSettings()` itself, so no page has to thread the brand, the nav, or the contact details through it. Every page uses it.
- `src/components/home/` - the homepage sections: `Hero`, `WhoWeAre`, `Domains` (four pillar panels, pinned on desktop), `Partners` (the shared `NetworkMap` + a category marquee linking into `/partners`), `Commitment`, `News`. Reuse their patterns and CSS vocabulary; new page sections go in `src/components/<page>/`.
- `src/lib/motion.ts` - GSAP setup and the ONLY entry points for animation: `motionReady` (desktop/mobile/reduced-motion contexts), `revealUp` (house scroll entrance), `scrambleIn` (label decode), `lightWords` (scroll-lit statement; pass `from`/`to` on navy bands), `whenVisible`, `REVEAL_START`.
- `src/styles/global.css` - design tokens (`--navy`, `--orange`, `--blue`, `--slate`, fonts, easings), `.container`, `.section`, `.section-label`, `.band-navy`, `.btn` system.
- `docs/positioning.md` - KCA copy source of truth. `docs/content-model.md` - what the Studio holds, what the site derives from it, and what stays in code; read it before changing the schema or a query. `docs/publishing.md` - how an edit becomes a live page: the Cloudflare deploy hook, the Sanity webhook that calls it, the CORS origins, and the end-to-end check. `docs/EDITING.md` - the same pipeline from the editor's side, written for a non-technical reader; keep it in step whenever a schema change alters what the Studio asks of them. `IMAGE-SOURCES.md` - every placeholder image's origin and license; update it whenever an image is added or replaced (the `sourceUrl` on each image in the Studio carries the same fact).
- `src/sanity/schemaTypes/` - the content model: `objects.ts` (the small repeated shapes), `sections.ts` (every band a page is built from, each with a `hidden` toggle), `documents.ts` (Site Settings and the pillar, article, partner category, and map pin collections), `pages.ts` (the six page singletons, each holding one reorderable `sections` array). `src/sanity/structure.ts` is the Studio's left-hand list; `sanity.config.ts` wires them together and pins the singletons; `sanity.cli.ts` is what the `sanity` CLI reads.
- `public/_redirects` - Cloudflare Pages SPA rewrite for Studio deep links; keep it.

## Design system (established by the homepage - inherit it, do not reinvent)

- Light ground with ILS hues: navy `#011E41` for headings and full-bleed `.band-navy` sections, orange `#F99C24` accent (section labels, CTAs, pins), blue `#0082CA` secondary, slate `#67788D` muted text; `--danger` exists for form validation only. Use the CSS variables, never hard-coded colors.
- Type: Cousine (mono, uppercase) for headings, labels, buttons, dates; Montserrat for body. Section labels use `.section-label` (renders the `/ LABEL` prefix).
- Buttons: `.btn.btn-primary` / `.btn.btn-ghost` with a trailing `<span class="btn-arrow">›</span>`. Stripe-style: color shift + chevron slide on hover, scale press. No magnetic effects, no ripples.
- Motion: every section animates on scroll through `revealUp` (fade-up, `REVEAL_START` trigger, 30-90ms staggers ordered by importance) inside a `motionReady` context, so reduced-motion visitors get a static page. Hover effects only inside `@media (hover: hover) and (pointer: fine)`. Press feedback on everything clickable. Keep UI motion under ~300ms; custom easing tokens `--ease-out-expo` / `--ease-out-quad`.
- Mobile: content on white first, imagery full-bleed below it; never put text over a dark image without a tint. Pinned/scroll-linked effects are desktop-only; mobile gets stacked cards with simple entrances.
- Images: free-license only (Wikimedia Commons PD/CC0/CC BY, Unsplash), aviation-aftermarket context, no visible airline or military livery/branding. Log every image in `IMAGE-SOURCES.md`.

## Conventions

- A page module exposes types and a `get<Page>()` and holds no copy. A component takes the section it renders as a prop and reads no module data of its own, so what a band shows is decided by the document, not by the component.
- Interface micro-copy - button chrome and state labels such as `min read`, `Filter`, `Copy link`, `Newer` / `Older`, `Explore pillar`, `Next:`, and the form's sending, sent, and failed messages - stays in code, in the `*Labels` objects. Every button whose label is part of the page's argument is a link in Sanity and fully editable.
- Nav hrefs in Site Settings are absolute so the shared header and footer resolve from inner pages; every entry is a real route (`/about`, `/what-we-do`, `/partners`, `/news`, `/contact`). The route constants and the `aboutLink` / `contactLink` destinations live in `src/content/home.ts`, so they change in one place.
- Shared header/footer live in `HomeLayout.astro`; page titles are `"<Page> - Kirana Cakrawala"`.
- Scoped `<style>` per component; shared utilities in `global.css`. Only `transform` and `opacity` animate.
- `?static=1` on any URL renders the page with no animation (final states) - use it for layout screenshots.

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.
The site is at `localhost:4321`, the Studio at `localhost:4321/admin` (that origin is registered for CORS on project `ipx0k2h7`; a deployed origin needs its own).
A build reads the dataset live, so a change published in the Studio shows up on the next build - the dev server refetches on reload.
There is no seed script any more: the dataset is the content, and `npx sanity dataset export` is how it is backed up.

## Documentation

Astro: https://docs.astro.build - [Routing](https://docs.astro.build/en/guides/routing/), [Components](https://docs.astro.build/en/basics/astro-components/), [Styling](https://docs.astro.build/en/guides/styling/).
GSAP: https://gsap.com/docs/v3/ - ScrollTrigger and SplitText are the plugins in use.
