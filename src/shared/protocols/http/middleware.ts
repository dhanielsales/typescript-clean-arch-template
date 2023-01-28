import { HttpRequest, HttpResponse } from '.';

export interface HttpMiddleware {
  handle(request: HttpRequest, error?: Error): Promise<HttpResponse>;
}
