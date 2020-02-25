import Koa from 'koa';
import cors from '@koa/cors';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import { config } from 'mardi-shared';
import { search, action } from './routes';

const { defaultServerPort } = config;

const app = new Koa();
app.use(cors());
app.use(json());
app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (error, ctx) => {
  console.error({ error, ctx });
});

app.use(
  new Router()
    .get('/search', search)
    .get('/action', action)
    .routes()
);

export default ({ port = defaultServerPort }) => {
  app.listen(port);
};
