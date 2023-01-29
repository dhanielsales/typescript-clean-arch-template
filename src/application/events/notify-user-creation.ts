import { User } from '@domain/entities/user/user-entity';
import { Emitter } from '@presentation/protocols/events';
import { Producer } from '@presentation/protocols/events/pub-sub';

export class NotifyUserCreation extends Emitter<User> {
  protected readonly producer: Producer<User>;
  protected readonly event: string = 'notify-user-creation';

  constructor(producer: Producer<unknown>) {
    super();

    this.producer = producer;
  }

  async emit(user: User): Promise<void> {
    await this.producer.start();

    await this.producer.publish(this.event, user);
  }
}
