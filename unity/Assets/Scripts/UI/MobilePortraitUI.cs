using System.Text;
using UnityEngine;
using UnityEngine.UI;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Events;
using ZeroToBillionaire.Mobile.iOS;

namespace ZeroToBillionaire.UI
{
    /// <summary>
    /// Điều khiển giao diện màn hình dọc chuẩn iPhone (One-Thumb Portrait HIG):
    /// - Tự động thích ứng Safe Area (Dynamic Island, Notch, Home Indicator) theo thời gian thực
    /// - Hiển thị Tài sản ròng (Net Worth), Tiền mặt, Chu kỳ kinh tế, Dòng sự kiện & Hộp thoại quyết định
    /// - Hỗ trợ Cỗ Máy Thời Gian (Time Machine) và Kế thừa Gia tộc khi nhân vật qua đời
    /// </summary>
    public class MobilePortraitUI : MonoBehaviour
    {
        [Header("Safe Area Components")]
        [SerializeField] private RectTransform safeAreaRect;

        [Header("Character Header & Economy UI")]
        [SerializeField] private Text nameAndJobText;
        [SerializeField] private Text ageText;
        [SerializeField] private Text cashText;
        [SerializeField] private Text netWorthText;
        [SerializeField] private Text macroCycleText;

        [Header("R2 Financial & Career Alerts (Optional)")]
        [SerializeField] private Text debtText;
        [SerializeField] private Text statusAlertText;
        [SerializeField] private GameObject creditFrozenBadge;

        [Header("Stat Bars")]
        [SerializeField] private Slider healthBar;
        [SerializeField] private Slider happinessBar;
        [SerializeField] private Slider intelligenceBar;
        [SerializeField] private Slider stressBar;

        [Header("Timeline Feed")]
        [SerializeField] private Text timelineFeedText;

        [Header("Decision Bottom-Sheet")]
        [SerializeField] private RectTransform decisionBottomSheet;
        [SerializeField] private Text eventCategoryBadgeText;
        [SerializeField] private Text eventTitleText;
        [SerializeField] private Text eventDescriptionText;
        [SerializeField] private Transform optionsContainer;
        [SerializeField] private GameObject optionButtonPrefab;

        [Header("Action Controls")]
        [SerializeField] private Button ageUpButton;
        [SerializeField] private Button timeMachineButton;
        [SerializeField] private Button inheritDynastyButton;
        [SerializeField] private Button newLifeButton;

        private Rect lastSafeArea = Rect.zero;
        private bool hasPendingEvent = false;

        private void Start()
        {
            ApplySafeArea();

            if (ageUpButton != null) ageUpButton.onClick.AddListener(OnAgeUpClicked);
            if (timeMachineButton != null) timeMachineButton.onClick.AddListener(OnTimeMachineClicked);
            if (inheritDynastyButton != null) inheritDynastyButton.onClick.AddListener(OnInheritDynastyClicked);
            if (newLifeButton != null) newLifeButton.onClick.AddListener(OnNewLifeClicked);

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged += RefreshAllStats;
                GameManager.Instance.OnEventTriggered += DisplayEvent;
                GameManager.Instance.OnGameOver += HandleGameOverUI;

                RefreshAllStats(GameManager.Instance.currentStats);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged -= RefreshAllStats;
                GameManager.Instance.OnEventTriggered -= DisplayEvent;
                GameManager.Instance.OnGameOver -= HandleGameOverUI;
            }
        }

        private void Update()
        {
            if (Screen.safeArea != lastSafeArea)
            {
                ApplySafeArea();
            }
        }

        private void ApplySafeArea()
        {
            lastSafeArea = Screen.safeArea;
            if (safeAreaRect == null || Screen.width <= 0 || Screen.height <= 0) return;

            Vector2 minAnchor = lastSafeArea.position;
            Vector2 maxAnchor = minAnchor + lastSafeArea.size;

            minAnchor.x /= Screen.width;
            minAnchor.y /= Screen.height;
            maxAnchor.x /= Screen.width;
            maxAnchor.y /= Screen.height;

            safeAreaRect.anchorMin = minAnchor;
            safeAreaRect.anchorMax = maxAnchor;
        }

