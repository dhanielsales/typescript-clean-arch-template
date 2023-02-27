import {
  Kafka,
  Producer as KafkaProducer,
  Consumer as KafkaConsumer,
  logLevel,
  ProducerConfig as KafkaProducerConfig,
} from 'kafkajs';

import { KafkaSubscriptionAdapter } from '@shared/infra/adapters/events/kafka-subscription-adapter';
import { KafkaConsumerAdapter } from '@shared/infra/adapters/events/kafka-consumer-adapter';
import { LogMediator } from '../mediators/log-mediator';
import { Logger } from '@shared/infra/protocols/log';

import { Provider } from './service-setup';

import { Main } from '@presentation/entries/events/subscriptions';

export class EventProvider implements Provider {
  private static instance: EventProvider;
  public readonly defaultProducer: KafkaProducer;
  public readonly defaultConsumer: KafkaConsumer;
  public readonly producers: KafkaProducer[] = [];
  private readonly creator: Kafka;
  private readonly logger: Logger;

  private constructor() {
    this.creator = new Kafka({
      clientId: process.env.KAFKAJS_CLIENT_ID as string,
      brokers: [process.env.KAFKA_ADDRESS as string],
      logLevel: logLevel.ERROR, // TODO avaliar nivel de logging
    });

    this.defaultProducer = this.creator.producer();

    this.defaultConsumer = this.creator.consumer({
      groupId: process.env.KAFKAJS_GROUP_ID as string,
    });

    this.logger = LogMediator.getInstance().handle();
  }

  public static getInstance(): EventProvider {
    if (!EventProvider.instance) {
      EventProvider.instance = new EventProvider();
    }

    return EventProvider.instance;
  }

  public async start(): Promise<void> {
    // Start default producer instance
    await this.defaultProducer.connect();

    // Start default consumer instance
    await this.defaultConsumer.connect();

    // Setup all subscriptions
    await this.setupSubscriptions();
    this.logger.info({ message: `Event Provider running` });
  }

  public async createProducer(config?: KafkaProducerConfig): Promise<KafkaProducer> {
    const producer = this.creator.producer(config);

    await producer.connect();

    this.producers.push(producer);

    return producer;
  }

  private async setupSubscriptions(): Promise<void> {
    const kafkaConsumerAdapter = new KafkaConsumerAdapter(this.defaultConsumer);
    const subscriptionAdapter = new KafkaSubscriptionAdapter(kafkaConsumerAdapter);
    await subscriptionAdapter.handle(Main);

    await kafkaConsumerAdapter.perform();
  }

  public async stop(): Promise<void> {
    try {
      await this.defaultProducer.disconnect();
      await this.defaultConsumer.stop();
      await this.defaultConsumer.disconnect();
      await Promise.all(this.producers.map(async (producer) => await producer.disconnect()));
      this.logger.info({ message: 'Event Provider closed with success' });
    } catch (err) {
      this.logger.error({ message: 'Error on close Event Provider', stack: err as Error });
      throw err;
    }
  }
}
