import { SendEmailUserCreated } from '@application/usecases/send-email-user-created';
import { Listener } from '@presentation/protocols/events/listener';
import { UserSchema } from '@shared/infra/persistence/schemas/user';

export class UserCreatedController extends Listener<UserSchema> {
  constructor(private readonly sendEmailUserCreated: SendEmailUserCreated) {
    super();
  }

  public async listen(eventPaload: UserSchema): Promise<void> {
    await this.sendEmailUserCreated.handle({
      email: eventPaload.email,
      name: eventPaload.name,
    });
  }
}
