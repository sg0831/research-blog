import type { APIRoute } from 'astro';
import { languages, type Language } from '../../config/site';
import { getPosts } from '../../lib/posts';

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Language;
  const posts = await getPosts(lang);
  return new Response(JSON.stringify(posts.map((post) => ({
    slug: post.slug,
    title: post.entry.data.title.normalize('NFKC').toLocaleLowerCase(),
    content: post.searchText,
  }))), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
