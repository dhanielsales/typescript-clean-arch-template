export interface Publisher<Message, Options = unknown, Sender = unknown> {
  publish(topic: string, message: Message, options?: Options): Promise<void>;
  setPublisher(sender: Sender): void;
}
