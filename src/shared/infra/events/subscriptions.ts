import { Subscription } from '@shared/protocols/event';
import { UserCreatedControllerFactory } from '@shared/aggregators/factories/presentation/controllers/event/user-created-controller';

export const subscriptions: Array<Subscription> = [
  {
    event: 'notify-user-creation',
    handler: UserCreatedControllerFactory.make(),
  },
];
