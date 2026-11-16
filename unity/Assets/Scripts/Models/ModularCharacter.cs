using System.Collections.Generic;
using UnityEngine;
using ZeroToBillionaire.Core;

namespace ZeroToBillionaire.Models
{
    /// <summary>
    /// Quản lý hệ thống nhân vật 3D Modular:
    /// Thay đổi tóc, trang phục, phụ kiện theo độ tuổi và nghề nghiệp thực tế.
    /// </summary>
    public class ModularCharacter : MonoBehaviour
    {
        [Header("Modular Mesh Sockets")]
        [SerializeField] private Transform headSocket;
        [SerializeField] private Transform hairSocket;
        [SerializeField] private Transform torsoSocket;
        [SerializeField] private Transform legsSocket;
        [SerializeField] private Transform accessorySocket;

        [Header("Animation")]
        [SerializeField] private Animator characterAnimator;

        // Các prefab trang phục theo giai đoạn
        [Header("Outfits By Life Stage")]
        [SerializeField] private GameObject childhoodOutfit;
        [SerializeField] private GameObject studentUniformOutfit;
        [SerializeField] private GameObject casualOfficeOutfit;
        [SerializeField] private GameObject luxuryBillionaireSuit;

        private GameObject currentOutfitInstance;

        public enum CharacterAnimState
        {
            Idle,
            Typing,
            Thinking,
            Celebrate,
            Sad,
            Sleeping
        }

        public void SetAnimationState(CharacterAnimState state)
        {
            if (characterAnimator == null) return;

            characterAnimator.SetInteger("AnimState", (int)state);
            switch (state)
            {
                case CharacterAnimState.Celebrate:
                    characterAnimator.SetTrigger("CelebrateTrigger");
                    break;
                case CharacterAnimState.Sad:
                    characterAnimator.SetTrigger("SadTrigger");
                    break;
            }
        }

        public void UpdateCharacterAppearance(CharacterStats stats)
        {
            // Xóa outfit cũ
            if (currentOutfitInstance != null)
            {
                Destroy(currentOutfitInstance);
            }

            GameObject prefabToSpawn = childhoodOutfit;

            if (stats.age < 6)
            {
                prefabToSpawn = childhoodOutfit;
                transform.localScale = Vector3.one * 0.6f; // Tỉ lệ em bé
            }
            else if (stats.age < 18)
            {
                prefabToSpawn = studentUniformOutfit;
                transform.localScale = Vector3.one * 0.85f; // Tỉ lệ học sinh
            }
            else if (stats.cash < 1_000_000_000)
            {
                prefabToSpawn = casualOfficeOutfit;
                transform.localScale = Vector3.one * 1.0f; // Trưởng thành
            }
            else
            {
                prefabToSpawn = luxuryBillionaireSuit;
                transform.localScale = Vector3.one * 1.0f; // Tỷ phú vest sang trọng
            }

            if (prefabToSpawn != null && torsoSocket != null)
            {
                currentOutfitInstance = Instantiate(prefabToSpawn, torsoSocket);
            }
        }
    }
}
