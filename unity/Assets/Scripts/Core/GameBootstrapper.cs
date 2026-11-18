using UnityEngine;
using ZeroToBillionaire.Models;
using ZeroToBillionaire.UI;

namespace ZeroToBillionaire.Core
{
    /// <summary>
    /// Tự động khởi tạo khung cảnh 3D Isometric Diorama + Nhân vật Chibi + Hệ thống Core
    /// nếu người phát triển mở một Scene trống trong Unity và nhấn Play ngay lập tức.
    /// </summary>
    public static class GameBootstrapper
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void EnsureGameInitialized()
        {
            if (Object.FindObjectOfType<GameManager>() != null)
                return;

            // 1. Khởi tạo Hệ thống Core
            var managerObj = new GameObject("[ZeroToBillionaire_Systems]");
            managerObj.AddComponent<GameManager>();

            // 2. Thiết lập Camera Orthographic chuẩn Isometric Mobile Portrait
            Camera mainCam = Camera.main;
            if (mainCam == null)
            {
                var camObj = new GameObject("Main Camera");
                camObj.tag = "MainCamera";
                mainCam = camObj.AddComponent<Camera>();
            }

            mainCam.orthographic = true;
            mainCam.orthographicSize = 5.6f;
            mainCam.backgroundColor = new Color(0.10f, 0.13f, 0.20f);
            mainCam.clearFlags = CameraClearFlags.SolidColor;
            mainCam.transform.position = new Vector3(0f, 2.2f, -10f);
            mainCam.transform.rotation = Quaternion.identity;

            // 3. Ánh sáng ấm áp Cozy Stylized
            if (Object.FindObjectOfType<Light>() == null)
            {
                var lightObj = new GameObject("Directional Sun Light");
                var light = lightObj.AddComponent<Light>();
                light.type = LightType.Directional;
                light.color = new Color(1.0f, 0.96f, 0.88f);
                light.intensity = 1.15f;
                lightObj.transform.rotation = Quaternion.Euler(48f, -35f, 0f);
            }

            // 4. Dựng Gốc Diorama 3D ở nửa trên màn hình dọc
            var dioramaPivot = new GameObject("Diorama_3D_Stage");
            dioramaPivot.transform.position = new Vector3(0f, 2.3f, 0f);
            dioramaPivot.transform.rotation = Quaternion.Euler(25f, 45f, 0f);
            dioramaPivot.AddComponent<DioramaViewController>();
            dioramaPivot.AddComponent<ProceduralRoomGenerator>();

            var characterObj = new GameObject("Player_ModularCharacter");
            characterObj.transform.SetParent(dioramaPivot.transform, false);
            characterObj.transform.localPosition = new Vector3(-0.1f, 0f, 0.2f);
            characterObj.AddComponent<ModularCharacter>();

            Debug.Log("[GameBootstrapper] Đã tự động dựng cảnh 3D Isometric Diorama & GameManager thành công!");
        }
    }
}
