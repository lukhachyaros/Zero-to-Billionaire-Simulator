// ═══════════════════════════════════════════════════════════════════════════
// MainScreenUI.cs — Màn hình chính "Luxury Dark Mode" thay thế MobilePortraitUI
// Giữ nguyên 100% logic game, chỉ thay phần hiển thị
//
// Layout (portrait):
// ┌─────────────────────────────┐
// │  ✦ ZERO TO BILLIONAIRE ✦   │  ← Title bar (Orbitron)
// │─────────────────────────────│
// │  ┌───────────────────────┐  │
// │  │     TÀI SẢN RÒNG      │  │  ← Net Worth card (gold accent)
// │  │   ₫ 1.234.567.890     │  │  ← AnimatedMoneyText (monospace)
// │  │   ▲ +₫500K/tháng      │  │  ← Monthly income delta
// │  └───────────────────────┘  │
// │                             │
// │  ┌──────────┐ ┌──────────┐  │
// │  │ 🎂 Tuổi  │ │ 💼 Nghề  │  │  ← Info cards
// │  │   25     │ │ Lập trình│  │
// │  └──────────┘ └──────────┘  │
// │                             │
// │  ┌───────────────────────┐  │
// │  │ 🫀 Sức khỏe  ████████░│  │  ← Glow progress bars
// │  │ 😊 Hạnh phúc ██████░░░│  │
// │  │ 🧠 Trí tuệ   █████████│  │
// │  │ 💪 Kỷ luật   ████░░░░░│  │
// │  │ 😰 Căng thẳng ██░░░░░░│  │
// │  └───────────────────────┘  │
// │                             │
// │  ┌──[🎂 SỐNG THÊM 1 NĂM]──┐│  ← Primary gold button
// │  └─────────────────────────┘│
// │                             │
// │  ┌───────────────────────┐  │
// │  │ 📰 Bottom Sheet        │  │  ← Event decisions
// │  │ [Option A] [Option B]  │  │
// │  └───────────────────────┘  │
// └─────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Events;
using ZeroToBillionaire.Mobile.iOS;

namespace ZeroToBillionaire.UI
{
    public class MainScreenUI : MonoBehaviour
    {
        // ═════════════════════════════════════════════════════════════════
        //  SERIALIZED REFERENCES — Gắn trong Inspector
        // ═════════════════════════════════════════════════════════════════

        [Header("══ THEME ══")]
        [SerializeField] private UIThemeConfig theme;

        // ─── Safe Area ──────────────────────────────────────────────────
        [Header("══ SAFE AREA ══")]
        [SerializeField] private RectTransform safeAreaPanel;

        // ─── Title Bar ──────────────────────────────────────────────────
        [Header("══ TITLE BAR ══")]
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private Image titleBarBackground;

        // ─── Net Worth Card ─────────────────────────────────────────────
        [Header("══ NET WORTH CARD ══")]
        [SerializeField] private LuxuryCard netWorthCard;
        [SerializeField] private AnimatedMoneyText netWorthText;
        [SerializeField] private TextMeshProUGUI netWorthLabel;
        [SerializeField] private AnimatedMoneyText monthlyIncomeText;
        [SerializeField] private TextMeshProUGUI monthlyIncomeLabel;
        [SerializeField] private Image netWorthTrendArrow;

        // ─── Info Cards ─────────────────────────────────────────────────
        [Header("══ INFO CARDS ══")]
        [SerializeField] private LuxuryCard ageCard;
        [SerializeField] private TextMeshProUGUI ageValueText;
        [SerializeField] private TextMeshProUGUI ageLabelText;

        [SerializeField] private LuxuryCard jobCard;
        [SerializeField] private TextMeshProUGUI jobValueText;
        [SerializeField] private TextMeshProUGUI jobLabelText;

        [SerializeField] private LuxuryCard educationCard;
        [SerializeField] private TextMeshProUGUI educationValueText;
        [SerializeField] private TextMeshProUGUI educationLabelText;

