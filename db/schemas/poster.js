const { Schema, model } = require('mongoose');

module.exports = model('Poster', new Schema({
  subject: String,
  description: String,
  arrivedAt: Date
}));