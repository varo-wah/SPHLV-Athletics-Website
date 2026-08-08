export type NewsPublicationChannel = 'published' | 'prototype';

export interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string | null;
  dateLabel: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: readonly [string, ...string[]];
  publicationChannel: NewsPublicationChannel;
}

const PUBLISHED_NEWS_ARTICLES: readonly NewsArticle[] = [];

const PROTOTYPE_NEWS_ARTICLES: readonly NewsArticle[] = import.meta.env.VITE_RELEASE_CHANNEL === 'prototype' ? [
  {
    id: 'sample-basketball-overtime',
    title: 'VARSITY BASKETBALL SECURES THRILLING OVERTIME VICTORY',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'GAMEDAY RECAP',
    excerpt: 'Marcus Reed drops 28 points as the Eagles storm back in the fourth quarter to take down JIS...',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample basketball story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
  {
    id: 'sample-girls-soccer-quarterfinals',
    title: 'GIRLS SOCCER ADVANCES TO REGIONAL QUARTERFINALS',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'TEAM NEWS',
    excerpt: 'A dominant 3-1 performance sets up a clash with ACS next Tuesday under the lights.',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample soccer story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
  {
    id: 'sample-track-records',
    title: 'TRACK & FIELD SETS THREE NEW SCHOOL RECORDS AT INVITATIONAL',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'ACHIEVEMENT',
    excerpt: 'The weekend saw historic performances across the sprints and hurdles events from our varsity roster.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample track and field story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
] : [];

export const NEWS_ARTICLES: readonly NewsArticle[] = [
  ...PUBLISHED_NEWS_ARTICLES,
  ...PROTOTYPE_NEWS_ARTICLES,
];

export function visibleNewsArticles(isPrototype: boolean): readonly NewsArticle[] {
  return NEWS_ARTICLES.filter((article) => (
    isPrototype
      ? true
      : article.publicationChannel === 'published'
        && Boolean(article.publishedAt)
        && article.body.length > 0
  ));
}