        [SerializeField] private LuxuryCard statusCard;
        [SerializeField] private TextMeshProUGUI statusValueText;
        [SerializeField] private TextMeshProUGUI statusLabelText;

        // ─── Stat Bars ──────────────────────────────────────────────────
        [Header("══ STAT BARS ══")]
        [SerializeField] private LuxuryCard statsCard;
        [SerializeField] private GlowProgressBar healthBar;
        [SerializeField] private GlowProgressBar happinessBar;
        [SerializeField] private GlowProgressBar intelligenceBar;
        [SerializeField] private GlowProgressBar disciplineBar;
        [SerializeField] private GlowProgressBar stressBar;
        [SerializeField] private GlowProgressBar appearanceBar;

        // ─── Main Action Button ─────────────────────────────────────────
        [Header("══ ACTION BUTTON ══")]
        [SerializeField] private LuxuryButton ageUpButton;
        [SerializeField] private TextMeshProUGUI ageUpButtonText;

        // ─── Event Bottom Sheet ─────────────────────────────────────────
        [Header("══ EVENT DISPLAY ══")]
        [SerializeField] private RectTransform bottomSheet;
        [SerializeField] private CanvasGroup bottomSheetCanvas;
        [SerializeField] private LuxuryCard eventCard;
        [SerializeField] private TextMeshProUGUI eventTitleText;
        [SerializeField] private TextMeshProUGUI eventDescriptionText;
        [SerializeField] private TextMeshProUGUI eventCategoryText;
        [SerializeField] private RectTransform optionsContainer;
        [SerializeField] private GameObject optionButtonPrefab; // Prefab với LuxuryButton

        [Header("Event Result")]
        [SerializeField] private CanvasGroup resultPanel;
        [SerializeField] private TextMeshProUGUI resultMessageText;
        [SerializeField] private Image resultIcon;

        // ─── Effects ────────────────────────────────────────────────────
        [Header("══ EFFECTS ══")]
        [SerializeField] private CoinParticleSpawner coinSpawner;
        [SerializeField] private MilestoneEffectController milestoneController;
        [SerializeField] private ScreenShakeEffect screenShake;

        // ─── Background ─────────────────────────────────────────────────
        [Header("══ BACKGROUND ══")]
        [SerializeField] private Image mainBackground;
        [SerializeField] private Image ambientGlow; // Glow vàng mờ phía sau net worth card

        // ═════════════════════════════════════════════════════════════════
        //  PRIVATE STATE
        // ═════════════════════════════════════════════════════════════════
        private long _previousCash;
        private List<GameObject> _spawnedOptionButtons = new List<GameObject>();
        private bool _isBottomSheetVisible;
        private Coroutine _bottomSheetCoroutine;
        private Coroutine _ambientGlowCoroutine;

        // ═════════════════════════════════════════════════════════════════
        //  LIFECYCLE
        // ═════════════════════════════════════════════════════════════════

        private void Start()
        {
            ApplySafeArea();
            ApplyThemeToAll();
            SetupEventSubscriptions();
            HideBottomSheet(false);
            StartAmbientGlow();

            // Khởi tạo với data hiện tại nếu GameManager đã sẵn sàng
            if (GameManager.Instance != null && GameManager.Instance.Stats != null)
            {
                UpdateAllDisplays(GameManager.Instance.Stats);
            }
        }

        private void OnDestroy()
        {
            RemoveEventSubscriptions();
        }

        // ═════════════════════════════════════════════════════════════════
        //  SAFE AREA (iPhone notch, Dynamic Island, home bar)
        // ═════════════════════════════════════════════════════════════════

        private void ApplySafeArea()
        {
            if (safeAreaPanel == null) return;

            Rect safeArea = Screen.safeArea;
            Vector2 anchorMin = safeArea.position;
            Vector2 anchorMax = safeArea.position + safeArea.size;
            anchorMin.x /= Screen.width;
            anchorMin.y /= Screen.height;
            anchorMax.x /= Screen.width;
            anchorMax.y /= Screen.height;

            safeAreaPanel.anchorMin = anchorMin;
            safeAreaPanel.anchorMax = anchorMax;
        }

