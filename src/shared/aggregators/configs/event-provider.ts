import { Kafka, logLevel } from 'kafkajs';

import { KafkaSubscriptionAdapter } from '@shared/aggregators/adapters/event/kafka-subscription-adapter';
import { KafkaConsumerAdapter } from '@shared/aggregators/adapters/event/kafka-consumer-adapter';
import { Logger } from '@shared/protocols/log';
import { LogMediator } from '../mediators/log-mediator';
import { Main } from '@presentation/entries/events/subscriptions';

export class EventProvider {
  private static instance: EventProvider;
  private consumer?: KafkaConsumerAdapter<unknown>;
  public readonly creator: Kafka;
  private readonly logger: Logger;

  private constructor() {
    this.creator = new Kafka({
      clientId: 'user-service-app',
      brokers: [process.env.KAFKA_ADDRESS as string],
      logLevel: logLevel.ERROR,
    });
    this.logger = LogMediator.getInstance().handle();
  }

  public static getInstance(): EventProvider {
    if (!EventProvider.instance) {
      EventProvider.instance = new EventProvider();
    }

    return EventProvider.instance;
  }

  public async start(): Promise<Promise<void>> {
    this.consumer = new KafkaConsumerAdapter(this.creator);
    await this.consumer.start();
    await this.setupSubscriptions();
  }

  private async setupSubscriptions(): Promise<void> {
    if (this.consumer) {
      const kafkaAdapter = new KafkaSubscriptionAdapter(this.consumer);
      await kafkaAdapter.handle(Main);
    }
  }

  public async close(): Promise<void> {
    if (this.consumer) {
      try {
        await this.consumer.stop();
        this.logger.info({ message: 'Event Provider closed with success' });
      } catch (err) {
        this.logger.error({ message: 'Application closed with error', stack: err as Error });
        throw err;
      }
    } else {
      this.logger.info({ message: 'There is no Event Provider to close' });
    }
  }
}
