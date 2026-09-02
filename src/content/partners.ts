// The Partners seam: the page at /partners, where mission 5 is expanded into
// what KCA's integrated ecosystem means for each kind of partner. Components
// in src/components/partners read the shapes declared here and nothing else.
//
// The seven categories and the map pins are collections, referenced by the
// sections that show them - so the tabs, the marquee on the homepage, and the
// dotted map all read the same documents.

import { fetchDocument, once } from '../lib/sanity';
import {
  CTA_SECTION,
  MAP_PIN,
  OVERVIEW_SECTION,
  PAGE_HERO_SECTION,
  PILLAR_GRID_SECTION,
  PILLAR_LINK,
  pageQuery,
  type CtaSection,
  type MapPin,
  type OverviewSection,
  type PageHeroSection,
  type PageMeta,
  type PillarGridSection,
  type PillarLink,
  type SectionBase,
  type SectionIntro,
} from './home';

export { PARTNERS_PATH, pad, visibleSections } from './home';

/* The category section's anchor; each category is deep-linkable on top of it
   as /partners#<id>, which opens its tab. */
export const ECOSYSTEM_ANCHOR = 'ecosystem';

/* Interface copy for the page chrome - tab and panel labels, the map legend -
   kept in code so the components stay copy-free. */
export const partnersLabels = {
  /* Tab list accessible name. */
  categoriesNav: 'Partner categories',
  /* Panel eyebrow: "01 / Partner Category". */
  category: 'Partner Category',
  whatWeBring: 'What KCA Brings',
  connectedThrough: 'Connected Through',
  /* Map legend. */
  legend: 'Map legend',
  regions: 'Network Regions',
  connections: 'Network Connections',
};

/* One partner category in full: a tab and its panel on the Partners page. */
export interface PartnerCategory {
  id: string;
  name: string;
  /* Its place in the sequence, rendered as "01". */
  index: number;
  /* Their place in the aftermarket, in one line. */
  role: string;
  /* What the integrated ecosystem means for them, in one sentence. */
  lead: string;
  body: string;
  /* What KCA brings to the partnership. */
  offers: string[];
  /* The pillars this partnership runs through, most relevant first. */
  pillars: PillarLink[];
}

export interface PartnerCategoriesSection extends SectionBase, SectionIntro {
  _type: 'partnerCategoriesSection';
  categories: PartnerCategory[];
}

export interface NetworkSection extends SectionBase, SectionIntro {
  _type: 'networkSection';
  regions: MapPin[];
  hq: MapPin;
}

export type PartnersSection =
  | PageHeroSection
  | OverviewSection
  | PartnerCategoriesSection
  | NetworkSection
  | PillarGridSection
  | CtaSection;

export interface PartnersPage extends PageMeta {
  sections: PartnersSection[];
}

export function getPartnersPage(): Promise<PartnersPage> {
  return once('partnersPage', () =>
    fetchDocument<PartnersPage>(
      'the Partners page',
      pageQuery('partnersPage', [
        PAGE_HERO_SECTION,
        OVERVIEW_SECTION,
        `_type == "partnerCategoriesSection" => {
        label, heading, intro,
        categories[]->{
          "id": categoryId,
          name,
          "index": order,
          role, lead, body, offers,
          pillars[]->${PILLAR_LINK}
        }
      }`,
        `_type == "networkSection" => {
        label, heading, intro, regions[]->${MAP_PIN}, hq->${MAP_PIN}
      }`,
        PILLAR_GRID_SECTION,
        CTA_SECTION,
      ]),
    ),
  );
}
