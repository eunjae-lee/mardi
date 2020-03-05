import orgOpen from 'open';
import clipboardy from 'clipboardy';

export async function open(target: string) {
  await orgOpen(target);
}

export function copyToClipboard(text: string) {
  clipboardy.writeSync(text);
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
