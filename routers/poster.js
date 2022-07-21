const { PATH, poster, middleware, postModel } = require('../index');

module.exports = function (router) {
  router.post(
  PATH.POST, 
  middleware.timeOfArrival, 
  poster.addPost(postModel)
  );

  router.get(
    PATH.POSTS, 
    poster.getPosts(postModel)
  );

  router.get(
    PATH.POST,
    poster.getPost(postModel)
  );

  router.delete(
    PATH.POST, 
    poster.deletePost(postModel)
  );

  router.patch(
    PATH.POST, 
    poster.partialUpdatePost(postModel)
  );

  router.put(
    PATH.POST, 
    middleware.timeOfArrival, 
    poster.wholeUpdatePost(postModel)
  );

  return router;
}


