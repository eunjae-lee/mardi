#!/usr/bin/env node

const getPort = require('get-port');
const { config } = require('mardi-shared');
const { defaultServerPort } = config;
const server = require('./dist').default;

(async function() {
  const port = await getPort({ port: defaultServerPort });
  server({ port });
})();
