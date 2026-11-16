using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.UI
{
    /// <summary>
    /// Điều khiển góc nhìn 3D Isometric Diorama:
    /// - Cho phép xoay nhẹ 45 độ khi người chơi vuốt trên iPhone
    /// - Tự động nâng cấp căn phòng từ Phòng trọ sinh viên -> Căn hộ chung cư -> Biệt thự theo số tiền
    /// </summary>
    public class DioramaViewController : MonoBehaviour
    {
        [Header("Camera Control")]
        [SerializeField] private Transform dioramaPivot;
        [SerializeField] private float rotationSpeed = 0.2f;
        [SerializeField] private float maxRotationAngle = 35f;

        [Header("Room Environments")]
        [SerializeField] private GameObject childhoodRoom;     // Phòng trẻ nhỏ
        [SerializeField] private GameObject studentDormRoom;    // Phòng trọ sinh viên
        [SerializeField] private GameObject modernApartment;    // Căn hộ chung cư
        [SerializeField] private GameObject luxuryVilla;        // Biệt thự triệu đô

        private Vector2 touchStartPos;
        private float currentYaw = 0f;

        private void Update()
        {
            HandleSwipeRotation();
        }

        private void HandleSwipeRotation()
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);

                // Chỉ xoay khi chạm ở nửa trên màn hình (Upper 40%)
                if (touch.position.y > Screen.height * 0.6f)
                {
                    if (touch.phase == TouchPhase.Began)
                    {
                        touchStartPos = touch.position;
                    }
                    else if (touch.phase == TouchPhase.Moved)
                    {
                        float deltaX = touch.position.x - touchStartPos.x;
                        currentYaw += deltaX * rotationSpeed * Time.deltaTime;
                        currentYaw = Mathf.Clamp(currentYaw, -maxRotationAngle, maxRotationAngle);

                        if (dioramaPivot != null)
                        {
                            dioramaPivot.localRotation = Quaternion.Euler(25f, 45f + currentYaw, 0f);
                        }
                    }
                }
            }
        }

        public void RefreshRoomEnvironment(CharacterStats stats)
        {
            // Tắt tất cả
            if (childhoodRoom) childhoodRoom.SetActive(false);
            if (studentDormRoom) studentDormRoom.SetActive(false);
            if (modernApartment) modernApartment.SetActive(false);
            if (luxuryVilla) luxuryVilla.SetActive(false);

            if (stats.age < 18)
            {
                if (childhoodRoom) childhoodRoom.SetActive(true);
            }
            else if (stats.cash < 500_000_000)
            {
                if (studentDormRoom) studentDormRoom.SetActive(true);
            }
            else if (stats.cash < 5_000_000_000)
            {
                if (modernApartment) modernApartment.SetActive(true);
            }
            else
            {
                if (luxuryVilla) luxuryVilla.SetActive(true);
            }
        }
    }
}
