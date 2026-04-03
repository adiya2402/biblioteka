import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="not-found-page">
      <h2>404</h2>
      <p>К сожалению, страница не найдена.</p>
      <Link to="/" className="back-home-link">Вернуться на главную</Link>
    </main>
  );
};

export default NotFoundPage;
