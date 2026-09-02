// The About seam: the page at /about, the home of the full positioning - who
// KCA is, the vision, all seven mission points, and the quality, safety, and
// governance standard behind them. Components in src/components/about read the
// shapes declared here and nothing else.

import { fetchDocument, IMAGE, once } from '../lib/sanity';
import {
  CTA_SECTION,
  MISSION_POINT,
  NAV_ITEM,
  NEWS_PATH,
  PAGE_HERO_SECTION,
  PILLAR_GRID_SECTION,
  pageQuery,
  type CtaSection,
  type MissionPoint,
  type NavItem,
  type PageHeroSection,
  type PageMeta,
  type PillarGridSection,
  type SectionBase,
  type SectionIntro,
  type SourcedImage,
} from './home';

export { pad, visibleSections } from './home';

/* In-page destinations: the hero jumps to the mission list, and mission 6 in
   that list jumps to the section that expands it. */
export const MISSION_ANCHOR = 'mission';
export const GOVERNANCE_ANCHOR = 'governance';

/* One "label: value" line in the At a Glance card. */
export interface Fact {
  label: string;
  value: string;
}

export interface AboutIntroSection extends SectionBase {
  _type: 'aboutIntroSection';
  label: string;
  /* The core positioning, verbatim, one line per entry - scroll-lit like the
     homepage statement. */
  statement: string[];
  body: string[];
  glanceLabel: string;
  glance: Fact[];
  glanceLink: NavItem;
}

export interface AboutVisionSection extends SectionBase {
  _type: 'aboutVisionSection';
  label: string;
  /* The vision statement, verbatim. */
  statement: string;
  outcomesLabel: string;
  /* The outcomes the statement names, listed under it. */
  outcomes: string[];
  /* Sits under a heavy navy overlay behind the statement. */
  image: SourcedImage;
}

/* A mission point plus where the site expands it, when a page does. */
export interface Mission extends MissionPoint {
  link?: NavItem;
}

export interface AboutMissionSection extends SectionBase, SectionIntro {
  _type: 'aboutMissionSection';
  /* All seven, in docs/positioning.md order. */
  items: Mission[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface AboutGovernanceSection extends SectionBase, SectionIntro {
  _type: 'aboutGovernanceSection';
  /* Head tag: "Mission 06 / Quality, Safety & Governance". */
  missionLabel: string;
  mission: MissionPoint;
  /* The six things mission 6 says KCA does not compromise on, in its order. */
  principles: Principle[];
  readingLabel: string;
  /* Further reading on the site; its title and link come from the article. */
  readingArticle: { title: string; href: string };
  readingLinkLabel: string;
}

export type AboutSection =
  | PageHeroSection
  | AboutIntroSection
  | AboutVisionSection
  | AboutMissionSection
  | AboutGovernanceSection
  | PillarGridSection
  | CtaSection;

export interface AboutPage extends PageMeta {
  sections: AboutSection[];
}

export function getAboutPage(): Promise<AboutPage> {
  return once('aboutPage', () =>
    fetchDocument<AboutPage>(
      'the About Us page',
      pageQuery('aboutPage', [
        PAGE_HERO_SECTION,
        `_type == "aboutIntroSection" => {
        label, statement, body,
        glanceLabel, glance[]{label, value}, glanceLink${NAV_ITEM}
      }`,
        `_type == "aboutVisionSection" => {
        label, statement, outcomesLabel, outcomes, image ${IMAGE}
      }`,
        `_type == "aboutMissionSection" => {
        label, heading, intro,
        items[]{number, title, text, link${NAV_ITEM}}
      }`,
        `_type == "aboutGovernanceSection" => {
        label, heading, intro,
        missionLabel,
        mission${MISSION_POINT},
        principles[]{title, description},
        readingLabel,
        readingArticle->{title, "href": "${NEWS_PATH}/" + slug.current},
        readingLinkLabel
      }`,
        PILLAR_GRID_SECTION,
        CTA_SECTION,
      ]),
    ),
  );
}
