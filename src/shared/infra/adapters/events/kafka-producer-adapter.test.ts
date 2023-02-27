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

  const sut = new KafkaProducerAdapter(kafkaMock.producer());

  return {
    kafkaMock,
    sut,
  };
};

describe('KafkaProducerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should not throw errors on call 'publish' if all done right", async () => {
    const { sut } = makeSut();

    const producerSend = jest.spyOn(sut['producer'], 'send');

    expect(() => sut.publish('topic-id', { name: 'John Doe' })).not.toThrow();
    expect(producerSend).toHaveBeenCalled();
  });
});
