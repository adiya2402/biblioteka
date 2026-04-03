const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только файлы изображений разрешены'));
    }
  }
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const { CLIENT_URL = 'http://localhost:5000' } = process.env;
    let baseUrl = CLIENT_URL;
    if (baseUrl.includes('localhost:3000')) {
      baseUrl = 'http://localhost:5000';
    }

    // В продакшене (например, на Render), CLIENT_URL может быть URL клиента, а сервер крутится на другом URL.
    // Лучше отдавать относительный путь, или пусть сервер определяет свой хост.
    // Для простоты будем хранить относительный путь или полный URL сервера.
    // Сохраняем `/uploads/filename.ext`
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    req.user.avatar = avatarUrl;
    await req.user.save();

    res.json({ avatar: avatarUrl, message: 'Аватар обновлен' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' });
  }
});

module.exports = router;
