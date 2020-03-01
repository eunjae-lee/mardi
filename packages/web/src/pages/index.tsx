import React, { useState } from 'react';
import { SearchResultsWithPluginName } from 'mardi-helper';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { getServerPort } from '../util';

type SearchResultItem = {
  plugin: string;
  title: string;
  description?: string;
  payload?: any;
};

const IndexPage = () => {
  const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);
  const serverPort = getServerPort();

  const search = async (event: any) => {
    const query = event.target.value;
    const res = await fetch(
      `http://localhost:${serverPort}/search?query=${encodeURIComponent(query)}`
    );
    const result: SearchResultsWithPluginName[] = await res.json();
    /*
    [
      {
        "plugin": "mardi-plugin-app-launcher",
        "list": [
          {
            "path": "/Applications/BetterTouchTool.app",
            "name": "BetterTouchTool",
            "actionDesc": "Open"
          },
          ...
    */

    setSearchResult(
      result.flatMap(({ list, pluginName }) =>
        list.map(item => ({
          ...item,
          plugin: pluginName,
        }))
      )
    );
  };

  const action = async (plugin: string, payload: any) => {
    await fetch(
      `http://localhost:${serverPort}/action?plugin=${encodeURIComponent(
        plugin
      )}&payload=${encodeURIComponent(JSON.stringify(payload))}`
    );
  };

  return (
    <Layout className="bg-gray-900">
      <SEO title="Home" />
      <input
        onChange={search}
        className="outline-none border-none py-4 px-6 block w-full appearance-none leading-normal text-3xl text-gray-100 bg-transparent"
      />
      <div className="">
        {searchResult.map(({ plugin, title, description, payload }, index) => (
          <div key={index} className="px-6 py-4 hover:bg-gray-800">
            <p className="text-xl text-gray-500">
              <button
                className="focus:outline-none"
                onClick={() => action(plugin, payload)}
              >
                {title}
              </button>
            </p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default IndexPage;
