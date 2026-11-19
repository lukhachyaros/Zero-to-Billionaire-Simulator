using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using ZeroToBillionaire.Events;
using ZeroToBillionaire.Mobile.iOS;

namespace ZeroToBillionaire.Core
{
    public enum YearlyActivityType
    {
        Exercise,       // Tập thể dục / Chạy bộ
        ReadBooks,      // Đọc sách Tài chính & Tri thức
        Meditate,       // Thiền định / Du lịch chữa lành
        SideHustle,     // Làm thêm ngoài giờ
        Socialize       // Mở rộng quan hệ xã hội
    }

    /// <summary>
    /// Bộ điều phối trung tâm của Zero to Billionaire Simulator:
    /// Kết nối Vòng đời, Sự kiện, Nghề nghiệp, Kinh tế vĩ mô, Quan hệ Gia phả, Cỗ máy thời gian và Lưu tự động.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Character State")]
        public CharacterStats currentStats = new CharacterStats();
        public CharacterStats Stats { get { return currentStats; } }

        [Header("Life Log")]
        public List<string> lifeLog = new List<string>();

        private readonly List<StartingBackground> backgrounds = new List<StartingBackground>();
        private readonly HashSet<string> unlockedMilestones = new HashSet<string>();
        private int activitiesDoneThisYear = 0;
        private const int MAX_ACTIVITIES_PER_YEAR = 2;

        public event Action<int> OnAgeUp;
        public event Action<CharacterStats> OnStatsChanged;
        public event Action<GameEvent> OnEventTriggered;
        public event Action<string> OnMilestoneUnlocked;
        public event Action OnGameOver;

        [System.Serializable]
        private class BackgroundListWrapper
        {
            public List<StartingBackground> items;
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                if (Application.isPlaying) DontDestroyOnLoad(gameObject);
                EnsureSubsystems();
                LoadStartingBackgrounds();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            if (SaveSystem.HasSaveFile())
            {
                var loaded = SaveSystem.LoadFromDisk();
                if (loaded != null && loaded.stats != null && loaded.stats.isAlive)
                {
                    ApplySnapshot(loaded);
                    AddLog($"📂 Chào mừng trở lại, {currentStats.characterName} ({currentStats.age} tuổi)!");
                    NotifyStateUpdated();
                    return;
                }
            }

            StartNewLife("Người chơi", "Nam", "bg_working_class");
        }

        private void EnsureSubsystems()
        {
            if (EventEngine.Instance == null) gameObject.AddComponent<EventEngine>();
            if (CareerSystem.Instance == null) gameObject.AddComponent<CareerSystem>();
            if (EconomySystem.Instance == null) gameObject.AddComponent<EconomySystem>();
            if (RelationshipSystem.Instance == null) gameObject.AddComponent<RelationshipSystem>();
            if (LeaderboardSystem.Instance == null) gameObject.AddComponent<LeaderboardSystem>();
            if (MonetizationSystem.Instance == null) gameObject.AddComponent<MonetizationSystem>();
            if (AdaptiveFrameRateManager.Instance == null) gameObject.AddComponent<AdaptiveFrameRateManager>();
        }

