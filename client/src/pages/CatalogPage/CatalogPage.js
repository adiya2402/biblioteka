import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './CatalogPage.css';

const GENRES = ['Все', 'Роман', 'Фантастика', 'Фэнтези', 'Научпоп'];

const CatalogPage = ({ notify }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Все');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const delayDebounceData = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(delayDebounceData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, genre, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({ search, genre, page, limit: 8 });
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      notify('Ошибка загрузки каталога', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="catalog-page">
      <section className="catalog-controls">
        <input 
          type="text" 
          placeholder="Поиск по названию..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <div className="genre-filter">
          {GENRES.map(g => (
            <button 
              key={g} 
              className={`genre-btn ${genre === g ? 'active' : ''}`}
              onClick={() => { setGenre(g); setPage(1); }}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="book-grid">
            {books.length > 0 ? (
              books.map(book => (
                <BookCard key={book._id} book={book} onClick={setSelectedBook} />
              ))
            ) : (
              <p className="no-books">Книги не найдены.</p>
            )}
          </section>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Назад</button>
              <span>{page} из {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Вперед</button>
            </div>
          )}
        </>
      )}

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          notify={notify}
        />
      )}
    </main>
  );
};

export default CatalogPage;
