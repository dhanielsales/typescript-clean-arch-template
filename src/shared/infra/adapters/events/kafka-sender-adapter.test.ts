import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';
import { createModuleMock } from '@shared/utils/mocks/get-module-mock';

import { KafkaSenderAdapter } from './kafka-sender-adapter';

const makeSut = () => {
  const kafkaMock = createModuleMock(KafkaMock, {
    brokers: ['host'],
    clientId: 'client-id',
  }) as Kafka;

  const sut = new KafkaSenderAdapter(kafkaMock.producer());

  return {
    kafkaMock,
    sut,
  };
};

describe('KafkaSenderAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should not throw errors on call 'publish' if all done right", async () => {
    const { sut } = makeSut();

    const producerSend = jest.spyOn(sut['sender'], 'send');

    expect(() => sut.publish('topic-id', { name: 'John Doe' })).not.toThrow();
    expect(producerSend).toHaveBeenCalled();
  });

  test("Should not throw errors on call 'publish' even after call 'setPublisher'", async () => {
    const { sut, kafkaMock } = makeSut();

    const producer = kafkaMock.producer();

    sut.setPublisher(producer);

    expect(() => sut.publish('topic-id', { name: 'John Doe' })).not.toThrow();
  });
});
