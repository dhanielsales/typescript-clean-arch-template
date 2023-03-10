import { Logger } from '@shared/infra/protocols/log';
import { Mediator } from '@shared/infra/protocols/mediator';
import { LogFormatter } from '../logs/log-formatter';

export class LogMediator implements Mediator<Logger> {
  private static instance: LogMediator;

  private constructor() {}

  public static getInstance(): LogMediator {
    if (!LogMediator.instance) {
      LogMediator.instance = new LogMediator();
    }

    return LogMediator.instance;
  }

  public handle(): Logger {
    if (process.env.NODE_ENV === 'development') {
      return new LogFormatter();
    }

    return {
      // TODO Trocar por Logger de observabilidade
      error: (params: Logger.Params) => console.error(params.message, params.stack),
      warning: (params: Logger.Params) => console.warn(params.message, params.stack),
      info: (params: Logger.Params) => console.log(params.message, params.stack),
    };
  }
}
