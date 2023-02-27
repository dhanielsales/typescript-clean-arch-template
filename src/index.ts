import '@shared/infra/aggregators/configs/environment';

import { ServiceSetup } from '@shared/infra/aggregators/configs/service-setup';

import { HttpServerProvider } from '@shared/infra/aggregators/configs/http-server-provider';
import { EventProvider } from '@shared/infra/aggregators/configs/event-provider';

async function main(): Promise<void> {
  const service = new ServiceSetup();
  service.register(EventProvider.getInstance());
  service.register(HttpServerProvider.getInstance());

  await service.start();
}

main().catch(console.error);
