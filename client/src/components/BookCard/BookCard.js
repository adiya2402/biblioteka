import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onClick }) => {
  return (
    <article className="book-card" onClick={() => onClick(book)}>
      <div className="book-cover">
        <img src={book.coverUrl} alt={book.title} loading="lazy" />
        <span className="book-genre-badge">{book.genre}</span>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-desc-short">{book.description.substring(0, 100)}...</p>
      </div>
    </article>
  );
};

export default BookCard;
