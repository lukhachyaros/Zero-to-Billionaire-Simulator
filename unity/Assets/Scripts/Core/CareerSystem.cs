using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    [System.Serializable]
    public class CareerDefinition
    {
        public string careerId;
        public string title;
        public string sector;
        public int minAge;
        public int maxAge;
        public string requiredEducation;
        public int minIntelligence;
        public int minDiscipline;
        public int minCharisma;
        public long monthlySalary;
        public float annualRaiseRate = 0.06f;
        public int annualStressDelta = 5;
        public string promotionCareerId;
        public int yearsForPromotion;
        public string description;
    }

    /// <summary>
    /// Quản lý hệ thống nghề nghiệp, ứng tuyển phỏng vấn, tăng lương hàng năm, thăng chức và nghỉ hưu.
    /// </summary>
    public class CareerSystem : MonoBehaviour
    {
        public static CareerSystem Instance { get; private set; }

        private readonly List<CareerDefinition> careers = new List<CareerDefinition>();

        [System.Serializable]
        private class CareerListWrapper
        {
            public List<CareerDefinition> items;
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadCareersFromResources();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void LoadCareersFromResources()
        {
            if (careers.Count > 0) return;
            TextAsset asset = Resources.Load<TextAsset>("Data/careers");
            if (asset != null)
            {
                LoadCareersFromJson(asset.text);
            }
        }

        public void LoadCareersFromJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return;
            try
            {
                var wrapper = JsonUtility.FromJson<CareerListWrapper>("{\"items\":" + json.Trim() + "}");
                if (wrapper != null && wrapper.items != null)
                {
                    careers.Clear();
                    careers.AddRange(wrapper.items);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[CareerSystem] Lỗi đọc dữ liệu nghề nghiệp: {ex.Message}");
            }
        }

        public IReadOnlyList<CareerDefinition> GetAllCareers() => careers;

        public CareerDefinition GetCareerById(string careerId)
        {
            return careers.FirstOrDefault(c => c.careerId == careerId);
        }

        public bool MeetsRequirements(CareerDefinition career, CharacterStats stats, out string reason)
        {
            reason = "";
            if (career == null)
            {
                reason = "Nghề nghiệp không tồn tại.";
                return false;
            }
            if (stats.age < career.minAge || stats.age > career.maxAge)
            {
                reason = $"Độ tuổi yêu cầu: {career.minAge} - {career.maxAge} tuổi.";
                return false;
            }
            if (CharacterStats.GetEducationRank(stats.educationLevel) < CharacterStats.GetEducationRank(career.requiredEducation))
            {
                reason = $"Cần trình độ tối thiểu: {career.requiredEducation}.";
                return false;
            }
            if (stats.intelligence < career.minIntelligence)
            {
                reason = $"Cần Trí tuệ >= {career.minIntelligence}.";
                return false;
            }
            if (stats.discipline < career.minDiscipline)
            {
                reason = $"Cần Kỷ luật >= {career.minDiscipline}.";
                return false;
            }
            if (stats.charisma < career.minCharisma)
            {
                reason = $"Cần Giao tiếp >= {career.minCharisma}.";
                return false;
            }
            return true;
        }

        public bool TryApplyForCareer(string careerId, CharacterStats stats, out string message)
        {
            var career = GetCareerById(careerId);
            if (!MeetsRequirements(career, stats, out string failReason))
            {
                message = $"❌ Hồ sơ bị loại: {failReason}";
                return false;
            }

            float interviewChance = Mathf.Clamp(
                0.60f + (stats.charisma - career.minCharisma) * 0.005f + (stats.intelligence - career.minIntelligence) * 0.004f + (stats.luck - 50) * 0.002f,
                0.35f,
                0.98f
            );

            if (UnityEngine.Random.value <= interviewChance)
            {
                stats.currentCareerId = career.careerId;
                stats.currentJob = career.title;
                stats.monthlyIncome = career.monthlySalary;
                stats.yearsInCurrentJob = 0;
                stats.isRetired = false;
                stats.happiness += 8;
                stats.socialStatus += 5;
                stats.ClampStats();

                message = $"💼 Chúc mừng! Bạn trúng tuyển vị trí {career.title} với mức lương {CharacterStats.FormatVND(career.monthlySalary)}/tháng!";
                return true;
            }

            stats.stress += 5;
            stats.happiness -= 4;
            stats.ClampStats();
            message = $"😓 Buổi phỏng vấn {career.title} chưa thành công. Hãy rèn thêm kỹ năng và thử lại năm sau!";
            return false;
        }

        public List<string> ProcessAnnualCareerProgress(CharacterStats stats)
        {
            var logs = new List<string>();
            if (!stats.isAlive) return logs;

            // Tự động cập nhật nhãn học sinh khi còn nhỏ và chưa đi làm
            if (string.IsNullOrEmpty(stats.currentCareerId))
            {
                if (stats.age < 6) stats.currentJob = "Trẻ nhỏ";
                else if (stats.age <= 18) stats.currentJob = $"Học sinh ({stats.educationLevel})";
                else if (!stats.isRetired) stats.currentJob = "Tự do / Chưa có việc";
                return logs;
            }

            var current = GetCareerById(stats.currentCareerId);
            if (current == null) return logs;

            stats.yearsInCurrentJob++;
            stats.stress += Mathf.Max(0, current.annualStressDelta - stats.discipline / 20);
            stats.practicalSkills += 2;

            // Tăng lương định kỳ
            float performanceFactor = 0.7f + (stats.discipline + stats.intelligence) / 200f;
            long raise = (long)(stats.monthlyIncome * current.annualRaiseRate * performanceFactor);
            if (raise > 0)
            {
                stats.monthlyIncome += raise;
            }

            // Xét thăng chức tự động
            if (!string.IsNullOrEmpty(current.promotionCareerId)
                && current.yearsForPromotion > 0
                && stats.yearsInCurrentJob >= current.yearsForPromotion)
            {
                var nextCareer = GetCareerById(current.promotionCareerId);
                if (nextCareer != null && stats.intelligence >= nextCareer.minIntelligence - 8 && stats.discipline >= nextCareer.minDiscipline - 8)
                {
                    stats.currentCareerId = nextCareer.careerId;
                    stats.currentJob = nextCareer.title;
                    stats.monthlyIncome = Math.Max((long)(stats.monthlyIncome * 1.25f), nextCareer.monthlySalary);
                    stats.yearsInCurrentJob = 0;
                    stats.happiness += 12;
                    stats.socialStatus += 10;
                    logs.Add($"🚀 Thăng chức! Bạn được bổ nhiệm lên vị trí {nextCareer.title} (Lương mới: {CharacterStats.FormatVND(stats.monthlyIncome)}/tháng)!");
                }
            }

            // Chế độ hưu trí khi từ 62 tuổi
            if (stats.age >= 62 && !stats.isRetired && stats.age > current.maxAge)
            {
                long pension = (long)(stats.monthlyIncome * 0.45f);
                stats.currentCareerId = "";
                stats.isRetired = true;
                stats.currentJob = "Hưu trí an nhàn";
                stats.monthlyIncome = pension;
                stats.stress -= 25;
                logs.Add($"🍵 Bạn chính thức nghỉ hưu với lương hưu {CharacterStats.FormatVND(pension)}/tháng.");
            }

            stats.ClampStats();
            return logs;
        }
    }
}
