using System;
using UnityEngine;
#if UNITY_IOS && !UNITY_EDITOR
using System.Runtime.InteropServices;
#endif

namespace ZeroToBillionaire.Mobile.iOS
{
    /// <summary>
    /// Wrapper cho Apple Taptic Engine / UIFeedbackGenerator (iOS) và rung cơ bản trên Android.
    /// Tích hợp giới hạn tần suất (debounce) tránh tốn pin và cho phép người chơi bật/tắt trong Cài đặt.
    /// </summary>
    public static class IOSHapticFeedback
    {
        private const string HAPTIC_PREF_KEY = "ZTB_Haptics_Enabled";
        private const float MIN_HAPTIC_INTERVAL = 0.04f;
        private static float lastHapticTime = -1f;

        public static bool IsEnabled
        {
            get => PlayerPrefs.GetInt(HAPTIC_PREF_KEY, 1) == 1;
            set
            {
                PlayerPrefs.SetInt(HAPTIC_PREF_KEY, value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }

        public enum HapticImpactType
        {
            Light = 0,
            Medium = 1,
            Heavy = 2,
            Rigid = 3,
            Soft = 4
        }

        public enum HapticNotificationType
        {
            Success = 0,
            Warning = 1,
            Error = 2
        }

#if UNITY_IOS && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void _triggerImpactHaptic(int type);

        [DllImport("__Internal")]
        private static extern void _triggerNotificationHaptic(int type);

        [DllImport("__Internal")]
        private static extern void _triggerSelectionHaptic();
#endif

        private static bool CanTrigger()
        {
            if (!IsEnabled) return false;
            if (Time.unscaledTime - lastHapticTime < MIN_HAPTIC_INTERVAL) return false;
            lastHapticTime = Time.unscaledTime;
            return true;
        }

        public static void TriggerImpact(HapticImpactType type)
        {
            if (!CanTrigger()) return;

#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerImpactHaptic((int)type);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Impact haptic failed: {ex.Message}");
            }
#elif UNITY_ANDROID && !UNITY_EDITOR
            if (type == HapticImpactType.Heavy)
            {
                Handheld.Vibrate();
            }
#endif
        }

        public static void TriggerNotification(HapticNotificationType type)
        {
            if (!CanTrigger()) return;

#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerNotificationHaptic((int)type);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Notification haptic failed: {ex.Message}");
            }
#elif UNITY_ANDROID && !UNITY_EDITOR
            if (type == HapticNotificationType.Error || type == HapticNotificationType.Warning)
            {
                Handheld.Vibrate();
            }
#endif
        }

        public static void TriggerSelection()
        {
            if (!CanTrigger()) return;

#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerSelectionHaptic();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Selection haptic failed: {ex.Message}");
            }
#endif
        }
    }
}
