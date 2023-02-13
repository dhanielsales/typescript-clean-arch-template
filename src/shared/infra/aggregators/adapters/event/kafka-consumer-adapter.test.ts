import MockDate from 'mockdate';
import { Kafka } from 'kafkajs';

import { KafkaConsumerAdapter } from './kafka-consumer-adapter';
import { getClassMock } from '@shared/utils/mocks/get-class-mock';
import { KafkaMock } from '@shared/utils/mocks/packages/kafka.mock';

const makeSut = () => {
  // const kafkaMock = getClassMock<Kafka>(KafkaMock);
  const kafkaMock = new KafkaMock() as unknown as Kafka;
  const sut = new KafkaConsumerAdapter(kafkaMock);

  return {
    sut,
    kafkaMock,
  };
};

describe('KafkaConsumerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  // test("Should not throw errors on call 'start'", async () => {
  //   const { sut } = makeSut();

  //   expect(() => sut.start()).not.toThrow();
  //   expect(sut.isConnected).toBe(true);
  // });

  // test("Should not throw errors on call 'stop'", async () => {
  //   const { sut } = makeSut();

  //   expect(() => sut.stop()).not.toThrow();
  //   expect(sut.isConnected).toBe(false);
  // });

  test("Should throw error on call 'start' if consumer 'connect' method throws any error", async () => {
    const { sut, kafkaMock } = makeSut();

    jest.spyOn(kafkaMock, 'consumer').mockImplementation(() => ({
      ...kafkaMock.consumer({
        groupId: process.env.KAFKAJS_GROUP_ID as string,
      }),
      connect: async () => {
        throw new Error('Error connecting to Kafka');
      },
    }));

    const result = sut.start();

    await expect(result).rejects.toStrictEqual(new Error('Error connecting to Kafka'));
    expect(sut.isConnected).toBe(false);
  });
});
