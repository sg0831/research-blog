import type { APIRoute } from 'astro';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { errorResponse, imageMimeTypes, postsRoot } from './_utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const relativePath = decodeURIComponent(params.path ?? '');
    if (!/^[a-z0-9-]+\/images\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(relativePath)) throw new Error('안전하지 않은 이미지 경로입니다.');
    const file = resolve(postsRoot, relativePath);
    if (!file.startsWith(`${resolve(postsRoot)}${sep}`) || !existsSync(file)) throw new Error('이미지를 찾을 수 없습니다.');
    const mime = imageMimeTypes[extname(file).toLowerCase()];
    if (!mime) throw new Error('지원하지 않는 이미지 형식입니다.');
    return new Response(await readFile(file), { headers: { 'Content-Type': mime, 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error, 404);
  }
};
