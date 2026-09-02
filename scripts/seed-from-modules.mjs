#!/usr/bin/env node
// Migrates the site's content out of src/content/*.ts and into Sanity, so the
// Studio at /admin becomes the dashboard the site is edited from.
//
// It reads the six content modules, uploads every picture they reference to
// the dataset, and writes one document per page, pillar, article, partner
// category, and map pin - each under a stable id, so re-running it is safe.
//
// Usage:
//   npm run seed              create anything missing, leave existing edits alone
//   npm run seed -- --replace overwrite every document with the module content
//   npm run seed -- --dry-run build and report the documents, write nothing
//
// Requires PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, and a
// SANITY_WRITE_TOKEN with Editor permissions - see .env.example.

import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModules } from './load-content.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = new Set(process.argv.slice(2));
const REPLACE = args.has('--replace');
const DRY_RUN = args.has('--dry-run');
for (const arg of args) {
  if (!['--replace', '--dry-run'].includes(arg)) {
    fail(`Unknown option "${arg}". Use --replace or --dry-run.`);
  }
}

// -- document ids -------------------------------------------------------------
// Stable, readable, and derived from the content, so a second run addresses the
// same documents rather than making new ones.

const ID = {
  settings: 'siteSettings',
  pillar: (pillarId) => `pillar-${pillarId}`,
  article: (slug) => `article-${slug}`,
  category: (categoryId) => `partnerCategory-${categoryId}`,
  pin: (name) => `mapPin-${slugify(name)}`,
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// -- value helpers ------------------------------------------------------------

/* Marks a picture that still has to be uploaded; resolveImages swaps it for
   the asset reference once the file is in the dataset. */
const PENDING_IMAGE = '__imageSrc';

function image(sourced) {
  return {
    _type: 'sourcedImage',
    [PENDING_IMAGE]: sourced.src,
    alt: sourced.alt,
    sourceUrl: sourced.sourceUrl,
  };
}

function link(item) {
  return { _type: 'navItem', label: item.label, href: item.href };
}

function reference(id) {
  return { _type: 'reference', _ref: id };
}

/* Array members need a key of their own; the target id is unique and stable. */
function referenceList(ids) {
  return ids.map((id) => ({ _type: 'reference', _ref: id, _key: id }));
}

function keyed(items, prefix, toValue) {
  return items.map((item, index) => ({ _key: `${prefix}-${index + 1}`, ...toValue(item, index) }));
}

function section(type, key, fields) {
  return { _type: type, _key: key, hidden: false, ...fields };
}

function head(intro) {
  return { label: intro.label, heading: intro.heading, intro: intro.intro };
}

function sectionIntro(intro) {
  return { _type: 'sectionIntro', ...head(intro) };
}

function missionPoint(point) {
  return {
    _type: 'missionPoint',
    number: point.number,
    title: point.title,
    text: point.text,
  };
}

function overview(content) {
  return {
    label: content.label,
    mission: missionPoint(content.mission),
    body: [...content.body],
    scopeLabel: content.scopeLabel,
    scope: [...content.scope],
  };
}

/* An article body becomes Portable Text: paragraphs and headings are blocks,
   list items are bulleted blocks, and a pull quote is its own block type. */
function portableText(blocks) {
  const out = [];
  blocks.forEach((block, index) => {
    if (block.type === 'quote') {
      out.push({
        _type: 'articleQuote',
        _key: `q${index}`,
        text: block.text,
        ...(block.cite ? { cite: block.cite } : {}),
      });
      return;
    }
    if (block.type === 'list') {
      block.items.forEach((item, itemIndex) => {
        out.push(textBlock(`${index}-${itemIndex}`, 'normal', item, 'bullet'));
      });
      return;
    }
    out.push(textBlock(`${index}`, block.type === 'heading' ? 'h2' : 'normal', block.text));
  });
  return out;
}

function textBlock(key, style, text, listItem) {
  return {
    _type: 'block',
    _key: `b${key}`,
    style,
    markDefs: [],
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _type: 'span', _key: `s${key}`, text, marks: [] }],
  };
}

/* Which detail from Site Settings a contact card shows, read off the link the
   module built for it. */
function channelKind(href) {
  if (href.startsWith('mailto:')) return 'email';
  if (href.startsWith('tel:')) return 'phone';
  return 'office';
}

