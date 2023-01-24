import { Request } from 'express';

import { HttpRequest } from '@shared/protocols/http';
import { Adapter } from '@shared/protocols/adapter';

export class ExpressRequestAdapter implements Adapter<Request, HttpRequest> {
  public handle(expressRequest: Request): HttpRequest {
    const httpRequest: HttpRequest = {
      header: expressRequest.header,
      url: expressRequest.url,
      body: expressRequest.body,
      cookies: expressRequest.cookies,
      params: expressRequest.params,
      query: expressRequest.query,
      previewResponseHandler: expressRequest.previewResponseHandler,
      userId: expressRequest.userId,
    };

    return httpRequest;
  }
}
