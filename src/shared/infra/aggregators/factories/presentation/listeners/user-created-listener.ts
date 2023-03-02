import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';
import { UserSchema } from '@shared/infra/persistence/schemas/user';
import { Listener } from '@presentation/protocols/events/listener';

import { UserCreatedController } from '@presentation/controllers/events/user/user-created-controller';
import { SendEmailUserCreatedFactory } from '@shared/infra/aggregators/factories/application/usecases/send-email-user-created';

@StaticImplements<Factory<Listener<UserSchema>>>()
export class UserCreatedListenerFactory {
  static make(): Listener<UserSchema> {
    const sendEmailUserCreated = SendEmailUserCreatedFactory.make();

    return new UserCreatedController(sendEmailUserCreated);
  }
}
