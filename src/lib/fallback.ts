import type { Page, SiteSettings } from './types';

// Placeholder content rendered until the Sanity project is connected and has
// a Site Settings document plus a page with the slug "home".

export const fallbackSettings: SiteSettings = {
  companyName: 'Kirana Cakrawala',
  tagline: 'Placeholder tagline - connect Sanity to edit this.',
  primaryColor: { hex: '#1d3557' },
  accentColor: { hex: '#e07a3f' },
  footerText: 'Kirana Cakrawala',
};

export const fallbackHomePage: Page = {
  title: 'Kirana Cakrawala',
  sections: [
    {
      _type: 'heroSection',
      _key: 'fallback-hero',
      heading: 'Kirana Cakrawala',
      subheading:
        'This is placeholder content. Set PUBLIC_SANITY_PROJECT_ID in .env, ' +
        'then run npm run seed and edit everything at /admin.',
      ctaLabel: 'Get in touch',
      ctaHref: '#contact',
    },
    {
      _type: 'aboutSection',
      _key: 'fallback-about',
      heading: 'About Us',
      body:
        'Tell your company story here. This section, like every other one on ' +
        'the page, is fully editable from the Sanity Studio dashboard - the ' +
        'text, the image beside it, and the order it appears in.',
    },
    {
      _type: 'servicesSection',
      _key: 'fallback-services',
      heading: 'What We Do',
      intro: 'A short introduction to your services.',
      items: [
        {
          _key: 'fallback-service-1',
          title: 'Service One',
          description: 'Describe your first service in a sentence or two.',
        },
        {
          _key: 'fallback-service-2',
          title: 'Service Two',
          description: 'Describe your second service in a sentence or two.',
        },
        {
          _key: 'fallback-service-3',
          title: 'Service Three',
          description: 'Describe your third service in a sentence or two.',
        },
      ],
    },
    {
      _type: 'contactSection',
      _key: 'fallback-contact',
      heading: 'Contact Us',
      intro: 'We would love to hear from you.',
      email: 'hello@example.com',
      phone: '+62 000 0000 0000',
      address: 'Jl. Placeholder No. 1, Jakarta',
    },
  ],
};
