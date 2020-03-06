import { search } from '../src';

describe('color', () => {
  it('pass', () => {
    expect(search('rgb(1, 2, 3)')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "#010203",
            "title": "#010203",
          },
        ],
      }
    `);

    expect(search('rgba(1, 2, 3, 4)')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "#01020304",
            "title": "#01020304",
          },
        ],
      }
    `);

    expect(search('#ffbb99')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "rgb(255, 187, 153)",
            "title": "rgb(255, 187, 153)",
          },
        ],
      }
    `);

    expect(search('#ffbb99dd')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "rgba(255, 187, 153, 221)",
            "title": "rgba(255, 187, 153, 221)",
          },
        ],
      }
    `);

    expect(search('#ffbb99 * 0.3')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "#ffbb994c",
            "title": "#ffbb994c",
          },
          Object {
            "payload": "rgba(255, 187, 153, 0.3)",
            "title": "rgba(255, 187, 153, 0.3)",
          },
        ],
      }
    `);

    expect(search('#ffddff *')).toMatchInlineSnapshot(`
      Object {
        "list": Array [],
      }
    `);

    expect(search('#ddff00')).toMatchInlineSnapshot(`
      Object {
        "list": Array [
          Object {
            "payload": "rgb(221, 255, 0)",
            "title": "rgb(221, 255, 0)",
          },
        ],
      }
    `);
  });
});
