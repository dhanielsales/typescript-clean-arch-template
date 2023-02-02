import MockDate from 'mockdate';

import { HttpController } from './controller';
import { HttpRequest, HttpResponse } from '.';
import { BadRequestError } from '@shared/infra/aggregators/errors/bad-request-error';
import { HttpValidationSchema } from './validator';

class FakeController extends HttpController {
  protected async handle(_: HttpRequest): Promise<HttpResponse> {
    return {
      status: 204,
    };
  }
}

const makeSut = () => {
  const sut = new FakeController();

  return { sut };
};

describe('HttpController', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should throw BadRequestError if validator detect errors', async () => {
    const schema: HttpValidationSchema = {
      body: {
        required_field: {
          required: true,
          type: 'string',
        },
      },
    };

    const { sut } = makeSut();
    const result = sut.perform({ body: {} } as any, schema);

    await expect(result).rejects.toStrictEqual(new BadRequestError('Invalid fields'));
  });

  test('Should run without schema if schema are not inputed', async () => {
    const { sut } = makeSut();
    const response = await sut.perform({ body: {} } as any);

    expect(response).toStrictEqual({
      status: 204,
    });
  });
});
