const { Schema, model } = require('mongoose');

const User = new Schema({
  id: {
    type: String,
    required: true
  },

  locale: {
    type: String,
    required: true
  }
});

module.exports = model('User', User);
