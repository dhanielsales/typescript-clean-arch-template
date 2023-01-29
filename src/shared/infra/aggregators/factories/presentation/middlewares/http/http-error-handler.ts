import { StaticImplements } from '@shared/utils/types/static-implements';
import { Factory } from '@shared/infra/protocols/factory';

import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';
import { HttpErrorHandler } from '@presentation/middlewares/http/http-error-handler';

@StaticImplements<Factory<HttpMiddleware>>()
export class HttpErrorHandlerFactory {
  static make(): HttpMiddleware {
    const logger = LogMediator.getInstance().handle();

    return new HttpErrorHandler(logger);
  }
}
