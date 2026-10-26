import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { errorResponse, json, readCategories, slugPattern, templatesRoot } from './_utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const categoryId = params.category ?? '';
    if (!slugPattern.test(categoryId)) throw new Error('카테고리 ID가 올바르지 않습니다.');
    const category = (await readCategories()).find((item) => item.id === categoryId);
    if (!category) throw new Error('카테고리를 찾을 수 없습니다.');
    if (!category.template) return json({ category: categoryId, template: null });
    if (!slugPattern.test(category.template)) throw new Error('카테고리 양식 ID가 올바르지 않습니다.');
    const [ko, en] = await Promise.all([
      readFile(join(templatesRoot, category.template, 'ko.md'), 'utf8'),
      readFile(join(templatesRoot, category.template, 'en.md'), 'utf8'),
    ]);
    return json({ category: categoryId, template: { ko, en } });
  } catch (error) {
    return errorResponse(error, 404);
  }
};
