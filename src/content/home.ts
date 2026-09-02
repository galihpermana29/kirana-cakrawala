// The site's shared content vocabulary, and the homepage's own seam.
//
// Every page module in this folder reads from Sanity through the helpers in
// src/lib/sanity.ts and exposes one typed shape per page; none of them holds
// copy. This module owns what they all share: the small repeated shapes, the
// routes, the GROQ fragments that project them, and Site Settings - the brand,
// nav, and contact details the shared header and footer render.
// docs/content-model.md is the field-by-field map to the Studio schema.

import { fetchDocument, IMAGE, once } from '../lib/sanity';

// -- routes ------------------------------------------------------------------
// The five real routes, in one place, so a page that links to another names it
// rather than spelling it.

export const ABOUT_PATH = '/about';
export const WHAT_WE_DO_PATH = '/what-we-do';
export const PARTNERS_PATH = '/partners';
export const NEWS_PATH = '/news';
export const CONTACT_PATH = '/contact';

// -- shared shapes -----------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

/* A picture, ready to render: the Sanity CDN url, its alt text, and where the
   file came from (also recorded in IMAGE-SOURCES.md). */
export interface SourcedImage {
  src: string;
  alt: string;
  sourceUrl?: string;
}

/* The "/ label, heading, intro" head most sections open with. */
export interface SectionIntro {
  label: string;
  heading: string;
  intro: string;
}

export type PillarId = 'parts' | 'mro' | 'technical' | 'network';

/* One of the seven mission points in docs/positioning.md, quoted verbatim. */
export interface MissionPoint {
  number: number;
  title: string;
  text: string;
}

/* The overview an expansion page opens with: the mission point it expands,
   the page's reading of it, and a short list under its own label. */
export interface OverviewContent {
  label: string;
  mission: MissionPoint;
  body: string[];
  scopeLabel: string;
  scope: string[];
}

/* A pillar as another page links to it. */
export interface PillarLink {
  id: PillarId;
  name: string;
  href: string;
}

/* A pillar as a card in a pillar grid or a homepage panel. */
export interface PillarSummary extends PillarLink {
  /* Its place in the pillar sequence, rendered as "01". */
  index: number;
  description: string;
  image: SourcedImage;
}

/* A partner category as the homepage marquee shows it; each links into its
   tab on the Partners page. */
export interface PartnerCategorySummary {
  id: string;
  name: string;
  index: number;
  href: string;
}

/* One node on the dotted world map. */
export interface MapPin {
  name: string;
  kind: 'region' | 'hq';
  xPct: number;
  yPct: number;
}

/* Every section a page holds carries these, whatever else it holds. */
export interface SectionBase {
  _key: string;
  hidden?: boolean;
}

export interface PageMeta {
  title: string;
  metaTitle: string;
  metaDescription: string;
}

/* The bands a page renders, in the order Sanity stores them, minus the ones
   an editor has switched off. */
export function visibleSections<T extends SectionBase>(sections: T[]): T[] {
  return sections.filter((section) => section.hidden !== true);
}

// -- derived links -----------------------------------------------------------

/* tel: link from the printed number - digits only. Shared by the footer and
   the Contact page so the two can never dial differently. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}

/* "01" style counters, used by every page. */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/* The address as the footer prints it, split into its lines: street,
   district, city. */
export function addressLines(settings: SiteSettings): string[] {
  return settings.contact.address.split(', ');
}

/* "Kelapa Gading, North Jakarta" - the district and city, wherever the site
   names the location without the street. */
export function locality(settings: SiteSettings): string {
  return addressLines(settings).slice(1).join(', ');
}

/* Contact Us as a destination. It is a nav entry too, but a page that closes
   on it should not have to search the nav for it. */
export const contactLink: NavItem = { label: 'Contact Us', href: CONTACT_PATH };
export const aboutLink: NavItem = { label: 'About Us', href: ABOUT_PATH };

// -- GROQ fragments ----------------------------------------------------------
// The projections more than one page needs. Each one lands the shape declared
// above, so a fetched section is rendered as it arrives.

export const NAV_ITEM = '{label, href}';
export const MISSION_POINT = '{number, title, text}';
export const OVERVIEW_FIELDS = `label, mission${MISSION_POINT}, body, scopeLabel, scope`;
export const MAP_PIN = '{name, kind, xPct, yPct}';

export const PILLAR_LINK = `{"id": pillarId, name, "href": "${WHAT_WE_DO_PATH}/" + slug.current}`;

export const PILLAR_SUMMARY = `{
  "id": pillarId,
  name,
  "href": "${WHAT_WE_DO_PATH}/" + slug.current,
  "index": order,
  description,
  image ${IMAGE}
}`;

export const PARTNER_CATEGORY_SUMMARY = `{
  "id": categoryId,
  name,
  "index": order,
  "href": "${PARTNERS_PATH}#" + categoryId
}`;

// -- the sections more than one page is built from ---------------------------

/* Every inner page opens on this band; its eyebrow and crumb are derived from
   the page title and the brand abbreviation rather than stored twice. */
