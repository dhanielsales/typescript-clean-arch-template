import { HttpResponse } from '@shared/protocols/http';

declare module 'express' {
  interface Request {
    previewResponseHandler?: HttpResponse;
    userId?: string;
  }
}
