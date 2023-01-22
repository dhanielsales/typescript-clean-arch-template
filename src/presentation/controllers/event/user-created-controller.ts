import { SendEmailUserCreated } from '@application/usecases/send-email-user-created';
import { EventController } from '@shared/protocols/event';
import { UserSchema } from '@shared/schemas/user';

export class UserCreatedController extends EventController<UserSchema> {
  constructor(private readonly sendEmailUserCreated: SendEmailUserCreated) {
    super();
  }

  public async listen(eventPaload: UserSchema) {
    console.log(`Sending email to ${eventPaload.email}`);

    await this.sendEmailUserCreated.handle({
      email: eventPaload.email,
      name: eventPaload.name,
    });
  }
}
