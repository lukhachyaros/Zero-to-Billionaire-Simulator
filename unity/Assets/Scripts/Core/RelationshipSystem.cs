using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    [System.Serializable]
    public class NpcRelationship
    {
        public string npcId;
        public string fullName;
        public string role; // "Cha", "Mẹ", "Bạn thân", "Người yêu", "Vợ/Chồng", "Con"
        public int age;
        [Range(0, 100)] public int closeness = 75;
        public bool isAlive = true;
    }

    /// <summary>
    /// Quản lý các mối quan hệ xã hội, hôn nhân, con cái và hệ thống Gia phả Thừa kế (Dynasty Inheritance).
    /// </summary>
    public class RelationshipSystem : MonoBehaviour
    {
        public static RelationshipSystem Instance { get; private set; }

        private static readonly string[] FamilyNames = { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ" };
        private static readonly string[] MaleMiddle = { "Gia", "Minh", "Đức", "Quốc", "Tuấn", "Hoàng", "Thành" };
        private static readonly string[] MaleGiven = { "Huy", "Khang", "Bảo", "Phúc", "An", "Khoa", "Đạt", "Long", "Nam", "Việt" };
        private static readonly string[] FemaleMiddle = { "Ngọc", "Phương", "Thanh", "Bảo", "Minh", "Khánh", "Thảo" };
        private static readonly string[] FemaleGiven = { "Linh", "Anh", "Vy", "Châu", "Ngân", "Trang", "Mai", "Hà", "Nhi", "Tâm" };

        public List<NpcRelationship> relationships = new List<NpcRelationship>();

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                if (Application.isPlaying) DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public static string GenerateVietnameseName(string gender, string preferredSurname = "")
        {
            string surname = string.IsNullOrEmpty(preferredSurname)
                ? FamilyNames[UnityEngine.Random.Range(0, FamilyNames.Length)]
                : preferredSurname;

            if (gender == "Nữ")
            {
                string mid = FemaleMiddle[UnityEngine.Random.Range(0, FemaleMiddle.Length)];
                string given = FemaleGiven[UnityEngine.Random.Range(0, FemaleGiven.Length)];
                return $"{surname} {mid} {given}";
            }
            else
            {
                string mid = MaleMiddle[UnityEngine.Random.Range(0, MaleMiddle.Length)];
                string given = MaleGiven[UnityEngine.Random.Range(0, MaleGiven.Length)];
                return $"{surname} {mid} {given}";
            }
        }

        public void InitializeFamilyForNewLife(CharacterStats stats)
        {
            relationships.Clear();
            string surname = stats.characterName.Split(' ')[0];

            if (stats.backgroundId != "bg_orphan")
            {
                relationships.Add(new NpcRelationship
                {
                    npcId = "npc_father",
                    fullName = GenerateVietnameseName("Nam", surname),
                    role = "Cha",
                    age = UnityEngine.Random.Range(26, 34),
                    closeness = stats.parentRelationship
                });
                relationships.Add(new NpcRelationship
                {
                    npcId = "npc_mother",
                    fullName = GenerateVietnameseName("Nữ"),
                    role = "Mẹ",
                    age = UnityEngine.Random.Range(24, 31),
                    closeness = Mathf.Min(100, stats.parentRelationship + 5)
                });
            }

            relationships.Add(new NpcRelationship
            {
                npcId = "npc_bestfriend",
                fullName = GenerateVietnameseName(UnityEngine.Random.value > 0.5f ? "Nam" : "Nữ"),
                role = "Bạn thân",
                age = 0,
                closeness = 70
            });
        }

        public string InteractWithNpc(string npcId, string actionType, CharacterStats stats)
        {
            var npc = relationships.FirstOrDefault(r => r.npcId == npcId && r.isAlive);
            if (npc == null) return "Không tìm thấy người này.";

            switch (actionType)
            {
                case "chat":
                    npc.closeness = Mathf.Clamp(npc.closeness + 6, 0, 100);
                    stats.happiness += 4;
                    stats.charisma += 2;
                    stats.ClampStats();
                    return $"☕ Bạn dành thời gian tâm sự ấm áp cùng {npc.role} {npc.fullName}.";

                case "gift":
                    if (stats.age < 12)
                    {
                        npc.closeness = Mathf.Clamp(npc.closeness + 10, 0, 100);
                        stats.happiness += 5;
                        stats.karma += 3;
                        stats.ClampStats();
                        return $"🎨 Bạn tự tay vẽ thiệp và làm quà thủ công tặng {npc.role} {npc.fullName} (+10 thân thiết).";
                    }
                    long giftCost = stats.age < 18 ? 100_000L : 2_000_000L;
                    if (stats.cash < giftCost)
                        return $"Cần {CharacterStats.FormatVND(giftCost)} để mua quà tặng.";
                    stats.cash -= giftCost;
                    npc.closeness = Mathf.Clamp(npc.closeness + 14, 0, 100);
                    stats.happiness += 6;
                    stats.karma += 3;
                    stats.ClampStats();
                    return $"🎁 Bạn tặng món quà ý nghĩa cho {npc.role} {npc.fullName} (+14 thân thiết).";
            }
            return "";
        }

        public bool StartDatingNewPartner(CharacterStats stats, out string message)
        {
            if (stats.age < 18)
            {
                message = "Hãy đợi đủ 18 tuổi để hẹn hò nghiêm túc!";
                return false;
            }
            if (relationships.Any(r => r.isAlive && (r.role == "Người yêu" || r.role == "Vợ/Chồng")))
            {
                message = "Bạn đang có người thương đồng hành rồi!";
                return false;
            }

            string partnerGender = stats.gender == "Nam" ? "Nữ" : "Nam";
            string partnerName = GenerateVietnameseName(partnerGender);
            relationships.Add(new NpcRelationship
            {
                npcId = "npc_partner_" + Guid.NewGuid().ToString("N").Substring(0, 6),
                fullName = partnerName,
                role = "Người yêu",
                age = Mathf.Max(18, stats.age + UnityEngine.Random.Range(-3, 3)),
                closeness = 75
            });
            stats.maritalStatus = "Đang hẹn hò";
            stats.happiness += 12;
            stats.ClampStats();

            message = $"💕 Bạn bắt đầu hẹn hò cùng {partnerName}!";
            return true;
        }

        public bool ProposeMarriage(CharacterStats stats, out string message)
        {
            var partner = relationships.FirstOrDefault(r => r.isAlive && r.role == "Người yêu");
            if (partner == null)
            {
                message = "Bạn cần có Người yêu trước khi cầu hôn.";
                return false;
            }
            if (partner.closeness < 75)
            {
                message = $"Độ thân thiết với {partner.fullName} cần đạt ít nhất 75 để cầu hôn.";
                return false;
            }
            long weddingBudget = 25_000_000L;
            if (stats.cash < weddingBudget)
            {
                message = $"Cần tối thiểu {CharacterStats.FormatVND(weddingBudget)} để tổ chức lễ cưới ấm cúng.";
                return false;
            }

            stats.cash -= weddingBudget;
            partner.role = "Vợ/Chồng";
            partner.closeness = 95;
            stats.maritalStatus = "Đã kết hôn";
            stats.spouseName = partner.fullName;
            stats.happiness += 22;
            stats.socialStatus += 10;
            stats.ClampStats();

            message = $"💍 Chúc mừng! Bạn và {partner.fullName} chính thức nên duyên vợ chồng!";
            return true;
        }

        public NpcRelationship AddChild(CharacterStats stats)
        {
            string surname = stats.characterName.Split(' ')[0];
            string childGender = UnityEngine.Random.value > 0.5f ? "Nam" : "Nữ";
            var child = new NpcRelationship
            {
                npcId = "npc_child_" + (stats.childrenCount + 1),
                fullName = GenerateVietnameseName(childGender, surname),
                role = "Con",
                age = 0,
                closeness = 95
            };
            relationships.Add(child);
            stats.childrenCount++;
            stats.happiness += 18;
            stats.ClampStats();
            return child;
        }

        public void ProcessAnnualAging(CharacterStats stats, Action<string> logCallback)
        {
            // Đồng bộ kết hôn hoặc sinh con nếu được kích hoạt từ Event JSON
            if (stats.maritalStatus == "Đã kết hôn" && !relationships.Any(r => r.role == "Vợ/Chồng"))
            {
                string partnerGender = stats.gender == "Nam" ? "Nữ" : "Nam";
                string spouse = GenerateVietnameseName(partnerGender);
                stats.spouseName = spouse;
                relationships.Add(new NpcRelationship
                {
                    npcId = "npc_spouse_auto",
                    fullName = spouse,
                    role = "Vợ/Chồng",
                    age = stats.age,
                    closeness = 90
                });
            }

            int currentChildNpcs = relationships.Count(r => r.role == "Con");
            while (currentChildNpcs < stats.childrenCount)
            {
                string surname = stats.characterName.Split(' ')[0];
                relationships.Add(new NpcRelationship
                {
                    npcId = "npc_child_" + (currentChildNpcs + 1),
                    fullName = GenerateVietnameseName(UnityEngine.Random.value > 0.5f ? "Nam" : "Nữ", surname),
                    role = "Con",
                    age = 0,
                    closeness = 92
                });
                currentChildNpcs++;
            }

            foreach (var npc in relationships)
            {
                if (!npc.isAlive) continue;
                npc.age++;

                if ((npc.role == "Cha" || npc.role == "Mẹ") && npc.age > 78 && UnityEngine.Random.value < 0.14f)
                {
                    npc.isAlive = false;
                    stats.happiness -= 20;
                    logCallback?.Invoke($"🕯️ {npc.role} của bạn ({npc.fullName}) đã qua đời ở tuổi {npc.age}. Đại gia đình vô cùng thương tiếc.");
                }
            }

            stats.ClampStats();
        }

        public List<NpcRelationship> GetLivingChildren()
        {
            return relationships.Where(r => r.isAlive && r.role == "Con").ToList();
        }

        /// <summary>
        /// Tạo nhân vật đời kế tiếp thừa kế tài sản, bất động sản và phúc đức dòng tộc.
        /// </summary>
        public CharacterStats CreateHeirStats(
            CharacterStats deceasedParent,
            NpcRelationship chosenChild,
            bool hasFamilyTrustFlag,
            bool hasEliteHeirFlag,
            long parentNetWorth = long.MinValue)
        {
            double inheritanceRatio = hasFamilyTrustFlag ? 1.0 : 0.85;
            long totalLegacyCash = deceasedParent.cash + deceasedParent.trustFund;
            long inheritedCash = (long)(totalLegacyCash * inheritanceRatio);
            long inheritedDebt = deceasedParent.debt;

            long effectiveNetWorth = parentNetWorth != long.MinValue
                ? parentNetWorth
                : (EconomySystem.Instance != null
                    ? EconomySystem.Instance.CalculateNetWorth(deceasedParent)
                    : (deceasedParent.cash + deceasedParent.trustFund - deceasedParent.debt));
            bool isWealthyDynasty = effectiveNetWorth >= 5_000_000_000L;

            string childGender = chosenChild.fullName.Contains("Ngọc") || chosenChild.fullName.Contains("Phương") || chosenChild.fullName.Contains("Linh")
                ? "Nữ"
                : "Nam";

            int startAge = Mathf.Clamp(chosenChild.age, 0, 35);
            string startEdu = startAge >= 22 ? "Đại học" : (startAge >= 18 ? "THPT" : (startAge >= 15 ? "THCS" : (startAge >= 6 ? "Tiểu học" : "Chưa đi học")));
            bool isUnderAge = startAge < 18;
            string initialJob = startAge < 6 ? "Trẻ nhỏ" : (startAge <= 18 ? $"Học sinh ({startEdu})" : "Tự do / Chưa có việc");

            var heir = new CharacterStats
            {
                generation = deceasedParent.generation + 1,
                backgroundId = isWealthyDynasty ? "bg_wealthy_dynasty" : "bg_working_class",
                backgroundName = $"Truyền nhân Đời thứ {deceasedParent.generation + 1}",
                characterName = chosenChild.fullName,
                gender = childGender,
                age = startAge,
                isAlive = true,
                health = 90,
                intelligence = Mathf.Clamp(deceasedParent.intelligence / 2 + UnityEngine.Random.Range(25, 45) + (hasEliteHeirFlag ? 15 : 0), 35, 98),
                appearance = Mathf.Clamp(deceasedParent.appearance / 2 + UnityEngine.Random.Range(25, 45), 40, 95),
                happiness = 80,
                discipline = Mathf.Clamp(deceasedParent.discipline / 2 + UnityEngine.Random.Range(20, 40), 35, 95),
                stress = 10,
                luck = Mathf.Clamp(50 + (deceasedParent.karma - 50) / 3, 25, 95),
                parentRelationship = 85,
                socialStatus = Mathf.Clamp(deceasedParent.socialStatus / 2 + 15, 15, 90),
                charisma = Mathf.Clamp(deceasedParent.charisma / 2 + 25, 30, 90),
                financialLiteracy = Mathf.Clamp(deceasedParent.financialLiteracy / 2 + (hasEliteHeirFlag ? 20 : 10), 15, 90),
                practicalSkills = 25,
                businessAcuity = Mathf.Clamp(deceasedParent.businessAcuity / 2 + (hasEliteHeirFlag ? 15 : 5), 15, 90),
                karma = deceasedParent.karma,
                cash = isUnderAge ? 0 : inheritedCash,
                trustFund = isUnderAge ? inheritedCash : 0,
                pocketMoneyChild = isWealthyDynasty ? 400_000L : 100_000L,
                pocketMoneyTeen = isWealthyDynasty ? 1_500_000L : 500_000L,
                comingOfAgeGrant = isWealthyDynasty ? 15_000_000L : 3_500_000L,
                familyAllowancePerYear = isWealthyDynasty ? 3_000_000L : 1_500_000L,
                debt = inheritedDebt,
                educationLevel = startEdu,
                currentCareerId = "",
                currentJob = initialJob,
                layoffCount = 0,
                debtOverdueYears = 0,
                bankruptcyCount = 0,
                creditFrozenYears = 0,
                careerCooldownYears = 0
            };

            heir.ClampStats();
            return heir;
        }
    }
}
