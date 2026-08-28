// The Partners content seam (see kirana-q3x): one typed module feeding the
// Partners page at /partners. Components under src/components/partners read
// from this module and nothing else.
// Copy source of truth: docs/positioning.md - mission 5 (Strategic
// Partnerships & Ecosystem Development) is the page, and each partner
// category says what KCA's integrated ecosystem means for that partner,
// drawing only on the seven mission points. Nothing here invents facts: no
// company names, logos, counts, or certifications - real partners drop in
// when confirmed.

import {
  home,
  type NavItem,
  type PartnerCategoryId,
  type PartnerCategorySummary,
  type PillarId,
  type SourcedImage,
} from './home';
import { pillarPage, type OverviewContent, type SectionIntro } from './what-we-do';

export const PARTNERS_PATH = '/partners';

/* The category section's anchor; each category is deep-linkable on top of
   it as /partners#<id>, which opens its tab. */
export const ECOSYSTEM_ANCHOR = 'ecosystem';

export interface PartnerCategory extends PartnerCategorySummary {
  /* 1-based position in the category sequence, rendered as "01". */
  index: number;
  /* Their place in the aftermarket, in one line. */
  role: string;
  /* What the integrated ecosystem means for them, in one sentence. */
  lead: string;
  body: string;
  /* What KCA brings to the partnership. */
  offers: string[];
  /* The pillars this partnership runs through, most relevant first. */
  pillars: PillarId[];
}

export interface PartnersPageContent {
  title: string;
  heading: string;
  standfirst: string;
  image: SourcedImage;
  overview: OverviewContent;
  categories: SectionIntro;
  network: SectionIntro;
  pillars: SectionIntro;
  cta: {
    label: string;
    heading: string;
    body: string;
  };
}

/* Interface copy for the page chrome - buttons, tab and panel labels, the
   map legend - kept here so the components stay copy-free. */
