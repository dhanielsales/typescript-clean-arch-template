import { NextFunction, Request, Response } from 'express';

import { HttpValidationSchema } from '@presentation/protocols/http/validator';
import { HttpController } from '@presentation/protocols/http/controller';
import { ExpressRequestAdapter } from './express-request-adapter';
import { Adapter } from '@shared/infra/protocols/adapter';

export type ExpressController = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressControllerAdapter implements Adapter<HttpController, ExpressController> {
  public handle(controller: HttpController, schema?: HttpValidationSchema): ExpressController {
    const handler = (request: Request, response: Response, next: NextFunction): void => {
      const httpRequest = new ExpressRequestAdapter().handle(
        request,
        response.locals.previousHandlerResponse,
      );

      Promise.resolve(controller.perform(httpRequest, schema))
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