        // ═════════════════════════════════════════════════════════════════
        //  THEME APPLICATION
        // ═════════════════════════════════════════════════════════════════

        private void ApplyThemeToAll()
        {
            if (theme == null)
            {
                Debug.LogWarning("[MainScreenUI] UIThemeConfig chưa gắn! Sử dụng Resources fallback.");
                theme = UIThemeConfig.Instance;
                if (theme == null) return;
            }

            // Background chính
            if (mainBackground != null)
                mainBackground.color = theme.backgroundColor;

            // Title bar
            if (titleBarBackground != null)
                titleBarBackground.color = theme.surfaceColor;
            if (titleText != null)
            {
                titleText.color = theme.accentGold;
                titleText.text = "✦ ZERO TO BILLIONAIRE ✦";
                if (theme.titleFont != null)
                    titleText.font = theme.titleFont;
                titleText.fontSize = theme.titleSize;
                titleText.characterSpacing = 4f;
            }

            // Net Worth card labels
            if (netWorthLabel != null)
            {
                netWorthLabel.text = "TÀI SẢN RÒNG";
                netWorthLabel.color = theme.textSecondary;
                if (theme.bodyFont != null)
                    netWorthLabel.font = theme.bodyFont;
                netWorthLabel.fontSize = theme.captionSize;
                netWorthLabel.characterSpacing = 6f;
            }

            if (monthlyIncomeLabel != null)
            {
                monthlyIncomeLabel.text = "Thu nhập ròng / tháng";
                monthlyIncomeLabel.color = theme.textSecondary;
                monthlyIncomeLabel.fontSize = theme.captionSize;
            }

            // Info card labels
            SetupInfoCardLabel(ageLabelText, "TUỔI");
            SetupInfoCardLabel(jobLabelText, "NGHỀ NGHIỆP");
            SetupInfoCardLabel(educationLabelText, "HỌC VẤN");
            SetupInfoCardLabel(statusLabelText, "HÔN NHÂN");

            // Info card values
            SetupInfoCardValue(ageValueText);
            SetupInfoCardValue(jobValueText);
            SetupInfoCardValue(educationValueText);
            SetupInfoCardValue(statusValueText);

            // Stat bar labels
            SetupStatBar(healthBar, "Sức khỏe");
            SetupStatBar(happinessBar, "Hạnh phúc");
            SetupStatBar(intelligenceBar, "Trí tuệ");
            SetupStatBar(disciplineBar, "Kỷ luật");
            SetupStatBar(stressBar, "Căng thẳng");
            SetupStatBar(appearanceBar, "Ngoại hình");

            // Age up button
            if (ageUpButton != null)
            {
                ageUpButton.SetText("🎂 SỐNG THÊM 1 NĂM");
                ageUpButton.SetStyle(ButtonStyle.Primary);
            }

            // Event text colors
            if (eventTitleText != null)
            {
                eventTitleText.color = theme.textPrimary;
                if (theme.titleFont != null) eventTitleText.font = theme.titleFont;
            }
            if (eventDescriptionText != null)
                eventDescriptionText.color = theme.textSecondary;
            if (eventCategoryText != null)
            {
                eventCategoryText.color = theme.accentGold;
                eventCategoryText.fontSize = theme.captionSize;
            }

            // Ambient glow
            if (ambientGlow != null)
            {
                Color glow = theme.accentGold;
                glow.a = 0.04f;
                ambientGlow.color = glow;
            }
        }

        private void SetupInfoCardLabel(TextMeshProUGUI label, string text)
        {
            if (label == null) return;
            label.text = text;
            label.color = theme.textSecondary;
            label.fontSize = theme.captionSize;
            label.characterSpacing = 3f;
            if (theme.bodyFont != null) label.font = theme.bodyFont;
        }

