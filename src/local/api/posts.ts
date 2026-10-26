import type { APIRoute } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  errorResponse,
  json,
  listPostSlugs,
  readCategories,
  readPostDocument,
  readTags,
  safePostDirectory,
  validateImageName,
  validateLocalImages,
  validateTags,
  writeTextAtomic,
} from './_utils';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const posts = [];
    for (const slug of await listPostSlugs()) {
      try {
        const [ko, en] = await Promise.all([readPostDocument(slug, 'ko'), readPostDocument(slug, 'en')]);
        posts.push({
          slug,
          titleKo: ko.data.title,
          titleEn: en.data.title,
          category: ko.data.category ?? '',
          tags: ko.data.tags ?? [],
          draft: Boolean(ko.data.draft),
        });
      } catch {
        posts.push({ slug, titleKo: '읽기 오류', titleEn: 'Read error', category: '', tags: [], draft: true });
      }
    }
    return json({ posts });
  } catch (error) {
    return errorResponse(error, 500);
  }
};

interface SavePayload {
  slug: string;
  draft: boolean;
  category: string;
  tags: string[];
  ko: { title: string; summary: string; body: string };
  en: { title: string; summary: string; body: string };
  images?: { name: string; data: string }[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json() as SavePayload;
    const directory = safePostDirectory(payload.slug);
    const availableCategories = new Set((await readCategories()).map((category) => category.id));
    if (!payload.category || !availableCategories.has(payload.category)) throw new Error(`존재하지 않는 카테고리입니다: ${payload.category || '선택 안 됨'}`);
    const tags = validateTags(payload.tags);
    const availableTags = new Set(await readTags());
    for (const tag of tags) if (!availableTags.has(tag)) throw new Error(`등록되지 않은 태그입니다: ${tag}`);
    for (const lang of ['ko', 'en'] as const) {
      if (!payload[lang]?.title?.trim()) throw new Error(`${lang.toUpperCase()} 제목을 입력하세요.`);
      if (!payload[lang]?.summary?.trim()) throw new Error(`${lang.toUpperCase()} 요약을 입력하세요.`);
      if (!payload[lang]?.body?.trim()) throw new Error(`${lang.toUpperCase()} 본문을 입력하세요.`);
    }

    const images = payload.images ?? [];
    const uploadedNames = new Set<string>();
    for (const image of images) {
      validateImageName(image.name);
      if (uploadedNames.has(image.name)) throw new Error(`중복 이미지 파일명입니다: ${image.name}`);
      uploadedNames.add(image.name);
      if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(image.data)) throw new Error(`이미지 자료가 올바르지 않습니다: ${image.name}`);
      const buffer = Buffer.from(image.data.split(',')[1], 'base64');
      if (buffer.byteLength > 10 * 1024 * 1024) throw new Error(`이미지는 파일당 10MB 이하여야 합니다: ${image.name}`);
    }
    await validateLocalImages(payload.slug, [payload.ko.body, payload.en.body], uploadedNames);

    const frontmatter = { category: payload.category, tags, draft: Boolean(payload.draft) };
    const makeDocument = (lang: 'ko' | 'en') => matter.stringify(payload[lang].body.trimEnd() + '\n', {
      title: payload[lang].title.trim(),
      summary: payload[lang].summary.trim(),
      ...frontmatter,
    });

    await mkdir(directory, { recursive: true });
    await Promise.all([
      writeTextAtomic(join(directory, 'ko.md'), makeDocument('ko')),
      writeTextAtomic(join(directory, 'en.md'), makeDocument('en')),
    ]);
    if (images.length) {
      const imagesDirectory = join(directory, 'images');
      await mkdir(imagesDirectory, { recursive: true });
      for (const image of images) {
        const buffer = Buffer.from(image.data.split(',')[1], 'base64');
        await writeFile(join(imagesDirectory, image.name), buffer);
      }
    }

    return json({ ok: true, slug: payload.slug });
  } catch (error) {
    return errorResponse(error);
  }
};
