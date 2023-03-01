import { Consumer as KafkaConsumer, EachMessageHandler, EachMessagePayload } from 'kafkajs';

import { Subscriber } from '@presentation/protocols/events/subscriber';

type HandlersPerTopic = {
  [key: string]: EachMessageHandler;
};

export class KafkaConsumerAdapter<Message> implements Subscriber<Message, EachMessageHandler> {
  private readonly handlersPerTopic: HandlersPerTopic = {};
  private readonly consumer: KafkaConsumer;

  constructor(consumer: KafkaConsumer) {
    this.consumer = consumer;
  }

  public subscribe(topic: string, callback: EachMessageHandler): void {
    this.handlersPerTopic[topic] = callback;
  }

  public async perform(): Promise<void> {
    await this.consumer.subscribe({ topics: Object.keys(this.handlersPerTopic) });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload): Promise<void> => {
        const currentHandler = this.handlersPerTopic[payload.topic];
        await currentHandler(payload);
      },
    });
  }
}
