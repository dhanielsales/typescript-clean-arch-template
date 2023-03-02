import { EachMessageHandler } from 'kafkajs';

import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';
import { Logger } from '@shared/infra/protocols/log';
import { Listener } from '@presentation/protocols/events/listener';
import { Adapter } from '@shared/infra/protocols/adapter';

export class KafkaListenerAdapter implements Adapter<Listener<unknown>, EachMessageHandler> {
  private readonly logger: Logger;

  constructor() {
    this.logger = LogMediator.getInstance().handle();
  }

  public handle(listener: Listener<unknown>): EachMessageHandler {
    return async (payload) => {
      // Possível momento para algum log interno, no inicio da recepção de uma mensagem do Kafka

      try {
        const parsedPayload: unknown = payload.message.value
          ? JSON.parse(payload.message.value.toString('utf8'))
          : {};

        await listener.listen(parsedPayload);
      } catch (err) {
        this.logger.error({ message: 'Error on adapt kafka listener', stack: err as Error });
        throw err; // TODO avaliar comportamento em caso real
      }

      // Possível momento para algum log interno, ao termino da recepção de uma mensagem do Kafka
    };
  }
}
