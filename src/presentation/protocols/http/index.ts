export interface HttpRequest<Body = any, Query = any, Params = any> {
  header(name: string): string | string[] | undefined;
  url: string;
  body: Body;
  query: Query;
  params: Params;
  cookies: any;
  previewResponseHandler?: HttpResponse;
  userId?: string;
}

export interface HttpResponse {
  status: number;
  payload?: any;
  headers?: { [key: string]: string | string[] };
}
