// The Contact content seam (see kirana-kga): one typed module feeding the
// Contact Us page at /contact. Components under src/components/contact read
// from this module and nothing else.
// Copy source of truth: docs/positioning.md - the page turns the commitment
// line (right part, right solution, right time - keeping aviation moving)
// into the promise every inquiry gets, and draws only on the seven mission
// points. The address, email, and phone come from home.ts so the page and
// the footer can never disagree. Nothing here invents facts: no office
// hours, response times, or named staff.

import {
  home,
  mailHref,
  telHref,
  type NavItem,
  type SourcedImage,
} from './home';
import { PARTNERS_PATH } from './partners';
import {
  pillarPages,
  WHAT_WE_DO_PATH,
  whatWeDoLabels,
  type SectionIntro,
} from './what-we-do';

export { mailHref, telHref };

/* The two in-page destinations the hero buttons jump to. */
export const INQUIRY_ANCHOR = 'inquiry';
export const OFFICE_ANCHOR = 'office';

/* One way to reach KCA, as a card: the channel, its value in display type,
   what it is for, and the action the card performs. */
export interface ContactChannel {
  /* 1-based position, rendered as "01". */
  index: number;
  name: string;
  value: string;
  href: string;
  description: string;
  /* Card foot: "Write to us". */
  action: string;
}

export type FieldKind = 'text' | 'email' | 'tel' | 'select' | 'textarea';

/* One inquiry form field. `name` is the key Web3Forms receives, so it is
   also the label of the line in the resulting email. */
export interface FormField {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  /* Half fields pair up on one row on desktop; full fields take the row. */
  span: 'half' | 'full';
  autocomplete?: string;
  placeholder?: string;
  /* Select fields only; the chosen label is what the email carries. */
  options?: string[];
}

export interface NextStep {
  title: string;
  description: string;
}

export interface ChannelsContent extends SectionIntro {
  items: ContactChannel[];
}

export interface InquiryContent extends SectionIntro {
  fields: FormField[];
  /* Aside: what happens after the form is sent. */
  nextSteps: { label: string; steps: NextStep[] };
  /* Aside: routes into the site for a visitor still working out what to ask. */
  routes: { label: string; items: NavItem[] };
}

export interface OfficeContent extends SectionIntro {
  /* The map pin's name - the homepage HQ node. */
  name: string;
  country: string;
}

export interface ContactPageContent {
  title: string;
  heading: string;
  standfirst: string;
  image: SourcedImage;
  channels: ChannelsContent;
  inquiry: InquiryContent;
  office: OfficeContent;
  cta: {
    label: string;
    heading: string;
    body: string;
    primary: NavItem;
    secondary: NavItem;
  };
}

/* Interface copy for the page chrome - buttons, form states, the map - kept
   here so the components stay copy-free. */
export const contactLabels = {
  /* Hero primary; jumps to the form. */
  sendInquiry: 'Send an Inquiry',
  /* Hero secondary; jumps to the office section. */
  findOffice: 'Find Our Office',
  /* Field flag next to a non-required label. */
  optional: 'Optional',
  selectPrompt: 'Select an inquiry type',
  submit: 'Send Inquiry',
  sending: 'Sending…',
  errors: {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
  },
  /* Replaces the form once Web3Forms accepts the submission. */
  sent: {
    label: 'Inquiry Received',
    heading: 'Thank You - We Have Your Inquiry',
    body:
      'Your message is with the KCA team in Jakarta. We will come back to ' +
      'you at',
    again: 'Send Another Inquiry',
  },
  /* Shown under the form when the submission does not go through. */
  failed: {
    heading: 'The message did not go through',
    body: 'Please try again, or email us directly at',
  },
  /* Shown when PUBLIC_WEB3FORMS_KEY is empty: the form renders, but says
     so instead of failing silently. */
  notConnected: {
    heading: 'Form not yet connected',
    body:
      'This inquiry form is not wired to a mailbox yet. In the meantime, ' +
      'reach us directly at',
  },
  getDirections: 'Get Directions',
  mapTitle: `Map of the ${home.brandAbbr} head office in ${locality()}`,
};

/* Web3Forms (decision 2026-08-28): a static site posts straight to its API;
   the public access key is read from PUBLIC_WEB3FORMS_KEY by the page and
   handed to the form. Swapping the destination mailbox is one env change. */
export const inquiryForm = {
  endpoint: 'https://api.web3forms.com/submit',
  /* Base subject; the form appends the inquiry type and company. */
  subject: `${home.brandAbbr} website inquiry`,
  fromName: `${home.brandAbbr} Website`,
};

/* What the inquiry is about: the four pillars, a partnership, or anything
   else. Rendered as the form's select and folded into the email subject. */
export const inquiryTypes: string[] = [
  ...home.whatWeDo.pillars.map((pillar) => pillar.name),
  'Strategic Partnership',
  'General Inquiry',
];

/* "01" style counters, shared with every other inner page. */
export { pad } from './what-we-do';

/* The address as the footer prints it, split into its lines for the office
   card: street, district, city. */
export function addressLines(): string[] {
  return home.contact.address.split(', ');
}

/* "Kelapa Gading, North Jakarta" - the district and city, wherever the page
   names the location without the street. */
