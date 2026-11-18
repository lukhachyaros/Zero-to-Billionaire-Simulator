using System;
using UnityEngine;

namespace ZeroToBillionaire.Core
{
    /// <summary>
    /// Quản lý vé chơi lại, xem quảng cáo nhận thưởng và các gói hỗ trợ khởi đầu / VIP.
    /// Lượt đời đầu tiên hoàn toàn miễn phí; các lượt chơi lại sau yêu cầu xem quảng cáo hoặc mở gói hỗ trợ.
    /// </summary>
    public class MonetizationSystem : MonoBehaviour
    {
        public static MonetizationSystem Instance { get; private set; }

        private const string KEY_LIVES_STARTED = "ztb_lives_started";
        private const string KEY_REPLAY_TICKETS = "ztb_replay_tickets";
        private const string KEY_STARTER_LEFT = "ztb_starter_left";
        private const string KEY_AD_BONUS = "ztb_ad_bonus";
        private const string KEY_VIP = "ztb_vip_forever";

        public int TotalLivesStarted { get; private set; }
        public int ReplayTicketCount { get; private set; }
        public int StarterLivesLeft { get; private set; }
        public bool AdBonusPending { get; private set; }
        public bool IsVipUnlocked { get; private set; }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadState();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void LoadState()
        {
            TotalLivesStarted = PlayerPrefs.GetInt(KEY_LIVES_STARTED, 0);
            ReplayTicketCount = PlayerPrefs.GetInt(KEY_REPLAY_TICKETS, 0);
            StarterLivesLeft = PlayerPrefs.GetInt(KEY_STARTER_LEFT, 0);
            AdBonusPending = PlayerPrefs.GetInt(KEY_AD_BONUS, 0) == 1;
            IsVipUnlocked = PlayerPrefs.GetInt(KEY_VIP, 0) == 1;
        }

        private void SaveState()
        {
            PlayerPrefs.SetInt(KEY_LIVES_STARTED, TotalLivesStarted);
            PlayerPrefs.SetInt(KEY_REPLAY_TICKETS, ReplayTicketCount);
            PlayerPrefs.SetInt(KEY_STARTER_LEFT, StarterLivesLeft);
            PlayerPrefs.SetInt(KEY_AD_BONUS, AdBonusPending ? 1 : 0);
            PlayerPrefs.SetInt(KEY_VIP, IsVipUnlocked ? 1 : 0);
            PlayerPrefs.Save();
        }

        public bool CanStartNewLifeFree()
        {
            return TotalLivesStarted == 0 || IsVipUnlocked || ReplayTicketCount > 0;
        }

        public void CompleteRewardedAdForReplay()
        {
            ReplayTicketCount += 1;
            AdBonusPending = true;
            SaveState();
        }

        public void UnlockStarterPack()
        {
            ReplayTicketCount += 3;
            StarterLivesLeft += 3;
            SaveState();
        }

        public void UnlockVipPack()
        {
            IsVipUnlocked = true;
            SaveState();
        }

        public void ConsumeReplayAndApplyPerks(CharacterStats stats)
        {
            if (TotalLivesStarted >= 1 && !IsVipUnlocked && ReplayTicketCount > 0)
            {
                ReplayTicketCount -= 1;
            }
            TotalLivesStarted += 1;

            if (stats != null)
            {
                if (IsVipUnlocked)
                {
                    stats.intelligence += 15;
                    stats.luck += 15;
                    stats.comingOfAgeGrant += 50_000_000L;
                }
                else if (StarterLivesLeft > 0)
                {
                    stats.luck += 12;
                    stats.health += 10;
                    stats.comingOfAgeGrant += 25_000_000L;
                    StarterLivesLeft -= 1;
                }

                if (AdBonusPending)
                {
                    stats.luck += 5;
                    stats.comingOfAgeGrant += 3_000_000L;
                    AdBonusPending = false;
                }
                stats.ClampStats();
            }

            SaveState();
        }
    }
}
