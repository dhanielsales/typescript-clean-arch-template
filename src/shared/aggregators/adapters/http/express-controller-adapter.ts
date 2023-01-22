import { NextFunction, Request, Response } from 'express';

import { HttpController, HttpRequest } from '@shared/protocols/http';
import { ControllerAdapter } from '@shared/protocols/controller';

export type ExpressController = (request: Request, response: Response, next: NextFunction) => void;

export class ExpressControllerAdapter
  implements ControllerAdapter<HttpController, ExpressController>
{
  public handle(controller: HttpController) {
    return (request: Request, response: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        header: request.header,
        url: request.url,
        body: request.body,
        cookies: request.cookies,
        params: request.params,
        query: request.query,
      };

      Promise.resolve(controller.handle(httpRequest))
        .then((httpResponse) => {
          if (httpResponse.headers) {
            for (const key in httpResponse.headers) {
              const value = httpResponse.headers[key];
              response.setHeader(key, value);
            }
          }

          response.status(httpResponse.status).json(httpResponse.payload);
          next();
        })
        .catch((err) => {
          next(err);
        });
    };
  }
}
