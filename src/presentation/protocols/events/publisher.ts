export interface Publisher<Message, Options = unknown> {
  publish(topic: string, message: Message, options?: Options): Promise<void>;
}