        private void LoadStartingBackgrounds()
        {
            if (backgrounds.Count > 0) return;
            TextAsset bgAsset = Resources.Load<TextAsset>("Data/starting_backgrounds");
            if (bgAsset == null) return;

            try
            {
                var wrapper = JsonUtility.FromJson<BackgroundListWrapper>("{\"items\":" + bgAsset.text.Trim() + "}");
                if (wrapper?.items != null)
                {
                    backgrounds.AddRange(wrapper.items);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[GameManager] Lỗi nạp hoàn cảnh xuất thân: {ex.Message}");
            }
        }

        public IReadOnlyList<StartingBackground> GetStartingBackgrounds() => backgrounds;

        public void StartNewLife(string name, string gender, string backgroundId = "bg_working_class")
        {
            EnsureSubsystems();
            LoadStartingBackgrounds();
            SaveSystem.ClearTimeMachine();
            unlockedMilestones.Clear();
            activitiesDoneThisYear = 0;
            CareerSystem.Instance?.ResetAnnualJobApps();

            var bg = backgrounds.FirstOrDefault(b => b.backgroundId == backgroundId);

            currentStats = new CharacterStats
            {
                generation = 1,
                backgroundId = bg != null ? bg.backgroundId : "bg_working_class",
                backgroundName = bg != null ? bg.name : "Gia Đình Lao Động Bình Dân",
                characterName = string.IsNullOrWhiteSpace(name) ? RelationshipSystem.GenerateVietnameseName(gender) : name,
                gender = gender,
                age = 0,
                isAlive = true,
                health = UnityEngine.Random.Range(82, 96),
                intelligence = UnityEngine.Random.Range(42, 72),
                appearance = UnityEngine.Random.Range(48, 82),
                happiness = 80,
                discipline = 48,
                stress = 5,
                luck = UnityEngine.Random.Range(35, 78),
                charisma = UnityEngine.Random.Range(38, 70),
                cash = 0,
                trustFund = 0,
                pocketMoneyChild = bg != null ? bg.pocketMoneyChild : 80_000L,
                pocketMoneyTeen = bg != null ? bg.pocketMoneyTeen : 400_000L,
                comingOfAgeGrant = bg != null ? bg.comingOfAgeGrant : 3_500_000L,
                familyAllowancePerYear = bg != null ? bg.familyAllowancePerYear : 1_500_000L
            };

            if (bg != null)
            {
                currentStats.ApplyModifiers(bg.statBonuses);
            }
            MonetizationSystem.Instance?.ConsumeReplayAndApplyPerks(currentStats);
            currentStats.ClampStats();

            EconomySystem.Instance?.ResetPortfolio();
            RelationshipSystem.Instance?.InitializeFamilyForNewLife(currentStats);
            LeaderboardSystem.Instance?.ResetRivals();
            EventEngine.Instance?.ResetSessionState(bg?.startingFlags);

            lifeLog.Clear();
            AddLog($"👶 Đời thứ {currentStats.generation}: {currentStats.characterName} ({currentStats.gender}) chào đời trong hoàn cảnh [{currentStats.backgroundName}].");

            NotifyStateUpdated();
            TriggerYearCycle();
            AutoSave();
        }

        public bool TryRequestNewLife(string name, string gender, string backgroundId = "bg_working_class")
        {
            EnsureSubsystems();
            if (MonetizationSystem.Instance != null && !MonetizationSystem.Instance.CanStartNewLifeFree())
            {
                return false;
            }
            StartNewLife(name, gender, backgroundId);
            return true;
        }

        public void RenameCharacter(string newName)
        {
            if (string.IsNullOrWhiteSpace(newName) || currentStats == null) return;
            string cleaned = newName.Trim();
            string oldName = currentStats.characterName;
            currentStats.characterName = cleaned;
            AddLog($"✍️ Đổi tên nhân vật từ \"{oldName}\" thành \"{cleaned}\".");
            NotifyStateUpdated();
            AutoSave();
        }

        public void AgeUp()
        {
            if (!currentStats.isAlive)
            {
                Debug.LogWarning("[GameManager] Nhân vật đã qua đời, hãy lập Di chúc hoặc bắt đầu cuộc đời mới.");
                return;
            }

            // Lưu snapshot cho Cỗ máy thời gian trước khi tăng tuổi
            SaveSystem.PushTimeMachineSnapshot(CaptureSnapshot());
            AdaptiveFrameRateManager.Instance?.WakeUp(2.0f);
            IOSHapticFeedback.TriggerSelection();

            currentStats.age++;
            activitiesDoneThisYear = 0;
            CareerSystem.Instance?.ResetAnnualJobApps();
            currentStats.energy = 100;

            AddLog($"📅 Năm {currentStats.age} tuổi:");

            ProcessAnnualSimulation();

            OnAgeUp?.Invoke(currentStats.age);
            NotifyStateUpdated();

            if (currentStats.isAlive)
            {
                CheckWealthMilestones();
                TriggerYearCycle();
            }

            AutoSave();
        }

        private void ProcessAnnualSimulation()
        {
            MacroEconomicCycle cycle = EconomySystem.Instance != null
                ? EconomySystem.Instance.RollMacroCycle()
                : MacroEconomicCycle.Expansion;

            int prevLayoffs = currentStats.layoffCount;

            // 1. Sự nghiệp & Lương thưởng (nhận pha kinh tế vĩ mô đã roll cho năm nay)
            if (CareerSystem.Instance != null)
            {
                foreach (var msg in CareerSystem.Instance.ProcessAnnualCareerProgress(currentStats, cycle))
                {
                    AddLog(msg);
                }
            }

            bool laidOffThisTurn = currentStats.layoffCount > prevLayoffs;

            // 2. Kinh tế vĩ mô, Bất động sản, Cổ phiếu, Thu hồi nợ, Phá sản & Bảng xếp hạng Phú hào
            if (EconomySystem.Instance != null)
            {
                foreach (var msg in EconomySystem.Instance.ProcessAnnualMacroAndPortfolio(
                    currentStats,
                    rollNewCycle: false,
                    skipCareerCooldownDecrement: laidOffThisTurn))
                {
                    AddLog(msg);
                }

                if (LeaderboardSystem.Instance != null)
                {
                    long netWorthNow = EconomySystem.Instance.CalculateNetWorth(currentStats);
                    string rankMsg = LeaderboardSystem.Instance.ProcessAnnualRivalGrowth(EconomySystem.Instance.currentCycle, netWorthNow);
                    if (!string.IsNullOrEmpty(rankMsg)) AddLog(rankMsg);
                }
            }
            else
            {
                long netIncome = (currentStats.monthlyIncome - currentStats.monthlyExpense) * 12L;
                currentStats.cash += netIncome;
            }

            // 3. Gia đình & Tuổi tác của người thân
            RelationshipSystem.Instance?.ProcessAnnualAging(currentStats, AddLog);

            // 4. Sức khỏe, Căng thẳng & Lão hóa tự nhiên
            if (currentStats.stress >= 85)
            {
                currentStats.health -= 6;
                currentStats.happiness -= 8;
                AddLog("⚠️ Căng thẳng kéo dài quá mức đang bào mòn sức khỏe của bạn!");
            }

            if (currentStats.age > 50)
            {
                int baseDecay = currentStats.age > 75 ? UnityEngine.Random.Range(3, 8) : UnityEngine.Random.Range(1, 4);
                currentStats.health -= baseDecay;
            }

            // Xác suất qua đời tuổi bách niên giai lão
            if (currentStats.age >= 85 && UnityEngine.Random.value < (currentStats.age - 80) * 0.04f)
            {
                currentStats.health = 0;
                currentStats.causeOfDeath = "Ra đi thanh thản trong giấc ngủ ở tuổi đại thọ bên con cháu";
            }

            currentStats.ClampStats();

            if (!currentStats.isAlive)
            {
                long finalNetWorth = EconomySystem.Instance != null
                    ? EconomySystem.Instance.CalculateNetWorth(currentStats)
                    : currentStats.cash - currentStats.debt;

                AddLog($"🪦 {currentStats.characterName} đã khép lại hành trình ở tuổi {currentStats.age} ({currentStats.causeOfDeath}). Tổng di sản ròng: {CharacterStats.FormatVND(finalNetWorth)}.");
                IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Warning);
                OnGameOver?.Invoke();
            }
        }

