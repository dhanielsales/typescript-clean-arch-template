import { Router } from 'express';
import { Adapter } from '@shared/protocols/adapter';

import { ExpressController, ExpressControllerAdapter } from './express-controller-adapter';
import { RouteGroup, RouterAdapter } from '@shared/protocols/route';
import { HttpController, HttpMiddleware } from '@shared/protocols/http';
import { ExpressMiddlewareAdapter } from './express-middleware-adapter';

export class ExpressRouterAdapter implements RouterAdapter {
  public readonly basePath: string;
  private readonly router: Router;
  private readonly adapter: Adapter<HttpController, ExpressController>;

  constructor(router: Router, basePath: string = '/') {
    this.basePath = basePath;
    this.router = router;
    this.adapter = new ExpressControllerAdapter();
  }

  public handle(group: RouteGroup) {
    const expressGroup = Router();

    const groupMiddlewares = this.handleMiddlewares(group.middlewares);
    if (groupMiddlewares.length > 0) {
      expressGroup.use(...groupMiddlewares);
    }

    for (const route of group.routes) {
      const middlewares = this.handleMiddlewares(route.middlewares);
      const postMiddlewares = this.handleMiddlewares(route.postMiddlewares);

      switch (route.method) {
        case 'GET':
          expressGroup.get(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'POST':
          expressGroup.post(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'PUT':
          expressGroup.put(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'PATCH':
          expressGroup.patch(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'DELETE':
          expressGroup.delete(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
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

  private handleMiddlewares(middlewares: HttpMiddleware[] = []) {
    const adapter = new ExpressMiddlewareAdapter();

    return middlewares.map((middleware) => adapter.handle(middleware));
  }
}
