// The About Us content seam (see kirana-wsh): one typed module feeding the
// About Us page at /about. Components under src/components/about read from
// this module and nothing else.
// Copy source of truth: docs/positioning.md. This page is the home of the
// full positioning: the vision statement, all seven mission points in full
// (the homepage quotes only the vision), both core positioning lines, and
// the commitment. Missions 1-5 are read from the seams that expand them so
// the wording can never drift between pages; 6 and 7 are printed here
// because no other page owns them. Nothing here invents facts: no founding
// year, headcount, certifications, or locations beyond the Jakarta head
// office. Decision (Galih, 2026-08-28): the sister-company relationship is
// not mentioned.

import { locality } from './contact';
import { home, type NavItem, type PillarId, type SourcedImage } from './home';
import { articleBySlug } from './news';
import { PARTNERS_PATH, partnersLabels, partnersPage } from './partners';
import {
  contactLink,
  pillarPage,
  WHAT_WE_DO_PATH,
  whatWeDoLabels,
  type MissionPoint,
  type SectionIntro,
} from './what-we-do';

/* In-page destinations: the hero jumps to the mission list, and mission 6
   in that list jumps to the section that expands it. */
export const MISSION_ANCHOR = 'mission';
export const GOVERNANCE_ANCHOR = 'governance';

/* One "label: value" line in the At a Glance card. */
export interface Fact {
  label: string;
  value: string;
}

export interface IntroContent {
  label: string;
  /* The core positioning, verbatim, one entry per line - scroll-lit like
     the homepage statement. */
  statement: string[];
  body: string[];
  glance: {
    label: string;
    items: Fact[];
    /* Into the Partners page. */
    link: NavItem;
  };
}

export interface VisionContent {
  label: string;
  /* The vision statement, verbatim. */
  statement: string;
  /* The three outcomes the statement names, listed under it. */
  outcomesLabel: string;
  outcomes: string[];
  /* Sits under a heavy navy overlay behind the statement. */
  image: SourcedImage;
}

/* A mission point plus where the site expands it, when a page does. */
export interface Mission extends MissionPoint {
  link?: NavItem;
}

