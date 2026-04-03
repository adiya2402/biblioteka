import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>BookClub AITU</h1>
        <nav className="header-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Каталог
          </NavLink>
          <NavLink to="/discussion" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Обсуждения
          </NavLink>
          <NavLink to="/stats" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Статистика
          </NavLink>
          {user && (
            <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              Профиль
            </NavLink>
          )}
        </nav>
        <div className="auth-buttons">
          {user ? (
            <div className="user-info">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="header-avatar" />
              ) : (
                <div className="header-avatar-placeholder">{user.name.charAt(0)}</div>
              )}
              <span className="user-name">{user.name}</span>
              <button className="auth-btn logout-btn" onClick={handleLogout}>Выйти</button>
            </div>
          ) : (
            <button className="auth-btn login-btn" onClick={onOpenAuth}>Войти</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
