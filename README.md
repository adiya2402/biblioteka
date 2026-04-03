# BookClub AITU — Веб-платформа книжного клуба

Full-stack приложение книжного клуба, разработанное с использованием стека MERN (MongoDB, Express, React, Node.js).

## Функционал
- **Авторизация и регистрация** (JWT, bcrypt)
- **CRUD операции с книгами** (Создание, чтение с пагинацией и фильтрами, обновление, удаление)
- **Комментарии и обсуждения** (Для каждой книги и общий чат)
- **Профиль пользователя** с загрузкой аватара (Multer)
- **Статистика платформы** с расчетом самой обсуждаемой книги (MongoDB Aggregation)
- **Респонсивный дизайн** с обработкой состояний загрузки и кастомными уведомлениями

## Стек технологий
### Frontend
- React (Hooks, Context API)
- React Router (навигация)
- Axios (HTTP клиенты и Interceptors)
- Ванильный CSS (Flexbox, CSS Variables, Animations)

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (хеширование паролей)
- Multer (загрузка файлов)
- express-validator (валидация данных запроса)

## Установка и запуск (Локально)

### 1. Клонирование и установка зависимостей
```bash
git clone <repository-url>

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Заполнение `.env`
В папке `server/` создайте `.env` файл:
```env
MONGO_URI=mongodb://127.0.0.1:27017/biblioteka
JWT_SECRET=super_secret_jwt_key_123
PORT=5000
CLIENT_URL=http://localhost:3000
```
В папке `client/` создайте `.env` файл:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Инициализация базы данных (опционально)
```bash
cd server
node seed.js
```
*Создаст дефолтную базу из 8 книг и пользователя admin@bookclub.abc (пароль: password123)*

### 4. Запуск
```bash
# Запуск сервера
cd server
npm start          # Запустит на http://localhost:5000

# Запуск клиента (в отдельном терминале)
cd client
npm start          # Запустит на http://localhost:3000
```

## API Эндпоинты

### Auth (`/api/auth`)
| Метод | Путь       | Auth | Тело запроса                   | Назначение |
|-------|------------|------|--------------------------------|-----------|
| POST  | `/register`| ❌    | `{name, email, password}`      | Регистрация и получение токена |
| POST  | `/login`   | ❌    | `{email, password}`            | Вход и получение токена |
| GET   | `/me`      | ✅    | -                              | Получение данных текущего пользователя |

### Books (`/api/books`)
| Метод | Путь       | Auth | Тело запроса                   | Назначение |
|-------|------------|------|--------------------------------|-----------|
| GET   | `/`        | ❌    | `?page=1&limit=10&genre=&search=` | Список книг (с пагинацией) |
| POST  | `/`        | ✅    | `{title, author, desc, genre, coverUrl}`| Добавить новую книгу |
| PUT   | `/:id`     | ✅    | `{...обновляемые поля}`        | Изменить свою книгу |
| DELETE| `/:id`     | ✅    | -                              | Удалить свою книгу |

### Comments (`/api/comments`)
| Метод | Путь       | Auth | Тело запроса | Назначение |
|-------|------------|------|--------------|-----------|
| GET   | `/:bookId` | ❌    | -            | Получить комментарии к книге (или "general")|
| POST  | `/:bookId` | ✅    | `{text}`     | Добавить комментарий |
| DELETE| `/:id`     | ✅    | -            | Удалить свой комментарий |

### Users (`/api/users`)
| Метод | Путь       | Auth | Тело запроса | Назначение |
|-------|------------|------|--------------|-----------|
| POST  | `/avatar`  | ✅    | `multipart/form-data (avatar)` | Загрузить аватар (JPG, PNG до 2MB) |

### Stats (`/api/stats`)
| Метод | Путь       | Auth | Тело запроса | Назначение |
|-------|------------|------|--------------|-----------|
| GET   | `/`        | ❌    | -            | Статистика (кол-во пользователей, книг, топ-книга) |

---
*Created by Antigravity*
