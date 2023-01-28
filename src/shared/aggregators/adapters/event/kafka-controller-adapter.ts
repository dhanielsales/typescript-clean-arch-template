import { EachMessageHandler } from 'kafkajs';

import { EventController } from '@shared/protocols/event';
import { Adapter } from '@shared/protocols/adapter';
import { LogMediator } from '@shared/aggregators/mediators/log-mediator';
import { Logger } from '@shared/protocols/log';

export class KafkaControllerAdapter
  implements Adapter<EventController<unknown>, EachMessageHandler>
{
  private readonly logger: Logger;

  constructor() {
    this.logger = LogMediator.getInstance().handle();
  }

  public handle(controller: EventController<unknown>): EachMessageHandler {
    return async (payload) => {
      // Possível momento para algum log interno, no inicio da recepção de uma mensagem do Kafka

      try {
        const parsedPayload: unknown = payload.message.value
          ? JSON.parse(payload.message.value.toString('utf8'))
          : {};

        await controller.listen(parsedPayload);
        // TODO avaliar commit manual do consumo da mensagem
      } catch (err) {
        this.logger.error({ message: 'Error on adapt kafka controller', stack: err as Error });
      }

      // Possível momento para algum log interno, ao termino da recepção de uma mensagem do Kafka
    };
  }
}
