using NUnit.Framework;
using UnityEngine;
using ZeroToBillionaire.Core;
using ZeroToBillionaire.Events;

namespace ZeroToBillionaire.Tests
{
    public class GameSimulationTests
    {
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
    }
}
