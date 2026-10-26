import type { APIRoute } from 'astro';
import { errorResponse, json, listPostSlugs, readPostDocument, readTags, tagsFile, validateTags, writeJsonAtomic } from './_utils';

export const prerender = false;

async function getUsage() {
  const usage: Record<string, string[]> = {};
  for (const slug of await listPostSlugs()) {
    try {
      const post = await readPostDocument(slug, 'ko');
      for (const tag of post.data.tags ?? []) (usage[tag] ??= []).push(slug);
    } catch {
      // Broken drafts are reported by the content validator.
    }
  }
  return usage;
}

export const GET: APIRoute = async () => {
  try {
    return json({ tags: await readTags(), usage: await getUsage() });
  } catch (error) {
    return errorResponse(error, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json() as { tags: unknown };
    const tags = validateTags(payload.tags);
    const usage = await getUsage();
    const next = new Set(tags);
    for (const [tag, posts] of Object.entries(usage)) {
      if (!next.has(tag)) throw new Error(`태그 '${tag}'를 사용하는 글이 있어 삭제하거나 이름을 바꿀 수 없습니다: ${posts.join(', ')}`);
    }
    await writeJsonAtomic(tagsFile, tags);
    return json({ ok: true, tags, usage });
  } catch (error) {
    return errorResponse(error);
  }
};
