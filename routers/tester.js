const { PATH, tester } = require('../index');

module.exports = function (router) {
  router
  .route(PATH.SAME)
  .get(tester.sameGet)
  .post(tester.samePost);

  router.get(
    PATH.THROW, 
    tester.throw
  );

  return router;
}