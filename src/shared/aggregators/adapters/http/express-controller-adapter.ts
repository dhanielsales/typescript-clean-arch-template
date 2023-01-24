import { NextFunction, Request, Response } from 'express';

import { HttpController } from '@shared/protocols/http';
import { Adapter } from '@shared/protocols/adapter';
import { ExpressRequestAdapter } from './express-request-adapter';

export type ExpressController = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressControllerAdapter implements Adapter<HttpController, ExpressController> {
  public handle(controller: HttpController) {
    return (request: Request, response: Response, next: NextFunction) => {
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
            accountId: request.accountId,
            previewResponseHandler: httpResponse,
          });

          response.status(httpResponse.status).json(httpResponse.payload);
          next();
        })
        .catch((err) => {
          next(err);
        });
    };
  }
}
