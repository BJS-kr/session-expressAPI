const express = require('express');
const app = express(); 
const useGlobalMiddleware = useErrorHandler = useRouter = app.use.bind(app);

function getRouter() {
  return require('express').Router();
}

module.exports = {
  PATH: require('./path'),
  common: require('./handlers/common'),
  poster: require('./handlers/poster'),
  tester: require('./handlers/tester'),
  middleware: require('./handlers/middleware'),
  connect: require('./db/connection'),
  postModel: require('./db/schema'),
  home: app.get.bind(app),
  listen: app.listen.bind(app),
  json: express.json(),
  useGlobalMiddleware: useGlobalMiddleware,
  useErrorHandler: useErrorHandler,
  useRouter,
  PORT: 9999,
  getRouter
}

