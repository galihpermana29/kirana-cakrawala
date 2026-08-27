// The homepage's single content seam (see kirana-2fe).
// Every section component reads from this module and nothing else.
// Copy source of truth: docs/positioning.md (KCA vision/mission/positioning).
// The future Sanity extraction swaps this module's implementation for a
// GROQ fetch; the exported shape is the contract.

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  /* Small data eyebrow above the headline, Stripe-style. */
  eyebrow: string;
  /* Rendered as stacked lines, scramble-revealed in sequence. */
  headlineLines: string[];
  subline: string;
  ctaPrimary: NavItem;
  ctaSecondary: NavItem;
  /* Fills the diagonal ribbon - the hero's focal object. */
  image: SourcedImage;
}

export interface WhoWeAreContent {
  label: string;
  /* Scroll-lit word by word. */
  statement: string;
  body: string;
}

export type PillarId = 'parts' | 'mro' | 'technical' | 'network';

export interface Pillar {
  /* Also the key each pillar page is looked up by (src/content/what-we-do.ts). */
  id: PillarId;
  name: string;
  description: string;
  image: SourcedImage;
}

export interface SourcedImage {
  src: string;
  alt: string;
  /* Where the placeholder came from; also recorded in IMAGE-SOURCES.md. */
  sourceUrl: string;
}

export interface NetworkNode {
  name: string;
  xPct: number;
  yPct: number;
}

export interface NewsItem {
  date: string;
  title: string;
  excerpt: string;
}

export interface ContactContent {
  address: string;
  email: string;
  phone: string;
}

export interface HomeContent {
  companyName: string;
  brandAbbr: string;
  tagline: string;
  nav: NavItem[];
  hero: HeroContent;
  whoWeAre: WhoWeAreContent;
  whatWeDo: {
    label: string;
    heading: string;
    intro: string;
    pillars: Pillar[];
  };
  ecosystem: {
    label: string;
    heading: string;
    intro: string;
    /* Partner categories cycled in the marquee - no invented company names. */
    categories: string[];
    /* Neutral nodes visualizing the global supply network on the dotted map. */
    network: NetworkNode[];
  };
  commitment: {
    label: string;
    heading: string;
    body: string;
    cta: NavItem;
    /* Sits under a heavy navy overlay behind the band's copy. */
    image: SourcedImage;
  };
  news: {
    label: string;
    heading: string;
    intro: string;
    items: NewsItem[];
    showAll: NavItem;
  };
  contact: ContactContent;
}

