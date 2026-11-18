using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    [System.Serializable]
    public class RivalDefinition
    {
        public string rivalId;
        public string name;
        public string title;
        public string avatar;
        public long baseNetWorth;
    }

    [System.Serializable]
    public class RivalState
    {
        public string rivalId;
        public string name;
        public string title;
        public string avatar;
        public long netWorth;
        public float lastGrowthPct;
    }

    /// <summary>
    /// Quản lý Bảng Xếp Hạng Người Giàu (20 Đại gia & Tỷ phú) cùng biến động tài sản hàng năm.
    /// </summary>
    public class LeaderboardSystem : MonoBehaviour
    {
        public static LeaderboardSystem Instance { get; private set; }

        private readonly List<RivalDefinition> baseCatalog = new List<RivalDefinition>();
        public List<RivalState> activeRivals = new List<RivalState>();
        public int bestRankAchieved = 21;

        [System.Serializable]
        private class RivalListWrapper
        {
            public List<RivalDefinition> items;
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadLeaderboardFromResources();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void LoadLeaderboardFromResources()
        {
            if (baseCatalog.Count > 0) return;
            TextAsset asset = Resources.Load<TextAsset>("Data/billionaire_leaderboard");
            if (asset != null)
            {
                LoadLeaderboardFromJson(asset.text);
            }
        }

        public void LoadLeaderboardFromJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return;
            try
            {
                var wrapper = JsonUtility.FromJson<RivalListWrapper>("{\"items\":" + json.Trim() + "}");
                if (wrapper?.items != null)
                {
                    baseCatalog.Clear();
                    baseCatalog.AddRange(wrapper.items);
                    if (activeRivals.Count == 0) ResetRivals();
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[LeaderboardSystem] Lỗi đọc dữ liệu bảng xếp hạng: {ex.Message}");
            }
        }

        public void ResetRivals()
        {
            LoadLeaderboardFromResources();
            activeRivals.Clear();
            bestRankAchieved = baseCatalog.Count + 1;
            foreach (var r in baseCatalog)
            {
                activeRivals.Add(new RivalState
                {
                    rivalId = r.rivalId,
                    name = r.name,
                    title = r.title,
                    avatar = r.avatar,
                    netWorth = r.baseNetWorth,
                    lastGrowthPct = 0f
                });
            }
        }

        public string ProcessAnnualRivalGrowth(MacroEconomicCycle cycle, long playerNetWorth)
        {
            if (activeRivals.Count == 0) ResetRivals();

            float macroMult = cycle switch
            {
                MacroEconomicCycle.Boom => 1.45f,
                MacroEconomicCycle.Expansion => 1.0f,
                MacroEconomicCycle.Inflation => 0.75f,
                MacroEconomicCycle.Recession => -0.35f,
                _ => 1.0f
            };

            foreach (var rival in activeRivals)
            {
                float growth = 0.04f * macroMult + UnityEngine.Random.Range(-0.03f, 0.05f);
                rival.lastGrowthPct = growth * 100f;
                rival.netWorth = Math.Max(10_000_000L, (long)(rival.netWorth * (1.0f + growth)));
            }

            int rank = GetPlayerRank(playerNetWorth);
            if (rank < bestRankAchieved && rank <= 18)
            {
                bestRankAchieved = rank;
                return $"🏆 Bứt phá Bảng Phú Hào: Bạn đã leo lên Hạng #{rank}!";
            }
            return null;
        }

        public int GetPlayerRank(long playerNetWorth)
        {
            int higherCount = 0;
            foreach (var r in activeRivals)
            {
                if (r.netWorth > playerNetWorth) higherCount++;
            }
            return higherCount + 1;
        }
    }
}
