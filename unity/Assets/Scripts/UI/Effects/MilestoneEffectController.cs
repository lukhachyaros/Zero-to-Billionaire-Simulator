// ═══════════════════════════════════════════════════════════════════════════
// MilestoneEffectController.cs — Hiệu ứng đặc biệt khi lên mốc triệu/tỷ phú
// Kết hợp: vàng lấp lánh (shimmer), rung nhẹ (shake), coin burst, flash overlay
// ═══════════════════════════════════════════════════════════════════════════
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace ZeroBillionaire.UI
{
    public enum MilestoneType
    {
        None,
        HundredThousand,   // 100K
        Millionaire,       // 1M (1 triệu VNĐ)
        TenMillion,        // 10M
        HundredMillion,    // 100M
        Billionaire,       // 1B (1 tỷ VNĐ)
        TenBillion,        // 10B
        HundredBillion,    // 100B
        Trillionaire       // 1T (1 nghìn tỷ VNĐ)
    }

    public class MilestoneEffectController : MonoBehaviour
    {
        // ─── Singleton ──────────────────────────────────────────────────
        public static MilestoneEffectController Instance { get; private set; }

        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("References")]
        [SerializeField] private ScreenShakeEffect screenShake;
        [SerializeField] private CoinParticleSpawner coinSpawner;
        [SerializeField] private RectTransform netWorthDisplay; // Nơi hiệu ứng tập trung

        [Header("Overlay Effects")]
        [SerializeField] private Image fullScreenFlash;    // Image trắng/vàng full screen, alpha 0
        [SerializeField] private Image shimmerOverlay;     // Image gradient di chuyển qua
        [SerializeField] private CanvasGroup milestonePopup; // Popup "🎉 TỶ PHÚ!" 
        [SerializeField] private TextMeshProUGUI milestoneTitle;
        [SerializeField] private TextMeshProUGUI milestoneSubtitle;

        [Header("Shimmer")]
        [SerializeField] private float shimmerSpeed = 400f;
        [SerializeField] private float shimmerWidth = 200f;

        // ─── Private ────────────────────────────────────────────────────
        private HashSet<MilestoneType> _triggeredMilestones = new HashSet<MilestoneType>();
        private Coroutine _shimmerCoroutine;

        // ─── Events ─────────────────────────────────────────────────────
        public event Action<MilestoneType> OnMilestoneReached;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            // Ẩn overlays
            if (fullScreenFlash != null) fullScreenFlash.color = Color.clear;
            if (shimmerOverlay != null) shimmerOverlay.gameObject.SetActive(false);
            if (milestonePopup != null) { milestonePopup.alpha = 0f; milestonePopup.gameObject.SetActive(false); }
        }

        // ─── Check & Trigger ────────────────────────────────────────────

        /// <summary>
        /// Kiểm tra xem giá trị mới có vượt qua milestone nào không.
        /// Gọi mỗi khi cash thay đổi.
        /// </summary>
        public void CheckMilestone(long previousCash, long newCash)
        {
            var milestones = new (long threshold, MilestoneType type, string title, string subtitle)[]
            {
                (100_000L,               MilestoneType.HundredThousand, "100 NGHÌN",          "Bắt đầu rồi!"),
                (1_000_000L,             MilestoneType.Millionaire,     "TRIỆU PHÚ",          "Hành trình vạn dặm!"),
                (10_000_000L,            MilestoneType.TenMillion,      "10 TRIỆU",           "Đang lên!"),
                (100_000_000L,           MilestoneType.HundredMillion,  "100 TRIỆU",          "Không thể dừng lại!"),
                (1_000_000_000L,         MilestoneType.Billionaire,     "✦ TỶ PHÚ ✦",         "Tiền không phải vấn đề!"),
                (10_000_000_000L,        MilestoneType.TenBillion,      "✦✦ 10 TỶ ✦✦",       "Quyền lực thực sự!"),
                (100_000_000_000L,       MilestoneType.HundredBillion,  "✦✦✦ 100 TỶ ✦✦✦",   "Đế chế hùng mạnh!"),
                (1_000_000_000_000L,     MilestoneType.Trillionaire,    "👑 NGHÌN TỶ PHÚ 👑", "Bạn đã chinh phục tất cả!")
            };

            foreach (var (threshold, type, title, subtitle) in milestones)
            {
                if (previousCash < threshold && newCash >= threshold && !_triggeredMilestones.Contains(type))
                {
                    _triggeredMilestones.Add(type);
                    TriggerMilestoneEffect(type, title, subtitle);
                    OnMilestoneReached?.Invoke(type);
                    break; // Chỉ trigger milestone cao nhất
                }
            }
        }

        // ─── Effect Orchestration ───────────────────────────────────────

        private void TriggerMilestoneEffect(MilestoneType type, string title, string subtitle)
        {
            // Intensity tăng theo cấp milestone
            float intensity = GetIntensity(type);

            StartCoroutine(MilestoneSequenceCoroutine(type, title, subtitle, intensity));
        }

        private float GetIntensity(MilestoneType type)
        {
            switch (type)
            {
                case MilestoneType.HundredThousand: return 0.3f;
                case MilestoneType.Millionaire: return 0.5f;
                case MilestoneType.TenMillion: return 0.6f;
                case MilestoneType.HundredMillion: return 0.75f;
                case MilestoneType.Billionaire: return 1.0f;
                case MilestoneType.TenBillion: return 1.2f;
                case MilestoneType.HundredBillion: return 1.4f;
                case MilestoneType.Trillionaire: return 1.6f;
                default: return 0.5f;
            }
        }

        /// <summary>
        /// Chuỗi hiệu ứng milestone — chạy tuần tự
        /// </summary>
        private IEnumerator MilestoneSequenceCoroutine(MilestoneType type, string title, string subtitle, float intensity)
        {
            // ① Flash trắng/vàng nhanh
            StartCoroutine(FlashCoroutine(intensity));

            yield return new WaitForSeconds(0.1f);

            // ② Rung màn hình
            if (screenShake != null)
            {
                float shakeDuration = 0.3f + intensity * 0.3f;
                float shakeIntensity = 4f + intensity * 8f;
                screenShake.Shake(shakeDuration, shakeIntensity);
            }

            // ③ Coin burst
            if (coinSpawner != null)
            {
                Vector3 burstPos = netWorthDisplay != null
                    ? netWorthDisplay.position
                    : transform.position;
                int coinCount = (int)(10 + intensity * 20);
                coinSpawner.SpawnCoins(burstPos, coinCount);
            }

            yield return new WaitForSeconds(0.15f);

            // ④ Shimmer sweep
            if (intensity >= 0.5f)
            {
                StartCoroutine(ShimmerSweepCoroutine(intensity));
            }

            // ⑤ Milestone popup
            if (intensity >= 0.4f)
            {
                StartCoroutine(ShowMilestonePopupCoroutine(title, subtitle, intensity));
            }

            // ⑥ Money rain cho cấp cao
            if (intensity >= 1.0f && coinSpawner != null)
            {
                yield return new WaitForSeconds(0.5f);
                coinSpawner.SpawnMoneyRain(2f + intensity);
            }

            // Haptic
#if UNITY_IOS && !UNITY_EDITOR
            if (intensity >= 1.0f)
                IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.NotificationType.Success);
            else
                IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Medium);
