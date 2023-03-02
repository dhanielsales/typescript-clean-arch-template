import { NotifyUserCreation } from '@application/events/notify-user-creation';
import { KafkaSenderAdapter } from '@shared/infra/adapters/events/kafka-sender-adapter';

import { EventProvider } from '@shared/infra/aggregators/configs/event-provider';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<NotifyUserCreation>>()
export class NotifyUserCreationFactory {
  static make(): NotifyUserCreation {
    const { defaultProducer } = EventProvider.getInstance();
    const senderAdapter = new KafkaSenderAdapter(defaultProducer);

    return new NotifyUserCreation(senderAdapter);
  }
}
