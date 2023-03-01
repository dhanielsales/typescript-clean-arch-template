import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { KafkaConsumerAdapter } from './kafka-consumer-adapter';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { KafkaControllerAdapter } from './kafka-controller-adapter';
import { EventController } from '@presentation/protocols/events/controller';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';
import { KafkaSenderAdapter } from './kafka-sender-adapter';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const sut = new KafkaConsumerAdapter(kafkaMock.consumer({ groupId: 'group-id' }));

  return {
    sut,
    kafkaMock,
  };
};

describe('KafkaConsumerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should not throw errors on call 'subscribe' if all done right", async () => {
    const { sut } = makeSut();

    const adapter = new KafkaControllerAdapter();

    const controller = new (class extends EventController<string> {
      public async listen(_eventPaload: string) {}
    })();

    const kafkaController = adapter.handle(controller);

    expect(() => sut.subscribe('topic-id', kafkaController)).not.toThrow();
  });

  test("Should not throw errors on call 'perform' if all done right", async () => {
    const { sut } = makeSut();

    const controllerAdapter = new KafkaControllerAdapter();

    const controller = new (class extends EventController<string> {
      public async listen(_eventPaload: string) {}
    })();

    const kafkaController = controllerAdapter.handle(controller);

    sut.subscribe('topic-id', kafkaController);

    expect(() => sut.perform()).not.toThrow();
  });

  test('Should call kafkaController implementation when send a message to same topic', async () => {
    const { sut, kafkaMock } = makeSut();

    const controllerAdapter = new KafkaControllerAdapter();

    const controller = new (class extends EventController<string> {
      public async listen(_eventPaload: string) {}
    })();

    const kafkaController = controllerAdapter.handle(controller);

    sut.subscribe('topic-id', kafkaController);
    await sut.perform();

    const producer = kafkaMock.producer();

    const senderAdapter = new KafkaSenderAdapter(producer);

    senderAdapter.publish('topic-id', 'test-event-paload');
  });
});
