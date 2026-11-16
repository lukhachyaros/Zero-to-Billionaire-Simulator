using System;
using UnityEngine;
#if UNITY_IOS && !UNITY_EDITOR
using System.Runtime.InteropServices;
#endif

namespace ZeroToBillionaire.Mobile.iOS
{
    /// <summary>
    /// Wrapper for iOS Taptic Engine / Core Haptics.
    /// Provides tactile feedback for user choices, successes, and life events.
    /// </summary>
    public static class IOSHapticFeedback
    {
        public enum HapticImpactType
        {
            Light,
            Medium,
            Heavy,
            Rigid,
            Soft
        }

        public enum HapticNotificationType
        {
            Success,
            Warning,
            Error
        }

#if UNITY_IOS && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void _triggerImpactHaptic(int type);

        [DllImport("__Internal")]
        private static extern void _triggerNotificationHaptic(int type);

        [DllImport("__Internal")]
        private static extern void _triggerSelectionHaptic();
#endif

        public static void TriggerImpact(HapticImpactType type)
        {
#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerImpactHaptic((int)type);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Impact haptic failed: {ex.Message}");
            }
#elif UNITY_EDITOR
            Debug.Log($"[Haptic Preview] Impact: {type}");
#endif
        }

        public static void TriggerNotification(HapticNotificationType type)
        {
#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerNotificationHaptic((int)type);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Notification haptic failed: {ex.Message}");
            }
#elif UNITY_EDITOR
            Debug.Log($"[Haptic Preview] Notification: {type}");
#endif
        }

        public static void TriggerSelection()
        {
#if UNITY_IOS && !UNITY_EDITOR
            try
            {
                _triggerSelectionHaptic();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[IOSHapticFeedback] Selection haptic failed: {ex.Message}");
            }
#elif UNITY_EDITOR
            Debug.Log("[Haptic Preview] Selection tap");
#endif
        }
    }
}
