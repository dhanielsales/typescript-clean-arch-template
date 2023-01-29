import { NextFunction, Request, Response } from 'express';

import { Adapter } from '@shared/protocols/adapter';
import { ExpressRequestAdapter } from './express-request-adapter';
import { HttpController } from '@presentation/protocols/http/controller';

export type ExpressController = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressControllerAdapter implements Adapter<HttpController, ExpressController> {
  public handle(controller: HttpController) {
    const handler = (request: Request, response: Response, next: NextFunction) => {
      const httpRequest = new ExpressRequestAdapter().handle(request);

      Promise.resolve(controller.handle(httpRequest))
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

          response.status(httpResponse.status).json(httpResponse.payload);
          next();
        })
        .catch((err) => {
          next(err);
        });
    };

    Object.defineProperty(handler, 'name', {
      value: controller.constructor.name,
      configurable: true,
    });

    return handler;
  }
}
