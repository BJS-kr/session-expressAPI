module.exports = {
  middlewareTest(req, res) {
    
  },

  addPost(model) {
    return async (req, res) => {
      const { subject, description, arrivedAt } = req.body;

      await new model({ subject, description, arrivedAt }).save();
    
      res.send('add post request success!');
    }
  },

  getPosts(model) {
    return async (req, res) => {
      const posts = await model.find()
      
      res.json({ posts });
    }
  },

  getPost(model) {
    return async (req, res) => {
      const { id } = req.body;
      const post = await model.findById(id);
      
      res.json({ post });
    }
  },

  partialUpdatePost(model) {
    return async (req, res) => {
      const { id, description } = req.body;
      const post = await model.findByIdAndUpdate(id, { description }, { returnDocument: 'after' });
      
      res.json({ post });
    }
  },

  wholeUpdatePost(model) {
    return async (req, res) => {
      const { id, subject, description, arrivedAt } = req.body;
      const post = await model.findByIdAndUpdate(id, { subject, description, arrivedAt }, { returnDocument: 'after' });
      
      res.json({ post });
    }
  },

  deletePost(model) {
    return async (req, res) => {
      const { id } = req.body;
      await model.findByIdAndDelete(id);
      
      res.send('post delete success!')
    }
  },
}