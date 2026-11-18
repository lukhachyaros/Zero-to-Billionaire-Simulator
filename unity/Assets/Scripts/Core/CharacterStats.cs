using System;
using System.Collections.Generic;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    public enum LifeStage
    {
        Infant,      // 0 - 5
        Child,       // 6 - 11
        Teen,        // 12 - 17
        YoungAdult,  // 18 - 34
        Adult,       // 35 - 59
        Senior       // 60+
    }

    [System.Serializable]
    public class StartingBackground
    {
        public string backgroundId;
        public string name;
        public string subtitle;
        public string description;
        public string badge;
        public long initialCash;
        public long pocketMoneyChild;
        public long pocketMoneyTeen;
        public long comingOfAgeGrant;
        public long familyAllowancePerYear;
        public StatModifiers statBonuses = new StatModifiers();
        public List<string> startingFlags = new List<string>();
    }

    [System.Serializable]
    public class CharacterStats
    {
        // Thông tin nhân thân & Gia tộc
        public int generation = 1;
        public string backgroundId = "bg_working_class";
        public string backgroundName = "Gia Đình Lao Động Bình Dân";
        public string characterName = "Nguyễn Gia Huy";
        public string gender = "Nam";
        public int age = 0;
        public bool isAlive = true;
        public string causeOfDeath = "";

        // Chỉ số cốt lõi (0 - 100)
        [Range(0, 100)] public int health = 90;
        [Range(0, 100)] public int intelligence = 55;
        [Range(0, 100)] public int appearance = 60;
        [Range(0, 100)] public int happiness = 80;
        [Range(0, 100)] public int discipline = 50;
        [Range(0, 100)] public int stress = 10;

        // Chỉ số xã hội, kỹ năng & nghiệp quả (0 - 100)
        [Range(0, 100)] public int luck = 50;
        [Range(0, 100)] public int parentRelationship = 80;
        [Range(0, 100)] public int socialStatus = 20;
        [Range(0, 100)] public int charisma = 45;
        [Range(0, 100)] public int financialLiteracy = 20;
        [Range(0, 100)] public int practicalSkills = 20;
        [Range(0, 100)] public int businessAcuity = 20;
        [Range(0, 100)] public int karma = 50;
        [Range(0, 100)] public int energy = 100;

        // Kinh tế & Tài chính (VNĐ)
        public long cash = 0;
        public long trustFund = 0; // Quỹ ủy thác thừa kế (mở khóa lúc 18 tuổi)
        public long debt = 0;
        public long monthlyIncome = 0;
        public long monthlyExpense = 0;
        public long pocketMoneyChild = 0;
        public long pocketMoneyTeen = 0;
        public long comingOfAgeGrant = 0;
        public long familyAllowancePerYear = 0;
        public long peakNetWorth = 0;

        // Học vấn & Sự nghiệp
        public string educationLevel = "Chưa đi học"; // Chưa đi học, Mầm non, Tiểu học, THCS, THPT, Học nghề, Đại học
        public string currentCareerId = "";
        public string currentJob = "Còn nhỏ";
        public int yearsInCurrentJob = 0;
        public string companyName = "";
        public bool isRetired = false;

        // Rủi ro nghề nghiệp, nợ xấu & phá sản (R2)
        public int layoffCount = 0;
        public int debtOverdueYears = 0;
        public int bankruptcyCount = 0;
        public int creditFrozenYears = 0;
        public int careerCooldownYears = 0;

        // Gia đình
        public string maritalStatus = "Độc thân";
        public string spouseName = "";
        public int childrenCount = 0;

        public LifeStage GetLifeStage()
        {
            if (age < 6) return LifeStage.Infant;
            if (age < 12) return LifeStage.Child;
            if (age < 18) return LifeStage.Teen;
            if (age < 35) return LifeStage.YoungAdult;
            if (age < 60) return LifeStage.Adult;
            return LifeStage.Senior;
        }

        public static int GetEducationRank(string edu)
        {
            return edu switch
            {
                "Đại học" => 5,
                "Học nghề" => 4,
                "THPT" => 3,
                "THCS" => 2,
                "Tiểu học" => 1,
                _ => 0
            };
        }

        public void ClampStats()
        {
            health = Mathf.Clamp(health, 0, 100);
            intelligence = Mathf.Clamp(intelligence, 0, 100);
            appearance = Mathf.Clamp(appearance, 0, 100);
            happiness = Mathf.Clamp(happiness, 0, 100);
            discipline = Mathf.Clamp(discipline, 0, 100);
            stress = Mathf.Clamp(stress, 0, 100);
            luck = Mathf.Clamp(luck, 0, 100);
            parentRelationship = Mathf.Clamp(parentRelationship, 0, 100);
            socialStatus = Mathf.Clamp(socialStatus, 0, 100);
            charisma = Mathf.Clamp(charisma, 0, 100);
            financialLiteracy = Mathf.Clamp(financialLiteracy, 0, 100);
            practicalSkills = Mathf.Clamp(practicalSkills, 0, 100);
            businessAcuity = Mathf.Clamp(businessAcuity, 0, 100);
            karma = Mathf.Clamp(karma, 0, 100);
            energy = Mathf.Clamp(energy, 0, 100);

            if (cash < 0)
            {
                debt += -cash;
                cash = 0;
            }

            if (debt < 0) debt = 0;

            layoffCount = Math.Max(0, layoffCount);
            debtOverdueYears = Math.Max(0, debtOverdueYears);
            bankruptcyCount = Math.Max(0, bankruptcyCount);
            creditFrozenYears = Math.Max(0, creditFrozenYears);
            careerCooldownYears = Math.Max(0, careerCooldownYears);

            if (health <= 0 && isAlive)
            {
                isAlive = false;
                if (string.IsNullOrEmpty(causeOfDeath))
                {
                    causeOfDeath = age >= 75 ? "Tuổi cao sức yếu, ra đi thanh thản bên con cháu" : "Sức khỏe suy kiệt do bệnh tật và áp lực";
                }
            }
        }

        public void ApplyModifiers(StatModifiers modifiers)
        {
            if (modifiers == null) return;

            health += modifiers.health;
            intelligence += modifiers.intelligence;
            appearance += modifiers.appearance;
            happiness += modifiers.happiness;
            discipline += modifiers.discipline;
            stress += modifiers.stress;
            luck += modifiers.luck;
            parentRelationship += modifiers.parentRelationship;
            socialStatus += modifiers.socialStatus;
            charisma += modifiers.charisma;
            financialLiteracy += modifiers.financialLiteracy;
            practicalSkills += modifiers.practicalSkills;
            businessAcuity += modifiers.businessAcuity;
            karma += modifiers.karma;
            energy += modifiers.energy;

            cash += modifiers.cash + modifiers.money;
            debt += modifiers.debt;

            ClampStats();
        }

        public CharacterStats DeepCopy()
        {
            return JsonUtility.FromJson<CharacterStats>(JsonUtility.ToJson(this));
        }

        public static string FormatVND(long amount)
        {
            long abs = Math.Abs(amount);
            string sign = amount < 0 ? "-" : "";
            if (abs >= 1_000_000_000_000L)
                return $"{sign}{abs / 1_000_000_000_000.0:0.##} Nghìn Tỷ đ";
            if (abs >= 1_000_000_000L)
                return $"{sign}{abs / 1_000_000_000.0:0.##} Tỷ đ";
            if (abs >= 1_000_000L)
                return $"{sign}{abs / 1_000_000.0:0.#} Triệu đ";
            return $"{amount:N0} đ";
        }
    }

    [System.Serializable]
    public class StatModifiers
    {
        public int health = 0;
        public int intelligence = 0;
        public int appearance = 0;
        public int happiness = 0;
        public int discipline = 0;
        public int stress = 0;
        public int luck = 0;
        public int parentRelationship = 0;
        public int socialStatus = 0;
        public int charisma = 0;
        public int financialLiteracy = 0;
        public int practicalSkills = 0;
        public int businessAcuity = 0;
        public int karma = 0;
        public int energy = 0;

        public long cash = 0;
        public long money = 0; // Alias tương thích ngược cho kịch bản cộng đồng
        public long debt = 0;
    }
}
