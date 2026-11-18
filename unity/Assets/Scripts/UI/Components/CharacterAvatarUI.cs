// ═══════════════════════════════════════════════════════════════════════════
// CharacterAvatarUI.cs — Hệ thống hiển thị nhân vật & phản hồi tương tác
// Tích hợp với 3D Diorama / RenderTexture hoặc 2D Animated Luxury Avatar
// Nhân vật tự động đổi trang phục, phụ kiện (đồng hồ vàng, kính mát, vest)
// theo cấp bậc tài sản (Sinh viên -> Khởi nghiệp -> Triệu phú -> Siêu tỷ phú)
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace ZeroBillionaire.UI
{
    public class CharacterAvatarUI : MonoBehaviour
    {
        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("Visual Components")]
        [SerializeField] private RawImage dioramaRenderImage; // Render texture từ Camera 3D diorama
        [SerializeField] private Image avatarMoodBadge;        // Icon cảm xúc (Hạnh phúc, Stress, Thành công)
        [SerializeField] private TextMeshProUGUI characterNameText;
        [SerializeField] private TextMeshProUGUI titleStatusText; // "Doanh nhân khởi nghiệp", "Bố già tài chính"...
        [SerializeField] private Image auraGlow;               // Vòng hào quang vàng khi lên tỷ phú

        [Header("Character Outfit Tier Sprites (2D Fallback)")]
        [SerializeField] private Image characterBodyImage;
        [SerializeField] private Image characterAccessoryImage; // Đồng hồ Rolex vàng, nhẫn kim cương...
        [SerializeField] private Sprite[] outfitTiers;         // 0: Sinh viên, 1: Công sở, 2: Doanh nhân, 3: Tỷ phú

        [Header("Interactive Reaction")]
        [SerializeField] private Button avatarClickTrigger;
        [SerializeField] private TextMeshProUGUI dialogueBubbleText;
        [SerializeField] private CanvasGroup dialogueBubbleCanvas;

        private Coroutine _dialogueCoroutine;
        private string[] _millionaireQuotes = new string[]
        {
            "Thời gian là thứ tài sản quý giá nhất của tôi.",
            "Tiền đẻ ra tiền, đó là quy luật bất biến.",
            "Đừng làm việc vì tiền, hãy bắt tiền làm việc cho bạn!",
            "Một cú bắt tay hôm nay trị giá vài trăm tỷ."
        };

        private void Awake()
        {
            if (avatarClickTrigger != null)
                avatarClickTrigger.onClick.AddListener(OnAvatarTapped);

            if (dialogueBubbleCanvas != null)
                dialogueBubbleCanvas.alpha = 0f;
        }

        public void UpdateCharacterVisuals(CharacterStats stats)
        {
            if (stats == null) return;

            if (characterNameText != null)
                characterNameText.text = stats.characterName ?? "Nhà Đầu Tư";

            // Cập nhật danh xưng theo tài sản
            string title = GetWealthTitle(stats.cash);
            if (titleStatusText != null)
            {
                titleStatusText.text = title;
                titleStatusText.color = stats.cash >= 1_000_000_000 ? theme.accentGold : theme.textSecondary;
            }

            // Hào quang tỷ phú
            if (auraGlow != null)
            {
                bool isBillionaire = stats.cash >= 1_000_000_000;
                auraGlow.gameObject.SetActive(isBillionaire);
            }

            // Cập nhật cảm xúc
            UpdateMoodIcon(stats);
        }

        private string GetWealthTitle(long cash)
        {
            if (cash >= 1_000_000_000_000) return "👑 BẬC THẦY TÀI PHIỆT TOÀN CẦU";
            if (cash >= 100_000_000_000) return "✦ ÔNG TRÙM ĐẦU TƯ M&A";
            if (cash >= 10_000_000_000) return "✦ TỶ PHÚ ĐÔ LA TỰ THÂN";
            if (cash >= 1_000_000_000) return "✦ ĐẠI GIA MỚI NỔI";
            if (cash >= 100_000_000) return "Giám đốc Doanh nghiệp";
            if (cash >= 20_000_000) return "Chuyên viên Cao cấp";
            return "Thanh niên Khởi nghiệp";
        }

        private void UpdateMoodIcon(CharacterStats stats)
        {
            if (avatarMoodBadge == null) return;

            if (stats.health < 30 || stats.stress > 70)
                avatarMoodBadge.color = theme.lossRed;
            else if (stats.happiness > 75)
                avatarMoodBadge.color = theme.accentGold;
            else
                avatarMoodBadge.color = theme.profitGreen;
        }

        public void OnAvatarTapped()
        {
            if (dialogueBubbleCanvas == null || dialogueBubbleText == null) return;

            string quote = _millionaireQuotes[Random.Range(0, _millionaireQuotes.Length)];
            dialogueBubbleText.text = quote;

            if (_dialogueCoroutine != null)
                StopCoroutine(_dialogueCoroutine);
            _dialogueCoroutine = StartCoroutine(ShowDialogueBubble());

            // Nhún nhẹ nhân vật
            StartCoroutine(BounceAvatar());

#if UNITY_IOS && !UNITY_EDITOR
            IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.ImpactType.Light);
#endif
        }

        private IEnumerator ShowDialogueBubble()
        {
            dialogueBubbleCanvas.alpha = 1f;
            yield return new WaitForSeconds(2.8f);
            float elapsed = 0f;
            while (elapsed < 0.4f)
            {
                elapsed += Time.deltaTime;
                dialogueBubbleCanvas.alpha = 1f - (elapsed / 0.4f);
                yield return null;
            }
            dialogueBubbleCanvas.alpha = 0f;
        }

        private IEnumerator BounceAvatar()
        {
            Vector3 original = transform.localScale;
            transform.localScale = original * 1.05f;
            yield return new WaitForSeconds(0.12f);
            transform.localScale = original;
        }
    }
}
