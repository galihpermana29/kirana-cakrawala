// The Contact seam: the page at /contact - the three ways to reach KCA, the
// inquiry form, and the head office on the map. Components in
// src/components/contact read the shapes declared here and nothing else.
//
// The address, email, and phone are never stored twice: a channel card says
// which detail from Site Settings it shows, and its value, its link, and the
// map's query are derived from there, so the cards, the footer, and the map
// cannot disagree.

import { fetchDocument, once } from '../lib/sanity';
import {
  CTA_SECTION,
  locality,
  mailHref,
  NAV_ITEM,
  PAGE_HERO_SECTION,
  pageQuery,
  telHref,
  type CtaSection,
  type NavItem,
  type PageHeroSection,
  type PageMeta,
  type SectionBase,
  type SectionIntro,
  type SiteSettings,
} from './home';

export {
  addressLines,
  locality,
  mailHref,
  pad,
  telHref,
  visibleSections,
} from './home';

/* The two in-page destinations the hero buttons jump to. */
export const INQUIRY_ANCHOR = 'inquiry';
export const OFFICE_ANCHOR = 'office';

export type FieldKind = 'text' | 'email' | 'tel' | 'select' | 'textarea';

/* One inquiry form field. `name` is the key Web3Forms receives, so it is also
   the label of the line in the resulting email. */
export interface FormField {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  /* Half fields pair up on one row on desktop; full fields take the row. */
  span: 'half' | 'full';
  autocomplete?: string;
  placeholder?: string;
  /* Dropdown fields only; the chosen label is what the email carries. */
  options?: string[];
}

export interface NextStep {
  title: string;
  description: string;
}

/* Which detail from Site Settings a card shows and links to. */
export type ChannelKind = 'email' | 'phone' | 'office';

export interface ContactChannelContent {
  name: string;
  kind: ChannelKind;
  description: string;
  /* Card foot: "Write to us". */
  action: string;
}

/* A channel card ready to render: what Sanity stores, plus the value and the
   link derived from Site Settings. */
export interface ContactChannel extends ContactChannelContent {
  /* Its place in the row, rendered as "01". */
  index: number;
  value: string;
  href: string;
}

// -- the page ----------------------------------------------------------------

export interface ContactChannelsSection extends SectionBase, SectionIntro {
  _type: 'contactChannelsSection';
  items: ContactChannelContent[];
}

export interface InquirySection extends SectionBase, SectionIntro {
  _type: 'inquirySection';
  formFields: FormField[];
  /* Aside: what happens after the form is sent. */
  nextStepsLabel: string;
  nextSteps: NextStep[];
  /* Aside: routes into the site for a visitor still working out what to ask. */
  routesLabel: string;
  routes: NavItem[];
}

export interface OfficeSection extends SectionBase, SectionIntro {
  _type: 'officeSection';
  /* The map pin's name - the homepage HQ node. */
  name: string;
  /* Completes the address for the map and directions links. */
  country: string;
}

export type ContactSection =
  | PageHeroSection
  | ContactChannelsSection
  | InquirySection
  | OfficeSection
  | CtaSection;

export interface ContactPage extends PageMeta {
  sections: ContactSection[];
}

export function getContactPage(): Promise<ContactPage> {
  return once('contactPage', () =>
    fetchDocument<ContactPage>(
      'the Contact Us page',
      pageQuery('contactPage', [
        PAGE_HERO_SECTION,
        `_type == "contactChannelsSection" => {
        label, heading, intro, items[]{name, kind, description, action}
      }`,
        `_type == "inquirySection" => {
        label, heading, intro,
        formFields[]{
          name, label, kind, required, span, autocomplete, placeholder, options
        },
        nextStepsLabel,
        nextSteps[]{title, description},
        routesLabel,
        routes[]${NAV_ITEM}
      }`,
        '_type == "officeSection" => { label, heading, intro, name, country }',
        CTA_SECTION,
      ]),
    ),
  );
}

// -- derived from Site Settings ----------------------------------------------

/* Interface copy for the page chrome - buttons, form states, the map - kept in
   code so the components stay copy-free. */
export const contactLabels = {
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
  /* Shown when PUBLIC_WEB3FORMS_KEY is empty: the form renders, but says so
     instead of failing silently. */
  notConnected: {
    heading: 'Form not yet connected',
    body:
      'This inquiry form is not wired to a mailbox yet. In the meantime, ' +
      'reach us directly at',
  },
  getDirections: 'Get Directions',
};

/* A card's value and link come from the detail it names, never from a second
   copy of the address, the mailbox, or the number. */
export function contactChannels(
  items: ContactChannelContent[],
  settings: SiteSettings,
): ContactChannel[] {
  return items.map((item, i) => {
    const { email, phone } = settings.contact;
    const shown =
      item.kind === 'email'
        ? { value: email, href: mailHref(email) }
        : item.kind === 'phone'
          ? { value: phone, href: telHref(phone) }
          : { value: locality(settings), href: `#${OFFICE_ANCHOR}` };
    return { ...item, index: i + 1, ...shown };
  });
}

export function mapTitle(settings: SiteSettings): string {
  return `Map of the ${settings.brandAbbr} head office in ${locality(settings)}`;
}

/* Web3Forms (decision 2026-08-28): a static site posts straight to its API;
   the public access key is read from PUBLIC_WEB3FORMS_KEY by the page and
   handed to the form. Swapping the destination mailbox is one env change. */
export function inquiryForm(settings: SiteSettings) {
  return {
    endpoint: 'https://api.web3forms.com/submit',
    /* Base subject; the form appends the inquiry type and company. */
    subject: `${settings.brandAbbr} website inquiry`,
    fromName: `${settings.brandAbbr} Website`,
  };
}

/* The full postal address, for the map and directions queries. */
export function fullAddress(settings: SiteSettings, country: string): string {
  return `${settings.contact.address}, ${country}`;
}

/* Google Maps' keyless embed: it geocodes the address itself, so no
   coordinates are hardcoded that could drift from the printed address. */
export function mapEmbedUrl(settings: SiteSettings, country: string): string {
  const query = encodeURIComponent(fullAddress(settings, country));
  return `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
}

/* Opens the address in the visitor's Google Maps (Maps URLs API, keyless). */
export function directionsUrl(settings: SiteSettings, country: string): string {
  const query = encodeURIComponent(fullAddress(settings, country));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
