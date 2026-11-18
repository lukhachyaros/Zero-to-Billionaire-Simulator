using UnityEngine;

namespace ZeroToBillionaire.Mobile.iOS
{
    /// <summary>
    /// Quản lý tốc độ khung hình thích ứng (Adaptive Frame Rate & Thermal Protection) cho iPhone:
    /// - Chạy 60 FPS mượt mà khi người chơi thao tác vuốt xoay phòng 3D hoặc có animation sự kiện.
    /// - Tự động hạ về 30 FPS sau 5 giây không chạm màn hình (khi người chơi đang đọc văn bản dài)
    ///   giúp giảm 40% lượng nhiệt tỏa ra và tiết kiệm pin tối đa trên chip Apple Silicon.
    /// </summary>
    public class AdaptiveFrameRateManager : MonoBehaviour
    {
        public static AdaptiveFrameRateManager Instance { get; private set; }

        [Header("Frame Rate Settings")]
        [SerializeField] private int activeFrameRate = 60;
        [SerializeField] private int idleFrameRate = 30;
        [SerializeField] private int lowBatteryFrameRate = 30;
        [SerializeField] private float idleTimeoutSeconds = 5.0f;

        private float lastInteractionTime;
        private int currentTargetFps = -1;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                if (Application.isPlaying) DontDestroyOnLoad(gameObject);
                QualitySettings.vSyncCount = 0;
                WakeUp(2.0f);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Update()
        {
            if (Input.touchCount > 0 || Input.GetMouseButton(0) || Input.anyKeyDown)
            {
                lastInteractionTime = Time.unscaledTime;
            }

            bool isLowBattery = SystemInfo.batteryLevel >= 0f
                                && SystemInfo.batteryLevel <= 0.20f
                                && SystemInfo.batteryStatus != BatteryStatus.Charging;

            int desiredFps = isLowBattery
                ? lowBatteryFrameRate
                : (Time.unscaledTime - lastInteractionTime <= idleTimeoutSeconds ? activeFrameRate : idleFrameRate);

            if (desiredFps != currentTargetFps)
            {
                currentTargetFps = desiredFps;
                Application.targetFrameRate = currentTargetFps;
            }
        }

        /// <summary>
        /// Đánh thức lên 60 FPS khi chạy hiệu ứng ăn mừng, chuyển tuổi hoặc nâng cấp phòng 3D.
        /// </summary>
        public void WakeUp(float extraActiveSeconds = 1.5f)
        {
            lastInteractionTime = Mathf.Max(lastInteractionTime, Time.unscaledTime + extraActiveSeconds - idleTimeoutSeconds);
            if (currentTargetFps != activeFrameRate)
            {
                currentTargetFps = activeFrameRate;
                Application.targetFrameRate = activeFrameRate;
            }
        }
    }
}
