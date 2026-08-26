// Seeds the Sanity dataset with initial Site Settings and a homepage so the
// dashboard has real documents to edit. Safe to re-run: existing documents
// are never overwritten.
//
// Usage: npm run seed  (requires PUBLIC_SANITY_PROJECT_ID and
// SANITY_WRITE_TOKEN in .env)

import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env - see .env.example.',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-06-01',
  token,
  useCdn: false,
});

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  companyName: 'Kirana Cakrawala',
  tagline: 'Reaching every horizon together.',
  primaryColor: { _type: 'color', hex: '#1d3557', alpha: 1 },
  accentColor: { _type: 'color', hex: '#e07a3f', alpha: 1 },
  footerText: 'Kirana Cakrawala. All rights reserved.',
};

const homePage = {
  _id: 'page-home',
  _type: 'page',
  title: 'Kirana Cakrawala',
  slug: { _type: 'slug', current: 'home' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero',
      heading: 'Reaching every horizon together',
      subheading:
        'Kirana Cakrawala partners with businesses across Indonesia to turn ' +
        'ambition into results.',
      ctaLabel: 'Get in touch',
      ctaHref: '#contact',
    },
    {
      _type: 'aboutSection',
      _key: 'about',
      heading: 'About Us',
      body:
        'Founded with a simple belief - that great work comes from great ' +
        'partnerships - Kirana Cakrawala has grown into a trusted name for ' +
        'clients who value quality and clarity.\n\nEdit this story, add an ' +
        'image, and reorder any section from the dashboard at /admin.',
    },
    {
      _type: 'servicesSection',
      _key: 'services',
      heading: 'What We Do',
      intro: 'Three ways we help our clients move forward.',
      items: [
        {
          _type: 'serviceItem',
          _key: 'service-1',
          title: 'Consulting',
          description:
            'Practical advice grounded in experience, not theory.',
        },
        {
          _type: 'serviceItem',
          _key: 'service-2',
          title: 'Development',
          description:
            'From first sketch to launch, built to last.',
        },
        {
          _type: 'serviceItem',
          _key: 'service-3',
          title: 'Support',
          description:
            'A partner who stays after the project ships.',
        },
      ],
    },
    {
      _type: 'gallerySection',
      _key: 'gallery',
      heading: 'Our Work',
      images: [],
    },
    {
      _type: 'contactSection',
      _key: 'contact',
      heading: 'Contact Us',
      intro: 'Tell us about your project and we will get back to you.',
      email: 'hello@kiranacakrawala.com',
      phone: '+62 812 0000 0000',
      address: 'Jakarta, Indonesia',
    },
  ],
};

const transaction = client.transaction();
transaction.createIfNotExists(siteSettings);
transaction.createIfNotExists(homePage);

const result = await transaction.commit();
console.log(`Seeded ${result.results.length} document(s) into "${dataset}".`);
console.log('Open /admin to start editing.');