export const home: HomeContent = {
  companyName: 'Kirana Cakrawala',
  brandAbbr: 'KCA',
  tagline: 'Your Integrated Aviation Aftermarket Partner',
  // Anchors are written absolute (/#about) so the shared header and footer
  // resolve from inner pages too; each becomes a real route as its page lands.
  nav: [
    { label: 'About Us', href: '/#about' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Partners', href: '/#ecosystem' },
    { label: 'News & Articles', href: '/#news' },
    { label: 'Contact Us', href: '/#contact' },
  ],
  hero: {
    eyebrow: 'AOG support, 24/7 - Jakarta HQ',
    headlineLines: ['Your Integrated', 'Aviation Aftermarket', 'Partner'],
    subline:
      'Connecting Parts, MRO, Technical Expertise & Global Supply Networks.',
    ctaPrimary: { label: 'Explore Our Capabilities', href: '#pillars' },
    ctaSecondary: { label: 'About Us', href: '#about' },
    image: {
      src: '/images/galih-2.jpg',
      alt: 'Fighter jet banking away with afterburners lit against a blue sky',
      sourceUrl: 'provided-by-galih (source and license to be confirmed)',
    },
  },
  whoWeAre: {
    label: 'Who We Are',
    statement:
      'To become Asia’s trusted and integrated aviation aftermarket ' +
      'solutions partner - connecting global capabilities, technology, and ' +
      'supply networks to deliver superior value, reliability, and ' +
      'operational readiness.',
    body:
      'KCA is your integrated aviation aftermarket partner, connecting ' +
      'parts, MRO, technical expertise, and global supply networks for ' +
      'airlines, operators, MROs, and aviation organizations.',
  },
  whatWeDo: {
    label: 'What We Do',
    heading: 'End-to-End Aftermarket Solutions',
    intro:
      'Comprehensive solutions covering aircraft and engine spare parts, ' +
      'components, rotables, component MRO, technical services, and asset ' +
      'solutions.',
    pillars: [
      {
        id: 'parts',
        name: 'Parts & Components',
        description:
          'Aircraft and engine spare parts, components, and rotables - ' +
          'sourced competitively and delivered with optimized cost and ' +
          'lead time.',
        image: {
          src: '/images/pillar-parts.jpg',
          alt: 'Jet engine turbine blades in close-up',
          sourceUrl:
            'https://commons.wikimedia.org/wiki/File:Inlet_of_jet_engine.jpg',
        },
      },
      {
        id: 'mro',
        name: 'Component MRO',
        description:
          'High-quality component repair, overhaul, and refurbishment that ' +
          'extends component life, improves reliability, and maximizes the ' +
          'economic value of aviation assets.',
        image: {
          src: '/images/pillar-mro.jpg',
          alt: 'Turbofan engine on a stand in a maintenance hangar',
          sourceUrl: 'https://unsplash.com/photos/fkcjWXPRAZU',
        },
      },
      {
        id: 'technical',
        name: 'Technical Services',
        description:
          'Experienced engineering, technical assistance, field support, ' +
          'troubleshooting, and specialized training that improve aircraft ' +
          'availability and operational readiness.',
        image: {
          src: '/images/pillar-technical.jpg',
          alt: 'Technician in a hi-vis vest inspecting the underside of an airliner wing',
          sourceUrl: 'https://unsplash.com/photos/7OgQ-Ze7BXQ',
        },
      },
      {
        id: 'network',
        name: 'Global Supply Network',
        description:
          'A trusted global network of OEMs, MROs, suppliers, and industry ' +
          'partners providing competitive, transparent, and reliable ' +
          'sourcing.',
        image: {
          src: '/images/pillar-network.jpg',
          alt: 'Open cargo hold of a freighter aircraft with netted air freight pallets',
          sourceUrl: 'https://unsplash.com/photos/D1H7jEwlWMU',
        },
      },
    ],
  },
  ecosystem: {
    label: 'Our Ecosystem',
    heading: 'An Integrated Aviation Ecosystem',
    intro:
      'Long-term partnerships with OEMs, airlines, MROs, lessors, ' +
      'operators, financial institutions, and aviation investors - an ' +
      'integrated and scalable aviation aftermarket ecosystem.',
    categories: [
      'OEMs',
      'Airlines',
      'MROs',
      'Lessors',
      'Operators',
      'Financial Institutions',
      'Aviation Investors',
    ],
    network: [
      { name: 'Americas', xPct: 15, yPct: 38 },
      { name: 'Europe', xPct: 47, yPct: 30 },
      { name: 'Middle East', xPct: 60, yPct: 45 },
      { name: 'East Asia', xPct: 82, yPct: 40 },
    ],
  },
  commitment: {
    label: 'Our Commitment',
    heading: 'Right Part. Right Solution. Right Time.',
    body: 'Keeping Aviation Moving.',
    cta: { label: 'Contact Us', href: '#contact' },
    image: {
      src: '/images/commitment-wing.jpg',
      alt: 'Aircraft wing over evening clouds at altitude',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Evening_light_at_25,000_ft_(Explored)_-_Flickr_-_M_McBey.jpg',
    },
  },
  news: {
    label: 'News & Articles',
    heading: 'From the Hangar',
    intro:
      'Developments in aviation aftermarket capability, company ' +
      'milestones, and industry insights.',
    items: [
      {
        date: '26.08.10',
        title: 'Building Component MRO Capability',
        excerpt:
          'How repair, overhaul, and refurbishment extend component life ' +
          'and maximize asset value.',
      },
      {
        date: '26.08.03',
        title: 'Optimizing AOG Response Across Asia',
        excerpt:
          'Sourcing the right part with the right lead time - keeping ' +
          'aircraft available and operations ready.',
      },
      {
        date: '26.07.28',
        title: 'The Integrated Aftermarket Ecosystem',
        excerpt:
          'Why connecting OEMs, MROs, lessors, and operators creates value ' +
          'across every transaction.',
      },
    ],
    showAll: { label: 'Show All Articles', href: '#news' },
  },
  contact: {
    address:
      'Jl. Gading Kirana Timur A.13 No.27, Kelapa Gading, North Jakarta',
    email: 'info@kiranacakrawala.com',
    phone: '(021) 22868855',
  },
};