// -- the documents ------------------------------------------------------------

function buildDocuments(modules) {
  const { home: homeModule, whatWeDo, news, partners, contact, about } = modules;
  const home = homeModule.home;
  const { whatWeDoIndex, whatWeDoLabels, contactLink, aboutLink, WHAT_WE_DO_PATH } = whatWeDo;
  const { newsIndex, newsLabels, NEWS_PATH } = news;
  const { partnersPage, partnersLabels, ECOSYSTEM_ANCHOR } = partners;
  const { contactPage, contactLabels, INQUIRY_ANCHOR, OFFICE_ANCHOR } = contact;
  const { aboutPage, aboutLabels, MISSION_ANCHOR } = about;

  const pillarIds = whatWeDo.pillarPages.map((pillar) => ID.pillar(pillar.id));
  const categoryIds = partners.partnerCategories.map((category) => ID.category(category.id));
  const regionIds = home.ecosystem.network.map((node) => ID.pin(node.name));
  const hqId = ID.pin(home.ecosystem.hq.name);

  // -- collections ------------------------------------------------------------

  const pillars = whatWeDo.pillarPages.map((pillar) => ({
    _id: ID.pillar(pillar.id),
    _type: 'pillar',
    name: pillar.name,
    pillarId: pillar.id,
    slug: { _type: 'slug', current: pillar.slug },
    order: pillar.index,
    description: pillar.description,
    image: image(pillar.image),
    standfirst: pillar.standfirst,
    overview: overview(pillar.overview),
    capabilities: {
      ...head(pillar.capabilities),
      items: keyed(pillar.capabilities.items, 'capability', (item) => ({
        _type: 'capability',
        title: item.title,
        description: item.description,
      })),
    },
    process: {
      ...head(pillar.process),
      steps: keyed(pillar.process.steps, 'step', (step) => ({
        _type: 'processStep',
        title: step.title,
        description: step.description,
      })),
    },
    cta: { heading: pillar.cta.heading, body: pillar.cta.body },
  }));

  const articles = news.articles.map((article) => ({
    _id: ID.article(article.slug),
    _type: 'article',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    date: article.date,
    category: article.category,
    excerpt: article.excerpt,
    image: image(article.image),
    ...(article.pillar ? { pillar: reference(ID.pillar(article.pillar)) } : {}),
    body: portableText(article.body),
  }));

  const partnerCategories = partners.partnerCategories.map((category) => ({
    _id: ID.category(category.id),
    _type: 'partnerCategory',
    name: category.name,
    categoryId: category.id,
    order: category.index,
    role: category.role,
    lead: category.lead,
    body: category.body,
    offers: [...category.offers],
    pillars: referenceList(category.pillars.map((id) => ID.pillar(id))),
  }));

  const mapPins = [
    ...home.ecosystem.network.map((node, index) => ({
      _id: ID.pin(node.name),
      _type: 'mapPin',
      name: node.name,
      kind: 'region',
      xPct: node.xPct,
      yPct: node.yPct,
      order: index + 1,
    })),
    {
      _id: hqId,
      _type: 'mapPin',
      name: home.ecosystem.hq.name,
      kind: 'hq',
      xPct: home.ecosystem.hq.xPct,
      yPct: home.ecosystem.hq.yPct,
      order: home.ecosystem.network.length + 1,
    },
  ];

  // -- site settings ----------------------------------------------------------

  const siteSettings = {
    _id: ID.settings,
    _type: 'siteSettings',
    companyName: home.companyName,
    brandAbbr: home.brandAbbr,
    tagline: home.tagline,
    ctaImage: image(whatWeDo.ctaImage),
    nav: keyed(home.nav, 'nav', (item) => link(item)),
    contact: {
      address: home.contact.address,
      email: home.contact.email,
      phone: home.contact.phone,
    },
  };

  // -- pages ------------------------------------------------------------------

  const firstPillar = whatWeDo.pillarPages[0];
  const latestArticle = news.articles[0];

  const homePage = {
    _id: 'homePage',
    _type: 'homePage',
    title: 'Home',
    metaTitle: `${home.companyName} - ${home.tagline}`,
    metaDescription: home.tagline,
    sections: [
      section('homeHeroSection', 'hero', {
        eyebrow: home.hero.eyebrow,
        headlineLines: [...home.hero.headlineLines],
        subline: home.hero.subline,
        ctaPrimary: link(home.hero.ctaPrimary),
        ctaSecondary: link(home.hero.ctaSecondary),
        image: image(home.hero.image),
      }),
      section('whoWeAreSection', 'who-we-are', {
        label: home.whoWeAre.label,
        statement: home.whoWeAre.statement,
        body: home.whoWeAre.body,
        link: link(home.whoWeAre.link),
      }),
      section('pillarGridSection', 'pillars', {
        ...head(home.whatWeDo),
        pillars: referenceList(pillarIds),
      }),
      section('ecosystemSection', 'ecosystem', {
        ...head(home.ecosystem),
        categories: referenceList(categoryIds),
        regions: referenceList(regionIds),
        hq: reference(hqId),
        link: link(home.ecosystem.link),
      }),
      section('commitmentSection', 'commitment', {
        label: home.commitment.label,
        heading: home.commitment.heading,
        body: home.commitment.body,
        cta: link(home.commitment.cta),
        image: image(home.commitment.image),
      }),
      section('newsTeaserSection', 'news', {
        ...head(home.news),
        count: 3,
        showAll: link(home.news.showAll),
      }),
    ],
  };

  const whatWeDoPage = {
    _id: 'whatWeDoPage',
    _type: 'whatWeDoPage',
    title: whatWeDoIndex.title,
    metaTitle: `${whatWeDoIndex.title} - ${home.companyName}`,
    metaDescription: whatWeDoIndex.standfirst,
    otherPillarsHead: sectionIntro(whatWeDo.otherPillarsGrid),
    sections: [
      section('pageHeroSection', 'hero', {
        heading: whatWeDoIndex.heading,
        standfirst: whatWeDoIndex.standfirst,
        image: image(whatWeDoIndex.image),
        primary: link({
          label: `${whatWeDoLabels.startWith} ${firstPillar.name}`,
          href: firstPillar.href,
        }),
        secondary: link(contactLink),
      }),
      section('pillarGridSection', 'pillars', {
        ...head(whatWeDoIndex.grid),
        pillars: referenceList(pillarIds),
      }),
      section('ctaSection', 'cta', {
        label: whatWeDoIndex.cta.label,
        heading: whatWeDoIndex.cta.heading,
        body: whatWeDoIndex.cta.body,
        primary: link(contactLink),
        secondary: link(aboutLink),
      }),
    ],
  };

  const newsPage = {
    _id: 'newsPage',
    _type: 'newsPage',
    title: newsIndex.title,
    metaTitle: `${newsIndex.title} - ${home.companyName}`,
    metaDescription: newsIndex.standfirst,
    continueReadingHead: sectionIntro(news.continueReading),
    sections: [
      section('pageHeroSection', 'hero', {
        heading: newsIndex.heading,
        standfirst: newsIndex.standfirst,
        image: image(newsIndex.image),
        primary: link({ label: newsLabels.readLatest, href: latestArticle.href }),
        secondary: link(contactLink),
      }),
      section('articleFeedSection', 'feed', head(newsIndex.feed)),
      section('ctaSection', 'cta', {
        label: newsIndex.cta.label,
        heading: newsIndex.cta.heading,
        body: newsIndex.cta.body,
        primary: link(contactLink),
        secondary: link({ label: home.whatWeDo.label, href: WHAT_WE_DO_PATH }),
      }),
    ],
  };

  const partnersPageDoc = {
    _id: 'partnersPage',
    _type: 'partnersPage',
    title: partnersPage.title,
    metaTitle: `${partnersPage.title} - ${home.companyName}`,
    metaDescription: partnersPage.standfirst,
    sections: [
      section('pageHeroSection', 'hero', {
        heading: partnersPage.heading,
        standfirst: partnersPage.standfirst,
        image: image(partnersPage.image),
        primary: link({ label: partnersLabels.partnerWithUs, href: contactLink.href }),
        secondary: link({
          label: partnersLabels.meetEcosystem,
          href: `#${ECOSYSTEM_ANCHOR}`,
        }),
      }),
      section('overviewSection', 'overview', overview(partnersPage.overview)),
      section('partnerCategoriesSection', 'categories', {
        ...head(partnersPage.categories),
        categories: referenceList(categoryIds),
      }),
      section('networkSection', 'network', {
        ...head(partnersPage.network),
        regions: referenceList(regionIds),
        hq: reference(hqId),
      }),
      section('pillarGridSection', 'pillars', {
        ...head(partnersPage.pillars),
        pillars: referenceList(pillarIds),
      }),
      section('ctaSection', 'cta', {
        label: partnersPage.cta.label,
        heading: partnersPage.cta.heading,
        body: partnersPage.cta.body,
        primary: link(contactLink),
        secondary: link(aboutLink),
      }),
    ],
  };

  const contactPageDoc = {
    _id: 'contactPage',
    _type: 'contactPage',
    title: contactPage.title,
    metaTitle: `${contactPage.title} - ${home.companyName}`,
    metaDescription: contactPage.standfirst,
    sections: [
      section('pageHeroSection', 'hero', {
        heading: contactPage.heading,
        standfirst: contactPage.standfirst,
        image: image(contactPage.image),
        primary: link({ label: contactLabels.sendInquiry, href: `#${INQUIRY_ANCHOR}` }),
        secondary: link({ label: contactLabels.findOffice, href: `#${OFFICE_ANCHOR}` }),
      }),
      section('contactChannelsSection', 'channels', {
        ...head(contactPage.channels),
        items: keyed(contactPage.channels.items, 'channel', (channel) => ({
          _type: 'contactChannel',
          name: channel.name,
          kind: channelKind(channel.href),
          description: channel.description,
          action: channel.action,
        })),
      }),
      section('inquirySection', 'inquiry', {
        ...head(contactPage.inquiry),
        formFields: keyed(contactPage.inquiry.fields, 'field', (field) => ({
          _type: 'formField',
          name: field.name,
          label: field.label,
          kind: field.kind,
          required: field.required,
          span: field.span,
          ...(field.autocomplete ? { autocomplete: field.autocomplete } : {}),
          ...(field.placeholder ? { placeholder: field.placeholder } : {}),
          ...(field.options ? { options: [...field.options] } : {}),
        })),
        nextStepsLabel: contactPage.inquiry.nextSteps.label,
        nextSteps: keyed(contactPage.inquiry.nextSteps.steps, 'step', (step) => ({
          _type: 'nextStep',
          title: step.title,
          description: step.description,
        })),
        routesLabel: contactPage.inquiry.routes.label,
        routes: keyed(contactPage.inquiry.routes.items, 'route', (item) => link(item)),
      }),
      section('officeSection', 'office', {
        ...head(contactPage.office),
        name: contactPage.office.name,
        country: contactPage.office.country,
      }),
      section('ctaSection', 'cta', {
        label: contactPage.cta.label,
        heading: contactPage.cta.heading,
        body: contactPage.cta.body,
        primary: link(contactPage.cta.primary),
        secondary: link(contactPage.cta.secondary),
      }),
    ],
  };

  const governanceSlug = aboutPage.governance.reading.link.href.replace(`${NEWS_PATH}/`, '');

  const aboutPageDoc = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: aboutPage.title,
    metaTitle: `${aboutPage.title} - ${home.companyName}`,
    metaDescription: aboutPage.standfirst,
    sections: [
      section('pageHeroSection', 'hero', {
        heading: aboutPage.heading,
        standfirst: aboutPage.standfirst,
        image: image(aboutPage.image),
        primary: link({ label: aboutLabels.ourMission, href: `#${MISSION_ANCHOR}` }),
        secondary: link({ label: home.whatWeDo.label, href: WHAT_WE_DO_PATH }),
      }),
      section('aboutIntroSection', 'intro', {
        label: aboutPage.intro.label,
        statement: [...aboutPage.intro.statement],
        body: [...aboutPage.intro.body],
        glanceLabel: aboutPage.intro.glance.label,
        glance: keyed(aboutPage.intro.glance.items, 'fact', (item) => ({
          _type: 'fact',
          label: item.label,
          value: item.value,
        })),
        glanceLink: link(aboutPage.intro.glance.link),
      }),
      section('aboutVisionSection', 'vision', {
        label: aboutPage.vision.label,
        statement: aboutPage.vision.statement,
        outcomesLabel: aboutPage.vision.outcomesLabel,
        outcomes: [...aboutPage.vision.outcomes],
        image: image(aboutPage.vision.image),
      }),
      section('aboutMissionSection', 'mission', {
        ...head(aboutPage.mission),
        items: aboutPage.mission.items.map((item) => ({
          _type: 'missionEntry',
          _key: `mission-${item.number}`,
          number: item.number,
          title: item.title,
          text: item.text,
          ...(item.link ? { link: link(item.link) } : {}),
        })),
      }),
      section('aboutGovernanceSection', 'governance', {
        ...head(aboutPage.governance),
        missionLabel: aboutPage.governance.missionLabel,
        mission: missionPoint(aboutPage.governance.mission),
        principles: keyed(aboutPage.governance.principles, 'principle', (item) => ({
          _type: 'principle',
          title: item.title,
          description: item.description,
        })),
        readingLabel: aboutPage.governance.reading.label,
        readingArticle: reference(ID.article(governanceSlug)),
        readingLinkLabel: aboutPage.governance.reading.link.label,
      }),
      section('pillarGridSection', 'pillars', {
        ...head(aboutPage.pillars),
        pillars: referenceList(pillarIds),
      }),
      section('ctaSection', 'cta', {
        label: aboutPage.cta.label,
        heading: aboutPage.cta.heading,
        body: aboutPage.cta.body,
        primary: link(aboutPage.cta.primary),
        secondary: link(aboutPage.cta.secondary),
      }),
    ],
  };

  // Collections first: every reference points backwards down this list.
  return [
    ...mapPins,
    ...pillars,
    ...articles,
    ...partnerCategories,
    siteSettings,
    homePage,
    aboutPageDoc,
    whatWeDoPage,
    newsPage,
    partnersPageDoc,
    contactPageDoc,
  ];
}

