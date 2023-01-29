import { BaseError } from '@shared/infra/aggregators/errors/base-error';
import { ServerError } from '@shared/infra/aggregators/errors/server-error';
import { StatusCode } from '@shared/infra/aggregators/errors/error-names';
import { HttpMiddleware } from '@presentation/protocols/http/middleware';
import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { Logger } from '@shared/infra/protocols/log';

export class HttpErrorHandler implements HttpMiddleware {
  constructor(private readonly logger: Logger) {}

  async handle(_request: HttpRequest, error?: Error): Promise<HttpResponse> {
    if (!error) {
      throw new Error('http error handler processing without error');
    }

    if (error instanceof BaseError) {
      return {
        status: StatusCode[error.name],
        payload: error,
      };
    }

    this.logger.error({ message: error.message, stack: error });

    return {
      status: 500,
      payload: new ServerError(),
    };
  }
}
