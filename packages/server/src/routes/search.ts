import Koa from 'koa';
import { SearchResults, SearchResultsWithPluginName } from 'mardi-helper';
import { plugins } from '../plugins';
import { loadCache } from '../util';

export async function search(context: Koa.ParameterizedContext) {
  const { query } = context.query;
  if (!query) {
    context.body = [];
    return;
  }
  const allResults: SearchResultsWithPluginName[] = await Promise.all(
    plugins
      .filter(({ module }) => module.search && module.runAction)
      .map(async ({ name, module }) => {
        const cache = loadCache(name);
        const results: SearchResults = await module.search(query, cache);
        return (
          results &&
          results.list && {
            list: results.list,
            pluginName: name,
          }
        );
      })
      .filter(Boolean)
  );
  context.body = allResults;
}
