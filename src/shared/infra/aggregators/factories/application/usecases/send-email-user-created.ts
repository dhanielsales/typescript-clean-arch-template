import { SendEmailUserCreated } from '@application/usecases/send-email-user-created';
import { EmailMediator } from '@shared/infra/aggregators/mediators/email-mediator';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<SendEmailUserCreated>>()
export class SendEmailUserCreatedFactory {
  static make(): SendEmailUserCreated {
    const mailSender = new EmailMediator().handle();

    return new SendEmailUserCreated(mailSender);
  }
}
