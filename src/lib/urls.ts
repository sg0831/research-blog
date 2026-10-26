export function withBase(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${base}/${cleanPath}`.replace(/\/+/g, '/');
}

export function localizedPath(lang: 'ko' | 'en', path = '') {
  return withBase(`${lang}/${path}`);
}
