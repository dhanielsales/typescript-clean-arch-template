import { Consumer as KafkaConsumer, EachMessageHandler, Kafka } from 'kafkajs';

import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';
import { Consumer } from '@presentation/protocols/events/pub-sub';

export class KafkaConsumerAdapter<Message> implements Consumer<Message, EachMessageHandler> {
  public readonly consumer: KafkaConsumer;
  private readonly logger: Logger;
  private _isConnected: boolean = false;

  constructor(kafka: Kafka) {
    this.consumer = kafka.consumer({
      groupId: process.env.KAFKAJS_GROUP_ID as string,
    });

    this.consumer.on(this.consumer.events.CONNECT, () => {
      this._isConnected = true;
    });

    this.consumer.on(this.consumer.events.DISCONNECT, () => {
      this._isConnected = false;
    });

    this.logger = LogMediator.getInstance().handle();
  }

  get isConnected() {
    return this._isConnected;
  }

  public async start(): Promise<void> {
    console.log('AQUII');
    try {
      console.log('1');
      await this.consumer.connect();
    } catch (error) {
      console.log('2');
      this.logger.error({ message: 'Error connecting the consumer', stack: error as Error });
      throw error;
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
      throw error;
    }
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
    if (!this._isConnected) {
      throw new Error('Kafka consumer is not connected');
    }

    await this.consumer.subscribe({ topics: [topic] });

    await this.consumer.run({
      eachMessage: callback,
    });
  }
}
