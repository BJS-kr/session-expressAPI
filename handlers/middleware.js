const { validateAccessToken, thrower } = require('..');

module.exports = {
  global(req, res, next) {
    res.locals.globalMiddlewareProp = 'string from global middleware';
    next();
  },

  timeOfArrival: (req, res, next) => {
    req.body.arrivedAt = Date.now();
    next();
  },

  validator(req, res, next) {
    const [authType, accessToken] = req.headers.authorization.split(' ');
    try {
      authType === 'Bearer'
        ? validateAccessToken(accessToken)
        : thrower({ message: 'Auth type is not Bearer' });
      next();
    } catch (e) {
      console.error(e);
      res.sendStatus(400);
    }
  },
};
