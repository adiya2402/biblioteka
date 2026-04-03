const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const booksCount = await Book.countDocuments();
    const commentsCount = await Comment.countDocuments();

    // Топ книга по комментариям (через aggregation)
    const topBooks = await Comment.aggregate([
      { $match: { book: { $exists: true } } },
      { $group: { _id: '$book', commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1 } },
      { $limit: 1 }
    ]);

    let topBook = null;
    if (topBooks.length > 0) {
      topBook = await Book.findById(topBooks[0]._id).populate('addedBy', 'name');
    }

    res.json({
      users: usersCount,
      books: booksCount,
      comments: commentsCount,
      topBook: topBook ? { ...topBook.toObject(), commentCount: topBooks[0].commentCount } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения статистики' });
  }
});

module.exports = router;
