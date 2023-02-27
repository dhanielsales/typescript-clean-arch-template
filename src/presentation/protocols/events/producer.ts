export interface Producer<Message, Options = unknown> {
  publish<T>(topic: string, message: Message, options?: Options, producer?: T): Promise<void>;
  publish(topic: string, message: Message, options?: Options): Promise<void>;
}
