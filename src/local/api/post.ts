import type { APIRoute } from 'astro';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { errorResponse, json, readPostDocument, safePostDirectory } from './_utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug ?? '';
    const directory = safePostDirectory(slug);
    const [ko, en] = await Promise.all([readPostDocument(slug, 'ko'), readPostDocument(slug, 'en')]);
    const imagesDirectory = join(directory, 'images');
    const images = existsSync(imagesDirectory) ? await readdir(imagesDirectory) : [];
    return json({
      slug,
      draft: Boolean(ko.data.draft),
      category: ko.data.category ?? '',
      tags: ko.data.tags ?? [],
      ko: { title: ko.data.title ?? '', summary: ko.data.summary ?? '', body: ko.body },
      en: { title: en.data.title ?? '', summary: en.data.summary ?? '', body: en.body },
      images,
    });
  } catch (error) {
    return errorResponse(error, 404);
  }
};
