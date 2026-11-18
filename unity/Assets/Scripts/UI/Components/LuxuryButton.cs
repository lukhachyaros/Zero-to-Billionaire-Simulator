// ═══════════════════════════════════════════════════════════════════════════
// LuxuryButton.cs — Nút bấm luxury với trạng thái hover/active/disabled rõ ràng
// Hỗ trợ 2 style: Primary (vàng gradient) và Secondary (viền vàng, nền tối)
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

namespace ZeroBillionaire.UI
{
    public enum ButtonStyle { Primary, Secondary, Danger, Ghost }

    [RequireComponent(typeof(Image))]
    public class LuxuryButton : MonoBehaviour,
        IPointerDownHandler, IPointerUpHandler, IPointerEnterHandler, IPointerExitHandler
    {
        // ─── Cấu hình ──────────────────────────────────────────────────
        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("Style")]
        [SerializeField] private ButtonStyle style = ButtonStyle.Primary;
        [SerializeField] private bool interactable = true;

        [Header("References")]
        [SerializeField] private TextMeshProUGUI buttonText;
        [SerializeField] private Image iconImage;
        [SerializeField] private Image borderImage;
        [SerializeField] private Image backgroundImage; // Gradient overlay nếu cần

        [Header("Haptic")]
        [SerializeField] private bool enableHaptic = true;

        // ─── Private ────────────────────────────────────────────────────
        private Image _bgImage;
        private Vector3 _originalScale;
        private Coroutine _animCoroutine;

        // ─── State Colors ───────────────────────────────────────────────
        private Color _normalBg, _normalText, _normalBorder;
        private Color _pressedBg, _pressedText, _pressedBorder;
        private Color _disabledBg, _disabledText, _disabledBorder;
        private Color _hoverBg;

        // ─── Events ─────────────────────────────────────────────────────
        public event System.Action OnClick;

        private void Awake()
        {
            _bgImage = GetComponent<Image>();
            _originalScale = transform.localScale;
            SetupColors();
            ApplyState(ButtonVisualState.Normal);
        }

        // ─── Setup Colors Based on Style ────────────────────────────────
        private void SetupColors()
        {
            if (theme == null) return;

            switch (style)
            {
                case ButtonStyle.Primary:
                    _normalBg = theme.accentGold;
                    _normalText = UIThemeConfig.HexColor("#0B0F14");
                    _normalBorder = theme.accentGoldDark;
                    _pressedBg = theme.accentGoldDark;
                    _pressedText = UIThemeConfig.HexColor("#0B0F14");
                    _pressedBorder = theme.accentGold;
                    _hoverBg = Color.Lerp(theme.accentGold, Color.white, 0.1f);
                    _disabledBg = UIThemeConfig.HexColor("#3A3520");
                    _disabledText = theme.textDisabled;
                    _disabledBorder = UIThemeConfig.HexColor("#3A3520");
                    break;

                case ButtonStyle.Secondary:
                    _normalBg = Color.clear;
                    _normalText = theme.accentGold;
                    _normalBorder = theme.accentGold;
                    _pressedBg = theme.accentGold;
                    _pressedText = UIThemeConfig.HexColor("#0B0F14");
                    _pressedBorder = theme.accentGold;
                    _hoverBg = UIThemeConfig.HexColor("#F5C542", 0.1f);
                    _disabledBg = Color.clear;
                    _disabledText = theme.textDisabled;
                    _disabledBorder = theme.textDisabled;
                    break;

                case ButtonStyle.Danger:
                    _normalBg = theme.lossRed;
                    _normalText = theme.textPrimary;
                    _normalBorder = UIThemeConfig.HexColor("#C0392B");
                    _pressedBg = UIThemeConfig.HexColor("#C0392B");
                    _pressedText = theme.textPrimary;
                    _pressedBorder = theme.lossRed;
                    _hoverBg = Color.Lerp(theme.lossRed, Color.white, 0.08f);
                    _disabledBg = UIThemeConfig.HexColor("#3A1F1F");
                    _disabledText = theme.textDisabled;
                    _disabledBorder = UIThemeConfig.HexColor("#3A1F1F");
                    break;

                case ButtonStyle.Ghost:
                    _normalBg = Color.clear;
                    _normalText = theme.textSecondary;
                    _normalBorder = Color.clear;
                    _pressedBg = UIThemeConfig.HexColor("#FFFFFF", 0.05f);
                    _pressedText = theme.textPrimary;
                    _pressedBorder = Color.clear;
                    _hoverBg = UIThemeConfig.HexColor("#FFFFFF", 0.03f);
                    _disabledBg = Color.clear;
                    _disabledText = theme.textDisabled;
                    _disabledBorder = Color.clear;
                    break;
            }
        }

