// The News & Articles seam: the listing at /news, the article pages under it,
// and the homepage teaser. Components in src/components/news read the shapes
// declared here and nothing else.
//
// An article body is Portable Text, so an editor gets paragraphs, headings,
// bullets, bold, italics, and links; a pull quote is its own block type.
// Reading time, the newest-first order, and the related and adjacent articles
// are all derived here from the collection rather than stored.

import { fetchDocument, fetchList, IMAGE, once } from '../lib/sanity';
import {
  contactLink,
  CTA_SECTION,
  NEWS_PATH,
  PAGE_HERO_SECTION,
  pageQuery,
  WHAT_WE_DO_PATH,
  type CtaSection,
  type NavItem,
  type PageHeroSection,
  type PageMeta,
  type PillarLink,
  type SectionBase,
  type SectionIntro,
  type SourcedImage,
} from './home';

export { NEWS_PATH, pad, visibleSections } from './home';
export type { SectionIntro } from './home';

export type ArticleCategory = 'capability' | 'insight' | 'company';

export const categoryLabels: Record<ArticleCategory, string> = {
  capability: 'Capability',
  insight: 'Insight',
  company: 'Company',
};

/* Ordered as the filter strip shows them. */
export const categories: ArticleCategory[] = ['capability', 'insight', 'company'];

/* Interface copy for the template chrome - buttons, meta labels, and band
   labels - kept in code so the components stay copy-free. */
export const newsLabels = {
  readArticle: 'Read article',
  /* Eyebrow on the featured (newest) card. */
  latest: 'Latest',
  filter: 'Filter',
  all: 'All',
  /* Suffix of the live count: "06 Articles". */
  articles: 'Articles',
  minRead: 'min read',
  published: 'Published',
  category: 'Category',
  readingTime: 'Reading time',
  relatedCapability: 'Related capability',
  share: 'Share',
  copyLink: 'Copy link',
  copied: 'Link copied',
  shareOn: 'Share on',
  newer: 'Newer',
  older: 'Older',
  allArticles: 'All Articles',
  /* The closing band of an article that expands a pillar. */
  nextStep: 'Next Step',
  explore: 'Explore',
};

// -- Portable Text -----------------------------------------------------------

export interface PortableSpan {
  _key: string;
  _type: 'span';
  text: string;
  marks?: string[];
}

/* A link annotation on a run of text; `_key` is what a span's mark points at. */
export interface PortableMark {
  _key: string;
  _type: string;
  href?: string;
}

export interface PortableBlock {
  _type: 'block';
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  children: PortableSpan[];
  markDefs?: PortableMark[];
}

/* A mission point or the commitment line, quoted verbatim. */
export interface PortableQuote {
  _type: 'articleQuote';
  _key: string;
  text: string;
  cite?: string;
}

export type ArticleBlock = PortableBlock | PortableQuote;

function blockText(block: ArticleBlock): string {
  return block._type === 'articleQuote'
    ? block.text
    : block.children.map((span) => span.text).join('');
}

const WORDS_PER_MINUTE = 200;

