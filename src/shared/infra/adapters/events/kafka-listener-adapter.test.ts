import MockDate from 'mockdate';

import { Listener } from '@presentation/protocols/events/listener';
import { KafkaListenerAdapter } from './kafka-listener-adapter';

describe('KafkaListenerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should not throw errors on call controller if all done right', async () => {
    const sut = new KafkaListenerAdapter();

    const listener = new (class extends Listener<{ name: string }> {
      public async listen(_eventPaload: { name: string }) {}
    })();

    const kafkaListener = sut.handle(listener);

    expect(() =>
      kafkaListener({
        topic: 'topic-id',
        message: {
          value: Buffer.from('{ "name": "test-payload" }'),
        },
      } as any),
    ).not.toThrow();
  });

  test('Should not throw errors on call controller and resturn an empty object if message did not have value', async () => {
    const sut = new KafkaListenerAdapter();

    const listener = new (class extends Listener<{ name: string }> {
      public async listen(_eventPaload: { name: string }) {}
    })();

    const kafkaListener = sut.handle(listener);

    expect(() =>
      kafkaListener({
        topic: 'topic-id',
        message: {},
      } as any),
    ).not.toThrow();
  });

  test('Should throw error on call controller if any error throws inside adapter', async () => {
    const sut = new KafkaListenerAdapter();

    const listener = new (class extends Listener<{ name: string }> {
      public async listen(_eventPaload: { name: string }) {}
    })();

    const kafkaListener = sut.handle(listener);

    const result = kafkaListener({
      topic: 'topic-id',
      message: {
        value: [],
      },
    } as any);

    await expect(result).rejects.toThrow();
  });
});
