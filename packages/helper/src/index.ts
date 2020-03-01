import orgOpen from 'open';

export async function open(target: string) {
  await orgOpen(target);
}

export type SearchResult = {
  title: string;
  description?: string;
  payload?: any;
};

export type SearchResults = {
  list: SearchResult[];
};

export interface SearchResultsWithPluginName extends SearchResults {
  pluginName: string;
}
