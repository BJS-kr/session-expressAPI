const { Schema, model } = require('mongoose');

module.exports = model('Test', new Schema({
  subject: String,
  description: String,
  arrivedAt: Date
}));