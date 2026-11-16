# Kế hoạch & Kiến trúc Phát triển Game trên Mobile (iOS / iPhone)
## Dự án: Zero to Billionaire Simulator (Life Sim 3D)

---

## 1. Tầm nhìn & Định vị trên iOS
Game mô phỏng cuộc đời (**Life Simulation**) là một trong những thể loại có độ gắn kết người chơi cao nhất trên di động (ví dụ: *BitLife*, *AltLife*, *The Sims Mobile*). Tuy nhiên, hầu hết các game hiện nay hoặc là **thuần văn bản (Text-based 2D)** gây nhàm chán thị giác sau thời gian dài, hoặc là **3D cồng kềnh (The Sims)** với thời gian tải lâu và thao tác phức tạp trên màn hình cảm ứng.

**Zero to Billionaire Simulator** định vị là sản phẩm tiên phong:
* **Hybrid Visuals:** Kết hợp chiều sâu nội dung rẽ nhánh cực phong phú (kiểu BitLife) với không gian mô phỏng 3D thu nhỏ (**Isometric Diorama 3D**) sống động, mượt mà trên iPhone.
* **One-Thumb Portrait Gameplay:** Tối ưu hóa 100% cho thao tác cầm dọc bằng một tay, dễ dàng chơi ở bất kỳ đâu (xe buýt, giờ nghỉ trưa, trước khi ngủ).
* **Bản sắc văn hóa Việt:** Mang hơi thở đời thực từ quê lên phố, học hành thi cử, khởi nghiệp, mua nhà tậu xe, lập gia đình và xây dựng đế chế gia tộc.

---

## 2. Thiết kế Giao diện & Trải nghiệm Người dùng (iOS UX/UI)

### 2.1 Bố cục Màn hình Dọc (Portrait Hybrid Split-Screen)
Để giải quyết bài toán vừa đọc nhiều nội dung vừa ngắm nhìn nhân vật 3D:
* **Phần trên (Upper 35% - 40%): Cửa sổ 3D Diorama**
  * Hiển thị căn phòng, ngôi nhà, văn phòng làm việc hoặc khung cảnh đường phố thu nhỏ dạng Isometric Low-poly.
  * Nhân vật 3D tự động phản hồi theo cảm xúc và trạng thái (ngủ gật khi mệt, nhảy múa khi trúng số, khóc khi thất tình, già đi theo năm tháng).
  * Cho phép người chơi vuốt nhẹ để xoay góc nhìn 45 độ hoặc chạm vào vật phẩm trong phòng để tương tác nhanh.
* **Phần dưới (Lower 60% - 65%): Dòng thời gian sự kiện & Bảng điều khiển (Action Stream)**
  * Hiển thị dòng sự kiện chính (Age Stream / Feed).
  * Nút "Thêm 1 Tuổi" (Age Up Button) to, nổi bật ở vị trí ngón cái thuận tiện nhất.
  * Hộp thoại quyết định (Decision Cards) xuất hiện dạng trượt bottom-sheet mượt mà chuẩn iOS HIG (Human Interface Guidelines).
  * Thanh Tab Bar cố định phía dưới: `Cuộc đời`, `Chỉ số & Nhu cầu`, `Tài sản & Đầu tư`, `Quan hệ`, `Nghề nghiệp`.

```
+------------------------------------------+
|  [Dynamic Island / Status Bar - Safe]    |
|                                          |
|        3D ISOMETRIC DIORAMA VIEW         |
|      (Nhân vật 3D & Phòng ốc sống động)   |
|                                          |
+------------------------------------------+
|  Năm: 24 Tuổi | Tiền: 250.000.000 VNĐ    |
|  Sức khỏe: [==== ] Hạnh phúc: [=======] |
+------------------------------------------+
|  DÒNG SỰ KIỆN (EVENT TIMELINE STREAM)    |
|  - Bạn vừa nhận được lời mời phỏng vấn   |
|  - Giá cổ phiếu công nghệ tăng 12%       |
|                                          |
|  +------------------------------------+  |
|  | THẺ SỰ KIỆN: Bạn gái đòi chia tay? |  |
|  | [Níu kéo] [Chấp nhận] [Tặng quà]   |  |
|  +------------------------------------+  |
|                                          |
|             [ +1 TUỔI ]                  |
+------------------------------------------+
| [Nhân vật] [Học/Làm] [Tài sản] [Xã hội]  |
|  [Home Indicator Bar - Safe Area]        |
+------------------------------------------+
```

