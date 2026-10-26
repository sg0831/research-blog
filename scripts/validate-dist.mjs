import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const dist = join(process.cwd(), 'dist');
const required = ['index.html', 'en/index.html', 'ko/index.html', 'robots.txt'];
const errors = [];
const decoder = new TextDecoder('utf-8', { fatal: true });

function readUtf8(file) {
  try {
    return decoder.decode(readFileSync(file));
  } catch {
    errors.push(`${relative(dist, file)}: invalid UTF-8 build output`);
    return '';
  }
}

for (const path of required) {
  if (!existsSync(join(dist, path))) errors.push(`Missing build output: ${path}`);
}
if (!existsSync(join(dist, 'sitemap-index.xml')) && !existsSync(join(dist, 'sitemap-0.xml'))) {
  errors.push('Missing sitemap output');
}
if (existsSync(join(dist, 'editor', 'index.html')) || existsSync(join(dist, 'api', 'local'))) {
  errors.push('Local editor or local API leaked into the public build');
}

const rootIndex = join(dist, 'index.html');
if (existsSync(rootIndex)) {
  const html = readUtf8(rootIndex);
  if (!html.includes('data-default-language="en"')) errors.push('index.html: English is not marked as the default language');
  if (html.includes('navigator.language')) errors.push('index.html: browser language detection must not override the English default');
  if (html.includes('siteLanguage')) errors.push('index.html: language selection must not persist between visits');
}

for (const path of ['en/index.html', 'ko/index.html']) {
  const file = join(dist, path);
  if (!existsSync(file)) continue;
  const html = readUtf8(file);
  if (!html.includes('<meta charset="UTF-8">')) errors.push(`${path}: missing UTF-8 charset metadata`);
  if (!html.includes('<main')) errors.push(`${path}: missing main landmark`);
  if (!html.includes('skip-link')) errors.push(`${path}: missing skip link`);
  if (!html.includes('language-select')) errors.push(`${path}: missing language selector`);
  if (!html.includes('data-tag-picker')) errors.push(`${path}: missing accessible tag filter`);
  if (html.includes('siteLanguage')) errors.push(`${path}: language selection must not persist between visits`);
}

function scan(directory) {
  for (const name of readdirSync(directory)) {
    const file = join(directory, name);
    if (statSync(file).isDirectory()) {
      scan(file);
      continue;
    }
    const extension = extname(name).toLowerCase();
    if (!['.css', '.html', '.js', '.json', '.txt', '.xml'].includes(extension)) continue;
    const text = readUtf8(file);
    if (text.includes('\uFFFD')) errors.push(`${relative(dist, file)}: replacement character found`);
    if (['.html', '.json', '.txt', '.xml'].includes(extension) && /\?{3,}/.test(text)) {
      errors.push(`${relative(dist, file)}: suspicious repeated question marks found`);
    }
  }
}

if (existsSync(dist)) scan(dist);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('공개 빌드 검증 완료 / Public build validation passed.');
