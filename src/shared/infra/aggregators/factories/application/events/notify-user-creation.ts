import { NotifyUserCreation } from '@application/events/notify-user-creation';
import { KafkaProducerAdapter } from '@shared/infra/adapters/event/kafka-producer-adapter';
import { EventProvider } from '@shared/infra/aggregators/configs/event-provider';
import { Factory } from '@shared/infra/protocols/factory';
import { StaticImplements } from '@shared/utils/types/static-implements';

@StaticImplements<Factory<NotifyUserCreation>>()
export class NotifyUserCreationFactory {
  static make(): NotifyUserCreation {
    const kafka = EventProvider.getInstance().creator;
    const kafkaProducer = new KafkaProducerAdapter(kafka);

    return new NotifyUserCreation(kafkaProducer);
  }
}
