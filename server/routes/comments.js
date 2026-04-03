const express = require('express');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const router = express.Router({ mergeParams: true }); // Для вложенных роутов, если бы они были. Но мы юзаем параметры.

// GET /api/comments/:bookId (или "general" как bookId)
router.get('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    let query = {};
    if (bookId === 'general') {
      query = { book: { $exists: false } }; // Мы можем договориться: если нет book, это общий чат
    } else {
      query = { book: bookId };
    }

    const comments = await Comment.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/comments/:bookId
router.post('/:bookId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const { bookId } = req.params;

    const newComment = new Comment({
      text,
      user: req.user._id,
      book: bookId === 'general' ? undefined : bookId
    });

    await newComment.save();
    
    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Комментарий не найден' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await comment.deleteOne();
    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
