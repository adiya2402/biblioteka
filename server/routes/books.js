const express = require('express');
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const router = express.Router();

// GET /api/books (пагинация, фильтр по жанру, поиск по названию)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, search } = req.query;
    
    let query = {};
    if (genre && genre !== 'Все') {
      query.genre = genre;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/books
router.post('/', auth, async (req, res) => {
  try {
    const newBook = new Book({
      ...req.body,
      addedBy: req.user._id
    });
    await newBook.save();
    
    // Получаем книгу с populate
    const populatedBook = await Book.findById(newBook._id).populate('addedBy', 'name avatar');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/books/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('addedBy', 'name avatar');
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/books/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await book.deleteOne();
    res.json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
