// The News & Articles content seam (see kirana-bad): one flat typed module
// holding every article, feeding the listing at /news, the article pages
// under it, and the homepage teaser. Components under src/components/news
// read from this module and nothing else.
// News is the most CMS-bound content on the site, so the shape stays flat and
// portable: the future Sanity extraction swaps `articles` for a GROQ fetch and
// the helpers below keep working; body blocks map one-to-one onto Portable
// Text block types.
// Copy source of truth: docs/positioning.md - every article expands a mission
// point or the commitment line; nothing here invents facts (no certifications,
// counts, customers, or locations beyond the Jakarta HQ).

import { home, type NavItem, type PillarId, type SourcedImage } from './home';
import {
  contactLink,
  pillarPage,
  WHAT_WE_DO_PATH,
  type SectionIntro,
} from './what-we-do';

export const NEWS_PATH = '/news';

export type ArticleCategory = 'capability' | 'insight' | 'company';

export const categoryLabels: Record<ArticleCategory, string> = {
  capability: 'Capability',
  insight: 'Insight',
  company: 'Company',
};

/* Ordered as the filter strip shows them. */
export const categories: ArticleCategory[] = ['capability', 'insight', 'company'];

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  /* A mission point or the commitment line, quoted verbatim. */
  | { type: 'quote'; text: string; cite?: string };

export interface Article {
  slug: string;
  href: string;
  title: string;
  /* ISO date (YYYY-MM-DD); rendered through shortDate / longDate. */
  date: string;
  category: ArticleCategory;
  /* Card copy and the article standfirst. */
  excerpt: string;
  image: SourcedImage;
  /* The pillar this article expands: its page is the "related capability"
     link and its CTA closes the article. Company news has none. */
  pillar?: PillarId;
  body: ArticleBlock[];
  /* Derived from the body word count at ~200 words per minute, rounded up. */
  readingMinutes: number;
}

export interface NewsIndexContent {
  title: string;
  heading: string;
  standfirst: string;
  image: SourcedImage;
  feed: SectionIntro;
  cta: {
    label: string;
    heading: string;
    body: string;
  };
}

/* Interface copy for the template chrome - buttons, meta labels, and band
   labels - kept here so the components stay copy-free. */
export const newsLabels = {
  readArticle: 'Read article',
  /* Eyebrow on the featured (newest) card. */
  latest: 'Latest',
  filter: 'Filter',
  all: 'All',
  /* Suffix of the live count: "06 Articles". */
  articles: 'Articles',
  minRead: 'min read',
  published: 'Published',
  category: 'Category',
  readingTime: 'Reading time',
  relatedCapability: 'Related capability',
  share: 'Share',
  copyLink: 'Copy link',
  copied: 'Link copied',
  shareOn: 'Share on',
  newer: 'Newer',
  older: 'Older',
  allArticles: 'All Articles',
  readLatest: 'Read the Latest',
  nextStep: 'Next Step',
  explore: 'Explore',
};

export const newsIndex: NewsIndexContent = {
  title: home.news.label,
  heading: home.news.heading,
  standfirst: home.news.intro,
  image: {
    src: '/images/news-hero.jpg',
    alt: 'Widebody turbofan engine under a wing inside a maintenance hangar',
    sourceUrl: 'https://unsplash.com/photos/ERed5HLKSYA',
  },
  feed: {
    label: 'Articles',
    heading: 'Latest Articles',
    intro:
      'Perspectives on parts supply, component MRO, technical services, and ' +
      'the global network behind them - newest first.',
  },
  cta: {
    label: 'Work With Us',
    heading: home.commitment.body,
    body:
      'Talk to KCA about parts, component MRO, technical services, or ' +
      'sourcing - one integrated partner from requirement to installed part.',
  },
};

