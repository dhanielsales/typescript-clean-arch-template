import { EachMessageHandler } from 'kafkajs';

import { KafkaControllerAdapter } from './kafka-controller-adapter';
import { EventController, Subscription, SubscriptionAdapter } from '@presentation/protocols/events';
import { Consumer } from '@presentation/protocols/events/pub-sub';
import { Adapter } from '@shared/infra/protocols/adapter';

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
