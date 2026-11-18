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
        public const float ANNUAL_LOAN_RATE = 0.145f;
        public float annualLoanInterestRate = ANNUAL_LOAN_RATE;

        public MacroEconomicCycle RollMacroCycle()
        {
            float cycleRoll = UnityEngine.Random.value;
            if (cycleRoll < 0.18f) currentCycle = MacroEconomicCycle.Boom;
            else if (cycleRoll < 0.56f) currentCycle = MacroEconomicCycle.Expansion;
            else if (cycleRoll < 0.80f) currentCycle = MacroEconomicCycle.Inflation;
            else currentCycle = MacroEconomicCycle.Recession;
            return currentCycle;
        }

        public static float GetMacroMultiplier(MacroEconomicCycle cycle)
        {
            return cycle switch
            {
                MacroEconomicCycle.Boom => 1.40f,
                MacroEconomicCycle.Expansion => 1.00f,
                MacroEconomicCycle.Inflation => 0.70f,
                MacroEconomicCycle.Recession => -0.45f,
                _ => 1.00f
            };
        }

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
                if (Application.isPlaying) DontDestroyOnLoad(gameObject);
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

        public double GetMacroPassiveMultiplier(string category, long monthlyPassivePerUnit)
        {
            if (monthlyPassivePerUnit <= 0) return 1.0;
            if (category == "business")
            {
                return currentCycle switch
                {
                    MacroEconomicCycle.Boom => 1.25,
                    MacroEconomicCycle.Expansion => 1.00,
                    MacroEconomicCycle.Inflation => 0.78,
                    MacroEconomicCycle.Recession => -0.35,
                    _ => 1.00
                };
            }
            if (category == "investment" || category == "real_estate")
            {
                return currentCycle switch
                {
                    MacroEconomicCycle.Boom => 1.15,
                    MacroEconomicCycle.Expansion => 1.00,
                    MacroEconomicCycle.Inflation => 0.85,
                    MacroEconomicCycle.Recession => 0.50,
                    _ => 1.00
                };
            }
            return 1.0;
        }

        public long GetItemMacroMonthlyPassive(OwnedAsset owned)
        {
            if (owned == null) return 0L;
            double mult = GetMacroPassiveMultiplier(owned.category, owned.monthlyPassivePerUnit);
            return (long)Math.Round(owned.monthlyPassivePerUnit * mult);
        }

        public long GetMonthlyPassiveIncome()
        {
            long sum = 0;
            foreach (var item in portfolio)
            {
                sum += GetItemMacroMonthlyPassive(item) * item.quantity;
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
            if (stats == null || !stats.isAlive)
            {
                message = "Nhân vật không thể giao dịch.";
                return false;
            }
            if (stats.age < 18)
            {
                message = "Bạn cần đủ 18 tuổi để đứng tên giao dịch tài sản.";
                return false;
            }

            var existing = portfolio.FirstOrDefault(p => p.assetId == assetId);
            int currentQty = existing != null ? existing.quantity : 0;

            int maxUnits = assetId switch
            {
                "biz_coffee_cart" => 3,
                "biz_milktea_shop" => 3,
                "biz_software_studio" => 3,
                _ => 0
            };
            if (maxUnits > 0 && currentQty >= maxUnits)
            {
                message = $"Bạn đã đạt giới hạn sở hữu tối đa {maxUnits} đơn vị [{def.name}].";
                return false;
            }

            int requiredAcuity = assetId switch
            {
                "biz_milktea_shop" => 35,
                "biz_software_studio" => 55,
                "biz_retail_chain" => 72,
                "biz_unicorn_conglomerate" => 85,
                _ => 0
            };
            if (requiredAcuity > 0 && stats.businessAcuity < requiredAcuity)
            {
                message = $"Cần Nhạy bén Kinh doanh >= {requiredAcuity} để vận hành [{def.name}] (hiện tại: {stats.businessAcuity}).";
                return false;
            }

            if (stats.cash < def.cost)
            {
                message = $"Không đủ tiền mặt! Cần {CharacterStats.FormatVND(def.cost)}.";
                return false;
            }

            stats.cash -= def.cost;
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
            if (stats == null) return 0L;
            long netWorth = CalculateNetWorth(stats);
            if (stats.creditFrozenYears > 0 || stats.debtOverdueYears >= 2 || netWorth < -50_000_000L)
            {
                return 0L;
            }
            long baseCredit = (long)Math.Floor(Math.Max(0L, netWorth) * 0.35) + stats.monthlyIncome * 12L;
            return Math.Max(15_000_000L, baseCredit);
        }

        public bool BorrowLoan(long amount, CharacterStats stats, out string message)
        {
            if (stats == null || !stats.isAlive)
            {
                message = "Nhân vật không thể vay vốn.";
                return false;
            }
            if (amount <= 0)
            {
                message = "Số tiền vay phải lớn hơn 0.";
                return false;
            }
            if (stats.age < 18)
            {
                message = "Chưa đủ 18 tuổi để vay tín dụng ngân hàng.";
                return false;
            }
            if (stats.creditFrozenYears > 0)
            {
                message = $"Tín dụng đang bị đóng băng do phá sản (còn {stats.creditFrozenYears} năm).";
                return false;
            }
            long maxLimit = GetMaxLoanLimit(stats);
            if (maxLimit <= 0)
            {
                message = "Hồ sơ tín dụng bị từ chối do nợ quá hạn hoặc tài sản ròng âm sâu.";
                return false;
            }
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

        public List<string> ProcessAnnualMacroAndPortfolio(
            CharacterStats stats,
            bool rollNewCycle = true,
            bool skipCareerCooldownDecrement = false)
        {
            var logs = new List<string>();
            if (stats == null || !stats.isAlive) return logs;

            // Giảm thời gian đóng băng tín dụng & hạ bậc tuyển dụng mỗi năm (trừ khi vừa bị sa thải trong cùng lượt)
            stats.creditFrozenYears = Math.Max(0, stats.creditFrozenYears - 1);
            if (!skipCareerCooldownDecrement)
            {
                stats.careerCooldownYears = Math.Max(0, stats.careerCooldownYears - 1);
            }

            // Chuyển pha kinh tế vĩ mô ngẫu nhiên có trọng số (nếu chưa roll ở đầu lượt)
            if (rollNewCycle)
            {
                RollMacroCycle();
            }
            float macroMultiplier = GetMacroMultiplier(currentCycle);

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

            bool isHigherEdStudent = stats.educationLevel == "Đại học" || stats.educationLevel == "Học nghề";
            if (stats.age >= 19
                && stats.age <= 21
                && string.IsNullOrEmpty(stats.currentCareerId)
                && isHigherEdStudent
                && stats.cash < 50_000_000L
                && stats.familyAllowancePerYear > 0)
            {
                stats.cash += stats.familyAllowancePerYear;
                RecordCashflow(stats.age, stats.familyAllowancePerYear, "family", "Trợ cấp học tập từ gia đình", stats.cash);
            }

            // Tách dòng tiền thụ động dương (theo chu kỳ vĩ mô) & chi phí vận hành/bảo dưỡng
            long posPassiveMonthly = 0;
            long negBusinessMonthly = 0;
            long negUpkeepMonthly = 0;

            foreach (var owned in portfolio)
            {
                long scaledLine = GetItemMacroMonthlyPassive(owned) * owned.quantity;

                if (scaledLine >= 0) posPassiveMonthly += scaledLine;
                else if (owned.category == "business") negBusinessMonthly += -scaledLine;
                else negUpkeepMonthly += -scaledLine;
            }

            // Sinh hoạt phí thực tế cho người trưởng thành (có sàn tối thiểu kể cả khi thất nghiệp)
            long grossMonthlyInflow = stats.monthlyIncome + posPassiveMonthly;
            if (stats.age >= 18)
            {
                bool ownsHome = GetHighestRealEstateTier() >= 1;
                bool isStudent = stats.age <= 21
                    && string.IsNullOrEmpty(stats.currentCareerId)
                    && (stats.educationLevel == "Đại học" || stats.educationLevel == "Học nghề");

                long baseFloor = isStudent
                    ? ((ownsHome ? 1_000_000L : 1_800_000L) + stats.childrenCount * 2_500_000L)
                    : ((ownsHome ? 2_200_000L : 4_200_000L) + stats.childrenCount * 2_800_000L);

                if (grossMonthlyInflow > 0)
                {
                    double baseRate = (ownsHome ? 0.34 : 0.42) + (currentCycle == MacroEconomicCycle.Inflation ? 0.06 : 0.0);
                    long rawLiving = (long)Math.Round(stats.monthlyIncome * baseRate + posPassiveMonthly * 0.22) + stats.childrenCount * 2_800_000L;
                    long maxLiving = (long)Math.Round(grossMonthlyInflow * 0.85);
                    stats.monthlyExpense = Math.Max(baseFloor, Math.Min(maxLiving, rawLiving));
                }
                else
                {
                    stats.monthlyExpense = baseFloor;
                }
            }
            else
            {
                stats.monthlyExpense = 0;
            }

            long annualSalary = stats.monthlyIncome > 0 ? stats.monthlyIncome * 12L : 0L;
            if (annualSalary > 0)
            {
                stats.cash += annualSalary;
                RecordCashflow(stats.age, annualSalary, "salary", $"Lương cả năm ({stats.currentJob})", stats.cash);
            }

            long annualPassiveIn = posPassiveMonthly > 0 ? posPassiveMonthly * 12L : 0L;
            if (annualPassiveIn > 0)
            {
                stats.cash += annualPassiveIn;
                RecordCashflow(stats.age, annualPassiveIn, "passive", "Thu nhập thụ động BĐS, Cổ tức & KD", stats.cash);
            }

            if (stats.monthlyExpense > 0)
            {
                long annualLiving = stats.monthlyExpense * 12L;
                stats.cash -= annualLiving;
                RecordCashflow(stats.age, -annualLiving, "living", "Thuê nhà & Sinh hoạt phí cả năm", stats.cash);
            }

            // Thuế TNCN & Bảo hiểm bắt buộc lũy tiến khi thu nhập năm > 180 Triệu đ
            long annualTax = 0L;
            long annualGross = grossMonthlyInflow * 12L;
            if (stats.age >= 18 && annualGross > 180_000_000L)
            {
                float baseTaxRate = 0.10f;
                if (annualGross > 2_400_000_000L) baseTaxRate = 0.25f;
                else if (annualGross > 600_000_000L) baseTaxRate = 0.18f;
                float effRate = Math.Max(0.06f, baseTaxRate - stats.financialLiteracy * 0.0008f);
                annualTax = (long)((annualGross - 150_000_000L) * effRate);
                if (annualTax > 0)
                {
                    stats.cash -= annualTax;
                    RecordCashflow(stats.age, -annualTax, "tax", "Thuế TNCN & Bảo hiểm bắt buộc", stats.cash);
                }
            }

            if (negBusinessMonthly > 0)
            {
                long annualBizLoss = negBusinessMonthly * 12L;
                stats.cash -= annualBizLoss;
                RecordCashflow(stats.age, -annualBizLoss, "business", "Lỗ vận hành doanh nghiệp (Suy thoái)", stats.cash);
                logs.Add($"📉 Kinh doanh gặp khó trong suy thoái: lỗ vận hành -{CharacterStats.FormatVND(annualBizLoss)}.");
            }

            if (negUpkeepMonthly > 0)
            {
                long annualUpkeep = negUpkeepMonthly * 12L;
                stats.cash -= annualUpkeep;
                RecordCashflow(stats.age, -annualUpkeep, "upkeep", "Bảo dưỡng Xe & Du thuyền", stats.cash);
            }

            long curPortVal = GetTotalPortfolioValue();
            if (stats.age >= 22 && CalculateNetWorth(stats) >= 1_500_000_000L && curPortVal > 0)
            {
                long assetFee = (long)Math.Round(curPortVal * 0.010);
                if (assetFee > 0)
                {
                    stats.cash -= assetFee;
                    RecordCashflow(stats.age, -assetFee, "upkeep", "Thuế & phí bảo trì cơ ngơi", stats.cash);
                }
            }

            // Biến động giá trị danh mục tài sản
            foreach (var owned in portfolio)
            {
                var def = GetDefinition(owned.assetId);
                float baseRate = def != null ? def.annualAppreciationRate : 0.06f;
                float vol = def != null ? def.volatility : 0.05f;

                float skillEdge = (stats.financialLiteracy + stats.businessAcuity) * 0.00012f;
                float randomSwing = UnityEngine.Random.Range(-vol, vol);
                float effectiveGrowth = baseRate >= 0
                    ? (baseRate * macroMultiplier + randomSwing + skillEdge)
                    : (baseRate + randomSwing * 0.5f);

                owned.currentUnitValue = Math.Max(1_000_000L, (long)(owned.currentUnitValue * (1.0f + effectiveGrowth)));
            }

            // Chuyển tiền mặt âm (nếu có từ sinh hoạt phí/thuế/lỗ KD) sang dư nợ trước khi xét lãi & thu hồi nợ
            stats.ClampStats();

            // Tính lãi vay ngân hàng, quá hạn nợ, cưỡng chế trích thu nhập & phát mãi tài sản (R2)
            if (stats.debt > 0)
            {
                double effectiveLoanRate = Math.Abs(annualLoanInterestRate - ANNUAL_LOAN_RATE) < 1e-6f
                    ? 0.145
                    : (double)annualLoanInterestRate;
                long interest = (long)Math.Round(stats.debt * effectiveLoanRate);
                long creditLimitBefore = GetMaxLoanLimit(stats);
                long netWorthNow = CalculateNetWorth(stats);
                bool delinquent = stats.cash < interest
                    || (creditLimitBefore > 0 && stats.debt > creditLimitBefore * 1.1)
                    || netWorthNow < 0;

                stats.debtOverdueYears = delinquent ? stats.debtOverdueYears + 1 : Math.Max(0, stats.debtOverdueYears - 1);

                if (stats.cash >= interest)
                {
                    stats.cash -= interest;
                    RecordCashflow(stats.age, -interest, "bank", $"Trả lãi vay ngân hàng ({annualLoanInterestRate * 100:0.#}%)", stats.cash);
                }
                else
                {
                    long paidFromCash = Math.Max(0L, stats.cash);
                    stats.debt += (interest - paidFromCash);
                    stats.cash = 0;
                    if (paidFromCash > 0)
                    {
                        RecordCashflow(stats.age, -paidFromCash, "bank", "Trả một phần lãi vay ngân hàng", 0);
                    }
                    stats.stress += 10;
                    logs.Add($"⚠️ Không đủ tiền mặt trả lãi vay ({annualLoanInterestRate * 100:0.#}%), dư nợ cộng dồn lên {CharacterStats.FormatVND(stats.debt)}!");
                }

                // 1) Cưỡng chế trích 30% thu nhập ròng khi nợ quá hạn >= 1 năm
                if (stats.debtOverdueYears >= 1 && stats.debt > 0)
                {
                    long annualNetPositiveInflow = Math.Max(0L, annualSalary + annualPassiveIn - annualTax);
                    long garnishCap = (long)Math.Round(annualNetPositiveInflow * 0.30);
                    long garnishPaid = Math.Min(stats.debt, Math.Min(stats.cash, garnishCap));
                    if (garnishPaid > 0)
                    {
                        stats.cash -= garnishPaid;
                        stats.debt -= garnishPaid;
                        RecordCashflow(stats.age, -garnishPaid, "bank", "Thu hồi nợ: Trích 30% thu nhập", stats.cash);
                    }
                    stats.stress += 10;
                    stats.socialStatus -= 3;
                    logs.Add($"🚨 THU HỒI NỢ (Quá hạn {stats.debtOverdueYears} năm): Ngân hàng siết nợ (khấu trừ {CharacterStats.FormatVND(garnishPaid)} từ dòng tiền).");
                }

                // 2) Phát mãi cưỡng chế tài sản ở mức 80% giá trị khi quá hạn >= 2 năm
                if (stats.debtOverdueYears >= 2 && stats.debt > stats.cash && portfolio.Count > 0)
                {
                    int liquidatedUnits = 0;
                    long totalRecovered = 0;
                    while (stats.debt > 0 && portfolio.Count > 0)
                    {
                        OwnedAsset highest = null;
                        foreach (var item in portfolio)
                        {
                            if (item.quantity <= 0) continue;
                            if (highest == null || item.currentUnitValue > highest.currentUnitValue)
                            {
                                highest = item;
                            }
                        }
                        if (highest == null)
                        {
                            portfolio.RemoveAll(p => p.quantity <= 0);
                            break;
                        }

                        long distressProceeds = Math.Max(1L, (long)Math.Round(highest.currentUnitValue * 0.80));
                        long avgCost = highest.quantity > 0 ? highest.totalInvestedCost / highest.quantity : 0L;
                        highest.totalInvestedCost = Math.Max(0L, highest.totalInvestedCost - avgCost);
                        highest.quantity--;
                        string soldName = highest.name;
                        if (highest.quantity <= 0) portfolio.Remove(highest);

                        long toDebt = Math.Min(stats.debt, distressProceeds);
                        stats.debt -= toDebt;
                        long remainder = distressProceeds - toDebt;
                        if (remainder > 0) stats.cash += remainder;

                        RecordCashflow(stats.age, distressProceeds, "asset", $"Phát mãi tài sản (80%): {soldName}", stats.cash);
                        RecordCashflow(stats.age, -toDebt, "bank", $"Khấu trừ nợ từ phát mãi {soldName}", stats.cash);

                        liquidatedUnits++;
                        totalRecovered += distressProceeds;
                    }

                    if (liquidatedUnits > 0)
                    {
                        stats.stress += 12;
                        stats.socialStatus -= 6;
                        stats.happiness -= 8;
                        logs.Add($"🔨 PHÁT MÃI TÀI SẢN: Ngân hàng cưỡng chế bán {liquidatedUnits} tài sản ở mức 80% giá thị trường thu {CharacterStats.FormatVND(totalRecovered)} để trả nợ!");
                    }
                }
            }
            else if (stats.debtOverdueYears > 0)
            {
                stats.debtOverdueYears = Math.Max(0, stats.debtOverdueYears - 1);
            }

            // 3) Tuyên bố Phá sản (Bankruptcy) nếu mất khả năng thanh toán kéo dài và hết tài sản
            stats.ClampStats();
            long netWorthPostCollection = CalculateNetWorth(stats);
            if (stats.age >= 18
                && portfolio.Count == 0
                && stats.cash <= 0
                && ((stats.debt >= 50_000_000L && stats.debtOverdueYears >= 3)
                    || (netWorthPostCollection <= -150_000_000L && stats.debtOverdueYears >= 2)))
            {
                long wipedDebt = stats.debt;
                stats.bankruptcyCount++;
                stats.debt = 0;
                stats.cash = 0;
                stats.debtOverdueYears = 0;
                stats.creditFrozenYears = 5;

                if (stats.monthlyIncome >= 35_000_000L)
                {
                    stats.currentCareerId = "";
                    stats.currentJob = "Thất nghiệp (Phá sản)";
                    stats.monthlyIncome = 0;
                    stats.yearsInCurrentJob = 0;
                    stats.careerCooldownYears = Math.Max(stats.careerCooldownYears, 2);
                }

                stats.socialStatus -= 30;
                stats.happiness -= 28;
                stats.stress += 22;
                stats.karma -= 8;

                logs.Add($"💥 PHÁ SẢN (Lần {stats.bankruptcyCount}): Mất khả năng thanh toán khoản nợ {CharacterStats.FormatVND(wipedDebt)}! Xóa nợ nhưng đóng băng tín dụng 5 năm.");
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
