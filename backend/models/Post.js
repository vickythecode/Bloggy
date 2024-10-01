const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Store user IDs of users who liked the post
  comments: [CommentSchema], // Array of comments
}, {
  timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;