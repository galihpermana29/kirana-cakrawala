// The page sections: every band a page is built from, as a typed block.
// A page document holds them in one array, so they can be dragged into a new
// order and switched off without being deleted.
//
// Each section mirrors a slice of src/content/*.ts - see docs/content-model.md
// for the field-by-field map. Section objects carry rendered content only;
// interface micro-copy (button chrome like "min read" or "Copy link") stays
// in the components.

import {
  defineArrayMember,
  defineField,
  defineType,
  type FieldDefinition,
} from 'sanity';
import { overview } from './objects';

/* Every section can be switched off without losing its content. */
function hiddenField(): FieldDefinition {
  return defineField({
    name: 'hidden',
    title: 'Hidden',
    description:
      'Hide this section on the published site. It stays here, editable, and ' +
      'can be switched back on at any time.',
    type: 'boolean',
    initialValue: false,
  });
}

interface SectionConfig {
  name: string;
  title: string;
  /* The field whose value names this section in the page's section list. */
  subtitleField?: string;
  fields: FieldDefinition[];
}

function sectionType({ name, title, subtitleField = 'heading', fields }: SectionConfig) {
  return defineType({
    name,
    title,
    type: 'object',
    fields: [...fields, hiddenField()],
    preview: {
      select: { subtitle: subtitleField, hidden: 'hidden' },
      prepare: ({ subtitle, hidden }) => ({
        title: hidden ? `${title} - hidden` : title,
        subtitle: typeof subtitle === 'string' ? subtitle : undefined,
      }),
    },
  });
}

/* The "/ LABEL, heading, intro" head most sections open with. */
function introFields(): FieldDefinition[] {
  return [
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
  ];
}

function linkField(name: string, title: string, description?: string): FieldDefinition {
  return defineField({
    name,
    title,
    description,
    type: 'navItem',
    validation: (rule) => rule.required(),
  });
}

function refListField(
  name: string,
  title: string,
  to: string,
  description: string,
): FieldDefinition {
  return defineField({
    name,
    title,
    description,
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: to }] })],
    validation: (rule) => rule.required().min(1),
  });
}

// -- Homepage sections -------------------------------------------------------

export const homeHeroSection = sectionType({
  name: 'homeHeroSection',
  title: 'Hero',
  subtitleField: 'eyebrow',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'The small data line above the headline.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headlineLines',
      title: 'Headline',
      description: 'One entry per line - each is revealed in sequence.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'subline',
      title: 'Subline',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    linkField('ctaPrimary', 'Primary button'),
    linkField('ctaSecondary', 'Secondary button'),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Fills the diagonal ribbon - the hero focal object.',
      type: 'sourcedImage',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const whoWeAreSection = sectionType({
  name: 'whoWeAreSection',
  title: 'Who We Are',
  subtitleField: 'label',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statement',
      title: 'Statement',
      description: 'Lit word by word as the visitor scrolls.',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    linkField('link', 'Link'),
  ],
});

export const pillarGridSection = sectionType({
  name: 'pillarGridSection',
  title: 'Pillars',
  fields: [
    ...introFields(),
    refListField(
      'pillars',
      'Pillars',
      'pillar',
      'Which pillars this section shows, in the order it shows them.',
    ),
  ],
});

export const ecosystemSection = sectionType({
  name: 'ecosystemSection',
  title: 'Ecosystem',
  fields: [
    ...introFields(),
    refListField(
      'categories',
      'Partner categories',
      'partnerCategory',
      'Cycled in the marquee, each linking into its tab on the Partners page.',
    ),
    refListField(
      'regions',
      'Network regions',
      'mapPin',
      'The neutral nodes plotted on the dotted map.',
    ),
    defineField({
      name: 'hq',
      title: 'Head office pin',
      description: 'The anchor pin - the only location the site names.',
      type: 'reference',
      to: [{ type: 'mapPin' }],
      validation: (rule) => rule.required(),
    }),
    linkField('link', 'Link'),
  ],
});

export const commitmentSection = sectionType({
  name: 'commitmentSection',
  title: 'Commitment',
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
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    linkField('cta', 'Button'),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Sits under a heavy navy overlay behind the copy.',
      type: 'sourcedImage',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const newsTeaserSection = sectionType({
  name: 'newsTeaserSection',
  title: 'News teaser',
  fields: [
    ...introFields(),
    defineField({
      name: 'count',
      title: 'Articles shown',
      description: 'How many of the newest articles the teaser shows.',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.required().integer().min(1).max(6),
    }),
    linkField('showAll', 'Show all button'),
  ],
});

// -- Shared inner-page sections ---------------------------------------------

export const pageHeroSection = sectionType({
  name: 'pageHeroSection',
  title: 'Hero',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'standfirst',
      title: 'Standfirst',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'sourcedImage',
      validation: (rule) => rule.required(),
    }),
    linkField('primary', 'Primary button'),
    linkField('secondary', 'Secondary button'),
  ],
});

export const overviewSection = sectionType({
  name: 'overviewSection',
  title: 'Overview',
  subtitleField: 'mission.title',
  fields: [...overview.fields],
});

