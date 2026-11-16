using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Events;
using ZeroToBillionaire.Mobile.iOS;

namespace ZeroToBillionaire.UI
{
    /// <summary>
    /// Điều khiển giao diện màn hình dọc chuẩn iPhone: Safe Area, Event Stream, Decision Bottom-Sheet
    /// </summary>
    public class MobilePortraitUI : MonoBehaviour
    {
        [Header("Safe Area Components")]
        [SerializeField] private RectTransform safeAreaRect;

        [Header("Stats UI")]
        [SerializeField] private Text ageText;
        [SerializeField] private Text cashText;
        [SerializeField] private Slider healthBar;
        [SerializeField] private Slider happinessBar;
        [SerializeField] private Slider intelligenceBar;

        [Header("Event Stream & Decision Box")]
        [SerializeField] private RectTransform decisionBottomSheet;
        [SerializeField] private Text eventTitleText;
        [SerializeField] private Text eventDescriptionText;
        [SerializeField] private Transform optionsContainer;
        [SerializeField] private GameObject optionButtonPrefab;

        [Header("Controls")]
        [SerializeField] private Button ageUpButton;

        private void Start()
        {
            ApplySafeArea();

            if (ageUpButton != null)
            {
                ageUpButton.onClick.AddListener(OnAgeUpClicked);
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnAgeUp += UpdateStatsDisplay;
                GameManager.Instance.OnEventTriggered += DisplayEvent;
            }
        }

        private void ApplySafeArea()
        {
            if (safeAreaRect == null) return;

            Rect safeArea = Screen.safeArea;
            Vector2 minAnchor = safeArea.position;
            Vector2 maxAnchor = minAnchor + safeArea.size;

            minAnchor.x /= Screen.width;
            minAnchor.y /= Screen.height;
            maxAnchor.x /= Screen.width;
            maxAnchor.y /= Screen.height;

            safeAreaRect.anchorMin = minAnchor;
            safeAreaRect.anchorMax = maxAnchor;
        }

        private void OnAgeUpClicked()
        {
            GameManager.Instance?.AgeUp();
        }

        public void UpdateStatsDisplay(int currentAge)
        {
            var stats = GameManager.Instance.currentStats;
            if (ageText != null) ageText.text = $"{stats.age} Tuổi";
            if (cashText != null) cashText.text = $"{stats.cash:N0} đ";

            if (healthBar != null) healthBar.value = stats.health / 100f;
            if (happinessBar != null) happinessBar.value = stats.happiness / 100f;
            if (intelligenceBar != null) intelligenceBar.value = stats.intelligence / 100f;
        }

        public void DisplayEvent(GameEvent gameEvent)
        {
            if (gameEvent == null) return;

            // Kích hoạt rung haptic thông báo sự kiện
            IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Success);

            if (eventTitleText != null) eventTitleText.text = gameEvent.title;
            if (eventDescriptionText != null) eventDescriptionText.text = gameEvent.description;

            // Mở bottom sheet
            if (decisionBottomSheet != null)
            {
                decisionBottomSheet.gameObject.SetActive(true);
            }

            // Xóa options cũ
            foreach (Transform child in optionsContainer)
            {
                Destroy(child.gameObject);
            }

            // Sinh options mới
            foreach (var opt in gameEvent.options)
            {
                if (optionButtonPrefab != null)
                {
                    var btnObj = Instantiate(optionButtonPrefab, optionsContainer);
                    var btnText = btnObj.GetComponentInChildren<Text>();
                    if (btnText != null) btnText.text = opt.label;

                    var btn = btnObj.GetComponent<Button>();
                    if (btn != null)
                    {
                        btn.onClick.AddListener(() => SelectOption(opt));
                    }
                }
            }
        }

        private void SelectOption(EventOption option)
        {
            var outcome = EventEngine.Instance.ResolveOption(option, GameManager.Instance.currentStats);
            if (outcome != null)
            {
                GameManager.Instance.AddLog($"👉 {option.label} -> {outcome.message}");
            }

            if (decisionBottomSheet != null)
            {
                decisionBottomSheet.gameObject.SetActive(false);
            }

            UpdateStatsDisplay(GameManager.Instance.currentStats.age);
        }
    }
}
