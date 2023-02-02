export interface Validator<Input = any, Schema = any> {
  validate: (input: Input, schema: Schema) => void;
}
