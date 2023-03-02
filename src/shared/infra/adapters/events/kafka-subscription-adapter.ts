import { EachMessageHandler } from 'kafkajs';

import { Adapter } from '@shared/infra/protocols/adapter';

import { Subscriber } from '@presentation/protocols/events/subscriber';
import { Subscription, SubscriptionAdapter } from '@presentation/protocols/events/subscription';
import { Listener } from '@presentation/protocols/events/listener';

import { KafkaListenerAdapter } from './kafka-listener-adapter';

export class KafkaSubscriptionAdapter implements SubscriptionAdapter {
  private readonly subscriber: Subscriber<unknown, EachMessageHandler>;
  private readonly adapter: Adapter<Listener<unknown>, EachMessageHandler>;

  constructor(subscriber: Subscriber<unknown>) {
    this.subscriber = subscriber;
    this.adapter = new KafkaListenerAdapter();
  }

  public async handle(subscriptions: Array<Subscription>): Promise<void> {
    for (const subscription of subscriptions) {
      this.subscriber.subscribe(subscription.event, this.adapter.handle(subscription.handler));
    }
  }
}
