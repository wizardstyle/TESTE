import React from 'react';
import { Bell, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import useNotificationStore from '../store/notificationStore';

const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No notifications
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.read
                        ? 'bg-gray-50'
                        : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm ${
                        notification.read
                          ? 'text-gray-600'
                          : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;