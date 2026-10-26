/** @returns {import('astro').AstroIntegration} */
export default function localEditor() {
  const localRoot = new URL('../src/local/', import.meta.url);

  return {
    name: 'research-blog-local-editor',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;

        injectRoute({ pattern: '/editor', entrypoint: new URL('editor.astro', localRoot), prerender: false });
        injectRoute({ pattern: '/api/local/posts', entrypoint: new URL('api/posts.ts', localRoot) });
        injectRoute({ pattern: '/api/local/post/[slug]', entrypoint: new URL('api/post.ts', localRoot) });
        injectRoute({ pattern: '/api/local/categories', entrypoint: new URL('api/categories.ts', localRoot) });
        injectRoute({ pattern: '/api/local/tags', entrypoint: new URL('api/tags.ts', localRoot) });
        injectRoute({ pattern: '/api/local/template/[category]', entrypoint: new URL('api/template.ts', localRoot) });
        injectRoute({ pattern: '/api/local/preview', entrypoint: new URL('api/preview.ts', localRoot) });
        injectRoute({ pattern: '/api/local/assets/[...path]', entrypoint: new URL('api/assets.ts', localRoot) });
      },
    },
  };
}
