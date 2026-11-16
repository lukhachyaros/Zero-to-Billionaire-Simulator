<div align="center">

# 💎 ZERO TO BILLIONAIRE SIMULATOR
### *Từ Tay Trắng Đến Tỉ Phú — Life Sim 3D*

[![Unity](https://img.shields.io/badge/Unity-2022.3%20%2F%20Unity%206-black?style=for-the-badge&logo=unity)](https://unity.com/)
[![iOS](https://img.shields.io/badge/iOS-16.0%2B-black?style=for-the-badge&logo=apple)](https://developer.apple.com/ios/)
[![Graphics API](https://img.shields.io/badge/Graphics-Apple%20Metal-orange?style=for-the-badge)](https://developer.apple.com/metal/)
[![Language](https://img.shields.io/badge/Language-C%23-blue?style=for-the-badge&logo=c-sharp)](https://dotnet.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](.github/ISSUE_TEMPLATE/event_proposal.md)

<p align="center">
  <b>Sự kết hợp giữa chiều sâu mô phỏng cuộc đời rẽ nhánh của BitLife và thế giới 3D trực quan sống động của The Sims — gói trọn trong bối cảnh đời sống Việt Nam.</b>
</p>

[Tài liệu Kế hoạch Gốc](docs/ORIGINAL_PLAN.md) • [Kế hoạch Phát triển iOS](docs/IOS_DEVELOPMENT_PLAN.md) • [Bộ kịch bản mẫu](data/events/sample_events.json) • [Đóng góp sự kiện](.github/ISSUE_TEMPLATE/event_proposal.md)

---

</div>

## 📖 Mục lục
- [Giới thiệu dự án](#-giới-thiệu-dự-án)
- [Điểm khác biệt cốt lõi](#-điểm-khác-biệt-cốt-lõi)
- [Giao diện & Trải nghiệm iOS (Mobile-First)](#-giao-diện--trải-nghiệm-ios-mobile-first)
- [Hệ thống Gameplay chính](#-hệ-thống-gameplay-chính)
- [Kiến trúc Kỹ thuật & Tối ưu iOS](#-kiến-trúc-kỹ-thuật--tối-ưu-ios)
- [Cấu trúc Thư mục Dự án](#-cấu-trúc-thư-mục-dự-án)
- [Lộ trình Phát triển (Roadmap)](#-lộ-trình-phát-triển-roadmap)
- [Hướng dẫn Cài đặt & Chạy Dự án](#-hướng-dẫn-cài-đặt--chạy-dự-án)
- [Hướng dẫn Viết Kịch bản / Sự kiện](#-hướng-dẫn-viết-kịch-bản--sự-kiện)
- [Đóng góp & Giấy phép](#-đóng-góp--giấy-phép)

---

## 💡 Giới thiệu dự án

**Zero to Billionaire Simulator** là tựa game mô phỏng cuộc đời (Life Simulation / RPG) dành cho thiết bị di động, lấy trọng tâm tối ưu hóa cho hệ sinh thái **iOS / iPhone**.

Bắt đầu từ một đứa trẻ sơ sinh với hoàn cảnh ngẫu nhiên (từ mồ côi cơ cực, gia đình bình dân đến con nhà trâm anh thế phiệt), bạn sẽ tự tay đưa ra từng quyết định trong cuộc đời: học vấn, kết giao bạn bè, chọn nghề lập nghiệp, đối mặt biến cố, tích lũy tài sản và lập nên gia tộc tỷ đô truyền đời.

```
+-------------------------------------------------------------+
|                      TRIẾT LÝ THIẾT KẾ                      |
+-------------------------------------------------------------+
|  🧠 Bộ não BitLife : Đồ thị sự kiện rẽ nhánh sâu sắc, đa dạng|
|  🏡 Thể xác The Sims: Phòng 3D Diorama Low-poly đổi theo tài sản|
|  🇻🇳 Linh hồn Việt Nam: Đậm chất đời sống văn hóa, gia đình   |
|  📱 Trải nghiệm iPhone: Chơi 1 tay, màn hình dọc, Taptic haptic|
+-------------------------------------------------------------+
```

---

## 🌟 Điểm khác biệt cốt lõi

### 1. Hybrid 3D Diorama + Action Stream
Không còn là những trang văn bản đơn điệu! Game sử dụng bố cục chia đôi màn hình:
* **Nửa trên (3D Diorama):** Không gian sống 3D Isometric phản chiếu trực tiếp độ tuổi, độ giàu có và tâm trạng nhân vật (từ phòng trọ 10m² chật hẹp thời sinh viên đến dinh thự Penthouse triệu đô).
* **Nửa dưới (Event Stream):** Dòng thời gian mượt mà với các thẻ quyết định vuốt/chạm nhanh bằng một ngón tay cái.

### 2. Bản sắc Văn hóa Việt Nam chân thực
* **Giáo dục & Thi cử:** Áp lực thi vào lớp 10, kỳ thi Tốt nghiệp THPT, học đại học top đầu hay học nghề thực chiến.
* **Đời sống & Gia đình:** Áp lực câu hỏi họ hàng ngày Tết ("Bao giờ lấy chồng/vợ?", "Lương tháng bao nhiêu?"), văn hóa phong bao lì xì mùng 1, ăn cơm nhà vs lê la trà đá vỉa hè.
* **Kinh tế & Đầu tư:** Đi làm công chức, làm freelancer, khởi nghiệp quán ăn, đón sóng chứng khoán hoặc săn đất nền ven đô.

### 3. Nghiệp quả & Gia phả Truyền đời (Dynasty Inheritance)
* Khi nhân vật qua đời ở tuổi già (hoặc biến cố bất ngờ), bạn có thể **tiếp tục hành trình bằng đời con cháu**.
* Di chúc, danh tiếng dòng họ, bất động sản hoặc những món nợ chưa trả từ đời cha mẹ sẽ tác động trực tiếp lên thế hệ sau.

---

## 📱 Giao diện & Trải nghiệm iOS (Mobile-First)

Tối ưu hóa chuyên sâu cho người dùng iPhone:

```
+-----------------------------------------------+
|  [ Notch / Dynamic Island - Safe Area ]       |
|                                               |
|           3D ISOMETRIC DIORAMA VIEW           |
|      (Phòng ở, Nội thất, Hoạt ảnh nhân vật)   |
|                                               |
+-----------------------------------------------+
|  Năm: 26 Tuổi | Tài sản: 850.000.000 VNĐ      |
|  Sức khỏe: [======  ] Hạnh phúc: [======== ] |
+-----------------------------------------------+
|  DÒNG THỜI GIAN SỰ KIỆN                       |
|  • Bạn được thăng chức lên Trưởng nhóm.       |
|  • Bạn gái rủ đi du lịch Đà Lạt cuối tuần.   |
|                                               |
|  +-----------------------------------------+  |
|  | THẺ QUYẾT ĐỊNH: Lời mời góp vốn mở quán |  |
|  | [Góp 200tr] [Từ chối khéo] [Xem xét lại]|  |
|  +-----------------------------------------+  |
|                                               |
|             [ +1 TUỔI NÀO! ]                  |
+-----------------------------------------------+
| [Nhân vật]  [Học/Làm]  [Tài sản]  [Xã hội]   |
|  [ Home Indicator Bar - Safe Area ]           |
+-----------------------------------------------+
```

* **Apple Taptic Engine:** Phản hồi xúc giác chân thật qua từng cú chạm chọn lựa, rung mạnh khi trúng giải đặc biệt hay gặp tai nạn bất ngờ.
* **Quản lý Pin & Nhiệt độ (Thermal Protection):** Chạy **60 FPS** khi xem hoạt cảnh 3D; tự động chuyển về **30 FPS** khi người chơi dừng đọc nội dung hoặc mở popup chi tiết để giữ iPhone luôn mát mẻ.
* **Apple App Store Ready:** Tích hợp StoreKit 2 cho IAP (Gói ủng hộ không Pay-to-Win), khai báo Privacy Manifest iOS 17+ và Apple Sign-in / CloudKit Save.

---

## ⚙️ Hệ thống Gameplay chính

```mermaid
flowchart TD
    A[Khởi đầu ngẫu nhiên: Gia cảnh, Chỉ số] --> B[Vòng đời hàng năm: 0 - 80+ tuổi]
    B --> C[Event Engine: Đồ thị sự kiện & Lựa chọn]
    C --> D[Cập nhật Chỉ số & Tài chính]
    D --> E[Thay đổi Ngoại hình & Căn phòng 3D]
    E --> F{Nhân vật qua đời?}
    F -- Chưa --> B
    F -- Đã qua đời --> G[Viết Di chúc & Thừa kế đời sau]
    G --> A
```

* **Chỉ số cá nhân:** Sức khỏe, Trí tuệ, Ngoại hình, Hạnh phúc, Tâm lý, Kỷ luật, Quan hệ gia đình.
* **Tài chính & Kinh tế:** Tiền mặt, Nợ vay ngân hàng, Thu nhập thụ động, Bất động sản, Cổ phiếu, Doanh nghiệp riêng.
* **Hệ thống sự kiện Data-driven:** Lưu trữ độc lập dưới dạng JSON, cho phép cập nhật hàng ngàn tình huống mới qua Cloud mà không cần cập nhật lại ứng dụng trên App Store.

---

## 🛠️ Kiến trúc Kỹ thuật & Tối ưu iOS

| Thành phần | Công nghệ lựa chọn | Mục đích |
| :--- | :--- | :--- |
| **Engine** | Unity 2022.3 LTS / Unity 6 LTS | Ổn định, tương thích xuất sắc với iOS |
| **Render Pipeline** | Universal Render Pipeline (URP) | Render Low-poly Stylized siêu nhẹ |
| **Graphics API** | Apple Metal | Tối đa hóa hiệu năng GPU Apple Silicon |
| **Texture Format** | ASTC (4x4, 6x6, 8x8) | Nén ảnh chất lượng cao với dung lượng bộ nhớ tối thiểu |
| **Draw Calls Budget** | < 100 calls / frame | Đảm bảo mượt mà ngay cả trên iPhone 11 |
| **RAM Runtime** | < 350 MB | Ngăn ngừa iOS Watchdog tắt ứng dụng đột ngột |
| **Save System** | Encrypted JSON + SQLite + CloudKit | Lưu an toàn tại máy và đồng bộ iCloud |

---

## 📂 Cấu trúc Thư mục Dự án

```
Zero-to-Billionaire-Simulator/
├── .github/
│   ├── workflows/             # CI/CD GitHub Actions kiểm tra tính hợp lệ dữ liệu
│   └── ISSUE_TEMPLATE/        # Mẫu báo cáo lỗi & đóng góp kịch bản
├── data/
│   └── events/                # Toàn bộ kịch bản sự kiện (JSON)
│       └── sample_events.json # File sự kiện mẫu minh họa
├── docs/
│   ├── ORIGINAL_PLAN.md       # Kế hoạch phát triển game gốc
│   └── IOS_DEVELOPMENT_PLAN.md # Kế hoạch chi tiết tối ưu hóa trên iOS
├── unity/                     # Dự án Unity Game Client
│   └── Assets/
│       ├── Scripts/
│       │   ├── Core/          # Quản lý vòng lặp game, chỉ số, tài chính
│       │   ├── Events/        # Event Parser, Condition Evaluator, Trigger
│       │   ├── UI/            # Giao diện người dùng Portrait & Safe Area
│       │   └── Mobile/iOS/    # Taptic Engine, StoreKit, Apple Services
│       ├── Models/            # 3D Low-poly models & Animations
│       └── Resources/Data/    # Cấu hình & Dữ liệu tải nhanh
├── .gitattributes             # Cấu hình Git LFS cho 3D, Texture, Audio
├── .gitignore                  # Bộ lọc hoàn chỉnh cho Unity, iOS/Xcode & OS
├── LICENSE                    # Giấy phép phần mềm mã nguồn mở MIT
└── README.md                  # Tài liệu tổng quan dự án
```

---

## 🗺️ Lộ trình Phát triển (Roadmap)

- [x] **Giai đoạn 0: Thiết lập & Lập kế hoạch**
  - [x] Phân tích GDD và kiến trúc kỹ thuật.
  - [x] Thiết lập chuẩn Repository, Git LFS, .gitignore Unity/iOS, CI Workflow.
  - [x] Xây dựng kế hoạch tối ưu hóa chuyên sâu cho iOS/iPhone.
- [ ] **Giai đoạn 1: Prototype Core Loop (Tháng 1 - 2)**
  - [ ] Xây dựng Event Engine hoàn chỉnh (Data-driven JSON).
  - [ ] Tạo 100 sự kiện đầu đời (0 - 18 tuổi).
  - [ ] Xuất bản build TestFlight đầu tiên cho nội bộ thử nghiệm gameplay chữ.
- [ ] **Giai đoạn 2: Vertical Slice 3D Mobile (Tháng 3 - 4)**
  - [ ] Dựng khung hiển thị 3D Diorama Isometric với Unity URP.
  - [ ] Hệ thống nhân vật modular (trẻ sơ sinh, thiếu niên).
  - [ ] Tích hợp Apple Taptic Engine và giao diện Safe Area dọc.
- [ ] **Giai đoạn 3: Alpha Toàn bộ Vòng đời (Tháng 5 - 7)**
  - [ ] Hoàn thiện vòng đời từ 18 - 80+ tuổi (30+ ngành nghề, mua bán nhà, lập gia đình).
  - [ ] Hệ thống Gia phả, Di chúc và Thừa kế đời sau.
  - [ ] Đạt mốc 500+ sự kiện đậm chất đời sống Việt Nam.
- [ ] **Giai đoạn 4: Closed Beta & Soft Launch iOS (Tháng 8 - 9)**
  - [ ] Mở rộng 300 tester trên Apple TestFlight.
  - [ ] Tích hợp StoreKit 2 IAP & Quảng cáo nhận thưởng.
  - [ ] Ra mắt chính thức trên Apple App Store Việt Nam.
- [ ] **Giai đoạn 5: Multiplayer & Mở rộng Quốc tế (Tháng 10+)**
  - [ ] Tính năng xã hội bất đồng bộ (Bảng xếp hạng đại gia, ghé thăm cơ ngơi bạn bè).
  - [ ] Gói nội dung bản địa hóa các quốc gia khác (Thái Lan, Hàn Quốc, Nhật Bản...).

---

## 🚀 Hướng dẫn Cài đặt & Chạy Dự án

### Yêu cầu tiên quyết
* **Hệ điều hành:** macOS (khuyến nghị để build Xcode/iOS) hoặc Windows 10/11.
* **Unity Hub & Engine:** Unity **2022.3 LTS** (hoặc Unity 6 LTS) có cài đặt module **iOS Build Support**.
* **Xcode:** Phiên bản 15.0+ (nếu build ra thiết bị iPhone/iPad).
* **Git LFS:** Đã cài đặt `git lfs` trên máy tính (`git lfs install`).

### Các bước khởi tạo
1. **Clone repository (kèm LFS):**
   ```bash
   git clone https://github.com/lukhachyaros/Zero-to-Billionaire-Simulator.git
   cd Zero-to-Billionaire-Simulator
   git lfs pull
   ```
2. **Mở dự án trong Unity:**
   * Mở **Unity Hub** -> Chọn **Add project from disk**.
   * Chọn thư mục `unity/` trong repository.
   * Chờ Unity hoàn tất nạp Package và khởi tạo Shader cache.
3. **Chuyển nền tảng sang iOS:**
   * Vào `File` -> `Build Settings`.
   * Chọn nền tảng **iOS** -> Bấm **Switch Platform**.
   * Trong phần `Player Settings`:
     * Target minimum iOS version: `16.0`.
     * Graphics API: `Metal`.
     * Texture Compression: `ASTC`.

---

## ✍️ Hướng dẫn Viết Kịch bản / Sự kiện

Bạn không cần biết lập trình Unity vẫn có thể đóng góp vào kho tàng hàng ngàn câu chuyện rẽ nhánh của game!

Mỗi sự kiện được định nghĩa đơn giản trong thư mục [`data/events/`](data/events/sample_events.json):

```json
{
  "eventId": "evt_unique_id",
  "title": "Tiêu đề tình huống",
  "minAge": 18,
  "maxAge": 25,
  "description": "Đoạn văn miêu tả sự việc xảy ra...",
  "options": [
    {
      "id": "opt_choice_a",
      "label": "Lựa chọn hành động A",
      "outcomes": [
        {
          "probability": 0.8,
          "message": "Kết quả nếu thành công!",
          "statModifiers": { "money": 10000000, "happiness": 10 }
        }
      ]
    }
  ]
}
```

👉 Hãy tạo một [Pull Request](https://github.com/lukhachyaros/Zero-to-Billionaire-Simulator/pulls) hoặc gửi đề xuất tại [Event Proposal Template](.github/ISSUE_TEMPLATE/event_proposal.md).

---

## 🤝 Đóng góp & Giấy phép

Dự án phát triển theo giấy phép mã nguồn mở [MIT License](LICENSE). Mọi ý kiến đóng góp kịch bản, 3D low-poly model hoặc đề xuất tính năng đều được hoan nghênh nồng nhiệt!

<div align="center">
  <sub>Được ấp ủ và phát triển với niềm tự hào game mô phỏng Việt Nam 🇻🇳</sub>
</div>
