// The What We Do seam: the hub page at /what-we-do and the four pillar pages
// under it. Components in src/components/what-we-do read the shapes declared
// here and nothing else.
//
// The hub is a page singleton with a sections array; the pillar pages are the
// Pillar collection rendered through one fixed template. The copy that
// template shares - the head of its cross-link band - sits on the hub, so the
// four pages cannot drift apart.

import { fetchDocument, fetchList, IMAGE, once } from '../lib/sanity';
import {
  CTA_SECTION,
  OVERVIEW_FIELDS,
  PAGE_HERO_SECTION,
  PILLAR_GRID_SECTION,
  pageQuery,
  WHAT_WE_DO_PATH,
  type CtaSection,
  type OverviewContent,
  type PageHeroSection,
  type PageMeta,
  type PillarGridSection,
  type PillarId,
  type PillarSummary,
  type SectionIntro,
} from './home';

export {
  aboutLink,
  contactLink,
  pad,
  visibleSections,
  WHAT_WE_DO_PATH,
} from './home';
export type { MissionPoint, OverviewContent, SectionIntro } from './home';

/* Interface copy for the template chrome - button and band labels - kept in
   code so the components stay copy-free and the Studio stays about content. */
export const whatWeDoLabels = {
  /* Pillar CTA band label and its "Next: Component MRO" ghost button. */
  nextStep: 'Next Step',
  next: 'Next:',
  /* Cross-link card foot. */
  explorePillar: 'Explore pillar',
  /* Homepage Domains panel button: "Explore Parts & Components". */
  explore: 'Explore',
  /* Pillar page hero secondary, back to the hub. */
  allCapabilities: 'All Capabilities',
};

// -- the pillar collection ---------------------------------------------------

export interface Capability {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface PillarPage extends PillarSummary {
  slug: string;
  /* Hero subline - the pillar's promise in one sentence. */
  standfirst: string;
  overview: OverviewContent;
  capabilities: SectionIntro & { items: Capability[] };
  process: SectionIntro & { steps: ProcessStep[] };
  /* Closes this pillar page, and every article that expands this pillar. */
  cta: { heading: string; body: string };
}

export function getPillars(): Promise<PillarPage[]> {
  return once('pillars', () =>
    fetchList<PillarPage>(
      'pillars',
      `*[_type == "pillar"] | order(order asc) {
        "id": pillarId,
        name,
        "slug": slug.current,
        "href": "${WHAT_WE_DO_PATH}/" + slug.current,
        "index": order,
        description,
        image ${IMAGE},
        standfirst,
        overview{${OVERVIEW_FIELDS}},
        capabilities{label, heading, intro, items[]{title, description}},
        process{label, heading, intro, steps[]{title, description}},
        cta{heading, body}
      }`,
    ),
  );
}

export function pillarBySlug(pillars: PillarPage[], slug: string): PillarPage {
  const pillar = pillars.find((item) => item.slug === slug);
  if (!pillar) throw new Error(`what-we-do: no pillar with slug "${slug}"`);
  return pillar;
}

export function otherPillars(pillars: PillarPage[], current: PillarId): PillarPage[] {
  return pillars.filter((pillar) => pillar.id !== current);
}

/* Wraps around so the last pillar's CTA leads back to the first. */
export function nextPillar(pillars: PillarPage[], current: PillarId): PillarPage {
  const i = pillars.findIndex((pillar) => pillar.id === current);
  return pillars[(i + 1) % pillars.length]!;
}

// -- the hub page ------------------------------------------------------------

export type WhatWeDoSection = PageHeroSection | PillarGridSection | CtaSection;

export interface WhatWeDoPage extends PageMeta {
  sections: WhatWeDoSection[];
  /* The head of the cross-link band at the foot of every pillar page. */
  otherPillarsHead: SectionIntro;
}

export function getWhatWeDoPage(): Promise<WhatWeDoPage> {
  return once('whatWeDoPage', () =>
    fetchDocument<WhatWeDoPage>(
      'the What We Do page',
      pageQuery(
        'whatWeDoPage',
        [PAGE_HERO_SECTION, PILLAR_GRID_SECTION, CTA_SECTION],
        '\n    otherPillarsHead{label, heading, intro},',
      ),
    ),
  );
}
