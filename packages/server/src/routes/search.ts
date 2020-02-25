import Koa from 'koa';
import { SearchResults } from 'mardi-helper';

const plugins = ['mardi-plugin-app-launcher'].map(name => require(name));

export async function search(context: Koa.ParameterizedContext) {
  const { query } = context.query;
  if (!query) {
    context.body = [];
    return;
  }
  const allResults: SearchResults[] = await Promise.all(
    plugins
      .filter(plugin => plugin.search)
      .map(async plugin => {
        const results: SearchResults = await plugin.search(query);
        return results;
      })
  );
  context.body = allResults;
}
