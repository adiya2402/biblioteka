import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './StatsPage.css';

const StatsPage = ({ notify }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getStats();
        setStats(res.data);
      } catch (error) {
        notify('Ошибка загрузки статистики', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <main className="stats-page">
      <h2>Статистика платформы</h2>
      
      <div className="stats-cards">
        <div className="stats-card">
          <h3>Участников</h3>
          <div className="stats-number">{stats.users}</div>
        </div>
        <div className="stats-card">
          <h3>Книг в базе</h3>
          <div className="stats-number">{stats.books}</div>
        </div>
        <div className="stats-card">
          <h3>Комментариев</h3>
          <div className="stats-number">{stats.comments}</div>
        </div>
      </div>

      {stats.topBook && (
        <div className="top-book-section">
          <h3>Самая обсуждаемая книга</h3>
          <div className="top-book-info">
            <img src={stats.topBook.coverUrl} alt={stats.topBook.title} />
            <div>
              <h4>{stats.topBook.title}</h4>
              <p>{stats.topBook.author}</p>
              <div className="stats-bar-container">
                <div 
                  className="stats-bar" 
                  style={{ width: `${Math.min(stats.topBook.commentCount * 10, 100)}%` }}
                ></div>
              </div>
              <p>{stats.topBook.commentCount} комментариев</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StatsPage;
