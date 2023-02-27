import { Subscription } from '@presentation/protocols/events/subscription';
import { UserCreatedControllerFactory } from '@shared/infra/aggregators/factories/presentation/controllers/events/user-created-controller';

export const UserSubscriptions: Array<Subscription> = [
  {
    event: 'notify-user-creation',
    handler: UserCreatedControllerFactory.make(),
  },
];
