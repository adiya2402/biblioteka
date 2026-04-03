import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import './ProfilePage.css';

const ProfilePage = ({ notify }) => {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const res = await api.uploadAvatar(formData);
      setUser({ ...user, avatar: res.data.avatar });
      notify('Аватар обновлен!', 'success');
      setFile(null);
    } catch (error) {
      notify(error.response?.data?.message || 'Ошибка загрузки аватара', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="profile-page">
      <h2>Личный кабинет</h2>
      
      <div className="profile-wrapper">
        <div className="profile-avatar-section">
          {user.avatar ? (
            <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.avatar}`} alt="Avatar" className="profile-avatar-large" />
          ) : (
            <div className="profile-avatar-placeholder-large">{user.name.charAt(0)}</div>
          )}
          
          <div className="avatar-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} id="avatar-input" />
            {file && (
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Загрузка...' : 'Сохранить аватар'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-info">
          <h3>Инфо</h3>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
