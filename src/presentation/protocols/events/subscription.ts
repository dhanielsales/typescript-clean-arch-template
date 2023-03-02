import { Listener } from './listener';

export interface Subscription {
  event: string;
  handler: Listener<unknown>;
}

export interface SubscriptionAdapter {
  handle(subscriptions: Array<Subscription>): Promise<void>;
}
