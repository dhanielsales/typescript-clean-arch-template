import { Subscription } from '@presentation/protocols/events';
import { UserSubscriptions } from './user/user-subscriptions';

export const Main: Array<Subscription> = [...UserSubscriptions];
