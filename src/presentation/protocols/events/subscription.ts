import { EventController } from './controller';

export interface Subscription {
  event: string;
  handler: EventController<unknown>;
}

export interface SubscriptionAdapter {
  handle(subscriptions: Array<Subscription>): Promise<void>;
}
