import MockDate from 'mockdate';
import supertest from 'supertest';
import express from 'express';

import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';
import { HttpController } from '@presentation/protocols/http/controller';

import { ExpressMiddlewareAdapter } from './express-middleware-adapter';
import { ExpressControllerAdapter } from './express-controller-adapter';
import { UnprocessableEntityError } from '../../errors/unprocessable-entity-error';

describe('ExpressMiddlewareAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns the result of the previous handler in previousHandlerResponse key', async () => {
    const middleware = new (class implements HttpMiddleware {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'middlware',
        };
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const expressMiddleware = new ExpressMiddlewareAdapter().handle(middleware);
    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();

    expressApp.get('/api/test', expressMiddleware, expressController);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the same headers from returned value in HttpController', async () => {
    const middleware = new (class implements HttpMiddleware {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'middlware',
          headers: {
            'foo-heander': 'foo-value',
          },
        };
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 204,
        };
      }
    })();

    const expressMiddleware = new ExpressMiddlewareAdapter().handle(middleware);
    const expressController = new ExpressControllerAdapter().handle(controller);
    const expressApp = express();

    expressApp.get('/api/test', expressMiddleware, expressController);

    const response = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(204);
    expect(response.body).toStrictEqual({});
    expect(response.headers['foo-heander']).toBe('foo-value');
  });

  test('Should returns the status code 500 if any error are throwed in controller', async () => {
    const middleware = new (class implements HttpMiddleware {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new UnprocessableEntityError();
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
        };
      }
    })();

    const expressMiddleware = new ExpressMiddlewareAdapter().handle(middleware);
    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();

    expressApp.get('/api/test', expressMiddleware, expressController);

    const response = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(500);
    expect(response.body).toStrictEqual({ error: 'Unprocessable' });
  });
});
