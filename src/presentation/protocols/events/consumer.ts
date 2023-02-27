export interface Consumer<
  Message,
  Callback = (message: Message) => Promise<void>,
  Options = unknown,
> {
  subscribe(topic: string, callback: Callback, options?: Options): void;
  subscribe(topic: string, callback: Callback): void;
  perform(): Promise<void>;
}
