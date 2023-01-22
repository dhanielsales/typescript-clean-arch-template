import { User } from '@entities/user/user-entity';
import { ListUsersPersistenceRepository } from '@shared/infra/persistence/user/protocols/list-users-persistence-repository';

export class ListUsersUsecase {
  constructor(private readonly listUsersPersistenceRepository: ListUsersPersistenceRepository) {}

  public async handle(): Promise<User[]> {
    const users = await this.listUsersPersistenceRepository.handle();

    return users;
  }
}
