import { EachMessageHandler } from 'kafkajs';

import { Adapter } from '@shared/infra/protocols/adapter';

import { Subscriber } from '@presentation/protocols/events/subscriber';
import { Subscription, SubscriptionAdapter } from '@presentation/protocols/events/subscription';
import { EventController } from '@presentation/protocols/events/controller';

import { KafkaControllerAdapter } from './kafka-controller-adapter';

export class KafkaSubscriptionAdapter implements SubscriptionAdapter {
  private readonly subscriber: Subscriber<unknown, EachMessageHandler>;
  private readonly controllerAdapter: Adapter<EventController<unknown>, EachMessageHandler>;

  constructor(subscriber: Subscriber<unknown>) {
    this.subscriber = subscriber;
    this.controllerAdapter = new KafkaControllerAdapter();
  }

  public async handle(subscriptions: Array<Subscription>): Promise<void> {
    for (const subscription of subscriptions) {
      this.subscriber.subscribe(
        subscription.event,
        this.controllerAdapter.handle(subscription.handler),
      );
    }
  }
}
