import React from 'react';
import CommentSection from '../CommentSection/CommentSection';
import './BookModal.css';

const BookModal = ({ book, onClose, notify }) => {
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <div className="modal-header">
            <img src={book.coverUrl} alt={book.title} className="modal-cover" loading="lazy" />
            <div className="modal-info">
              <h2>{book.title}</h2>
              <p className="modal-author">{book.author}</p>
              <span className="modal-genre">{book.genre}</span>
              <p className="modal-desc">{book.description}</p>
              <div className="modal-added-by">
                Добавил(а): {book.addedBy?.name || 'Админ'}
              </div>
            </div>
          </div>
          
          <div className="modal-comments-section">
            <CommentSection bookId={book._id} notify={notify} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