export interface PageHeroSection extends SectionBase {
  _type: 'pageHeroSection';
  heading: string;
  standfirst: string;
  image: SourcedImage;
  primary: NavItem;
  secondary: NavItem;
}

/* The closing band every inner page ends on, over the Site Settings picture. */
export interface CtaSection extends SectionBase {
  _type: 'ctaSection';
  label: string;
  heading: string;
  body: string;
  primary: NavItem;
  secondary: NavItem;
}

/* The mission point a page expands, and the page's reading of it. */
export interface OverviewSection extends SectionBase, OverviewContent {
  _type: 'overviewSection';
}

export const PAGE_HERO_SECTION = `_type == "pageHeroSection" => {
  heading, standfirst, image ${IMAGE}, primary${NAV_ITEM}, secondary${NAV_ITEM}
}`;

export const PILLAR_GRID_SECTION = `_type == "pillarGridSection" => {
  label, heading, intro, pillars[]->${PILLAR_SUMMARY}
}`;

export const CTA_SECTION = `_type == "ctaSection" => {
  label, heading, body, primary${NAV_ITEM}, secondary${NAV_ITEM}
}`;

export const OVERVIEW_SECTION = `_type == "overviewSection" => { ${OVERVIEW_FIELDS} }`;

/* One page singleton: its meta, then its sections in stored order, each
   projected by its own type. */
export function pageQuery(id: string, sections: string[], extra = ''): string {
  return `*[_id == "${id}"][0]{
    title, metaTitle, metaDescription,${extra}
    "sections": sections[]{
      _type, _key, hidden,
      ${sections.join(',\n      ')}
    }
  }`;
}

// -- Site Settings -----------------------------------------------------------

export interface ContactDetails {
  address: string;
  email: string;
  phone: string;
}

export interface SiteSettings {
  companyName: string;
  brandAbbr: string;
  tagline: string;
  /* Behind the closing band at the foot of every inner page. */
  ctaImage: SourcedImage;
  nav: NavItem[];
  contact: ContactDetails;
}

export function getSiteSettings(): Promise<SiteSettings> {
  return once('siteSettings', () =>
    fetchDocument<SiteSettings>(
      'Site Settings',
      `*[_id == "siteSettings"][0]{
        companyName, brandAbbr, tagline,
        ctaImage ${IMAGE},
        nav[]${NAV_ITEM},
        contact{address, email, phone}
      }`,
    ),
  );
}

// -- the homepage ------------------------------------------------------------

export interface HomeHeroSection extends SectionBase {
  _type: 'homeHeroSection';
  /* Small data eyebrow above the headline. */
  eyebrow: string;
  /* Stacked lines, scramble-revealed in sequence. */
  headlineLines: string[];
  subline: string;
  ctaPrimary: NavItem;
  ctaSecondary: NavItem;
  /* Fills the diagonal ribbon - the hero's focal object. */
  image: SourcedImage;
}

export interface WhoWeAreSection extends SectionBase {
  _type: 'whoWeAreSection';
  label: string;
  /* Scroll-lit word by word. */
  statement: string;
  body: string;
  link: NavItem;
}

export interface PillarGridSection extends SectionBase, SectionIntro {
  _type: 'pillarGridSection';
  pillars: PillarSummary[];
}

export interface EcosystemSection extends SectionBase, SectionIntro {
  _type: 'ecosystemSection';
  categories: PartnerCategorySummary[];
  regions: MapPin[];
  hq: MapPin;
  link: NavItem;
}

export interface CommitmentSection extends SectionBase {
  _type: 'commitmentSection';
  label: string;
  heading: string;
  body: string;
  cta: NavItem;
  /* Sits under a heavy navy overlay behind the band's copy. */
  image: SourcedImage;
}

export interface NewsTeaserSection extends SectionBase, SectionIntro {
  _type: 'newsTeaserSection';
  /* How many of the newest articles the teaser shows. */
  count: number;
  showAll: NavItem;
}

export type HomeSection =
  | HomeHeroSection
  | WhoWeAreSection
  | PillarGridSection
  | EcosystemSection
  | CommitmentSection
  | NewsTeaserSection;

export interface HomePage extends PageMeta {
  sections: HomeSection[];
}

export function getHomePage(): Promise<HomePage> {
  return once('homePage', () =>
    fetchDocument<HomePage>(
      'the Home page',
      pageQuery('homePage', [
        `_type == "homeHeroSection" => {
        eyebrow, headlineLines, subline,
        ctaPrimary${NAV_ITEM}, ctaSecondary${NAV_ITEM}, image ${IMAGE}
      }`,
        `_type == "whoWeAreSection" => { label, statement, body, link${NAV_ITEM} }`,
        PILLAR_GRID_SECTION,
        `_type == "ecosystemSection" => {
        label, heading, intro,
        categories[]->${PARTNER_CATEGORY_SUMMARY},
        regions[]->${MAP_PIN},
        hq->${MAP_PIN},
        link${NAV_ITEM}
      }`,
        `_type == "commitmentSection" => {
        label, heading, body, cta${NAV_ITEM}, image ${IMAGE}
      }`,
        `_type == "newsTeaserSection" => { label, heading, intro, count, showAll${NAV_ITEM} }`,
      ]),
    ),
  );
}
