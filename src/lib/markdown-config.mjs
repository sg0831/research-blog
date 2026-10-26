import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';

function rehypeLocalizeFootnotes() {
  return (tree, file) => {
    const filePath = String(file.path ?? file.history?.[0] ?? '').replace(/\\/g, '/');
    const lang = file.data?.astro?.frontmatter?.lang === 'ko' || /\/ko\.md$/.test(filePath) ? 'ko' : 'en';
    const walk = (node) => {
      if (node?.type === 'element') {
        if (node.tagName === 'h2' && node.properties?.id === 'footnote-label' && lang === 'ko') {
          node.children = [{ type: 'text', value: '각주' }];
        }
        const isBackReference = node.tagName === 'a'
          && (node.properties?.dataFootnoteBackref !== undefined || node.properties?.['data-footnote-backref'] !== undefined);
        if (isBackReference && lang === 'ko') node.properties.ariaLabel = '각주 참조 위치로 돌아가기';
      }
      if (Array.isArray(node?.children)) node.children.forEach(walk);
    };
    walk(tree);
  };
}

/** @type {import('@astrojs/markdown-remark').AstroMarkdownOptions} */
export const markdownSharedOptions = {
  syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
  shikiConfig: {
    theme: 'github-light',
    wrap: true,
  },
};

export function createResearchMarkdownProcessor() {
  return unified({
    gfm: true,
    smartypants: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeSlug, rehypeKatex, rehypeLocalizeFootnotes],
  });
}
