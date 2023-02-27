import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';

export enum ExitStatus {
  Failure = 1,
  Success = 0,
}

export interface Provider {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class ServiceSetup {
  private readonly signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGUSR2'];
  private readonly logger: Logger = LogMediator.getInstance().handle();
  private readonly providers: Array<Provider> = [];

  public register(provider: Provider): void {
    this.providers.push(provider);
  }

  public async start(): Promise<void> {
    this.setup();

    for (const provider of this.providers) {
      await provider.start();
    }

    this.logger.info({ message: 'Application start with success 🚀' });
  }

  public async stop(): Promise<void> {
    for (const provider of [...this.providers].reverse()) {
      await provider.stop();
    }
  }

  private setup(): void {
    this.setupUnhandledRejection();
    this.setupUncaughtException();

    for (const signal of this.signals) {
      process.once(signal, () => {
        this.logger.info({ message: 'Stopping application...' });
        this.stop()
          .then(() => {
            this.logger.info({ message: 'Application closed with success' });
            process.exit(ExitStatus.Success);
          })
          .catch((err) => {
            this.logger.error({ message: 'Application closed with error', stack: err as Error });
            process.exit(ExitStatus.Failure);
          });
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
