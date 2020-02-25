import Koa from 'koa';

export async function action(context: Koa.ParameterizedContext) {
  const { plugin, payload } = context.query;
  console.log(JSON.parse(payload));
  context.body = '';
  await require(plugin).runAction(JSON.parse(payload));
}
