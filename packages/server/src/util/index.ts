import fs from 'fs';
import path from 'path';
import userHome from 'user-home';
import mkdirp from 'mkdirp';

export function saveCache(name: string, cache: any) {
  const cacheFilePath = getCacheFilePath(name);
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache));
}

export function loadCache(name: string) {
  if (!require(name).buildCache) {
    return null;
  }
  const cacheFilePath = getCacheFilePath(name);
  if (fs.existsSync(cacheFilePath)) {
    return JSON.parse(fs.readFileSync(cacheFilePath).toString());
  } else {
    return null;
  }
}

let dirReady = false;

function getCacheDirPath() {
  const cachePath = path.resolve(userHome, '.mardi', 'cache');
  if (!dirReady) {
    mkdirp.sync(cachePath);
    dirReady = true;
  }
  return cachePath;
}

function getCacheFilePath(name: string) {
  return path.resolve(getCacheDirPath(), `${name}.json`);
}
