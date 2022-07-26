const { getRouter } = require('../index');
const poster = require('./poster');
const tester = require('./user');

function makeRouter(...routerFns) {
  return routerFns.map(fn => fn(getRouter()))
}

module.exports = makeRouter(poster, tester);