const { PATH, common, middleware, useGlobalMiddleware, json, PORT, connect, home, useErrorHandler, useRouter, listen, router } = require('./index');
const routers = require('./routers/index');

async function bootstrap() {
  process.on('SIGINT', () => {
    require('child_process').exec('docker compose down', () => {
      process.exit(1);
    })
  });

  await connect().catch(e => {
    throw e;
  });
  
  home(PATH.ROOT, common.main);

  useGlobalMiddleware(json);
  useGlobalMiddleware(middleware.global);

  useRouter(PATH.API, routers);

  useErrorHandler(common.error);

  listen(PORT, common.listen(routers));
}

bootstrap();