### 2.2 Tối ưu hóa chuẩn iOS
* **Safe Area Handling:** Tự động điều chỉnh layout né tai thỏ (Notch), Dynamic Island (iPhone 14 Pro đến 16 Pro) và vạch điều hướng (Home Bar).
* **Taptic Engine (Apple Core Haptics):** 
  * Rung nhẹ (*Light Haptic*) khi bấm nút chọn lựa chọn thông thường.
  * Rung thành công (*Success Haptic*) khi thăng chức, đỗ đại học, mua nhà.
  * Rung cảnh báo/thất bại (*Warning/Error Haptic*) khi bị đuổi việc, phá sản, bệnh nặng.
* **Dynamic Type & Typography:** Hỗ trợ phông chữ bo tròn hiện đại, dễ đọc trên màn hình Retina (San Francisco Compact hoặc bộ font Việt hóa tương thích cao).

---

## 3. Kiến trúc Kỹ thuật & Tối ưu Đồ họa trên iOS

### 3.1 Target Matrix thiết bị
* **Hệ điều hành tối thiểu:** iOS 16.0+.
* **Thiết bị tối thiểu:** iPhone 11 (Apple A13 Bionic, 4GB RAM).
* **Thiết bị khuyến nghị:** iPhone 13 trở lên (A15 Bionic, GPU 4-5 cores).
* **Mục tiêu hiệu năng:**
  * Khởi động game < 2.5 giây.
  * Khung hình: 60 FPS ổn định trong các hoạt cảnh 3D.
  * Tiêu thụ RAM runtime: < 350 MB (tránh bị iOS Watchdog kill).
  * Tiêu thụ pin: < 8% pin cho 30 phút chơi liên tục.

### 3.2 Đồ họa & Rendering Pipeline
* **Engine:** Unity LTS (2022.3 LTS hoặc Unity 6 LTS) với **Universal Render Pipeline (URP)**.
* **Graphics API:** Apple Metal độc quyền (bỏ hoàn toàn OpenGL ES).
* **Texture Compression:** **ASTC (4x4 cho UI chi tiết, 6x6 hoặc 8x8 cho 3D textures)**.
* **Geometry Budget:**
  * Tối đa 60.000 – 100.000 polygons hiển thị cùng lúc trong khung Diorama.
  * Draw calls: Duy trì < 80 – 120 calls/frame bằng cách sử dụng **Texture Atlasing**, **URP SRP Batcher**, và **GPU Instancing**.
* **Adaptive Frame Rate (Quản lý nhiệt & pin):**
  * Khi người chơi tương tác hoặc xem animation 3D: Chạy **60 FPS**.
  * Khi mở popup đọc nội dung dài hoặc không chạm màn hình quá 5 giây: Tự động hạ xuống **30 FPS** để làm mát chip Apple Silicon và tránh hiện tượng tụt sáng màn hình (Thermal Throttling).

---

## 4. Mô hình Dữ liệu (Data-Driven Architecture)
Mọi kịch bản, sự kiện và nhánh lựa chọn đều được tách rời khỏi mã nguồn (Code), lưu trữ dưới dạng **JSON Schemas**:

```json
{
  "eventId": "evt_college_exam_01",
  "title": "Kỳ thi Tốt nghiệp THPT & Đại học",
  "ageRange": [17, 18],
  "conditions": {
    "minIntelligence": 50
  },
  "options": [
    {
      "text": "Ôn thi ngày đêm vào trường Top (Bách Khoa, Ngoại Thương)",
      "successRateFormula": "intelligence * 0.8 + discipline * 0.2",
      "onSuccess": {
        "statChanges": { "intelligence": 15, "stress": 30 },
        "careerBranch": "university_top"
      },
      "onFail": {
        "statChanges": { "happiness": -25, "stress": 40 },
        "careerBranch": "gap_year"
      }
    },
    {
      "text": "Học trường nghề hoặc cao đẳng thực hành",
      "successRateFormula": "1.0",
      "onSuccess": {
        "statChanges": { "happiness": 5, "money": -20000000 },
        "careerBranch": "vocational"
      }
    }
  ]
}
```

