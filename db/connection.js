const mongoose = require('mongoose');

module.exports = function () {
  return mongoose.connect('mongodb://127.0.0.1:27017', { dbName:'test', user:'test', pass:'test' })
    .then(
      _ => console.log('> successfully opened the database <')
    )
    .catch(
      e => console.log('> error occurred while connecting <\n', e)
    )
}


