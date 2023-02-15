import MockDate from 'mockdate';
import { ZodHttpValidator } from './zod-http-validator';

describe('ZodHttpValidator', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should returns 'true' if inputed value on 'boolean' method inst a 'boolean'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().boolean(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'object' method inst a 'object'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().object(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'object' method is null", async () => {
    const input = null;

    const result = new ZodHttpValidator().object(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'object' method is an array", async () => {
    const input: any = [];

    const result = new ZodHttpValidator().object(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'array' method inst a 'array'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().array(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'string' method inst a 'string'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().string(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'email' method inst a 'email'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().email(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'datetime' method inst a 'datetime'", async () => {
    const input = 0;

    const result = new ZodHttpValidator().datetime(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'number' method inst a 'number'", async () => {
    const input = true;

    const result = new ZodHttpValidator().number(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'positive' method inst a 'positive'", async () => {
    const input = true;

    const result = new ZodHttpValidator().positive(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'negative' method inst a 'negative'", async () => {
    const input = true;

    const result = new ZodHttpValidator().negative(input);

    expect(result).toBe(true);
  });

  test("Should returns 'true' if inputed value on 'integer' method inst a 'integer'", async () => {
    const input = true;

    const result = new ZodHttpValidator().integer(input);

    expect(result).toBe(true);
  });
});