        private void SetupInfoCardValue(TextMeshProUGUI value)
        {
            if (value == null) return;
            value.color = theme.textPrimary;
            value.fontSize = theme.subtitleSize;
            if (theme.bodyFont != null) value.font = theme.bodyFont;
        }

        private void SetupStatBar(GlowProgressBar bar, string label)
        {
            if (bar == null) return;
            bar.SetLabel(label);
        }

        // ═════════════════════════════════════════════════════════════════
        //  EVENT SUBSCRIPTIONS (GameManager events)
        // ═════════════════════════════════════════════════════════════════

        private void SetupEventSubscriptions()
        {
            if (GameManager.Instance == null) return;

            GameManager.Instance.OnAgeUp += HandleAgeUp;
            GameManager.Instance.OnEventTriggered += HandleEventTriggered;
            GameManager.Instance.OnGameOver += HandleGameOver;

            // Button click
            if (ageUpButton != null)
            {
                ageUpButton.OnClick += HandleAgeUpButtonClick;
            }
        }

        private void RemoveEventSubscriptions()
        {
            if (GameManager.Instance == null) return;

            GameManager.Instance.OnAgeUp -= HandleAgeUp;
            GameManager.Instance.OnEventTriggered -= HandleEventTriggered;
            GameManager.Instance.OnGameOver -= HandleGameOver;

            if (ageUpButton != null)
                ageUpButton.OnClick -= HandleAgeUpButtonClick;
        }

        // ═════════════════════════════════════════════════════════════════
        //  EVENT HANDLERS
        // ═════════════════════════════════════════════════════════════════

        private void HandleAgeUpButtonClick()
        {
            if (GameManager.Instance == null) return;
            GameManager.Instance.AgeUp();
        }

        private void HandleAgeUp(int currentAge)
        {
            CharacterStats stats = GameManager.Instance != null ? GameManager.Instance.Stats : null;
            if (stats == null) return;

            // Lưu cash cũ trước khi update
            long previousCash = _previousCash;

            UpdateAllDisplays(stats);

            // Check milestones
            if (milestoneController != null)
                milestoneController.CheckMilestone(previousCash, stats.cash);

            // Coin burst nhỏ nếu thu nhập dương
            long netIncome = stats.monthlyIncome - stats.monthlyExpense;
            if (netIncome > 0 && coinSpawner != null && netWorthText != null)
            {
                coinSpawner.SpawnCoinsFromUI(
                    netWorthText.GetComponent<RectTransform>(),
                    Mathf.Clamp((int)(netIncome / 1000000), 3, 12)
                );
            }

            // Light shake khi tuổi tăng
            if (screenShake != null)
                screenShake.ShakeLight();

            // Flash age card
            if (ageCard != null)
                ageCard.FlashBorder(0.5f);

            _previousCash = stats.cash;
        }

        private void HandleEventTriggered(GameEvent gameEvent)
        {
            DisplayEvent(gameEvent);
        }

        private void HandleGameOver()
        {
            CharacterStats finalStats = GameManager.Instance != null ? GameManager.Instance.Stats : null;
            if (finalStats == null) return;

            // Tắt nút age up
            if (ageUpButton != null)
                ageUpButton.SetInteractable(false);

            // Hiển thị game over trong bottom sheet
            ShowGameOverDisplay(finalStats);
        }

        // ═════════════════════════════════════════════════════════════════
        //  DISPLAY UPDATES
        // ═════════════════════════════════════════════════════════════════

        /// <summary>
        /// Cập nhật toàn bộ hiển thị từ CharacterStats
        /// </summary>
        public void UpdateAllDisplays(CharacterStats stats)
        {
            if (stats == null) return;

            UpdateNetWorth(stats);
            UpdateInfoCards(stats);
            UpdateStatBars(stats);
            UpdateAmbientGlow(stats);
        }

