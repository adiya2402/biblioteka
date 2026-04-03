import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, notify }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Заполните все поля');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await api.login({ email: formData.email, password: formData.password });
        login(res.data.token, res.data.user);
        notify('Успешный вход', 'success');
        onClose();
      } else {
        const res = await api.register(formData);
        login(res.data.token, res.data.user);
        notify('Успешная регистрация', 'success');
        onClose();
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Произошла ошибка');
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Имя</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <span onClick={toggleMode}>{isLogin ? 'Зарегистрируйтесь' : 'Войдите'}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