// -- images -------------------------------------------------------------------

function walk(node, visit) {
  if (Array.isArray(node)) {
    node.forEach((item) => walk(item, visit));
    return;
  }
  if (node && typeof node === 'object') {
    visit(node);
    Object.values(node).forEach((value) => walk(value, visit));
  }
}

function collectImageSources(documents) {
  const sources = new Set();
  walk(documents, (node) => {
    if (typeof node[PENDING_IMAGE] === 'string') sources.add(node[PENDING_IMAGE]);
  });
  return [...sources].sort();
}

/* Uploads each picture once. Sanity keys image assets by content hash, so a
   file already in the dataset is reused rather than duplicated. */
async function uploadImages(client, sources) {
  const assets = new Map();
  for (const src of sources) {
    const file = join(ROOT, 'public', src.replace(/^\//, ''));
    const buffer = await readFile(file);
    const sha1 = createHash('sha1').update(buffer).digest('hex');
    const existing = await client.fetch(
      '*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id',
      { sha1 },
    );
    if (existing) {
      assets.set(src, existing);
      console.log(`  reused  ${src}`);
      continue;
    }
    const asset = await client.assets.upload('image', buffer, {
      filename: basename(file),
      title: basename(file),
    });
    assets.set(src, asset._id);
    console.log(`  uploaded ${src}`);
  }
  return assets;
}

function resolveImages(documents, assets) {
  walk(documents, (node) => {
    const src = node[PENDING_IMAGE];
    if (typeof src !== 'string') return;
    const assetId = assets.get(src);
    if (!assetId) throw new Error(`No uploaded asset for ${src}`);
    delete node[PENDING_IMAGE];
    node.asset = { _type: 'reference', _ref: assetId };
  });
}

// -- verification -------------------------------------------------------------

const SYSTEM_KEYS = new Set(['_rev', '_createdAt', '_updatedAt', '_originalId', '_system']);

/* Every path where the document in the dataset differs from what the modules
   say it should be. */
function differences(expected, actual, path = '') {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return [`${path}: expected a list, found ${typeOf(actual)}`];
    const problems = [];
    if (expected.length !== actual.length) {
      problems.push(`${path}: ${expected.length} items expected, ${actual.length} found`);
    }
    expected.forEach((item, index) => {
      if (index < actual.length) {
        problems.push(...differences(item, actual[index], `${path}[${index}]`));
      }
    });
    return problems;
  }
  if (expected && typeof expected === 'object') {
    if (!actual || typeof actual !== 'object' || Array.isArray(actual)) {
      return [`${path}: expected an object, found ${typeOf(actual)}`];
    }
    const problems = [];
    for (const [key, value] of Object.entries(expected)) {
      problems.push(...differences(value, actual[key], path ? `${path}.${key}` : key));
    }
    for (const key of Object.keys(actual)) {
      if (SYSTEM_KEYS.has(key)) continue;
      if (!(key in expected)) problems.push(`${path ? `${path}.` : ''}${key}: unexpected value`);
    }
    return problems;
  }
  if (expected !== actual) {
    return [`${path}: expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`];
  }
  return [];
}

function typeOf(value) {
  if (value === undefined) return 'nothing';
  if (value === null) return 'null';
  return Array.isArray(value) ? 'a list' : typeof value;
}

async function verify(client, documents, created) {
  const ids = documents.map((doc) => doc._id);
  const live = await client.fetch('*[_id in $ids]', { ids });
  const byId = new Map(live.map((doc) => [doc._id, doc]));

  const missing = [];
  const drifted = [];
  for (const doc of documents) {
    const found = byId.get(doc._id);
    if (!found) {
      missing.push(doc._id);
      continue;
    }
    const problems = differences(doc, found);
    if (problems.length > 0) drifted.push({ id: doc._id, problems, created: created.has(doc._id) });
  }
  return { missing, drifted };
}

// -- run ----------------------------------------------------------------------

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) fail('PUBLIC_SANITY_PROJECT_ID is not set - see .env.example.');
if (!token && !DRY_RUN) {
  fail('SANITY_WRITE_TOKEN is not set - create one with Editor permissions at sanity.io/manage.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-06-01',
  token,
  useCdn: false,
});

