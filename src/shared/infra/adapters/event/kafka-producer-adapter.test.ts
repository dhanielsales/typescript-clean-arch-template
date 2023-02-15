import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';

import { KafkaProducerAdapter } from './kafka-producer-adapter';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const sut = new KafkaProducerAdapter(kafkaMock);

  return {
    kafkaMock,
    sut,
  };
};

describe('KafkaProducerAdapter', () => {
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

  test("Should throw error on call 'start' if producer 'connect' method throws any error", async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut['producer'], 'connect')
      .mockRejectedValue(new Error('Error connecting to Kafka'));

    const result = sut.start();

    await expect(result).rejects.toStrictEqual(new Error('Error connecting to Kafka'));
    expect(sut.isConnected).toBe(false);
  });

  test("Should throw error on call 'stop' if producer 'disconnect' method throws any error", async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut['producer'], 'disconnect')
      .mockRejectedValue(new Error('Error disconnect to Kafka'));

    const result = sut.stop();

    await expect(result).rejects.toStrictEqual(new Error('Error disconnect to Kafka'));
    expect(sut.isConnected).toBe(false);
  });

  test("Should throw error on call 'publish' if producer 'isConnected' property is 'false'", async () => {
    const { sut } = makeSut();

    const result = sut.publish('topic-id', { name: 'John Doe' });

    await expect(result).rejects.toStrictEqual(new Error('Kafka producer is not connected'));
    expect(sut.isConnected).toBe(false);
  });

  test("Should not throw errors on call 'publish' if all done right", async () => {
    const { sut } = makeSut();

    await sut.start();

    const producerSend = jest.spyOn(sut['producer'], 'send');

    expect(() => sut.publish('topic-id', { name: 'John Doe' })).not.toThrow();
    expect(producerSend).toHaveBeenCalled();
  });
});
