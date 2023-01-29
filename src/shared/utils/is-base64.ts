export function isBase64(str: string): boolean {
  return Buffer.from(str, 'base64').toString('base64') === str;
}