        // ─── Visual State Application ───────────────────────────────────
        private enum ButtonVisualState { Normal, Hover, Pressed, Disabled }

        private void ApplyState(ButtonVisualState state)
        {
            Color bg, text, border;

            switch (state)
            {
                case ButtonVisualState.Pressed:
                    bg = _pressedBg; text = _pressedText; border = _pressedBorder;
                    break;
                case ButtonVisualState.Hover:
                    bg = _hoverBg; text = _normalText; border = _normalBorder;
                    break;
                case ButtonVisualState.Disabled:
                    bg = _disabledBg; text = _disabledText; border = _disabledBorder;
                    break;
                default:
                    bg = _normalBg; text = _normalText; border = _normalBorder;
                    break;
            }

            _bgImage.color = bg;
            if (buttonText != null) buttonText.color = text;
            if (iconImage != null) iconImage.color = text;
            if (borderImage != null) borderImage.color = border;
        }

        // ─── Pointer Events ─────────────────────────────────────────────
        public void OnPointerDown(PointerEventData eventData)
        {
            if (!interactable) return;

            ApplyState(ButtonVisualState.Pressed);
            AnimateScale(0.95f, 0.06f);

            if (enableHaptic)
            {
#if UNITY_IOS && !UNITY_EDITOR
                IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Light);
#endif
            }
        }

        public void OnPointerUp(PointerEventData eventData)
        {
            if (!interactable) return;

            ApplyState(ButtonVisualState.Normal);
            AnimateScale(1f, 0.12f);

            // Fire click event
            OnClick?.Invoke();
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            if (!interactable) return;
#if !UNITY_IOS && !UNITY_ANDROID
            ApplyState(ButtonVisualState.Hover);
            AnimateScale(1.02f, 0.15f);
#endif
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            if (!interactable) return;
#if !UNITY_IOS && !UNITY_ANDROID
            ApplyState(ButtonVisualState.Normal);
            AnimateScale(1f, 0.15f);
#endif
        }

        // ─── Scale Animation ────────────────────────────────────────────
        private void AnimateScale(float target, float duration)
        {
            if (_animCoroutine != null)
                StopCoroutine(_animCoroutine);
            _animCoroutine = StartCoroutine(ScaleCoroutine(target, duration));
        }

        private IEnumerator ScaleCoroutine(float targetScale, float duration)
        {
            Vector3 start = transform.localScale;
            Vector3 end = _originalScale * targetScale;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = 1f - Mathf.Pow(1f - (elapsed / duration), 3f);
                transform.localScale = Vector3.Lerp(start, end, t);
                yield return null;
            }

            transform.localScale = end;
            _animCoroutine = null;
        }

        // ─── Public API ─────────────────────────────────────────────────

        public void SetInteractable(bool value)
        {
            interactable = value;
            ApplyState(value ? ButtonVisualState.Normal : ButtonVisualState.Disabled);
        }

        public void SetText(string text)
        {
            if (buttonText != null)
                buttonText.text = text;
        }

        public void SetStyle(ButtonStyle newStyle)
        {
            style = newStyle;
            SetupColors();
            ApplyState(interactable ? ButtonVisualState.Normal : ButtonVisualState.Disabled);
        }

        /// <summary>
        /// Pulse animation — thu hút sự chú ý
        /// </summary>
        public void Pulse(int count = 2)
        {
            StartCoroutine(PulseCoroutine(count));
        }

        private IEnumerator PulseCoroutine(int count)
        {
            for (int i = 0; i < count; i++)
            {
                // Scale up
                float elapsed = 0f;
                while (elapsed < 0.15f)
                {
                    elapsed += Time.deltaTime;
                    float s = Mathf.Lerp(1f, 1.05f, elapsed / 0.15f);
                    transform.localScale = _originalScale * s;
                    yield return null;
                }
                // Scale down
                elapsed = 0f;
                while (elapsed < 0.15f)
                {
                    elapsed += Time.deltaTime;
                    float s = Mathf.Lerp(1.05f, 1f, elapsed / 0.15f);
                    transform.localScale = _originalScale * s;
                    yield return null;
                }
                yield return new WaitForSeconds(0.1f);
            }
            transform.localScale = _originalScale;
        }

        public bool IsInteractable => interactable;
    }
}
