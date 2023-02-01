import MockDate from 'mockdate';
import { BaseError } from './base-error';

describe('BaseError', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should have 'description' attr with inputed same 'message' value if 'description' are not inputed", async () => {
    const result = new BaseError({
      name: 'BadRequestError',
      message: 'Foo message',
    });

    expect(result.description).toBe('Foo message');
  });

  test("Should have 'description' attr with inputed value if 'description' are inputed", async () => {
    const result = new BaseError({
      name: 'BadRequestError',
      message: 'Foo message',
      description: 'Foo description',
    });

    expect(result.description).toBe('Foo description');
  });
});
