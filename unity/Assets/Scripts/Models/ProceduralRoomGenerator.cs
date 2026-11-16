using System.Collections.Generic;
using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Models
{
    /// <summary>
    /// Sinh và sắp đặt nội thất phòng 3D theo từng cấp độ giàu có & lứa tuổi của người chơi.
    /// </summary>
    public class ProceduralRoomGenerator : MonoBehaviour
    {
        [Header("Room Root")]
        [SerializeField] private Transform roomContainer;

        [Header("Theme Prefabs")]
        [SerializeField] private GameObject childhoodRoomPrefab;    // Phòng tuổi thơ: Giường nhỏ, gấu bông, bàn học sinh
        [SerializeField] private GameObject studentDormPrefab;       // Phòng trọ: PC gaming, mì tôm, guitar, giá sách
        [SerializeField] private GameObject modernApartmentPrefab;   // Chung cư: Sofa da, TV 65 inch, tủ rượu, ban công
        [SerializeField] private GameObject luxuryPenthousePrefab;   // Penthouse: Hồ bơi vô cực, đàn piano, view thành phố

        private GameObject currentRoomInstance;

        public void RebuildRoomForStats(CharacterStats stats)
        {
            if (currentRoomInstance != null)
            {
                Destroy(currentRoomInstance);
            }

            GameObject targetPrefab = childhoodRoomPrefab;

            if (stats.age < 18)
            {
                targetPrefab = childhoodRoomPrefab;
            }
            else if (stats.cash < 200_000_000)
            {
                targetPrefab = studentDormPrefab;
            }
            else if (stats.cash < 2_000_000_000)
            {
                targetPrefab = modernApartmentPrefab;
            }
            else
            {
                targetPrefab = luxuryPenthousePrefab;
            }

            if (targetPrefab != null && roomContainer != null)
            {
                currentRoomInstance = Instantiate(targetPrefab, roomContainer);
                Debug.Log($"[RoomGenerator] Đã tạo không gian phòng 3D mới: {targetPrefab.name}");
            }
        }
    }
}
