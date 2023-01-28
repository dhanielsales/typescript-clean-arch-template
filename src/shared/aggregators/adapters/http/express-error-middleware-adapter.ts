import { NextFunction, Request, Response } from 'express';

import { HttpMiddleware } from '@shared/protocols/http/middleware';
import { Adapter } from '@shared/protocols/adapter';
import { ExpressRequestAdapter } from './express-request-adapter';

export type ExpressErrorMiddleware = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

export class ExpressErrorMiddlewareAdapter
  implements Adapter<HttpMiddleware, ExpressErrorMiddleware>
{
  public handle(middleware: HttpMiddleware) {
    const handler = (error: any, request: Request, response: Response, _next: NextFunction) => {
      const httpRequest = new ExpressRequestAdapter().handle(request);

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
