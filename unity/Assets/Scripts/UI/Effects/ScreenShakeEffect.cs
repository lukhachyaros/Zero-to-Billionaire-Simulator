// ═══════════════════════════════════════════════════════════════════════════
// ScreenShakeEffect.cs — Rung nhẹ UI khi đạt milestone hoặc sự kiện quan trọng
// Gắn vào Canvas hoặc bất kỳ RectTransform nào
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using UnityEngine;

namespace ZeroBillionaire.UI
{
    public class ScreenShakeEffect : MonoBehaviour
    {
        [Header("Cấu hình mặc định")]
        [SerializeField] private float defaultDuration = 0.4f;
        [SerializeField] private float defaultIntensity = 6f;
        [SerializeField] private float dampingSpeed = 1.5f;

        [Header("iOS Haptic (nếu có)")]
        [SerializeField] private bool triggerHaptic = true;

        private Vector3 _originalPosition;
        private Coroutine _shakeCoroutine;

        private void Awake()
        {
            _originalPosition = transform.localPosition;
        }

        /// <summary>
        /// Rung với thông số mặc định
        /// </summary>
        public void Shake()
        {
            Shake(defaultDuration, defaultIntensity);
        }

        /// <summary>
        /// Rung với thông số tuỳ chỉnh
        /// </summary>
        public void Shake(float duration, float intensity)
        {
            if (_shakeCoroutine != null)
                StopCoroutine(_shakeCoroutine);
            _shakeCoroutine = StartCoroutine(ShakeCoroutine(duration, intensity));
        }

        /// <summary>
        /// Rung nhẹ — dùng cho feedback nhỏ (mua đồ, click)
        /// </summary>
        public void ShakeLight()
        {
            Shake(0.15f, 2f);
        }

        /// <summary>
        /// Rung mạnh — dùng cho milestone lớn
        /// </summary>
        public void ShakeHeavy()
        {
            Shake(0.6f, 12f);
        }

        private IEnumerator ShakeCoroutine(float duration, float intensity)
        {
            float elapsed = 0f;

            // Trigger haptic on iOS
            if (triggerHaptic)
            {
                TryTriggerHaptic(intensity);
            }

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float damping = 1f - Mathf.Pow(elapsed / duration, dampingSpeed);

                float offsetX = Random.Range(-1f, 1f) * intensity * damping;
                float offsetY = Random.Range(-1f, 1f) * intensity * damping;

                transform.localPosition = _originalPosition + new Vector3(offsetX, offsetY, 0f);

                yield return null;
            }

            transform.localPosition = _originalPosition;
            _shakeCoroutine = null;
        }

        private void TryTriggerHaptic(float intensity)
        {
#if UNITY_IOS && !UNITY_EDITOR
            if (intensity > 8f)
                IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Heavy);
            else if (intensity > 4f)
                IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Medium);
            else
                IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Light);
#endif
        }

        private void OnDisable()
        {
            // Reset position khi bị tắt
            transform.localPosition = _originalPosition;
            if (_shakeCoroutine != null)
            {
                StopCoroutine(_shakeCoroutine);
                _shakeCoroutine = null;
            }
        }
    }
}
