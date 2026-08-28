// The What We Do content seam (see kirana-c5q): one typed module feeding the
// hub page at /what-we-do and the four pillar pages under it. Components under
// src/components/what-we-do read from this module and nothing else.
// Copy source of truth: docs/positioning.md - missions 1-4 map to the four
// pillars, and every page expands its mission point; nothing here invents
// facts (no certifications, counts, or locations beyond the Jakarta HQ).

import {
  home,
  type NavItem,
  type Pillar,
  type PillarId,
  type SourcedImage,
} from './home';

export const WHAT_WE_DO_PATH = '/what-we-do';

/* Site-wide destinations the pillar pages link out to. About and Contact are
   still homepage sections; when their own pages land (kirana-wsh, kirana-kga)
   only these two entries change. */
export const contactLink: NavItem = { label: 'Contact Us', href: '/#contact' };
export const aboutLink: NavItem = { label: 'About Us', href: '/#about' };

export interface MissionPoint {
  /* 1-based number in docs/positioning.md. */
  number: number;
  title: string;
  text: string;
}

export interface Capability {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

/* The "/ label, heading, intro" head every section opens with. */
export interface SectionIntro {
  label: string;
  heading: string;
  intro: string;
}

/* The overview every expansion page opens with (PillarOverview): the
   mission point it expands, quoted verbatim, the page's reading of it, and
   a short list under its own label. */
export interface OverviewContent {
  label: string;
  mission: MissionPoint;
  body: string[];
  scopeLabel: string;
  scope: string[];
}

export interface PillarPage extends Pillar {
  slug: string;
  href: string;
  /* 1-based position in the pillar sequence, rendered as "01 / 04". */
  index: number;
  /* Hero subline - the pillar's promise in one sentence. */
  standfirst: string;
  overview: OverviewContent;
  capabilities: SectionIntro & { items: Capability[] };
  process: SectionIntro & { steps: ProcessStep[] };
  cta: {
    heading: string;
    body: string;
  };
}

export interface WhatWeDoIndexContent {
  title: string;
  heading: string;
  standfirst: string;
  image: SourcedImage;
  grid: SectionIntro;
  cta: {
    label: string;
    heading: string;
    body: string;
  };
}

/* Interface copy for the template chrome - button and band labels - kept
   here so the components stay copy-free. */
export const whatWeDoLabels = {
  /* Hub hero primary: "Start with Parts & Components". */
  startWith: 'Start with',
  allCapabilities: 'All Capabilities',
  /* Pillar CTA band label and its "Next: Component MRO" ghost button. */
  nextStep: 'Next Step',
  next: 'Next:',
  /* Cross-link card foot. */
  explorePillar: 'Explore pillar',
  /* Homepage Domains panel button: "Explore Parts & Components". */
  explore: 'Explore',
};

type PillarDetails = Omit<
  PillarPage,
  keyof Pillar | 'slug' | 'href' | 'index'
>;

const pillarSummaries = home.whatWeDo.pillars;

/* Each page is the homepage pillar summary plus its expansion; the summary
   (name, description, image) is read from home.ts so the two never drift. */
function definePillar(
  id: PillarId,
  slug: string,
  details: PillarDetails,
): PillarPage {
  const summary = pillarSummaries.find((pillar) => pillar.id === id);
  if (!summary) {
    throw new Error(`what-we-do: no homepage pillar with id "${id}"`);
  }
  return {
    ...summary,
    ...details,
    slug,
    href: `${WHAT_WE_DO_PATH}/${slug}`,
    index: pillarSummaries.indexOf(summary) + 1,
  };
}

export const pillarPages: PillarPage[] = [
  definePillar('parts', 'parts-components', {
    standfirst:
      'Aircraft and engine spare parts, components, and rotables - sourced ' +
      'competitively through a trusted global network and delivered with ' +
      'optimized cost and lead time.',
    overview: {
      label: 'Overview',
      mission: {
        number: 1,
        title: 'Integrated Aviation Aftermarket Solutions',
        text:
          'Deliver end-to-end solutions covering aircraft and engine spare ' +
          'parts, components, rotables, component MRO, technical services, ' +
          'and asset solutions to support airlines, operators, MROs, and ' +
          'aviation organizations.',
      },
      body: [
        'Every aircraft on the ground is waiting on a part. KCA supplies ' +
          'aircraft and engine spare parts, components, and rotables as one ' +
          'integrated service - from routine consumables to critical ' +
          'rotables - so airlines, operators, MROs, and aviation ' +
          'organizations deal with a single accountable partner instead of ' +
          'a fragmented supplier list.',
        'Each requirement is matched against a trusted network of OEMs, ' +
          'MROs, and suppliers, then delivered with optimized cost and lead ' +
          'time. Where a customer needs more than a sale - exchange, loan, ' +
          'or asset solutions - KCA structures the arrangement around the ' +
          'fleet’s operational needs.',
      ],
      scopeLabel: 'Scope of Supply',
      scope: [
        'Aircraft spare parts',
        'Engine spare parts',
        'Components and rotables',
        'Consumables and expendables',
        'Asset solutions - exchange, loan, and sale',
      ],
    },
    capabilities: {
      label: 'Capabilities',
      heading: 'From Requirement to Delivered Part',
      intro:
        'One accountable partner across the full parts lifecycle - sourcing, ' +
        'documentation, delivery, and the asset solutions that keep a fleet ' +
        'flying between them.',
      items: [
        {
          title: 'Spare Parts Supply',
          description:
            'Aircraft and engine spare parts for scheduled maintenance and ' +
            'unscheduled demand, sourced through OEM, MRO, and approved ' +
            'supplier channels.',
        },
        {
          title: 'Rotables and Components',
          description:
            'Serviceable rotables and components delivered with full ' +
            'traceability and release documentation from the approved source.',
        },
        {
          title: 'Exchange and Loan Programs',
          description:
            'Exchange and loan arrangements that keep the aircraft flying ' +
            'while the removed unit is repaired or replaced.',
        },
        {
          title: 'AOG Response',
          description:
            'Priority handling for aircraft-on-ground requirements - the ' +
            'fastest reliable route to a serviceable part, around the clock.',
        },
        {
          title: 'Asset Solutions',
          description:
            'Sale, exchange, and asset management options matched to the ' +
            'fleet’s operational and financial needs.',
        },
        {
          title: 'Traceability and Documentation',
          description:
            'Complete documentation with every part - release, trace, and ' +
            'history - with zero compromise on quality or airworthiness.',
        },
      ],
    },
    process: {
      label: 'How We Work',
      heading: 'How a Requirement Moves',
      intro:
        'A transparent path from the first request to an installed part, ' +
        'with cost, lead time, and documentation visible at every step.',
      steps: [
        {
          title: 'Requirement',
          description:
            'Part number, quantity, condition, and urgency captured - AOG, ' +
            'critical, or routine.',
        },
        {
          title: 'Sourcing',
          description:
            'Options matched across the global network of OEMs, MROs, and ' +
            'suppliers; cost and lead time compared transparently.',
        },
        {
          title: 'Quality Check',
          description:
            'Documentation, trace, and condition verified before the part ' +
            'is released.',
        },
        {
          title: 'Delivery',
          description:
            'Shipped and tracked to the customer’s station, with support ' +
            'until the part is installed.',
        },
      ],
    },
    cta: {
      heading: 'Need a Part?',
      body:
        'Tell us the part number, condition, and urgency - we come back ' +
        'with sourcing options, cost, and lead time.',
    },
  }),

  definePillar('mro', 'component-mro', {
    standfirst:
      'High-quality component repair, overhaul, and refurbishment that ' +
      'extends component life, improves reliability, and maximizes the ' +
      'economic value of aviation assets.',
    overview: {
      label: 'Overview',
      mission: {
        number: 3,
        title: 'Component MRO & Asset Optimization',
        text:
          'Develop high-quality component repair, overhaul, refurbishment, ' +
          'and asset management capabilities that extend component life, ' +
          'improve reliability, and maximize the economic value of aviation ' +
          'assets.',
      },
      body: [
        'A component’s value does not end at its first removal. KCA ' +
          'develops component repair, overhaul, and refurbishment ' +
          'capabilities that return units to service reliably - extending ' +
          'component life and lowering the cost of ownership across the ' +
          'fleet.',
        'Beyond the workshop, asset management ties every repair decision ' +
          'to the economics of the fleet: when to repair, when to exchange, ' +
          'and when to retire a unit - so each decision maximizes the ' +
          'economic value of the asset.',
      ],
      scopeLabel: 'Scope of Service',
      scope: [
        'Component repair',
        'Overhaul',
        'Refurbishment',
        'Repair management through partner MRO shops',
        'Asset management and lifecycle planning',
      ],
    },
    capabilities: {
      label: 'Capabilities',
      heading: 'Repair, Overhaul, and Asset Optimization',
      intro:
        'Capabilities that return components to service and keep them there ' +
        '- backed by the asset decisions that make each repair worth making.',
      items: [
        {
          title: 'Component Repair',
          description:
            'Diagnosis and repair of removed components, returned to ' +
            'serviceable condition with complete documentation and traceability.',
        },
        {
          title: 'Overhaul',
          description:
            'Complete overhaul that restores components to their specified ' +
            'performance and service life.',
        },
        {
          title: 'Refurbishment',
          description:
            'Refurbishment programs that extend the useful life of ' +
            'components and defer replacement cost.',
        },
        {
          title: 'Repair Management',
          description:
            'Coordinated repair routing through a network of approved MRO ' +
            'partners, with turnaround time and cost managed end to end.',
        },
        {
          title: 'Reliability Improvement',
          description:
            'Analysis of removal and repair data to address recurring ' +
            'failures and improve component reliability.',
        },
        {
          title: 'Asset Management',
          description:
            'Repair-or-replace decisions, pooling, and lifecycle planning ' +
            'that maximize the economic value of every aviation asset.',
        },
      ],
    },
    process: {
      label: 'How We Work',
      heading: 'How a Component Moves',
      intro:
        'From induction to certified release - each stage documented, each ' +
        'decision weighed against the economics of the fleet.',
      steps: [
        {
          title: 'Induction',
          description:
            'The removed unit is received, its history reviewed, and the ' +
            'work scope defined.',
        },
        {
          title: 'Assessment',
          description:
            'Inspection and diagnosis determine repair, overhaul, or ' +
            'refurbishment - and whether repair is the right economic ' +
            'choice.',
        },
        {
          title: 'Work and Test',
          description:
            'Repair or overhaul performed, then the unit tested against its ' +
            'specification.',
        },
        {
          title: 'Release',
          description:
            'Release documentation completed and the serviceable unit ' +
            'returned to the fleet.',
        },
      ],
    },
    cta: {
      heading: 'Have a Component to Repair?',
      body:
        'Share the unit and its history - we assess repair, overhaul, or ' +
        'exchange and recommend the option that protects the asset’s ' +
        'value.',
    },
  }),

  definePillar('technical', 'technical-services', {
    standfirst:
      'Experienced engineering, technical assistance, field support, ' +
      'troubleshooting, and specialized training that improve aircraft ' +
      'availability and operational readiness.',
    overview: {
      label: 'Overview',
      mission: {
        number: 4,
        title: 'Technical Excellence & Operational Readiness',
        text:
          'Provide experienced engineering, technical assistance, field ' +
          'support, troubleshooting, and specialized training to improve ' +
          'customer capability, aircraft availability, and operational ' +
          'readiness.',
      },
      body: [
        'Parts and repairs solve today’s problem; technical expertise ' +
          'keeps the next one from happening. KCA provides experienced ' +
          'engineering, technical assistance, and field support that ' +
          'improve aircraft availability and operational readiness - on ' +
          'the line, in the hangar, and in the planning room.',
        'Specialized training builds customer capability, so operators ' +
          'grow their own expertise over time with KCA as the partner ' +
          'behind it.',
      ],
      scopeLabel: 'Scope of Service',
      scope: [
        'Engineering services',
        'Technical assistance',
        'Field support',
        'Troubleshooting',
        'Specialized training',
      ],
    },
    capabilities: {
      label: 'Capabilities',
      heading: 'Expertise Where the Aircraft Is',
      intro:
        'Engineering and support that meet the customer wherever the work ' +
        'is - and leave their team more capable than before.',
      items: [
        {
          title: 'Engineering Services',
          description:
            'Experienced engineering support for maintenance planning, ' +
            'modifications, and technical evaluations.',
        },
        {
          title: 'Technical Assistance',
          description:
            'On-call technical guidance for maintenance and operations ' +
            'teams working through complex issues.',
        },
        {
          title: 'Field Support',
          description:
            'Engineers deployed to the customer’s line or hangar to ' +
            'support maintenance, inspections, and returns to service.',
        },
        {
          title: 'Troubleshooting',
          description:
            'Structured fault isolation that finds root causes and shortens ' +
            'the path back to serviceability.',
        },
        {
          title: 'Specialized Training',
          description:
            'Training programs that build in-house capability on specific ' +
            'systems, components, and processes.',
        },
        {
          title: 'Readiness Programs',
          description:
            'Ongoing programs that raise aircraft availability and keep ' +
            'operations ready for the schedule.',
        },
      ],
    },
    process: {
      label: 'How We Work',
      heading: 'How Support Is Delivered',
      intro:
        'Every engagement closes the loop: the aircraft returns to service, ' +
        'and what was learned strengthens the customer’s own team.',
      steps: [
        {
          title: 'Request',
          description:
            'The technical issue, the aircraft, and the operational impact ' +
            'are defined.',
        },
        {
          title: 'Assessment',
          description:
            'Engineers review the data and history and set the support ' +
            'plan.',
        },
        {
          title: 'Support',
          description:
            'Assistance delivered remotely or in the field until the ' +
            'aircraft is back in service.',
        },
        {
          title: 'Capability',
          description:
            'Findings feed back into training and procedures, so the ' +
            'customer’s team is stronger next time.',
        },
      ],
    },
    cta: {
      heading: 'Need Technical Support?',
      body:
        'Describe the issue and its impact on operations - our engineers ' +
        'set out a plan for assistance, field support, or training.',
    },
  }),

  definePillar('network', 'global-supply-network', {
    standfirst:
      'A trusted global network of OEMs, MROs, suppliers, and industry ' +
      'partners - competitive, transparent, and reliable sourcing with ' +
      'optimized cost and lead time.',
    overview: {
      label: 'Overview',
      mission: {
        number: 2,
        title: 'Global Supply Chain & Strategic Sourcing',
        text:
          'Leverage a trusted global network of OEMs, MROs, suppliers, and ' +
          'industry partners to provide competitive, transparent, and ' +
          'reliable sourcing with optimized cost and lead time.',
      },
      body: [
        'No single supplier holds every part. KCA’s strength is the ' +
          'network: a trusted global base of OEMs, MROs, suppliers, and ' +
          'industry partners, connected from Jakarta to the aviation ' +
          'aftermarket’s key hubs.',
        'That reach becomes strategic sourcing - competitive, transparent, ' +
          'and reliable - with every option compared on cost, lead time, ' +
          'and quality before the customer commits.',
      ],
      scopeLabel: 'Network Reach',
      scope: [
        'OEM channels',
        'MRO partners',
        'Approved suppliers and distributors',
        'Industry partners',
        'Logistics and forwarding',
      ],
    },
    capabilities: {
      label: 'Capabilities',
      heading: 'Sourcing Built on Trusted Relationships',
      intro:
        'Relationships, transparency, and governance - the three things ' +
        'that turn a supplier list into a supply network the customer can ' +
        'rely on.',
      items: [
        {
          title: 'Strategic Sourcing',
          description:
            'Requirements matched to the right source - OEM, MRO, or ' +
            'supplier - on cost, lead time, and quality.',
        },
        {
          title: 'OEM and Supplier Relationships',
          description:
            'Long-term relationships with OEMs, MROs, and approved ' +
            'suppliers that give customers access to competitive, reliable ' +
            'supply.',
        },
        {
          title: 'Transparent Pricing',
          description:
            'Options presented with clear cost and lead time, so the ' +
            'customer decides with full information.',
        },
        {
          title: 'Lead Time Optimization',
          description:
            'Sourcing routes chosen to shorten the path from requirement to ' +
            'delivery - especially for critical demand.',
        },
        {
          title: 'Logistics Coordination',
          description:
            'Shipping, customs, and handling coordinated to the ' +
            'customer’s station, tracked from dispatch to receipt.',
        },
        {
          title: 'Supplier Governance',
          description:
            'Approved-source policies and documentation checks that keep ' +
            'every transaction airworthy and compliant.',
        },
      ],
    },
    process: {
      label: 'How We Work',
      heading: 'How the Network Works',
      intro:
        'One request, the whole network searched - and the best route ' +
        'recommended with its cost and lead time in the open.',
      steps: [
        {
          title: 'Requirement',
          description:
            'The customer requirement is received and classified by ' +
            'urgency and specification.',
        },
        {
          title: 'Network Search',
          description:
            'Sourcing options gathered across OEMs, MROs, and suppliers ' +
            'worldwide.',
        },
        {
          title: 'Comparison',
          description:
            'Cost, lead time, condition, and trace compared transparently; ' +
            'the best route recommended.',
        },
        {
          title: 'Fulfillment',
          description:
            'Order placed, shipment coordinated, and delivery tracked to ' +
            'receipt.',
        },
      ],
    },
    cta: {
      heading: 'Looking for a Sourcing Partner?',
      body:
        'Bring us the requirement - we search the network and return ' +
        'options with cost, lead time, and trace side by side.',
    },
  }),
];

export const whatWeDoIndex: WhatWeDoIndexContent = {
  title: home.whatWeDo.label,
  heading: home.whatWeDo.heading,
  standfirst: home.whatWeDo.intro,
  image: {
    src: '/images/hero-aircraft.jpg',
    alt: 'Airliner silhouette on approach against a bright sky',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:In_For_Landing_(191942727).jpeg',
  },
  grid: {
    label: 'Four Pillars',
    heading: 'One Partner, Four Pillars',
    intro:
      'Parts, MRO, technical expertise, and global supply networks - each ' +
      'a capability in its own right, and stronger connected. Explore ' +
      'each pillar in depth.',
  },
  cta: {
    label: home.commitment.label,
    heading: home.commitment.heading,
    body: home.commitment.body,
  },
};

/* Copy shared by every pillar page's cross-link section. */
export const otherPillarsGrid: SectionIntro = {
  label: 'Explore',
  heading: 'The Other Pillars',
  intro:
    'KCA connects parts, MRO, technical expertise, and global supply ' +
    'networks as one integrated service. Explore how the other pillars ' +
    'connect to this one.',
};

/* The CTA bands reuse the homepage commitment imagery so the site ends every
   page on the same note. */
export const ctaImage: SourcedImage = home.commitment.image;

export function pillarPage(id: PillarId): PillarPage {
  const page = pillarPages.find((pillar) => pillar.id === id);
  if (!page) throw new Error(`what-we-do: no pillar page with id "${id}"`);
  return page;
}

export function otherPillars(current: PillarPage): PillarPage[] {
  return pillarPages.filter((pillar) => pillar.id !== current.id);
}

/* Wraps around so the last pillar's CTA leads back to the first. */
export function nextPillar(current: PillarPage): PillarPage {
  const i = pillarPages.indexOf(current);
  return pillarPages[(i + 1) % pillarPages.length]!;
}

/* "01" style counters used by every pillar component. */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}
