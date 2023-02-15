import { NextFunction, Request, Response } from 'express';

import { Adapter } from '@shared/infra/protocols/adapter';
import { ExpressRequestAdapter } from './express-request-adapter';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';

export type ExpressErrorMiddleware = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

export class ExpressErrorMiddlewareAdapter
  implements Adapter<HttpMiddleware, ExpressErrorMiddleware>
{
  public handle(middleware: HttpMiddleware): ExpressErrorMiddleware {
    const handler = (
      error: any,
      request: Request,
      response: Response,
      _next: NextFunction,
    ): void => {
      const httpRequest = new ExpressRequestAdapter().handle(
        request,
        response.locals.previousHandlerResponse,
      );

      Promise.resolve(middleware.handle(httpRequest, error))
        .then((httpResponse) => {
          if (httpResponse.headers) {
            for (const key in httpResponse.headers) {
              const value = httpResponse.headers[key];
              response.setHeader(key, value);
            }
          }

          response.status(httpResponse.status).json({ error: httpResponse.payload });
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
