import express, { Express, Router } from 'express';
import { Server } from 'http';

import { ExpressRouterAdapter } from '@shared/aggregators/adapters/http/express-router-adapter';
import { ExpressErrorMiddlewareAdapter } from '@shared/aggregators/adapters/http/express-error-middleware-adapter';
import { HttpErrorHandlerFactory } from '@shared/aggregators/factories/presentation/middlewares/http/http-error-handler';

import mainGroup from '@shared/infra/http/routes';

export class HttpServer {
  private static instance: HttpServer;
  private readonly creator: Express;
  private server?: Server;

  private constructor() {
    this.creator = express();
  }

  public static getInstance(): HttpServer {
    if (!HttpServer.instance) {
      HttpServer.instance = new HttpServer();
    }

    return HttpServer.instance;
  }

  public start(): void {
    this.setupBaseMiddlewares();
    this.setupRouters();
    this.setupErrorHandler();

    const port = process.env.USER_SERVICE_HTTP_SERVER_PORT;

    this.server = this.creator.listen(port, () => {
      console.log(`Http Server running at ${port}`);
    });
  }

  public async close(): Promise<void> {
    if (this.server) {
      return await new Promise<void>((resolve, _) => {
        this.server?.close((err: unknown) => {
          if (err) {
            const error: string = JSON.stringify(err);
            console.log(`Http Server closed with error: ${error}`);
            throw err;
          }
          resolve();
          console.log('Http Server closed with success');
        });
      });
    } else {
      console.log('There is no http server to close');
    }
  }

  private setupRouters(): void {
    const baseGroup = Router();
    const adapter = new ExpressRouterAdapter(baseGroup);

    for (const group of mainGroup.groups) {
      adapter.handle(group);
    }

    this.creator.use(mainGroup.baseUrl, baseGroup);

    // To print on console all routes
    // expressPrintRoutes(this.creator._router.stack);
  }

  private setupBaseMiddlewares(): void {
    this.creator.use(express.json());
  }

  private setupErrorHandler(): void {
    const adapter = new ExpressErrorMiddlewareAdapter();
    this.creator.use(adapter.handle(HttpErrorHandlerFactory.make()));
  }
}
