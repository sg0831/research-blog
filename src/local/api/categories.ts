import type { APIRoute } from 'astro';
import { errorResponse, json, listPostSlugs, readCategories, readPostDocument, slugPattern, writeJsonAtomic, categoriesFile, type LocalCategory } from './_utils';

export const prerender = false;

async function getUsage() {
  const usage: Record<string, string[]> = {};
  for (const slug of await listPostSlugs()) {
    try {
      const post = await readPostDocument(slug, 'ko');
      const id = post.data.category;
      if (id) (usage[id] ??= []).push(slug);
    } catch {
      // Broken drafts are reported by the content validator.
    }
  }
  return usage;
}

export const GET: APIRoute = async () => {
  try {
    return json({ categories: await readCategories(), usage: await getUsage() });
  } catch (error) {
    return errorResponse(error, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json() as { categories: LocalCategory[] };
    if (!Array.isArray(payload.categories) || payload.categories.length === 0) throw new Error('카테고리를 하나 이상 유지해야 합니다.');
    const ids = new Set<string>();
    for (const category of payload.categories) {
      if (!slugPattern.test(category.id)) throw new Error(`카테고리 ID가 올바르지 않습니다: ${category.id}`);
      if (ids.has(category.id)) throw new Error(`중복 카테고리 ID입니다: ${category.id}`);
      ids.add(category.id);
      if (!category.ko?.trim() || !category.en?.trim()) throw new Error(`한글·영문 이름을 모두 입력하세요: ${category.id}`);
      if (category.template && !slugPattern.test(category.template)) throw new Error(`양식 ID가 올바르지 않습니다: ${category.template}`);
    }
    const usage = await getUsage();
    for (const [id, posts] of Object.entries(usage)) {
      if (!ids.has(id)) throw new Error(`카테고리 '${id}'를 사용하는 글이 있어 삭제할 수 없습니다: ${posts.join(', ')}`);
    }
    await writeJsonAtomic(categoriesFile, payload.categories);
    return json({ ok: true, categories: payload.categories, usage });
  } catch (error) {
    return errorResponse(error);
  }
};