function readingMinutes(body: ArticleBlock[]): number {
  const words = body
    .map(blockText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// -- the article collection --------------------------------------------------

/* The pillar an article expands, with the closing band that ends the article. */
export interface ArticlePillar extends PillarLink {
  cta: { heading: string; body: string };
}

export interface Article {
  slug: string;
  href: string;
  title: string;
  /* ISO date (YYYY-MM-DD); rendered through shortDate / longDate. */
  date: string;
  category: ArticleCategory;
  /* Card copy and the article standfirst. */
  excerpt: string;
  image: SourcedImage;
  /* The pillar this article expands: its page is the "related capability"
     link and its closing band closes the article. Company news has none. */
  pillar?: ArticlePillar;
  body: ArticleBlock[];
  /* Derived from the body word count at ~200 words per minute, rounded up. */
  readingMinutes: number;
}

export function getArticles(): Promise<Article[]> {
  return once('articles', async () => {
    const articles = await fetchList<Omit<Article, 'readingMinutes'>>(
      'articles',
      `*[_type == "article"] | order(date desc) {
        "slug": slug.current,
        "href": "${NEWS_PATH}/" + slug.current,
        title,
        date,
        category,
        excerpt,
        image ${IMAGE},
        pillar->{
          "id": pillarId,
          name,
          "href": "${WHAT_WE_DO_PATH}/" + slug.current,
          cta{heading, body}
        },
        body
      }`,
    );
    return articles.map((article) => ({
      ...article,
      readingMinutes: readingMinutes(article.body),
    }));
  });
}

export function articleBySlug(articles: Article[], slug: string): Article {
  const article = articles.find((item) => item.slug === slug);
  if (!article) throw new Error(`news: no article with slug "${slug}"`);
  return article;
}

export function latestArticles(articles: Article[], count: number): Article[] {
  return articles.slice(0, count);
}

export function articleCount(articles: Article[], category?: ArticleCategory): number {
  return category
    ? articles.filter((article) => article.category === category).length
    : articles.length;
}

/* Same category first, then the rest - newest first within each. */
export function relatedArticles(articles: Article[], current: Article, count = 3): Article[] {
  const others = articles.filter((article) => article.slug !== current.slug);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

/* Neighbours in publication order; undefined at either end of the archive. */
export function adjacentArticles(
  articles: Article[],
  current: Article,
): { newer?: Article; older?: Article } {
  const i = articles.findIndex((article) => article.slug === current.slug);
  return { newer: articles[i - 1], older: articles[i + 1] };
}

// -- dates -------------------------------------------------------------------

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function dateParts(iso: string): { year: string; month: string; day: string } {
  const [year = '', month = '', day = ''] = iso.split('-');
  return { year, month, day };
}

/* "26.08.10" - the card format. */
export function shortDate(iso: string): string {
  const { year, month, day } = dateParts(iso);
  return `${year.slice(2)}.${month}.${day}`;
}

/* "10 August 2026" - article header and meta. */
export function longDate(iso: string): string {
  const { year, month, day } = dateParts(iso);
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ''} ${year}`;
}

// -- the listing page --------------------------------------------------------

export interface ArticleFeedSection extends SectionBase, SectionIntro {
  _type: 'articleFeedSection';
}

export type NewsSection = PageHeroSection | ArticleFeedSection | CtaSection;

export interface NewsPage extends PageMeta {
  sections: NewsSection[];
  /* The head of the cross-link band at the foot of every article. */
  continueReadingHead: SectionIntro;
}

export function getNewsPage(): Promise<NewsPage> {
  return once('newsPage', () =>
    fetchDocument<NewsPage>(
      'the News & Articles page',
      pageQuery(
        'newsPage',
        [
          PAGE_HERO_SECTION,
          '_type == "articleFeedSection" => { label, heading, intro }',
          CTA_SECTION,
        ],
        '\n    continueReadingHead{label, heading, intro},',
      ),
    ),
  );
}

export interface ArticleCta {
  label: string;
  heading: string;
  body: string;
  primary: NavItem;
  secondary: NavItem;
}

/* Every article ends on its pillar's closing band. Company news has no pillar,
   so it falls back to the listing page's own band - which it borrows whether
   or not that band is hidden, since `hidden` only governs the listing page. */
export function articleCta(article: Article, page: NewsPage): ArticleCta | undefined {
  if (article.pillar) {
    return {
      label: newsLabels.nextStep,
      heading: article.pillar.cta.heading,
      body: article.pillar.cta.body,
      primary: contactLink,
      secondary: {
        label: `${newsLabels.explore} ${article.pillar.name}`,
        href: article.pillar.href,
      },
    };
  }
  const fallback = page.sections.find(
    (section): section is CtaSection => section._type === 'ctaSection',
  );
  if (!fallback) return undefined;
  const { label, heading, body, primary, secondary } = fallback;
  return { label, heading, body, primary, secondary };
}
