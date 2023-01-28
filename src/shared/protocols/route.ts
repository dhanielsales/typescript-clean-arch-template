import { HttpMiddleware } from './http/middleware';
import { HttpController } from './http/controller';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteGroup {
  prefix: string;
  routes: Route[];
  middlewares?: HttpMiddleware[];
  postMiddlewares?: HttpMiddleware[];
}

export interface Route {
  method: HttpMethods;
  path: string;
  handler: HttpController;
  middlewares?: HttpMiddleware[];
  postMiddlewares?: HttpMiddleware[];
}

export interface RouterAdapter {
  handle(group: RouteGroup): void;
}
