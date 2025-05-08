import { useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { useRepairs } from '../context/RepairContext';
import useNotificationStore from '../store/notificationStore';

export const useRepairNotifications = () => {
  const { repairs, loading, error } = useRepairs();
  const { notifications, addNotification } = useNotificationStore();

  useEffect(() => {
    if (loading || error || !repairs) return;

    const checkRepairs = () => {
      try {
        const today = new Date();

        repairs.forEach((repair) => {
          if (!repair || repair.status === 'completed') return;

          const daysSinceCreation = differenceInDays(
            today,
            new Date(repair.date)
          );

          const existingNotification = notifications.find(
            (n) => n.repairId === repair.id && n.type === repair.status
          );

          if (existingNotification) return;

          if (repair.status === 'pending' && daysSinceCreation >= 3) {
            addNotification({
              repairId: repair.id,
              repairNumber: repair.repairNumber,
              type: 'pending',
              message: `La reparación #${repair.repairNumber} ha estado pendiente por ${daysSinceCreation} días`,
            });
          }

          if (repair.status === 'in_progress' && daysSinceCreation >= 8) {
            addNotification({
              repairId: repair.id,
              repairNumber: repair.repairNumber,
              type: 'in_progress',
              message: `La reparación #${repair.repairNumber} ha estado en progreso por ${daysSinceCreation} días`,
            });
          }
        });
      } catch (error) {
        console.error('Error checking repairs for notifications:', error);
      }
    };

    // Check immediately
    checkRepairs();

    // Check every hour
    const interval = setInterval(checkRepairs, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [repairs, notifications, addNotification, loading, error]);
};