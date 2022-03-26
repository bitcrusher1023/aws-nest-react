const { bootstrap } = require('./dist/bootstrap');
const serverlessExpress = require('@vendia/serverless-express');

let server;

async function createServerlessExpress() {
  const app = await bootstrap();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

module.exports = {
  async handler(event, context, callback) {
    server = server ?? (await createServerlessExpress());
    return server(event, context, callback);
  },
};
