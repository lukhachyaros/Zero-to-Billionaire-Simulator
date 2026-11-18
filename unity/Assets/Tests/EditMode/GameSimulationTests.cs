using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Events;

namespace ZeroToBillionaire.Tests
{
    public class GameSimulationTests
    {
        private readonly List<GameObject> spawnedObjects = new List<GameObject>();

        private T CreateTestComponent<T>(string name) where T : Component
        {
            var go = new GameObject(name);
            spawnedObjects.Add(go);
            return go.AddComponent<T>();
        }

        [TearDown]
        public void TearDown()
        {
            foreach (var go in spawnedObjects)
            {
                if (go != null)
                {
                    Object.DestroyImmediate(go);
                }
            }
            spawnedObjects.Clear();

            PlayerPrefs.DeleteKey("ztb_lives_started");
            PlayerPrefs.DeleteKey("ztb_replay_tickets");
            PlayerPrefs.DeleteKey("ztb_starter_left");
            PlayerPrefs.DeleteKey("ztb_ad_bonus");
            PlayerPrefs.DeleteKey("ztb_vip_forever");
        }

        [Test]
        public void CharacterStats_ClampsAndTransfersNegativeCashToDebt()
        {
            var stats = new CharacterStats
            {
                health = 120,
                happiness = -10,
                cash = 10_000_000L,
                debt = 0
            };

            stats.ApplyModifiers(new StatModifiers
            {
                cash = -25_000_000L,
                intelligence = 30
            });

            Assert.AreEqual(100, stats.health);
            Assert.AreEqual(0, stats.happiness);
            Assert.AreEqual(0L, stats.cash);
            Assert.AreEqual(15_000_000L, stats.debt);
        }

        [Test]
        public void CharacterStats_FormatVND_FormatsReadableVietnameseUnits()
        {
            Assert.AreEqual("500,000 đ", CharacterStats.FormatVND(500_000L));
            Assert.IsTrue(CharacterStats.FormatVND(25_000_000L).Contains("Triệu"));
            Assert.IsTrue(CharacterStats.FormatVND(3_500_000_000L).Contains("Tỷ"));
            Assert.IsTrue(CharacterStats.FormatVND(25_000_000_000_000L).Contains("Nghìn Tỷ"));
        }

        [Test]
        public void EventEngine_NormalizesLegacyJsonAndEvaluatesFormulas()
        {
            var go = new GameObject("TestEventEngine");
            var engine = go.AddComponent<EventEngine>();

            string legacyJson = @"[
              {
                ""eventId"": ""test_legacy_01"",
                ""title"": ""Test Event"",
                ""minAge"": 18,
                ""maxAge"": 18,
                ""priority"": 99,
                ""conditions"": [{ ""field"": ""age"", ""operator"": ""=="", ""value"": 18 }],
                ""options"": [{
                  ""id"": ""opt_1"",
                  ""label"": ""Chon A"",
                  ""outcomes"": [{
                    ""probability"": 1.0,
                    ""condition"": ""intelligence >= 60"",
                    ""message"": ""Thanh cong"",
                    ""statModifiers"": { ""money"": 5000000 }
                  }]
                }]
              }
            ]";

            engine.LoadEventsFromJson(legacyJson);
            var stats = new CharacterStats { age = 18, intelligence = 70, cash = 0 };

            Assert.IsTrue(engine.EvaluateFormula("intelligence >= 60", stats));
            var eligible = engine.GetEligibleEvents(stats);
            Assert.IsTrue(eligible.Exists(e => e.eventId == "test_legacy_01"));

            var evt = eligible.Find(e => e.eventId == "test_legacy_01");
            engine.ResolveOption(evt.options[0], stats);
            Assert.AreEqual(5_000_000L, stats.cash);

            Object.DestroyImmediate(go);
        }

        [Test]
        public void CareerSystem_LayoffTriggersDuringRecession_GrantsSeveranceAndSetsCooldown()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_Layoff");
            var career = CreateTestComponent<CareerSystem>("TestCareer_Layoff");

