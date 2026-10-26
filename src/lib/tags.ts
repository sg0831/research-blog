export const tagPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export function normalizeTag(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('en-US');
}

export function isValidTag(value: string) {
  const normalized = normalizeTag(value);
  return normalized.length > 0 && normalized.length <= 50 && tagPattern.test(normalized);
}
