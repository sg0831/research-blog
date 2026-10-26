import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { languages, siteConfig, type Language } from '../../config/site';
import { getPosts } from '../../lib/posts';
import { localizedPath } from '../../lib/urls';

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as Language;
  const posts = await getPosts(lang, false);
  return rss({
    title: siteConfig.title[lang],
    description: siteConfig.description[lang],
    site: context.site ?? 'https://example.github.io',
    items: posts.map((post) => ({
      title: post.entry.data.title,
      description: post.entry.data.summary,
      pubDate: post.createdAt,
      link: localizedPath(lang, `posts/${post.slug}/`),
      customData: post.updatedAt ? `<updated>${post.updatedAt.toISOString()}</updated>` : undefined,
    })),
  });
}
