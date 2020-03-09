import execa from 'execa';
import plist from 'simple-plist';
import { open, SearchResult, SearchResults } from 'mardi-helper';
import { basename } from 'path';

type PathWithNames = {
  path: string;
  name: string;
  bundleName?: string;
  normalizedName1: string;
  normalizedName2?: string;
};

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}

async function search(query: string): Promise<SearchResults> {
  // `-maxdepth 2` -> In order to get `/Applications/Utilities/*.app`
  // If it's too big, it will get things like
  // /Applications/Notion.app/Contents/Frameworks/Notion Helper.app
  const systemApps = await getPaths(
    `find /Applications -iname *.app -maxdepth 2`
  );
  const userApps = await getPaths(
    `find ${process.env.HOME}/Applications -iname *.app -maxdepth 1`
  );
  const paths = systemApps.concat(userApps);

  const pathsWithNames: PathWithNames[] = (
    await Promise.all(paths.map(getAppName))
  ).filter(notNull);

  const list: SearchResult[] = pathsWithNames
    .filter(({ normalizedName1, normalizedName2 }) => {
      return (
        normalizedName1.includes(normalize(query)) ||
        (normalizedName2 && normalizedName2.includes(normalize(query)))
      );
    })
    .map(
      ({ path, name }): SearchResult => ({
        title: name,
        description: path,
        payload: {
          path,
        },
      })
    );
  return {
    list,
  };
}

async function runAction({ path }: { path: string }) {
  await open(path);
}

async function getPaths(command: string) {
  return (await safeCommand(command))
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.endsWith('.app'));
}

function getAppName(path: string): Promise<PathWithNames | null> {
  return new Promise(resolve => {
    plist.readFile(`${path}/Contents/Info.plist`, (err: any, data: any) => {
      if (err || !data.CFBundleName) {
        resolve(null);
      } else {
        const name = basename(path, '.app');
        const bundleName = data.CFBundleName;
        resolve({
          path,
          name,
          bundleName,
          normalizedName1: normalize(name),
          normalizedName2: bundleName && normalize(bundleName),
        });
      }
    });
  });
}

function normalize(name: string) {
  return name.toLowerCase().replace(/\s/g, '');
}

async function safeCommand(command: string, options = {}) {
  try {
    const { stdout } = await execa.command(command, options);
    return stdout;
  } catch (e) {
    return '';
  }
}

module.exports = {
  search,
  runAction,
};
