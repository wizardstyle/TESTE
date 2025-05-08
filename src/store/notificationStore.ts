import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInDays } from 'date-fns';

export interface Notification {
  id: string;
  repairId: string;
  repairNumber: string;
  message: string;
  type: 'pending' | 'in_progress';
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'notification-storage',
    }
  )
);

export default useNotificationStore