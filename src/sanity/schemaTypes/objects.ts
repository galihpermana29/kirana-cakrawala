// Shared object types: the small, repeated shapes the pages, sections, and
// collections are all built from. Each one mirrors an interface in
// src/content/*.ts - see docs/content-model.md for the field-by-field map.

import { defineArrayMember, defineField, defineType } from 'sanity';

/* NavItem in src/content/home.ts - every button and link on the site. */
export const navItem = defineType({
  name: 'navItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Destination',
      description:
        'A route on this site (/about), an anchor on this page (#mission), ' +
        'or a full URL.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});

/* SourcedImage in src/content/home.ts: the picture, its alt text, and where
   the file came from. Every image on the site is one of these. */
export const sourcedImage = defineType({
  name: 'sourcedImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      description:
        'What the picture shows, for screen readers and when the image ' +
        'fails to load. Describe the scene, not the brand.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source',
      description:
        'Where this picture came from and under what licence - also ' +
        'recorded in IMAGE-SOURCES.md. Free licences only.',
      type: 'string',
    }),
  ],
});

/* SectionIntro in src/content/what-we-do.ts: the "/ LABEL, heading, intro"
   head a section opens with. Used where one page owns the head copy of a
   section that another page renders (the pillar and article templates). */
export const sectionIntro = defineType({
  name: 'sectionIntro',
  title: 'Section head',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'The small "/ LABEL" eyebrow above the heading.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'label' } },
});

/* MissionPoint in src/content/what-we-do.ts - one of the seven mission
   points in docs/positioning.md, quoted verbatim. */
export const missionPoint = defineType({
  name: 'missionPoint',
  title: 'Mission point',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      description: 'Its 1-based number in the mission, 1 to 7.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(7),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      description:
        'The mission point verbatim. It is also printed in the mission ' +
        'list on the About page - change both together.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', number: 'number' },
    prepare: ({ title, number }) => ({
      title,
      subtitle: `Mission ${String(number ?? '').padStart(2, '0')}`,
    }),
  },
});

/* Mission in src/content/about.ts: a mission point plus where the site
   expands it. */
export const missionEntry = defineType({
  name: 'missionEntry',
  title: 'Mission point',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(7),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      description:
        'The mission point verbatim. Points 1 to 5 are also printed on the ' +
        'page that expands them - change both together.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Expanded by',
      description: 'The page that expands this point. Leave empty if none does.',
      type: 'navItem',
    }),
  ],
  preview: {
    select: { title: 'title', number: 'number' },
    prepare: ({ title, number }) => ({
      title,
      subtitle: `Mission ${String(number ?? '').padStart(2, '0')}`,
    }),
  },
});

/* Capability in src/content/what-we-do.ts - one card in a pillar's
   capability grid. */
export const capability = defineType({
  name: 'capability',
  title: 'Capability',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
});

/* ProcessStep in src/content/what-we-do.ts - one numbered step in a
   pillar's "How We Work" sequence. */
export const processStep = defineType({
  name: 'processStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
});

/* OverviewContent in src/content/what-we-do.ts: the mission point a page
   expands, the page's reading of it, and a short scope list. */
export const overview = defineType({
  name: 'overview',
  title: 'Overview',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission point',
      description: 'The mission point this page expands, quoted verbatim.',
      type: 'missionPoint',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'One entry per paragraph.',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'scopeLabel',
      title: 'Scope label',
      description: 'The head above the short list - "Scope of Supply".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'mission.title', subtitle: 'label' },
  },
});

/* Fact in src/content/about.ts - one "label: value" line in the About
   page's At a Glance card. */
export const fact = defineType({
  name: 'fact',
  title: 'Fact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});

/* Principle in src/content/about.ts - one of the six things mission 6 says
   KCA does not compromise on. */
export const principle = defineType({
  name: 'principle',
  title: 'Principle',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
});

/* NextStep in src/content/contact.ts - one step in the inquiry form's
   "What Happens Next" aside. */
export const nextStep = defineType({
  name: 'nextStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
});

/* FormField in src/content/contact.ts - one field of the inquiry form.
   `name` is the key Web3Forms receives, so it is also the label of the line
   in the resulting email. */
export const formField = defineType({
  name: 'formField',
  title: 'Form field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description:
        'The key Web3Forms receives - also the label of the line in the ' +
        'inquiry email. Lowercase, no spaces.',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^[a-z][a-z0-9_]*$/, {
          name: 'lowercase with underscores',
        }),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Dropdown', value: 'select' },
          { title: 'Long text', value: 'textarea' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'span',
      title: 'Width',
      description: 'Half fields pair up on one row on desktop; full fields take the row.',
      type: 'string',
      options: {
        list: [
          { title: 'Half row', value: 'half' },
          { title: 'Full row', value: 'full' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'autocomplete',
      title: 'Autocomplete',
      description: 'The browser autofill hint - name, organization, email, tel.',
      type: 'string',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'options',
      title: 'Dropdown options',
      description: 'Dropdown fields only. The chosen label is what the email carries.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      hidden: ({ parent }) => parent?.kind !== 'select',
    }),
  ],
  preview: {
    select: { title: 'label', kind: 'kind', required: 'required' },
    prepare: ({ title, kind, required }) => ({
      title,
      subtitle: `${kind ?? ''}${required ? '' : ' - optional'}`,
    }),
  },
});

/* ContactChannel in src/content/contact.ts - one way to reach KCA, as a
   card. The value and its link are read from Site Settings (email, phone,
   head office) so the card and the footer can never disagree. */
export const contactChannel = defineType({
  name: 'contactChannel',
  title: 'Channel',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      description:
        'Which detail from Site Settings this card shows and links to. ' +
        'Head office links to the map further down the page.',
      type: 'string',
      options: {
        list: [
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
          { title: 'Head office', value: 'office' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'action',
      title: 'Action',
      description: 'The card foot - "Write to us".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'description' } },
});

/* The `quote` block in src/content/news.ts: a mission point or the
   commitment line, quoted verbatim inside an article body. Paragraphs,
   headings, and lists are ordinary Portable Text blocks. */
export const articleQuote = defineType({
  name: 'articleQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cite',
      title: 'Source',
      description: 'Where it comes from - "Mission 06 - Quality, Safety & Governance".',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'cite' },
  },
});

export const objectTypes = [
  navItem,
  sourcedImage,
  sectionIntro,
  missionPoint,
  missionEntry,
  capability,
  processStep,
  overview,
  fact,
  principle,
  nextStep,
  formField,
  contactChannel,
  articleQuote,
];
