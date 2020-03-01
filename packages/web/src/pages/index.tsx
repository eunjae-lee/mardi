import React, { useState } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { getServerPort } from '../util';

const IndexPage = () => {
  const [searchResult, setSearchResult] = useState([]);
  const serverPort = getServerPort();

  const search = async event => {
    const query = event.target.value;
    const res = await fetch(
      `http://localhost:${serverPort}/search?query=${encodeURIComponent(query)}`
    );
    const result = await res.json();
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
      result.flatMap(({ plugin, list }) =>
        list.map(item => ({ ...item, plugin }))
      )
    );
  };

  const action = async (plugin, payload) => {
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
        {searchResult.map(({ path, name, actionDesc, plugin }, index) => (
          <div key={index} className="px-6 py-4 hover:bg-gray-800">
            <p className="text-xl text-gray-500">
              <button
                className="focus:outline-none"
                onClick={() => action(plugin, { path })}
              >
                {name}
              </button>
            </p>
            <p className="text-sm text-gray-600">{path}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default IndexPage;
