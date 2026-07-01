import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Clock, Car, XCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'reservationApproved':
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    case 'reservationRejected':
      return <XCircle className="text-red-500 w-5 h-5" />;
    case 'reservationCompleted':
      return <CheckCircle className="text-blue-500 w-5 h-5" />;
    case 'newReservation':
      return <Car className="text-primary w-5 h-5" />;
    case 'reservationCreatedByAdmin':
      return <Car className="text-primary w-5 h-5" />;
    default:
      return <Bell className="text-gray-500 w-5 h-5" />;
  }
};

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return t('notifications.justNow') || 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)} ${t('notifications.minutesAgo') || 'minutes ago'}`;
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) return `${Math.floor(diffInHours)} ${t('notifications.hoursAgo') || 'hours ago'}`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate based on user role
    if (user.role === 'admin') {
      navigate('/admin/reservations');
    } else {
      navigate('/my-reservations');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Responsive dropdown below the bell icon with viewport-safe mobile spacing */}
      <div
        ref={dropdownRef}
        className={`absolute right-2 left-auto md:right-0 md:left-auto mt-2 w-auto md:w-80 max-w-[calc(100vw-20px)] min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 z-50 transform-gpu transition-all duration-200 ease-out origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
      >
        <div className="flex flex-col overflow-hidden max-h-[60vh] md:max-h-96">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('notifications.title')}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('notifications.empty')}
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {t(notification.title)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {t(notification.message)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read ? (
                        <span className="w-2 h-2 rounded-full bg-primary mt-2" />
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default NotificationDropdown;
