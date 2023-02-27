import { Subscription } from '@presentation/protocols/events/subscription';
import { UserSubscriptions } from './user/user-subscriptions';

export const Main: Array<Subscription> = [...UserSubscriptions];
