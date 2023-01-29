import { User } from '@domain/entities/user/user-entity';
import { ListUsersStore } from '@shared/infra/persistence/user/protocols/list-users-store';

export class ListUsersUsecase {
  constructor(private readonly listUsersStore: ListUsersStore) {}

  public async handle(): Promise<User[]> {
    const users = await this.listUsersStore.handle();

    return users;
  }
}
