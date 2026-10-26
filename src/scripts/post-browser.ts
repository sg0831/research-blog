import { createTagPicker } from './tag-picker';

interface SearchItem { slug: string; title: string; content: string }

const browser = document.querySelector<HTMLElement>('[data-post-browser]');

if (browser) {
  const form = browser.querySelector<HTMLFormElement>('[data-search-form]')!;
  const cards = Array.from(browser.querySelectorAll<HTMLElement>('[data-post-card]'));
  const emptyState = browser.querySelector<HTMLElement>('[data-empty-state]')!;
  const resultStatus = browser.querySelector<HTMLElement>('[data-result-status]')!;
  const pagination = browser.querySelector<HTMLElement>('[data-pagination]')!;
  const previous = browser.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = browser.querySelector<HTMLButtonElement>('[data-next]')!;
  const pageStatus = browser.querySelector<HTMLElement>('[data-page-status]')!;
  const shortcuts = Array.from(browser.querySelectorAll<HTMLButtonElement>('[data-category-shortcut]'));
  const categoryInput = form.elements.namedItem('category') as HTMLSelectElement;
  const tagPickerRoot = browser.querySelector<HTMLElement>('[data-tag-picker]')!;
  const tagPicker = createTagPicker(tagPickerRoot, {
    availableTags: JSON.parse(browser.dataset.tags ?? '[]'),
    lang: browser.dataset.lang === 'ko' ? 'ko' : 'en',
  });
  const perPage = Number(browser.dataset.perPage ?? '10');
  let page = 1;
  let searchIndex: SearchItem[] | null = null;
  let searchIndexPromise: Promise<SearchItem[]> | null = null;

  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const loadSearchIndex = () => {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (!searchIndexPromise) {
      searchIndexPromise = fetch(browser.dataset.searchIndex ?? '')
        .then((response) => {
          if (!response.ok) throw new Error('Search index unavailable');
          return response.json();
        })
        .then((data: SearchItem[]) => (searchIndex = data));
    }
    return searchIndexPromise;
  };

  const getValues = () => {
    const data = new FormData(form);
    return {
      query: normalize(String(data.get('query') ?? '')),
      scope: String(data.get('scope') ?? 'both'),
      from: String(data.get('from') ?? ''),
      to: String(data.get('to') ?? ''),
      category: String(data.get('category') ?? ''),
      tags: tagPicker.getSelected(),
    };
  };

  const updateUrl = (values: ReturnType<typeof getValues>) => {
    const params = new URLSearchParams();
    if (values.query) params.set('q', values.query);
    if (values.scope !== 'both') params.set('scope', values.scope);
    if (values.from) params.set('from', values.from);
    if (values.to) params.set('to', values.to);
    if (values.category) params.set('category', values.category);
    values.tags.forEach((tag) => params.append('tag', tag));
    const query = params.toString();
    history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  };

  const syncShortcuts = (category: string) => {
    shortcuts.forEach((button) => {
      const id = button.dataset.categoryShortcut ?? '';
      const active = id === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const filter = async () => {
    const values = getValues();
    let content = new Map<string, SearchItem>();
    if (values.query && values.scope !== 'title') {
      try {
        content = new Map((await loadSearchIndex()).map((item) => [item.slug, item]));
      } catch {
        resultStatus.textContent = browser.dataset.lang === 'ko'
          ? '본문 검색 자료를 불러오지 못했습니다. 제목 검색은 계속 사용할 수 있습니다.'
          : 'The content index could not be loaded. Title search remains available.';
      }
    }

    const matched = cards.filter((card) => {
      const title = card.dataset.title ?? '';
      const body = content.get(card.dataset.slug ?? '')?.content ?? '';
      const matchesQuery = !values.query || (
        values.scope === 'title' ? title.includes(values.query)
          : values.scope === 'content' ? body.includes(values.query)
            : title.includes(values.query) || body.includes(values.query)
      );
      const cardTags = (card.dataset.tags ?? '').split(',').filter(Boolean);
      return matchesQuery
        && (!values.from || (card.dataset.created ?? '') >= values.from)
        && (!values.to || (card.dataset.created ?? '') <= values.to)
        && (!values.category || card.dataset.category === values.category)
        && values.tags.every((tag) => cardTags.includes(tag));
    });

    const totalPages = Math.max(1, Math.ceil(matched.length / perPage));
    page = Math.min(page, totalPages);
    cards.forEach((card) => { card.hidden = true; });
    matched.slice((page - 1) * perPage, page * perPage).forEach((card) => { card.hidden = false; });
    emptyState.hidden = matched.length !== 0;
    const resultTemplate = matched.length === 1 ? browser.dataset.resultSingular : browser.dataset.resultPlural;
    resultStatus.textContent = (resultTemplate ?? '{count}').replace('{count}', String(matched.length));
    pagination.hidden = totalPages <= 1;
    previous.disabled = page <= 1;
    next.disabled = page >= totalPages;
    pageStatus.textContent = (browser.dataset.pageTemplate ?? '{page}/{total}')
      .replace('{page}', String(page))
      .replace('{total}', String(totalPages));
    syncShortcuts(values.category);
    updateUrl(values);
  };

  let timer = 0;
  form.addEventListener('input', (event) => {
    if (tagPickerRoot.contains(event.target as Node)) return;
    page = 1;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { void filter(); }, 150);
  });
  form.addEventListener('change', () => { page = 1; void filter(); });
  form.addEventListener('reset', () => {
    page = 1;
    tagPicker.setSelected([]);
    window.setTimeout(() => { void filter(); });
  });
  tagPickerRoot.addEventListener('tagchange', () => { page = 1; void filter(); });
  previous.addEventListener('click', () => { page -= 1; void filter().then(() => resultStatus.focus()); });
  next.addEventListener('click', () => { page += 1; void filter().then(() => resultStatus.focus()); });
  shortcuts.forEach((button) => button.addEventListener('click', () => {
    categoryInput.value = button.dataset.categoryShortcut ?? '';
    page = 1;
    void filter();
  }));

  const params = new URLSearchParams(window.location.search);
  const queryInput = form.elements.namedItem('query') as HTMLInputElement;
  const scopeInput = form.elements.namedItem('scope') as HTMLSelectElement;
  const fromInput = form.elements.namedItem('from') as HTMLInputElement;
  const toInput = form.elements.namedItem('to') as HTMLInputElement;
  queryInput.value = params.get('q') ?? '';
  scopeInput.value = params.get('scope') ?? 'both';
  fromInput.value = params.get('from') ?? '';
  toInput.value = params.get('to') ?? '';
  categoryInput.value = params.get('category') ?? '';
  tagPicker.setSelected(params.getAll('tag'));
  void filter();
}
