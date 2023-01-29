import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '../mediators/log-mediator';
import { EventProvider } from './event-provider';
import { HttpServer } from './http-server';

export enum ExitStatus {
  Failure = 1,
  Success = 0,
}

interface Params {
  httpServer: HttpServer;
  eventProvider: EventProvider;
}

export class HealthSetup {
  private readonly signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGUSR2'];
  private readonly httpServer: HttpServer;
  private readonly eventProvider: EventProvider;
  private readonly logger: Logger;

  constructor(params: Params) {
    this.httpServer = params.httpServer;
    this.eventProvider = params.eventProvider;
    this.logger = LogMediator.getInstance().handle();
  }

  public async start(): Promise<void> {
    this.setup();

    this.httpServer.start();
    await this.eventProvider.start();
  }

  private setup(): void {
    this.setupUnhandledRejection();
    this.setupUncaughtException();

    for (const signal of this.signals) {
      process.once(signal, async (): Promise<void> => {
        try {
          await this.httpServer.close();
          await this.eventProvider.close();

          this.logger.info({ message: 'Application closed with success' });
          process.exit(ExitStatus.Success);
        } catch (err) {
          this.logger.error({ message: 'Application closed with error', stack: err as Error });
          process.exit(ExitStatus.Failure);
        }
      });
    }
  }

  private setupUnhandledRejection(): void {
    process.on('unhandledRejection', (error: any, promise) => {
      this.logger.error({
        message: `Application closed with unhandled promise. Promise: ${JSON.stringify(promise)}`,
        stack: error,
      });
      process.exit(ExitStatus.Failure);
    });
  }

  private setupUncaughtException(): void {
    process.on('uncaughtException', (error) => {
      this.logger.error({
        message: 'Application closed with uncaught exception.',
        stack: error,
      });
      process.exit(ExitStatus.Failure);
    });
  }
}
