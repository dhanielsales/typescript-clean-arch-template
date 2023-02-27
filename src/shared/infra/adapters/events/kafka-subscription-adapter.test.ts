import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { Subscription } from '@presentation/protocols/events/subscription';
import { EventController } from '@presentation/protocols/events/controller';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';

import { KafkaSubscriptionAdapter } from './kafka-subscription-adapter';
import { KafkaConsumerAdapter } from './kafka-consumer-adapter';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const consumer = new KafkaConsumerAdapter(kafkaMock.consumer({ groupId: 'group-id' }));
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

    const consumerSubscribe = jest.spyOn(consumer, 'subscribe');

    expect(() => sut.handle(subscriptions)).not.toThrow();
    expect(consumerSubscribe).toHaveBeenCalled();
  });
});
