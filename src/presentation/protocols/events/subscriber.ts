export interface Subscriber<
  Message,
  Callback = (message: Message) => Promise<void>,
  Options = unknown,
> {
  subscribe(topic: string, callback: Callback, options?: Options): void;
  perform(): Promise<void>;
}
