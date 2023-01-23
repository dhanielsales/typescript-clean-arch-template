import { BaseError } from '@shared/aggregators/errors/base-error';
import { Logger } from '@shared/protocols/log';
import { HttpMiddleware, HttpResponse, HttpRequest } from '@shared/protocols/http';
import { ServerError } from '@shared/aggregators/errors/server-error';
import { StatusCode } from '@shared/aggregators/errors/error-names';

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
