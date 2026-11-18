// ═══════════════════════════════════════════════════════════════════════════
// AnimatedMoneyText.cs — Hiển thị số tiền với hiệu ứng count-up mượt mà
// Số nhảy từ giá trị cũ → mới, format VNĐ, đổi màu theo +/-
// ═══════════════════════════════════════════════════════════════════════════
using System;
using System.Collections;
using UnityEngine;
using TMPro;

namespace ZeroToBillionaire.UI
{
    [RequireComponent(typeof(TextMeshProUGUI))]
    public class AnimatedMoneyText : MonoBehaviour
    {
        // ─── Cấu hình ──────────────────────────────────────────────────
        [Header("Hiển thị")]
        [SerializeField] private string prefix = "₫";
        [SerializeField] private string suffix = "";
        [SerializeField] private bool useAbbreviation = false; // 1.2T thay vì 1,200,000,000,000
        [SerializeField] private bool showSign = false;        // +₫500K

        [Header("Animation")]
        [SerializeField] private float countUpDuration = 0.8f;
        [SerializeField] private AnimationCurve easingCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        [SerializeField] private bool punchOnChange = true;
        [SerializeField] private float punchScale = 1.08f;
        [SerializeField] private float punchDuration = 0.2f;

        [Header("Màu sắc")]
        [SerializeField] private bool colorizeChange = false;
        [SerializeField] private Color positiveColor = new Color(0.180f, 0.800f, 0.443f); // #2ECC71
        [SerializeField] private Color negativeColor = new Color(0.906f, 0.298f, 0.235f); // #E74C3C
        [SerializeField] private Color neutralColor = new Color(0.902f, 0.929f, 0.953f);  // #E6EDF3
        [SerializeField] private float colorFadeDuration = 1f;

        // ─── Tham chiếu ─────────────────────────────────────────────────
        [Header("Optional")]
        [SerializeField] private TextMeshProUGUI changeIndicator; // Text "+₫500K" nhỏ bên dưới
        [SerializeField] private RectTransform changeArrow;       // Mũi tên ▲▼

        // ─── Private ────────────────────────────────────────────────────
        private TextMeshProUGUI _text;
        private long _currentDisplayValue;
        private long _targetValue;
        private Coroutine _countCoroutine;
        private Coroutine _punchCoroutine;
        private Coroutine _colorCoroutine;
        private Vector3 _originalScale;

        // ─── Events ─────────────────────────────────────────────────────
        public event Action<long> OnValueReached; // Gọi khi animation đếm xong

        private void Awake()
        {
            _text = GetComponent<TextMeshProUGUI>();
            _originalScale = transform.localScale;
        }

        /// <summary>
        /// Đặt giá trị ngay lập tức, không animation
        /// </summary>
        public void SetValueImmediate(long value)
        {
            if (_countCoroutine != null)
                StopCoroutine(_countCoroutine);

            _currentDisplayValue = value;
            _targetValue = value;
            _text.text = FormatMoney(value);
        }

        /// <summary>
        /// Đặt giá trị mới, có animation count-up
        /// </summary>
        public void SetValue(long newValue)
        {
            if (newValue == _targetValue) return;

            long previousTarget = _targetValue;
            _targetValue = newValue;

            // Dừng animation cũ
            if (_countCoroutine != null)
                StopCoroutine(_countCoroutine);
            _countCoroutine = StartCoroutine(CountUpCoroutine(_currentDisplayValue, newValue));

            // Punch scale
            if (punchOnChange)
            {
                if (_punchCoroutine != null)
                    StopCoroutine(_punchCoroutine);
                _punchCoroutine = StartCoroutine(PunchScaleCoroutine());
            }

            // Đổi màu theo thay đổi
            if (colorizeChange)
            {
                long delta = newValue - previousTarget;
                Color flashColor = delta > 0 ? positiveColor : (delta < 0 ? negativeColor : neutralColor);
                if (_colorCoroutine != null)
                    StopCoroutine(_colorCoroutine);
                _colorCoroutine = StartCoroutine(ColorFlashCoroutine(flashColor));
            }

            // Cập nhật change indicator
            if (changeIndicator != null)
            {
                long delta = newValue - previousTarget;
                UpdateChangeIndicator(delta);
            }
        }

