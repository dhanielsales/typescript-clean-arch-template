import { Express } from 'express';
import { Adapter } from '@shared/protocols/adapter';

import { Route } from '@shared/protocols/route';
import { ExpressController, ExpressControllerAdapter } from './express-controller-adapter';
import { RouterAdapter } from '@shared/protocols/route';
import { HttpController, HttpMiddleware } from '@shared/protocols/http';
import { ExpressMiddlewareAdapter } from './express-middleware-adapter';

export class ExpressRouterAdapter implements RouterAdapter {
  public readonly basePath: string;
  private readonly router: Express;
  private readonly adapter: Adapter<HttpController, ExpressController>;

  constructor(router: Express, basePath: string = '/') {
    this.basePath = basePath;
    this.router = router;
    this.adapter = new ExpressControllerAdapter();
  }

  public handle(routes: Array<Route>) {
    for (const route of routes) {
      const middlewares = this.handleMiddlewares(route.middlewares);
      const postMiddlewares = this.handleMiddlewares(route.postMiddlewares);

      switch (route.method) {
        case 'GET':
          this.router.get(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'POST':
          this.router.post(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'PUT':
          this.router.put(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'PATCH':
          this.router.patch(
            route.path,
            ...middlewares,
            this.adapter.handle(route.handler),
            ...postMiddlewares,
          );
          break;
        case 'DELETE':
          this.router.delete(
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
  }

  private handleMiddlewares(middlewares: HttpMiddleware[] = []) {
    const adapter = new ExpressMiddlewareAdapter();

    return middlewares.map((middleware) => adapter.handle(middleware));
  }
}