export function locality(): string {
  return addressLines().slice(1).join(', ');
}

/* The full postal address, for the map and directions queries. */
export function fullAddress(): string {
  return `${home.contact.address}, ${contactPage.office.country}`;
}

/* Google Maps' keyless embed: it geocodes the address itself, so no
   coordinates are hardcoded that could drift from the printed address. */
export function mapEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress())}&z=16&output=embed`;
}

/* Opens the address in the visitor's Google Maps (Maps URLs API, keyless). */
export function directionsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress())}`;
}

const { contact } = home;

export const contactPage: ContactPageContent = {
  title: 'Contact Us',
  heading: 'Let’s Keep Aviation Moving',
  standfirst:
    'An AOG requirement, a component repair, technical support, or a ' +
    'long-term partnership - tell us what your operation needs, and the KCA ' +
    'team in Jakarta comes back with the right solution.',
  /* A person crossing a quiet apron toward the tower at dusk - reaching
     the people behind the operation. */
  image: {
    src: '/images/contact-hero.jpg',
    alt:
      'Silhouetted person crossing an airport apron at dusk toward the ' +
      'terminal and control tower, a business jet parked against the sunset',
    sourceUrl: 'https://unsplash.com/photos/EZDUCs-yLWU',
  },
  channels: {
    label: 'Reach Us',
    heading: 'Three Ways to Reach KCA',
    intro:
      'Email for quotes and proposals, the phone for anything urgent, or ' +
      'the head office in Kelapa Gading - every route reaches the same team.',
    items: [
      {
        index: 1,
        name: 'Email',
        value: contact.email,
        href: mailHref(contact.email),
        description:
          'Quotes, requests for proposal, partnership proposals, and ' +
          'general inquiries.',
        action: 'Write to us',
      },
      {
        index: 2,
        name: 'Phone',
        value: contact.phone,
        href: telHref(contact.phone),
        description:
          'Urgent and AOG requirements - call the Jakarta head office ' +
          'directly.',
        action: 'Call the office',
      },
      {
        index: 3,
        name: 'Head Office',
        value: locality(),
        href: `#${OFFICE_ANCHOR}`,
        description: `${addressLines()[0]} - see the map and get directions.`,
        action: 'Find us',
      },
    ],
  },
  inquiry: {
    label: 'Send an Inquiry',
    heading: 'Tell Us What You Need',
    intro:
      'Share the requirement - a part number, a component, an aircraft type, ' +
      'or the partnership you have in mind - and we route it to the ' +
      'capability team that fits.',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        kind: 'text',
        required: true,
        span: 'half',
        autocomplete: 'name',
      },
      {
        name: 'company',
        label: 'Company / Organization',
        kind: 'text',
        required: true,
        span: 'half',
        autocomplete: 'organization',
      },
      {
        name: 'email',
        label: 'Work Email',
        kind: 'email',
        required: true,
        span: 'half',
        autocomplete: 'email',
      },
      {
        name: 'phone',
        label: 'Phone',
        kind: 'tel',
        required: false,
        span: 'half',
        autocomplete: 'tel',
      },
      {
        name: 'inquiry_type',
        label: 'Inquiry Type',
        kind: 'select',
        required: true,
        span: 'full',
        options: inquiryTypes,
      },
      {
        name: 'message',
        label: 'Message',
        kind: 'textarea',
        required: true,
        span: 'full',
        placeholder:
          'Part number, quantity, condition, aircraft type, required date - ' +
          'anything that helps us respond precisely.',
      },
    ],
    nextSteps: {
      label: 'What Happens Next',
      steps: [
        {
          title: 'Your inquiry lands in Jakarta',
          description:
            'It reaches the KCA team at the head office in Kelapa Gading, ' +
            'North Jakarta.',
        },
        {
          title: 'The right team picks it up',
          description:
            'Parts and components, component MRO, technical services, or ' +
            'partnerships - the capability that matches your requirement ' +
            'takes it from here.',
        },
        {
          title: 'We come back with a solution',
          description:
            'Right part. Right solution. Right time. A clear answer on how ' +
            'KCA supports your operation.',
        },
      ],
    },
    routes: {
      label: 'Still Exploring?',
      items: [
        ...pillarPages.map((pillar) => ({ label: pillar.name, href: pillar.href })),
        { label: 'Partners & Ecosystem', href: PARTNERS_PATH },
      ],
    },
  },
  office: {
    label: 'Head Office',
    heading: locality(),
    intro:
      'KCA is headquartered in Kelapa Gading, North Jakarta - the anchor of ' +
      'a trusted global network of OEMs, MROs, suppliers, and industry ' +
      'partners that every requirement is matched against.',
    name: home.ecosystem.hq.name,
    country: 'Indonesia',
  },
  cta: {
    label: 'Keep Exploring',
    heading: 'See What We Deliver',
    body:
      'End-to-end aftermarket solutions - aircraft and engine spare parts, ' +
      'components and rotables, component MRO, technical services, and a ' +
      'trusted global supply network.',
    primary: { label: whatWeDoLabels.allCapabilities, href: WHAT_WE_DO_PATH },
    secondary: { label: 'Our Partners', href: PARTNERS_PATH },
  },
};
