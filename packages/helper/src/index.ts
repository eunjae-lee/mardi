import orgOpen from 'open';

export async function open(target: string) {
  await orgOpen(target);
}

export type SearchResult = {
  title: string;
  description?: string;
  context?: any;
};

export type SearchResults = {
  pluginName: string;
  list: SearchResult[];
  actionDesc: string;
};