* Dữ liệu sự kiện được cập nhật linh hoạt từ xa (Remote Config / Unity Addressables) mà không cần phải nộp lại bản build lên App Store cho mỗi lần thêm cốt truyện mới.

---

## 5. Chiến lược Phát hành App Store & Kiếm tiền (Monetization)

### 5.1 Tuân thủ chính sách Apple App Store
* **In-App Purchase (IAP - StoreKit 2):** Toàn bộ giao dịch tiền thật đều đi qua hệ thống IAP của Apple.
* **Privacy Manifest (iOS 17+):** Khai báo minh bạch các API thu thập dữ liệu (UserDefaults, File timestamp, System boot time) theo chuẩn quy định mới nhất của Apple.
* **App Tracking Transparency (ATT):** Hiển thị popup xin quyền theo dõi lịch sự và đúng thời điểm (chỉ khi người chơi chọn xem quảng cáo nhận thưởng).
* **Nội dung nhạy cảm (Guideline 1.1 / 1.2):** Các yếu tố nhạy cảm (nợ nần, cờ bạc, tệ nạn) được xây dựng dưới góc độ **bài học cảnh tỉnh và hậu quả pháp lý**, tuyệt đối không cổ xúy hoặc hiển thị hình ảnh trực quan vi phạm nguyên tắc cộng đồng của Apple.

### 5.2 Mô hình Doanh thu Lành mạnh (Không Pay-to-Win)
1. **Gói Thẻ Căn Cước Ưu Tú (Supporter VIP - One-time In-App Purchase):**
   * Xóa toàn bộ quảng cáo xen kẽ vĩnh viễn.
   * Mở khóa tính năng **Cỗ máy thời gian (Time Machine)**: Cho phép quay lại 1-2 năm trước để sửa chữa quyết định sai lầm.
   * Mở khóa chế độ **Gia tộc & Thừa kế vô hạn**: Tiếp tục điều khiển đời con cháu không giới hạn.
2. **Rewarded Video Ads (Quảng cáo nhận thưởng):**
   * Xem quảng cáo ngắn để hồi phục năng lượng, nhận thêm cơ hội phỏng vấn hoặc giải hạn rủi ro nhỏ.
3. **Cosmetics & Theme Packs:**
   * Gói thời trang nhân vật (Áo dài, Vest doanh nhân, Trang phục đường phố).
   * Gói trang trí căn hộ (Penthouse triệu đô, Nhà phố cổ Hà Nội, Biệt thự ven biển).

---

## 6. Lộ trình Triển khai trên iOS (iOS Roadmap)

```
[Tháng 1-2] Prototype Core & Event Engine (Chạy trên TestFlight)
     |
[Tháng 3-4] Vertical Slice 3D (0 - 18 tuổi, URP Low-poly, Touch UI)
     |
[Tháng 5-7] Alpha: Full Life Cycle (18 - 80+ tuổi, 30 nghề nghiệp, Bất động sản)
     |
[Tháng 8]   Closed Beta trên Apple TestFlight (300 testers Việt Nam)
     |
[Tháng 9]   Soft Launch App Store Vietnam -> Tối ưu chỉ số Retention D1, D7, D30
     |
[Tháng 10+] Mở rộng Multiplayer Asynchronous & Bản địa hóa Đông Nam Á
```

---

## 7. Quy trình CI/CD & Quản lý Mã nguồn iOS
* **Repository Git:** Sử dụng **Git LFS** cho toàn bộ 3D models (.fbx, .blend), textures (.png, .psd) và audio (.wav, .mp3).
* **Automated Linting & Unity Test Runner:** Tự động kiểm tra cú pháp C# và unit test cho Event Engine mỗi khi tạo Pull Request.
* **Build Automation:** Sử dụng GitHub Actions kết hợp Fastlane để tự động xuất bản build lên **Apple TestFlight** sau mỗi commit vào nhánh `main`.
