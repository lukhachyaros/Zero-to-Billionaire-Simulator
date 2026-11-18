// ═══════════════════════════════════════════════════════════════════════════
// LuxuryCard.cs — Card component phong cách luxury với border, shadow, animation
// Gắn vào GameObject có Image component làm background
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

namespace ZeroToBillionaire.UI
{
    [RequireComponent(typeof(Image))]
    public class LuxuryCard : MonoBehaviour,
        IPointerDownHandler, IPointerUpHandler, IPointerEnterHandler, IPointerExitHandler
    {
        // ─── Cấu hình ──────────────────────────────────────────────────
        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("Trạng thái")]
        [SerializeField] private bool interactable = true;
        [SerializeField] private bool animateOnPress = true;

        [Header("Visual")]
        [SerializeField] private Image borderImage;         // Image mỏng bao quanh card
        [SerializeField] private Image[] shadowLayers;      // 1-3 shadow Images phía dưới card
        [SerializeField] private CanvasGroup canvasGroup;    // Cho fade effects

        [Header("Glow (Optional)")]
        [SerializeField] private Image glowOverlay;          // Image phát sáng nhẹ khi active

        // ─── Private ────────────────────────────────────────────────────
        private Image _background;
        private Vector3 _originalScale;
        private Coroutine _scaleCoroutine;
        private bool _isPressed;
        private bool _isHovered;

        // ─── Events ─────────────────────────────────────────────────────
        public event System.Action OnCardPressed;
        public event System.Action OnCardReleased;

        private void Awake()
        {
            _background = GetComponent<Image>();
            _originalScale = transform.localScale;

            if (canvasGroup == null)
                canvasGroup = GetComponent<CanvasGroup>();

            ApplyTheme();
        }

        // ─── Theme Application ──────────────────────────────────────────
        public void ApplyTheme()
        {
            if (theme == null) return;

            // Background
            _background.color = theme.surfaceColor;

            // Border
            if (borderImage != null)
            {
                borderImage.color = theme.cardBorderColor;
            }

            // Shadows
            if (shadowLayers != null)
            {
                for (int i = 0; i < shadowLayers.Length; i++)
                {
                    if (shadowLayers[i] == null) continue;

                    switch (i)
                    {
                        case 0:
                            shadowLayers[i].color = theme.shadowLayer1;
                            shadowLayers[i].rectTransform.anchoredPosition = theme.shadowOffset1;
                            break;
                        case 1:
                            shadowLayers[i].color = theme.shadowLayer2;
                            shadowLayers[i].rectTransform.anchoredPosition = theme.shadowOffset2;
                            break;
                        case 2:
                            shadowLayers[i].color = theme.shadowLayer3;
                            shadowLayers[i].rectTransform.anchoredPosition = theme.shadowOffset3;
                            break;
                    }
                }
            }

            // Glow overlay (ẩn ban đầu)
            if (glowOverlay != null)
            {
                Color glow = theme.accentGold;
                glow.a = 0f;
                glowOverlay.color = glow;
            }
        }

        // ─── Pointer Events ─────────────────────────────────────────────
        public void OnPointerDown(PointerEventData eventData)
        {
            if (!interactable) return;
            _isPressed = true;

            if (animateOnPress)
                AnimateScale(theme != null ? theme.cardPressScale : 0.97f, 0.08f);

            // Sáng border khi nhấn
            if (borderImage != null && theme != null)
            {
                Color pressedBorder = theme.accentGold;
                pressedBorder.a = 0.5f;
                borderImage.color = pressedBorder;
            }

            OnCardPressed?.Invoke();
        }

        public void OnPointerUp(PointerEventData eventData)
        {
            if (!interactable) return;
            _isPressed = false;

            if (animateOnPress)
            {
                float targetScale = _isHovered && theme != null ? theme.cardHoverScale : 1f;
                AnimateScale(targetScale, 0.15f);
            }

            // Reset border
            if (borderImage != null && theme != null)
                borderImage.color = theme.cardBorderColor;

            OnCardReleased?.Invoke();
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            if (!interactable) return;
            _isHovered = true;

            // Hover chỉ hiệu quả trên PC/Mac
#if !UNITY_IOS && !UNITY_ANDROID
            if (!_isPressed)
                AnimateScale(theme != null ? theme.cardHoverScale : 1.02f, 0.2f);
#endif
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            if (!interactable) return;
            _isHovered = false;

#if !UNITY_IOS && !UNITY_ANDROID
            if (!_isPressed)
                AnimateScale(1f, 0.2f);
#endif
        }

        // ─── Scale Animation ────────────────────────────────────────────
        private void AnimateScale(float targetScale, float duration)
        {
            if (_scaleCoroutine != null)
                StopCoroutine(_scaleCoroutine);
            _scaleCoroutine = StartCoroutine(ScaleCoroutine(targetScale, duration));
        }

        private IEnumerator ScaleCoroutine(float targetScale, float duration)
        {
            Vector3 startScale = transform.localScale;
            Vector3 endScale = _originalScale * targetScale;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                // Ease out cubic
                t = 1f - Mathf.Pow(1f - t, 3f);
                transform.localScale = Vector3.Lerp(startScale, endScale, t);
                yield return null;
            }

            transform.localScale = endScale;
            _scaleCoroutine = null;
        }

        // ─── Public Methods ─────────────────────────────────────────────

        /// <summary>
        /// Flash viền vàng rồi tắt — dùng khi có update quan trọng trong card
        /// </summary>
        public void FlashBorder(float duration = 0.6f)
        {
            StartCoroutine(FlashBorderCoroutine(duration));
        }

        private IEnumerator FlashBorderCoroutine(float duration)
        {
            if (borderImage == null || theme == null) yield break;

            Color bright = theme.accentGold;
            bright.a = 0.8f;
            borderImage.color = bright;

            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                borderImage.color = Color.Lerp(bright, theme.cardBorderColor, t * t);
                yield return null;
            }

            borderImage.color = theme.cardBorderColor;
        }

        /// <summary>
        /// Bật/tắt glow overlay — dùng cho highlight card
        /// </summary>
        public void SetGlow(bool active, float duration = 0.3f)
        {
            if (glowOverlay == null || theme == null) return;
            StartCoroutine(GlowCoroutine(active, duration));
        }

        private IEnumerator GlowCoroutine(bool active, float duration)
        {
            Color startColor = glowOverlay.color;
            Color endColor = theme.accentGold;
            endColor.a = active ? theme.glowIntensity * 0.15f : 0f;

            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                glowOverlay.color = Color.Lerp(startColor, endColor, t);
                yield return null;
            }
            glowOverlay.color = endColor;
        }

        /// <summary>
        /// Thay đổi màu bề mặt card (ví dụ: đổi sang elevated khi focus)
        /// </summary>
        public void SetSurfaceColor(Color color, float duration = 0.2f)
        {
            StartCoroutine(ColorTransitionCoroutine(_background, color, duration));
        }

        private IEnumerator ColorTransitionCoroutine(Image image, Color targetColor, float duration)
        {
            Color start = image.color;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                image.color = Color.Lerp(start, targetColor, elapsed / duration);
                yield return null;
            }
            image.color = targetColor;
        }

        public void SetInteractable(bool value)
        {
            interactable = value;
            if (canvasGroup != null)
                canvasGroup.alpha = value ? 1f : 0.5f;
        }
    }
}
