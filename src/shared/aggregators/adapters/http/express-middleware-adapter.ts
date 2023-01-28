import { NextFunction, Request, Response } from 'express';

import { HttpMiddleware } from '@shared/protocols/http/middleware';
import { Adapter } from '@shared/protocols/adapter';

import { ExpressRequestAdapter } from './express-request-adapter';

export type ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressMiddlewareAdapter implements Adapter<HttpMiddleware, ExpressMiddleware> {
  public handle(middleware: HttpMiddleware) {
    const handler = (request: Request, response: Response, next: NextFunction) => {
      const httpRequest = new ExpressRequestAdapter().handle(request);

      Promise.resolve(middleware.handle(httpRequest))
        .then((httpResponse) => {
          if (httpResponse.headers) {
            for (const key in httpResponse.headers) {
              const value = httpResponse.headers[key];
              response.setHeader(key, value);
            }
          }

          Object.assign(request, {
            userId: request.userId,
            previewResponseHandler: httpResponse,
          });

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
