import { HttpValidationSchema } from '@presentation/protocols/http/validator';
import { Schema } from '../create-user-controller';

export const CreateUserControllerSchema: HttpValidationSchema<
  Schema.Body,
  Schema.Query,
  Schema.Params
> = {
  body: {
    email: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    phone: {
      type: 'string',
      required: true,
    },
    foo: {
      type: 'object',
      required: true,
    },
  },
};
