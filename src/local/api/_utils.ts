import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { isValidTag, normalizeTag } from '../../lib/tags';

export const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const postsRoot = join(projectRoot, 'src', 'content', 'posts');
export const categoriesFile = join(projectRoot, 'src', 'data', 'categories.json');
export const tagsFile = join(projectRoot, 'src', 'data', 'tags.json');
export const templatesRoot = join(projectRoot, 'src', 'content', 'templates');
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface LocalCategory {
  id: string;
  ko: string;
  en: string;
  descriptionKo: string;
  descriptionEn: string;
  template?: string;
}

export async function readCategories(): Promise<LocalCategory[]> {
  return JSON.parse(await readFile(categoriesFile, 'utf8'));
}

export async function readTags(): Promise<string[]> {
  return JSON.parse(await readFile(tagsFile, 'utf8'));
}

export function validateTags(values: unknown) {
  if (!Array.isArray(values)) throw new Error('태그 목록이 올바르지 않습니다.');
  const normalized = values.map((value) => normalizeTag(String(value)));
  if (normalized.some((tag) => !isValidTag(tag))) {
    throw new Error('태그는 50자 이하의 글자·숫자와 단어 사이의 하이픈만 사용할 수 있습니다.');
  }
  if (new Set(normalized).size !== normalized.length) throw new Error('중복 태그가 있습니다.');
  return normalized.sort((a, b) => a.localeCompare(b));
}

export async function writeJsonAtomic(file: string, value: unknown) {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, file);
}

export async function writeTextAtomic(file: string, value: string) {
  await mkdir(dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  await writeFile(temporary, value, 'utf8');
  await rename(temporary, file);
}

export function safePostDirectory(slug: string) {
  if (!slugPattern.test(slug)) throw new Error('slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.');
  const directory = resolve(postsRoot, slug);
  if (!directory.startsWith(`${resolve(postsRoot)}${sep}`)) throw new Error('안전하지 않은 게시물 경로입니다.');
  return directory;
}

export async function listPostSlugs() {
  if (!existsSync(postsRoot)) return [];
  const items = await readdir(postsRoot);
  const result: string[] = [];
  for (const item of items) {
    if (!slugPattern.test(item)) continue;
    if ((await stat(join(postsRoot, item))).isDirectory()) result.push(item);
  }
  return result.sort();
}

export async function readPostDocument(slug: string, lang: 'ko' | 'en') {
  const file = join(safePostDirectory(slug), `${lang}.md`);
  const parsed = matter(await readFile(file, 'utf8'));
  return { data: parsed.data, body: parsed.content.trimStart() };
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function errorResponse(error: unknown, status = 400) {
  return json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' }, status);
}

export function localImageReferences(markdown: string) {
  const references: { alt: string; path: string; name: string }[] = [];
  const pattern = /!\[([^\]]*)\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const path = match[2].replace(/^<|>$/g, '').split(/[?#]/)[0];
    if (/^(https?:|data:)/i.test(path)) continue;
    const decoded = decodeURIComponent(path);
    references.push({ alt: match[1].trim(), path: decoded, name: decoded.replace(/^\.\/images\//, '') });
  }
  return references;
}

export async function validateLocalImages(slug: string, markdownDocuments: string[], uploadedNames: Set<string>) {
  const directory = safePostDirectory(slug);
  for (const markdown of markdownDocuments) {
    for (const reference of localImageReferences(markdown)) {
      if (!reference.alt) throw new Error(`이미지 대체 텍스트가 비어 있습니다: ${reference.path}`);
      if (!reference.path.startsWith('./images/')) throw new Error(`로컬 이미지는 ./images/ 경로를 사용하세요: ${reference.path}`);
      if (reference.name.includes('/') || reference.name.includes('\\')) throw new Error(`이미지 파일명에 폴더를 사용할 수 없습니다: ${reference.name}`);
      const existing = existsSync(join(directory, 'images', reference.name));
      if (!existing && !uploadedNames.has(reference.name)) throw new Error(`이미지를 찾을 수 없습니다: ${reference.path}`);
    }
  }
}

export const imageMimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export function validateImageName(name: string) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name)) throw new Error(`안전하지 않은 이미지 파일명입니다: ${name}`);
  if (!imageMimeTypes[extname(name).toLowerCase()]) throw new Error(`지원하지 않는 이미지 형식입니다: ${name}`);
}
