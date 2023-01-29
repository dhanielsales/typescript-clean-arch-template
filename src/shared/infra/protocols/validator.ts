export interface Validator<T = any> {
  validate: (input: T) => void;
}
