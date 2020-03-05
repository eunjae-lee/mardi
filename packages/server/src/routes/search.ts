import Koa from 'koa';
import { SearchResults, SearchResultsWithPluginName } from 'mardi-helper';

const plugins = ['mardi-plugin-app-launcher', 'mardi-plugin-color'].map(
  name => ({
    name,
    module: require(name),
  })
);

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
        const results: SearchResults = await module.search(query);
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
