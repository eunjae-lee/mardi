import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useStateMachine, autocomplete } from '../fsm';
import { search, runAction, Hit } from '../api';

const IndexPage = () => {
  const {
    context,
    send,
    setActions,
  }: { context: any; send: Function; setActions: Function } = useStateMachine(
    autocomplete
  );
  setActions({
    search: async ({ data: { query } }) => {
      const hits = await search(query);
      send({ type: 'FETCHED', data: { hits } });
    },
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'INPUT', data: { query: event.target.value } });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 38) {
      // up
      event.preventDefault();
      send('HIGHLIGHT_PREV');
    } else if (event.keyCode === 40) {
      // down
      event.preventDefault();
      send('HIGHLIGHT_NEXT');
    } else if (
      event.keyCode === 13 &&
      context &&
      context.highlightedIndex !== undefined
    ) {
      const { plugin, payload } = context.hits[context.highlightedIndex];
      event.preventDefault();
      runAction(plugin, payload);
    }
  };

  return (
    <Layout className="bg-gray-900">
      <SEO />
      <input
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
        className="outline-none border-none py-4 px-6 block w-full appearance-none leading-normal text-3xl text-gray-100 bg-transparent"
      />
      <div className="">
        {(((context || {}) as any).hits || []).map(
          ({ plugin, title, description, payload }: Hit, index: number) => (
            <button
              type="button"
              key={index}
              className={`block w-full text-left px-6 py-4 ${
                ((context || {}) as any).highlightedIndex === index
                  ? 'bg-gray-800'
                  : ''
              }`}
              onClick={() => runAction(plugin, payload)}
              onMouseEnter={() => {
                send({
                  type: 'HIGHLIGHT_SPECIFIC_INDEX',
                  data: { specificIndex: index },
                });
              }}
            >
              <p className="text-xl text-gray-500">{title}</p>
              <p className="text-sm text-gray-600">{description}</p>
            </button>
          )
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
