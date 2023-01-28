import { HttpRequest, HttpResponse } from '.';
import { Validator } from '../validator';

export abstract class HttpController {
  constructor(protected readonly validation?: Validator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (this.validation) {
      this.validation.validate(httpRequest);
    }

    return await this.perform(httpRequest);
  }

  protected abstract perform(httpRequest: HttpRequest): Promise<HttpResponse>;
}
