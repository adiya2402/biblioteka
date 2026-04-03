import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      {message}
      <button className="notification-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;
