// Site Settings and the repeatable collections: pillars, articles, partner
// categories, and map pins. Every one of them mirrors a slice of
// src/content/*.ts - see docs/content-model.md for the field-by-field map.

import { defineArrayMember, defineField, defineType } from 'sanity';

/* The brand, the nav, and the contact details every page reads: one document,
   so the header, the footer, and the Contact page can never disagree. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brandAbbr',
      title: 'Abbreviation',
      description: 'The short mark in the header and above every inner-page hero.',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description:
        'Shown in the header instead of the abbreviation chip. Leave empty ' +
        'to keep the text mark. A wide image with a transparent background ' +
        'works best (SVG or PNG).',
      type: 'sourcedImage',
      group: 'brand',
    }),

    defineField({
      name: 'ctaImage',
      title: 'Closing band image',
      description:
        'The picture behind the closing band at the foot of every inner ' +
        'page, under a heavy navy overlay.',
      type: 'sourcedImage',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nav',
      title: 'Main navigation',
      description:
        'The header and mobile menu, in order. Every destination should be a ' +
        'real route on this site.',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
      group: 'navigation',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'contact',
      title: 'Contact details',
      description:
        'Printed in the footer and on the Contact page - the head office ' +
        'card, the phone and email cards, and the map all read from here.',
      type: 'object',
      group: 'contact',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'address',
          title: 'Address',
          description:
            'Street, district, city - comma separated. The Contact page ' +
            'splits it on the commas for the office card and the map.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (rule) => rule.required().email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          description: 'As it should be printed; the tel: link strips it down.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'companyName' },
    prepare: ({ subtitle }) => ({ title: 'Site Settings', subtitle }),
  },
});

/* One of the four capabilities KCA delivers: its homepage panel, its page
   under /what-we-do, and the mission point it expands. */
export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'document',
  groups: [
    { name: 'summary', title: 'Summary', default: true },
    { name: 'page', title: 'Page' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'summary',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pillarId',
      title: 'Key',
      description:
        'The stable key the rest of the site refers to this pillar by. ' +
        'Changing it breaks those links - rename the pillar instead.',
      type: 'string',
      group: 'summary',
      options: {
        list: [
          { title: 'Parts & Components', value: 'parts' },
          { title: 'Component MRO', value: 'mro' },
          { title: 'Technical Services', value: 'technical' },
          { title: 'Global Supply Network', value: 'network' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The last part of the address: /what-we-do/<slug>.',
      type: 'slug',
      group: 'summary',
      options: { source: 'name', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description:
        'The pillar sequence - it sets the "01 of 04" counter and which ' +
        'pillar comes next at the foot of each pillar page.',
      type: 'number',
      group: 'summary',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Summary',
      description: 'The pillar in one paragraph, as the homepage panel shows it.',
      type: 'text',
      rows: 4,
      group: 'summary',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'sourcedImage',
      group: 'summary',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'standfirst',
      title: 'Standfirst',
      description: 'The hero subline on the pillar page - its promise in one sentence.',
      type: 'text',
      rows: 4,
      group: 'page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'overview',
      group: 'page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'object',
      group: 'page',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
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
        defineField({
          name: 'items',
          title: 'Capabilities',
          type: 'array',
          of: [defineArrayMember({ type: 'capability' })],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'process',
      title: 'How we work',
      type: 'object',
      group: 'page',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
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
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [defineArrayMember({ type: 'processStep' })],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Closing band',
      description:
        'Closes this pillar page, and every article that expands this pillar.',
      type: 'object',
      group: 'page',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  orderings: [
    {
      name: 'order',
      title: 'Pillar order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', order: 'order', slug: 'slug.current', media: 'image' },
    prepare: ({ title, order, slug, media }) => ({
      title,
      subtitle: `${String(order ?? '').padStart(2, '0')} - /what-we-do/${slug ?? ''}`,
      media,
    }),
  },
});

/* One News & Articles entry. Body blocks are Portable Text: paragraphs,
   headings, and bullet lists, with pull quotes as their own block. */
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The last part of the address: /news/<slug>.',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Published',
      description: 'The archive is ordered by this date, newest first.',
      type: 'date',
      options: { dateFormat: 'D MMMM YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Capability', value: 'capability' },
          { title: 'Insight', value: 'insight' },
          { title: 'Company', value: 'company' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'The card copy and the article standfirst.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'sourcedImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Related pillar',
      description:
        'The pillar this article expands. Its page becomes the related ' +
        'capability link, and its closing band closes the article. Company ' +
        'news has none.',
      type: 'reference',
      to: [{ type: 'pillar' }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraph', value: 'normal' },
            { title: 'Heading', value: 'h2' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Destination',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({ type: 'articleQuote' }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      name: 'newest',
      title: 'Newest first',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date', category: 'category', media: 'image' },
    prepare: ({ title, date, category, media }) => ({
      title,
      subtitle: [date, category].filter(Boolean).join(' - '),
      media,
    }),
  },
});

/* One of the partner categories in KCA's ecosystem: a tab on the Partners
   page and an entry in the homepage marquee. */
export const partnerCategory = defineType({
  name: 'partnerCategory',
  title: 'Partner category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoryId',
      title: 'Key',
      description:
        'The stable key this category is deep-linked by: /partners#<key>. ' +
        'Lowercase, dashes for spaces.',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^[a-z][a-z0-9-]*$/, { name: 'lowercase with dashes' }),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'The tab and marquee sequence - it also sets the "01" counter.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      description: 'Their place in the aftermarket, in one line.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lead',
      title: 'Lead',
      description: 'What the integrated ecosystem means for them, in one sentence.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'offers',
      title: 'What KCA brings',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'pillars',
      title: 'Connected through',
      description: 'The pillars this partnership runs through, most relevant first.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'pillar' }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      name: 'order',
      title: 'Category order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', order: 'order', subtitle: 'role' },
    prepare: ({ title, order, subtitle }) => ({
      title: `${String(order ?? '').padStart(2, '0')} ${title ?? ''}`.trim(),
      subtitle,
    }),
  },
});

/* One node on the dotted world map: a network region, or the head office
   the arcs radiate from. */
export const mapPin = defineType({
  name: 'mapPin',
  title: 'Map pin',
  type: 'document',
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
      type: 'string',
      options: {
        list: [
          { title: 'Network region', value: 'region' },
          { title: 'Head office', value: 'hq' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'region',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'xPct',
      title: 'Across (%)',
      description: '0 at the left edge of the map, 100 at the right.',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'yPct',
      title: 'Down (%)',
      description: '0 at the top edge of the map, 100 at the bottom.',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  orderings: [
    { name: 'order', title: 'Pin order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', kind: 'kind', xPct: 'xPct', yPct: 'yPct' },
    prepare: ({ title, kind, xPct, yPct }) => ({
      title,
      subtitle: `${kind === 'hq' ? 'Head office' : 'Region'} - ${xPct}%, ${yPct}%`,
    }),
  },
});

export const documentTypes = [siteSettings, pillar, article, partnerCategory, mapPin];