export const partnersLabels = {
  /* Hero primary; points at Contact. */
  partnerWithUs: 'Partner With Us',
  /* Hero secondary; jumps to the category section. */
  meetEcosystem: 'Meet the Ecosystem',
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

type CategoryDetails = Omit<PartnerCategory, keyof PartnerCategorySummary | 'index'>;

const categorySummaries = home.ecosystem.categories;

/* Deep link to a category's tab: /partners#oems. */
export function categoryHref(id: PartnerCategoryId): string {
  return `${PARTNERS_PATH}#${id}`;
}

/* The pillar pages a partnership runs through, as links. */
export function categoryPillars(category: PartnerCategory): NavItem[] {
  return category.pillars.map((id) => {
    const pillar = pillarPage(id);
    return { label: pillar.name, href: pillar.href };
  });
}

export { pad } from './what-we-do';

/* Each category is the homepage marquee entry plus its expansion; the name is
   read from home.ts so the marquee and the page never drift. */
function defineCategory(id: PartnerCategoryId, details: CategoryDetails): PartnerCategory {
  const summary = categorySummaries.find((category) => category.id === id);
  if (!summary) {
    throw new Error(`partners: no homepage partner category with id "${id}"`);
  }
  return {
    ...summary,
    ...details,
    index: categorySummaries.indexOf(summary) + 1,
  };
}

/* In the marquee's order. Panel copy is kept to a similar length across the
   seven so the tabbed panel does not jump in height between them. */
export const partnerCategories: PartnerCategory[] = [
  defineCategory('oems', {
    role: 'Original equipment manufacturers of aircraft, engines, and components.',
    lead:
      'A trusted route to Asia’s fleets - with a partner that protects the ' +
      'integrity of every part it moves.',
    body:
      'For OEMs, KCA’s ecosystem is a reliable channel into the region: parts, ' +
      'components, and rotables sourced through OEM and approved supplier ' +
      'channels and ' +
      'delivered with complete traceability and release documentation. A ' +
      'long-term partnership gives OEM supply a single accountable partner in ' +
      'Asia, operating with zero compromise on quality, airworthiness, and ' +
      'business integrity - so the product performs in service the way it ' +
      'left the factory.',
    offers: [
      'Strategic sourcing through OEM and approved supplier channels',
      'Traceability and documentation on every transaction',
      'Component MRO and technical services that keep OEM products performing',
      'A long-term partnership, not one-off transactions',
    ],
    pillars: ['parts', 'network', 'mro'],
  }),

  defineCategory('airlines', {
    role: 'Scheduled and charter carriers keeping fleets on schedule.',
    lead:
      'One accountable partner for parts, component MRO, technical support, ' +
      'and sourcing - from AOG to planned maintenance.',
    body:
      'Every hour an aircraft is on the ground is an hour of lost revenue. ' +
      'For airlines, KCA connects spare parts, rotables, component repair, ' +
      'and engineering support into one integrated service with optimized ' +
      'cost and lead time - so the fleet stays available and the supplier ' +
      'list stays short. Exchange and loan programs keep the aircraft flying ' +
      'while removed units are repaired, and AOG requirements get the fastest ' +
      'reliable route to a serviceable part, around the clock.',
    offers: [
      'Aircraft and engine spare parts, components, and rotables',
      'AOG response around the clock',
      'Component repair, overhaul, and exchange programs',
      'Technical assistance, field support, and training',
    ],
    pillars: ['parts', 'mro', 'technical'],
  }),

  defineCategory('mros', {
    role: 'Maintenance, repair, and overhaul organizations - line, base, and component shops.',
    lead:
      'A sourcing and repair-management partner that extends an MRO’s reach ' +
      '- and a partner network that extends KCA’s.',
    body:
      'MROs sit on both sides of KCA’s ecosystem. As customers, they draw on ' +
      'strategic sourcing for the parts and rotables their work orders need, ' +
      'with cost and lead time transparent before they commit. As partners, ' +
      'approved MRO shops form part of the repair network KCA routes ' +
      'components through, with turnaround time and cost managed end to end ' +
      '- one more capability the whole ecosystem can draw on.',
    offers: [
      'Parts and rotables sourced against work-order demand',
      'Repair routing through approved partner shops',
      'Reliability improvement from removal and repair data analysis',
      'Transparent cost and lead time on every option',
    ],
    pillars: ['network', 'mro', 'parts'],
  }),

  defineCategory('lessors', {
    role: 'Aircraft and engine lessors managing assets across operators and leases.',
    lead:
      'Asset value protected through every transition - repair-or-replace ' +
      'decisions, documentation, and technical oversight.',
    body:
      'A leased asset changes hands, and its value travels with its records. ' +
      'For lessors, KCA’s ecosystem brings component MRO and asset management ' +
      'that extend component life, engineering support for technical ' +
      'evaluations and transitions, and complete traceability on every part ' +
      'and repair. Each decision - repair, exchange, or retire - is weighed ' +
      'against the economics of the asset, maximizing its value across the ' +
      'whole lease life.',
    offers: [
      'Asset management and lifecycle planning',
      'Component repair, overhaul, and refurbishment',
      'Engineering support for technical evaluations and transitions',
      'Complete documentation and traceability',
    ],
    pillars: ['mro', 'technical', 'parts'],
  }),

  defineCategory('operators', {
    role: 'Cargo, charter, business aviation, and general aviation operators.',
    lead:
      'The same integrated support an airline expects, scaled to a smaller ' +
      'fleet.',
    body:
      'Smaller fleets feel every grounded aircraft more acutely and rarely ' +
      'carry a full technical department. For operators, KCA provides parts, ' +
      'component MRO, and engineering support as one service, with field ' +
      'support and troubleshooting delivered wherever the aircraft is. ' +
      'Specialized training builds the operator’s own capability over time, ' +
      'so each engagement leaves the team stronger - with KCA as the partner ' +
      'behind it.',
    offers: [
      'Parts supply matched to the fleet’s operational needs',
      'Component MRO and exchange options',
      'Field support and troubleshooting where the aircraft is',
      'Specialized training that builds in-house capability',
    ],
    pillars: ['parts', 'technical', 'mro'],
  }),

  defineCategory('financial-institutions', {
    role: 'Banks and financiers funding aircraft, engines, and aftermarket transactions.',
    lead:
      'Transparent, well-governed transactions - and technical expertise ' +
      'behind the assets being financed.',
    body:
      'Financing an aviation asset means trusting its condition, its records, ' +
      'and the counterparties around it. For financial institutions, KCA ' +
      'operates with zero compromise on transparency, regulatory compliance, ' +
      'and business integrity in every transaction, and brings engineering ' +
      'and asset-management expertise that helps assess and protect the value ' +
      'of financed assets - a long-term partner on the operational side of ' +
      'the balance sheet.',
    offers: [
      'Transparency and business integrity in every transaction',
      'Regulatory compliance and airworthiness documentation',
      'Technical evaluations and asset-management expertise',
      'A long-term partner on the operational side of the asset',
    ],
    pillars: ['technical', 'mro'],
  }),

  defineCategory('aviation-investors', {
    role: 'Investors and shareholders backing aviation aftermarket growth.',
    lead:
      'A disciplined, integrated platform built for sustainable long-term ' +
      'value.',
    body:
      'KCA’s mission is to create sustainable long-term value for customers, ' +
      'shareholders, investors, employees, and strategic partners through ' +
      'operational excellence, innovation, disciplined investment, and ' +
      'continuous capability development. For investors, the ecosystem is the ' +
      'thesis: parts, component MRO, technical expertise, and global supply ' +
      'networks connected into one scalable aviation aftermarket platform, ' +
      'governed by safety, quality, and transparency.',
    offers: [
      'An integrated, scalable aftermarket platform',
      'Disciplined investment and continuous capability development',
      'Governance built on safety, quality, and transparency',
      'Sustainable long-term value creation',
    ],
    pillars: ['network', 'parts', 'mro', 'technical'],
  }),
];

export const partnersPage: PartnersPageContent = {
  title: 'Partners',
  heading: home.ecosystem.heading,
  standfirst: home.ecosystem.intro,
  /* The apron-at-sunset picture from the ecosystem article: silhouetted,
     brand-free airliners sharing one ramp. */
  image: {
    src: '/images/news-aftermarket-ecosystem.jpg',
    alt: 'Apron at sunset with silhouetted airliners parked at their stands',
    sourceUrl: 'https://unsplash.com/photos/ZKEjw7oLmQQ',
  },
  overview: {
    label: 'Overview',
    mission: {
      number: 5,
      title: 'Strategic Partnerships & Ecosystem Development',
      text:
        'Build long-term partnerships with OEMs, airlines, MROs, lessors, ' +
        'operators, financial institutions, and aviation investors to create ' +
        'an integrated and scalable aviation aftermarket ecosystem.',
    },
    body: [
      'No single company holds every part, every repair capability, and ' +
        'every relationship the aviation aftermarket needs. KCA’s answer is ' +
        'an ecosystem: long-term partnerships with OEMs, airlines, MROs, ' +
        'lessors, operators, financial institutions, and aviation investors, ' +
        'connected so that each partner’s strength is available to every ' +
        'customer through one accountable partner.',
      'The ecosystem is built to scale. As partners join, the sourcing ' +
        'options, repair capabilities, and technical expertise behind every ' +
        'KCA transaction grow with it - while every transaction stays ' +
        'governed by the same standard: zero compromise on safety, quality, ' +
        'airworthiness, regulatory compliance, transparency, and business ' +
        'integrity.',
    ],
    scopeLabel: 'How We Partner',
    scope: [
      'Long-term relationships over one-off transactions',
      'Integrated across parts, MRO, technical services, and sourcing',
      'Scalable as the ecosystem grows',
      'Transparent on cost, lead time, and trace',
      'Governed by safety, quality, and airworthiness',
    ],
  },
  categories: {
    label: home.ecosystem.label,
    heading: 'Seven Ways Into One Ecosystem',
    intro:
      'OEMs, airlines, MROs, lessors, operators, financial institutions, and ' +
      'aviation investors each bring something different to the aftermarket ' +
      '- and each gets something different from an integrated partner. Find ' +
      'yours.',
  },
  network: {
    label: 'Global Network',
    heading: 'From Jakarta to the Aftermarket’s Key Hubs',
    intro:
      'Headquartered in Jakarta, KCA connects a trusted global network of ' +
      'OEMs, MROs, suppliers, and industry partners - so every requirement ' +
      'is matched against the whole network, not a single supplier list.',
  },
  pillars: {
    label: 'Connected Through',
    heading: 'How the Ecosystem Delivers',
    intro:
      'Every partnership runs through KCA’s four pillars - parts, component ' +
      'MRO, technical services, and the global supply network. Explore how ' +
      'each one turns the ecosystem into capability for the fleet.',
  },
  cta: {
    label: 'Partner With Us',
    heading: 'Ready to Build the Ecosystem?',
    body:
      'Whether you are an OEM, airline, MRO, lessor, operator, financial ' +
      'institution, or aviation investor - tell us where you sit in the ' +
      'aviation aftermarket, and we set out how a long-term partnership with ' +
      'KCA creates value for both sides.',
  },
};
