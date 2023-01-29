import { CreateUserUsecase } from '@application/usecases/create-user-usecase';
import { HttpRequest, HttpResponse } from '@presentation/protocols/http';
import { HttpController } from '@presentation/protocols/http/controller';

export namespace Schema {
  export interface Body {
    name: string;
    phone: string;
    email: string;
    password: string;
    foo: Record<any, any>;
  }

  export type Query = never;
  export type Params = never;
}

export class CreateUserController implements HttpController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  public async handle(
    request: HttpRequest<Schema.Body, Schema.Query, Schema.Params>,
  ): Promise<HttpResponse> {
    const { name, phone, email, password } = request.body;

    const user = await this.createUserUsecase.handle({ name, phone, email, password });

    return {
      status: 201,
      payload: user,
    };
  }
}
