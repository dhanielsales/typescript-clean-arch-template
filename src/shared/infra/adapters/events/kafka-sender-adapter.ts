import { CompressionTypes, Sender as KafkaSender, Message as KafkaMessage } from 'kafkajs';

import { Publisher } from '@presentation/protocols/events/publisher';

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

export class KafkaSenderAdapter<Message> implements Publisher<Message, KafkaProducerOptions> {
  constructor(private sender: KafkaSender) {}

  setSender(sender: KafkaSender) {
    this.sender = sender;
  }

  public async publish(
    topic: string,
    message: Message,
    options: KafkaProducerOptions = {},
  ): Promise<void> {
    const { acks = 0, timeout = 15000, headers, key, partition } = options;

    const topicMessage: KafkaMessage = {
      value: JSON.stringify(message),
      headers: headers,
      key: key,
      partition: partition,
    };

    await this.sender.send({
      topic,
      messages: [topicMessage],
      timeout: timeout, // 30000ms Default
      acks: acks,
      compression: CompressionTypes.GZIP,
    });
  }
}
