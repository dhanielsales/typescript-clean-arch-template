import { HttpResponse } from '@shared/protocols/http';

declare module 'express' {
  interface Request {
    previousHandlerResponse?: HttpResponse;
    userId?: string;
  }
}
