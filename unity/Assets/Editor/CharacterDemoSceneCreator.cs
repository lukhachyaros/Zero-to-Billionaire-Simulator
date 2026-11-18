using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using ZeroToBillionaire.Models;

namespace ZeroToBillionaire.Editor
{
    public static class CharacterDemoSceneCreator
    {
        private const string ScenePath = "Assets/Scenes/CharacterDemo.unity";

        [MenuItem("Zero to Billionaire/Create Character Demo Scene")]
        public static void CreateCharacterDemoScene()
        {
            EnsureFolder("Assets/Scenes");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            CreateLighting();
            CreateRoom();
            CreateCharacter();
            CreateCamera();

            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorSceneManager.OpenScene(ScenePath);
            Selection.activeGameObject = GameObject.Find("Character");
            Debug.Log("[CharacterDemo] Đã tạo demo nhân vật tại " + ScenePath);
        }

        private static void CreateLighting()
        {
            GameObject lightObject = new GameObject("Key Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.4f;
            light.color = new Color(1f, 0.86f, 0.68f);
            lightObject.transform.rotation = Quaternion.Euler(35f, -35f, 0f);

            GameObject fillObject = new GameObject("Fill Light");
            Light fill = fillObject.AddComponent<Light>();
            fill.type = LightType.Point;
            fill.range = 8f;
            fill.intensity = 5f;
            fill.color = new Color(0.25f, 0.42f, 1f);
            fillObject.transform.position = new Vector3(-3f, 3f, -2f);
        }

        private static void CreateRoom()
        {
            GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Cube);
            floor.name = "Diorama Floor";
            floor.transform.position = new Vector3(0f, -0.12f, 0f);
            floor.transform.localScale = new Vector3(8f, 0.2f, 6f);
            floor.GetComponent<Renderer>().sharedMaterial = CreateMaterial(new Color(0.08f, 0.10f, 0.16f));

            GameObject backdrop = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backdrop.name = "Diorama Backdrop";
            backdrop.transform.position = new Vector3(0f, 2.3f, 1.8f);
            backdrop.transform.localScale = new Vector3(8f, 5f, 0.2f);
            backdrop.GetComponent<Renderer>().sharedMaterial = CreateMaterial(new Color(0.12f, 0.14f, 0.24f));
        }

        private static void CreateCharacter()
        {
            GameObject character = new GameObject("Character");
            character.transform.position = new Vector3(0f, 0f, 0f);
            character.AddComponent<ProceduralCharacterVisual>();
        }

        private static void CreateCamera()
        {
            GameObject cameraObject = new GameObject("Main Camera");
            Camera camera = cameraObject.AddComponent<Camera>();
            cameraObject.tag = "MainCamera";
            cameraObject.transform.position = new Vector3(4.5f, 3.2f, -6.5f);
            cameraObject.transform.LookAt(new Vector3(0f, 1.5f, 0f));
            camera.fieldOfView = 35f;
            camera.backgroundColor = new Color(0.025f, 0.03f, 0.07f);
        }

        private static Material CreateMaterial(Color color)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null)
            {
                shader = Shader.Find("Standard");
            }

            Material material = new Material(shader);
            material.color = color;
            return material;
        }

        private static void EnsureFolder(string path)
        {
            string[] parts = path.Split('/');
            string current = parts[0];
            for (int i = 1; i < parts.Length; i++)
            {
                string next = current + "/" + parts[i];
                if (!AssetDatabase.IsValidFolder(next))
                {
                    AssetDatabase.CreateFolder(current, parts[i]);
                }

                current = next;
            }
        }
    }
}
