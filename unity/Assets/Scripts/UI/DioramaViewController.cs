using UnityEngine;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Mobile.iOS;
using ZeroToBillionaire.Models;

namespace ZeroToBillionaire.UI
{
    /// <summary>
    /// Điều khiển góc nhìn 3D Isometric Diorama:
    /// - Hỗ trợ cả thao tác Vuốt cảm ứng trên iPhone và Kéo chuột trong Unity Editor ở 40% nửa trên màn hình
    /// - Nội suy góc quay mượt mà (SmoothDamp) chống giật khung hình
    /// - Kết nối đồng bộ với ProceduralRoomGenerator khi chỉ số nhân vật thay đổi
    /// </summary>
    public class DioramaViewController : MonoBehaviour
    {
        [Header("Camera / Pivot Control")]
        [SerializeField] private Transform dioramaPivot;
        [SerializeField] private float dragSensitivity = 0.18f;
        [SerializeField] private float maxRotationAngle = 35f;
        [SerializeField] private float smoothTime = 0.12f;

        [Header("Optional Pre-placed Room Objects")]
        [SerializeField] private GameObject childhoodRoom;
        [SerializeField] private GameObject studentDormRoom;
        [SerializeField] private GameObject modernApartment;
        [SerializeField] private GameObject luxuryVilla;

        private float targetYaw = 0f;
        private float currentYaw = 0f;
        private float yawVelocity = 0f;
        private Vector2 previousPointerPos;
        private bool isDraggingDiorama = false;

        private void Start()
        {
            if (dioramaPivot == null) dioramaPivot = transform;

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged += RefreshRoomEnvironment;
                RefreshRoomEnvironment(GameManager.Instance.currentStats);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged -= RefreshRoomEnvironment;
            }
        }

        private void Update()
        {
            HandlePointerOrbit();

            currentYaw = Mathf.SmoothDamp(currentYaw, targetYaw, ref yawVelocity, smoothTime);
            if (dioramaPivot != null)
            {
                dioramaPivot.localRotation = Quaternion.Euler(25f, 45f + currentYaw, 0f);
            }
        }

        private void HandlePointerOrbit()
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began && touch.position.y > Screen.height * 0.58f)
                {
                    isDraggingDiorama = true;
                    previousPointerPos = touch.position;
                    AdaptiveFrameRateManager.Instance?.WakeUp(3.0f);
                }
                else if (touch.phase == TouchPhase.Moved && isDraggingDiorama)
                {
                    float deltaX = touch.position.x - previousPointerPos.x;
                    previousPointerPos = touch.position;
                    targetYaw = Mathf.Clamp(targetYaw - deltaX * dragSensitivity, -maxRotationAngle, maxRotationAngle);
                }
                else if (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
                {
                    isDraggingDiorama = false;
                }
                return;
            }

            // Hỗ trợ test nhanh bằng chuột trong Unity Editor / Desktop
            if (Input.GetMouseButtonDown(0) && Input.mousePosition.y > Screen.height * 0.58f)
            {
                isDraggingDiorama = true;
                previousPointerPos = Input.mousePosition;
                AdaptiveFrameRateManager.Instance?.WakeUp(3.0f);
            }
            else if (Input.GetMouseButton(0) && isDraggingDiorama)
            {
                Vector2 currentPos = Input.mousePosition;
                float deltaX = currentPos.x - previousPointerPos.x;
                previousPointerPos = currentPos;
                targetYaw = Mathf.Clamp(targetYaw - deltaX * dragSensitivity, -maxRotationAngle, maxRotationAngle);
            }
            else if (Input.GetMouseButtonUp(0))
            {
                isDraggingDiorama = false;
            }
        }

        public void RefreshRoomEnvironment(CharacterStats stats)
        {
            if (stats == null) return;
            if (!childhoodRoom && !studentDormRoom && !modernApartment && !luxuryVilla) return;

            RoomWealthTier tier = ProceduralRoomGenerator.DetermineTier(stats);

            if (childhoodRoom) childhoodRoom.SetActive(tier == RoomWealthTier.Childhood);
            if (studentDormRoom) studentDormRoom.SetActive(tier == RoomWealthTier.StudentDorm);
            if (modernApartment) modernApartment.SetActive(tier == RoomWealthTier.ModernApartment);
            if (luxuryVilla) luxuryVilla.SetActive(tier == RoomWealthTier.LuxuryPenthouse);
        }
    }
}
