import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const postsRoot = join(root, 'src', 'content', 'posts');
const collectionWatcherFile = join(postsRoot, '_watch.md');
const templatesRoot = join(root, 'src', 'content', 'templates');
const categoriesFile = join(root, 'src', 'data', 'categories.json');
const tagsFile = join(root, 'src', 'data', 'tags.json');
const errors = [];
const warnings = [];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tagPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const normalizeTag = (value) => String(value).normalize('NFC').trim().toLocaleLowerCase('en-US');

if (!existsSync(collectionWatcherFile)) {
  errors.push('첫 게시물 감지를 위한 내부 파일이 없습니다 / Missing internal collection watcher: src/content/posts/_watch.md');
}

const categories = JSON.parse(readFileSync(categoriesFile, 'utf8'));
const tags = JSON.parse(readFileSync(tagsFile, 'utf8'));
const categoryIds = new Set();
const tagIds = new Set();

if (!Array.isArray(categories) || categories.length === 0) errors.push('카테고리를 하나 이상 등록하세요 / Register at least one category');
for (const category of categories) {
  if (!slugPattern.test(category.id)) errors.push(`카테고리 ID가 올바르지 않습니다 / Invalid category ID: ${category.id}`);
  if (categoryIds.has(category.id)) errors.push(`중복 카테고리 ID입니다 / Duplicate category ID: ${category.id}`);
  categoryIds.add(category.id);
  if (!category.ko?.trim() || !category.en?.trim()) {
    errors.push(`카테고리의 한글·영문 이름이 필요합니다 / Category labels are required: ${category.id}`);
  }
  if (category.template) {
    if (!slugPattern.test(category.template)) errors.push(`카테고리 양식 ID가 올바르지 않습니다 / Invalid template ID: ${category.template}`);
    for (const lang of ['ko', 'en']) {
      const template = join(templatesRoot, category.template, `${lang}.md`);
      if (!existsSync(template)) errors.push(`${category.id}: ${lang} 양식이 없습니다 / Missing template: ${template}`);
    }
  }
}

if (!Array.isArray(tags)) errors.push('태그 저장소는 배열이어야 합니다 / Tags must be an array');
else for (const rawTag of tags) {
  const tag = normalizeTag(rawTag);
  if (rawTag !== tag || tag.length > 50 || !tagPattern.test(tag)) errors.push(`태그 형식이 올바르지 않습니다 / Invalid tag: ${rawTag}`);
  if (tagIds.has(tag)) errors.push(`중복 태그입니다 / Duplicate tag: ${tag}`);
  tagIds.add(tag);
}

if (existsSync(postsRoot)) {
  for (const item of readdirSync(postsRoot)) {
    const postDirectory = join(postsRoot, item);
    if (!statSync(postDirectory).isDirectory()) continue;
    if (!slugPattern.test(item)) errors.push(`게시물 폴더명은 영문 소문자 slug여야 합니다 / Invalid post slug: ${item}`);

    const documents = {};
    for (const lang of ['ko', 'en']) {
      const file = join(postDirectory, `${lang}.md`);
      if (!existsSync(file)) {
        errors.push(`${item}: ${lang}.md 파일이 없습니다 / Missing ${lang}.md`);
        continue;
      }

      const source = readFileSync(file, 'utf8');
      const parsed = matter(source);
      documents[lang] = parsed.data;

      if (!parsed.data.title?.trim()) errors.push(`${item}/${lang}: 제목이 없습니다 / Missing title`);
      if (!parsed.data.summary?.trim()) errors.push(`${item}/${lang}: 요약이 없습니다 / Missing summary`);
      if (typeof parsed.data.category !== 'string' || !categoryIds.has(parsed.data.category)) {
        errors.push(`${item}/${lang}: 존재하지 않는 카테고리 / Unknown category: ${parsed.data.category ?? 'missing'}`);
      }
      if (!Array.isArray(parsed.data.tags)) errors.push(`${item}/${lang}: tags는 배열이어야 합니다 / Tags must be an array`);
      else {
        const seen = new Set();
        for (const rawTag of parsed.data.tags) {
          const tag = normalizeTag(rawTag);
          if (rawTag !== tag || !tagPattern.test(tag) || tag.length > 50) errors.push(`${item}/${lang}: 태그 형식 오류 / Invalid tag: ${rawTag}`);
          if (seen.has(tag)) errors.push(`${item}/${lang}: 중복 태그 / Duplicate tag: ${tag}`);
          seen.add(tag);
          if (!tagIds.has(tag)) errors.push(`${item}/${lang}: 등록되지 않은 태그 / Unregistered tag: ${tag}`);
        }
      }
      if (typeof parsed.data.draft !== 'boolean') errors.push(`${item}/${lang}: draft는 true 또는 false여야 합니다`);

      const imagePattern = /!\[([^\]]*)\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
      for (const match of parsed.content.matchAll(imagePattern)) {
        const alt = match[1].trim();
        let imagePath = match[2].replace(/^<|>$/g, '');
        if (!alt) errors.push(`${item}/${lang}: 이미지 대체 텍스트가 비어 있습니다 / Image alt text is empty: ${imagePath}`);
        if (/^(https?:|data:)/i.test(imagePath)) continue;
        imagePath = decodeURIComponent(imagePath.split(/[?#]/)[0]);
        if (!imagePath.startsWith('./images/')) {
          errors.push(`${item}/${lang}: 로컬 이미지는 ./images/ 경로를 사용하세요 / Use ./images/: ${imagePath}`);
          continue;
        }
        const absoluteImage = resolve(dirname(file), imagePath);
        const allowedRoot = `${resolve(postDirectory)}${sep}`;
        if (!absoluteImage.startsWith(allowedRoot) || !existsSync(absoluteImage)) {
          errors.push(`${item}/${lang}: 이미지를 찾을 수 없습니다 / Image not found: ${imagePath}`);
        }
      }
    }

    if (documents.ko && documents.en) {
      if (documents.ko.category !== documents.en.category) errors.push(`${item}: 한글·영문 카테고리가 서로 다릅니다 / Category mismatch`);
      const koTags = JSON.stringify([...(documents.ko.tags ?? [])].sort());
      const enTags = JSON.stringify([...(documents.en.tags ?? [])].sort());
      if (koTags !== enTags) errors.push(`${item}: 한글·영문 태그가 서로 다릅니다 / Tag mismatch`);
      if (documents.ko.draft !== documents.en.draft) errors.push(`${item}: 한글·영문 draft 상태가 서로 다릅니다 / Draft mismatch`);
    }
  }
} else {
  warnings.push('게시물 폴더가 아직 없습니다 / No post directory found.');
}

if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) {
  console.error(`\n콘텐츠 검증 실패 / Content validation failed (${errors.length})\n`);
  console.error(errors.map((error, index) => `${index + 1}. ${error}`).join('\n'));
  process.exit(1);
}

console.log('콘텐츠 검증 완료 / Content validation passed.');