export const ctaSection = sectionType({
  name: 'ctaSection',
  title: 'Closing band',
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
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    linkField('primary', 'Primary button'),
    linkField('secondary', 'Secondary button'),
  ],
});

// -- News --------------------------------------------------------------------

export const articleFeedSection = sectionType({
  name: 'articleFeedSection',
  title: 'Article feed',
  fields: [...introFields()],
});

// -- Partners ----------------------------------------------------------------

export const partnerCategoriesSection = sectionType({
  name: 'partnerCategoriesSection',
  title: 'Partner categories',
  fields: [
    ...introFields(),
    refListField(
      'categories',
      'Categories',
      'partnerCategory',
      'The tabbed category index, in the order the tabs appear.',
    ),
  ],
});

export const networkSection = sectionType({
  name: 'networkSection',
  title: 'Global network',
  fields: [
    ...introFields(),
    refListField(
      'regions',
      'Network regions',
      'mapPin',
      'The neutral nodes plotted on the dotted map.',
    ),
    defineField({
      name: 'hq',
      title: 'Head office pin',
      type: 'reference',
      to: [{ type: 'mapPin' }],
      validation: (rule) => rule.required(),
    }),
  ],
});

// -- Contact -----------------------------------------------------------------

export const contactChannelsSection = sectionType({
  name: 'contactChannelsSection',
  title: 'Contact channels',
  fields: [
    ...introFields(),
    defineField({
      name: 'items',
      title: 'Channels',
      type: 'array',
      of: [defineArrayMember({ type: 'contactChannel' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

export const inquirySection = sectionType({
  name: 'inquirySection',
  title: 'Inquiry form',
  fields: [
    ...introFields(),
    defineField({
      name: 'formFields',
      title: 'Form fields',
      description: 'The fields the inquiry form asks for, in order.',
      type: 'array',
      of: [defineArrayMember({ type: 'formField' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'nextStepsLabel',
      title: 'What happens next - label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nextSteps',
      title: 'What happens next',
      type: 'array',
      of: [defineArrayMember({ type: 'nextStep' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'routesLabel',
      title: 'Still exploring - label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routes',
      title: 'Still exploring',
      description: 'Routes into the site for a visitor still working out what to ask.',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

export const officeSection = sectionType({
  name: 'officeSection',
  title: 'Head office',
  fields: [
    ...introFields(),
    defineField({
      name: 'name',
      title: 'Map pin name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      description: 'Completes the address for the map and directions links.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

// -- About -------------------------------------------------------------------

export const aboutIntroSection = sectionType({
  name: 'aboutIntroSection',
  title: 'Who We Are',
  subtitleField: 'label',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statement',
      title: 'Statement',
      description:
        'The core positioning, verbatim - one entry per line, lit as the ' +
        'visitor scrolls.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
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
      name: 'glanceLabel',
      title: 'At a Glance - label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'glance',
      title: 'At a Glance',
      type: 'array',
      of: [defineArrayMember({ type: 'fact' })],
      validation: (rule) => rule.required().min(1),
    }),
    linkField('glanceLink', 'At a Glance - link'),
  ],
});

export const aboutVisionSection = sectionType({
  name: 'aboutVisionSection',
  title: 'Vision',
  subtitleField: 'label',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statement',
      title: 'Vision statement',
      description: 'The vision, verbatim - lit word by word as the visitor scrolls.',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outcomesLabel',
      title: 'Outcomes - label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      description: 'The outcomes the statement names, listed under it.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Sits under a heavy navy overlay behind the statement.',
      type: 'sourcedImage',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const aboutMissionSection = sectionType({
  name: 'aboutMissionSection',
  title: 'Mission',
  fields: [
    ...introFields(),
    defineField({
      name: 'items',
      title: 'Mission points',
      description: 'All seven, in order.',
      type: 'array',
      of: [defineArrayMember({ type: 'missionEntry' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

export const aboutGovernanceSection = sectionType({
  name: 'aboutGovernanceSection',
  title: 'Governance',
  fields: [
    ...introFields(),
    defineField({
      name: 'missionLabel',
      title: 'Mission tag',
      description: 'The head tag - "Mission 06 / Quality, Safety & Governance".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission point',
      type: 'missionPoint',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'principles',
      title: 'Principles',
      description: 'The things this mission point says KCA does not compromise on.',
      type: 'array',
      of: [defineArrayMember({ type: 'principle' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'readingLabel',
      title: 'Further reading - label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingArticle',
      title: 'Further reading - article',
      description: 'Its title and link are read from the article itself.',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingLinkLabel',
      title: 'Further reading - button',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const sectionTypes = [
  homeHeroSection,
  whoWeAreSection,
  pillarGridSection,
  ecosystemSection,
  commitmentSection,
  newsTeaserSection,
  pageHeroSection,
  overviewSection,
  ctaSection,
  articleFeedSection,
  partnerCategoriesSection,
  networkSection,
  contactChannelsSection,
  inquirySection,
  officeSection,
  aboutIntroSection,
  aboutVisionSection,
  aboutMissionSection,
  aboutGovernanceSection,
];