#endif
        }

        // ─── Flash Effect ───────────────────────────────────────────────
        private IEnumerator FlashCoroutine(float intensity)
        {
            if (fullScreenFlash == null) yield break;

            Color flashColor = theme != null ? theme.accentGold : UIThemeConfig.HexColor("#F5C542");
            flashColor.a = 0.3f * intensity;

            fullScreenFlash.color = flashColor;

            float elapsed = 0f;
            float duration = 0.4f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                Color c = flashColor;
                c.a = flashColor.a * (1f - t * t); // ease-in fade
                fullScreenFlash.color = c;
                yield return null;
            }

            fullScreenFlash.color = Color.clear;
        }

        // ─── Shimmer Sweep ──────────────────────────────────────────────
        private IEnumerator ShimmerSweepCoroutine(float intensity)
        {
            if (shimmerOverlay == null) yield break;

            shimmerOverlay.gameObject.SetActive(true);
            RectTransform shimmerRect = shimmerOverlay.rectTransform;

            // Shimmer di chuyển từ trái sang phải
            float canvasWidth = _GetCanvasWidth();
            float startX = -canvasWidth - shimmerWidth;
            float endX = canvasWidth + shimmerWidth;

            Color shimmerColor = theme != null ? theme.accentGold : UIThemeConfig.HexColor("#F5C542");
            shimmerColor.a = 0.15f * intensity;
            shimmerOverlay.color = shimmerColor;

            int sweepCount = intensity >= 1f ? 2 : 1;

            for (int s = 0; s < sweepCount; s++)
            {
                float elapsed = 0f;
                float duration = 1.2f / intensity;

                while (elapsed < duration)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / duration;
                    float x = Mathf.Lerp(startX, endX, t);
                    shimmerRect.anchoredPosition = new Vector2(x, shimmerRect.anchoredPosition.y);
                    yield return null;
                }

                if (s < sweepCount - 1)
                    yield return new WaitForSeconds(0.2f);
            }

            shimmerOverlay.gameObject.SetActive(false);
        }

        // ─── Milestone Popup ────────────────────────────────────────────
        private IEnumerator ShowMilestonePopupCoroutine(string title, string subtitle, float intensity)
        {
            if (milestonePopup == null) yield break;

            // Setup text
            if (milestoneTitle != null)
            {
                milestoneTitle.text = title;
                milestoneTitle.color = theme != null ? theme.accentGold : UIThemeConfig.HexColor("#F5C542");
            }
            if (milestoneSubtitle != null)
            {
                milestoneSubtitle.text = subtitle;
                milestoneSubtitle.color = theme != null ? theme.textPrimary : Color.white;
            }

            milestonePopup.gameObject.SetActive(true);
            RectTransform popupRect = milestonePopup.GetComponent<RectTransform>();

            // Animate in — scale from 0 + fade in
            float elapsed = 0f;
            float fadeInDuration = 0.4f;
            popupRect.localScale = Vector3.zero;

            while (elapsed < fadeInDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / fadeInDuration;
                // Ease out back — overshoot nhẹ
                float scale = EaseOutBack(t);
                popupRect.localScale = Vector3.one * scale;
                milestonePopup.alpha = Mathf.Clamp01(t * 2f);
                yield return null;
            }

            popupRect.localScale = Vector3.one;
            milestonePopup.alpha = 1f;

            // Hold
            float holdDuration = 1.5f + intensity * 0.5f;
            yield return new WaitForSeconds(holdDuration);

            // Animate out — fade + scale down
            elapsed = 0f;
            float fadeOutDuration = 0.5f;
            while (elapsed < fadeOutDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / fadeOutDuration;
                milestonePopup.alpha = 1f - t;
                popupRect.localScale = Vector3.one * (1f - t * 0.3f);
                yield return null;
            }

            milestonePopup.alpha = 0f;
            milestonePopup.gameObject.SetActive(false);
        }

        // ─── Helpers ────────────────────────────────────────────────────
        private float EaseOutBack(float t)
        {
            const float c1 = 1.70158f;
            const float c3 = c1 + 1f;
            return 1f + c3 * Mathf.Pow(t - 1f, 3f) + c1 * Mathf.Pow(t - 1f, 2f);
        }

        private float _GetCanvasWidth()
        {
            Canvas canvas = GetComponentInParent<Canvas>();
            if (canvas != null)
            {
                RectTransform canvasRect = canvas.GetComponent<RectTransform>();
                return canvasRect.rect.width;
            }
            return 400f;
        }

        /// <summary>
        /// Reset tất cả milestones đã đạt (khi bắt đầu cuộc sống mới)
        /// </summary>
        public void ResetMilestones()
        {
            _triggeredMilestones.Clear();
        }

        /// <summary>
        /// Trigger milestone thủ công (cho testing)
        /// </summary>
        public void TriggerManual(MilestoneType type)
        {
            var data = new Dictionary<MilestoneType, (string title, string subtitle)>
            {
                { MilestoneType.Millionaire, ("TRIỆU PHÚ", "Hành trình vạn dặm!") },
                { MilestoneType.Billionaire, ("✦ TỶ PHÚ ✦", "Tiền không phải vấn đề!") },
                { MilestoneType.Trillionaire, ("👑 NGHÌN TỶ PHÚ 👑", "Bạn đã chinh phục tất cả!") }
            };

            if (data.TryGetValue(type, out var info))
            {
                TriggerMilestoneEffect(type, info.title, info.subtitle);
            }
        }
    }
}
