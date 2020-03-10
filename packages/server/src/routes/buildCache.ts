import Koa from 'koa';
import { plugins } from '../plugins';
import { saveCache } from '../util';

export function buildCache(context: Koa.ParameterizedContext) {
  context.body = '';

  plugins.forEach(async ({ name, module }) => {
    if (module.buildCache) {
      const result = await module.buildCache();
      saveCache(name, result);
    }
  });
}
