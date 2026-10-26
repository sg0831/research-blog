import type { APIRoute } from 'astro';
import { markdownSharedOptions, createResearchMarkdownProcessor } from '../../lib/markdown-config.mjs';
import { errorResponse, json } from './_utils';

export const prerender = false;
const rendererPromise = createResearchMarkdownProcessor().createRenderer(markdownSharedOptions);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { markdown, lang } = await request.json() as { markdown: string; lang?: 'ko' | 'en' };
    if (typeof markdown !== 'string') throw new Error('미리보기 본문이 올바르지 않습니다.');
    const renderer = await rendererPromise;
    const result = await renderer.render(markdown, { frontmatter: { lang: lang === 'ko' ? 'ko' : 'en' } });
    return json({ html: result.code, headings: result.metadata.headings });
  } catch (error) {
    return errorResponse(error);
  }
};
