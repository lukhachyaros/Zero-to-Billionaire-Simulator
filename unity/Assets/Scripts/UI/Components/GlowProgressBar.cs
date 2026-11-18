// ═══════════════════════════════════════════════════════════════════════════
// GlowProgressBar.cs — Thanh tiến trình luxury với gradient fill và glow effect
// Dùng cho stat bars: sức khỏe, hạnh phúc, trí tuệ, kỷ luật...
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace ZeroToBillionaire.UI
{
    public class GlowProgressBar : MonoBehaviour
    {
        // ─── Cấu hình ──────────────────────────────────────────────────
        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("Components")]
        [SerializeField] private Image fillImage;           // Thanh fill chính
        [SerializeField] private Image glowImage;           // Bản sao mờ phía sau (glow)
        [SerializeField] private Image trackImage;          // Nền track
        [SerializeField] private Image borderImage;         // Viền mảnh bao quanh
        [SerializeField] private TextMeshProUGUI labelText; // Tên stat (trái)
        [SerializeField] private TextMeshProUGUI valueText; // Giá trị (phải)
        [SerializeField] private Image iconImage;           // Icon bên trái

        [Header("Giá trị")]
        [SerializeField, Range(0f, 1f)] private float currentValue = 0.75f;
        [SerializeField] private float minValue = 0f;
        [SerializeField] private float maxValue = 100f;

        [Header("Visual")]
        [SerializeField] private Color barColor = new Color(0.180f, 0.800f, 0.443f);
        [SerializeField] private bool autoColorByValue = true; // Tự đổi màu theo giá trị
        [SerializeField] private bool showValueText = true;
        [SerializeField] private string valueFormat = "{0:F0}"; // Format hiển thị

        [Header("Animation")]
        [SerializeField] private float fillAnimDuration = 0.5f;
        [SerializeField] private AnimationCurve fillCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        [SerializeField] private bool pulseAtCritical = true; // Pulse khi < 20%
        [SerializeField] private bool pulseAtFull = true;     // Pulse khi = 100%

        // ─── Private ────────────────────────────────────────────────────
        private float _displayValue;
        private Coroutine _fillCoroutine;
        private Coroutine _pulseCoroutine;
        private float _glowBaseAlpha;

        private void Awake()
        {
            SetupVisuals();
        }

        private void SetupVisuals()
        {
            // Track background
            if (trackImage != null && theme != null)
            {
                Color trackColor = theme.surfaceColor;
                trackColor.a = 0.6f;
                trackImage.color = trackColor;
            }

            // Border
            if (borderImage != null && theme != null)
            {
                borderImage.color = theme.surfaceBorderColor;
            }

            // Glow setup
            if (glowImage != null)
            {
                _glowBaseAlpha = theme != null ? theme.glowIntensity * 0.3f : 0.15f;
                Color glow = barColor;
                glow.a = _glowBaseAlpha;
                glowImage.color = glow;
            }

            // Label
            if (labelText != null && theme != null)
            {
                labelText.color = theme.textSecondary;
            }

            // Value text
            if (valueText != null)
            {
                valueText.gameObject.SetActive(showValueText);
                if (theme != null) valueText.color = theme.textPrimary;
            }
        }

        // ─── Set Value ──────────────────────────────────────────────────

        /// <summary>
        /// Cập nhật giá trị với animation
        /// </summary>
        public void SetValue(float value)
        {
            float normalized = Mathf.InverseLerp(minValue, maxValue, Mathf.Clamp(value, minValue, maxValue));

            if (Mathf.Approximately(normalized, currentValue)) return;

            currentValue = normalized;

            if (_fillCoroutine != null)
                StopCoroutine(_fillCoroutine);
            _fillCoroutine = StartCoroutine(AnimateFillCoroutine(normalized));

            // Update color
            if (autoColorByValue && theme != null)
            {
                barColor = theme.GetStatColor(normalized);
                UpdateBarColor(barColor);
            }

            // Update text
            if (valueText != null && showValueText)
            {
                valueText.text = string.Format(valueFormat, value);
            }

            // Check pulse conditions
            CheckPulseConditions(normalized);
        }

        /// <summary>
        /// Set giá trị ngay lập tức, không animation
        /// </summary>
        public void SetValueImmediate(float value)
        {
            float normalized = Mathf.InverseLerp(minValue, maxValue, Mathf.Clamp(value, minValue, maxValue));
            currentValue = normalized;
            _displayValue = normalized;

            if (fillImage != null)
                fillImage.fillAmount = normalized;
            if (glowImage != null)
                glowImage.fillAmount = normalized;

            if (autoColorByValue && theme != null)
            {
                barColor = theme.GetStatColor(normalized);
                UpdateBarColor(barColor);
            }

            if (valueText != null && showValueText)
            {
                valueText.text = string.Format(valueFormat, value);
            }
        }

        // ─── Fill Animation ─────────────────────────────────────────────
        private IEnumerator AnimateFillCoroutine(float target)
        {
            float startVal = _displayValue;
            float elapsed = 0f;

            while (elapsed < fillAnimDuration)
            {
                elapsed += Time.deltaTime;
                float t = fillCurve.Evaluate(Mathf.Clamp01(elapsed / fillAnimDuration));

                _displayValue = Mathf.Lerp(startVal, target, t);

                if (fillImage != null)
                    fillImage.fillAmount = _displayValue;
                if (glowImage != null)
                    glowImage.fillAmount = _displayValue;

                yield return null;
            }

            _displayValue = target;
            if (fillImage != null)
                fillImage.fillAmount = target;
            if (glowImage != null)
                glowImage.fillAmount = target;

            _fillCoroutine = null;
        }

        // ─── Color Update ───────────────────────────────────────────────
        private void UpdateBarColor(Color color)
        {
            if (fillImage != null)
                fillImage.color = color;

            if (glowImage != null)
            {
                Color glow = color;
                glow.a = _glowBaseAlpha;
                glowImage.color = glow;
            }

            // Icon cũng theo màu bar
            if (iconImage != null)
                iconImage.color = color;
        }

        // ─── Pulse Effects ──────────────────────────────────────────────
        private void CheckPulseConditions(float normalized)
        {
            bool shouldPulse = false;

            if (pulseAtCritical && normalized < 0.2f) shouldPulse = true;
            if (pulseAtFull && normalized >= 1f) shouldPulse = true;

            if (shouldPulse)
            {
                if (_pulseCoroutine == null)
                    _pulseCoroutine = StartCoroutine(PulseGlowCoroutine());
            }
            else
            {
                if (_pulseCoroutine != null)
                {
                    StopCoroutine(_pulseCoroutine);
                    _pulseCoroutine = null;
                    // Reset glow alpha
                    if (glowImage != null)
                    {
                        Color c = glowImage.color;
                        c.a = _glowBaseAlpha;
                        glowImage.color = c;
                    }
                }
            }
        }

        private IEnumerator PulseGlowCoroutine()
        {
            while (true)
            {
                // Fade in glow
                float elapsed = 0f;
                while (elapsed < 0.6f)
                {
                    elapsed += Time.deltaTime;
                    float t = Mathf.PingPong(elapsed * 2f, 1f);
                    if (glowImage != null)
                    {
                        Color c = glowImage.color;
                        c.a = Mathf.Lerp(_glowBaseAlpha, _glowBaseAlpha * 2.5f, t);
                        glowImage.color = c;
                    }
                    yield return null;
                }
                yield return new WaitForSeconds(0.3f);
            }
        }

        // ─── Public API ─────────────────────────────────────────────────

        public void SetLabel(string label)
        {
            if (labelText != null) labelText.text = label;
        }

        public void SetIcon(Sprite icon)
        {
            if (iconImage != null)
            {
                iconImage.sprite = icon;
                iconImage.gameObject.SetActive(icon != null);
            }
        }

        public void SetBarColor(Color color)
        {
            autoColorByValue = false;
            barColor = color;
            UpdateBarColor(color);
        }

        /// <summary>
        /// Flash bar — dùng khi stat thay đổi đột ngột
        /// </summary>
        public void Flash(Color? flashColor = null)
        {
            StartCoroutine(FlashCoroutine(flashColor ?? Color.white));
        }

        private IEnumerator FlashCoroutine(Color flashColor)
        {
            Color originalColor = barColor;

            if (fillImage != null) fillImage.color = flashColor;

            float elapsed = 0f;
            while (elapsed < 0.4f)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / 0.4f;
                if (fillImage != null)
                    fillImage.color = Color.Lerp(flashColor, originalColor, t * t);
                yield return null;
            }

            if (fillImage != null) fillImage.color = originalColor;
        }

        public float CurrentValue => currentValue;
        public float DisplayValue => _displayValue;
    }
}
