const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' } // if null or "general", we can handle it differently, or just use string. But let's use ObjectId for book and for general discussion we can use a special ID or just a special route. For now, we allow required false to handle 'general' discussion.
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
