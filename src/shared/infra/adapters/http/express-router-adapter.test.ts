import MockDate from 'mockdate';
import supertest from 'supertest';
import express, { Router } from 'express';

import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { HttpController } from '@presentation/protocols/http/controller';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';
import { RouteGroup } from '@presentation/protocols/http/route';

import { ExpressRouterAdapter } from './express-router-adapter';

describe('ExpressRouterAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should returns the result of the controller in router adapter flow on GET route', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'GET',
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the result of the controller in router adapter flow on POST route', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'POST',
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).post('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the result of the controller in router adapter flow on PATCH route', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'PATCH',
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).patch('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the result of the controller in router adapter flow on PUT route', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'PUT',
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).put('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the result of the controller in router adapter flow on DELETE route', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'DELETE',
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).delete('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });

  test('Should returns the status code 500 if invalid http method are inputed in router adapter flow', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'FOO' as any,
          handler: controller,
        },
      ],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);

    expect(() => adapter.handle(routeGroup)).toThrow(new Error('Route method not supported'));
  });

  test('Should returns the same headers from returned value in HttpMiddleware in router adapter flow', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

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

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'GET',
          handler: controller,
        },
      ],
      middlewares: [middleware],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
    expect(response.headers['foo-heander']).toBe('foo-value');
  });

  test('Should process correct post request HttpMiddleware in router adapter flow', async () => {
    const controller = new (class extends HttpController {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'payload',
        };
      }
    })();

    const middleware = new (class implements HttpMiddleware {
      public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return {
          status: 200,
          payload: 'middlware',
        };
      }
    })();

    const routeGroup: RouteGroup = {
      prefix: '/test',
      routes: [
        {
          path: '/',
          method: 'GET',
          handler: controller,
        },
      ],
      postMiddlewares: [middleware],
    };

    const expressGroup = Router();
    const adapter = new ExpressRouterAdapter(expressGroup);
    adapter.handle(routeGroup);

    const expressApp = express();
    expressApp.use('/api', expressGroup);

    const response: any = await supertest(expressApp).get('/api/test');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBe('payload');
  });
});
