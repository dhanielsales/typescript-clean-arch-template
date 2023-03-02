import { Subscription } from '@presentation/protocols/events/subscription';
import { UserCreatedListenerFactory } from '@shared/infra/aggregators/factories/presentation/listeners/user-created-listener';

export const UserSubscriptions: Array<Subscription> = [
  {
    event: 'notify-user-creation',
    handler: UserCreatedListenerFactory.make(),
  },
];
