import { EachMessageHandler } from 'kafkajs';

import { Adapter } from '@shared/infra/protocols/adapter';

import { Consumer } from '@presentation/protocols/events/consumer';
import { Subscription, SubscriptionAdapter } from '@presentation/protocols/events/subscription';
import { EventController } from '@presentation/protocols/events/controller';

import { KafkaControllerAdapter } from './kafka-controller-adapter';

export class KafkaSubscriptionAdapter implements SubscriptionAdapter {
  private readonly kafkaConsumer: Consumer<unknown, EachMessageHandler>;
  private readonly controllerAdapter: Adapter<EventController<unknown>, EachMessageHandler>;

  constructor(kafkaConsumer: Consumer<unknown>) {
    this.kafkaConsumer = kafkaConsumer;
    this.controllerAdapter = new KafkaControllerAdapter();
  }

  public async handle(subscriptions: Array<Subscription>): Promise<void> {
    for (const subscription of subscriptions) {
      this.kafkaConsumer.subscribe(
        subscription.event,
        this.controllerAdapter.handle(subscription.handler),
      );
    }
  }
}
