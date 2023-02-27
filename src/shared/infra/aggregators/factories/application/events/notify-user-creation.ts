import { NotifyUserCreation } from '@application/events/notify-user-creation';
import { KafkaProducerAdapter } from '@shared/infra/adapters/events/kafka-producer-adapter';
import { EventProvider } from '@shared/infra/aggregators/configs/event-provider';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<NotifyUserCreation>>()
export class NotifyUserCreationFactory {
  static make(): NotifyUserCreation {
    const { defaultProducer } = EventProvider.getInstance();
    const kafkaProducer = new KafkaProducerAdapter(defaultProducer);

    return new NotifyUserCreation(kafkaProducer);
  }
}
