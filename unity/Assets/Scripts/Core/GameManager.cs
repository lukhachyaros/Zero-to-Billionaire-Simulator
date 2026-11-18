using System;
using System.Collections.Generic;
using UnityEngine;
using ZeroToBillionaire.Events;
using ZeroToBillionaire.Mobile.iOS;

namespace ZeroToBillionaire.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Character Data")]
        public CharacterStats currentStats = new CharacterStats();
        public CharacterStats Stats { get { return currentStats; } }

        [Header("Life Log")]
        public List<string> lifeLog = new List<string>();

        public event Action<int> OnAgeUp;
        public event Action<GameEvent> OnEventTriggered;
        public event Action OnGameOver;

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

        private void Start()
        {
            StartNewLife("Nguyễn Gia Huy", "Nam");
        }

        public void StartNewLife(string name, string gender)
        {
            currentStats = new CharacterStats
            {
                characterName = name,
                gender = gender,
                age = 0,
                health = UnityEngine.Random.Range(85, 100),
                intelligence = UnityEngine.Random.Range(40, 75),
                appearance = UnityEngine.Random.Range(50, 85),
                happiness = 80,
                discipline = 50,
                luck = UnityEngine.Random.Range(30, 80),
                cash = 0
            };

            lifeLog.Clear();
            AddLog($"🎉 Bạn sinh ra tại Việt Nam, mang tên {name}. Gia đình đón mừng bạn trong niềm hân hoan.");

            TriggerYearCycle();
        }

        public void AgeUp()
        {
            if (!currentStats.isAlive)
            {
                Debug.LogWarning("Nhân vật đã qua đời, không thể tăng tuổi.");
                return;
            }

            // Kích hoạt rung haptic nhẹ trên iPhone
            IOSHapticFeedback.TriggerSelection();

            currentStats.age++;
            ProcessAnnualEconomy();

            AddLog($"📅 Bạn đã bước sang tuổi {currentStats.age}.");
            OnAgeUp?.Invoke(currentStats.age);

            TriggerYearCycle();
        }

        private void ProcessAnnualEconomy()
        {
            // Cập nhật thu nhập và chi phí hàng năm
            long netIncome = (currentStats.monthlyIncome - currentStats.monthlyExpense) * 12;
            currentStats.cash += netIncome;

            // Kiểm tra sức khỏe theo độ tuổi
            if (currentStats.age > 50)
            {
                int healthDecay = UnityEngine.Random.Range(1, 4);
                currentStats.health -= healthDecay;
            }

            currentStats.ClampStats();

            if (!currentStats.isAlive)
            {
                AddLog($"🪦 Bạn đã qua đời ở tuổi {currentStats.age}. Cuộc đời khép lại với tổng tài sản {currentStats.cash:N0} VNĐ.");
                IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Warning);
                OnGameOver?.Invoke();
            }
        }

        private void TriggerYearCycle()
        {
            if (!currentStats.isAlive) return;

            var eligibleEvents = EventEngine.Instance != null 
                ? EventEngine.Instance.GetEligibleEvents(currentStats) 
                : new List<GameEvent>();

            if (eligibleEvents.Count > 0)
            {
                // Chọn sự kiện có độ ưu tiên cao nhất hoặc ngẫu nhiên
                var selectedEvent = eligibleEvents[0];
                EventEngine.Instance.MarkEventTriggered(selectedEvent.eventId);
                OnEventTriggered?.Invoke(selectedEvent);
            }
        }

        public void AddLog(string entry)
        {
            lifeLog.Add(entry);
            Debug.Log($"[LifeLog] {entry}");
        }
    }
}