        public bool PerformYearlyActivity(YearlyActivityType activity, out string resultMessage)
        {
            if (!currentStats.isAlive)
            {
                resultMessage = "Nhân vật đã qua đời.";
                return false;
            }
            if (currentStats.age < 6)
            {
                resultMessage = "Bạn cần ít nhất 6 tuổi để tự thực hiện hoạt động rèn luyện.";
                return false;
            }
            if (activitiesDoneThisYear >= MAX_ACTIVITIES_PER_YEAR)
            {
                resultMessage = $"Bạn đã thực hiện tối đa {MAX_ACTIVITIES_PER_YEAR} hoạt động phụ trong năm nay. Hãy bấm +1 Tuổi!";
                return false;
            }

            activitiesDoneThisYear++;
            IOSHapticFeedback.TriggerImpact(IOSHapticFeedback.HapticImpactType.Light);

            switch (activity)
            {
                case YearlyActivityType.Exercise:
                    currentStats.health += 6;
                    currentStats.appearance += 3;
                    currentStats.stress -= 8;
                    resultMessage = "🏃 Tập luyện thể thao đều đặn giúp cơ thể khỏe khoắn (+6 Sức khỏe, -8 Stress).";
                    break;

                case YearlyActivityType.ReadBooks:
                    currentStats.intelligence += 4;
                    currentStats.financialLiteracy += 5;
                    currentStats.businessAcuity += 3;
                    resultMessage = "📚 Đọc sách tinh hoa giúp mở rộng tư duy (+4 Trí tuệ, +5 Tài chính).";
                    break;

                case YearlyActivityType.Meditate:
                    currentStats.stress -= 16;
                    currentStats.happiness += 8;
                    currentStats.karma += 3;
                    resultMessage = "🧘 Thiền định giúp tâm trí bình an sáng suốt (-16 Stress, +8 Hạnh phúc).";
                    break;

                case YearlyActivityType.SideHustle:
                    if (currentStats.age < 16)
                    {
                        activitiesDoneThisYear--;
                        resultMessage = "Cần đủ 16 tuổi để nhận việc làm thêm ngoài giờ.";
                        return false;
                    }
                    long earned = Math.Min(3_500_000L, 550_000L + (currentStats.practicalSkills + currentStats.intelligence) * 18_000L);
                    currentStats.cash += earned;
                    EconomySystem.Instance?.RecordCashflow(currentStats.age, earned, "salary", "Làm dự án tự do ngoài giờ", currentStats.cash);
                    currentStats.practicalSkills += 4;
                    currentStats.stress += 14;
                    currentStats.health -= 4;
                    resultMessage = $"💻 Nhận dự án làm thêm ngoài giờ kiếm được +{CharacterStats.FormatVND(earned)}!";
                    break;

                default:
                    currentStats.charisma += 5;
                    currentStats.socialStatus += 3;
                    currentStats.happiness += 5;
                    resultMessage = "🤝 Giao lưu gặp gỡ giúp mở rộng mạng lưới quan hệ chất lượng (+5 Giao tiếp).";
                    break;
            }

            currentStats.ClampStats();
            AddLog(resultMessage);
            NotifyStateUpdated();
            return true;
        }