        private void OnAgeUpClicked()
        {
            if (hasPendingEvent) return;
            GameManager.Instance?.AgeUp();
        }

        private void OnTimeMachineClicked()
        {
            if (GameManager.Instance != null && GameManager.Instance.UseTimeMachine(1))
            {
                hasPendingEvent = false;
                if (decisionBottomSheet != null) decisionBottomSheet.gameObject.SetActive(false);
            }
        }

        private void OnInheritDynastyClicked()
        {
            if (GameManager.Instance != null && GameManager.Instance.ContinueDynastyWithChild())
            {
                if (inheritDynastyButton != null) inheritDynastyButton.gameObject.SetActive(false);
            }
        }

        private void OnNewLifeClicked()
        {
            string gender = Random.value > 0.5f ? "Nam" : "Nữ";
            string randomName = RelationshipSystem.GenerateVietnameseName(gender);
            GameManager.Instance?.StartNewLife(randomName, gender, "bg_working_class");
        }

        public void UpdateStatsDisplay(int _)
        {
            if (GameManager.Instance != null)
            {
                RefreshAllStats(GameManager.Instance.currentStats);
            }
        }

        public void RefreshAllStats(CharacterStats stats)
        {
            if (stats == null) return;

            long netWorth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(stats)
                : stats.cash - stats.debt;

            if (nameAndJobText != null)
            {
                string cooldownNote = stats.careerCooldownYears > 0 ? $" • ⏳ Chờ việc ({stats.careerCooldownYears}n)" : "";
                nameAndJobText.text = $"{stats.characterName} (Đời {stats.generation}) • {stats.currentJob}{cooldownNote}";
            }
            if (ageText != null)
                ageText.text = $"{stats.age} Tuổi";
            if (debtText != null)
            {
                string overdueNote = stats.debtOverdueYears > 0 ? $" (Quá hạn {stats.debtOverdueYears}n)" : "";
                debtText.text = stats.debt > 0
                    ? $"Nợ: {CharacterStats.FormatVND(stats.debt)}{overdueNote}"
                    : "Nợ: 0 đ";
            }
            if (cashText != null)
            {
                string inlineDebt = (debtText == null && stats.debt > 0)
                    ? $" • Nợ: {CharacterStats.FormatVND(stats.debt)}"
                    : "";
                cashText.text = $"Tiền mặt: {CharacterStats.FormatVND(stats.cash)}{inlineDebt}";
            }
            if (netWorthText != null)
                netWorthText.text = $"Tài sản ròng: {CharacterStats.FormatVND(netWorth)}";

            var alerts = new System.Collections.Generic.List<string>();
            if (stats.creditFrozenYears > 0) alerts.Add($"🔒 Đóng băng TD ({stats.creditFrozenYears}n)");
            if (stats.debtOverdueYears > 0) alerts.Add($"⚠️ Quá hạn nợ ({stats.debtOverdueYears}n)");
            if (stats.bankruptcyCount > 0) alerts.Add($"💥 Phá sản x{stats.bankruptcyCount}");
            if (stats.layoffCount > 0) alerts.Add($"📉 Sa thải x{stats.layoffCount}");
            if (stats.careerCooldownYears > 0) alerts.Add($"⏳ Hạ bậc tuyển dụng ({stats.careerCooldownYears}n)");

            string alertSummary = alerts.Count > 0 ? string.Join(" • ", alerts) : "";
            if (statusAlertText != null)
            {
                statusAlertText.text = alertSummary;
                statusAlertText.gameObject.SetActive(alerts.Count > 0);
            }
            if (macroCycleText != null && EconomySystem.Instance != null)
            {
                string cycleLabel = EconomySystem.Instance.GetCycleVietnameseName();
                macroCycleText.text = (statusAlertText == null && alerts.Count > 0)
                    ? $"{cycleLabel} • {alertSummary}"
                    : cycleLabel;
            }
            if (creditFrozenBadge != null)
            {
                creditFrozenBadge.SetActive(stats.creditFrozenYears > 0);
            }

            if (healthBar != null) healthBar.value = stats.health / 100f;
            if (happinessBar != null) happinessBar.value = stats.happiness / 100f;
            if (intelligenceBar != null) intelligenceBar.value = stats.intelligence / 100f;
            if (stressBar != null) stressBar.value = stats.stress / 100f;

            if (timeMachineButton != null)
                timeMachineButton.interactable = SaveSystem.AvailableRewindYears > 0;

            if (ageUpButton != null)
                ageUpButton.interactable = stats.isAlive && !hasPendingEvent;

            RefreshTimelineText();
        }

