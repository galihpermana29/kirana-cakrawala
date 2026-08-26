import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      description: 'Used for headings, buttons, and links.',
      type: 'color',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      description: 'Used for highlights and hover states.',
      type: 'color',
      options: { disableAlpha: true },
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
