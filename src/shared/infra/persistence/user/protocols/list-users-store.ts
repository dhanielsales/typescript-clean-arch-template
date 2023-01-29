import { UserSchema } from '@shared/infra/persistence/schemas/user';

export interface ListUsersStore {
  handle(): Promise<ListUsersStore.Response>;
}

export namespace ListUsersStore {
  export type Response = UserSchema[];
}
