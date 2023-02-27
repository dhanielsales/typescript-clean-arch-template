import express, { Express, Router } from 'express';
import { Server } from 'http';

import { ExpressRouterAdapter } from '@shared/infra/adapters/http/express-router-adapter';
import { ExpressErrorMiddlewareAdapter } from '@shared/infra/adapters/http/express-error-middleware-adapter';
import { HttpErrorHandlerFactory } from '@shared/infra/aggregators/factories/presentation/middlewares/http/http-error-handler';
import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '../mediators/log-mediator';
import { Main } from '@presentation/entries/http/routes';

import expressPrintRoutes from '@shared/utils/express-print-routes';

import { Provider } from './service-setup';

export class HttpServerProvider implements Provider {
  private static instance: HttpServerProvider;
  private server?: Server;
  private readonly creator: Express;
  private readonly logger: Logger;

  private constructor() {
    this.creator = express();
    this.logger = LogMediator.getInstance().handle();
  }

  public static getInstance(): HttpServerProvider {
    if (!HttpServerProvider.instance) {
      HttpServerProvider.instance = new HttpServerProvider();
    }

    return HttpServerProvider.instance;
  }

  public async start(): Promise<void> {
    this.setupBaseMiddlewares();
    this.setupRouters();
    this.setupErrorHandler();

    const port = process.env.HTTP_SERVER_PORT;

    this.server = await new Promise<Server>((resolve) => {
      const server = this.creator.listen(port, () => {
        resolve(server);
        this.logger.info({ message: `Http Server running at ${port}` });
      });
    });
  }

  public async stop(): Promise<void> {
    if (this.server) {
      return await new Promise<void>((resolve) => {
        this.server?.close((err: unknown) => {
          if (err) {
            this.logger.info({ message: 'Http Server closed with error', stack: err as Error });
            throw err;
          }
          resolve();
          this.logger.info({ message: 'Http Server closed with success' });
        });
      });
    } else {
      this.logger.info({ message: 'There is no http server to close' });
    }
  }

  private setupRouters(): void {
    const baseGroup = Router();
    const adapter = new ExpressRouterAdapter(baseGroup);

    for (const group of Main.groups) {
      adapter.handle(group);
    }

    this.creator.use(Main.baseUrl, baseGroup);

    // To print on console all routes
    if (process.env.DEBUG_ROUTES === 'true') {
      expressPrintRoutes(this.creator._router.stack);
    }
  }

  private setupBaseMiddlewares(): void {
    this.creator.use(express.json());
  }

  private setupErrorHandler(): void {
    const adapter = new ExpressErrorMiddlewareAdapter();
    this.creator.use(adapter.handle(HttpErrorHandlerFactory.make()));
  }
}