        // ─── Net Worth ──────────────────────────────────────────────────
        private void UpdateNetWorth(CharacterStats stats)
        {
            // Số tiền chính — count-up animation
            if (netWorthText != null)
                netWorthText.SetValue(stats.cash - stats.debt);

            // Thu nhập ròng tháng
            long netMonthly = stats.monthlyIncome - stats.monthlyExpense;
            if (monthlyIncomeText != null)
                monthlyIncomeText.SetValue(netMonthly);

            // Trend arrow
            if (netWorthTrendArrow != null)
            {
                if (netMonthly > 0)
                {
                    netWorthTrendArrow.color = theme.profitGreen;
                    netWorthTrendArrow.rectTransform.localEulerAngles = Vector3.zero;
                }
                else if (netMonthly < 0)
                {
                    netWorthTrendArrow.color = theme.lossRed;
                    netWorthTrendArrow.rectTransform.localEulerAngles = new Vector3(0, 0, 180);
                }
                else
                {
                    netWorthTrendArrow.color = theme.textSecondary;
                }
            }

            // Flash card khi có thay đổi lớn
            long delta = System.Math.Abs(stats.cash - _previousCash);
            if (delta > 100_000_000 && netWorthCard != null) // > 100M VNĐ
            {
                netWorthCard.FlashBorder(0.8f);
                netWorthCard.SetGlow(true);
                StartCoroutine(DelayedAction(1.5f, () => netWorthCard.SetGlow(false)));
            }
        }

        // ─── Info Cards ─────────────────────────────────────────────────
        private void UpdateInfoCards(CharacterStats stats)
        {
            // Tuổi — với animation pop
            if (ageValueText != null)
            {
                string ageStr = stats.age.ToString();
                if (ageValueText.text != ageStr)
                {
                    ageValueText.text = ageStr;
                    // Pop animation
                    StartCoroutine(PopTextCoroutine(ageValueText.transform));
                }
            }

            // Nghề nghiệp
            if (jobValueText != null)
            {
                string job = string.IsNullOrEmpty(stats.currentJob) ? "Chưa có" : stats.currentJob;
                jobValueText.text = job;
                jobValueText.color = string.IsNullOrEmpty(stats.currentJob)
                    ? theme.textDisabled
                    : theme.textPrimary;
            }

            // Học vấn
            if (educationValueText != null)
            {
                educationValueText.text = stats.educationLevel ?? "Mầm non";
            }

            // Hôn nhân
            if (statusValueText != null)
            {
                statusValueText.text = stats.maritalStatus ?? "Độc thân";
                if (stats.childrenCount > 0)
                    statusValueText.text += $" · {stats.childrenCount} con";
            }
        }

        // ─── Stat Bars ──────────────────────────────────────────────────
        private void UpdateStatBars(CharacterStats stats)
        {
            SetStatBar(healthBar, stats.health, "Sức khỏe");
            SetStatBar(happinessBar, stats.happiness, "Hạnh phúc");
            SetStatBar(intelligenceBar, stats.intelligence, "Trí tuệ");
            SetStatBar(disciplineBar, stats.discipline, "Kỷ luật");
            SetStatBar(appearanceBar, stats.appearance, "Ngoại hình");

            // Stress bar — reverse color (cao = xấu)
            if (stressBar != null)
            {
                stressBar.SetValue(stats.stress);
                // Override color: stress cao = đỏ
                if (stats.stress > 70)
                    stressBar.SetBarColor(theme.lossRed);
                else if (stats.stress > 40)
                    stressBar.SetBarColor(theme.warningOrange);
                else
                    stressBar.SetBarColor(theme.profitGreen);
            }
        }

        private void SetStatBar(GlowProgressBar bar, float value, string label)
        {
            if (bar == null) return;

            float previousValue = bar.CurrentValue * 100f;
            bar.SetValue(value);

            // Flash nếu thay đổi đáng kể (>10 điểm)
            float delta = value - previousValue;
            if (Mathf.Abs(delta) > 10f)
            {
                bar.Flash(delta > 0 ? theme.profitGreen : theme.lossRed);
            }
        }

