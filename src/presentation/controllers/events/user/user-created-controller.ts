import { SendEmailUserCreated } from '@application/usecases/send-email-user-created';
import { EventController } from '@presentation/protocols/events/controller';
import { UserSchema } from '@shared/infra/persistence/schemas/user';

export class UserCreatedController extends EventController<UserSchema> {
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
