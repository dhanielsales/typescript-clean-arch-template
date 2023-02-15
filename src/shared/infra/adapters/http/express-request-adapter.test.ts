import MockDate from 'mockdate';

import { ExpressRequestAdapter } from './express-request-adapter';

describe('ExpressRequestAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns the correct HttpRequest object', async () => {
    const input: any = {
      header: () => null,
      url: 'url',
      body: {},
      cookies: {},
      params: {},
      query: {},
      userId: 'user-id',
    };

    const adapter = new ExpressRequestAdapter();

    const result = adapter.handle(input, {} as any);

    const expected = {
      header: () => null,
      url: 'url',
      body: {},
      cookies: {},
      params: {},
      query: {},
      previousHandlerResponse: {},
      userId: 'user-id',
    };

    expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(expected));
  });
});
