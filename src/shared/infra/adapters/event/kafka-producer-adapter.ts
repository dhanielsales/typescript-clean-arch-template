import {
  CompressionTypes,
  Kafka,
  Producer as KafkaProducer,
  Message as KafkaMessage,
} from 'kafkajs';

import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';
import { Producer } from '@presentation/protocols/events/pub-sub';

type Acks = 1 | 0 | -1; // 1 Leader | 0 None | -1 All

interface KafkaProducerOptions {
  acks?: Acks;
  key?: string;
  partition?: number;
  timeout?: number;
  headers?: {
    [key: string]: string | string[];
  };
}

export class KafkaProducerAdapter<Message> implements Producer<Message, KafkaProducerOptions> {
  private readonly producer: KafkaProducer;
  private readonly logger: Logger;
  private _isConnected: boolean = false;

  constructor(kafka: Kafka) {
    // TODO avaliar possibilidade de injeção de configurações
    this.producer = kafka.producer();

    this.producer.on(this.producer.events.CONNECT, () => {
      this._isConnected = true;
    });

    this.producer.on(this.producer.events.DISCONNECT, () => {
      this._isConnected = false;
    });

    this.logger = LogMediator.getInstance().handle();
  }

  get isConnected() {
    return this._isConnected;
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.error({ message: 'Error connecting the producer', stack: error as Error });
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.producer.disconnect();
    } catch (error) {
      this.logger.error({ message: 'Error disconnect the producer', stack: error as Error });
      throw error;
    }
  }

  public async publish(
    topic: string,
    message: Message,
    options: KafkaProducerOptions = {},
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka producer is not connected');
    }

    const { acks = 0, timeout = 15000, headers, key, partition } = options;

    const topicMessage: KafkaMessage = {
      value: JSON.stringify(message),
      headers: headers,
      key: key,
      partition: partition,
    };

    await this.producer.send({
      topic,
      messages: [topicMessage],
      timeout: timeout, // 30000ms Default
      acks: acks,
      compression: CompressionTypes.GZIP,
    });
  }
}
