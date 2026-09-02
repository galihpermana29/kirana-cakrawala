# Content model

What the Studio holds, what the site derives from it, and what stays in code.
The dataset is the only content there is: the schema in `src/sanity/schemaTypes/` defines it, the query modules under `src/content/` fetch it, and nothing in the repo duplicates it.
Read this before changing a schema type or a query, so the two stay describable as the same content.

## Shape

Seven documents there is exactly one of, and four collections there are many of.

| Sanity type | Document id | Fetched by |
| --- | --- | --- |
| `siteSettings` | `siteSettings` | `getSiteSettings()` in `src/content/home.ts`, awaited by `HomeLayout` |
| `homePage` | `homePage` | `getHomePage()` |
| `aboutPage` | `aboutPage` | `getAboutPage()` |
| `whatWeDoPage` | `whatWeDoPage` | `getWhatWeDoPage()` |
| `newsPage` | `newsPage` | `getNewsPage()` |
| `partnersPage` | `partnersPage` | `getPartnersPage()` |
| `contactPage` | `contactPage` | `getContactPage()` |
| `pillar` | `pillar-<pillarId>` | `getPillars()`, and the references on every pillar grid |
| `article` | `article-<slug>` | `getArticles()` |
| `partnerCategory` | `partnerCategory-<categoryId>` | the references on the ecosystem and category bands |
| `mapPin` | `mapPin-<slugified name>` | the references on the ecosystem and network bands |

A page document is `title`, `metaTitle`, `metaDescription`, and one `sections` array.
Sections are typed objects, so a page can be reordered by dragging and a band can be switched off with its `hidden` toggle without losing its content.
Every section type is listed in `src/sanity/schemaTypes/sections.ts`, and each page type declares which of them it may hold.
The page templates render `visibleSections(page.sections)` in array order and map each `_type` onto one component, so both the order and the toggle take effect on the next build.

| Page | Sections, in their current order |
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

**Interface micro-copy stays in code**, in the `*Labels` objects in each page module: button chrome and state labels such as `min read`, `Filter`, `Copy link`, `Newer` / `Older`, `Explore pillar`, `Next:`, and the inquiry form's sending, sent, and failed messages.
These are interface, not content, and putting fifty of them in the Studio would bury the copy that matters.
Every button whose label is part of the page's argument - every hero and closing-band button - is a `navItem` in Sanity and fully editable.

**Copied rather than referenced.**
A few strings are deliberately stored twice so each is editable where it is read.
A mission point is printed both on the About page's mission list and on the page that expands it, and the schema says so in the field description.
Change both together.

## Images

Every picture is a `sourcedImage`: the asset, its `alt` text, and the `sourceUrl` recording where the file came from.
`IMAGE-SOURCES.md` stays the human record; the `sourceUrl` field carries the same fact next to the image itself.
Images are fetched through the `IMAGE` projection in `src/lib/sanity.ts` (`{"ref": asset._ref, alt, sourceUrl}`) and the asset reference is turned into a Sanity CDN url with `@sanity/image-url` before it leaves that module, so a component only ever sees `{ src, alt, sourceUrl }` and never has to know Sanity's image shape.

## Ids and keys

Document ids are stable and readable (`pillar-mro`, `article-introducing-kca`), and the seven singletons use their type name as their id.
The queries address the singletons by id, so renaming a page in the Studio changes what it is called, never which document the site reads.

## Getting content in and out

There is no seed script: the dataset is the content, and it is edited in the Studio at `/admin`.
The site is built from what is **published** - the client asks for the `published` perspective, so a draft is invisible until an editor publishes it.

```
npx sanity dataset export production ./backup.tar.gz   # a full backup, documents and assets
npx sanity dataset import ./backup.tar.gz production   # restore one
```

Both read `sanity.cli.ts`, which needs `PUBLIC_SANITY_PROJECT_ID` in the environment (`set -a; . ./.env; set +a`) and a `SANITY_AUTH_TOKEN` with write access to import.

## Failing rather than falling back

`src/lib/sanity.ts` has no placeholder content and catches nothing.
A dataset that cannot be reached, a document that is not there, and an empty collection each throw with the name of what is missing, which fails `astro build` with a non-zero exit.
That is deliberate: a page with a hole in it must break the deploy rather than quietly replace the live site.

## Verifying the model

```
npx astro check && npm run build                                  # types and a production build
npx sanity schema validate                                        # the Studio schema itself
SANITY_AUTH_TOKEN=$SANITY_WRITE_TOKEN npx sanity documents validate --yes
```

The build is the strongest check that a query still matches the schema: it renders all seventeen routes from the live dataset, and a field a query asks for and the schema no longer has shows up as a missing value on the page.
The last command downloads every document in the dataset, checks that every reference resolves, and validates each document against the schema - the machine-readable form of "open the Studio and check it is all there and editable".
It reads `sanity.cli.ts`, which needs `PUBLIC_SANITY_PROJECT_ID` in the environment (`set -a; . ./.env; set +a`).

`http://localhost:4321` is registered as a CORS origin on project `ipx0k2h7`, so the Studio at `localhost:4321/admin` can talk to the dataset.
A deployed origin needs its own entry: `npx sanity cors add https://<host> --credentials`.
