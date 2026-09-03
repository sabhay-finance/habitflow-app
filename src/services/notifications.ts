import { LocalNotifications } from '@capacitor/local-notifications';

export const NotificationService = {
  /** Request notification permission */
  async requestPermission(): Promise<boolean> {
    try {
      const capStatus = await LocalNotifications.requestPermissions();
      if (capStatus.display === 'granted') return true;
    } catch {
      // Not running in Capacitor or permission error, check web standard
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const status = await Notification.requestPermission();
        return status === 'granted';
      }
    }
    return false;
  },

  /** Schedule a daily reminder */
  async scheduleDailyReminder(time: string, habitTitle?: string): Promise<boolean> {
    try {
      const [hoursStr, minutesStr] = time.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: habitTitle ? `Time for: ${habitTitle}!` : 'Keep your momentum going! 🔥',
            body: 'Check in on today’s habits and protect your streak.',
            id: 1001,
            schedule: {
              on: {
                hour: hours,
                minute: minutes,
              },
              allowWhileIdle: true,
            },
            sound: 'beep.wav',
          },
        ],
      });
      return true;
    } catch {
      return false;
    }
  },

  /** Cancel all scheduled reminders */
  async cancelAll(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
    } catch {
      // Ignore
    }
  },
};
