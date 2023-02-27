import { CompressionTypes, Producer as KafkaProducer, Message as KafkaMessage } from 'kafkajs';

import { Logger } from '@shared/infra/protocols/log';
import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';

import { Producer } from '@presentation/protocols/events/producer';

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

  constructor(producer: KafkaProducer) {
    this.producer = producer;
    this.logger = LogMediator.getInstance().handle();
  }

  public async publish<T extends KafkaProducer>(
    topic: string,
    message: Message,
    options: KafkaProducerOptions = {},
    producer?: T,
  ): Promise<void> {
    const { acks = 0, timeout = 15000, headers, key, partition } = options;

    const topicMessage: KafkaMessage = {
      value: JSON.stringify(message),
      headers: headers,
      key: key,
      partition: partition,
    };

    if (producer) {
      await producer.send({
        topic,
        messages: [topicMessage],
        timeout: timeout, // 30000ms Default
        acks: acks,
        compression: CompressionTypes.GZIP,
      });
    } else {
      await this.producer.send({
        topic,
        messages: [topicMessage],
        timeout: timeout, // 30000ms Default
        acks: acks,
        compression: CompressionTypes.GZIP,
      });
    }
  }
}
