import {
  KafkaConfig,
  ConsumerConfig,
  ProducerConfig,
  ConsumerRunConfig,
  EachMessageHandler,
  ConsumerSubscribeTopics,
  ProducerRecord,
  KafkaMessage,
} from 'kafkajs';

type Topics = {
  [topicId: string]: {
    [groupId: string]: Array<KafkaConsumerMock>;
  };
};

class KafkaProducerMock {
  private onConnectEvent: (...args: any[]) => any = () => {};
  private onDisconnectEvent: (...args: any[]) => any = () => {};
  private publich: (topic: string, messages: KafkaMessage[]) => void;
  public readonly events = {
    CONNECT: 'producer.connect',
    DISCONNECT: 'producer.disconnect',
  };

  constructor(config: ProducerConfig, publich: (topic: string, messages: KafkaMessage[]) => void) {
    this.publich = publich;
  }

  public async send(record: ProducerRecord): Promise<any> {
    return this.publich(record.topic, record.messages as KafkaMessage[]);
  }

  public async connect() {
    this.onConnectEvent();
  }

  public async disconnect() {
    this.onDisconnectEvent();
  }

  public on(event: string, callback: (...args: any[]) => any) {
    if (event === this.events.CONNECT) {
      this.onConnectEvent = callback;
    }

    if (event === this.events.DISCONNECT) {
      this.onDisconnectEvent = callback;
    }
  }
}

class KafkaConsumerMock {
  private onConnectEvent: (...args: any[]) => any = () => {};
  private onDisconnectEvent: (...args: any[]) => any = () => {};
  private readonly sub: (topics: string[], consumer: KafkaConsumerMock) => void;
  private _groupId: string;
  public eachMessage?: EachMessageHandler;

  public readonly events = {
    CONNECT: 'consumer.connect',
    DISCONNECT: 'consumer.disconnect',
  };

  constructor(
    config: ConsumerConfig,
    sub: (topics: string[], consumer: KafkaConsumerMock) => void,
  ) {
    this._groupId = config.groupId;
    this.sub = sub;
  }

  get groupId() {
    return this._groupId;
  }

  public async connect() {
    this.onConnectEvent();
  }

  public async disconnect() {
    this.onDisconnectEvent();
  }

  public on(event: string, callback: (...args: any[]) => any) {
    if (event === this.events.CONNECT) {
      this.onConnectEvent = callback;
    }

    if (event === this.events.DISCONNECT) {
      this.onDisconnectEvent = callback;
    }
  }

  public async subscribe(subscription: ConsumerSubscribeTopics) {
    this.sub(subscription.topics as string[], this);
  }

  public async run(config: ConsumerRunConfig) {
    this.eachMessage = config.eachMessage;
  }
}

export class KafkaMock {
  private clientId: string | undefined;
  private topics: Topics = {};

  constructor(config: KafkaConfig) {
    this.clientId = config.clientId;
  }

  private subscribe(topics: string[], consumer: KafkaConsumerMock) {
    topics.forEach((topic) => {
      this.topics[topic] = this.topics[topic] || {};
      const topicObj = this.topics[topic];
      topicObj[consumer.groupId] = topicObj[consumer.groupId] || [];
      topicObj[consumer.groupId].push(consumer);
    });
  }

  private publich(topic: string, messages: KafkaMessage[]) {
    messages.forEach((message) => {
      Object.values(this.topics[topic]).forEach((consumers) => {
        const consumerToGetMessage = Math.floor(Math.random() * consumers.length);
        const eachMessageHandler = consumers[consumerToGetMessage].eachMessage;
        if (eachMessageHandler) {
          eachMessageHandler({ message, topic } as any);
        }
      });
    });
  }

  public consumer(config: ConsumerConfig) {
    return new KafkaConsumerMock(config, this.subscribe.bind(this));
  }

  public producer(config: ProducerConfig) {
    return new KafkaProducerMock(config, this.publich.bind(this));
  }
}
