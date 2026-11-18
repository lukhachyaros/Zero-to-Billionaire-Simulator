using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Events
{
    /// <summary>
    /// Trái tim điều phối kịch bản rẽ nhánh:
    /// - Tự động nạp JSON từ Resources/Data
    /// - Chuẩn hóa schema tương thích ngược cho kịch bản cộng đồng
    /// - Tính toán xác suất động theo conditionFormula & chỉ số nhân vật
    /// - Hỗ trợ chuỗi sự kiện nối tiếp (nextEventId) và chống lặp sự kiện ngẫu nhiên liên tiếp
    /// </summary>
    public class EventEngine : MonoBehaviour
    {
        public static EventEngine Instance { get; private set; }

        private readonly List<GameEvent> loadedEvents = new List<GameEvent>();
        private readonly HashSet<string> triggeredEventIds = new HashSet<string>();
        private readonly HashSet<string> playerFlags = new HashSet<string>();
        private readonly Queue<string> queuedEventIds = new Queue<string>();
        private readonly Dictionary<string, int> lastTriggeredAgeByEvent = new Dictionary<string, int>();

        [System.Serializable]
        private class EventListWrapper
        {
            public List<GameEvent> events;
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadDefaultResources();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void LoadDefaultResources()
        {
            if (loadedEvents.Count > 0) return;

            string[] resourceFiles =
            {
                "Data/life_events_full",
                "Data/random_yearly_events",
                "Data/pack_youth_school",
                "Data/pack_career_workplace",
                "Data/pack_wealth_investments",
                "Data/pack_family_society_elder",
                "Data/pack_life_expenses_hardcore"
            };
            foreach (string path in resourceFiles)
            {
                TextAsset asset = Resources.Load<TextAsset>(path);
                if (asset != null)
                {
                    LoadEventsFromJson(asset.text);
                }
            }
        }

        public void ResetSessionState(IEnumerable<string> initialFlags = null)
        {
            triggeredEventIds.Clear();
            playerFlags.Clear();
            queuedEventIds.Clear();
            lastTriggeredAgeByEvent.Clear();

            if (initialFlags != null)
            {
                foreach (var flag in initialFlags)
                {
                    if (!string.IsNullOrEmpty(flag))
                        playerFlags.Add(flag);
                }
            }
        }

        public void RestoreSessionState(IEnumerable<string> triggered, IEnumerable<string> flags)
        {
            triggeredEventIds.Clear();
            playerFlags.Clear();
            queuedEventIds.Clear();
            lastTriggeredAgeByEvent.Clear();

            if (triggered != null)
            {
                foreach (var id in triggered) triggeredEventIds.Add(id);
            }
            if (flags != null)
            {
                foreach (var f in flags) playerFlags.Add(f);
            }
        }

        public List<string> GetTriggeredEventIds() => triggeredEventIds.ToList();
        public List<string> GetUnlockedFlags() => playerFlags.ToList();
        public bool HasFlag(string flag) => playerFlags.Contains(flag);
        public void AddFlag(string flag)
        {
            if (!string.IsNullOrEmpty(flag)) playerFlags.Add(flag);
        }

        public void LoadEventsFromJson(string jsonContent)
        {
            if (string.IsNullOrWhiteSpace(jsonContent)) return;

            try
            {
                string normalized = NormalizeJsonSchema(jsonContent.Trim());
                var wrapper = JsonUtility.FromJson<EventListWrapper>("{\"events\":" + normalized + "}");
                if (wrapper != null && wrapper.events != null)
                {
                    int added = 0;
                    foreach (var evt in wrapper.events)
                    {
                        if (evt != null && !string.IsNullOrEmpty(evt.eventId) && loadedEvents.All(e => e.eventId != evt.eventId))
                        {
                            loadedEvents.Add(evt);
                            added++;
                        }
                    }
                    Debug.Log($"[EventEngine] Đã nạp thêm {added} sự kiện (Tổng: {loadedEvents.Count}).");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[EventEngine] Lỗi nạp sự kiện JSON: {ex.Message}");
            }
        }

        /// <summary>
        /// Chuyển đổi khóa JSON cũ sang chuẩn GameEventModels trước khi nạp qua JsonUtility.
        /// </summary>
        private static string NormalizeJsonSchema(string rawJson)
        {
            string s = Regex.Replace(rawJson, "\"operator\"\\s*:", "\"operatorType\":");
            s = Regex.Replace(s, "\"value\"\\s*:\\s*(-?\\d+)", "\"numberValue\": $1");
            s = Regex.Replace(s, "\"condition\"\\s*:", "\"conditionFormula\":");
            return s;
        }

        public GameEvent SelectNextEventForYear(CharacterStats stats)
        {
            LoadDefaultResources();

            // Ưu tiên sự kiện nối tiếp (Event Chaining)
            while (queuedEventIds.Count > 0)
            {
                string nextId = queuedEventIds.Dequeue();
                var chained = loadedEvents.FirstOrDefault(e => e.eventId == nextId);
                if (chained != null)
                {
                    MarkEventTriggered(chained.eventId, stats.age);
                    return chained;
                }
            }

            var eligible = GetEligibleEvents(stats);
            if (eligible.Count == 0) return null;

            // Nhóm sự kiện cột mốc quan trọng (priority >= 75) luôn được ưu tiên
            int topPriority = eligible[0].priority;
            var candidates = eligible.Where(e => e.priority >= topPriority - 12).ToList();
            var chosen = candidates[UnityEngine.Random.Range(0, candidates.Count)];

            MarkEventTriggered(chosen.eventId, stats.age);
            return chosen;
        }

        public List<GameEvent> GetEligibleEvents(CharacterStats stats)
        {
            var eligible = new List<GameEvent>();

            foreach (var evt in loadedEvents)
            {
                if (evt.isOneTime && triggeredEventIds.Contains(evt.eventId))
                    continue;

                // Sự kiện lặp lại cần cách nhau ít nhất 3 năm để không nhàm chán
                if (!evt.isOneTime && lastTriggeredAgeByEvent.TryGetValue(evt.eventId, out int lastAge))
                {
                    if (stats.age - lastAge < 3) continue;
                }

                if (stats.age < evt.minAge || stats.age > evt.maxAge)
                    continue;

                if (!CheckConditions(evt.conditions, stats))
                    continue;

                eligible.Add(evt);
            }

            return eligible.OrderByDescending(e => e.priority).ToList();
        }

        private bool CheckConditions(List<EventCondition> conditions, CharacterStats stats)
        {
            if (conditions == null || conditions.Count == 0) return true;

            foreach (var cond in conditions)
            {
                if (cond == null || string.IsNullOrEmpty(cond.field)) continue;

                switch (cond.field)
                {
                    case "hasFlag":
                        if (!playerFlags.Contains(cond.stringValue)) return false;
                        break;
                    case "notHasFlag":
                        if (playerFlags.Contains(cond.stringValue)) return false;
                        break;
                    case "gender":
                        if (!CompareString(stats.gender, cond.operatorType, cond.stringValue)) return false;
                        break;
                    case "educationLevel":
                        if (!CompareString(stats.educationLevel, cond.operatorType, cond.stringValue)) return false;
                        break;
                    default:
                        long statVal = GetNumericStat(cond.field, stats);
                        if (!CompareNumber(statVal, cond.operatorType, cond.numberValue)) return false;
                        break;
                }
            }
            return true;
        }

        private static long GetNumericStat(string fieldName, CharacterStats stats)
        {
            return fieldName switch
            {
                "age" => stats.age,
                "cash" or "money" => stats.cash,
                "debt" => stats.debt,
                "netWorth" => EconomySystem.Instance != null ? EconomySystem.Instance.CalculateNetWorth(stats) : stats.cash - stats.debt,
                "health" => stats.health,
                "intelligence" => stats.intelligence,
                "appearance" => stats.appearance,
                "happiness" => stats.happiness,
                "discipline" => stats.discipline,
                "stress" => stats.stress,
                "luck" => stats.luck,
                "parentRelationship" => stats.parentRelationship,
                "socialStatus" => stats.socialStatus,
                "charisma" => stats.charisma,
                "financialLiteracy" => stats.financialLiteracy,
                "practicalSkills" => stats.practicalSkills,
                "businessAcuity" => stats.businessAcuity,
                "karma" => stats.karma,
                "childrenCount" => stats.childrenCount,
                _ => 0
            };
        }

        private static bool CompareString(string actual, string op, string target)
        {
            return op == "!=" ? actual != target : actual == target;
        }

        private static bool CompareNumber(long statVal, string op, long targetVal)
        {
            return op switch
            {
                "==" => statVal == targetVal,
                ">=" => statVal >= targetVal,
                "<=" => statVal <= targetVal,
                ">" => statVal > targetVal,
                "<" => statVal < targetVal,
                "!=" => statVal != targetVal,
                _ => true
            };
        }

        /// <summary>
        /// Đánh giá biểu thức dạng "intelligence >= 60" để điều chỉnh xác suất thành công thực tế.
        /// </summary>
        public bool EvaluateFormula(string formula, CharacterStats stats)
        {
            if (string.IsNullOrWhiteSpace(formula)) return true;
            var match = Regex.Match(formula.Trim(), @"^([a-zA-Z_]+)\s*(>=|<=|==|!=|>|<)\s*(-?\d+)$");
            if (!match.Success) return true;

            string field = match.Groups[1].Value;
            string op = match.Groups[2].Value;
            long target = long.Parse(match.Groups[3].Value);
            return CompareNumber(GetNumericStat(field, stats), op, target);
        }

        public EventOutcome ResolveOption(EventOption option, CharacterStats stats)
        {
            if (option == null || option.outcomes == null || option.outcomes.Count == 0) return null;

            // Điều chỉnh trọng số dựa trên conditionFormula và chỉ số May mắn (Luck)
            float[] weights = new float[option.outcomes.Count];
            float totalWeight = 0f;

            for (int i = 0; i < option.outcomes.Count; i++)
            {
                var outcome = option.outcomes[i];
                float w = Mathf.Max(0.01f, outcome.probability);

                if (!string.IsNullOrWhiteSpace(outcome.conditionFormula))
                {
                    bool passed = EvaluateFormula(outcome.conditionFormula, stats);
                    w *= passed ? (1.25f + (stats.luck - 50) * 0.004f) : 0.45f;
                }

                weights[i] = Mathf.Max(0.01f, w);
                totalWeight += weights[i];
            }

            float roll = UnityEngine.Random.Range(0f, totalWeight);
            float cumulative = 0f;

            for (int i = 0; i < option.outcomes.Count; i++)
            {
                cumulative += weights[i];
                if (roll <= cumulative)
                {
                    ApplyOutcome(option.outcomes[i], stats);
                    return option.outcomes[i];
                }
            }

            var fallback = option.outcomes[0];
            ApplyOutcome(fallback, stats);
            return fallback;
        }

        private void ApplyOutcome(EventOutcome outcome, CharacterStats stats)
        {
            if (outcome == null) return;

            stats.ApplyModifiers(outcome.statModifiers);

            if (!string.IsNullOrEmpty(outcome.educationSet))
            {
                if (CharacterStats.GetEducationRank(outcome.educationSet) >= CharacterStats.GetEducationRank(stats.educationLevel))
                {
                    stats.educationLevel = outcome.educationSet;
                    if (string.IsNullOrEmpty(stats.currentCareerId) && stats.age >= 6 && stats.age <= 18)
                    {
                        stats.currentJob = $"Học sinh ({stats.educationLevel})";
                    }
                }
            }

            if (!string.IsNullOrEmpty(outcome.maritalStatusSet))
            {
                stats.maritalStatus = outcome.maritalStatusSet;
            }

            if (outcome.childrenDelta > 0)
            {
                stats.childrenCount += outcome.childrenDelta;
            }

            if (outcome.unlockedFlags != null)
            {
                foreach (var flag in outcome.unlockedFlags)
                {
                    if (!string.IsNullOrEmpty(flag))
                        playerFlags.Add(flag);
                }
            }

            if (!string.IsNullOrEmpty(outcome.nextEventId))
            {
                queuedEventIds.Enqueue(outcome.nextEventId);
            }

            stats.ClampStats();
        }

        public void MarkEventTriggered(string eventId, int currentAge = 0)
        {
            if (string.IsNullOrEmpty(eventId)) return;
            triggeredEventIds.Add(eventId);
            lastTriggeredAgeByEvent[eventId] = currentAge;
        }
    }
}
