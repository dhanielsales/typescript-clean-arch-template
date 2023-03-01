import { Consumer as KafkaConsumer, EachMessageHandler, EachMessagePayload } from 'kafkajs';

import { Subscriber } from '@presentation/protocols/events/subscriber';
import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';

type HandlersPerTopic = {
  [key: string]: EachMessageHandler;
};

export class KafkaConsumerAdapter<Message> implements Subscriber<Message, EachMessageHandler> {
  private readonly handlersPerTopic: HandlersPerTopic = {};
  private readonly logger: Logger;
  private readonly consumer: KafkaConsumer;

  constructor(consumer: KafkaConsumer) {
    this.consumer = consumer;
    this.logger = LogMediator.getInstance().handle();
  }

  public subscribe(topic: string, callback: EachMessageHandler): void {
    this.handlersPerTopic[topic] = callback;
  }

  public async perform(): Promise<void> {
    await this.consumer.subscribe({ topics: Object.keys(this.handlersPerTopic) });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const currentHandler = this.handlersPerTopic[payload.topic];

        if (!currentHandler) {
          this.logger.warning({
            message: `Topic '${payload.topic}' are subscribed on consumer but not registered on handlersPerTopic object`,
          });
          return;
        }

        await currentHandler(payload);
      },
    });
  }
}
