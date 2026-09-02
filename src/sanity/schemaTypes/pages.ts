// The six pages, one document type each. Every one holds its sections in a
// single array: drag to reorder, switch one off with its Hidden toggle, and
// the page keeps the section's content either way.
//
// Each page is a singleton - there is one Home, one About Us, and so on - so
// they are pinned at the top of the Studio rather than listed as a collection.
// The pillar pages under /what-we-do and the article pages under /news are
// rendered from the Pillar and Article collections instead; the copy their
// templates share lives on the hub page that owns them.

import {
  defineArrayMember,
  defineField,
  defineType,
  type FieldDefinition,
} from 'sanity';

interface PageConfig {
  name: string;
  title: string;
  /* The section types this page may hold, in the order it holds them by
     default. */
  sections: string[];
  extraFields?: FieldDefinition[];
}

function pageType({ name, title, sections, extraFields = [] }: PageConfig) {
  return defineType({
    name,
    title,
    type: 'document',
    groups: [
      { name: 'content', title: 'Content', default: true },
      { name: 'meta', title: 'Page & SEO' },
    ],
    fields: [
      defineField({
        name: 'sections',
        title: 'Sections',
        description:
          'The bands this page is built from, top to bottom. Drag to reorder; ' +
          'open a section and switch on Hidden to take it off the site ' +
          'without losing it.',
        type: 'array',
        of: sections.map((section) => defineArrayMember({ type: section })),
        group: 'content',
        validation: (rule) => rule.required().min(1),
      }),
      ...extraFields,
      defineField({
        name: 'title',
        title: 'Page name',
        description:
          'How the site names this page - the eyebrow above its hero and its ' +
          'entry in the Studio.',
        type: 'string',
        group: 'meta',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'metaTitle',
        title: 'Browser title',
        description: 'The tab title and the search result headline.',
        type: 'string',
        group: 'meta',
        validation: (rule) => rule.required().max(70),
      }),
      defineField({
        name: 'metaDescription',
        title: 'Search description',
        description: 'The paragraph under the headline in a search result.',
        type: 'text',
        rows: 3,
        group: 'meta',
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {
      select: { pageName: 'title' },
      prepare: ({ pageName }) => ({
        title,
        subtitle: typeof pageName === 'string' && pageName !== title ? pageName : undefined,
      }),
    },
  });
}

export const homePage = pageType({
  name: 'homePage',
  title: 'Home',
  sections: [
    'homeHeroSection',
    'whoWeAreSection',
    'pillarGridSection',
    'ecosystemSection',
    'commitmentSection',
    'newsTeaserSection',
  ],
});

export const aboutPage = pageType({
  name: 'aboutPage',
  title: 'About Us',
  sections: [
    'pageHeroSection',
    'aboutIntroSection',
    'aboutVisionSection',
    'aboutMissionSection',
    'aboutGovernanceSection',
    'pillarGridSection',
    'ctaSection',
  ],
});

export const whatWeDoPage = pageType({
  name: 'whatWeDoPage',
  title: 'What We Do',
  sections: ['pageHeroSection', 'pillarGridSection', 'ctaSection'],
  extraFields: [
    defineField({
      name: 'otherPillarsHead',
      title: 'Pillar pages: "the other pillars" head',
      description:
        'The head of the cross-link section at the foot of every pillar page. ' +
        'One place, so the four pillar pages cannot drift apart.',
      type: 'sectionIntro',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const newsPage = pageType({
  name: 'newsPage',
  title: 'News & Articles',
  sections: ['pageHeroSection', 'articleFeedSection', 'ctaSection'],
  extraFields: [
    defineField({
      name: 'continueReadingHead',
      title: 'Article pages: "continue reading" head',
      description:
        'The head of the cross-link section at the foot of every article. ' +
        'One place, so the articles cannot drift apart.',
      type: 'sectionIntro',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const partnersPage = pageType({
  name: 'partnersPage',
  title: 'Partners',
  sections: [
    'pageHeroSection',
    'overviewSection',
    'partnerCategoriesSection',
    'networkSection',
    'pillarGridSection',
    'ctaSection',
  ],
});

export const contactPage = pageType({
  name: 'contactPage',
  title: 'Contact Us',
  sections: [
    'pageHeroSection',
    'contactChannelsSection',
    'inquirySection',
    'officeSection',
    'ctaSection',
  ],
});

/* Every page is a singleton, and its document id is its type name. The Studio
   pins these; nothing else may create or delete them. */
export const pageTypes = [
  homePage,
  aboutPage,
  whatWeDoPage,
  newsPage,
  partnersPage,
  contactPage,
];

export const pageTypeNames = pageTypes.map((page) => page.name);
