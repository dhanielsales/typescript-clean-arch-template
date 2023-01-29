export interface Adapter<Payload, Adapted> {
  handle(payload: Payload): Adapted;
}
