import { LogMediator } from '@shared/infra/aggregators/mediators/log-mediator';

export default function expressPrintRoutes(routerStacks: any[]): void {
  const results: any[] = [];
  const logger = LogMediator.getInstance().handle();

  function print(path: any, layer: any): void {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
      const currentPath = path.concat(split(layer.regexp)).filter(Boolean).join('/');
      const method = layer.method.toUpperCase();

      if (!results.find((item) => item.path === currentPath && item.method === method)) {
        results.push({
          method,
          path: currentPath,
        });
      }
    }
  }

  function split(thing: any): any {
    if (typeof thing === 'string') {
      return thing.split('/');
    } else if (thing.fast_slash) {
      return '';
    } else {
      const match = thing
        .toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>';
    }
  }

  routerStacks.forEach(print.bind(null, []));
  logger.info({ message: 'Debugging routes:' });
  console.table(results);
}
