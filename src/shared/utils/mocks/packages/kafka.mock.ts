import { ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export class KafkaMock {
  public readonly events = {
    CONNECT: 'consumer.connect',
    DISCONNECT: 'consumer.disconnect',
  };
  private onConnectEvent: (...args: any[]) => any = () => {};
  private onDisconnectEvent: (...args: any[]) => any = () => {};

  public consumer = jest.fn().mockImplementation(() => {
    return {
      events: this.events,
      connect: async () => {
        this.onConnectEvent();
      },
      disconnect: async () => {
        this.onDisconnectEvent();
      },
      on: (event: string, callback: (...args: any[]) => any) => {
        if (event === this.events.CONNECT) {
          this.onConnectEvent = callback;
        }

        if (event === this.events.DISCONNECT) {
          this.onDisconnectEvent = callback;
        }
      },
      subscribe: async (_subscription: ConsumerSubscribeTopics) => {},
      run: async (_config?: ConsumerRunConfig) => {},
    };
  });
}
