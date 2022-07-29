const express = require('express');
const app = express(); 
const useGlobalMiddleware = useErrorHandler = useRouter = app.use.bind(app);
const jwt = require('jsonwebtoken');

function getRouter() {
  return express.Router();
}

function accessToken(payload) {
  return jwt.sign(payload, 'privateKey', {expiresIn: 120, algorithm: 'HS512'});
}

function thrower(obj) {
  throw obj;
}

module.exports = {
  PATH: require('./path'),
  common: require('./handlers/common'),
  poster: require('./handlers/poster'),
  tester: require('./handlers/user'),
  middleware: require('./handlers/middleware'),
  connect: require('./db/connection'),
  postModel: require('./db/schemas/poster'),
  userModel:require('./db/schemas/user'),
  home: app.get.bind(app),
  listen: app.listen.bind(app),
  json: express.json(),
  PORT: 9999,
  accessToken,
  decodeAccessToken:jwt.decode,
  validateAccessToken:jwt.verify,
  useGlobalMiddleware,
  useErrorHandler,
  useRouter,
  getRouter,
  thrower
}

