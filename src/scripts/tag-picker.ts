import { isValidTag, normalizeTag } from '../lib/tags';

interface TagPickerLabels {
  added: (tag: string) => string;
  removed: (tag: string) => string;
  remove: (tag: string) => string;
  create: (tag: string) => string;
  available: (count: number) => string;
  noResults: string;
}

interface TagPickerOptions {
  availableTags: string[];
  selectedTags?: string[];
  allowCreate?: boolean;
  lang?: 'ko' | 'en';
  onCreate?: (tag: string) => Promise<void> | void;
  onChange?: (tags: string[]) => void;
}

export interface TagPickerController {
  getSelected: () => string[];
  setSelected: (tags: string[]) => void;
  setAvailableTags: (tags: string[]) => void;
  focus: () => void;
}

let pickerSequence = 0;

export function createTagPicker(root: HTMLElement, options: TagPickerOptions): TagPickerController {
  const input = root.querySelector<HTMLInputElement>('[data-tag-input]')!;
  const listbox = root.querySelector<HTMLUListElement>('[data-tag-listbox]')!;
  const selectedList = root.querySelector<HTMLUListElement>('[data-selected-tags]')!;
  const live = root.querySelector<HTMLElement>('[data-tag-live]')!;
  const lang = options.lang === 'en' ? 'en' : 'ko';
  const labels: TagPickerLabels = lang === 'ko' ? {
    added: (tag) => `${tag} 태그를 선택했습니다.`,
    removed: (tag) => `${tag} 태그를 제거했습니다.`,
    remove: (tag) => `${tag} 태그 제거`,
    create: (tag) => `새 태그 ${tag} 만들기`,
    available: (count) => `선택할 수 있는 태그 ${count}개`,
    noResults: '일치하는 태그가 없습니다.',
  } : {
    added: (tag) => `Selected tag ${tag}.`,
    removed: (tag) => `Removed tag ${tag}.`,
    remove: (tag) => `Remove tag ${tag}`,
    create: (tag) => `Create new tag ${tag}`,
    available: (count) => `${count} tag suggestion${count === 1 ? '' : 's'} available.`,
    noResults: 'No matching tags.',
  };
  const idPrefix = `tag-picker-${++pickerSequence}`;
  let available = uniqueTags(options.availableTags);
  let selected = uniqueTags(options.selectedTags ?? []);
  let suggestions: { tag: string; create: boolean }[] = [];
  let activeIndex = -1;
  let creating = false;

  function uniqueTags(values: string[]) {
    return Array.from(new Set(values.map(normalizeTag).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }

  function announce(message: string) {
    live.textContent = '';
    window.setTimeout(() => { live.textContent = message; });
  }

  function closeListbox() {
    suggestions = [];
    activeIndex = -1;
    listbox.hidden = true;
    listbox.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function buildSuggestions() {
    const query = normalizeTag(input.value);
    const choices = available
      .filter((tag) => !selected.includes(tag) && (!query || tag.includes(query)))
      .slice(0, 20)
      .map((tag) => ({ tag, create: false }));
    if (options.allowCreate && query && isValidTag(query) && !available.includes(query) && !selected.includes(query)) {
      choices.unshift({ tag: query, create: true });
    }
    return choices;
  }

  function renderSuggestions(announceCount = false) {
    suggestions = buildSuggestions();
    activeIndex = suggestions.length ? Math.min(Math.max(activeIndex, 0), suggestions.length - 1) : -1;
    listbox.replaceChildren(...suggestions.map((suggestion, index) => {
      const option = document.createElement('li');
      option.id = `${idPrefix}-option-${index}`;
      option.role = 'option';
      option.setAttribute('aria-selected', String(index === activeIndex));
      option.classList.toggle('is-active', index === activeIndex);
      option.textContent = suggestion.create ? labels.create(suggestion.tag) : `#${suggestion.tag}`;
      option.addEventListener('pointerdown', (event) => event.preventDefault());
      option.addEventListener('click', () => { void choose(index); });
      option.addEventListener('mousemove', () => {
        activeIndex = index;
        updateActiveOption();
      });
      return option;
    }));
    const open = suggestions.length > 0;
    listbox.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    updateActiveOption();
    if (announceCount) announce(open ? labels.available(suggestions.length) : labels.noResults);
  }

  function updateActiveOption() {
    Array.from(listbox.children).forEach((option, index) => {
      option.classList.toggle('is-active', index === activeIndex);
      option.setAttribute('aria-selected', String(index === activeIndex));
    });
    const active = activeIndex >= 0 ? listbox.children[activeIndex] as HTMLElement | undefined : undefined;
    if (active) input.setAttribute('aria-activedescendant', active.id);
    else input.removeAttribute('aria-activedescendant');
  }

  function renderSelected() {
    selectedList.hidden = selected.length === 0;
    selectedList.replaceChildren(...selected.map((tag) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `#${tag}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', labels.remove(tag));
      remove.addEventListener('click', () => {
        selected = selected.filter((value) => value !== tag);
        renderSelected();
        renderSuggestions();
        announce(labels.removed(tag));
        options.onChange?.([...selected]);
        root.dispatchEvent(new CustomEvent('tagchange', { bubbles: true, detail: { tags: [...selected] } }));
        input.focus();
      });
      item.append(label, remove);
      return item;
    }));
  }

  async function choose(index: number) {
    const suggestion = suggestions[index];
    if (!suggestion || creating) return;
    creating = true;
    input.disabled = true;
    try {
      if (suggestion.create) {
        await options.onCreate?.(suggestion.tag);
        available = uniqueTags([...available, suggestion.tag]);
      }
      if (!selected.includes(suggestion.tag)) selected = [...selected, suggestion.tag];
      input.value = '';
      renderSelected();
      closeListbox();
      announce(labels.added(suggestion.tag));
      options.onChange?.([...selected]);
      root.dispatchEvent(new CustomEvent('tagchange', { bubbles: true, detail: { tags: [...selected] } }));
    } catch (error) {
      announce(error instanceof Error ? error.message : labels.noResults);
    } finally {
      creating = false;
      input.disabled = false;
      input.focus();
    }
  }

  input.addEventListener('focus', () => renderSuggestions());
  input.addEventListener('input', () => {
    activeIndex = -1;
    renderSuggestions(true);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (listbox.hidden) renderSuggestions();
      if (suggestions.length) activeIndex = (activeIndex + 1) % suggestions.length;
      updateActiveOption();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (listbox.hidden) renderSuggestions();
      if (suggestions.length) activeIndex = activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1;
      updateActiveOption();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (listbox.hidden || suggestions.length === 0) renderSuggestions();
      if (suggestions.length) void choose(activeIndex >= 0 ? activeIndex : 0);
      else announce(labels.noResults);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeListbox();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target as Node)) closeListbox();
  });

  renderSelected();

  return {
    getSelected: () => [...selected],
    setSelected: (tags) => {
      selected = uniqueTags(tags);
      available = uniqueTags([...available, ...selected]);
      input.value = '';
      renderSelected();
      closeListbox();
    },
    setAvailableTags: (tags) => {
      available = uniqueTags([...tags, ...selected]);
      if (!listbox.hidden) renderSuggestions();
    },
    focus: () => input.focus(),
  };
}
