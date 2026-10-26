import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const excludedDirectories = new Set(['.git', '.astro', 'dist', 'node_modules']);
const textExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.mjs', '.ts', '.txt', '.xml', '.yaml', '.yml']);
const textFilesWithoutExtension = new Set(['.dockerignore', '.editorconfig', '.gitattributes', '.gitignore', 'Dockerfile']);
const errors = [];
const decoder = new TextDecoder('utf-8', { fatal: true });

function visit(directory) {
  for (const name of readdirSync(directory)) {
    if (excludedDirectories.has(name)) continue;
    const file = join(directory, name);
    const stat = statSync(file);
    if (stat.isDirectory()) {
      visit(file);
      continue;
    }
    if (!textExtensions.has(extname(name).toLowerCase()) && !textFilesWithoutExtension.has(name)) continue;
    const path = relative(root, file).replace(/\\/g, '/');
    try {
      const text = decoder.decode(readFileSync(file));
      if (text.charCodeAt(0) === 0xfeff) errors.push(`${path}: UTF-8 BOM을 제거하세요 / Remove the UTF-8 BOM`);
      if (text.includes('\uFFFD')) errors.push(`${path}: 손상된 대체 문자가 있습니다 / Contains a replacement character`);
      if (/\?{3,}/.test(text)) errors.push(`${path}: 연속된 물음표가 있어 손상된 문자열일 수 있습니다 / Suspicious repeated question marks`);
    } catch {
      errors.push(`${path}: 올바른 UTF-8 파일이 아닙니다 / Invalid UTF-8`);
    }
  }
}

visit(root);

if (errors.length) {
  console.error(`\nUTF-8 검증 실패 / UTF-8 validation failed (${errors.length})\n`);
  console.error(errors.map((error, index) => `${index + 1}. ${error}`).join('\n'));
  process.exit(1);
}

console.log('UTF-8 검증 완료 / UTF-8 validation passed.');
