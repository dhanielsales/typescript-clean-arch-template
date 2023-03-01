import { Publisher } from './publisher';

export abstract class Emitter<EventPaylod> {
  protected abstract readonly event: string;
  protected abstract readonly publisher: Publisher<unknown>;
  abstract emit(payload: EventPaylod): Promise<void>;
}
