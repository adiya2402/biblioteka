import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './CommentSection.css';

const CommentSection = ({ bookId, notify }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.getComments(bookId);
      setComments(res.data);
    } catch (error) {
      console.error(error);
      notify && notify('Ошибка загрузки комментариев', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await api.addComment(bookId, newComment);
      setComments([res.data, ...comments]);
      setNewComment('');
      notify && notify('Комментарий добавлен', 'success');
    } catch (error) {
      console.error(error);
      notify && notify('Ошибка при добавлении', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteComment(id);
      setComments(comments.filter(c => c._id !== id));
      notify && notify('Комментарий удален', 'success');
    } catch (error) {
      console.error(error);
      notify && notify('Ошибка при удалении', 'error');
    }
  };

  return (
    <div className="comment-section">
      <h3>Обсуждение</h3>
      
      {user ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            rows="3"
          />
          <button type="submit" disabled={!newComment.trim()}>Отправить</button>
        </form>
      ) : (
        <div className="login-prompt">Войдите, чтобы оставить комментарий</div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">Пока нет сообщений</div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-user">
                    {comment.user?.avatar ? (
                      <img src={comment.user.avatar} alt="Avatar" className="comment-avatar" />
                    ) : (
                      <div className="comment-avatar-placeholder">
                        {comment.user?.name ? comment.user.name.charAt(0) : '?'}
                      </div>
                    )}
                    <span className="comment-author">{comment.user?.name || 'Удаленный аккаунт'}</span>
                  </div>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-body">{comment.text}</div>
                {user && user._id === comment.user?._id && (
                  <button className="delete-comment-btn" onClick={() => handleDelete(comment._id)}>
                    Удалить
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