        private void RefreshTimelineText()
        {
            if (timelineFeedText == null || GameManager.Instance == null) return;

            var logs = GameManager.Instance.lifeLog;
            int startIdx = Mathf.Max(0, logs.Count - 12);
            var sb = new StringBuilder();
            for (int i = logs.Count - 1; i >= startIdx; i--)
            {
                sb.AppendLine(logs[i]);
            }
            timelineFeedText.text = sb.ToString();
        }

        public void DisplayEvent(GameEvent gameEvent)
        {
            if (gameEvent == null) return;

            hasPendingEvent = true;
            if (ageUpButton != null) ageUpButton.interactable = false;

            IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.HapticImpactType.Medium);

            if (eventCategoryBadgeText != null)
                eventCategoryBadgeText.text = (gameEvent.category ?? "life").ToUpperInvariant();
            if (eventTitleText != null)
                eventTitleText.text = gameEvent.title;
            if (eventDescriptionText != null)
                eventDescriptionText.text = gameEvent.description;

            if (decisionBottomSheet != null)
            {
                decisionBottomSheet.gameObject.SetActive(true);
            }

            if (optionsContainer != null)
            {
                foreach (Transform child in optionsContainer)
                {
                    Destroy(child.gameObject);
                }

                foreach (var opt in gameEvent.options)
                {
                    if (optionButtonPrefab == null) continue;
                    var btnObj = Instantiate(optionButtonPrefab, optionsContainer);
                    var btnText = btnObj.GetComponentInChildren<Text>();
                    if (btnText != null) btnText.text = opt.label;

                    var btn = btnObj.GetComponent<Button>();
                    if (btn != null)
                    {
                        var capturedOpt = opt;
                        btn.onClick.AddListener(() => SelectOption(capturedOpt));
                    }
                }
            }
        }

        private void SelectOption(EventOption option)
        {
            hasPendingEvent = false;
            var outcome = EventEngine.Instance?.ResolveOption(option, GameManager.Instance.currentStats);
            if (outcome != null)
            {
                GameManager.Instance.AddLog($"👉 {option.label} ➔ {outcome.message}");
                bool isPositive = outcome.statModifiers != null && (outcome.statModifiers.cash >= 0 && outcome.statModifiers.happiness >= 0);
                IOSHapticFeedback.TriggerNotification(
                    isPositive ? IOSHapticFeedback.HapticNotificationType.Success : IOSHapticFeedback.HapticNotificationType.Warning
                );
            }

            if (decisionBottomSheet != null)
            {
                decisionBottomSheet.gameObject.SetActive(false);
            }

            GameManager.Instance?.NotifyStateUpdated();
            GameManager.Instance?.AutoSave();
        }

        private void HandleGameOverUI()
        {
            hasPendingEvent = false;
            if (decisionBottomSheet != null) decisionBottomSheet.gameObject.SetActive(false);

            bool hasHeir = RelationshipSystem.Instance != null && RelationshipSystem.Instance.GetLivingChildren().Count > 0;
            if (inheritDynastyButton != null)
            {
                inheritDynastyButton.gameObject.SetActive(hasHeir);
            }
            RefreshAllStats(GameManager.Instance?.currentStats);
        }
    }
}
