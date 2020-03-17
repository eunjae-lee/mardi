import { SearchResultsWithPluginName, SearchResult } from 'mardi-helper';
import { getServerPort } from '../util';

export interface Hit extends SearchResult {
  plugin: string;
}

export async function search(query: string): Promise<Hit[]> {
  const serverPort = getServerPort();
  const res = await fetch(
    `http://localhost:${serverPort}/search?query=${encodeURIComponent(query)}`
  );
  const result: SearchResultsWithPluginName[] = await res.json();
  /*
  [
    {
      "plugin": "mardi-plugin-apps",
      "list": [
        {
          "path": "/Applications/BetterTouchTool.app",
          "name": "BetterTouchTool",
          "actionDesc": "Open"
        },
        ...
  */
  return result.flatMap(({ list, pluginName }) =>
    list.map(item => ({
      ...item,
      plugin: pluginName,
    }))
  );
}

export async function runAction(plugin: string, payload: any) {
  const serverPort = getServerPort();
  await fetch(
    `http://localhost:${serverPort}/action?plugin=${encodeURIComponent(
      plugin
    )}&payload=${encodeURIComponent(JSON.stringify(payload))}`
  );
}
