import MockDate from 'mockdate';

import { EventController } from '@presentation/protocols/events/controller';
import { KafkaControllerAdapter } from './kafka-controller-adapter';

describe('KafkaControllerAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test('Should not throw errors on call controller if all done right', async () => {
    const sut = new KafkaControllerAdapter();

    const controller = new (class extends EventController<{ name: string }> {
      public async listen(eventPaload: { name: string }) {
        console.log(eventPaload.name);
      }
    })();

    const kafkaController = sut.handle(controller);

    expect(() =>
      kafkaController({
        topic: 'topic-id',
        message: {
          value: Buffer.from('{ "name": "test-payload" }'),
        },
      } as any),
    ).not.toThrow();
  });

  test('Should not throw errors on call controller and resturn an empty object if message did not have value', async () => {
    const sut = new KafkaControllerAdapter();

    const controller = new (class extends EventController<{ name: string }> {
      public async listen(eventPaload: { name: string }) {
        console.log(eventPaload.name);
      }
    })();

    const kafkaController = sut.handle(controller);

    expect(() =>
      kafkaController({
        topic: 'topic-id',
        message: {},
      } as any),
    ).not.toThrow();
  });

  test('Should throw error on call controller if any error throws inside adapter', async () => {
    const sut = new KafkaControllerAdapter();

    const controller = new (class extends EventController<{ name: string }> {
      public async listen(eventPaload: { name: string }) {
        console.log(eventPaload.name);
      }
    })();

    const kafkaController = sut.handle(controller);

    const result = kafkaController({
      topic: 'topic-id',
      message: {
        value: [],
      },
    } as any);

    await expect(result).rejects.toThrow();
  });
});
