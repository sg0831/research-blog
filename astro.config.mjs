// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import localEditor from './integrations/local-editor.mjs';
import { createResearchMarkdownProcessor, markdownSharedOptions } from './src/lib/markdown-config.mjs';

const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? '/').split('/');
const isUserSite = Boolean(repositoryOwner) && repositoryName === `${repositoryOwner}.github.io`;
const inferredSite = repositoryOwner ? `https://${repositoryOwner}.github.io` : 'https://example.github.io';
const inferredBase = repositoryName && !isUserSite ? `/${repositoryName}` : '/';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? inferredSite,
  base: process.env.BASE_PATH ?? inferredBase,
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    ...markdownSharedOptions,
    processor: createResearchMarkdownProcessor(),
  },
  integrations: [
    localEditor(),
    sitemap({
      filter: (page) => !page.includes('/search-index/') && !page.includes('/editor/'),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ko: 'ko' },
      },
    }),
  ],
});
