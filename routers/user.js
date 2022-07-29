const { PATH, tester, accessToken, middleware} = require('../index');


module.exports = function (router) {
  router
  .route(PATH.SAME)
  .get(tester.sameGet)
  .post(tester.samePost);

  router.post(PATH.REGISTER, (req, res) => {
    const { id, password, nickname } = req.body;
    await new model({ id, password, nickname }).save();

    res.sendStatus(201);
  })

  router.post(PATH.SIGN_IN, async (req, res) => {
    const { id, password } = req.body;
    const { nickname } = await model.findOne({ id, password }, 'nickname -_id').exec();
    
    nickname  
    ? res.json({ accessToken: accessToken({ nickname }) })
    : res.sendStatus(400);
  })

  router.get(PATH.VALIDATE, middleware.validator, (req, res) => {
    res.sendStatus(200);
  })

  router.get(
    PATH.THROW, 
    tester.throw
  );

  return router;
}