const { log } = console;

module.exports = {
  sameGet(req, res)  {
    log(res.locals.globalMiddlewareProp)
    res.send('get request responded!')
  },

  samePost(req, res) {
    log(res.locals.globalMiddlewareProp)
    res.send('post request responded!')
  },

  throw(req, res) {
    throw { message: 'intended Error', session: 'node' }
  }
}