            career.LoadCareersFromJson(@"[
              {
                ""careerId"": ""job_junior_dev"",
                ""title"": ""Lập trình viên Junior"",
                ""sector"": ""tech"",
                ""minAge"": 20,
                ""maxAge"": 65,
                ""requiredEducation"": ""THPT"",
                ""minIntelligence"": 40,
                ""minDiscipline"": 30,
                ""minCharisma"": 20,
                ""monthlySalary"": 14000000,
                ""annualRaiseRate"": 0.05,
                ""annualStressDelta"": 5,
                ""promotionCareerId"": """",
                ""yearsForPromotion"": 0,
                ""description"": ""Test""
              }
            ]");

            UnityEngine.Random.InitState(12345);
            var stats = new CharacterStats
            {
                age = 26,
                isAlive = true,
                discipline = 40,
                stress = 85,
                health = 30,
                cash = 0,
                currentCareerId = "job_junior_dev",
                currentJob = "Lập trình viên Junior",
                monthlyIncome = 14_000_000L,
                yearsInCurrentJob = 1
            };

            bool fired = false;
            for (int i = 0; i < 50; i++)
            {
                career.ProcessAnnualCareerProgress(stats, MacroEconomicCycle.Recession);
                if (stats.layoffCount > 0)
                {
                    fired = true;
                    break;
                }
                stats.yearsInCurrentJob = 1;
                stats.monthlyIncome = 14_000_000L;
            }

            Assert.IsTrue(fired);
            Assert.AreEqual("", stats.currentCareerId);
            Assert.AreEqual("Thất nghiệp (Bị sa thải)", stats.currentJob);
            Assert.AreEqual(0L, stats.monthlyIncome);
            Assert.AreEqual(0, stats.yearsInCurrentJob);
            Assert.AreEqual(1, stats.careerCooldownYears);
            Assert.AreEqual(14_000_000L, stats.cash);

            // Kiểm tra không nhận trợ cấp khi kỷ luật < 40 hoặc thâm niên < 2 năm
            var lowTenureStats = new CharacterStats
            {
                age = 25,
                isAlive = true,
                discipline = 20,
                stress = 90,
                health = 25,
                cash = 0,
                currentCareerId = "job_junior_dev",
                currentJob = "Lập trình viên Junior",
                monthlyIncome = 14_000_000L,
                yearsInCurrentJob = 0
            };

            bool firedNoSev = false;
            for (int i = 0; i < 50; i++)
            {
                career.ProcessAnnualCareerProgress(lowTenureStats, MacroEconomicCycle.Recession);
                if (lowTenureStats.layoffCount > 0)
                {
                    firedNoSev = true;
                    break;
                }
                lowTenureStats.yearsInCurrentJob = 0;
                lowTenureStats.monthlyIncome = 14_000_000L;
            }

            Assert.IsTrue(firedNoSev);
            Assert.AreEqual(0L, lowTenureStats.cash);

            // Kiểm tra bảo toàn careerCooldownYears khi EconomySystem chạy cùng lượt bị sa thải
            lowTenureStats.careerCooldownYears = 1;
            economy.ProcessAnnualMacroAndPortfolio(lowTenureStats, rollNewCycle: false, skipCareerCooldownDecrement: true);
            Assert.AreEqual(1, lowTenureStats.careerCooldownYears);
        }

        [Test]
        public void EconomySystem_DebtCollection_InterestGarnishmentForcedLiquidationAndCreditFreeze()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_Debt");
            economy.LoadAssetsFromJson(@"[
              { ""assetId"": ""biz_coffee_cart"", ""name"": ""Xe cà phê"", ""category"": ""business"", ""tier"": 1, ""cost"": 55000000, ""monthlyPassiveIncome"": 0, ""annualAppreciationRate"": 0.0, ""volatility"": 0.0, ""happinessBonus"": 0, ""socialStatusBonus"": 0, ""description"": ""Test"" },
              { ""assetId"": ""re_studio_apt"", ""name"": ""Căn hộ Studio"", ""category"": ""real_estate"", ""tier"": 1, ""cost"": 1350000000, ""monthlyPassiveIncome"": 0, ""annualAppreciationRate"": 0.0, ""volatility"": 0.0, ""happinessBonus"": 0, ""socialStatusBonus"": 0, ""description"": ""Test"" }
            ]");

            // Phần A: Lãi 14.5%, tăng debtOverdueYears và trích 30% thu nhập ròng
            var garnishStats = new CharacterStats
            {
                age = 28,
                isAlive = true,
                debt = 100_000_000L,
                cash = 0,
                monthlyIncome = 10_000_000L,
                debtOverdueYears = 0,
                stress = 10,
                socialStatus = 50
            };
            economy.currentCycle = MacroEconomicCycle.Expansion;
            economy.ProcessAnnualMacroAndPortfolio(garnishStats, rollNewCycle: false);

            Assert.AreEqual(1, garnishStats.debtOverdueYears);
            Assert.AreEqual(64_000_000L, garnishStats.debt);
            Assert.AreEqual(19_100_000L, garnishStats.cash);
            Assert.Greater(garnishStats.stress, 10);
            Assert.Less(garnishStats.socialStatus, 50);

            // Phần B: Phát mãi cưỡng chế ở mức 80% giá thị trường, ưu tiên tài sản giá cao nhất trước
            economy.portfolio.Clear();
            economy.portfolio.Add(new OwnedAsset
            {
                assetId = "biz_coffee_cart",
                name = "Xe cà phê",
                category = "business",
                tier = 1,
                quantity = 1,
                totalInvestedCost = 55_000_000L,
                currentUnitValue = 55_000_000L,
                monthlyPassivePerUnit = 0
            });
            economy.portfolio.Add(new OwnedAsset
            {
                assetId = "re_studio_apt",
                name = "Căn hộ Studio",
                category = "real_estate",
                tier = 1,
                quantity = 1,
                totalInvestedCost = 1_350_000_000L,
                currentUnitValue = 1_350_000_000L,
                monthlyPassivePerUnit = 0
            });

            var liqStats = new CharacterStats
            {
                age = 30,
                isAlive = true,
                cash = 0,
                debt = 800_000_000L,
                debtOverdueYears = 2,
                monthlyIncome = 0
            };
            economy.currentCycle = MacroEconomicCycle.Expansion;
            economy.ProcessAnnualMacroAndPortfolio(liqStats, rollNewCycle: false);

            Assert.AreEqual(0L, liqStats.debt);
            Assert.Greater(liqStats.cash, 0L);
            Assert.AreEqual(1, economy.portfolio.Count);
            Assert.AreEqual("biz_coffee_cart", economy.portfolio[0].assetId);

            // Phần C: Đóng băng tín dụng chặn vay mới
            liqStats.creditFrozenYears = 2;
            Assert.AreEqual(0L, economy.GetMaxLoanLimit(liqStats));
            Assert.IsFalse(economy.BorrowLoan(10_000_000L, liqStats, out _));
        }

        [Test]
        public void EconomySystem_Bankruptcy_ResetsDebtFreezesCreditDropsExecJobAndKeepsAlive()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_Bankruptcy");
            economy.portfolio.Clear();

            var stats = new CharacterStats
            {
                age = 32,
                isAlive = true,
                health = 80,
                cash = 0,
                debt = 5_000_000_000L,
                debtOverdueYears = 2,
                currentCareerId = "job_cto_tech",
                currentJob = "Giám đốc Công nghệ",
                monthlyIncome = 40_000_000L,
                socialStatus = 60,
                happiness = 60,
                stress = 20,
                karma = 50
            };

            economy.currentCycle = MacroEconomicCycle.Expansion;
            economy.ProcessAnnualMacroAndPortfolio(stats, rollNewCycle: false);

            Assert.AreEqual(1, stats.bankruptcyCount);
            Assert.AreEqual(0L, stats.debt);
            Assert.AreEqual(0L, stats.cash);
            Assert.AreEqual(0, stats.debtOverdueYears);
            Assert.AreEqual(5, stats.creditFrozenYears);
            Assert.AreEqual("", stats.currentCareerId);
            Assert.AreEqual("Thất nghiệp (Phá sản)", stats.currentJob);
            Assert.AreEqual(0L, stats.monthlyIncome);
            Assert.AreEqual(2, stats.careerCooldownYears);
            Assert.LessOrEqual(stats.socialStatus, 30);
            Assert.LessOrEqual(stats.happiness, 32);
            Assert.AreEqual(42, stats.karma);
            Assert.IsTrue(stats.isAlive);
        }

        [Test]
        public void EconomySystem_EarlyGame_FamilyAllowanceStudentGate_And_UnemployedLivingFloor()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_EarlyGame");
            economy.currentCycle = MacroEconomicCycle.Expansion;

            // Sinh viên đại học tuổi 19, thất nghiệp, cash < 50M -> được trợ cấp và áp dụng sàn sinh hoạt sinh viên (1.8M/tháng)
            var student = new CharacterStats
            {
                age = 19,
                isAlive = true,
                educationLevel = "Đại học",
                currentCareerId = "",
                cash = 30_000_000L,
                familyAllowancePerYear = 1_500_000L,
                monthlyIncome = 0
            };
            economy.ProcessAnnualMacroAndPortfolio(student, rollNewCycle: false);
            Assert.AreEqual(1_800_000L, student.monthlyExpense);
            Assert.AreEqual(30_000_000L + 1_500_000L - 1_800_000L * 12L, student.cash);

            // Người tốt nghiệp THPT không học nghề/đại học không nhận trợ cấp, chịu sàn người lớn (4.2M/tháng)
            var nonStudent = new CharacterStats
            {
                age = 19,
                isAlive = true,
                educationLevel = "THPT",
                currentCareerId = "",
                cash = 60_000_000L,
                familyAllowancePerYear = 1_500_000L,
                monthlyIncome = 0
            };
            economy.ProcessAnnualMacroAndPortfolio(nonStudent, rollNewCycle: false);
            Assert.AreEqual(4_200_000L, nonStudent.monthlyExpense);
            Assert.AreEqual(60_000_000L - 4_200_000L * 12L, nonStudent.cash);

            // Sinh viên nhưng cash >= 50M không nhận trợ cấp học tập
            var richStudent = new CharacterStats
            {
                age = 20,
                isAlive = true,
                educationLevel = "Học nghề",
                currentCareerId = "",
                cash = 55_000_000L,
                familyAllowancePerYear = 1_500_000L,
                monthlyIncome = 0
            };
            economy.ProcessAnnualMacroAndPortfolio(richStudent, rollNewCycle: false);
            Assert.AreEqual(1_800_000L, richStudent.monthlyExpense);
            Assert.AreEqual(55_000_000L - 1_800_000L * 12L, richStudent.cash);
        }

        [Test]
        public void GameManager_SideHustle_EnforcesAge16AndCappedPayout()
        {
            var gm = CreateTestComponent<GameManager>("TestGM_SideHustle");
            gm.currentStats = new CharacterStats
            {
                age = 15,
                isAlive = true,
                practicalSkills = 20,
                intelligence = 30,
                stress = 10,
                health = 90,
                cash = 0
            };

            Assert.IsFalse(gm.PerformYearlyActivity(YearlyActivityType.SideHustle, out _));

            gm.currentStats.age = 16;
            Assert.IsTrue(gm.PerformYearlyActivity(YearlyActivityType.SideHustle, out _));
            Assert.AreEqual(1_450_000L, gm.currentStats.cash);
            Assert.AreEqual(24, gm.currentStats.stress);
            Assert.AreEqual(86, gm.currentStats.health);

            // Trần tối đa 3.5M
            gm.currentStats.practicalSkills = 100;
            gm.currentStats.intelligence = 100;
            gm.currentStats.cash = 0;
            Assert.IsTrue(gm.PerformYearlyActivity(YearlyActivityType.SideHustle, out _));
            Assert.AreEqual(3_500_000L, gm.currentStats.cash);
        }

        [Test]
        public void EconomySystem_BuyAsset_EnforcesBusinessAcuityAndMax3Cap()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_BuyAsset");
            economy.LoadAssetsFromJson(@"[
              { ""assetId"": ""biz_coffee_cart"", ""name"": ""Xe cà phê"", ""category"": ""business"", ""tier"": 1, ""cost"": 55000000, ""monthlyPassiveIncome"": 900000, ""annualAppreciationRate"": 0.02, ""volatility"": 0.05, ""happinessBonus"": 1, ""socialStatusBonus"": 1, ""description"": ""Test"" },
              { ""assetId"": ""biz_milktea_shop"", ""name"": ""Quán trà sữa"", ""category"": ""business"", ""tier"": 2, ""cost"": 450000000, ""monthlyPassiveIncome"": 6500000, ""annualAppreciationRate"": 0.03, ""volatility"": 0.08, ""happinessBonus"": 2, ""socialStatusBonus"": 2, ""description"": ""Test"" },
              { ""assetId"": ""biz_software_studio"", ""name"": ""Studio phần mềm"", ""category"": ""business"", ""tier"": 3, ""cost"": 4200000000, ""monthlyPassiveIncome"": 55000000, ""annualAppreciationRate"": 0.06, ""volatility"": 0.12, ""happinessBonus"": 3, ""socialStatusBonus"": 4, ""description"": ""Test"" },
              { ""assetId"": ""biz_retail_chain"", ""name"": ""Chuỗi bán lẻ"", ""category"": ""business"", ""tier"": 4, ""cost"": 58000000000, ""monthlyPassiveIncome"": 680000000, ""annualAppreciationRate"": 0.07, ""volatility"": 0.15, ""happinessBonus"": 4, ""socialStatusBonus"": 8, ""description"": ""Test"" },
              { ""assetId"": ""biz_unicorn_conglomerate"", ""name"": ""Tập đoàn Kỳ lân"", ""category"": ""business"", ""tier"": 5, ""cost"": 1500000000000, ""monthlyPassiveIncome"": 16500000000, ""annualAppreciationRate"": 0.09, ""volatility"": 0.20, ""happinessBonus"": 8, ""socialStatusBonus"": 15, ""description"": ""Test"" }
            ]");

            var stats = new CharacterStats
            {
                age = 25,
                isAlive = true,
                cash = 10_000_000_000_000L,
                businessAcuity = 20
            };

            Assert.IsTrue(economy.BuyAsset("biz_coffee_cart", stats, out _));
            Assert.IsTrue(economy.BuyAsset("biz_coffee_cart", stats, out _));
            Assert.IsTrue(economy.BuyAsset("biz_coffee_cart", stats, out _));
            Assert.IsFalse(economy.BuyAsset("biz_coffee_cart", stats, out _));

            Assert.IsFalse(economy.BuyAsset("biz_milktea_shop", stats, out _));
            stats.businessAcuity = 35;
            Assert.IsTrue(economy.BuyAsset("biz_milktea_shop", stats, out _));

            Assert.IsFalse(economy.BuyAsset("biz_software_studio", stats, out _));
            stats.businessAcuity = 55;
            Assert.IsTrue(economy.BuyAsset("biz_software_studio", stats, out _));

            Assert.IsFalse(economy.BuyAsset("biz_retail_chain", stats, out _));
            stats.businessAcuity = 72;
            Assert.IsTrue(economy.BuyAsset("biz_retail_chain", stats, out _));

            Assert.IsFalse(economy.BuyAsset("biz_unicorn_conglomerate", stats, out _));
            stats.businessAcuity = 85;
            Assert.IsTrue(economy.BuyAsset("biz_unicorn_conglomerate", stats, out _));
        }

        [Test]
        public void EventEngine_ConditionFormula_FailWeightIsTenPercent()
        {
            var engine = CreateTestComponent<EventEngine>("TestEventEngine_FailWeight");
            engine.LoadEventsFromJson(@"[
              {
                ""eventId"": ""test_cond_weight_01"",
                ""title"": ""Test Condition Weight"",
                ""minAge"": 18,
                ""maxAge"": 18,
                ""priority"": 99,
                ""options"": [{
                  ""id"": ""opt_test"",
                  ""label"": ""Thử nghiệm"",
                  ""outcomes"": [
                    {
                      ""probability"": 0.5,
                      ""condition"": ""intelligence >= 90"",
                      ""message"": ""Pass"",
                      ""statModifiers"": { ""cash"": 1000 }
                    },
                    {
                      ""probability"": 0.5,
                      ""message"": ""Fail"",
                      ""statModifiers"": { ""cash"": 0 }
                    }
                  ]
                }]
              }
            ]");

            var probeStats = new CharacterStats { age = 18, intelligence = 20, cash = 0 };
            var evt = engine.GetEligibleEvents(probeStats).Find(e => e.eventId == "test_cond_weight_01");
            Assert.IsNotNull(evt);

            UnityEngine.Random.InitState(42);
            int passCount = 0;
            for (int i = 0; i < 200; i++)
            {
                var trialStats = new CharacterStats { age = 18, intelligence = 20, cash = 0 };
                var outcome = engine.ResolveOption(evt.options[0], trialStats);
                if (outcome != null && outcome.message == "Pass")
                {
                    passCount++;
                }
            }

            // Với trọng số fail = 0.10, xác suất pass kỳ vọng là 0.05 / 0.55 (~9.1%, ~18/200) thay vì ~26% cũ
            Assert.LessOrEqual(passCount, 35);
        }

        [Test]
        public void MonetizationAndInheritance_ContractAndSaveRoundTrip()
        {
            PlayerPrefs.DeleteKey("ztb_lives_started");
            PlayerPrefs.DeleteKey("ztb_replay_tickets");
            PlayerPrefs.DeleteKey("ztb_starter_left");
            PlayerPrefs.DeleteKey("ztb_ad_bonus");
            PlayerPrefs.DeleteKey("ztb_vip_forever");

            var monetization = CreateTestComponent<MonetizationSystem>("TestMonetization");
            monetization.UnlockVipPack();
            monetization.CompleteRewardedAdForReplay();
            var perkStats = new CharacterStats { comingOfAgeGrant = 0 };
            monetization.ConsumeReplayAndApplyPerks(perkStats);
            Assert.AreEqual(9_000_000L, perkStats.comingOfAgeGrant);

            Object.DestroyImmediate(monetization.gameObject);
            PlayerPrefs.DeleteKey("ztb_lives_started");
            PlayerPrefs.DeleteKey("ztb_replay_tickets");
            PlayerPrefs.DeleteKey("ztb_starter_left");
            PlayerPrefs.DeleteKey("ztb_ad_bonus");
            PlayerPrefs.DeleteKey("ztb_vip_forever");

            var starterMonetization = CreateTestComponent<MonetizationSystem>("TestMonetization_Starter");
            starterMonetization.UnlockStarterPack();
            var starterStats = new CharacterStats { comingOfAgeGrant = 0 };
            starterMonetization.ConsumeReplayAndApplyPerks(starterStats);
            Assert.AreEqual(4_000_000L, starterStats.comingOfAgeGrant);

            var rel = CreateTestComponent<RelationshipSystem>("TestRel");
            var deceased = new CharacterStats
            {
                generation = 1,
                cash = 100_000_000L,
                layoffCount = 3,
                debtOverdueYears = 2,
                bankruptcyCount = 1,
                creditFrozenYears = 4,
                careerCooldownYears = 2
            };
            var child = new NpcRelationship { npcId = "c1", fullName = "Nguyễn Ngọc Linh", role = "Con", age = 10 };

            var wealthyHeir = rel.CreateHeirStats(deceased, child, false, false, 5_000_000_000L);
            Assert.AreEqual("bg_wealthy_dynasty", wealthyHeir.backgroundId);
            Assert.AreEqual(400_000L, wealthyHeir.pocketMoneyChild);
            Assert.AreEqual(1_500_000L, wealthyHeir.pocketMoneyTeen);
            Assert.AreEqual(15_000_000L, wealthyHeir.comingOfAgeGrant);
            Assert.AreEqual(3_000_000L, wealthyHeir.familyAllowancePerYear);
            Assert.AreEqual(0, wealthyHeir.layoffCount);
            Assert.AreEqual(0, wealthyHeir.debtOverdueYears);
            Assert.AreEqual(0, wealthyHeir.bankruptcyCount);
            Assert.AreEqual(0, wealthyHeir.creditFrozenYears);
            Assert.AreEqual(0, wealthyHeir.careerCooldownYears);

            var modestHeir = rel.CreateHeirStats(deceased, child, false, false, 1_000_000_000L);
            Assert.AreEqual("bg_working_class", modestHeir.backgroundId);
            Assert.AreEqual(100_000L, modestHeir.pocketMoneyChild);
            Assert.AreEqual(500_000L, modestHeir.pocketMoneyTeen);
            Assert.AreEqual(3_500_000L, modestHeir.comingOfAgeGrant);
            Assert.AreEqual(1_500_000L, modestHeir.familyAllowancePerYear);

            // Kiểm tra tương thích ngược SaveSystem khi thiếu các trường M2
            string legacyPayload = "{\"schemaVersion\":2,\"stats\":{\"characterName\":\"Legacy\",\"age\":25,\"isAlive\":true,\"cash\":1000000}}";
            string code = "ZTB2:" + System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(legacyPayload));
            var restored = SaveSystem.ImportSaveCode(code);
            Assert.IsNotNull(restored);
            Assert.AreEqual("Expansion", restored.macroCycle);
            Assert.AreEqual(0, restored.jobAppsThisYear);
            Assert.AreEqual(0, restored.activitiesDoneThisYear);
            Assert.AreEqual(0, restored.stats.layoffCount);
            Assert.AreEqual(0, restored.stats.bankruptcyCount);
            Assert.AreEqual(0, restored.stats.creditFrozenYears);
        }

        [Test]
        public void EconomySystem_AssetFee_AppliesOnePercentOnSmallPortfolioWhenNetWorthHigh()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_AssetFee");
            economy.LoadAssetsFromJson(@"[
              { ""assetId"": ""biz_coffee_cart"", ""name"": ""Xe cà phê"", ""category"": ""business"", ""tier"": 1, ""cost"": 55000000, ""monthlyPassiveIncome"": 0, ""annualAppreciationRate"": 0.0, ""volatility"": 0.0, ""happinessBonus"": 0, ""socialStatusBonus"": 0, ""description"": ""Test"" }
            ]");
            economy.portfolio.Add(new OwnedAsset
            {
                assetId = "biz_coffee_cart",
                name = "Xe cà phê",
                category = "business",
                tier = 1,
                quantity = 1,
                totalInvestedCost = 55_000_000L,
                currentUnitValue = 55_000_000L,
                monthlyPassivePerUnit = 0
            });

            var stats = new CharacterStats
            {
                age = 25,
                isAlive = true,
                cash = 2_000_000_000L,
                monthlyIncome = 0
            };

            economy.currentCycle = MacroEconomicCycle.Expansion;
            economy.ProcessAnnualMacroAndPortfolio(stats, rollNewCycle: false);

            // Sinh hoạt phí người lớn: 4.2M * 12 = 50.4M; Phí bảo trì 1% trên 55M = 550k
            Assert.AreEqual(1_949_050_000L, stats.cash);
            Assert.IsTrue(economy.cashflowHistory.Exists(c => c.category == "upkeep" && c.delta == -550_000L));
        }

        [Test]
        public void EconomySystem_GetMonthlyPassiveIncome_AppliesMacroScalingInRecession()
        {
            var economy = CreateTestComponent<EconomySystem>("TestEconomy_PassiveMacro");
            economy.LoadAssetsFromJson(@"[
              { ""assetId"": ""biz_milktea_shop"", ""name"": ""Quán trà sữa"", ""category"": ""business"", ""tier"": 2, ""cost"": 450000000, ""monthlyPassiveIncome"": 6500000, ""annualAppreciationRate"": 0.0, ""volatility"": 0.0, ""happinessBonus"": 2, ""socialStatusBonus"": 2, ""description"": ""Test"" }
            ]");
            economy.portfolio.Add(new OwnedAsset
            {
                assetId = "biz_milktea_shop",
                name = "Quán trà sữa",
                category = "business",
                tier = 2,
                quantity = 1,
                totalInvestedCost = 450_000_000L,
                currentUnitValue = 450_000_000L,
                monthlyPassivePerUnit = 6_500_000L
            });

            economy.currentCycle = MacroEconomicCycle.Recession;
            Assert.AreEqual(-2_275_000L, economy.GetMonthlyPassiveIncome());

            var stats = new CharacterStats
            {
                age = 25,
                isAlive = true,
                cash = 100_000_000L,
                monthlyIncome = 0
            };
            economy.ProcessAnnualMacroAndPortfolio(stats, rollNewCycle: false);
            // 100M - 50.4M (living) - 27.3M (recession business loss) = 22.3M
            Assert.AreEqual(22_300_000L, stats.cash);
        }

        [Test]
        public void CareerSystem_ProcessAnnualCareerProgress_PreservesCooldownJobLabelUntilZero()
        {
            var career = CreateTestComponent<CareerSystem>("TestCareer_CooldownLabel");
            var stats = new CharacterStats
            {
                age = 27,
                isAlive = true,
                currentCareerId = "",
                currentJob = "Thất nghiệp (Bị sa thải)",
                careerCooldownYears = 1,
                isRetired = false
            };

            career.ProcessAnnualCareerProgress(stats, MacroEconomicCycle.Expansion);
            Assert.AreEqual("Thất nghiệp (Bị sa thải)", stats.currentJob);

            stats.careerCooldownYears = 0;
            career.ProcessAnnualCareerProgress(stats, MacroEconomicCycle.Expansion);
            Assert.AreEqual("Tự do / Chưa có việc", stats.currentJob);
        }

        [Test]
        public void EventEngine_ResolveOption_RespectsMilliWeightFloorOnLowProbFail()
        {
            var engine = CreateTestComponent<EventEngine>("TestEventEngine_MilliFloor");
            engine.LoadEventsFromJson(@"[
              {
                ""eventId"": ""test_milli_floor_01"",
                ""title"": ""Test Milli Floor"",
                ""minAge"": 20,
                ""maxAge"": 20,
                ""priority"": 99,
                ""options"": [{
                  ""id"": ""opt_floor"",
                  ""label"": ""Thử nghiệm"",
                  ""outcomes"": [
                    {
                      ""probability"": 0.01,
                      ""condition"": ""intelligence >= 90"",
                      ""message"": ""LowFail"",
                      ""statModifiers"": { ""cash"": 1000 }
                    },
                    {
                      ""probability"": 0.02,
                      ""message"": ""Baseline"",
                      ""statModifiers"": { ""cash"": 0 }
                    }
                  ]
                }]
              }
            ]");

            var probeStats = new CharacterStats { age = 20, intelligence = 20, cash = 0 };
            var evt = engine.GetEligibleEvents(probeStats).Find(e => e.eventId == "test_milli_floor_01");
            Assert.IsNotNull(evt);

            UnityEngine.Random.InitState(123);
            int lowFailCount = 0;
            for (int i = 0; i < 400; i++)
            {
                var trialStats = new CharacterStats { age = 20, intelligence = 20, cash = 0 };
                var outcome = engine.ResolveOption(evt.options[0], trialStats);
                if (outcome != null && outcome.message == "LowFail")
                {
                    lowFailCount++;
                }
            }

            // Với sàn 0.001f: w0 = 0.01 * 0.10 = 0.001, w1 = 0.02 -> ~4.76% (~19/400), thấp hơn rõ rệt so với sàn cũ 0.01f (~33.3%)
            Assert.LessOrEqual(lowFailCount, 45);
        }
    }
}
