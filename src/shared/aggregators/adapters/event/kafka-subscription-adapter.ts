import { EachMessageHandler } from 'kafkajs';

import { Adapter } from '@shared/protocols/adapter';
import { EventController, Subscription, SubscriptionAdapter } from '@shared/protocols/event';
import { Consumer } from '@shared/protocols/pub-sub';
import { KafkaControllerAdapter } from './kafka-controller-adapter';

export class KafkaSubscriptionAdapter implements SubscriptionAdapter {
  private readonly kafkaConsumer: Consumer<unknown, EachMessageHandler>;
  private readonly adapter: Adapter<EventController<unknown>, EachMessageHandler>;

  constructor(kafkaConsumer: Consumer<unknown>) {
    this.kafkaConsumer = kafkaConsumer;
    this.adapter = new KafkaControllerAdapter();
  }

  public async handle(subscriptions: Array<Subscription>): Promise<void> {
    for (const subscription of subscriptions) {
      this.kafkaConsumer.subscribe(subscription.event, this.adapter.handle(subscription.handler));
    }
  }
}
