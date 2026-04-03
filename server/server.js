const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к твоей базе (Замени MONGO_URI в .env или тут)
const DB_URL = process.env.MONGO_URI || "mongodb://localhost:27017/bookclub";

mongoose.connect(DB_URL)
  .then(() => console.log('✅ Успешное подключение к MongoDB'))
  .catch(err => console.error('❌ Ошибка подключения:', err));

// Модель книги
const Book = mongoose.model('Book', {
  title: String,
  author: String,
  description: String
});

// Роуты (Эндпоинты API)
app.get('/api/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));