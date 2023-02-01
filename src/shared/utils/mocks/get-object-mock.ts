export function getObjectMock<T extends Record<string, any> = any>(
  model: any,
  payload: Partial<T> = {},
): jest.Mocked<T> {
  const result: any = {};

  const keys = Object.keys(model);

  for (const key of keys) {
    if (typeof model[key] === 'string') {
      result[key] = payload[key] || '';
    } else if (typeof model[key] === 'number') {
      result[key] = payload[key] || 0;
    } else if (typeof model[key] === 'boolean') {
      result[key] = payload[key] || true;
    } else if (typeof model[key] === 'symbol') {
      result[key] = payload[key] || Symbol.for('');
    } else if (Array.isArray(model[key])) {
      result[key] =
        payload[key] || model[key].map((curr: any) => getObjectMock<typeof curr>(model[key]));
    } else if (typeof model[key] === 'object') {
      const curr = model[key];
      result[key] = payload[key] || getObjectMock<typeof curr>(model[key]);
    } else if (typeof model[key] === 'function') {
      result[key] = payload[key] ? jest.fn(payload[key]) : jest.fn();
    }
  }

  return result as jest.Mocked<T>;
}
