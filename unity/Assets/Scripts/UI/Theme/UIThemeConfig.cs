// ═══════════════════════════════════════════════════════════════════════════
// UIThemeConfig.cs — ScriptableObject chứa toàn bộ theme "Luxury Dark Mode"
// Tạo asset: Right-click → Create → Zero to Billionaire → UI Theme Config
// ═══════════════════════════════════════════════════════════════════════════
using UnityEngine;
using TMPro;

namespace ZeroToBillionaire.UI
{
    [CreateAssetMenu(fileName = "LuxuryTheme", menuName = "Zero to Billionaire/UI Theme Config")]
    public class UIThemeConfig : ScriptableObject
    {
        // ─── Singleton Access ────────────────────────────────────────────
        private static UIThemeConfig _instance;
        public static UIThemeConfig Instance
        {
            get
            {
                if (_instance == null)
                    _instance = Resources.Load<UIThemeConfig>("LuxuryTheme");
                return _instance;
            }
        }

        // ─── Bảng Màu Chính ─────────────────────────────────────────────
        [Header("══ BẢNG MÀU ══")]
        [Tooltip("Nền chính của app")]
        public Color backgroundColor = HexColor("#0B0F14");

        [Tooltip("Bề mặt card, panel")]
        public Color surfaceColor = HexColor("#151B23");

        [Tooltip("Bề mặt nâng cao (card lồng, popup)")]
        public Color surfaceElevatedColor = HexColor("#1C2333");

        [Tooltip("Viền card mờ nhạt")]
        public Color surfaceBorderColor = HexColor("#2A3142");

        [Tooltip("Vàng nhấn — accent chính")]
        public Color accentGold = HexColor("#F5C542");

        [Tooltip("Vàng đậm hơn cho gradient")]
        public Color accentGoldDark = HexColor("#D4A017");

        [Tooltip("Xanh lợi nhuận")]
        public Color profitGreen = HexColor("#2ECC71");

        [Tooltip("Đỏ thua lỗ")]
        public Color lossRed = HexColor("#E74C3C");

        [Tooltip("Chữ chính")]
        public Color textPrimary = HexColor("#E6EDF3");

        [Tooltip("Chữ phụ / label")]
        public Color textSecondary = HexColor("#8D9CAB");

        [Tooltip("Chữ bị vô hiệu")]
        public Color textDisabled = HexColor("#4A5568");

        // ─── Màu Bổ Sung ────────────────────────────────────────────────
        [Header("══ MÀU BỔ SUNG ══")]
        public Color warningOrange = HexColor("#F39C12");
        public Color infoBlue = HexColor("#3498DB");
        public Color prestigePurple = HexColor("#9B59B6");

        // ─── Card & Shadow ──────────────────────────────────────────────
        [Header("══ CARD & SHADOW ══")]
        [Range(0.5f, 4f)]
        public float cardBorderWidth = 1f;

        public Color cardBorderColor = HexColor("#F5C542", 0.2f);

        [Tooltip("Bóng lớp 1 — gần nhất")]
        public Color shadowLayer1 = HexColor("#000000", 0.4f);
        public Vector2 shadowOffset1 = new Vector2(0, 2);
        public float shadowBlur1 = 4f;

        [Tooltip("Bóng lớp 2 — trung")]
        public Color shadowLayer2 = HexColor("#000000", 0.25f);
        public Vector2 shadowOffset2 = new Vector2(0, 6);
        public float shadowBlur2 = 12f;

        [Tooltip("Bóng lớp 3 — xa, lan rộng")]
        public Color shadowLayer3 = HexColor("#000000", 0.15f);
        public Vector2 shadowOffset3 = new Vector2(0, 12);
        public float shadowBlur3 = 24f;

        // ─── Typography ─────────────────────────────────────────────────
        [Header("══ TYPOGRAPHY ══")]
        [Tooltip("Font tiêu đề — Playfair Display hoặc Orbitron")]
        public TMP_FontAsset titleFont;

        [Tooltip("Font body — Inter, SF Pro hoặc Noto Sans")]
        public TMP_FontAsset bodyFont;

