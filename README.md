<div align="center">

# 💎 ZERO TO BILLIONAIRE SIMULATOR
### *Từ Tay Trắng Đến Tỉ Phú — Life Sim Pixel 2D*

[![iOS](https://img.shields.io/badge/iOS-16.0%2B-black?style=for-the-badge&logo=apple)](https://developer.apple.com/ios/)
[![Graphics](https://img.shields.io/badge/Graphics-Pixel%202D-orange?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](.github/ISSUE_TEMPLATE/event_proposal.md)

<p align="center">
  <b>Một game mô phỏng cuộc đời rẽ nhánh với cảnh pixel 2D, nhân vật thay đổi theo lựa chọn và bối cảnh đời sống Việt Nam.</b>
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
|  🏡 Thể xác game: Scene pixel 2D và nhân vật thay đổi theo tài sản|
|  🇻🇳 Linh hồn Việt Nam: Đậm chất đời sống văn hóa, gia đình   |
|  📱 Trải nghiệm iPhone: Chơi 1 tay, màn hình dọc, Taptic haptic|
+-------------------------------------------------------------+
```

---

## 🌟 Điểm khác biệt cốt lõi

### 1. Pixel Scene + Story Stream
Không còn là những trang văn bản đơn điệu! Game sử dụng bố cục chia đôi màn hình:
* **Pixel Scene:** Không gian pixel phản chiếu trực tiếp độ tuổi, câu chuyện, tâm trạng và tài sản nhân vật.
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
|             PIXEL STORY SCENE                 |
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
* **Quản lý Pin & Nhiệt độ (Thermal Protection):** Hoạt cảnh pixel nhẹ, ưu tiên thời lượng pin và thao tác ổn định trên iPhone.
* **Apple App Store Ready:** Tích hợp StoreKit 2 cho IAP (Gói ủng hộ không Pay-to-Win), khai báo Privacy Manifest iOS 17+ và Apple Sign-in / CloudKit Save.

---

## ⚙️ Hệ thống Gameplay chính

```mermaid
flowchart TD
    A[Khởi đầu ngẫu nhiên: Gia cảnh, Chỉ số] --> B[Vòng đời hàng năm: 0 - 80+ tuổi]
    B --> C[Event Engine: Đồ thị sự kiện & Lựa chọn]
    C --> D[Cập nhật Chỉ số & Tài chính]
    D --> E[Thay đổi Ngoại hình & Pixel Scene]
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
| **Engine** | Vite + Canvas 2D | Bundle web nhẹ, tương thích PWA và Capacitor |
| **Render** | Pixel art 2D procedural | Scene và nhân vật thay đổi theo câu chuyện |
| **Runtime** | JavaScript + Web Audio API | Hoạt cảnh, âm thanh và tương tác không cần engine ngoài |
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
├── web-demo/                  # Game pixel 2D, PWA và Capacitor
│   ├── index.html             # Loading, start screen, HUD và story scene
│   ├── main.js                # Game loop, sự kiện, chỉ số và hoạt cảnh
│   └── style.css              # Luxury mobile UI
├── .gitattributes             # Cấu hình Git LFS cho asset
├── .gitignore                 # Bộ lọc hệ điều hành và build
├── LICENSE                    # Giấy phép phần mềm mã nguồn mở MIT
└── README.md                  # Tài liệu tổng quan dự án
```

---

## 🗺️ Lộ trình Phát triển (Roadmap)

- [x] **Giai đoạn 0: Thiết lập & Lập kế hoạch**
  - [x] Phân tích GDD và kiến trúc kỹ thuật.
  - [x] Thiết lập chuẩn Repository, Git LFS, CI Workflow.
  - [x] Xây dựng kế hoạch tối ưu hóa chuyên sâu cho iOS/iPhone.
- [ ] **Giai đoạn 1: Prototype Core Loop (Tháng 1 - 2)**
  - [ ] Xây dựng Event Engine hoàn chỉnh (Data-driven JSON).
  - [ ] Tạo 100 sự kiện đầu đời (0 - 18 tuổi).
  - [ ] Xuất bản build TestFlight đầu tiên cho nội bộ thử nghiệm gameplay chữ.
- [x] **Giai đoạn 2: Vertical Slice Pixel 2D Mobile (Tháng 3 - 4)**
  - [x] Dựng scene pixel, nhân vật procedural và hoạt cảnh câu chuyện.
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
* **Xcode:** Phiên bản 15.0+ (nếu build ra thiết bị iPhone/iPad).
* **Git LFS:** Đã cài đặt `git lfs` trên máy tính (`git lfs install`).

### Các bước khởi tạo
1. **Clone repository (kèm LFS):**
   ```bash
   git clone https://github.com/lukhachyaros/Zero-to-Billionaire-Simulator.git
   cd Zero-to-Billionaire-Simulator
   git lfs pull
   ```
### 🌐 Chạy demo pixel 2D trên web

Demo web độc lập nằm trong [web-demo/](web-demo/). Bản prototype hiện dùng pixel art 2D để ưu tiên vòng lặp mô phỏng và nội dung sự kiện:

```powershell
cd web-demo
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`. Luồng chơi gồm loading screen, chọn hoàn cảnh xuất phát, tua thời gian theo tốc độ và sự kiện bắt buộc từ lúc sinh ra đến hết cấp 3. Mỗi lựa chọn cập nhật chỉ số và sprite pixel của nhân vật (tóc, màu áo, kính, phụ kiện, biểu cảm).

Demo đã có manifest PWA, service worker và cấu hình Capacitor tại [web-demo/](web-demo/). Logo hiện tại được dùng làm icon giao diện và iOS tại [logo.png](web-demo/public/icons/logo.png). Trên iPhone, mở bằng Safari rồi chọn **Share -> Add to Home Screen** để cài như ứng dụng.

Để chuẩn bị project iOS trên macOS:

```bash
cd web-demo
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

Việc build/sign App Store cần macOS, Xcode, Apple Developer account và bộ icon iOS hợp lệ.

---

## ✍️ Hướng dẫn Viết Kịch bản / Sự kiện

Bạn không cần biết lập trình vẫn có thể đóng góp vào kho tàng hàng ngàn câu chuyện rẽ nhánh của game!

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

Dự án phát triển theo giấy phép mã nguồn mở [MIT License](LICENSE). Mọi ý kiến đóng góp kịch bản pixel, hoạt cảnh và đề xuất tính năng đều được hoan nghênh nồng nhiệt!

<div align="center">
  <sub>Được ấp ủ và phát triển với niềm tự hào game mô phỏng Việt Nam 🇻🇳</sub>
</div>
