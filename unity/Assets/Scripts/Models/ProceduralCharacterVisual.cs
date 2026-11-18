using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Models
{
    /// <summary>
    /// Tạo nhân vật low-poly bằng primitive Unity để demo có hình ảnh ngay cả khi chưa có model 3D.
    /// </summary>
    public class ProceduralCharacterVisual : MonoBehaviour
    {
        [Header("Visuals")]
        [SerializeField] private bool buildOnAwake = true;
        [SerializeField] private float idleSway = 2.5f;

        private Transform generatedRoot;
        private CharacterStats currentStats;
        private float idleTime;

        private void Awake()
        {
            if (buildOnAwake)
            {
                Rebuild(new CharacterStats());
            }
        }

        private void OnEnable()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnAgeUp += HandleAgeUp;
            }
        }

        private void OnDisable()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnAgeUp -= HandleAgeUp;
            }
        }

        private void Update()
        {
            if (generatedRoot == null) return;

            idleTime += Time.deltaTime;
            float sway = Mathf.Sin(idleTime * 1.8f) * idleSway;
            generatedRoot.localRotation = Quaternion.Euler(0f, sway, 0f);
        }

        public void Rebuild(CharacterStats stats)
        {
            currentStats = stats ?? new CharacterStats();

            if (generatedRoot != null)
            {
                Destroy(generatedRoot.gameObject);
            }

            generatedRoot = new GameObject("GeneratedCharacter").transform;
            generatedRoot.SetParent(transform, false);

            bool child = currentStats.age < 18;
            bool wealthy = currentStats.cash >= 1_000_000_000;
            float scale = child ? 0.82f : 1f;
            generatedRoot.localScale = Vector3.one * scale;

            Color skin = new Color(0.82f, 0.49f, 0.31f);
            Color shirt = child
                ? new Color(0.20f, 0.45f, 0.85f)
                : wealthy
                    ? new Color(0.08f, 0.08f, 0.12f)
                    : new Color(0.16f, 0.55f, 0.48f);
            Color trousers = wealthy
                ? new Color(0.12f, 0.10f, 0.08f)
                : new Color(0.08f, 0.12f, 0.22f);

            CreatePrimitive("Body", PrimitiveType.Capsule, new Vector3(0f, 1.45f, 0f),
                new Vector3(0.72f, 0.85f, 0.48f), shirt);
            CreatePrimitive("Head", PrimitiveType.Sphere, new Vector3(0f, 2.55f, 0f),
                new Vector3(0.58f, 0.62f, 0.55f), skin);
            CreatePrimitive("Hair", PrimitiveType.Sphere, new Vector3(0f, 2.84f, -0.02f),
                new Vector3(0.60f, 0.24f, 0.56f), wealthy ? Color.black : new Color(0.12f, 0.06f, 0.03f));

            CreatePrimitive("LeftArm", PrimitiveType.Capsule, new Vector3(-0.52f, 1.48f, 0f),
                new Vector3(0.16f, 0.62f, 0.16f), skin, new Vector3(0f, 0f, 12f));
            CreatePrimitive("RightArm", PrimitiveType.Capsule, new Vector3(0.52f, 1.48f, 0f),
                new Vector3(0.16f, 0.62f, 0.16f), skin, new Vector3(0f, 0f, -12f));
            CreatePrimitive("LeftLeg", PrimitiveType.Capsule, new Vector3(-0.22f, 0.58f, 0f),
                new Vector3(0.18f, 0.62f, 0.18f), trousers);
            CreatePrimitive("RightLeg", PrimitiveType.Capsule, new Vector3(0.22f, 0.58f, 0f),
                new Vector3(0.18f, 0.62f, 0.18f), trousers);
            CreatePrimitive("LeftShoe", PrimitiveType.Cube, new Vector3(-0.22f, 0.12f, -0.08f),
                new Vector3(0.28f, 0.14f, 0.44f), Color.black);
            CreatePrimitive("RightShoe", PrimitiveType.Cube, new Vector3(0.22f, 0.12f, -0.08f),
                new Vector3(0.28f, 0.14f, 0.44f), Color.black);

            if (wealthy)
            {
                CreatePrimitive("Crown", PrimitiveType.Cube, new Vector3(0f, 3.14f, 0f),
                    new Vector3(0.46f, 0.10f, 0.28f), new Color(1f, 0.72f, 0.08f));
                CreatePrimitive("Watch", PrimitiveType.Cylinder, new Vector3(0.64f, 1.35f, -0.02f),
                    new Vector3(0.09f, 0.05f, 0.09f), new Color(1f, 0.72f, 0.08f),
                    new Vector3(90f, 0f, 0f));
            }
        }

        private void HandleAgeUp(int age)
        {
            if (GameManager.Instance != null)
            {
                Rebuild(GameManager.Instance.currentStats);
            }
        }

        private GameObject CreatePrimitive(
            string objectName,
            PrimitiveType primitiveType,
            Vector3 localPosition,
            Vector3 localScale,
            Color color,
            Vector3 localEulerAngles = default(Vector3))
        {
            GameObject part = GameObject.CreatePrimitive(primitiveType);
            part.name = objectName;
            part.transform.SetParent(generatedRoot, false);
            part.transform.localPosition = localPosition;
            part.transform.localScale = localScale;
            part.transform.localEulerAngles = localEulerAngles;

            Renderer renderer = part.GetComponent<Renderer>();
            renderer.material = CreateMaterial(color);

            Collider collider = part.GetComponent<Collider>();
            if (collider != null)
            {
                Destroy(collider);
            }

            return part;
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
    }
}
