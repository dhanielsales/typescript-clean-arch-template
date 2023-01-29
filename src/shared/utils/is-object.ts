export function isObject(object: any): boolean {
  return typeof object === 'object' && object !== null && !Array.isArray(object);
}
