import { Request } from 'express';

import { Adapter } from '@shared/infra/protocols/adapter';
import { HttpRequest, HttpResponse } from '@presentation/protocols/http';

export class ExpressRequestAdapter implements Adapter<Request, HttpRequest> {
  public handle(expressRequest: Request, previousHandlerResponse: HttpResponse): HttpRequest {
    const httpRequest: HttpRequest = {
      header: expressRequest.header,
      url: expressRequest.url,
      body: expressRequest.body,
      cookies: expressRequest.cookies,
      params: expressRequest.params,
      query: expressRequest.query,
      previousHandlerResponse,
      userId: expressRequest.userId,
    };

    return httpRequest;
  }
}