        // ─── Ambient Glow (thay đổi theo wealth) ───────────────────────
        private void UpdateAmbientGlow(CharacterStats stats)
        {
            if (ambientGlow == null || theme == null) return;

            // Glow intensity tăng theo wealth
            float wealthRatio = Mathf.Clamp01(stats.cash / (float)theme.billionaireThreshold);
            Color glow = theme.accentGold;
            glow.a = Mathf.Lerp(0.02f, 0.12f, wealthRatio);
            ambientGlow.color = glow;
        }

        // ═════════════════════════════════════════════════════════════════
        //  EVENT DISPLAY (Bottom Sheet)
        // ═════════════════════════════════════════════════════════════════

        /// <summary>
        /// Hiển thị sự kiện với bottom sheet slide-up animation
        /// </summary>
        public void DisplayEvent(GameEvent gameEvent)
        {
            if (gameEvent == null) return;

            // Tắt nút age up trong khi quyết định
            if (ageUpButton != null)
                ageUpButton.SetInteractable(false);

            // Populate event data
            if (eventTitleText != null) eventTitleText.text = gameEvent.title;
            if (eventDescriptionText != null) eventDescriptionText.text = gameEvent.description;
            if (eventCategoryText != null)
            {
                eventCategoryText.text = gameEvent.category?.ToUpperInvariant() ?? "SỰ KIỆN";
            }

            // Clear old option buttons
            ClearOptionButtons();

            // Spawn option buttons
            if (gameEvent.options != null && optionButtonPrefab != null && optionsContainer != null)
            {
                foreach (var option in gameEvent.options)
                {
                    SpawnOptionButton(option);
                }
            }

            // Show bottom sheet
            ShowBottomSheet();

            // Haptic
#if UNITY_IOS && !UNITY_EDITOR
            IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.NotificationType.Warning);
#endif
        }

        private void SpawnOptionButton(EventOption option)
        {
            if (optionButtonPrefab == null || optionsContainer == null) return;

            GameObject btnObj = Instantiate(optionButtonPrefab, optionsContainer);
            _spawnedOptionButtons.Add(btnObj);

            // Setup button
            LuxuryButton luxBtn = btnObj.GetComponent<LuxuryButton>();
            if (luxBtn != null)
            {
                luxBtn.SetText(option.label);
                luxBtn.SetStyle(ButtonStyle.Secondary);

                // Capture cho closure
                EventOption capturedOption = option;
                luxBtn.OnClick += () => SelectOption(capturedOption);
            }
            else
            {
                // Fallback: standard Unity button
                Button btn = btnObj.GetComponent<Button>();
                TextMeshProUGUI txt = btnObj.GetComponentInChildren<TextMeshProUGUI>();
                if (txt != null) txt.text = option.label;
                if (btn != null)
                {
                    EventOption capturedOption = option;
                    btn.onClick.AddListener(() => SelectOption(capturedOption));
                }
            }

            // Requirement text (nếu có)
            if (!string.IsNullOrEmpty(option.requirementText))
            {
                TextMeshProUGUI reqText = btnObj.transform.Find("RequirementText")?.GetComponent<TextMeshProUGUI>();
                if (reqText != null)
                {
                    reqText.text = option.requirementText;
                    reqText.color = theme != null ? theme.textDisabled : Color.gray;
                }
            }

            // Fade in animation cho mỗi button
            CanvasGroup cg = btnObj.GetComponent<CanvasGroup>();
            if (cg == null) cg = btnObj.AddComponent<CanvasGroup>();
            StartCoroutine(FadeInCoroutine(cg, 0.2f, _spawnedOptionButtons.Count * 0.08f));
        }

        private void SelectOption(EventOption option)
        {
            if (EventEngine.Instance == null || GameManager.Instance == null) return;

            // Gọi logic game (giữ nguyên)
            EventEngine.Instance.ResolveOption(option, GameManager.Instance.Stats);

            // Coin effect khi chọn
            if (coinSpawner != null && optionsContainer != null)
            {
                coinSpawner.SpawnSmallBurst(optionsContainer.position);
            }

            // Ẩn bottom sheet
            HideBottomSheet(true);

            // Bật lại nút age up
            if (ageUpButton != null)
                ageUpButton.SetInteractable(true);

            // Update displays
            UpdateAllDisplays(GameManager.Instance.Stats);

            // Haptic
#if UNITY_IOS && !UNITY_EDITOR
            IOSHapticFeedback.TriggerSelection();
#endif
        }

