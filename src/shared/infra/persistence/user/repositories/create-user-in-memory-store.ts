import { User } from '@domain/entities/user/user-entity';
import { CreateUserRepository } from '@domain/entities/user/user-repositories';
import { InMemoryStore } from '@shared/infra/persistence/prototypes/in-memory-store';
import { CreateUserStore } from '@shared/infra/persistence/user/protocols/create-user-store';

export class CreateUserInMemoryStore implements CreateUserStore {
  constructor(
    private readonly store: InMemoryStore<User>,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  public async handle(params: CreateUserStore.Params): Promise<CreateUserStore.Response> {
    const user = this.createUserRepository.handle({
      name: params.name,
      phone: params.phone,
      email: params.email,
      password: params.password,
    });

    await this.store.create(user);

    return user;
  }
}
