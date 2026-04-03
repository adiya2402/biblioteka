import React, { useState, useMemo } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('catalog'); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("Все");
  const [commentText, setCommentText] = useState("");
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });

  // Единое хранилище комментариев
  const [allComments, setAllComments] = useState([
    { id: 1, bookTitle: "Путь Абая", user: "Admin", text: "Это классика, которую должен прочесть каждый студент!", date: "01.04.2026" },
    { id: 2, bookTitle: "1984", user: "Daulet_IT", text: "Сильное произведение, заставляет задуматься.", date: "02.04.2026" }
  ]);

  const [books] = useState([
    { 
      _id: 1, title: "Путь Абая", author: "Мухтар Ауэзов", genre: "Классика", rating: 4.9, 
      description: "Эпический роман-эпопея, всесторонне рисующий жизнь казахского общества во второй половине XIX века. В центре повествования — образ великого поэта и мыслителя Абая, чья жизнь показана в неразрывной связи с судьбой народа. Это произведение считается энциклопедией жизни кочевого народа.", 
      image: "https://akniga.org/uploads/media/topic/2023/02/09/06/preview/bc795a75c3dfc97431d6_400x.jpg", bookUrl: "#" 
    },
    { 
      _id: 2, title: "1984", author: "Джордж Оруэлл", genre: "Антиутопия", rating: 4.8, 
      description: "Роман о тоталитарном мире будущего, где личность подавляется государством. История Уинстона Смита, который пытается сохранить свою человечность в условиях абсолютной несвободы и постоянного надзора 'Большого Брата'. Книга-предостережение, не теряющая актуальности.", 
      image: "https://s.f.kz/prod/1996/1995835_1000.jpg", bookUrl: "#" 
    },
    { 
      _id: 3, title: "Мастер и Маргарита", author: "Михаил Булгаков", genre: "Мистика", rating: 5.0, 
      description: "Уникальное сочетание сатиры, философии и мистики. В Москву 30-х годов прибывает Воланд со своей свитой, устраивая переполох среди обывателей. Параллельно развивается история великой любви Мастера и Маргариты, а также библейская линия о Понтии Пилате.", 
      image: "https://s3-goods.ozstatic.by/1000/124/114/101/101114124_0.jpg", bookUrl: "#"
    },
    { 
      _id: 4, title: "Алхимик", author: "Пауло Коэльо", genre: "Философия", rating: 4.5, 
      description: "Вдохновляющая история о пастухе Сантьяго, который отправляется в Египет на поиски сокровищ. В пути он учится слышать 'язык мира' и осознает, что самое главное сокровище — это следовать своей Своей Судьбе и слушать свое сердце.", 
      image: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg", bookUrl: "#"
    },
    { 
      _id: 5, title: "Цветы для Элджернона", author: "Дэниел Киз", genre: "Драма", rating: 4.7, 
      description: "Глубокое психологическое произведение о человеке с задержкой развития, который становится гением после экспериментальной операции. Книга поднимает вопросы ответственности науки, одиночества высокого интеллекта и ценности человеческой личности.", 
      image: "https://cdn.eksmo.ru/v2/ITD000000001383451/COVER/cover1__w820.jpg", bookUrl: "#"
    },
    { 
      _id: 6, title: "Маленький принц", author: "Антуан де Сент-Экзюпери", genre: "Сказка", rating: 4.9, 
      description: "Самое известное произведение Экзюпери. Маленький мальчик путешествует с планеты на планету, познавая мир, взрослых и истинные ценности. История о том, что 'самого главного глазами не увидишь' и что мы навсегда в ответе за тех, кого приручили.", 
      image: "https://s.f.kz/prod/2886/2885199_1000.jpg", bookUrl: "#"
    },
    { 
      _id: 7, title: "Портрет Дориана Грея", author: "Оскар Уайльд", genre: "Классика", rating: 4.6, 
      description: "Философский роман о юноше, чей портрет берет на себя все тяготы времени и пороков, оставляя оригинал вечно молодым. Книга исследует границы морали, эстетизма и разрушительную силу эгоизма и погони за вечными удовольствиями.", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSiqqq3_jSAY2alr-kF5dYQtHX3oaY6_mxWg&s", bookUrl: "#"
    },
    { 
      _id: 8, title: "Мартин Иден", author: "Джек Лондон", genre: "Роман", rating: 4.8, 
      description: "История о моряке, который благодаря железной воле и стремлению к знаниям становится знаменитым писателем. Трагический путь человека, который разочаровывается в обществе, ради которого он совершил свой интеллектуальный подвиг.", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7rUvKmCFtajagzkYByHVi0iGoqPJ_9vju_A&s", bookUrl: "#"
    }
  ]);

  const filteredBooks = useMemo(() => {
    return books.filter(b => 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterGenre === "Все" || b.genre === filterGenre)
    );
  }, [searchTerm, filterGenre, books]);

  const stats = useMemo(() => {
    const counts = allComments.reduce((acc, c) => {
      acc[c.bookTitle] = (acc[c.bookTitle] || 0) + 1;
      return acc;
    }, {});
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "Общий чат");
    return {
      users: user ? 124 : 123,
      comments: allComments.length,
      popular: top
    };
  }, [allComments, user]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const finalName = authData.name || authData.email.split('@')[0];
    setUser(finalName);
    setShowAuth(false);
    setAuthData({ name: '', email: '', password: '' });
  };

  const addComment = (title) => {
    if (!user) return setShowAuth(true);
    if (!commentText.trim()) return;
    const newMsg = {
      id: Date.now(),
      bookTitle: title || "Общий чат",
      user: user,
      text: commentText,
      date: new Date().toLocaleDateString()
    };
    setAllComments([newMsg, ...allComments]);
    setCommentText("");
  };

  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav">
          <div className="logo" onClick={() => setActiveTab('catalog')}>BookClub AITU</div>
          <div className="nav-links">
            <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>Библиотека</button>
            <button className={activeTab === 'discussion' ? 'active' : ''} onClick={() => setActiveTab('discussion')}>Обсуждение</button>
            <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Статистика</button>
            {user ? <span className="user-pill">● {user}</span> : <button className="btn-auth" onClick={() => setShowAuth(true)}>Войти</button>}
          </div>
        </nav>
      </header>

      <main>
        {activeTab === 'catalog' && (
          <div className="fade-in">
            <div className="search-section">
              <input type="text" placeholder="Поиск книги по названию..." onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="genre-filters">
                {["Все", "Классика", "Антиутопия", "Мистика", "Философия", "Драма", "Роман", "Сказка"].map(g => (
                  <span key={g} className={filterGenre === g ? 'g-tag active' : 'g-tag'} onClick={() => setFilterGenre(g)}>{g}</span>
                ))}
              </div>
            </div>
            <div className="book-grid">
              {filteredBooks.map(book => (
                <div key={book._id} className="book-card" onClick={() => setSelectedBook(book)}>
                  <div className="img-container">
                    <img src={book.image} alt={book.title} />
                    <div className="card-overlay"><span>Подробнее</span></div>
                  </div>
                  <div className="card-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <div className="card-footer">
                      <span className="rating">⭐ {book.rating}</span>
                      <span className="genre">{book.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="discussion-layout fade-in">
            <div className="chat-window">
              <h2>Сообщения сообщества</h2>
              <div className="messages-list">
                {allComments.map(c => (
                  <div key={c.id} className="msg-bubble">
                    <div className="msg-header"><strong>{c.user}</strong> <span>обсуждает «{c.bookTitle}»</span></div>
                    <p>{c.text}</p>
                    <small>{c.date}</small>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <textarea placeholder="Ваше сообщение в общий чат..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <button onClick={() => addComment("Общий чат")}>Отправить</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-container fade-in">
            <h2>Аналитика Клуба</h2>
            <div className="stats-cards">
              <div className="s-card"><h3>{stats.users}</h3><p>Активных читателей</p></div>
              <div className="s-card"><h3>{stats.comments}</h3><p>Всего мнений</p></div>
              <div className="s-card wide">
                <h3>🏆 Самая обсуждаемая книга</h3>
                <h2 style={{color: '#e67e22', marginTop: '10px'}}>{stats.popular}</h2>
                <div className="fake-chart"><div className="fill" style={{width: '85%'}}></div></div>
              </div>
            </div>
          </div>
        )}

        {selectedBook && (
          <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-x" onClick={() => setSelectedBook(null)}>×</button>
              <div className="modal-flex">
                <div className="m-left">
                  <img src={selectedBook.image} alt={selectedBook.title} />
                  <a href={selectedBook.bookUrl} target="_blank" rel="noreferrer" className="read-btn">Читать оригинал</a>
                </div>
                <div className="m-right">
                  <h2>{selectedBook.title}</h2>
                  <p className="m-author">Автор: {selectedBook.author}</p>
                  <p className="modal-desc">{selectedBook.description}</p>
                  
                  <div className="book-chat-mini">
                    <h4>Мнения студентов:</h4>
                    <div className="mini-msgs">
                      {allComments.filter(c => c.bookTitle === selectedBook.title).length > 0 ? 
                        allComments.filter(c => c.bookTitle === selectedBook.title).map(c => (
                          <div key={c.id} className="mini-msg"><strong>{c.user}:</strong> {c.text}</div>
                        )) : <p style={{fontSize: '0.8rem', color: '#999'}}>Пока нет отзывов. Будьте первым!</p>
                      }
                    </div>
                    <div className="mini-input">
                      <textarea placeholder="Ваш отзыв..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                      <button onClick={() => addComment(selectedBook.title)}>Ok</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAuth && (
          <div className="modal-backdrop" onClick={() => setShowAuth(false)}>
            <div className="auth-card" onClick={e => e.stopPropagation()}>
              <button className="close-x" onClick={() => setShowAuth(false)}>×</button>
              <h2>{isLogin ? "С возвращением!" : "Регистрация"}</h2>
              <form onSubmit={handleAuthSubmit} className="auth-form">
                {!isLogin && (
                  <div className="input-group">
                    <label>Имя Фамилия</label>
                    <input type="text" placeholder="Имя" required value={authData.name} onChange={(e) => setAuthData({...authData, name: e.target.value})} />
                  </div>
                )}
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="example@stu.aitu.kz" required value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Пароль</label>
                  <input type="password" placeholder="••••••••" required value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} />
                </div>
                <button type="submit" className="btn-main auth-submit">{isLogin ? "Войти" : "Создать аккаунт"}</button>
              </form>
              <div className="auth-toggle">
                {isLogin ? "Нет аккаунта?" : "Уже зарегистрированы?"} 
                <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? " Регистрация" : " Войти"}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p><strong>Разработчик:</strong> Medhat Adiya Aidarkyzy | Astana IT University</p>
      </footer>
    </div>
  );
}

export default App;