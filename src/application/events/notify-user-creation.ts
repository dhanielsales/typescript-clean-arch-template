import { User } from '@domain/entities/user/user-entity';
import { Emitter } from '@presentation/protocols/events/emitter';
import { Publisher } from '@presentation/protocols/events/publisher';

export class NotifyUserCreation extends Emitter<User> {
  protected readonly publisher: Publisher<User>;
  protected readonly event: string = 'notify-user-creation';

  constructor(publisher: Publisher<unknown>) {
    super();

    this.publisher = publisher;
  }

  async emit(user: User): Promise<void> {
    await this.publisher.publish(this.event, user);
  }
}
