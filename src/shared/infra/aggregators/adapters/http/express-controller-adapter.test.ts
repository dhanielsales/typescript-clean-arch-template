import MockDate from 'mockdate';
import supertest from 'supertest';
import express from 'express';

import { HttpController } from '@presentation/protocols/http/controller';

import { ExpressControllerAdapter } from './express-controller-adapter';
import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { UnprocessableEntityError } from '../../errors/unprocessable-entity-error';

describe('ExpressControllerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns the same status code and body from returned value in HttpController', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();

    expressApp.get('/api/test', expressController);

    const response = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the same headers from returned value in HttpController', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 204,
          headers: {
            'foo-heander': 'foo-value',
          },
        };
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();

    expressApp.get('/api/test', expressController);

    const response = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(204);
    expect(response.body).toStrictEqual({});
    expect(response.headers['foo-heander']).toBe('foo-value');
  });

  test('Should returns the status code 500 if any error are throwed in controller', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new UnprocessableEntityError();
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();

    expressApp.get('/api/test', expressController);

    const response = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(500);
    expect(response.body).toStrictEqual({});
  });
});
