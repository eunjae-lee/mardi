import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useStateMachine, autocomplete } from '../fsm';
import { search, runAction, Hit } from '../api';

const IndexPage = () => {
  const { context, send, setActions } = useStateMachine(autocomplete);
  setActions({
    search: async ({ data: { query } }) => {
      const hits = await search(query);
      send({ type: 'FETCHED', data: { hits } });
    },
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'INPUT', data: { query: event.target.value } });
  };

  return (
    <Layout className="bg-gray-900">
      <SEO title="Home" />
      <input
        onChange={onChange}
        spellCheck={false}
        className="outline-none border-none py-4 px-6 block w-full appearance-none leading-normal text-3xl text-gray-100 bg-transparent"
      />
      {/* <pre className="bg-white">{JSON.stringify(state, null, 2)}</pre>
      <pre className="bg-white">{JSON.stringify(context, null, 2)}</pre> */}
      <div className="">
        {(((context || {}) as any).hits || []).map(
          ({ plugin, title, description, payload }: Hit, index: number) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-800">
              <p className="text-xl text-gray-500">
                <button
                  className="focus:outline-none"
                  onClick={() => runAction(plugin, payload)}
                >
                  {title}
                </button>
              </p>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
