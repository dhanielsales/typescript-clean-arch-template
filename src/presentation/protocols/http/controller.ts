import { HttpValidatorFactory } from '@shared/infra/aggregators/factories/implements/http-validator';
import { HttpRequest, HttpResponse } from '.';
import { HttpValidationSchema } from './validator';

export abstract class HttpController {
  async perform(httpRequest: HttpRequest, schema?: HttpValidationSchema): Promise<HttpResponse> {
    if (schema) {
      const validator = HttpValidatorFactory.make();
      validator.validate(httpRequest, schema);
    }

    return await this.handle(httpRequest);
  }

  protected abstract handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
