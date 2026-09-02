# Content model

The map between `src/content/*.ts` - the typed modules the site still renders from today - and the Sanity schema in `src/sanity/schemaTypes/`.
The modules were migrated into the dataset 1:1 by `scripts/seed-from-modules.mjs`; the pages are rewired to fetch from Sanity in a later bead.
Read this before changing either side, so the two stay describable as the same content.

## Shape

Seven documents there is exactly one of, and four collections there are many of.

| Sanity type | Document id | Comes from |
| --- | --- | --- |
| `siteSettings` | `siteSettings` | `home.companyName`, `brandAbbr`, `tagline`, `nav`, `contact`, and `whatWeDo.ctaImage` |
| `homePage` | `homePage` | `home` |
| `aboutPage` | `aboutPage` | `about.aboutPage` |
| `whatWeDoPage` | `whatWeDoPage` | `whatWeDo.whatWeDoIndex` + `whatWeDo.otherPillarsGrid` |
| `newsPage` | `newsPage` | `news.newsIndex` + `news.continueReading` |
| `partnersPage` | `partnersPage` | `partners.partnersPage` |
| `contactPage` | `contactPage` | `contact.contactPage` |
| `pillar` | `pillar-<pillarId>` | `whatWeDo.pillarPages` |
| `article` | `article-<slug>` | `news.articles` |
| `partnerCategory` | `partnerCategory-<categoryId>` | `partners.partnerCategories` |
| `mapPin` | `mapPin-<slugified name>` | `home.ecosystem.network` and `home.ecosystem.hq` |

A page document is `title`, `metaTitle`, `metaDescription`, and one `sections` array.
Sections are typed objects, so a page can be reordered by dragging and a band can be switched off with its `hidden` toggle without losing its content.
Every section type is listed in `src/sanity/schemaTypes/sections.ts`, and each page type declares which of them it may hold.

| Page | Sections, in seeded order |
| --- | --- |
| Home | `homeHeroSection`, `whoWeAreSection`, `pillarGridSection`, `ecosystemSection`, `commitmentSection`, `newsTeaserSection` |
| About Us | `pageHeroSection`, `aboutIntroSection`, `aboutVisionSection`, `aboutMissionSection`, `aboutGovernanceSection`, `pillarGridSection`, `ctaSection` |
| What We Do | `pageHeroSection`, `pillarGridSection`, `ctaSection` |
| News & Articles | `pageHeroSection`, `articleFeedSection`, `ctaSection` |
| Partners | `pageHeroSection`, `overviewSection`, `partnerCategoriesSection`, `networkSection`, `pillarGridSection`, `ctaSection` |
| Contact Us | `pageHeroSection`, `contactChannelsSection`, `inquirySection`, `officeSection`, `ctaSection` |

The pillar pages under `/what-we-do` and the article pages under `/news` are rendered from the `pillar` and `article` collections, not from section arrays: their templates are fixed.
The copy their templates share sits on the hub page that owns them - `whatWeDoPage.otherPillarsHead` and `newsPage.continueReadingHead` - so the four pillar pages, and the six article pages, cannot drift apart.

## What is in Sanity, and what stays in code

**In Sanity:** every string, list, and picture the site renders as content, plus the order of the sections, pillars, partner categories, and map pins.

**Derived at build time, from Sanity data:**

- Reading time, related and adjacent articles, and the newest-first ordering of the archive.
- `mailto:` and `tel:` links, the map embed and directions URLs, and the address split into lines - all from `siteSettings.contact`.
- Date formatting, and the `01`-style counters from a pillar's or category's `order`.
- The `<title>` and description of a pillar or article page, from its own name and standfirst or excerpt.
- The closing band that ends each pillar page and each article, from `pillar.cta` plus `siteSettings.ctaImage`.
- The hero eyebrow of an inner page, from the page's `title`; its crumb, from `siteSettings.brandAbbr`.
- A contact card's value and link, from its `kind` and `siteSettings.contact`, so the card and the footer can never disagree.

**Interface micro-copy stays in the components:** button chrome and state labels such as `min read`, `Filter`, `Copy link`, `Newer` / `Older`, `Explore pillar`, `Next:`, and the inquiry form's sending, sent, and failed messages.
These are interface, not content, and putting fifty of them in the Studio would bury the copy that matters.
Every button whose label is part of the page's argument - every hero and closing-band button - is a `navItem` in Sanity and fully editable.

**Copied rather than referenced.**
The modules derive some strings from others so they can never disagree; in the dataset those are seeded as their own editable fields.
A mission point is printed both on the About page's mission list and on the page that expands it, and the schema says so in the field description.
Change both together.

## Images

Every picture is a `sourcedImage`: the asset, its `alt` text, and the `sourceUrl` recording where the file came from.
`IMAGE-SOURCES.md` stays the human record; the `sourceUrl` field carries the same fact next to the image itself.
The seed uploads each file in `public/images/` once - Sanity keys assets by content hash, so re-running it reuses what is already there.

## Ids and keys

Document ids are stable and readable, and array item keys are derived from the content (`nav-1`, `capability-3`, `mission-6`, `b4` for the fifth body block).
Both are chosen so a second seed run addresses the same documents and the same array items rather than making new ones.

## Seeding

```
npm run seed                 # create anything missing, leave existing edits alone
npm run seed -- --replace    # overwrite every document with the module content
npm run seed -- --dry-run    # build and report the documents, write nothing
```

The seed bundles the six TypeScript modules with esbuild (`scripts/load-content.mjs`), because they import each other without file extensions and Node cannot read them directly.
After writing, it reads every document back and compares it field by field against the modules, and exits non-zero if a document it created does not match.
A document that differs because it was edited in the Studio is reported as such, and left alone.

## Verifying the model

```
npx astro check && npm run build                                  # types and a production build
npx sanity schema validate                                        # the Studio schema itself
SANITY_AUTH_TOKEN=$SANITY_WRITE_TOKEN npx sanity documents validate --yes
```

The last one downloads every document in the dataset, checks that every reference resolves, and validates each document against the schema - the machine-readable form of "open the Studio and check it is all there and editable".
It reads `sanity.cli.ts`, which needs `PUBLIC_SANITY_PROJECT_ID` in the environment (`set -a; . ./.env; set +a`).

`http://localhost:4321` is registered as a CORS origin on project `ipx0k2h7`, so the Studio at `localhost:4321/admin` can talk to the dataset.
A deployed origin needs its own entry: `npx sanity cors add https://<host> --credentials`.
