export abstract class EventController<EventPaylod> {
  abstract listen(payload: EventPaylod): Promise<void>;
}
