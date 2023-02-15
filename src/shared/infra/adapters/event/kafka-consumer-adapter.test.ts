import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { KafkaConsumerAdapter } from './kafka-consumer-adapter';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { KafkaControllerAdapter } from './kafka-controller-adapter';
import { EventController } from '@presentation/protocols/events';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const sut = new KafkaConsumerAdapter(kafkaMock);

  return {
    sut,
    kafkaMock,
  };
};

describe('KafkaConsumerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should not throw errors on call 'start' if all done right", async () => {
    const { sut } = makeSut();

    expect(() => sut.start()).not.toThrow();
    expect(sut.isConnected).toBe(true);
  });

  test("Should not throw errors on call 'stop' if all done right", async () => {
    const { sut } = makeSut();

    expect(() => sut.stop()).not.toThrow();
    expect(sut.isConnected).toBe(false);
  });

  test("Should throw error on call 'start' if consumer 'connect' method throws any error", async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut['consumer'], 'connect')
      .mockRejectedValue(new Error('Error connecting to Kafka'));

    const result = sut.start();

    await expect(result).rejects.toStrictEqual(new Error('Error connecting to Kafka'));
    expect(sut.isConnected).toBe(false);
  });

  test("Should throw error on call 'stop' if consumer 'disconnect' method throws any error", async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut['consumer'], 'disconnect')
      .mockRejectedValue(new Error('Error disconnect to Kafka'));

    const result = sut.stop();

    await expect(result).rejects.toStrictEqual(new Error('Error disconnect to Kafka'));
    expect(sut.isConnected).toBe(false);
  });

  test("Should not throw errors on call 'subscribe' if all done right", async () => {
    const { sut } = makeSut();

    const adapter = new KafkaControllerAdapter();

    const controller = new (class extends EventController<string> {
      public async listen(eventPaload: string) {
        console.log(eventPaload);
      }
    })();

    const kafkaController = adapter.handle(controller);

    await sut.start();

    expect(() => sut.subscribe('topic-id', kafkaController)).not.toThrow();
  });

  test("Should throw error on call 'subscribe' if consumer 'isConnected' property is 'false'", async () => {
    const { sut } = makeSut();

    const adapter = new KafkaControllerAdapter();

    const controller = new (class extends EventController<string> {
      public async listen(eventPaload: string) {
        console.log(eventPaload);
      }
    })();

    const kafkaController = adapter.handle(controller);

    const result = sut.subscribe('topic-id', kafkaController);

    await expect(result).rejects.toStrictEqual(new Error('Kafka consumer is not connected'));
    expect(sut.isConnected).toBe(false);
  });
});
