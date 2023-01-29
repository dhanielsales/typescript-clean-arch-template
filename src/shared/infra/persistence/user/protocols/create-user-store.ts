import { UserSchema } from '@shared/infra/persistence/schemas/user';

export interface CreateUserStore {
  handle(params: CreateUserStore.Params): Promise<CreateUserStore.Response>;
}

export namespace CreateUserStore {
  export type Params = {
    name: string;
    phone: string;
    email: string;
    password: string;
  };

  export type Response = UserSchema;
}
