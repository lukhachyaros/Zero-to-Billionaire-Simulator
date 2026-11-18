using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Models
{
    public enum RoomWealthTier
    {
        Childhood = 0,
        StudentDorm = 1,
        ModernApartment = 2,
        LuxuryPenthouse = 3
    }

    /// <summary>
    /// Sinh và nâng cấp không gian phòng 3D Isometric theo độ tuổi & Tổng tài sản ròng.
    /// Hỗ trợ Prefab 3D nghệ thuật (FBX/GLB) hoặc tự động dựng phòng Low-poly Procedural nếu chưa gán Prefab.
    /// </summary>
    public class ProceduralRoomGenerator : MonoBehaviour
    {
        [Header("Room Root")]
        [SerializeField] private Transform roomContainer;

        [Header("Optional Art Prefabs")]
        [SerializeField] private GameObject childhoodRoomPrefab;
        [SerializeField] private GameObject studentDormPrefab;
        [SerializeField] private GameObject modernApartmentPrefab;
        [SerializeField] private GameObject luxuryPenthousePrefab;

        private GameObject currentRoomInstance;
        private RoomWealthTier currentTier = (RoomWealthTier)(-1);
        private Material sharedPaletteMaterial;

        private void Start()
        {
            if (roomContainer == null) roomContainer = transform;

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged += RebuildRoomForStats;
                RebuildRoomForStats(GameManager.Instance.currentStats);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged -= RebuildRoomForStats;
            }
        }

        public static RoomWealthTier DetermineTier(CharacterStats stats)
        {
            long netWorth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(stats)
                : stats.cash - stats.debt;

            int realEstateTier = EconomySystem.Instance != null ? EconomySystem.Instance.GetHighestRealEstateTier() : 0;

            if (stats.age < 18 && realEstateTier < 2) return RoomWealthTier.Childhood;
            if (realEstateTier >= 4 || netWorth >= 10_000_000_000L) return RoomWealthTier.LuxuryPenthouse;
            if (realEstateTier >= 2 || netWorth >= 800_000_000L) return RoomWealthTier.ModernApartment;
            return RoomWealthTier.StudentDorm;
        }

        public void RebuildRoomForStats(CharacterStats stats)
        {
            if (stats == null) return;
            RoomWealthTier targetTier = DetermineTier(stats);
            if (targetTier == currentTier && currentRoomInstance != null) return;

            currentTier = targetTier;
            if (currentRoomInstance != null)
            {
                Destroy(currentRoomInstance);
            }

            GameObject targetPrefab = targetTier switch
            {
                RoomWealthTier.Childhood => childhoodRoomPrefab,
                RoomWealthTier.StudentDorm => studentDormPrefab,
                RoomWealthTier.ModernApartment => modernApartmentPrefab,
                RoomWealthTier.LuxuryPenthouse => luxuryPenthousePrefab,
                _ => childhoodRoomPrefab
            };

            if (targetPrefab != null)
            {
                currentRoomInstance = Instantiate(targetPrefab, roomContainer);
            }
            else
            {
                currentRoomInstance = BuildProceduralCozyRoom(targetTier);
                currentRoomInstance.transform.SetParent(roomContainer, false);
            }
        }

        private GameObject BuildProceduralCozyRoom(RoomWealthTier tier)
        {
            var root = new GameObject($"ProceduralDiorama_{tier}");

            Color floorColor = tier switch
            {
                RoomWealthTier.Childhood => new Color(0.95f, 0.84f, 0.68f),
                RoomWealthTier.StudentDorm => new Color(0.76f, 0.78f, 0.80f),
                RoomWealthTier.ModernApartment => new Color(0.85f, 0.72f, 0.56f),
                _ => new Color(0.92f, 0.91f, 0.88f)
            };

            Color wallColor = tier switch
            {
                RoomWealthTier.Childhood => new Color(0.98f, 0.93f, 0.82f),
                RoomWealthTier.StudentDorm => new Color(0.86f, 0.89f, 0.88f),
                RoomWealthTier.ModernApartment => new Color(0.94f, 0.95f, 0.97f),
                _ => new Color(0.18f, 0.22f, 0.30f)
            };

            // Sàn và 2 bức tường cắt Isometric
            CreateBox(root.transform, "Floor", new Vector3(0f, -0.1f, 0f), new Vector3(4.2f, 0.2f, 4.2f), floorColor);
            CreateBox(root.transform, "BackWall", new Vector3(0f, 1.3f, -2.0f), new Vector3(4.2f, 2.6f, 0.2f), wallColor);
            CreateBox(root.transform, "LeftWall", new Vector3(-2.0f, 1.3f, 0f), new Vector3(0.2f, 2.6f, 4.2f), wallColor);

            // Cửa sổ phát sáng
            CreateBox(root.transform, "WindowGlass", new Vector3(0.4f, 1.5f, -1.88f), new Vector3(1.5f, 1.0f, 0.05f), new Color(0.55f, 0.84f, 0.98f));

            // Nội thất đặc trưng từng giai đoạn giàu có
            if (tier == RoomWealthTier.Childhood)
            {
                CreateBox(root.transform, "SingleBed", new Vector3(-1.1f, 0.25f, -1.0f), new Vector3(1.2f, 0.5f, 1.8f), new Color(0.42f, 0.72f, 0.95f));
                CreateBox(root.transform, "StudyDesk", new Vector3(1.1f, 0.4f, -1.3f), new Vector3(1.2f, 0.8f, 0.7f), new Color(0.76f, 0.52f, 0.32f));
            }
            else if (tier == RoomWealthTier.StudentDorm)
            {
                CreateBox(root.transform, "Mattress", new Vector3(-1.1f, 0.12f, -1.0f), new Vector3(1.2f, 0.24f, 1.8f), new Color(0.55f, 0.62f, 0.72f));
                CreateBox(root.transform, "PcDesk", new Vector3(1.0f, 0.38f, -1.3f), new Vector3(1.3f, 0.76f, 0.7f), new Color(0.35f, 0.35f, 0.38f));
                CreateBox(root.transform, "Monitor", new Vector3(1.0f, 0.95f, -1.4f), new Vector3(0.6f, 0.38f, 0.06f), new Color(0.18f, 0.88f, 0.68f));
            }
            else if (tier == RoomWealthTier.ModernApartment)
            {
                CreateBox(root.transform, "QueenBed", new Vector3(-0.9f, 0.3f, -1.0f), new Vector3(1.6f, 0.6f, 1.9f), new Color(0.26f, 0.44f, 0.68f));
                CreateBox(root.transform, "LeatherSofa", new Vector3(1.0f, 0.3f, 0.5f), new Vector3(1.4f, 0.6f, 0.8f), new Color(0.72f, 0.45f, 0.28f));
                CreateBox(root.transform, "PlantPot", new Vector3(-1.5f, 0.45f, 1.4f), new Vector3(0.45f, 0.9f, 0.45f), new Color(0.24f, 0.68f, 0.42f));
            }
            else
            {
                CreateBox(root.transform, "KingBed", new Vector3(-0.8f, 0.35f, -1.0f), new Vector3(1.8f, 0.7f, 2.0f), new Color(0.88f, 0.72f, 0.28f));
                CreateBox(root.transform, "GrandPiano", new Vector3(1.1f, 0.45f, -0.9f), new Vector3(1.2f, 0.9f, 1.2f), new Color(0.12f, 0.12f, 0.15f));
                CreateBox(root.transform, "InfinityPool", new Vector3(0.8f, 0.06f, 1.3f), new Vector3(2.1f, 0.12f, 1.1f), new Color(0.16f, 0.78f, 0.95f));
            }

            return root;
        }

        private void CreateBox(Transform parent, string partName, Vector3 localPos, Vector3 scale, Color color)
        {
            GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cube.name = partName;
            cube.transform.SetParent(parent, false);
            cube.transform.localPosition = localPos;
            cube.transform.localScale = scale;

            var collider = cube.GetComponent<Collider>();
            if (collider != null) Destroy(collider);

            var renderer = cube.GetComponent<Renderer>();
            if (renderer != null)
            {
                if (sharedPaletteMaterial == null)
                {
                    Shader shader = Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard");
                    sharedPaletteMaterial = new Material(shader);
                    sharedPaletteMaterial.enableInstancing = true;
                }
                var matInstance = new Material(sharedPaletteMaterial) { color = color };
                renderer.sharedMaterial = matInstance;
            }
        }
    }
}
