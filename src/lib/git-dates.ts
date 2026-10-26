import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { siteConfig, type Language } from '../config/site';

export interface GitDates {
  createdAt: Date;
  updatedAt: Date | null;
  source: 'git' | 'filesystem';
}

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const cache = new Map<string, GitDates>();

export function getGitDates(slug: string): GitDates {
  const cached = cache.get(slug);
  if (cached) return cached;

  const relativeDirectory = `src/content/posts/${slug}`;

  try {
    const output = execFileSync('git', ['log', '--format=%cI', '--', relativeDirectory], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const dates = output
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((value) => new Date(value));

    if (dates.length > 0) {
      const result = {
        createdAt: dates.at(-1)!,
        updatedAt: dates.length > 1 ? dates[0] : null,
        source: 'git' as const,
      };
      cache.set(slug, result);
      return result;
    }
  } catch {
    // A new local post has no commit history yet; use file times for preview only.
  }

  const files = ['ko.md', 'en.md']
    .map((file) => fileURLToPath(new URL(`../content/posts/${slug}/${file}`, import.meta.url)))
    .filter(existsSync)
    .map((file) => statSync(file));
  const timestamps = files.map((file) => file.mtimeMs);
  const fallback = new Date(timestamps.length ? Math.min(...timestamps) : Date.now());
  const result = { createdAt: fallback, updatedAt: null, source: 'filesystem' as const };
  cache.set(slug, result);
  return result;
}

export function formatPostDate(value: Date, lang: Language) {
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: siteConfig.timeZone,
  }).format(value);
}

export function toDateInput(value: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: siteConfig.timeZone,
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
