import { Router } from 'express';

import { Adapter } from '@shared/infra/protocols/adapter';

import { ExpressController, ExpressControllerAdapter } from './express-controller-adapter';
import { ExpressMiddleware, ExpressMiddlewareAdapter } from './express-middleware-adapter';

import { RouteGroup, RouterAdapter } from '@presentation/protocols/http/route';
import { HttpController } from '@presentation/protocols/http/controller';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';

export class ExpressRouterAdapter implements RouterAdapter {
  public readonly basePath: string;
  private readonly router: Router;
  private readonly adapter: Adapter<HttpController, ExpressController>;

  constructor(router: Router, basePath: string = '/') {
    this.basePath = basePath;
    this.router = router;
    this.adapter = new ExpressControllerAdapter();
  }

  public handle(group: RouteGroup): void {
    const expressGroup = Router();

    const groupMiddlewares = this.handleMiddlewares(group.middlewares);
    if (groupMiddlewares.length > 0) {
      expressGroup.use(...groupMiddlewares);
    }

    for (const route of group.routes) {
      const { method, path, schema, handler } = route;

      const middlewares = this.handleMiddlewares(route.middlewares);
      const postMiddlewares = this.handleMiddlewares(route.postMiddlewares);

      const adaptedHandler = this.adapter.handle(handler, schema);

      switch (method) {
        case 'GET':
          expressGroup.get(path, ...middlewares, adaptedHandler, ...postMiddlewares);
          break;
        case 'POST':
          expressGroup.post(path, ...middlewares, adaptedHandler, ...postMiddlewares);
          break;
        case 'PUT':
          expressGroup.put(path, ...middlewares, adaptedHandler, ...postMiddlewares);
          break;
        case 'PATCH':
          expressGroup.patch(path, ...middlewares, adaptedHandler, ...postMiddlewares);
          break;
        case 'DELETE':
          expressGroup.delete(path, ...middlewares, adaptedHandler, ...postMiddlewares);
          break;
        default:
          throw new Error('Route method not supported');
      }
    }

    const groupPostMiddlewares = this.handleMiddlewares(group.postMiddlewares);
    if (groupPostMiddlewares.length > 0) {
      expressGroup.use(...groupPostMiddlewares);
    }

    this.router.use(group.prefix, expressGroup);
  }

  private handleMiddlewares(middlewares: HttpMiddleware[] = []): ExpressMiddleware[] {
    const adapter = new ExpressMiddlewareAdapter();

    return middlewares.map((middleware) => adapter.handle(middleware));
  }
}