        private void ClearOptionButtons()
        {
            foreach (var btn in _spawnedOptionButtons)
            {
                if (btn != null) Destroy(btn);
            }
            _spawnedOptionButtons.Clear();
        }

        // ─── Bottom Sheet Animation ─────────────────────────────────────

        private void ShowBottomSheet()
        {
            if (bottomSheet == null) return;

            if (_bottomSheetCoroutine != null)
                StopCoroutine(_bottomSheetCoroutine);
            _bottomSheetCoroutine = StartCoroutine(BottomSheetSlideCoroutine(true));
        }

        private void HideBottomSheet(bool animated)
        {
            if (bottomSheet == null) return;

            if (animated)
            {
                if (_bottomSheetCoroutine != null)
                    StopCoroutine(_bottomSheetCoroutine);
                _bottomSheetCoroutine = StartCoroutine(BottomSheetSlideCoroutine(false));
            }
            else
            {
                bottomSheet.anchoredPosition = new Vector2(0, -bottomSheet.rect.height);
                if (bottomSheetCanvas != null)
                {
                    bottomSheetCanvas.alpha = 0f;
                    bottomSheetCanvas.blocksRaycasts = false;
                    bottomSheetCanvas.interactable = false;
                }
                _isBottomSheetVisible = false;
            }
        }

        private IEnumerator BottomSheetSlideCoroutine(bool show)
        {
            _isBottomSheetVisible = show;
            float duration = 0.35f;
            float elapsed = 0f;

            float sheetHeight = bottomSheet.rect.height;
            Vector2 hiddenPos = new Vector2(0, -sheetHeight);
            Vector2 shownPos = Vector2.zero;

            Vector2 startPos = bottomSheet.anchoredPosition;
            Vector2 endPos = show ? shownPos : hiddenPos;

            float startAlpha = bottomSheetCanvas != null ? bottomSheetCanvas.alpha : (show ? 0f : 1f);
            float endAlpha = show ? 1f : 0f;

            if (show && bottomSheetCanvas != null)
            {
                bottomSheetCanvas.blocksRaycasts = true;
                bottomSheetCanvas.interactable = true;
            }

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;

                // Ease out cubic
                float eased = show
                    ? 1f - Mathf.Pow(1f - t, 3f)    // ease out khi mở
                    : t * t * t;                      // ease in khi đóng

                bottomSheet.anchoredPosition = Vector2.Lerp(startPos, endPos, eased);

                if (bottomSheetCanvas != null)
                    bottomSheetCanvas.alpha = Mathf.Lerp(startAlpha, endAlpha, eased);

                yield return null;
            }

            bottomSheet.anchoredPosition = endPos;
            if (bottomSheetCanvas != null)
            {
                bottomSheetCanvas.alpha = endAlpha;
                if (!show)
                {
                    bottomSheetCanvas.blocksRaycasts = false;
                    bottomSheetCanvas.interactable = false;
                }
            }

