using System;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    [System.Serializable]
    public class CharacterStats
    {
        // Thông tin cơ bản
        public string characterName = "Nguyễn Văn An";
        public string gender = "Nam"; // "Nam", "Nữ"
        public int age = 0;
        public bool isAlive = true;

        // Chỉ số cá nhân (0 - 100)
        [Range(0, 100)] public int health = 90;
        [Range(0, 100)] public int intelligence = 50;
        [Range(0, 100)] public int appearance = 60;
        [Range(0, 100)] public int happiness = 80;
        [Range(0, 100)] public int discipline = 50;
        [Range(0, 100)] public int stress = 10;

        // Chỉ số ẩn & Xã hội
        [Range(0, 100)] public int luck = 50;
        [Range(0, 100)] public int parentRelationship = 80;
        [Range(0, 100)] public int socialStatus = 20;

        // Kinh tế & Tài chính (Đơn vị: VNĐ)
        public long cash = 0;
        public long debt = 0;
        public long monthlyIncome = 0;
        public long monthlyExpense = 0;

        // Nghề nghiệp & Học vấn
        public string educationLevel = "Chưa đi học"; // "Mầm non", "Tiểu học", "THCS", "THPT", "Đại học", "Học nghề"
        public string currentJob = "Trẻ em";
        public string companyName = "";

        // Trạng thái gia đình
        public string maritalStatus = "Độc thân";
        public int childrenCount = 0;

        public void ClampStats()
        {
            health = Mathf.Clamp(health, 0, 100);
            intelligence = Mathf.Clamp(intelligence, 0, 100);
            appearance = Mathf.Clamp(appearance, 0, 100);
            happiness = Mathf.Clamp(happiness, 0, 100);
            discipline = Mathf.Clamp(discipline, 0, 100);
            stress = Mathf.Clamp(stress, 0, 100);
            parentRelationship = Mathf.Clamp(parentRelationship, 0, 100);
            luck = Mathf.Clamp(luck, 0, 100);
            socialStatus = Mathf.Clamp(socialStatus, 0, 100);

            if (health <= 0)
            {
                isAlive = false;
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
            parentRelationship += modifiers.parentRelationship;
            luck += modifiers.luck;
            socialStatus += modifiers.socialStatus;

            cash += modifiers.cash;
            debt += modifiers.debt;

            ClampStats();
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
        public int parentRelationship = 0;
        public int luck = 0;
        public int socialStatus = 0;

        public long cash = 0;
        public long debt = 0;
    }
}
