import { getCollection, type CollectionEntry } from 'astro:content';
import removeMarkdown from 'remove-markdown';
import categoriesData from '../data/categories.json';
import tagsData from '../data/tags.json';
import type { Language } from '../config/site';
import { getGitDates, toDateInput } from './git-dates';

export type PostEntry = CollectionEntry<'posts'>;
export type Category = (typeof categoriesData)[number];

export interface PostRecord {
  slug: string;
  lang: Language;
  entry: PostEntry;
  createdAt: Date;
  updatedAt: Date | null;
  createdDate: string;
  updatedDate: string | null;
  dateSource: 'git' | 'filesystem';
  searchText: string;
}

export const categories = categoriesData as Category[];
export const tags = tagsData as string[];

export function parseEntryId(id: string) {
  const parts = id.replace(/\\/g, '/').split('/');
  const lang = parts.pop();
  return { slug: parts.join('/'), lang };
}

export async function getPosts(lang: Language, includeDraft = import.meta.env.DEV): Promise<PostRecord[]> {
  const entries = await getCollection('posts');
  const records = entries
    .map((entry) => ({ entry, ...parseEntryId(entry.id) }))
    .filter((item): item is { entry: PostEntry; slug: string; lang: Language } => item.lang === lang)
    .filter(({ entry }) => includeDraft || !entry.data.draft)
    .map(({ entry, slug }) => {
      const dates = getGitDates(slug);
      return {
        slug,
        lang,
        entry,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt,
        createdDate: toDateInput(dates.createdAt),
        updatedDate: dates.updatedAt ? toDateInput(dates.updatedAt) : null,
        dateSource: dates.source,
        searchText: normalizeSearchText(removeMarkdown(entry.body ?? '')),
      };
    });

  return records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPost(slug: string, lang: Language, includeDraft = import.meta.env.DEV) {
  const posts = await getPosts(lang, includeDraft);
  return posts.find((post) => post.slug === slug);
}

export function normalizeSearchText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

export function categoryLabel(category: Category, lang: Language) {
  return category[lang];
}

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}
