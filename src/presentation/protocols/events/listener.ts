export abstract class Listener<EventPaylod> {
  abstract listen(payload: EventPaylod): Promise<void>;
}
