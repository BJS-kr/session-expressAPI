const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
  id: String,
  password: String,
  nickname: String,
}, { timestamps: true }));