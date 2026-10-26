import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const origin = site ?? new URL('https://example.github.io');
  const sitemap = new URL(`${base}sitemap-index.xml`.replace(/\/+/g, '/'), origin);
  const searchIndex = `${base}search-index/`.replace(/\/+/g, '/');
  return new Response([
    'User-agent: *',
    'Allow: /',
    `Disallow: ${searchIndex}`,
    `Sitemap: ${sitemap.href}`,
    '',
  ].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
