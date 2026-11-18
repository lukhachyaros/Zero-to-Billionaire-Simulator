// ═══════════════════════════════════════════════════════════════════════════
// CoinParticleSpawner.cs — Hệ thống particle đồng xu bay khi mua/kiếm tiền
// Sử dụng Unity Particle System + UI rendering
// ═══════════════════════════════════════════════════════════════════════════
using UnityEngine;
using UnityEngine.UI;

namespace ZeroToBillionaire.UI
{
    public class CoinParticleSpawner : MonoBehaviour
    {
        // ─── Singleton ──────────────────────────────────────────────────
        public static CoinParticleSpawner Instance { get; private set; }

        [Header("Theme")]
        [SerializeField] private UIThemeConfig theme;

        [Header("Particle System")]
        [SerializeField] private ParticleSystem coinParticles;
        [SerializeField] private ParticleSystem sparkParticles; // Tia lấp lánh nhỏ

        [Header("Coin Visual")]
        [SerializeField] private Sprite coinSprite;
        [SerializeField] private Material particleMaterial; // UI/Additive hoặc UI/Default

        [Header("Cấu hình")]
        [SerializeField] private float baseGravity = -200f;
        [SerializeField] private float baseSpeed = 300f;
        [SerializeField] private float rotationSpeed = 360f;

        // ─── Canvas Reference ───────────────────────────────────────────
        private Canvas _canvas;
        private RectTransform _canvasRect;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            _canvas = GetComponentInParent<Canvas>();
            if (_canvas != null)
                _canvasRect = _canvas.GetComponent<RectTransform>();

            // Tự tạo particle systems nếu chưa gắn
            if (coinParticles == null)
                coinParticles = CreateCoinParticleSystem("CoinParticles");
            if (sparkParticles == null)
                sparkParticles = CreateSparkParticleSystem("SparkParticles");
        }

        // ─── Public API ─────────────────────────────────────────────────

        /// <summary>
        /// Burst đồng xu từ vị trí trên UI — gọi khi kiếm tiền
        /// </summary>
        public void SpawnCoins(Vector3 worldPosition, int count = -1)
        {
            if (coinParticles == null) return;

            coinParticles.transform.position = worldPosition;

            int burstCount = count > 0 ? count : (theme != null ? theme.coinBurstCount : 12);

            var emission = coinParticles.emission;
            emission.SetBursts(new ParticleSystem.Burst[]
            {
                new ParticleSystem.Burst(0f, burstCount)
            });

            coinParticles.Play();

            // Spawn sparks cùng lúc
            if (sparkParticles != null)
            {
                sparkParticles.transform.position = worldPosition;
                sparkParticles.Emit(burstCount * 2);
            }
        }

        /// <summary>
        /// Burst đồng xu từ RectTransform (UI element)
        /// </summary>
        public void SpawnCoinsFromUI(RectTransform source, int count = -1)
        {
            Vector3 worldPos = source.position;
            SpawnCoins(worldPos, count);
        }

        /// <summary>
        /// Burst nhỏ — dùng khi click nút, mua đồ nhỏ
        /// </summary>
        public void SpawnSmallBurst(Vector3 worldPosition)
        {
            SpawnCoins(worldPosition, 5);
        }

        /// <summary>
        /// Burst lớn — dùng cho milestone, lương tháng lớn
        /// </summary>
        public void SpawnLargeBurst(Vector3 worldPosition)
        {
            SpawnCoins(worldPosition, 30);
        }

        /// <summary>
        /// Rain effect — mưa tiền từ trên xuống (milestone tỷ phú)
        /// </summary>
        public void SpawnMoneyRain(float duration = 3f)
        {
            if (coinParticles == null) return;

            // Đặt ở đỉnh màn hình, trải rộng
            if (_canvasRect != null)
            {
                coinParticles.transform.position = _canvasRect.position + Vector3.up * (_canvasRect.rect.height * 0.5f);
            }

            var shape = coinParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(_canvasRect != null ? _canvasRect.rect.width : 800f, 1f, 1f);

            var emission = coinParticles.emission;
            emission.rateOverTime = 20;

            coinParticles.Play();

            // Dừng sau duration
            CancelInvoke(nameof(StopMoneyRain));
            Invoke(nameof(StopMoneyRain), duration);
        }

        private void StopMoneyRain()
        {
            if (coinParticles != null)
            {
                var emission = coinParticles.emission;
                emission.rateOverTime = 0;
                coinParticles.Stop(false, ParticleSystemStopBehavior.StopEmitting);
            }

            // Reset shape về point cho burst bình thường
            var shape = coinParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Cone;
            shape.angle = 45f;
        }

        // ─── Particle System Builders ───────────────────────────────────

