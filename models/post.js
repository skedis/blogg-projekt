const mongoose = require('mongoose');

// Schema
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Post', postSchema);
