const { log } = console;

function endpoints(routers) {
  const endpoint = routers.map(({ stack }) => stack.map(({ route }) => {
    return route && {path: '/api' + route.path, method: route.stack[0].method}
  })).flatMap(x => x).filter(x => x);

  endpoint.unshift({path:'/', method:'get'});
  return endpoint;
}

module.exports = {
  main(request, response) {
    response.json({ response: 'Welcome to first Node.js Session!' })
  },

  error(err, req, res, next) {
    log(err.message);
    log(err.session === 'node' ? 'session type: node!' : 'session type is not node');

    res.status(500).send('Something broke!');
  },

  listen(routers) {
    return () => {
      log('> successfully opened the server <');
      log('\n☟☟☟☟ endpoints ☟☟☟☟');
      log(endpoints(routers));
    }
  }
}