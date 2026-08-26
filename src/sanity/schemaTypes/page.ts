import { defineArrayMember, defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
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
      description: 'The homepage must use the slug "home".',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Add, remove, and drag to reorder the sections on this page.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'aboutSection' }),
        defineArrayMember({ type: 'servicesSection' }),
        defineArrayMember({ type: 'gallerySection' }),
        defineArrayMember({ type: 'contactSection' }),
      ],
    }),
  ],
});
