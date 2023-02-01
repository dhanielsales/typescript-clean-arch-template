import MockDate from 'mockdate';

import { HttpValidationSchema } from '@presentation/protocols/http/validator';
import { BadRequestError } from '@shared/infra/aggregators/errors/bad-request-error';

import { ZodHttpValidator } from '@shared/infra/aggregators/adapters/validators/zod-http-validator';
jest.mock('@shared/infra/aggregators/adapters/validators/zod-http-validator');

import { getClassMock } from '@shared/utils/mocks/get-class-mock';
import { HttpValidator } from './http-validator';

const makeSut = (schema: HttpValidationSchema) => {
  const zodHttpValidatorMock = getClassMock<ZodHttpValidator>(ZodHttpValidator);
  const sut = new HttpValidator(schema, zodHttpValidatorMock);

  return {
    zodHttpValidatorMock,
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: {} } as any)).toThrowError(
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: {} } as any)).not.toThrow();
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

    const { sut } = makeSut(schema);

    expect(() =>
      sut.validate({ params: { any_param: 'any_value' }, body: {} } as any),
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: { any_body_field: 'any_value' } } as any)).not.toThrow();
  });

  test('Should succeed if non exists rule to field in the schema', async () => {
    const schema: HttpValidationSchema = {};

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: { any_body_field: 'any_value' } } as any)).not.toThrow();
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);

    jest.spyOn(zodHttpValidatorMock, 'string').mockReturnValue(true);

    expect(() => sut.validate({ body: { required_field: 123 } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);

    jest.spyOn(zodHttpValidatorMock, 'number').mockReturnValue(true);

    expect(() => sut.validate({ body: { number_field: 'number' } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'boolean').mockReturnValue(true);

    expect(() => sut.validate({ body: { boolean_field: 'boolean' } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'email').mockReturnValue(true);

    expect(() => sut.validate({ body: { email_field: 'non-valid-email' } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'object').mockReturnValue(true);

    expect(() => sut.validate({ body: { object_field: 'object' } } as any)).toThrow(
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: { object_field: { another: 'another' } } } as any)).toThrow(
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({} as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'array').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: 'array' } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'number').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: ['another'] } } as any)).toThrow(
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

    const { sut, zodHttpValidatorMock } = makeSut(schema);
    jest.spyOn(zodHttpValidatorMock, 'object').mockReturnValue(true);

    expect(() => sut.validate({ body: { array_field: ['another'] } } as any)).toThrow(
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

    const { sut } = makeSut(schema);

    expect(() => sut.validate({ body: { array_field: [{ another: 'another' }] } } as any)).toThrow(
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

    const { sut } = makeSut(schema);

    expect(() =>
      sut.validate({ body: { array_field: [{ another: 'another' }] } } as any),
    ).not.toThrow();
  });
});
