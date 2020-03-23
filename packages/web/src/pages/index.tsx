import React from 'react';
import { Search as SearchIcon } from 'react-feather';
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
    scrollHighlightedIntoView: ({ context: { highlightedIndex } }) => {
      document
        .querySelectorAll('.hits .hit')
        [highlightedIndex!].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
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
      const { plugin, payload } = context.hits[context.highlightedIndex!];
      event.preventDefault();
      runAction(plugin, payload);
    }
  };

  const hits = ((context || {}) as any).hits || [];
  return (
    <Layout className="flex flex-col h-screen">
      <SEO />
      <div className="border-b flex flex-row">
        <SearchIcon size={36} color="#999999" className="ml-4 mt-5" />
        <input
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck={false}
          className="outline-none border-none py-4 pl-4 pr-6 block w-full appearance-none leading-normal text-3xl text-gray-800 bg-white"
          autoFocus
        />
      </div>
      {hits.length > 0 && (
        <div className="hits overflow-y-scroll overflow-x-hidden">
          {hits.map(
            ({ plugin, title, description, payload }: Hit, index: number) => (
              <button
                type="button"
                key={index}
                className={`hit block w-full text-left px-6 py-4 ${
                  ((context || {}) as any).highlightedIndex === index
                    ? 'bg-gray-300'
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
                <p className="text-xl text-gray-700">{title}</p>
                <p className="text-sm text-gray-800">{description}</p>
              </button>
            )
          )}
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
