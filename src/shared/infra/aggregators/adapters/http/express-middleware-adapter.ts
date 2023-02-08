import { NextFunction, Request, Response } from 'express';

import { Adapter } from '@shared/infra/protocols/adapter';

import { ExpressRequestAdapter } from './express-request-adapter';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';

export type ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressMiddlewareAdapter implements Adapter<HttpMiddleware, ExpressMiddleware> {
  public handle(middleware: HttpMiddleware): ExpressMiddleware {
    const handler = (request: Request, response: Response, next: NextFunction): void => {
      const httpRequest = new ExpressRequestAdapter().handle(
        request,
        response.locals.previousHandlerResponse,
      );

      Promise.resolve(middleware.handle(httpRequest))
        .then((httpResponse) => {
          if (httpResponse.headers) {
            for (const key in httpResponse.headers) {
              const value = httpResponse.headers[key];
              response.setHeader(key, value);
            }
          }

          response.locals = {
            ...response.locals,
            userId: request.userId,
            previousHandlerResponse: httpResponse,
          };

          next();
        })
        .catch((err) => {
          response.status(500).json({ error: err.message });
        });
    };

    Object.defineProperty(handler, 'name', {
      value: middleware.constructor.name,
      configurable: true,
    });

    return handler;
  }
}
