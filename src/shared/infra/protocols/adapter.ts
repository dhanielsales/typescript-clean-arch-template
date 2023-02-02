export interface Adapter<Payload, Adapted> {
  handle(payload: Payload, ...args: any[]): Adapted;
}
