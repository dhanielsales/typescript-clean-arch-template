import MockDate from 'mockdate';
import supertest from 'supertest';
import express from 'express';

import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';
import { HttpController } from '@presentation/protocols/http/controller';
import { UnprocessableEntityError } from '@shared/infra/aggregators/errors/unprocessable-entity-error';

import { ExpressErrorMiddlewareAdapter } from './express-error-middleware-adapter';
import { ExpressControllerAdapter } from './express-controller-adapter';

describe('ExpressErrorMiddlewareAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns the result of the controller if have no errors in controller flow', async () => {
    const middleware = new (class implements HttpMiddleware {
      async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 422,
          payload: new UnprocessableEntityError(),
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

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();
    expressApp.get('/api/test', expressController);

    const expressErrorMiddleware = new ExpressErrorMiddlewareAdapter().handle(middleware);
    expressApp.use(expressErrorMiddleware);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the error from error middleware if controller throws some error', async () => {
    const middleware = new (class implements HttpMiddleware {
      async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 422,
          payload: new UnprocessableEntityError(),
        };
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new Error('Any error');
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();
    expressApp.get('/api/test', expressController);

    const expressErrorMiddleware = new ExpressErrorMiddlewareAdapter().handle(middleware);
    expressApp.use(expressErrorMiddleware);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(422);
    expect(response.body).toStrictEqual({
      error: { description: 'Unprocessable', name: 'UnprocessableEntityError' },
    });
  });

  test('Should returns the error from error middleware if controller throws some error but with http headers defined on error middleware', async () => {
    const middleware = new (class implements HttpMiddleware {
      async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 422,
          payload: new UnprocessableEntityError(),
          headers: {
            'x-test': 'test',
          },
        };
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new Error('Any error');
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();
    expressApp.get('/api/test', expressController);

    const expressErrorMiddleware = new ExpressErrorMiddlewareAdapter().handle(middleware);
    expressApp.use(expressErrorMiddleware);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(422);
    expect(response.headers['x-test']).toBe('test');
    expect(response.body).toStrictEqual({
      error: { description: 'Unprocessable', name: 'UnprocessableEntityError' },
    });
  });

  test('Should returns the status code 500 if any error are throwed in middleware', async () => {
    const middleware = new (class implements HttpMiddleware {
      async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new Error('Any middleware error');
      }
    })();

    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        throw new Error('Any error');
      }
    })();

    const expressController = new ExpressControllerAdapter().handle(controller);

    const expressApp = express();
    expressApp.get('/api/test', expressController);

    const expressErrorMiddleware = new ExpressErrorMiddlewareAdapter().handle(middleware);
    expressApp.use(expressErrorMiddleware);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(500);
    expect(response.body).toStrictEqual({ error: 'Any middleware error' });
  });
});