        private ParticleSystem CreateCoinParticleSystem(string name)
        {
            var go = new GameObject(name);
            go.transform.SetParent(transform, false);

            var ps = go.AddComponent<ParticleSystem>();
            var renderer = go.GetComponent<ParticleSystemRenderer>();

            // Main module
            var main = ps.main;
            main.playOnAwake = false;
            main.loop = false;
            main.duration = 0.1f;
            main.startLifetime = theme != null ? theme.coinLifetime : 1.5f;
            main.startSpeed = baseSpeed;
            main.startSize = new ParticleSystem.MinMaxCurve(20f, 35f);
            main.startRotation = new ParticleSystem.MinMaxCurve(0f, Mathf.PI * 2f);
            main.gravityModifier = 2f;
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.maxParticles = 100;

            // Start color — gold
            Color coinStart = theme != null ? theme.coinColorStart : UIThemeConfig.HexColor("#F5C542");
            Color coinEnd = theme != null ? theme.coinColorEnd : UIThemeConfig.HexColor("#D4A017", 0f);
            main.startColor = new ParticleSystem.MinMaxGradient(coinStart, Color.Lerp(coinStart, Color.white, 0.3f));

            // Emission
            var emission = ps.emission;
            emission.rateOverTime = 0;
            emission.SetBursts(new ParticleSystem.Burst[]
            {
                new ParticleSystem.Burst(0f, 12)
            });

            // Shape — cone burst
            var shape = ps.shape;
            shape.shapeType = ParticleSystemShapeType.Cone;
            shape.angle = 60f;
            shape.radius = 10f;
            shape.rotation = new Vector3(-90f, 0f, 0f); // Burst lên trên

            // Velocity over lifetime — spread + gravity
            var velocity = ps.velocityOverLifetime;
            velocity.enabled = true;
            velocity.y = new ParticleSystem.MinMaxCurve(-50f, 50f);
            velocity.x = new ParticleSystem.MinMaxCurve(-100f, 100f);

            // Size over lifetime — nhỏ dần
            var sizeOverLifetime = ps.sizeOverLifetime;
            sizeOverLifetime.enabled = true;
            sizeOverLifetime.size = new ParticleSystem.MinMaxCurve(1f,
                new AnimationCurve(
                    new Keyframe(0f, 0.5f),
                    new Keyframe(0.3f, 1f),
                    new Keyframe(1f, 0.2f)
                ));

            // Color over lifetime — fade out
            var colorOverLifetime = ps.colorOverLifetime;
            colorOverLifetime.enabled = true;
            Gradient gradient = new Gradient();
            gradient.SetKeys(
                new GradientColorKey[] {
                    new GradientColorKey(coinStart, 0f),
                    new GradientColorKey(coinStart, 0.7f),
                    new GradientColorKey(coinStart, 1f)
                },
                new GradientAlphaKey[] {
                    new GradientAlphaKey(0f, 0f),
                    new GradientAlphaKey(1f, 0.1f),
                    new GradientAlphaKey(1f, 0.6f),
                    new GradientAlphaKey(0f, 1f)
                }
            );
            colorOverLifetime.color = gradient;

            // Rotation over lifetime — xoay
            var rotOverLifetime = ps.rotationOverLifetime;
            rotOverLifetime.enabled = true;
            rotOverLifetime.z = new ParticleSystem.MinMaxCurve(-rotationSpeed * Mathf.Deg2Rad, rotationSpeed * Mathf.Deg2Rad);

            // Renderer
            renderer.renderMode = ParticleSystemRenderMode.Billboard;
            if (particleMaterial != null)
                renderer.material = particleMaterial;
            renderer.sortingOrder = 100; // Render trên cùng

            return ps;
        }

        private ParticleSystem CreateSparkParticleSystem(string name)
        {
            var go = new GameObject(name);
            go.transform.SetParent(transform, false);

            var ps = go.AddComponent<ParticleSystem>();
            var renderer = go.GetComponent<ParticleSystemRenderer>();

            var main = ps.main;
            main.playOnAwake = false;
            main.loop = false;
            main.startLifetime = new ParticleSystem.MinMaxCurve(0.3f, 0.8f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(100f, 250f);
            main.startSize = new ParticleSystem.MinMaxCurve(2f, 6f);
            main.gravityModifier = 0.5f;
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.maxParticles = 200;

            Color sparkColor = theme != null ? theme.accentGold : UIThemeConfig.HexColor("#F5C542");
            main.startColor = new ParticleSystem.MinMaxGradient(sparkColor, Color.white);

            var emission = ps.emission;
            emission.rateOverTime = 0;

            var shape = ps.shape;
            shape.shapeType = ParticleSystemShapeType.Sphere;
            shape.radius = 15f;

            var colorOverLifetime = ps.colorOverLifetime;
            colorOverLifetime.enabled = true;
            Gradient sparkGrad = new Gradient();
            sparkGrad.SetKeys(
                new GradientColorKey[] {
                    new GradientColorKey(Color.white, 0f),
                    new GradientColorKey(sparkColor, 0.5f),
                    new GradientColorKey(sparkColor, 1f)
                },
                new GradientAlphaKey[] {
                    new GradientAlphaKey(1f, 0f),
                    new GradientAlphaKey(0.6f, 0.5f),
                    new GradientAlphaKey(0f, 1f)
                }
            );
            colorOverLifetime.color = sparkGrad;

            renderer.renderMode = ParticleSystemRenderMode.Billboard;
            if (particleMaterial != null)
                renderer.material = particleMaterial;
            renderer.sortingOrder = 101;

            return ps;
        }
    }
}