console.log(`Reading src/content/*.ts …`);
const modules = await loadContentModules(ROOT);
const documents = buildDocuments(modules);
const sources = collectImageSources(documents);

console.log(
  `Built ${documents.length} document(s) referencing ${sources.length} image(s).`,
);

if (DRY_RUN) {
  const counts = documents.reduce((acc, doc) => {
    acc[doc._type] = (acc[doc._type] ?? 0) + 1;
    return acc;
  }, {});
  for (const [type, count] of Object.entries(counts).sort()) {
    console.log(`  ${String(count).padStart(2)} ${type}`);
  }
  console.log('\nImages:');
  sources.forEach((src) => console.log(`  ${src}`));
  console.log('\nDry run - nothing was written.');
  process.exit(0);
}

console.log(`\nImages -> ${projectId}/${dataset}:`);
const assets = await uploadImages(client, sources);
resolveImages(documents, assets);

const transaction = client.transaction();
for (const doc of documents) {
  if (REPLACE) transaction.createOrReplace(doc);
  else transaction.createIfNotExists(doc);
}

console.log(
  `\nWriting ${documents.length} document(s) ` +
    `(${REPLACE ? 'replacing existing content' : 'leaving existing documents untouched'}) …`,
);
const result = await transaction.commit({ visibility: 'sync' });
const created = new Set(
  result.results.filter((entry) => entry.operation === 'create').map((entry) => entry.id),
);
console.log(`  created ${created.size}, already present ${documents.length - created.size}`);

console.log('\nChecking the dataset against the content modules …');
const { missing, drifted } = await verify(client, documents, created);

for (const { id, problems, created: wasCreated } of drifted) {
  console.log(`  ${wasCreated ? 'MISMATCH' : 'edited in the Studio'}: ${id}`);
  problems.slice(0, 10).forEach((problem) => console.log(`      ${problem}`));
  if (problems.length > 10) console.log(`      … and ${problems.length - 10} more`);
}

const brokenNewDocs = drifted.filter((entry) => entry.created);
if (missing.length > 0 || brokenNewDocs.length > 0) {
  missing.forEach((id) => console.log(`  MISSING: ${id}`));
  fail(
    `Seed did not reproduce the content modules: ` +
      `${missing.length} missing, ${brokenNewDocs.length} mismatched.`,
  );
}

const edited = drifted.length;
console.log(
  edited === 0
    ? `\nEvery document matches src/content/*.ts. Open /admin to edit.`
    : `\n${edited} document(s) differ from src/content/*.ts because they were ` +
        `edited in the Studio. Re-run with --replace to overwrite them.`,
);