        // ─── Count-Up Animation ─────────────────────────────────────────
        private IEnumerator CountUpCoroutine(long from, long to)
        {
            float elapsed = 0f;
            float duration = countUpDuration;

            // Nếu thay đổi nhỏ, giảm thời gian
            long diff = Math.Abs(to - from);
            if (diff < 1000) duration *= 0.3f;
            else if (diff < 100000) duration *= 0.6f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = easingCurve.Evaluate(Mathf.Clamp01(elapsed / duration));

                _currentDisplayValue = (long)Mathf.Lerp(from, to, t);
                _text.text = FormatMoney(_currentDisplayValue);

                yield return null;
            }

            _currentDisplayValue = to;
            _text.text = FormatMoney(to);
            _countCoroutine = null;

            OnValueReached?.Invoke(to);
        }

        // ─── Punch Scale Animation ─────────────────────────────────────
        private IEnumerator PunchScaleCoroutine()
        {
            float elapsed = 0f;
            float halfDur = punchDuration * 0.35f;

            // Scale up
            while (elapsed < halfDur)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / halfDur;
                float scale = Mathf.Lerp(1f, punchScale, t);
                transform.localScale = _originalScale * scale;
                yield return null;
            }

            // Scale back
            elapsed = 0f;
            float remainDur = punchDuration * 0.65f;
            while (elapsed < remainDur)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / remainDur;
                // Ease out with slight overshoot
                float scale = Mathf.Lerp(punchScale, 1f, t * (2f - t));
                transform.localScale = _originalScale * scale;
                yield return null;
            }

            transform.localScale = _originalScale;
            _punchCoroutine = null;
        }

        // ─── Color Flash Animation ──────────────────────────────────────
        private IEnumerator ColorFlashCoroutine(Color flashColor)
        {
            _text.color = flashColor;

            float elapsed = 0f;
            while (elapsed < colorFadeDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / colorFadeDuration;
                _text.color = Color.Lerp(flashColor, neutralColor, t * t); // ease-in quadratic
                yield return null;
            }

            _text.color = neutralColor;
            _colorCoroutine = null;
        }

        // ─── Change Indicator ───────────────────────────────────────────
        private void UpdateChangeIndicator(long delta)
        {
            if (changeIndicator == null) return;

            if (delta == 0)
            {
                changeIndicator.gameObject.SetActive(false);
                return;
            }

            changeIndicator.gameObject.SetActive(true);
            string sign = delta > 0 ? "+" : "";
            changeIndicator.text = $"{sign}{FormatMoney(delta)}";
            changeIndicator.color = delta > 0 ? positiveColor : negativeColor;

            // Mũi tên
            if (changeArrow != null)
            {
                changeArrow.localEulerAngles = delta > 0
                    ? Vector3.zero           // ▲ hướng lên
                    : new Vector3(0, 0, 180); // ▼ hướng xuống
            }
        }

        // ─── Format Tiền VNĐ ────────────────────────────────────────────
        public string FormatMoney(long amount)
        {
            string sign = "";
            if (showSign && amount > 0) sign = "+";

            if (useAbbreviation)
            {
                return sign + prefix + FormatAbbreviated(amount) + suffix;
            }
            else
            {
                // Format đầy đủ với dấu chấm ngăn cách hàng nghìn
                return sign + prefix + FormatFullNumber(amount) + suffix;
            }
        }

        private string FormatFullNumber(long amount)
        {
            bool negative = amount < 0;
            long abs = Math.Abs(amount);
            string formatted = abs.ToString("N0"); // 1,234,567
            // Thay dấu phẩy bằng dấu chấm (kiểu VN)
            formatted = formatted.Replace(",", ".");
            return negative ? $"-{formatted}" : formatted;
        }

        private string FormatAbbreviated(long amount)
        {
            bool negative = amount < 0;
            long abs = Math.Abs(amount);
            string result;

            if (abs >= 1_000_000_000_000) // nghìn tỷ
                result = $"{abs / 1_000_000_000_000f:F1}T";
            else if (abs >= 1_000_000_000) // tỷ
                result = $"{abs / 1_000_000_000f:F1}B";
            else if (abs >= 1_000_000) // triệu
                result = $"{abs / 1_000_000f:F1}M";
            else if (abs >= 1_000) // nghìn
                result = $"{abs / 1_000f:F0}K";
            else
                result = abs.ToString();

            return negative ? $"-{result}" : result;
        }

        // ─── Public Getters ─────────────────────────────────────────────
        public long CurrentDisplayValue => _currentDisplayValue;
        public long TargetValue => _targetValue;
        public bool IsAnimating => _countCoroutine != null;
    }
}
