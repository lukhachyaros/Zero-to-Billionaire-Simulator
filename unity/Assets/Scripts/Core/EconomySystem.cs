using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    public enum MacroEconomicCycle
    {
        Boom,       // Hưng thịnh
        Expansion,  // Tăng trưởng ổn định
        Inflation,  // Lạm phát cao
        Recession   // Suy thoái
    }

    [System.Serializable]
    public class AssetDefinition
    {
        public string assetId;
        public string name;
        public string category; // "real_estate", "investment", "business", "vehicle"
        public int tier;
        public long cost;
        public long monthlyPassiveIncome;
        public float annualAppreciationRate;
        public float volatility;
        public int happinessBonus;
        public int socialStatusBonus;
        public string description;
    }

    [System.Serializable]
    public class OwnedAsset
    {
        public string assetId;
        public string name;
        public string category;
        public int tier;
        public int quantity = 1;
        public long totalInvestedCost;
        public long currentUnitValue;
        public long monthlyPassivePerUnit;
    }

    [System.Serializable]
    public class CashflowEntry
    {
        public int age;
        public long delta;
        public string category;
        public string title;
        public long balanceAfter;
    }

    /// <summary>
    /// Quản lý Bất động sản, Danh mục đầu tư, Doanh nghiệp, Chu kỳ kinh tế vĩ mô, Tín dụng Ngân hàng và Sổ dòng tiền.
    /// </summary>
    public class EconomySystem : MonoBehaviour
    {
        public static EconomySystem Instance { get; private set; }

        private readonly List<AssetDefinition> catalog = new List<AssetDefinition>();
        public List<OwnedAsset> portfolio = new List<OwnedAsset>();
        public List<CashflowEntry> cashflowHistory = new List<CashflowEntry>();
        public MacroEconomicCycle currentCycle = MacroEconomicCycle.Expansion;
        public float annualLoanInterestRate = 0.085f;

        [System.Serializable]
        private class AssetListWrapper
        {
            public List<AssetDefinition> items;
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadAssetsFromResources();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void LoadAssetsFromResources()
        {
            if (catalog.Count > 0) return;
            TextAsset asset = Resources.Load<TextAsset>("Data/assets");
            if (asset != null)
            {
                LoadAssetsFromJson(asset.text);
            }
        }

        public void LoadAssetsFromJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return;
            try
            {
                var wrapper = JsonUtility.FromJson<AssetListWrapper>("{\"items\":" + json.Trim() + "}");
                if (wrapper != null && wrapper.items != null)
                {
                    catalog.Clear();
                    catalog.AddRange(wrapper.items);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[EconomySystem] Lỗi đọc danh mục tài sản: {ex.Message}");
            }
        }

        public IReadOnlyList<AssetDefinition> GetCatalog() => catalog;

        public AssetDefinition GetDefinition(string assetId) => catalog.FirstOrDefault(a => a.assetId == assetId);

        public void ResetPortfolio()
        {
            portfolio.Clear();
            cashflowHistory.Clear();
            currentCycle = MacroEconomicCycle.Expansion;
        }

        public void RecordCashflow(int age, long delta, string category, string title, long balanceAfter)
        {
            if (delta == 0) return;
            cashflowHistory.Add(new CashflowEntry
            {
                age = age,
                delta = delta,
                category = category,
                title = title,
                balanceAfter = balanceAfter
            });
            if (cashflowHistory.Count > 120)
            {
                cashflowHistory.RemoveAt(0);
            }
        }

        public long GetTotalPortfolioValue()
        {
            long sum = 0;
            foreach (var item in portfolio)
            {
                sum += item.currentUnitValue * item.quantity;
            }
            return sum;
        }

        public long GetMonthlyPassiveIncome()
        {
            long sum = 0;
            foreach (var item in portfolio)
            {
                sum += item.monthlyPassivePerUnit * item.quantity;
            }
            return sum;
        }

        public int GetHighestRealEstateTier()
        {
            int maxTier = 0;
            foreach (var item in portfolio)
            {
                if (item.category == "real_estate" && item.tier > maxTier)
                {
                    maxTier = item.tier;
                }
            }
            return maxTier;
        }

        public long CalculateNetWorth(CharacterStats stats)
        {
            if (stats == null) return 0;
            return stats.cash + stats.trustFund + GetTotalPortfolioValue() - stats.debt;
        }

        public bool BuyAsset(string assetId, CharacterStats stats, out string message)
        {
            var def = GetDefinition(assetId);
            if (def == null)
            {
                message = "Không tìm thấy tài sản này.";
                return false;
            }
            if (stats.age < 18)
            {
                message = "Bạn cần đủ 18 tuổi để đứng tên giao dịch tài sản.";
                return false;
            }
            if (stats.cash < def.cost)
            {
                message = $"Không đủ tiền mặt! Cần {CharacterStats.FormatVND(def.cost)}.";
                return false;
            }

            stats.cash -= def.cost;
            var existing = portfolio.FirstOrDefault(p => p.assetId == assetId);
            if (existing != null)
            {
                existing.quantity++;
                existing.totalInvestedCost += def.cost;
            }
            else
            {
                portfolio.Add(new OwnedAsset
                {
                    assetId = def.assetId,
                    name = def.name,
                    category = def.category,
                    tier = def.tier,
                    quantity = 1,
                    totalInvestedCost = def.cost,
                    currentUnitValue = def.cost,
                    monthlyPassivePerUnit = def.monthlyPassiveIncome
                });
            }

            stats.happiness += def.happinessBonus;
            stats.socialStatus += def.socialStatusBonus;
            stats.financialLiteracy += 3;
            stats.ClampStats();
            RecordCashflow(stats.age, -def.cost, "asset", $"Mua: {def.name}", stats.cash);

            message = $"🏛️ Giao dịch thành công: Sở hữu {def.name} ({CharacterStats.FormatVND(def.cost)})!";
            return true;
        }

        public bool SellAsset(string assetId, CharacterStats stats, out string message)
        {
            var existing = portfolio.FirstOrDefault(p => p.assetId == assetId);
            if (existing == null || existing.quantity <= 0)
            {
                message = "Bạn chưa sở hữu tài sản này.";
                return false;
            }

            long saleProceeds = existing.currentUnitValue;
            long avgCost = existing.totalInvestedCost / existing.quantity;
            long profit = saleProceeds - avgCost;

            stats.cash += saleProceeds;
            existing.totalInvestedCost -= avgCost;
            existing.quantity--;
            if (existing.quantity <= 0)
            {
                portfolio.Remove(existing);
            }

            stats.financialLiteracy += 2;
            stats.ClampStats();
            RecordCashflow(stats.age, saleProceeds, "asset", $"Bán: {existing.name}", stats.cash);

            string profitLabel = profit >= 0
                ? $"Lãi +{CharacterStats.FormatVND(profit)}"
                : $"Lỗ {CharacterStats.FormatVND(profit)}";
            message = $"💰 Đã bán 1 {existing.name} thu về {CharacterStats.FormatVND(saleProceeds)} ({profitLabel}).";
            return true;
        }

        public long GetMaxLoanLimit(CharacterStats stats)
        {
            long baseCredit = Math.Max(0, CalculateNetWorth(stats) / 2 + stats.monthlyIncome * 24);
            return Math.Max(20_000_000L, baseCredit);
        }

        public bool BorrowLoan(long amount, CharacterStats stats, out string message)
        {
            if (stats.age < 18)
            {
                message = "Chưa đủ 18 tuổi để vay tín dụng ngân hàng.";
                return false;
            }
            long maxLimit = GetMaxLoanLimit(stats);
            if (stats.debt + amount > maxLimit)
            {
                message = $"Vượt hạn mức tín dụng! Tối đa có thể vay tổng cộng {CharacterStats.FormatVND(maxLimit)}.";
                return false;
            }

            stats.cash += amount;
            stats.debt += amount;
            stats.ClampStats();
            RecordCashflow(stats.age, amount, "bank", "Vay vốn ngân hàng", stats.cash);
            message = $"🏦 Giải ngân thành công khoản vay {CharacterStats.FormatVND(amount)} (Lãi suất {annualLoanInterestRate * 100:0.#}%/năm).";
            return true;
        }

        public bool RepayLoan(long amount, CharacterStats stats, out string message)
        {
            if (stats.debt <= 0)
            {
                message = "Bạn hiện không có khoản nợ nào!";
                return false;
            }
            long payAmount = Math.Min(amount, Math.Min(stats.cash, stats.debt));
            if (payAmount <= 0)
            {
                message = "Không đủ tiền mặt để tất toán nợ.";
                return false;
            }

            stats.cash -= payAmount;
            stats.debt -= payAmount;
            stats.stress -= 5;
            stats.ClampStats();
            RecordCashflow(stats.age, -payAmount, "bank", "Tất toán nợ ngân hàng", stats.cash);
            message = $"✅ Đã trả nợ ngân hàng {CharacterStats.FormatVND(payAmount)}. Dư nợ còn lại: {CharacterStats.FormatVND(stats.debt)}.";
            return true;
        }

        public List<string> ProcessAnnualMacroAndPortfolio(CharacterStats stats)
        {
            var logs = new List<string>();
            if (!stats.isAlive) return logs;

            // Chuyển pha kinh tế vĩ mô ngẫu nhiên có trọng số
            float cycleRoll = UnityEngine.Random.value;
            if (cycleRoll < 0.22f) currentCycle = MacroEconomicCycle.Boom;
            else if (cycleRoll < 0.65f) currentCycle = MacroEconomicCycle.Expansion;
            else if (cycleRoll < 0.85f) currentCycle = MacroEconomicCycle.Inflation;
            else currentCycle = MacroEconomicCycle.Recession;

            float macroMultiplier = currentCycle switch
            {
                MacroEconomicCycle.Boom => 1.45f,
                MacroEconomicCycle.Expansion => 1.0f,
                MacroEconomicCycle.Inflation => 0.75f,
                MacroEconomicCycle.Recession => -0.35f,
                _ => 1.0f
            };

            // Tiền tiêu vặt & Quỹ trưởng thành theo từng giai đoạn tuổi thực tế
            if (stats.age >= 6 && stats.age <= 11 && stats.pocketMoneyChild > 0)
            {
                stats.cash += stats.pocketMoneyChild;
                RecordCashflow(stats.age, stats.pocketMoneyChild, "family", "Tiền tiêu vặt tuổi tiểu học", stats.cash);
                logs.Add($"🪙 Tiền tiêu vặt & quà ngoan ngoãn tuổi tiểu học: +{CharacterStats.FormatVND(stats.pocketMoneyChild)}.");
            }
            else if (stats.age >= 12 && stats.age <= 17 && stats.pocketMoneyTeen > 0)
            {
                stats.cash += stats.pocketMoneyTeen;
                RecordCashflow(stats.age, stats.pocketMoneyTeen, "family", "Tiền tiêu vặt học sinh", stats.cash);
                logs.Add($"🎒 Tiền tiêu vặt học sinh năm {stats.age} tuổi: +{CharacterStats.FormatVND(stats.pocketMoneyTeen)}.");
            }
            else if (stats.age == 18)
            {
                if (stats.comingOfAgeGrant > 0)
                {
                    stats.cash += stats.comingOfAgeGrant;
                    RecordCashflow(stats.age, stats.comingOfAgeGrant, "family", "Quỹ hành trang tuổi 18", stats.cash);
                    logs.Add($"🎁 Tròn 18 tuổi! Gia đình trao cho bạn khoản hành trang vào đời: +{CharacterStats.FormatVND(stats.comingOfAgeGrant)}.");
                }
                if (stats.trustFund > 0)
                {
                    long unlocked = stats.trustFund;
                    stats.cash += unlocked;
                    stats.trustFund = 0;
                    RecordCashflow(stats.age, unlocked, "family", "Mở khóa Quỹ Ủy Thác Thừa Kế", stats.cash);
                    logs.Add($"🔓 Quỹ Ủy Thác Thừa Kế đã mở khóa khi bạn đủ 18 tuổi: +{CharacterStats.FormatVND(unlocked)}!");
                }
            }

            if (stats.age >= 18 && stats.age <= 21 && string.IsNullOrEmpty(stats.currentCareerId) && stats.familyAllowancePerYear > 0)
            {
                stats.cash += stats.familyAllowancePerYear;
                RecordCashflow(stats.age, stats.familyAllowancePerYear, "family", "Trợ cấp học tập từ gia đình", stats.cash);
            }

            // Tách dòng tiền thụ động dương & chi phí bảo dưỡng tài sản (xe/du thuyền)
            long posPassiveMonthly = 0;
            long negUpkeepMonthly = 0;
            foreach (var owned in portfolio)
            {
                long line = owned.monthlyPassivePerUnit * owned.quantity;
                if (line >= 0) posPassiveMonthly += line;
                else negUpkeepMonthly += -line;
            }

            // Chỉ tính sinh hoạt phí tỉ lệ thuận khi thực sự có thu nhập; thất nghiệp/đang đi học = 0 đ tránh tụt tiền vô lý
            long grossMonthlyInflow = stats.monthlyIncome + posPassiveMonthly;
            if (stats.age >= 18 && grossMonthlyInflow > 0)
            {
                long rawLiving = (long)(stats.monthlyIncome * 0.28f + posPassiveMonthly * 0.12f) + stats.childrenCount * 1_500_000L;
                long maxLiving = (long)(grossMonthlyInflow * 0.65f);
                stats.monthlyExpense = Math.Min(rawLiving, maxLiving);
            }
            else
            {
                stats.monthlyExpense = 0;
            }

            if (stats.monthlyIncome > 0)
            {
                long annualSalary = stats.monthlyIncome * 12L;
                stats.cash += annualSalary;
                RecordCashflow(stats.age, annualSalary, "salary", $"Lương cả năm ({stats.currentJob})", stats.cash);
            }

            if (posPassiveMonthly > 0)
            {
                long annualPassiveIn = posPassiveMonthly * 12L;
                stats.cash += annualPassiveIn;
                RecordCashflow(stats.age, annualPassiveIn, "passive", "Thu nhập thụ động BĐS, Cổ tức & KD", stats.cash);
            }

            if (stats.monthlyExpense > 0)
            {
                long annualLiving = stats.monthlyExpense * 12L;
                stats.cash -= annualLiving;
                RecordCashflow(stats.age, -annualLiving, "living", "Chi phí sinh hoạt cả năm", stats.cash);
            }

            if (negUpkeepMonthly > 0)
            {
                long annualUpkeep = negUpkeepMonthly * 12L;
                stats.cash -= annualUpkeep;
                RecordCashflow(stats.age, -annualUpkeep, "upkeep", "Bảo dưỡng Xe & Du thuyền", stats.cash);
            }

            // Biến động giá trị danh mục tài sản
            foreach (var owned in portfolio)
            {
                var def = GetDefinition(owned.assetId);
                float baseRate = def != null ? def.annualAppreciationRate : 0.06f;
                float vol = def != null ? def.volatility : 0.05f;

                float skillEdge = (stats.financialLiteracy + stats.businessAcuity) * 0.0004f;
                float randomSwing = UnityEngine.Random.Range(-vol, vol);
                float effectiveGrowth = baseRate >= 0
                    ? (baseRate * macroMultiplier + randomSwing + skillEdge)
                    : (baseRate + randomSwing * 0.5f);

                owned.currentUnitValue = Math.Max(1_000_000L, (long)(owned.currentUnitValue * (1.0f + effectiveGrowth)));
            }

            // Tính lãi vay ngân hàng hàng năm
            if (stats.debt > 0)
            {
                long interest = (long)(stats.debt * annualLoanInterestRate);
                if (stats.cash >= interest)
                {
                    stats.cash -= interest;
                    RecordCashflow(stats.age, -interest, "bank", "Trả lãi vay ngân hàng (8.5%)", stats.cash);
                }
                else
                {
                    long paidFromCash = stats.cash;
                    stats.debt += (interest - paidFromCash);
                    stats.cash = 0;
                    if (paidFromCash > 0)
                    {
                        RecordCashflow(stats.age, -paidFromCash, "bank", "Trả một phần lãi vay ngân hàng", 0);
                    }
                    stats.stress += 10;
                    logs.Add($"⚠️ Không đủ tiền mặt trả lãi vay, dư nợ cộng dồn lên {CharacterStats.FormatVND(stats.debt)}!");
                }
            }

            stats.ClampStats();
            long netWorth = CalculateNetWorth(stats);
            if (netWorth > stats.peakNetWorth)
            {
                stats.peakNetWorth = netWorth;
            }

            return logs;
        }

        public string GetCycleVietnameseName()
        {
            return currentCycle switch
            {
                MacroEconomicCycle.Boom => "📈 Kinh tế Hưng thịnh",
                MacroEconomicCycle.Expansion => "🌤️ Tăng trưởng Ổn định",
                MacroEconomicCycle.Inflation => "🔥 Lạm phát Thắt chặt",
                MacroEconomicCycle.Recession => "🌧️ Suy thoái Phòng thủ",
                _ => "Ổn định"
            };
        }
    }
}
