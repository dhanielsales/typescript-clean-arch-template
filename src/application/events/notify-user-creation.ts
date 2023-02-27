import { User } from '@domain/entities/user/user-entity';
import { Emitter } from '@presentation/protocols/events/emitter';
import { Producer } from '@presentation/protocols/events/producer';

export class NotifyUserCreation extends Emitter<User> {
  protected readonly producer: Producer<User>;
  protected readonly event: string = 'notify-user-creation';

  constructor(producer: Producer<unknown>) {
    super();

    this.producer = producer;
  }

  async emit(user: User): Promise<void> {
    await this.producer.publish(this.event, user);
  }
}
