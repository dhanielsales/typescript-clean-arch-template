import { HttpMiddleware } from '@shared/protocols/http';

import { StaticImplements } from '@shared/utils/types/static-implements';
import { Factory } from '@shared/protocols/factory';
import { HttpErrorHandler } from '@presentation/middlewares/http-error-handler';
import { LogMediator } from '@shared/aggregators/mediators/log-mediator';

@StaticImplements<Factory<HttpMiddleware>>()
export class HttpErrorHandlerFactory {
  static make(): HttpMiddleware {
    const logger = new LogMediator().handle();

    return new HttpErrorHandler(logger);
  }
}
