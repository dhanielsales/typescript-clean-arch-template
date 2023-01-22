import { Factory } from '@shared/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';
import { UserSchema } from '@shared/schemas/user';
import { EventController } from '@shared/protocols/event';
import { UserCreatedController } from '@presentation/controllers/event/user-created-controller';
import { SendEmailUserCreatedFactory } from '@shared/aggregators/factories/application/usecases/send-email-user-created';

@StaticImplements<Factory<EventController<UserSchema>>>()
export class UserCreatedControllerFactory {
  static make(): EventController<UserSchema> {
    const sendEmailUserCreated = SendEmailUserCreatedFactory.make();

    return new UserCreatedController(sendEmailUserCreated);
  }
}