            _bottomSheetCoroutine = null;
        }

        // ═════════════════════════════════════════════════════════════════
        //  GAME OVER DISPLAY
        // ═════════════════════════════════════════════════════════════════

        private void ShowGameOverDisplay(CharacterStats finalStats)
        {
            if (eventTitleText != null) eventTitleText.text = "⚰️ HẾT CUỘC ĐỜI";
            if (eventDescriptionText != null)
            {
                string summary = $"Bạn đã sống {finalStats.age} năm.\n" +
                                 $"Tài sản cuối: {FormatCashBrief(finalStats.cash)}\n" +
                                 $"Nghề nghiệp: {finalStats.currentJob ?? "Không có"}\n" +
                                 $"Con cái: {finalStats.childrenCount}";
                eventDescriptionText.text = summary;
            }
            if (eventCategoryText != null)
            {
                eventCategoryText.text = "KẾT THÚC";
                eventCategoryText.color = theme != null ? theme.lossRed : Color.red;
            }

            ClearOptionButtons();

            // Nút "Sống lại"
            if (optionButtonPrefab != null && optionsContainer != null)
            {
                GameObject restartBtn = Instantiate(optionButtonPrefab, optionsContainer);
                _spawnedOptionButtons.Add(restartBtn);

                LuxuryButton luxBtn = restartBtn.GetComponent<LuxuryButton>();
                if (luxBtn != null)
                {
                    luxBtn.SetText("🔄 SỐNG LẠI");
                    luxBtn.SetStyle(ButtonStyle.Primary);
                    luxBtn.OnClick += () =>
                    {
                        // Reset game — tuỳ bạn implement
                        if (milestoneController != null) milestoneController.ResetMilestones();
                        HideBottomSheet(true);
                    };
                }
            }

            ShowBottomSheet();
        }

        private string FormatCashBrief(long cash)
        {
            if (cash >= 1_000_000_000_000) return $"{cash / 1_000_000_000_000f:F1}T VNĐ";
            if (cash >= 1_000_000_000) return $"{cash / 1_000_000_000f:F1}B VNĐ";
            if (cash >= 1_000_000) return $"{cash / 1_000_000f:F1}M VNĐ";
            return $"{cash:N0} VNĐ";
        }

        // ═════════════════════════════════════════════════════════════════
        //  AMBIENT EFFECTS
        // ═════════════════════════════════════════════════════════════════

        /// <summary>
        /// Glow vàng nhẹ nhàng pulse phía sau net worth card
        /// </summary>
        private void StartAmbientGlow()
        {
            if (ambientGlow == null) return;
            if (_ambientGlowCoroutine != null) StopCoroutine(_ambientGlowCoroutine);
            _ambientGlowCoroutine = StartCoroutine(AmbientGlowPulseCoroutine());
        }

        private IEnumerator AmbientGlowPulseCoroutine()
        {
            while (true)
            {
                float baseAlpha = ambientGlow.color.a;
                float elapsed = 0f;
                float cycleDuration = 4f; // Rất chậm, tinh tế

                while (elapsed < cycleDuration)
                {
                    elapsed += Time.deltaTime;
                    float t = Mathf.Sin(elapsed / cycleDuration * Mathf.PI * 2f) * 0.5f + 0.5f;
                    Color c = ambientGlow.color;
                    c.a = Mathf.Lerp(baseAlpha * 0.6f, baseAlpha * 1.4f, t);
                    ambientGlow.color = c;
                    yield return null;
                }
            }
        }

        // ═════════════════════════════════════════════════════════════════
        //  UTILITY COROUTINES
        // ═════════════════════════════════════════════════════════════════

        private IEnumerator PopTextCoroutine(Transform target)
        {
            Vector3 original = target.localScale;
            float elapsed = 0f;

            // Scale up
            while (elapsed < 0.1f)
            {
                elapsed += Time.deltaTime;
                target.localScale = original * Mathf.Lerp(1f, 1.15f, elapsed / 0.1f);
                yield return null;
            }

            // Scale back
            elapsed = 0f;
            while (elapsed < 0.2f)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / 0.2f;
                target.localScale = original * Mathf.Lerp(1.15f, 1f, t * (2f - t));
                yield return null;
            }

            target.localScale = original;
        }

        private IEnumerator FadeInCoroutine(CanvasGroup cg, float duration, float delay = 0f)
        {
            if (delay > 0f) yield return new WaitForSeconds(delay);

            cg.alpha = 0f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                cg.alpha = Mathf.Lerp(0f, 1f, elapsed / duration);
                yield return null;
            }
            cg.alpha = 1f;
        }

        private IEnumerator DelayedAction(float delay, System.Action action)
        {
            yield return new WaitForSeconds(delay);
            action?.Invoke();
        }
    }
}
