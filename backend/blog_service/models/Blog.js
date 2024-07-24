const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  images: {
    type: [String],
    required: false, // Ovo može biti false ako slike nisu obavezne
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'closed'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
