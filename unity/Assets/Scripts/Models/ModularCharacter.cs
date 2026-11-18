using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Models
{
    /// <summary>
    /// Quản lý hệ thống nhân vật 3D Modular:
    /// Thay đổi chiều cao, màu sắc trang phục và biểu cảm chuyển động theo độ tuổi & địa vị tài chính.
    /// </summary>
    public class ModularCharacter : MonoBehaviour
    {
        [Header("Modular Mesh Sockets")]
        [SerializeField] private Transform headSocket;
        [SerializeField] private Transform hairSocket;
        [SerializeField] private Transform torsoSocket;
        [SerializeField] private Transform legsSocket;
        [SerializeField] private Transform accessorySocket;

        [Header("Animation")]
        [SerializeField] private Animator characterAnimator;

        [Header("Outfits By Life Stage")]
        [SerializeField] private GameObject childhoodOutfit;
        [SerializeField] private GameObject studentUniformOutfit;
        [SerializeField] private GameObject casualOfficeOutfit;
        [SerializeField] private GameObject luxuryBillionaireSuit;

        private GameObject currentOutfitInstance;
        private GameObject proceduralAvatarRoot;
        private Renderer proceduralTorsoRenderer;
        private Renderer proceduralHairRenderer;
        private float bounceTimer = 0f;

        public enum CharacterAnimState
        {
            Idle,
            Typing,
            Thinking,
            Celebrate,
            Sad,
            Sleeping
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged += UpdateCharacterAppearance;
                UpdateCharacterAppearance(GameManager.Instance.currentStats);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStatsChanged -= UpdateCharacterAppearance;
            }
        }

        private void Update()
        {
            // Chuyển động thở nhẹ nhàng tự nhiên cho nhân vật Chibi ngay cả khi chưa gắn Animator
            if (proceduralAvatarRoot != null)
            {
                float bob = Mathf.Sin(Time.time * 2.6f) * 0.025f;
                if (bounceTimer > 0f)
                {
                    bounceTimer -= Time.deltaTime;
                    bob += Mathf.Abs(Mathf.Sin(Time.time * 12f)) * 0.18f;
                }
                proceduralAvatarRoot.transform.localPosition = new Vector3(0f, bob, 0f);
            }
        }

        public void SetAnimationState(CharacterAnimState state)
        {
            if (state == CharacterAnimState.Celebrate)
            {
                bounceTimer = 1.2f;
            }

            if (characterAnimator == null) return;

            characterAnimator.SetInteger("AnimState", (int)state);
            switch (state)
            {
                case CharacterAnimState.Celebrate:
                    characterAnimator.SetTrigger("CelebrateTrigger");
                    break;
                case CharacterAnimState.Sad:
                    characterAnimator.SetTrigger("SadTrigger");
                    break;
            }
        }

        public void UpdateCharacterAppearance(CharacterStats stats)
        {
            if (stats == null) return;

            float targetScale = stats.GetLifeStage() switch
            {
                LifeStage.Infant => 0.55f,
                LifeStage.Child => 0.72f,
                LifeStage.Teen => 0.88f,
                LifeStage.Senior => 0.96f,
                _ => 1.0f
            };
            transform.localScale = Vector3.one * targetScale;

            long netWorth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(stats)
                : stats.cash - stats.debt;

            GameObject prefabToSpawn = childhoodOutfit;
            if (stats.age < 6) prefabToSpawn = childhoodOutfit;
            else if (stats.age < 18) prefabToSpawn = studentUniformOutfit;
            else if (netWorth < 2_000_000_000L) prefabToSpawn = casualOfficeOutfit;
            else prefabToSpawn = luxuryBillionaireSuit;

            if (prefabToSpawn != null && torsoSocket != null)
            {
                if (currentOutfitInstance != null) Destroy(currentOutfitInstance);
                currentOutfitInstance = Instantiate(prefabToSpawn, torsoSocket);
            }
            else
            {
                EnsureProceduralChibi();
                UpdateProceduralColors(stats, netWorth);
            }
        }

        private void EnsureProceduralChibi()
        {
            if (proceduralAvatarRoot != null) return;
            proceduralAvatarRoot = new GameObject("ProceduralChibiAvatar");
            proceduralAvatarRoot.transform.SetParent(transform, false);

            Shader shader = Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard");

            // Đầu Chibi
            var head = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            head.transform.SetParent(proceduralAvatarRoot.transform, false);
            head.transform.localPosition = new Vector3(0f, 1.05f, 0f);
            head.transform.localScale = new Vector3(0.46f, 0.46f, 0.46f);
            Destroy(head.GetComponent<Collider>());
            head.GetComponent<Renderer>().sharedMaterial = new Material(shader) { color = new Color(1.0f, 0.86f, 0.74f) };

            // Tóc
            var hair = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            hair.transform.SetParent(proceduralAvatarRoot.transform, false);
            hair.transform.localPosition = new Vector3(0f, 1.18f, -0.02f);
            hair.transform.localScale = new Vector3(0.48f, 0.30f, 0.48f);
            Destroy(hair.GetComponent<Collider>());
            proceduralHairRenderer = hair.GetComponent<Renderer>();
            proceduralHairRenderer.sharedMaterial = new Material(shader) { color = new Color(0.15f, 0.14f, 0.16f) };

            // Thân áo
            var torso = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            torso.transform.SetParent(proceduralAvatarRoot.transform, false);
            torso.transform.localPosition = new Vector3(0f, 0.55f, 0f);
            torso.transform.localScale = new Vector3(0.38f, 0.36f, 0.28f);
            Destroy(torso.GetComponent<Collider>());
            proceduralTorsoRenderer = torso.GetComponent<Renderer>();
            proceduralTorsoRenderer.sharedMaterial = new Material(shader) { color = new Color(0.25f, 0.56f, 0.92f) };
        }

        private void UpdateProceduralColors(CharacterStats stats, long netWorth)
        {
            if (proceduralTorsoRenderer != null)
            {
                Color outfitColor = stats.age < 6
                    ? new Color(0.98f, 0.78f, 0.32f)
                    : (stats.age < 18
                        ? new Color(0.95f, 0.96f, 0.98f)
                        : (netWorth >= 2_000_000_000L ? new Color(0.14f, 0.16f, 0.24f) : new Color(0.24f, 0.58f, 0.88f)));
                proceduralTorsoRenderer.sharedMaterial.color = outfitColor;
            }

            if (proceduralHairRenderer != null)
            {
                proceduralHairRenderer.sharedMaterial.color = stats.age >= 60
                    ? new Color(0.82f, 0.84f, 0.86f)
                    : new Color(0.15f, 0.13f, 0.12f);
            }
        }
    }
}
