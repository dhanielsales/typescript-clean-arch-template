import MockDate from 'mockdate';

import { HttpValidationSchema, HttpValidatorsTypes } from '@presentation/protocols/http/validator';
import { BadRequestError } from '@shared/infra/aggregators/errors/bad-request-error';

import { ZodHttpValidator } from '@shared/infra/adapters/validators/zod-http-validator';
jest.mock('@shared/infra/adapters/validators/zod-http-validator');

import { getClassMock } from '@shared/utils/mocks/get-class-mock';
import { HttpValidator } from './http-validator';

const makeSut = () => {
  const validatorsTypes = getClassMock<HttpValidatorsTypes>(ZodHttpValidator);
  const sut = new HttpValidator(validatorsTypes);

  return {
    validatorsTypes,
    sut,
  };
};

describe('HttpValidator General', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should throw BadRequestError if a required field is not inserted', async () => {
    const schema: HttpValidationSchema = {
      body: {
        required_field: {
          required: true,
          type: 'string',
        },
      },
    };

    const { sut } = makeSut();

    expect(() => sut.validate({ body: {} } as any, schema)).toThrowError(
      new BadRequestError('Invalid fields', {
        invalid: { body: { required_field: "Field 'required_field' is required." } },
      }),
    );
  });

  test('Should succeed if it no receives content in optional field', async () => {
    const schema: HttpValidationSchema = {
      body: {
        email_field: {
          required: false,
          type: 'email',
        },
      },
    };

    const { sut } = makeSut();

    expect(() => sut.validate({ body: {} } as any, schema)).not.toThrow();
  });

  test('Should succeed if it receives content in another context instead of what exists in the schema', async () => {
    const schema: HttpValidationSchema = {
      body: {
        email_field: {
          required: false,
          type: 'email',
        },
      },
    };

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ params: { any_param: 'any_value' }, body: {} } as any, schema),
    ).not.toThrow();
  });

  test('Should succeed if it receives content in field instead of what exists in the schema', async () => {
    const schema: HttpValidationSchema = {
      body: {
        email_field: {
          required: false,
          type: 'email',
        },
      },
    };

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ body: { any_body_field: 'any_value' } } as any, schema),
    ).not.toThrow();
  });

  test('Should succeed if non exists rule to field in the schema', async () => {
    const schema: HttpValidationSchema = {};

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ body: { any_body_field: 'any_value' } } as any, schema),
    ).not.toThrow();
  });
});

describe('HttpValidator Type Validation', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should throw BadRequestError if an string field receive another type instead of string', async () => {
    const schema: HttpValidationSchema = {
      body: {
        required_field: {
          required: false,
          type: 'string',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();

    jest.spyOn(validatorsTypes, 'string').mockReturnValue(true);

    expect(() => sut.validate({ body: { required_field: 123 } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            required_field:
              "Invalid type on field 'required_field', expected type 'string' but received 'number'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an number field receive another type instead of number', async () => {
    const schema: HttpValidationSchema = {
      body: {
        number_field: {
          required: false,
          type: 'number',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();

    jest.spyOn(validatorsTypes, 'number').mockReturnValue(true);

    expect(() => sut.validate({ body: { number_field: 'number' } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            number_field:
              "Invalid type on field 'number_field', expected type 'number' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an boolean field receive another type instead of boolean', async () => {
    const schema: HttpValidationSchema = {
      body: {
        boolean_field: {
          required: false,
          type: 'boolean',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'boolean').mockReturnValue(true);

    expect(() => sut.validate({ body: { boolean_field: 'boolean' } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            boolean_field:
              "Invalid type on field 'boolean_field', expected type 'boolean' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an email field receive another type instead of email', async () => {
    const schema: HttpValidationSchema = {
      body: {
        email_field: {
          required: false,
          type: 'email',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'email').mockReturnValue(true);

    expect(() => sut.validate({ body: { email_field: 'non-valid-email' } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            email_field:
              "Invalid type on field 'email_field', expected type 'email' but received 'string'.",
          },
        },
      }),
    );
  });
});

describe('HttpValidator Object Validation', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should throw BadRequestError if an object field receive another type instead of object', async () => {
    const schema: HttpValidationSchema = {
      body: {
        object_field: {
          required: false,
          type: 'object',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'object').mockReturnValue(true);

    expect(() => sut.validate({ body: { object_field: 'object' } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            object_field:
              "Invalid type on field 'object_field', expected type 'object' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an object field receive another object type instead of itemType', async () => {
    const schema: HttpValidationSchema = {
      body: {
        object_field: {
          required: false,
          type: 'object',
          itemType: {
            nested_field: {
              required: true,
              type: 'number',
            },
          },
        },
      },
    };

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ body: { object_field: { another: 'another' } } } as any, schema),
    ).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: { 'object_field.nested_field': "Field 'object_field.nested_field' is required." },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an object nested field non receive value', async () => {
    const schema: HttpValidationSchema = {
      body: {
        object_field: {
          required: true,
          type: 'object',
          itemType: {
            nested_field: {
              required: true,
              type: 'number',
            },
          },
        },
      },
    };

    const { sut } = makeSut();

    expect(() => sut.validate({} as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: { body: { object_field: "Field 'object_field' is required." } },
      }),
    );
  });
});

describe('HttpValidator Array Validation', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should throw BadRequestError if an array field receive another type instead of array', async () => {
    const schema: HttpValidationSchema = {
      body: {
        array_field: {
          required: false,
          type: 'array',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'array').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: 'array' } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            array_field:
              "Invalid type on field 'array_field', expected type 'array' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an array field with itemType receive another type instead of itemType', async () => {
    const schema: HttpValidationSchema = {
      body: {
        array_field: {
          required: false,
          type: 'array',
          itemType: 'number',
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'number').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: ['another'] } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            array_field:
              "Invalid type on field 'array_field', expected type 'number' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an array field with itemType object receive another primitive type instead of itemType', async () => {
    const schema: HttpValidationSchema = {
      body: {
        array_field: {
          required: false,
          type: 'array',
          itemType: {
            nested_field: {
              required: false,
              type: 'string',
            },
          },
        },
      },
    };

    const { sut, validatorsTypes } = makeSut();
    jest.spyOn(validatorsTypes, 'object').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: ['another'] } } as any, schema)).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: {
            array_field:
              "Invalid type on field 'array_field', expected type 'object' but received 'string'.",
          },
        },
      }),
    );
  });

  test('Should throw BadRequestError if an array field with itemType object receive another object type instead of itemType', async () => {
    const schema: HttpValidationSchema = {
      body: {
        array_field: {
          required: false,
          type: 'array',
          itemType: {
            nested_field: {
              required: true,
              type: 'string',
            },
          },
        },
      },
    };

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ body: { array_field: [{ another: 'another' }] } } as any, schema),
    ).toThrow(
      new BadRequestError('Invalid fields', {
        invalid: {
          body: { 'array_field.nested_field': "Field 'array_field.nested_field' is required." },
        },
      }),
    );
  });

  test('Should ByPass validateArray if itemType not exists in schema', async () => {
    const schema: any = {
      body: {
        array_field: {
          required: false,
          type: 'array',
        },
      },
    };

    const { sut } = makeSut();

    expect(() =>
      sut.validate({ body: { array_field: [{ another: 'another' }] } } as any, schema),
    ).not.toThrow();
  });
});
