using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    [System.Serializable]
    public class GameSnapshot
    {
        public int schemaVersion = 2;
        public string savedAtIso;
        public CharacterStats stats;
        public List<OwnedAsset> portfolio = new List<OwnedAsset>();
        public List<NpcRelationship> relationships = new List<NpcRelationship>();
        public List<string> triggeredEvents = new List<string>();
        public List<string> unlockedFlags = new List<string>();
        public List<string> lifeLog = new List<string>();
        public string macroCycle = "Expansion";
        public int jobAppsThisYear = 0;
        public int activitiesDoneThisYear = 0;
        public string checksum;
    }

    /// <summary>
    /// Hệ thống lưu trữ cục bộ an toàn (Schema v2 + SHA-256 Checksum)
    /// kết hợp bộ nhớ đệm Cỗ Máy Thời Gian (Time Machine) cho phép quay ngược 1-3 năm trước.
    /// </summary>
    public static class SaveSystem
    {
        private const string SAVE_FILENAME = "ztb_savegame_v2.json";
        private const string HASH_SALT = "ZeroToBillionaire_VN_2026_Salt";
        private const int MAX_TIME_MACHINE_SNAPSHOTS = 20;

        private static readonly List<string> timeMachineHistory = new List<string>();

        private static string SavePath => Path.Combine(Application.persistentDataPath, SAVE_FILENAME);

        public static void PushTimeMachineSnapshot(GameSnapshot snapshot)
        {
            if (snapshot == null) return;
            snapshot.checksum = "";
            string serialized = JsonUtility.ToJson(snapshot);
            timeMachineHistory.Add(serialized);
            while (timeMachineHistory.Count > MAX_TIME_MACHINE_SNAPSHOTS)
            {
                timeMachineHistory.RemoveAt(0);
            }
        }

        public static int AvailableRewindYears => timeMachineHistory.Count;

        public static GameSnapshot PopTimeMachineSnapshot(int yearsBack = 1)
        {
            if (timeMachineHistory.Count == 0) return null;
            int popCount = Mathf.Clamp(yearsBack, 1, timeMachineHistory.Count);
            string targetJson = null;
            for (int i = 0; i < popCount; i++)
            {
                int lastIdx = timeMachineHistory.Count - 1;
                targetJson = timeMachineHistory[lastIdx];
                timeMachineHistory.RemoveAt(lastIdx);
            }
            return string.IsNullOrEmpty(targetJson) ? null : JsonUtility.FromJson<GameSnapshot>(targetJson);
        }

        public static void ClearTimeMachine()
        {
            timeMachineHistory.Clear();
        }

        public static bool SaveToDisk(GameSnapshot snapshot)
        {
            try
            {
                snapshot.savedAtIso = DateTime.UtcNow.ToString("o");
                snapshot.checksum = "";
                string payload = JsonUtility.ToJson(snapshot);
                snapshot.checksum = ComputeHash(payload);

                string finalJson = JsonUtility.ToJson(snapshot, true);
                File.WriteAllText(SavePath, finalJson, Encoding.UTF8);
                return true;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveSystem] Không thể lưu game: {ex.Message}");
                return false;
            }
        }

        public static GameSnapshot LoadFromDisk()
        {
            try
            {
                if (!File.Exists(SavePath)) return null;
                string raw = File.ReadAllText(SavePath, Encoding.UTF8);
                var snapshot = JsonUtility.FromJson<GameSnapshot>(raw);
                if (snapshot == null || snapshot.stats == null) return null;

                string savedChecksum = snapshot.checksum;
                snapshot.checksum = "";
                string verifyPayload = JsonUtility.ToJson(snapshot);
                if (!string.IsNullOrEmpty(savedChecksum) && ComputeHash(verifyPayload) != savedChecksum)
                {
                    Debug.LogWarning("[SaveSystem] Cảnh báo: File lưu có dấu hiệu chỉnh sửa thủ công.");
                }

                snapshot.checksum = savedChecksum;
                if (string.IsNullOrEmpty(snapshot.macroCycle)) snapshot.macroCycle = "Expansion";
                snapshot.jobAppsThisYear = Mathf.Max(0, snapshot.jobAppsThisYear);
                snapshot.activitiesDoneThisYear = Mathf.Max(0, snapshot.activitiesDoneThisYear);
                return snapshot;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveSystem] Không thể tải file save: {ex.Message}");
                return null;
            }
        }

        public static bool HasSaveFile() => File.Exists(SavePath);

        public static string ExportSaveCode(GameSnapshot snapshot)
        {
            if (snapshot == null) return string.Empty;
            snapshot.savedAtIso = DateTime.UtcNow.ToString("o");
            snapshot.checksum = "";
            string payload = JsonUtility.ToJson(snapshot);
            snapshot.checksum = ComputeHash(payload);
            string full = JsonUtility.ToJson(snapshot);
            return "ZTB2:" + Convert.ToBase64String(Encoding.UTF8.GetBytes(full));
        }

        public static GameSnapshot ImportSaveCode(string code)
        {
            if (string.IsNullOrWhiteSpace(code) || !code.StartsWith("ZTB2:")) return null;
            try
            {
                byte[] bytes = Convert.FromBase64String(code.Substring(5).Trim());
                string raw = Encoding.UTF8.GetString(bytes);
                var snap = JsonUtility.FromJson<GameSnapshot>(raw);
                if (snap == null || snap.stats == null) return null;
                if (string.IsNullOrEmpty(snap.macroCycle)) snap.macroCycle = "Expansion";
                snap.jobAppsThisYear = Mathf.Max(0, snap.jobAppsThisYear);
                snap.activitiesDoneThisYear = Mathf.Max(0, snap.activitiesDoneThisYear);
                return snap;
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SaveSystem] Mã khôi phục không hợp lệ: {ex.Message}");
                return null;
            }
        }

        private static string ComputeHash(string content)
        {
            using var sha = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(content + HASH_SALT);
            byte[] hash = sha.ComputeHash(bytes);
            var sb = new StringBuilder(hash.Length * 2);
            foreach (byte b in hash)
            {
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }
    }
}
