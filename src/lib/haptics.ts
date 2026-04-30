import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const enabled = Capacitor.isNativePlatform()

function safe(fn: () => Promise<unknown>) {
  if (!enabled) return
  fn().catch(() => {})
}

export const haptics = {
  light: () => safe(() => Haptics.impact({ style: ImpactStyle.Light })),
  medium: () => safe(() => Haptics.impact({ style: ImpactStyle.Medium })),
  heavy: () => safe(() => Haptics.impact({ style: ImpactStyle.Heavy })),
  selection: () => safe(() => Haptics.selectionChanged()),
  success: () => safe(() => Haptics.notification({ type: NotificationType.Success })),
  warning: () => safe(() => Haptics.notification({ type: NotificationType.Warning })),
  error: () => safe(() => Haptics.notification({ type: NotificationType.Error })),
}
