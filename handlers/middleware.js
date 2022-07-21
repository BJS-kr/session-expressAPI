module.exports = {
  global: (request, response, next) => {
    response.locals.globalMiddlewareProp = 'string from global middleware'
    next();
  },

  inRouter: (request, response, next) => {
    response.locals.middlewareProp = 'hi! hello!';
    next();
  },

  timeOfArrival:(req, res, next) => {
    req.body.arrivedAt = Date.now();
    next();
  }
}

