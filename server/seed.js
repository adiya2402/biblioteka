const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const initialBooks = [
  { id: 1, title: '1984', author: 'Джордж Оруэлл', description: 'Роман-антиутопия...', genre: 'Роман', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200' },
  { id: 2, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', description: 'Роман, визитная карточка...', genre: 'Роман', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200' },
  { id: 3, title: 'Дюна', author: 'Фрэнк Герберт', description: 'Эпический научно-фантастический роман...', genre: 'Фантастика', coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200' },
  { id: 4, title: 'Убить пересмешника', author: 'Харпер Ли', description: 'Воспитательный роман об Америке...', genre: 'Роман', coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=200' },
  { id: 5, title: 'Гарри Поттер и философский камень', author: 'Дж.К. Роулинг', description: 'Первая книга о юном волшебнике...', genre: 'Фэнтези', coverUrl: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=200' },
  { id: 6, title: 'Властелин колец', author: 'Дж.Р.Р. Толкин', description: 'Классическое христианское фэнтези...', genre: 'Фэнтези', coverUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=200' },
  { id: 7, title: 'Автостопом по галактике', author: 'Дуглас Адамс', description: 'Юмористическая фантастика...', genre: 'Фантастика', coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200' },
  { id: 8, title: 'Краткая история времени', author: 'Стивен Хокинг', description: 'Научпоп о космосе, времени и черных дырах...', genre: 'Научпоп', coverUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=200' },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Создаем дефолтного админа
    await User.deleteMany();
    await Book.deleteMany();
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);
    
    // Здесь мы вручную сохраняем без pre-save хука или с ним. 
    // Поскольку мы используем create(), сработает хук mongoose pre('save'), поэтому передаем нехэшированный пароль.
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@bookclub.abc',
      password: 'password123'
    });

    const booksWithUser = initialBooks.map(b => ({
      title: b.title,
      author: b.author,
      description: b.description,
      genre: b.genre,
      coverUrl: b.coverUrl,
      addedBy: adminUser._id
    }));

    await Book.insertMany(booksWithUser);

    console.log('Данные успешно загружены!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка seed:', error);
    process.exit(1);
  }
}

seedDB();