        [Tooltip("Font số tiền — JetBrains Mono, Fira Code (tabular-nums)")]
        public TMP_FontAsset moneyFont;

        [Header("Cỡ chữ")]
        public float titleSize = 28f;
        public float subtitleSize = 18f;
        public float bodySize = 14f;
        public float captionSize = 11f;
        public float moneyLargeSize = 42f;
        public float moneyMediumSize = 24f;
        public float moneySmallSize = 16f;

        // ─── Animation Timing ───────────────────────────────────────────
        [Header("══ ANIMATION ══")]
        [Tooltip("Thời gian đếm nhảy số tiền")]
        [Range(0.3f, 2f)]
        public float countUpDuration = 0.8f;

        [Tooltip("Thời gian hover/press card")]
        [Range(0.05f, 0.3f)]
        public float cardPressDuration = 0.12f;

        [Tooltip("Scale khi nhấn card")]
        [Range(0.92f, 0.99f)]
        public float cardPressScale = 0.97f;

        [Tooltip("Scale khi hover card (chỉ dùng trên PC)")]
        [Range(1.01f, 1.06f)]
        public float cardHoverScale = 1.02f;

        [Tooltip("Đường cong ease-out cho animation")]
        public AnimationCurve easeOutBack = new AnimationCurve(
            new Keyframe(0f, 0f, 0f, 2f),
            new Keyframe(0.7f, 1.05f),
            new Keyframe(1f, 1f, 0f, 0f)
        );

        public AnimationCurve easeOutQuart = new AnimationCurve(
            new Keyframe(0f, 0f),
            new Keyframe(0.25f, 0.6f),
            new Keyframe(0.5f, 0.88f),
            new Keyframe(0.75f, 0.98f),
            new Keyframe(1f, 1f)
        );

        // ─── Particle Effects ───────────────────────────────────────────
        [Header("══ PARTICLES ══")]
        [Range(5, 30)]
        public int coinBurstCount = 15;
        [Range(0.5f, 3f)]
        public float coinLifetime = 1.8f;
        [Range(50f, 300f)]
        public float coinSpread = 120f;
        public Color coinColorStart = HexColor("#F5C542");
        public Color coinColorEnd = HexColor("#D4A017", 0f);

        // ─── Progress Bar ───────────────────────────────────────────────
        [Header("══ PROGRESS BAR ══")]
        [Range(0.2f, 1f)]
        public float glowIntensity = 0.6f;
        [Range(2f, 16f)]
        public float glowSize = 8f;
        [Range(0.5f, 2f)]
        public float barAnimDuration = 0.6f;

        // ─── Milestone Thresholds ───────────────────────────────────────
        [Header("══ MILESTONES ══")]
        [Tooltip("Ngưỡng triệu phú (VNĐ)")]
        public long millionaireThreshold = 1_000_000_000; // 1 tỷ VNĐ
        [Tooltip("Ngưỡng tỷ phú (VNĐ)")]
        public long billionaireThreshold = 1_000_000_000_000; // 1 nghìn tỷ VNĐ

        public float milestoneShakeDuration = 0.5f;
        public float milestoneShakeIntensity = 8f;
        public float milestoneGlowDuration = 2f;

        // ─── Helper: Hex to Color ───────────────────────────────────────
        public static Color HexColor(string hex, float alphaOverride = -1f)
        {
            if (ColorUtility.TryParseHtmlString(hex, out Color color))
            {
                if (alphaOverride >= 0f)
                    color.a = alphaOverride;
                return color;
            }
            return Color.magenta; // dễ nhận ra lỗi
        }

        // ─── Helper: Lấy màu cho stat ──────────────────────────────────
        public Color GetStatColor(float normalizedValue)
        {
            if (normalizedValue >= 0.7f) return profitGreen;
            if (normalizedValue >= 0.4f) return warningOrange;
            return lossRed;
        }

        // ─── Helper: Lấy gradient cho progress bar ─────────────────────
        public Color GetProgressGradient(float t, Color baseColor)
        {
            // Blend giữa version tối và sáng của baseColor
            Color dark = baseColor * 0.6f;
            dark.a = 1f;
            return Color.Lerp(dark, baseColor, t);
        }
    }
}