export interface MissionContent extends SectionIntro {
  /* All seven, in docs/positioning.md order. */
  items: Mission[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface GovernanceContent extends SectionIntro {
  /* Head tag: "Mission 06 / Quality, Safety & Governance". */
  missionLabel: string;
  mission: MissionPoint;
  /* The six things mission 6 says KCA does not compromise on, in its order. */
  principles: Principle[];
  /* Further reading on the site: the article, named, and the button into it. */
  reading: { label: string; title: string; link: NavItem };
}

export interface AboutPageContent {
  title: string;
  heading: string;
  standfirst: string;
  image: SourcedImage;
  intro: IntroContent;
  vision: VisionContent;
  mission: MissionContent;
  governance: GovernanceContent;
  pillars: SectionIntro;
  cta: {
    label: string;
    heading: string;
    body: string;
    primary: NavItem;
    secondary: NavItem;
  };
}

/* Interface copy for the page chrome - buttons - kept here so the
   components stay copy-free. */
export const aboutLabels = {
  /* Hero primary; jumps to the mission list. */
  ourMission: 'Our Mission',
  /* Mission 6's row link, into the governance section below it. */
  howWeOperate: 'How We Operate',
  /* Governance section foot, into the quality article. */
  readArticle: 'Read the Article',
};

/* "01" style counters, shared with every other inner page. */
export { pad } from './what-we-do';

/* Missions 1-4 are the four pillars; each row links to the page that
   expands it. */
function pillarMission(id: PillarId): Mission {
  const pillar = pillarPage(id);
  return {
    ...pillar.overview.mission,
    link: { label: `${whatWeDoLabels.explore} ${pillar.name}`, href: pillar.href },
  };
}

const governanceArticle = articleBySlug('zero-compromise-quality-safety-governance');

/* Mission 6 is printed here and expanded by the governance section. */
const governanceMission: MissionPoint = {
  number: 6,
  title: 'Quality, Safety & Governance',
  text:
    'Operate with zero compromise on safety, quality, airworthiness, ' +
    'regulatory compliance, transparency, and business integrity, ' +
    'establishing KCA as a trusted partner in every transaction.',
};

/* Missions 1-4 map onto the pillars out of pillar order (mission 2 is the
   network), so the list is assembled by pillar and sorted by number. */
const missions: Mission[] = [
  pillarMission('parts'),
  pillarMission('network'),
  pillarMission('mro'),
  pillarMission('technical'),
  {
    ...partnersPage.overview.mission,
    link: { label: partnersLabels.meetEcosystem, href: PARTNERS_PATH },
  },
  {
    ...governanceMission,
    link: { label: aboutLabels.howWeOperate, href: `#${GOVERNANCE_ANCHOR}` },
  },
  {
    number: 7,
    title: 'Sustainable Growth & Value Creation',
    text:
      'Create sustainable long-term value for customers, shareholders, ' +
      'investors, employees, and strategic partners through operational ' +
      'excellence, innovation, disciplined investment, and continuous ' +
      'capability development.',
  },
].sort((a, b) => a.number - b.number);

/* The vision band reuses the "Introducing KCA" article picture - an
   airliner climbing into the light is the page's forward-looking image. */
const introducing = articleBySlug('introducing-kca');

export const aboutPage: AboutPageContent = {
  title: 'About Us',
  /* The commitment's closing line as the page title; the core positioning
     itself opens Who We Are, verbatim, and the closing band answers with
     the commitment in full. */
  heading: 'Keeping Aviation Moving',
  standfirst:
    'Kirana Cakrawala (KCA) connects parts, MRO, technical expertise, and ' +
    'global supply networks for airlines, operators, MROs, and aviation ' +
    'organizations - one accountable partner across the aviation ' +
    'aftermarket.',
  /* A widebody in a maintenance dock, seen from behind - the place and the
     work behind the operation, with no livery in frame. */
  image: {
    src: '/images/about-hero.jpg',
    alt:
      'Rear view of a widebody airliner parked in a maintenance dock, its ' +
      'tail rising into the hangar roof, parts shelving and tool carts on ' +
      'both sides',
    sourceUrl: 'https://unsplash.com/photos/HjuC8iFy7O8',
  },
  intro: {
    label: 'Who We Are',
    statement: [
      'KCA - Your Integrated Aviation Aftermarket Partner.',
      'Connecting Parts, MRO, Technical Expertise & Global Supply Networks.',
    ],
    body: [
      'Kirana Cakrawala (KCA) is an integrated aviation aftermarket ' +
        'solutions partner headquartered in Jakarta. We deliver end-to-end ' +
        'solutions covering aircraft and engine spare parts, components, ' +
        'rotables, component MRO, technical services, and asset solutions - ' +
        'supporting airlines, operators, MROs, and aviation organizations.',
      'Behind every requirement stands a trusted global network of OEMs, ' +
        'MROs, suppliers, and industry partners, and a team of engineers and ' +
        'technical specialists focused on aircraft availability and ' +
        'operational readiness. Whether the need is a single AOG part or a ' +
        'long-term asset program, KCA is one accountable partner from ' +
        'requirement to result.',
    ],
    glance: {
      label: 'At a Glance',
      items: [
        { label: 'Head Office', value: locality() },
        { label: 'Focus', value: 'Integrated aviation aftermarket solutions' },
        {
          label: 'Capabilities',
          value: home.whatWeDo.pillars.map((pillar) => pillar.name).join(', '),
        },
        {
          label: 'We Serve',
          value: 'Airlines, operators, MROs, and aviation organizations',
        },
        {
          label: 'Network',
          value: 'OEMs, MROs, suppliers, and industry partners worldwide',
        },
      ],
      link: { label: partnersLabels.meetEcosystem, href: PARTNERS_PATH },
    },
  },
  vision: {
    label: 'Our Vision',
    statement:
      'To become Asia’s trusted and integrated aviation aftermarket ' +
      'solutions partner, connecting global capabilities, technology, and ' +
      'supply networks to deliver superior value, reliability, and ' +
      'operational readiness to the aviation industry.',
    outcomesLabel: 'What We Deliver',
    outcomes: ['Superior Value', 'Reliability', 'Operational Readiness'],
    image: introducing.image,
  },
  mission: {
    label: 'Our Mission',
    heading: 'What We Set Out to Do',
    intro:
      'KCA’s mission in full: seven points that describe the partner we are ' +
      'building, from the parts we supply to the value we create. Follow a ' +
      'point to where the site expands it.',
    items: missions,
  },
  governance: {
    label: 'How We Operate',
    heading: 'Zero Compromise',
    intro:
      'Mission 06 is the one every other point stands on - the standard ' +
      'behind every part, repair, and partnership, and the reason an ' +
      'aviation buyer can trust every KCA transaction. Six commitments, none ' +
      'of them negotiable.',
    missionLabel: 'Mission',
    mission: governanceMission,
    principles: [
      {
        title: 'Safety',
        description:
          'Safety comes before schedule and before cost. Every part, repair, ' +
          'and technical decision is made with the aircraft and the people ' +
          'who fly in it in mind.',
      },
      {
        title: 'Quality',
        description:
          'Quality is built into the process rather than inspected in at the ' +
          'end - from the source a part is bought from to the documentation ' +
          'that travels with it.',
      },
      {
        title: 'Airworthiness',
        description:
          'Only airworthy parts and serviceable components move through ' +
          'KCA, each with the release and trace documentation that proves it.',
      },
      {
        title: 'Regulatory Compliance',
        description:
          'Every transaction is conducted within the regulatory requirements ' +
          'that govern civil aviation and its aftermarket.',
      },
      {
        title: 'Transparency',
        description:
          'Cost, lead time, condition, and trace are shown side by side, so ' +
          'customers decide with the full picture in front of them.',
      },
      {
        title: 'Business Integrity',
        description:
          'Long-term relationships are built on doing business the right ' +
          'way - in every transaction, with every partner, every time.',
      },
    ],
    reading: {
      label: 'Further Reading',
      title: governanceArticle.title,
      link: { label: aboutLabels.readArticle, href: governanceArticle.href },
    },
  },
  pillars: {
    label: home.whatWeDo.label,
    heading: 'Where the Mission Becomes Service',
    intro:
      'Missions 01 to 04 are the four pillars KCA delivers every day - parts ' +
      'and components, component MRO, technical services, and the global ' +
      'supply network behind them.',
  },
  cta: {
    label: home.commitment.label,
    heading: home.commitment.heading,
    body: home.commitment.body,
    primary: contactLink,
    secondary: { label: whatWeDoLabels.allCapabilities, href: WHAT_WE_DO_PATH },
  },
};
