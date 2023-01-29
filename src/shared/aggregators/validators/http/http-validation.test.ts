import MockDate from 'mockdate';
import { HttpValidation } from '.';

describe('HttpValidation.constraintsHasField', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns false if inputed value inst a constraints', async () => {
    const object: any = '';

    const result = HttpValidation.constraintsHasField(object, 'itemType');

    expect(result).toBe(false);
  });

  test('Should returns false if field not exists on object', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      required: true,
      type: 'string',
    };

    const result = HttpValidation.constraintsHasField(object, 'itemType');

    expect(result).toBe(false);
  });

  test('Should returns true if field exists on object', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      required: true,
      type: 'array',
      itemType: 'string',
    };

    const result = HttpValidation.constraintsHasField(object, 'itemType');

    expect(result).toBe(true);
  });
});

describe('HttpValidation.constraintsHasType', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns false if inputed value inst a constraints', async () => {
    const object: any = '';

    const result = HttpValidation.constraintsHasType(object, 'string');

    expect(result).toBe(false);
  });

  test('Should returns false if constraint type field isnt the same on input', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      required: true,
      type: 'string',
    };

    const result = HttpValidation.constraintsHasType(object, 'boolean');

    expect(result).toBe(false);
  });

  test('Should returns true if constraint type field is the same on input', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      required: true,
      type: 'string',
    };

    const result = HttpValidation.constraintsHasType(object, 'string');

    expect(result).toBe(true);
  });
});

describe('HttpValidation.isConstraints', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns false if inputed value inst a object', async () => {
    const object: any = '';

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint havent type field', async () => {
    const object: any = {
      required: true,
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint havent required field', async () => {
    const object: any = {
      type: 'string',
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint type field isnt string', async () => {
    const object: any = {
      type: 123,
      required: true,
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint required field isnt boolean', async () => {
    const object: any = {
      type: 'string',
      required: 'true',
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint have itemType field but isnt array', async () => {
    const object: any = {
      type: 'string',
      required: true,
      itemType: 'string',
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(false);
  });

  test('Should returns true if constraint itemType field isnt primitive type', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      type: 'array',
      required: true,
      itemType: {
        nested: {
          required: true,
          type: 'string',
        },
      },
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(true);
  });

  test('Should returns true if constraint itemType field is primitive type', async () => {
    const object: HttpValidation.Constraints<any, any> = {
      type: 'array',
      required: true,
      itemType: 'string',
    };

    const result = HttpValidation.isConstraints(object);

    expect(result).toBe(true);
  });
});

describe('HttpValidation.isFields', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns false if inputed value inst a object', async () => {
    const object: any = '';

    const result = HttpValidation.isFields(object);

    expect(result).toBe(false);
  });

  test('Should returns false if constraint in some field is invalid', async () => {
    const object: any = {
      object: {
        required: 'true',
        type: 'string',
      },
    };

    const result = HttpValidation.isFields(object);

    expect(result).toBe(false);
  });

  test('Should returns false if inputed object is empty', async () => {
    const object: any = {};

    const result = HttpValidation.isFields(object);

    expect(result).toBe(false);
  });
});
