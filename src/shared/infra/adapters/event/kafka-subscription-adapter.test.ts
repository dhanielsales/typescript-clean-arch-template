import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { EventController, Subscription } from '@presentation/protocols/events';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';

import { KafkaSubscriptionAdapter } from './kafka-subscription-adapter';
import { KafkaConsumerAdapter } from './kafka-consumer-adapter';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const consumer = new KafkaConsumerAdapter(kafkaMock);
  const sut = new KafkaSubscriptionAdapter(consumer);

  return {
    kafkaMock,
    consumer,
    sut,
  };
};

describe('KafkaSubscriptionAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should not throw errors on call adapter if all done right', async () => {
    const { sut, consumer } = makeSut();

    const controller = new (class extends EventController<{ name: string }> {
      public async listen(eventPaload: { name: string }) {
        console.log(eventPaload.name);
      }
    })();

    const subscriptions: Array<Subscription> = [
      {
        event: 'topic-id',
        handler: controller,
      },
    ];

    await consumer.start();

    const consumerSubscribe = jest.spyOn(consumer, 'subscribe');

    expect(() => sut.handle(subscriptions)).not.toThrow();
    expect(consumerSubscribe).toHaveBeenCalled();
  });
});
