using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Events
{
    public class EventEngine : MonoBehaviour
    {
        public static EventEngine Instance { get; private set; }

        private List<GameEvent> loadedEvents = new List<GameEvent>();
        private HashSet<string> triggeredEventIds = new HashSet<string>();
        private HashSet<string> playerFlags = new HashSet<string>();

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void LoadEventsFromJson(string jsonContent)
        {
            try
            {
                // Giả định nạp mảng sự kiện hoặc wrapper
                var wrapper = JsonUtility.FromJson<EventListWrapper>("{\"events\":" + jsonContent + "}");
                if (wrapper != null && wrapper.events != null)
                {
                    loadedEvents.AddRange(wrapper.events);
                    Debug.Log($"[EventEngine] Đã nạp thành công {wrapper.events.Count} sự kiện.");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[EventEngine] Lỗi nạp sự kiện JSON: {ex.Message}");
            }
        }

        public List<GameEvent> GetEligibleEvents(CharacterStats stats)
        {
            var eligible = new List<GameEvent>();

            foreach (var evt in loadedEvents)
            {
                if (evt.isOneTime && triggeredEventIds.Contains(evt.eventId))
                    continue;

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
                if (cond.field == "hasFlag")
                {
                    if (!playerFlags.Contains(cond.stringValue)) return false;
                }
                else if (cond.field == "intelligence")
                {
                    if (!CompareNumber(stats.intelligence, cond.operatorType, cond.numberValue)) return false;
                }
                else if (cond.field == "cash")
                {
                    if (!CompareNumber(stats.cash, cond.operatorType, cond.numberValue)) return false;
                }
                else if (cond.field == "health")
                {
                    if (!CompareNumber(stats.health, cond.operatorType, cond.numberValue)) return false;
                }
            }
            return true;
        }

        private bool CompareNumber(long statVal, string op, long targetVal)
        {
            return op switch
            {
                "==" => statVal == targetVal,
                ">=" => statVal >= targetVal,
                "<=" => statVal <= targetVal,
                ">"  => statVal > targetVal,
                "<"  => statVal < targetVal,
                "!=" => statVal != targetVal,
                _    => true
            };
        }

        public EventOutcome ResolveOption(EventOption option, CharacterStats stats)
        {
            if (option.outcomes == null || option.outcomes.Count == 0) return null;

            // Tính toán xác suất
            float roll = UnityEngine.Random.value;
            float cumulative = 0f;

            foreach (var outcome in option.outcomes)
            {
                cumulative += outcome.probability;
                if (roll <= cumulative)
                {
                    ApplyOutcome(outcome, stats);
                    return outcome;
                }
            }

            // Fallback outcome đầu tiên
            var defaultOutcome = option.outcomes[0];
            ApplyOutcome(defaultOutcome, stats);
            return defaultOutcome;
        }

        private void ApplyOutcome(EventOutcome outcome, CharacterStats stats)
        {
            if (outcome == null) return;

            stats.ApplyModifiers(outcome.statModifiers);

            if (outcome.unlockedFlags != null)
            {
                foreach (var flag in outcome.unlockedFlags)
                {
                    playerFlags.Add(flag);
                }
            }
        }

        public void MarkEventTriggered(string eventId)
        {
            triggeredEventIds.Add(eventId);
        }

        [System.Serializable]
        private class EventListWrapper
        {
            public List<GameEvent> events;
        }
    }
}
