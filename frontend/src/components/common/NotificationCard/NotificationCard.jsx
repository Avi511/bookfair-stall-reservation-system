import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const NotificationCard = ({ message, type = 'info', onClose, duration = 3000 }) => {
  
  // Auto-close effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      container: "bg-green-50 border-green-500 text-green-800",
      icon: "✅",
      label: "Success"
    },
    error: {
      container: "bg-red-50 border-red-500 text-red-800",
      icon: "❌",
      label: "Error"
    },
    info: {
      container: "bg-blue-50 border-blue-500 text-blue-800",
      icon: "ℹ️",
      label: "Notification"
    }
  };

  const currentStyle = styles[type] || styles.info;

  // Render using Portal to attach it to document body
  return createPortal(
    <div className={`fixed top-5 right-5 min-w-[300px] border-l-4 p-4 shadow-2xl z-[9999] rounded-md transition-all transform ease-in-out duration-500 flex items-start gap-3 ${currentStyle.container}`}>
      <span className="text-xl">{currentStyle.icon}</span>
      
      <div className="flex-1">
        <p className="text-sm font-bold tracking-wide uppercase">{currentStyle.label}</p>
        <p className="mt-1 text-sm font-medium">{message}</p>
      </div>

      <button 
        onClick={onClose}
        className="ml-4 text-gray-400 transition-colors hover:text-gray-900"
      >
        ✕
      </button>
    </div>,
    document.body
  );
};

export default NotificationCard;