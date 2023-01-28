import { Consumer as KafkaConsumer, EachMessageHandler, Kafka } from 'kafkajs';

import { Consumer } from '@shared/protocols/pub-sub';
import { Logger } from '@shared/protocols/log';
import { LogMediator } from '@shared/aggregators/mediators/log-mediator';

export class KafkaConsumerAdapter<Message> implements Consumer<Message, EachMessageHandler> {
  public readonly consumer: KafkaConsumer;
  private readonly logger: Logger;
  private isConnected: boolean = false;

  constructor(kafka: Kafka) {
    // TODO avaliar possibilidade de injeção de configurações
    this.consumer = kafka.consumer({ groupId: 'my-app-group' });

    this.consumer.on(this.consumer.events.CONNECT, () => {
      this.isConnected = true;
    });

    this.logger = LogMediator.getInstance().handle();
  }

  public async start(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.logger.error({ message: 'Error connecting the consumer', stack: error as Error });
    }
  }

  public async stop(): Promise<void> {
    try {
      new Promise<void>((resolve, reject) => {
        this.consumer
          .disconnect()
          .then(() => {
            this.consumer.on(this.consumer.events.DISCONNECT, () => resolve());
          })
          .catch((err) => reject(err));
      });
    } catch (error) {
      this.logger.error({ message: 'Error disconnect the consumer', stack: error as Error });
    }
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka consumer is not connected');
    }

    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      eachMessage: callback,
    });
  }
}