/* Copy shared by every article page's cross-link section. */
export const continueReading: SectionIntro = {
  label: 'Continue Reading',
  heading: 'More From the Hangar',
  intro:
    'Further developments in aviation aftermarket capability, company ' +
    'milestones, and industry insights.',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function dateParts(iso: string): { year: string; month: string; day: string } {
  const [year = '', month = '', day = ''] = iso.split('-');
  return { year, month, day };
}

/* "26.08.10" - the homepage card format. */
export function shortDate(iso: string): string {
  const { year, month, day } = dateParts(iso);
  return `${year.slice(2)}.${month}.${day}`;
}

/* "10 August 2026" - article header and meta. */
export function longDate(iso: string): string {
  const { year, month, day } = dateParts(iso);
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ''} ${year}`;
}

/* "01" style counters, shared with the pillar pages. */
export { pad } from './what-we-do';

type ArticleInput = Omit<Article, 'href' | 'readingMinutes'>;

const WORDS_PER_MINUTE = 200;

function blockText(block: ArticleBlock): string {
  return block.type === 'list' ? block.items.join(' ') : block.text;
}

function readingMinutes(body: ArticleBlock[]): number {
  const words = body
    .map(blockText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function defineArticle(input: ArticleInput): Article {
  return {
    ...input,
    href: `${NEWS_PATH}/${input.slug}`,
    readingMinutes: readingMinutes(input.body),
  };
}

/* Where each pullquote comes from in docs/positioning.md. */
const quoteSource = {
  mro: 'Mission 03 - Component MRO & Asset Optimization',
  technical: 'Mission 04 - Technical Excellence & Operational Readiness',
  ecosystem: 'Mission 05 - Strategic Partnerships & Ecosystem Development',
  governance: 'Mission 06 - Quality, Safety & Governance',
  commitment: 'Our Commitment',
  vision: 'Our Vision',
};

/* Newest first; the homepage teaser shows the first three. */
export const articles: Article[] = [
  defineArticle({
    slug: 'building-component-mro-capability',
    title: 'Building Component MRO Capability',
    date: '2026-08-10',
    category: 'capability',
    pillar: 'mro',
    excerpt:
      'How repair, overhaul, and refurbishment extend component life and ' +
      'maximize asset value.',
    /* Shares the Component MRO pillar's photo - the article expands that page. */
    image: {
      src: '/images/pillar-mro.jpg',
      alt: 'Turbofan engine on a stand in a maintenance hangar',
      sourceUrl: 'https://unsplash.com/photos/fkcjWXPRAZU',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'A component’s value does not end at its first removal. Every unit ' +
          'that comes off an aircraft carries a decision: repair it, exchange ' +
          'it, or retire it. Component MRO is the capability that makes the ' +
          'first option a reliable one - and, done well, the most economical.',
      },
      { type: 'heading', text: 'Three routes back to service' },
      {
        type: 'paragraph',
        text:
          'Repair, overhaul, and refurbishment are different answers to the ' +
          'same question: how does this unit return to serviceable condition ' +
          'at the right cost? Repair addresses the fault that removed the ' +
          'unit. Overhaul restores the component to its specified performance ' +
          'and service life. Refurbishment extends useful life and defers the ' +
          'cost of replacement.',
      },
      {
        type: 'list',
        items: [
          'Repair - diagnose and correct the removal cause, with complete ' +
            'documentation and traceability.',
          'Overhaul - restore the unit to its specified performance and ' +
            'service life.',
          'Refurbishment - extend useful life and defer replacement cost.',
        ],
      },
      { type: 'heading', text: 'Asset optimization, not just repair' },
      {
        type: 'paragraph',
        text:
          'The workshop is only half of the capability. Asset management ties ' +
          'every repair decision to the economics of the fleet: when a repair ' +
          'is worth making, when an exchange keeps the aircraft flying sooner, ' +
          'and when a unit has reached the end of its economic life. ' +
          'Reliability data from removals and repairs closes the loop, so ' +
          'recurring failures are addressed rather than repeated.',
      },
      {
        type: 'quote',
        text:
          'Develop high-quality component repair, overhaul, refurbishment, and ' +
          'asset management capabilities that extend component life, improve ' +
          'reliability, and maximize the economic value of aviation assets.',
        cite: quoteSource.mro,
      },
      { type: 'heading', text: 'What this means for operators' },
      {
        type: 'paragraph',
        text:
          'For airlines, operators, and MROs, the result is a single ' +
          'accountable partner across the component lifecycle - from induction ' +
          'and assessment through work, test, and certified release - with ' +
          'turnaround time, cost, and documentation managed end to end. That ' +
          'is how repair capability becomes asset value: extended component ' +
          'life, improved reliability, and a lower cost of ownership across ' +
          'the fleet.',
      },
    ],
  }),

  defineArticle({
    slug: 'optimizing-aog-response-across-asia',
    title: 'Optimizing AOG Response Across Asia',
    date: '2026-08-03',
    category: 'capability',
    pillar: 'parts',
    excerpt:
      'Sourcing the right part with the right lead time - keeping aircraft ' +
      'available and operations ready.',
    image: {
      src: '/images/news-aog-response.jpg',
      alt: 'Airliner engine nacelle and landing gear on a night ramp under taxiway lights',
      sourceUrl: 'https://unsplash.com/photos/5l3tj1LMBB8',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'An aircraft on the ground is the aviation aftermarket at its most ' +
          'urgent. Every hour waiting on a part is a cancelled rotation, a ' +
          'displaced crew, and passengers or cargo that do not move. AOG ' +
          'response is where an aftermarket partner’s network, process, and ' +
          'discipline are tested at once.',
      },
      { type: 'heading', text: 'The right part, first time' },
      {
        type: 'paragraph',
        text:
          'Speed only counts when the part is right. An AOG requirement is ' +
          'captured precisely - part number, quantity, condition, and the ' +
          'aircraft’s station - before the search begins. Sourcing options ' +
          'are then matched across a trusted network of OEMs, MROs, and ' +
          'approved suppliers, and compared transparently on lead time, cost, ' +
          'and trace.',
      },
      {
        type: 'list',
        items: [
          'Requirement captured with part number, condition, and urgency.',
          'Options gathered across OEM, MRO, and approved supplier channels.',
          'Documentation and trace verified before release.',
          'Shipment coordinated and tracked to the customer’s station.',
        ],
      },
      { type: 'heading', text: 'Lead time as a network property' },
      {
        type: 'paragraph',
        text:
          'Across Asia, the distance between a requirement and the nearest ' +
          'serviceable unit is rarely a straight line. A partner’s value lies ' +
          'in knowing where the alternatives are - OEM stock, partner MRO ' +
          'inventory, exchange and loan pools - and in choosing the route that ' +
          'puts the aircraft back in service soonest without compromising ' +
          'airworthiness.',
      },
      {
        type: 'quote',
        text: 'Right Part. Right Solution. Right Time. Keeping Aviation Moving.',
        cite: quoteSource.commitment,
      },
      { type: 'heading', text: 'Readiness before the call' },
      {
        type: 'paragraph',
        text:
          'The best AOG response begins before the aircraft is grounded. ' +
          'Exchange and loan programs, asset solutions structured around the ' +
          'fleet, and engineering support that addresses recurring removals ' +
          'all reduce the number of AOG events - and shorten the ones that ' +
          'remain. That is the meaning of operational readiness: aircraft ' +
          'available, operations ready, and support around the clock.',
      },
    ],
  }),

  defineArticle({
    slug: 'the-integrated-aftermarket-ecosystem',
    title: 'The Integrated Aftermarket Ecosystem',
    date: '2026-07-28',
    category: 'insight',
    pillar: 'network',
    excerpt:
      'Why connecting OEMs, MROs, lessors, and operators creates value across ' +
      'every transaction.',
    image: {
      src: '/images/news-aftermarket-ecosystem.jpg',
      alt: 'Airport apron at sunset with silhouetted airliners and ground vehicles',
      sourceUrl: 'https://unsplash.com/photos/ZKEjw7oLmQQ',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'The aviation aftermarket is often described as a market of parts ' +
          'and repairs. It is more accurately a market of relationships. The ' +
          'same component may pass through an OEM, a lessor, an operator, an ' +
          'MRO, and a financial institution over its life - and value is ' +
          'created, or lost, at every handover.',
      },
      { type: 'heading', text: 'Fragmentation has a cost' },
      {
        type: 'paragraph',
        text:
          'When each participant deals only with its immediate counterparty, ' +
          'information is lost between them: the removal history that would ' +
          'inform a repair decision, the pooled inventory that would shorten a ' +
          'lead time, the asset owner’s constraints that would change an ' +
          'exchange-or-repair decision. Each transaction is optimized in ' +
          'isolation, and the fleet pays the difference.',
      },
      { type: 'heading', text: 'An integrated ecosystem' },
      {
        type: 'paragraph',
        text:
          'An integrated aviation aftermarket partner sits deliberately at the ' +
          'connections. It links parts supply to component MRO, technical ' +
          'expertise to asset decisions, and a global supply network to the ' +
          'operators who depend on it - so that a single requirement can be ' +
          'answered with the whole ecosystem’s options in view.',
      },
      {
        type: 'quote',
        text:
          'Build long-term partnerships with OEMs, airlines, MROs, lessors, ' +
          'operators, financial institutions, and aviation investors to create ' +
          'an integrated and scalable aviation aftermarket ecosystem.',
        cite: quoteSource.ecosystem,
      },
      {
        type: 'list',
        items: [
          'OEMs and approved suppliers - competitive, reliable supply with ' +
            'full trace.',
          'MRO partners - repair capacity and turnaround managed end to end.',
          'Lessors and asset owners - decisions aligned with the value of the ' +
            'asset.',
          'Operators - aircraft availability and operational readiness.',
          'Financial institutions and investors - disciplined, transparent, ' +
            'sustainable growth.',
        ],
      },
      { type: 'heading', text: 'Value across every transaction' },
      {
        type: 'paragraph',
        text:
          'Connected this way, each transaction improves the next. Sourcing ' +
          'becomes more competitive because the network is wider; repair ' +
          'decisions become better because the data is shared; asset value is ' +
          'protected because every participant sees the same lifecycle. That ' +
          'is the ecosystem KCA is building in Asia - integrated, scalable, ' +
          'and trusted in every transaction.',
      },
    ],
  }),

  defineArticle({
    slug: 'field-support-where-the-aircraft-is',
    title: 'Field Support Where the Aircraft Is',
    date: '2026-07-20',
    category: 'capability',
    pillar: 'technical',
    excerpt:
      'Engineering, technical assistance, and troubleshooting delivered on ' +
      'the line, in the hangar, and in the planning room.',
    /* Shares the Technical Services pillar's photo - the article expands that page. */
    image: {
      src: '/images/pillar-technical.jpg',
      alt: 'Technician in a hi-vis vest inspecting the underside of an airliner wing',
      sourceUrl: 'https://unsplash.com/photos/7OgQ-Ze7BXQ',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'Parts and repairs solve today’s problem. Technical expertise keeps ' +
          'the next one from happening. Field support is the most visible ' +
          'form of that expertise: experienced engineers working alongside ' +
          'the customer’s team wherever the aircraft is.',
      },
      { type: 'heading', text: 'Support that meets the work' },
      {
        type: 'paragraph',
        text:
          'Technical services span a range of engagements - engineering ' +
          'support for maintenance planning and modifications, on-call ' +
          'technical assistance for teams working through complex issues, ' +
          'structured troubleshooting that isolates root causes, and ' +
          'engineers deployed to the line or hangar for inspections and ' +
          'returns to service.',
      },
      {
        type: 'list',
        items: [
          'Engineering services for planning, modifications, and technical ' +
            'evaluations.',
          'Technical assistance on call for maintenance and operations teams.',
          'Field support on the line and in the hangar.',
          'Troubleshooting that finds root causes and shortens the path to ' +
            'serviceability.',
          'Specialized training that builds in-house capability.',
        ],
      },
      { type: 'heading', text: 'Closing the loop' },
      {
        type: 'paragraph',
        text:
          'Every engagement should leave the customer’s team stronger. ' +
          'Findings from troubleshooting feed back into procedures and ' +
          'training; recurring issues become engineering programs rather than ' +
          'repeat visits. Specialized training builds in-house capability on ' +
          'specific systems, components, and processes, so operators grow ' +
          'their own expertise over time.',
      },
      {
        type: 'quote',
        text:
          'Provide experienced engineering, technical assistance, field ' +
          'support, troubleshooting, and specialized training to improve ' +
          'customer capability, aircraft availability, and operational ' +
          'readiness.',
        cite: quoteSource.technical,
      },
      { type: 'heading', text: 'Readiness as the measure' },
      {
        type: 'paragraph',
        text:
          'The measure of technical support is not the number of visits but ' +
          'the availability of the aircraft. Support delivered remotely or in ' +
          'the field until the aircraft is back in service, and capability ' +
          'that stays behind afterwards - that is how technical excellence ' +
          'becomes operational readiness.',
      },
    ],
  }),

  defineArticle({
    slug: 'zero-compromise-quality-safety-governance',
    title: 'Zero Compromise: Quality, Safety, and Governance',
    date: '2026-07-13',
    category: 'insight',
    pillar: 'parts',
    excerpt:
      'Why airworthiness, traceability, and transparency define a trusted ' +
      'aftermarket partner.',
    image: {
      src: '/images/news-quality-governance.jpg',
      alt: 'Airliner glass cockpit at dusk with glowing instrument panels',
      sourceUrl: 'https://unsplash.com/photos/kjqTlMHLci4',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'In the aviation aftermarket, trust is not a soft quality. It is ' +
          'documented, traceable, and verified on every transaction. A ' +
          'competitive price or a short lead time means nothing if the part ' +
          'behind it cannot be traced to an approved source or released with ' +
          'complete documentation.',
      },
      { type: 'heading', text: 'Airworthiness first' },
      {
        type: 'paragraph',
        text:
          'Every part supplied and every component returned to service must ' +
          'meet the airworthiness and regulatory requirements of the aircraft ' +
          'it serves. That begins with approved-source policies - OEM ' +
          'channels, approved suppliers, and partner MROs - and continues ' +
          'through documentation checks before any part is released.',
      },
      {
        type: 'list',
        items: [
          'Approved sources - OEM, MRO, and approved supplier channels only.',
          'Complete documentation - release, trace, and history with every ' +
            'part.',
          'Verification before release - documentation, trace, and condition ' +
            'checked.',
          'Regulatory compliance in every jurisdiction the fleet operates.',
        ],
      },
      { type: 'heading', text: 'Transparency as governance' },
      {
        type: 'paragraph',
        text:
          'Governance extends beyond the part to the transaction. Sourcing ' +
          'options are presented with clear cost and lead time, so the ' +
          'customer decides with full information. Repair-or-replace ' +
          'recommendations are made in the interest of the asset, not the ' +
          'transaction. Business integrity is a standard, not a slogan.',
      },
      {
        type: 'quote',
        text:
          'Operate with zero compromise on safety, quality, airworthiness, ' +
          'regulatory compliance, transparency, and business integrity, ' +
          'establishing KCA as a trusted partner in every transaction.',
        cite: quoteSource.governance,
      },
      { type: 'heading', text: 'Trust in every transaction' },
      {
        type: 'paragraph',
        text:
          'Zero compromise is the discipline that makes an integrated partner ' +
          'possible. Because quality, safety, and governance are not ' +
          'negotiated case by case, customers can rely on the network, the ' +
          'repair decisions, and the parts that arrive - and the partnership ' +
          'can scale.',
      },
    ],
  }),

  defineArticle({
    slug: 'introducing-kca',
    title: 'Introducing KCA: Your Integrated Aviation Aftermarket Partner',
    date: '2026-07-06',
    category: 'company',
    excerpt:
      'Kirana Cakrawala sets out its vision - connecting parts, MRO, ' +
      'technical expertise, and global supply networks for Asia’s aviation ' +
      'industry.',
    image: {
      src: '/images/news-introducing-kca.jpg',
      alt: 'Airliner silhouetted against the sun as it climbs out after takeoff',
      sourceUrl: 'https://unsplash.com/photos/8FwJg9--peo',
    },
    body: [
      {
        type: 'paragraph',
        text:
          'Kirana Cakrawala (KCA) is an integrated aviation aftermarket ' +
          'partner headquartered in Jakarta - connecting parts, MRO, ' +
          'technical expertise, and global supply networks for airlines, ' +
          'operators, MROs, and aviation organizations across Asia.',
      },
      { type: 'heading', text: 'Our vision' },
      {
        type: 'quote',
        text:
          'To become Asia’s trusted and integrated aviation aftermarket ' +
          'solutions partner, connecting global capabilities, technology, and ' +
          'supply networks to deliver superior value, reliability, and ' +
          'operational readiness to the aviation industry.',
        cite: quoteSource.vision,
      },
      { type: 'heading', text: 'Four pillars, one partner' },
      {
        type: 'paragraph',
        text:
          'KCA’s capabilities are organized around four pillars: aircraft and ' +
          'engine spare parts, components, and rotables; component repair, ' +
          'overhaul, and refurbishment; engineering, technical assistance, ' +
          'field support, and training; and a trusted global network of OEMs, ' +
          'MROs, suppliers, and industry partners. Each is a capability in its ' +
          'own right - and stronger connected.',
      },
      {
        type: 'list',
        items: [
          'Parts & Components',
          'Component MRO',
          'Technical Services',
          'Global Supply Network',
        ],
      },
      { type: 'heading', text: 'How we operate' },
      {
        type: 'paragraph',
        text:
          'KCA operates with zero compromise on safety, quality, ' +
          'airworthiness, regulatory compliance, transparency, and business ' +
          'integrity. Long-term partnerships with OEMs, airlines, MROs, ' +
          'lessors, operators, financial institutions, and aviation investors ' +
          'form the ecosystem behind every transaction, and disciplined ' +
          'investment and continuous capability development keep the company ' +
          'building for the long term.',
      },
      { type: 'heading', text: 'Our commitment' },
      {
        type: 'paragraph',
        text:
          'Right Part. Right Solution. Right Time. Keeping Aviation Moving. ' +
          'This is where KCA will share developments in capability, company ' +
          'milestones, and industry insights as the company grows. To discuss ' +
          'a requirement, contact us.',
      },
    ],
  }),
].sort((a, b) => b.date.localeCompare(a.date));

export function latestArticles(count: number): Article[] {
  return articles.slice(0, count);
}

export function articleCount(category?: ArticleCategory): number {
  return category
    ? articles.filter((article) => article.category === category).length
    : articles.length;
}

/* Same category first, then the rest - newest first within each. */
export function relatedArticles(current: Article, count = 3): Article[] {
  const others = articles.filter((article) => article.slug !== current.slug);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

/* Neighbours in publication order; undefined at either end of the archive. */
export function adjacentArticles(current: Article): {
  newer?: Article;
  older?: Article;
} {
  const i = articles.findIndex((article) => article.slug === current.slug);
  return { newer: articles[i - 1], older: articles[i + 1] };
}

/* The pillar page an article expands, as a link; undefined for company news. */
export function relatedPillar(article: Article): NavItem | undefined {
  if (!article.pillar) return undefined;
  const pillar = pillarPage(article.pillar);
  return { label: pillar.name, href: pillar.href };
}

export interface ArticleCta {
  label: string;
  heading: string;
  body: string;
  primary: NavItem;
  secondary: NavItem;
}

/* Every article ends on its pillar's CTA; company news falls back to the
   site-wide one and points at the What We Do hub. */
export function articleCta(article: Article): ArticleCta {
  if (article.pillar) {
    const pillar = pillarPage(article.pillar);
    return {
      label: newsLabels.nextStep,
      heading: pillar.cta.heading,
      body: pillar.cta.body,
      primary: contactLink,
      secondary: { label: `${newsLabels.explore} ${pillar.name}`, href: pillar.href },
    };
  }
  return {
    label: newsIndex.cta.label,
    heading: newsIndex.cta.heading,
    body: newsIndex.cta.body,
    primary: contactLink,
    secondary: { label: home.whatWeDo.label, href: WHAT_WE_DO_PATH },
  };
}
