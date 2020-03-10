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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  },  
  modifiedAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

module.exports = mongoose.model('Post', postSchema);
