import { HttpRequest, HttpResponse } from '.';

export interface HttpController {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
