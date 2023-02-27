import { Producer } from './producer';

export abstract class Emitter<EventPaylod> {
  protected abstract readonly event: string;
  protected abstract readonly producer: Producer<unknown>;
  abstract emit(payload: EventPaylod): Promise<void>;
}
