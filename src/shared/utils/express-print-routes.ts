export default function expressPrintRoutes(routerStacks: any[]) {
  console.log('============== Printing routes ==============');
  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
      console.log(
        '%s /%s',
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join('/'),
      );
    }
  }

  function split(thing: any) {
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
}
