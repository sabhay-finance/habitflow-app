import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const HapticsService = {
  /** Light tap for button clicks and toggles */
  async light(enabled = true) {
    if (!enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  },

  /** Medium tap for habit check-off */
  async medium(enabled = true) {
    if (!enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  },

  /** Heavy vibration for deletions or streak loss warnings */
  async heavy(enabled = true) {
    if (!enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  },

  /** Celebratory sequence for Level Up and Badge Unlocks */
  async celebration(enabled = true) {
    if (!enabled) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 40, 30, 40, 60]);
      }
    }
  },
};
