import { User } from '@entities/user/user-entity';
import { CreateUserStore } from '@shared/infra/persistence/user/protocols/create-user-store';
import { NotifyUserCreation } from '../events/notify-user-creation';

interface Params {
  name: string;
  phone: string;
  email: string;
  password: string;
}
export class CreateUserUsecase {
  constructor(
    private readonly createUserStore: CreateUserStore,
    private readonly notifyUserCreation: NotifyUserCreation,
  ) {}

  public async handle(params: Params): Promise<User> {
    const user = await this.createUserStore.handle({
      name: params.name,
      phone: params.phone,
      email: params.email,
      password: params.password,
    });

    await this.notifyUserCreation.emit(user);

    return user;
  }
}
