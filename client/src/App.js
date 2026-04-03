import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import AuthModal from './components/AuthModal/AuthModal';
import Notification from './components/Notification/Notification';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import DiscussionPage from './pages/DiscussionPage/DiscussionPage';
import StatsPage from './pages/StatsPage/StatsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import './App.css';

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header onOpenAuth={() => setAuthModalOpen(true)} />
          
          <Routes>
            <Route path="/" element={<CatalogPage notify={notify} />} />
            <Route path="/discussion" element={<DiscussionPage notify={notify} />} />
            <Route path="/stats" element={<StatsPage notify={notify} />} />
            <Route path="/profile" element={<ProfilePage notify={notify} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} BookClub AITU. Все права защищены.</p>
          </footer>

          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
            notify={notify} 
          />
          
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: '', type: 'success' })} 
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;