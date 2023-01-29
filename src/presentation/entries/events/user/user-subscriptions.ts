import { Subscription } from '@presentation/protocols/events';
import { UserCreatedControllerFactory } from '@shared/aggregators/factories/presentation/controllers/events/user-created-controller';

export const UserSubscriptions: Array<Subscription> = [
  {
    event: 'notify-user-creation',
    handler: UserCreatedControllerFactory.make(),
  },
];
