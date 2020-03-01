import Koa from 'koa';
import { SearchResults, SearchResultsWithPluginName } from 'mardi-helper';

const plugins = ['mardi-plugin-app-launcher'].map(name => ({
  name,
  module: require(name),
}));

export async function search(context: Koa.ParameterizedContext) {
  const { query } = context.query;
  if (!query) {
    context.body = [];
    return;
  }
  const allResults: SearchResultsWithPluginName[] = await Promise.all(
    plugins
      .filter(({ module }) => module.search)
      .map(async ({ name, module }) => {
        const results: SearchResults = await module.search(query);
        return {
          list: results.list,
          pluginName: name,
        };
      })
  );
  context.body = allResults;
}