        private const int FREE_REWIND_LIMIT = 5;

        /// <summary>
        /// Cỗ Máy Thời Gian: Tối đa 5 lần miễn phí mỗi đời; từ lần thứ 6 phải đánh đổi một khoản tài sản lớn.
        /// </summary>
        public bool UseTimeMachine(int yearsBack = 1)
        {
            int usedBefore = currentStats != null ? currentStats.rewindsUsed : 0;
            long preRewindWealth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(currentStats)
                : (currentStats.cash + currentStats.trustFund - currentStats.debt);

            var snapshot = SaveSystem.PopTimeMachineSnapshot(yearsBack);
            if (snapshot == null) return false;

            long postRewindWealth = snapshot.stats.cash + snapshot.stats.trustFund - snapshot.stats.debt;
            if (snapshot.portfolio != null)
            {
                foreach (var a in snapshot.portfolio) postRewindWealth += a.currentUnitValue * a.quantity;
            }

            long rewindFee = 0L;
            if (usedBefore >= FREE_REWIND_LIMIT)
            {
                int extraIdx = usedBefore - FREE_REWIND_LIMIT + 1;
                long refWealth = Math.Max(preRewindWealth, postRewindWealth);
                double pct = Math.Min(0.75, 0.15 + extraIdx * 0.10);
                rewindFee = Math.Max(100_000_000L * extraIdx, (long)Math.Round(refWealth * pct));
                if (postRewindWealth < rewindFee)
                {
                    SaveSystem.PushTimeMachineSnapshot(snapshot);
                    AddLog($"⚠️ Không đủ tài sản để lùi tuổi lần #{usedBefore + 1}! Cần {CharacterStats.FormatVND(rewindFee)}.");
                    return false;
                }
            }

            ApplySnapshot(snapshot);
            currentStats.rewindsUsed = usedBefore + 1;

            if (rewindFee > 0L)
            {
                long remaining = rewindFee;
                long fromCash = Math.Min(currentStats.cash, remaining);
                currentStats.cash -= fromCash;
                remaining -= fromCash;

                if (remaining > 0L && currentStats.trustFund > 0L)
                {
                    long fromTrust = Math.Min(currentStats.trustFund, remaining);
                    currentStats.trustFund -= fromTrust;
                    remaining -= fromTrust;
                }

                if (remaining > 0L && EconomySystem.Instance != null)
                {
                    var port = EconomySystem.Instance.portfolio;
                    for (int i = port.Count - 1; i >= 0 && remaining > 0L; i--)
                    {
                        while (port[i].quantity > 0 && remaining > 0L)
                        {
                            long unitVal = port[i].currentUnitValue;
                            port[i].quantity -= 1;
                            if (unitVal > remaining)
                            {
                                currentStats.cash += (unitVal - remaining);
                                remaining = 0L;
                            }
                            else
                            {
                                remaining -= unitVal;
                            }
                        }
                        if (port[i].quantity <= 0) port.RemoveAt(i);
                    }
                }

                currentStats.ClampStats();
                AddLog($"⏳ Cỗ Máy Thời Gian lần #{currentStats.rewindsUsed} (vượt mốc 5 lần): Đã khấu trừ {CharacterStats.FormatVND(rewindFee)} từ tài sản để quay về năm {currentStats.age} tuổi!");
            }
            else
            {
                int freeLeft = FREE_REWIND_LIMIT - currentStats.rewindsUsed;
                AddLog($"⏪ Cỗ Máy Thời Gian kích hoạt! Quay lại năm {currentStats.age} tuổi (còn {freeLeft}/{FREE_REWIND_LIMIT} lượt miễn phí).");
            }

            IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Success);
            NotifyStateUpdated();
            AutoSave();
            return true;
        }

        /// <summary>
        /// Thừa kế Gia tộc: Chơi tiếp bằng người con đã chọn sau khi qua đời.
        /// </summary>
        public bool ContinueDynastyWithChild(string childNpcId = "")
        {
            if (RelationshipSystem.Instance == null) return false;
            var livingChildren = RelationshipSystem.Instance.GetLivingChildren();
            if (livingChildren.Count == 0) return false;

            var chosen = string.IsNullOrEmpty(childNpcId)
                ? livingChildren[0]
                : (livingChildren.FirstOrDefault(c => c.npcId == childNpcId) ?? livingChildren[0]);

            bool hasTrust = EventEngine.Instance != null && EventEngine.Instance.HasFlag("family_trust_protected");
            bool hasElite = EventEngine.Instance != null && EventEngine.Instance.HasFlag("heir_elite_trained");
            long parentNetWorth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(currentStats)
                : (currentStats.cash + currentStats.trustFund - currentStats.debt);

            var heirStats = RelationshipSystem.Instance.CreateHeirStats(currentStats, chosen, hasTrust, hasElite, parentNetWorth);
            currentStats = heirStats;

            if (EconomySystem.Instance != null)
            {
                EconomySystem.Instance.cashflowHistory.Clear();
                if (currentStats.cash > 0)
                {
                    EconomySystem.Instance.RecordCashflow(
                        currentStats.age,
                        currentStats.cash,
                        "family",
                        $"Thừa kế tiền mặt đời thứ {currentStats.generation}",
                        currentStats.cash
                    );
                }
            }

            RelationshipSystem.Instance.InitializeFamilyForNewLife(currentStats);
            EventEngine.Instance?.ResetSessionState(new[] { "dynasty_heir" });
            SaveSystem.ClearTimeMachine();
            activitiesDoneThisYear = 0;
            CareerSystem.Instance?.ResetAnnualJobApps();

            AddLog($"👑 GIA PHẢ TRUYỀN ĐỜI: {currentStats.characterName} (Đời thứ {currentStats.generation}, {currentStats.age} tuổi) chính thức kế thừa cơ nghiệp gia tộc!");
            IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Success);
            NotifyStateUpdated();
            AutoSave();
            return true;
        }

        private void CheckWealthMilestones()
        {
            long netWorth = EconomySystem.Instance != null
                ? EconomySystem.Instance.CalculateNetWorth(currentStats)
                : currentStats.cash - currentStats.debt;

            CheckSingleMilestone("ms_100m", netWorth >= 100_000_000L, "🏅 Cột mốc: Chạm mốc 100 Triệu VNĐ đầu tiên!");
            CheckSingleMilestone("ms_1b", netWorth >= 1_000_000_000L, "🏆 Cột mốc: Trở thành Tỷ phú VNĐ (1 Tỷ đồng)!");
            CheckSingleMilestone("ms_100b", netWorth >= 100_000_000_000L, "💎 Cột mốc: Đại gia Trăm Tỷ vang danh thương trường!");
            CheckSingleMilestone("ms_25000b", netWorth >= 25_000_000_000_000L, "👑 HUYỀN THOẠI: Đạt 25.000 Tỷ VNĐ (~1 Tỷ USD) — TỶ PHÚ ĐÔ LA THẾ GIỚI!");
        }

        private void CheckSingleMilestone(string id, bool condition, string title)
        {
            if (condition && !unlockedMilestones.Contains(id))
            {
                unlockedMilestones.Add(id);
                AddLog(title);
                IOSHapticFeedback.TriggerNotification(IOSHapticFeedback.HapticNotificationType.Success);
                OnMilestoneUnlocked?.Invoke(title);
            }
        }

        private void TriggerYearCycle()
        {
            if (!currentStats.isAlive || EventEngine.Instance == null) return;

            var selectedEvent = EventEngine.Instance.SelectNextEventForYear(currentStats);
            if (selectedEvent != null)
            {
                OnEventTriggered?.Invoke(selectedEvent);
            }
        }

        public GameSnapshot CaptureSnapshot()
        {
            return new GameSnapshot
            {
                stats = currentStats.DeepCopy(),
                portfolio = EconomySystem.Instance != null
                    ? EconomySystem.Instance.portfolio.Select(a => JsonUtility.FromJson<OwnedAsset>(JsonUtility.ToJson(a))).ToList()
                    : new List<OwnedAsset>(),
                relationships = RelationshipSystem.Instance != null
                    ? RelationshipSystem.Instance.relationships.Select(r => JsonUtility.FromJson<NpcRelationship>(JsonUtility.ToJson(r))).ToList()
                    : new List<NpcRelationship>(),
                triggeredEvents = EventEngine.Instance != null ? EventEngine.Instance.GetTriggeredEventIds() : new List<string>(),
                unlockedFlags = EventEngine.Instance != null ? EventEngine.Instance.GetUnlockedFlags() : new List<string>(),
                lifeLog = new List<string>(lifeLog),
                macroCycle = EconomySystem.Instance != null ? EconomySystem.Instance.currentCycle.ToString() : "Expansion",
                jobAppsThisYear = CareerSystem.Instance != null ? CareerSystem.Instance.JobAppsThisYear : 0,
                activitiesDoneThisYear = activitiesDoneThisYear
            };
        }

        public void ApplySnapshot(GameSnapshot snapshot)
        {
            if (snapshot == null || snapshot.stats == null) return;
            currentStats = snapshot.stats.DeepCopy();
            currentStats.layoffCount = Math.Max(0, currentStats.layoffCount);
            currentStats.debtOverdueYears = Math.Max(0, currentStats.debtOverdueYears);
            currentStats.bankruptcyCount = Math.Max(0, currentStats.bankruptcyCount);
            currentStats.creditFrozenYears = Math.Max(0, currentStats.creditFrozenYears);
            currentStats.careerCooldownYears = Math.Max(0, currentStats.careerCooldownYears);
            currentStats.currentCareerId ??= "";
            currentStats.currentJob ??= "Tự do / Chưa có việc";
            currentStats.ClampStats();

            if (EconomySystem.Instance != null)
            {
                EconomySystem.Instance.portfolio = snapshot.portfolio ?? new List<OwnedAsset>();
                EconomySystem.Instance.currentCycle = Enum.TryParse(snapshot.macroCycle, out MacroEconomicCycle parsedCycle)
                    ? parsedCycle
                    : MacroEconomicCycle.Expansion;
            }
            if (RelationshipSystem.Instance != null)
            {
                RelationshipSystem.Instance.relationships = snapshot.relationships ?? new List<NpcRelationship>();
            }
            CareerSystem.Instance?.RestoreJobApps(snapshot.jobAppsThisYear);
            activitiesDoneThisYear = Math.Max(0, snapshot.activitiesDoneThisYear);
            EventEngine.Instance?.RestoreSessionState(snapshot.triggeredEvents, snapshot.unlockedFlags);
            lifeLog = snapshot.lifeLog != null ? new List<string>(snapshot.lifeLog) : new List<string>();
        }

        public void AutoSave()
        {
            SaveSystem.SaveToDisk(CaptureSnapshot());
        }

        public void NotifyStateUpdated()
        {
            OnStatsChanged?.Invoke(currentStats);
        }

        public void AddLog(string entry)
        {
            lifeLog.Add(entry);
            if (lifeLog.Count > 250)
            {
                lifeLog.RemoveAt(0);
            }
            Debug.Log($"[LifeLog] {entry}");
        }
    }
}
