export async function renderMermaidBlocks(root: ParentNode, lang: 'ko' | 'en') {
  const codeBlocks = Array.from(root.querySelectorAll<HTMLElement>('pre > code.language-mermaid'));
  if (codeBlocks.length === 0) return;

  const labels = lang === 'ko'
    ? { diagram: 'Mermaid 다이어그램. 아래에서 다이어그램 원문을 확인할 수 있습니다.', source: '다이어그램 원문 보기', error: '다이어그램을 표시할 수 없습니다. 아래 원문을 확인하세요.' }
    : { diagram: 'Mermaid diagram. A text version is available below.', source: 'View diagram source', error: 'The diagram could not be displayed. Review the source below.' };
  const nodes: HTMLElement[] = [];

  codeBlocks.forEach((code, index) => {
    const source = code.textContent ?? '';
    const wrapper = document.createElement('figure');
    wrapper.className = 'mermaid-figure';
    const diagram = document.createElement('div');
    diagram.className = 'mermaid';
    diagram.id = `mermaid-diagram-${index + 1}`;
    diagram.setAttribute('role', 'img');
    diagram.setAttribute('aria-label', labels.diagram);
    diagram.textContent = source;
    const details = document.createElement('details');
    details.className = 'mermaid-source';
    const summary = document.createElement('summary');
    summary.textContent = labels.source;
    const pre = document.createElement('pre');
    const sourceCode = document.createElement('code');
    sourceCode.textContent = source;
    pre.append(sourceCode);
    details.append(summary, pre);
    wrapper.append(diagram, details);
    code.parentElement?.replaceWith(wrapper);
    nodes.push(diagram);
  });

  try {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        primaryColor: '#d9f4e6',
        primaryTextColor: '#17352d',
        primaryBorderColor: '#2f7d67',
        lineColor: '#4f6f65',
        secondaryColor: '#fff1b8',
        tertiaryColor: '#f7fbf8',
        fontFamily: 'system-ui, sans-serif',
      },
    });
    await mermaid.run({ nodes });
    for (const node of nodes) {
      const svg = node.querySelector('svg');
      svg?.setAttribute('aria-hidden', 'true');
      svg?.setAttribute('focusable', 'false');
    }
  } catch (error) {
    console.error('Mermaid rendering failed:', error);
    for (const node of nodes) {
      node.className = 'diagram-error';
      node.setAttribute('role', 'alert');
      node.textContent = labels.error;
    }
  }
}
