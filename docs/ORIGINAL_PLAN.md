# Kế hoạch phát triển game "Life Sim 3D" (Tài liệu gốc)

> **Tên dự án:** Zero to Billionaire Simulator (Life Sim 3D)  
> **Thể loại:** Life Simulation / RPG / Branching Narrative / 3D Casual  
> **Định vị:** Sự kết hợp giữa **BitLife** (hệ thống sự kiện, rẽ nhánh cuộc đời phong phú) + **The Sims** (trực quan 3D, nhu cầu, tự do cuộc sống) + **Bối cảnh văn hóa Việt Nam**.

---

## 0. Nhận định thẳng thắn trước
Ý tưởng gộp **BitLife** (hệ thống sự kiện, rẽ nhánh) + **The Sims** (3D, tự do, xây dựng cuộc sống) + **MMO** (multiplayer). Đây là ba thể loại lớn, nên rủi ro lớn nhất là **phạm vi quá rộng**. 
* Cách an toàn là **làm theo từng giai đoạn**, và lõi game là **hệ thống mô phỏng cuộc đời**, không phải đồ họa 3D.
* Hãy chứng minh lõi này vui trước, rồi mới đầu tư 3D và multiplayer.

---

## 1. Công nghệ đề xuất
### Engine: Unity (C#) là lựa chọn phù hợp nhất
| Tiêu chí | Unity | Unreal | Godot |
| :--- | :--- | :--- | :--- |
| **PC + Android + iOS** | Rất tốt | Nặng cho mobile | Tốt, 3D yếu hơn |
| **Tài liệu, cộng đồng, asset** | Rất nhiều | Nhiều | Ít hơn |
| **Multiplayer** | Netcode, Photon, Mirror, Fusion | Có sẵn nhưng phức tạp | Cơ bản |
| **Độ khó với team nhỏ** | Vừa | Cao | Thấp |

* Game life-sim có nhiều UI, dữ liệu và logic hơn là đồ họa đỉnh cao, nên **Unity (URP)** với phong cách **low-poly hoặc stylized** là hợp lý. Đừng chọn đồ họa realistic: tốn chi phí gấp nhiều lần và mobile sẽ không chạy nổi.

### Các thành phần khác
* **Ngôn ngữ:** C# (client), và C# hoặc Go/Node.js (backend).
* **Backend:** ASP.NET Core hoặc Node.js (NestJS).
* **Database:** PostgreSQL (dữ liệu nhân vật, tài sản) + Redis (cache, trạng thái online).
* **Multiplayer:** Photon Fusion hoặc Unity Netcode cho giai đoạn đầu, dedicated server khi mở rộng.
* **Hạ tầng:** AWS/GCP/Azure hoặc VPS trong nước (Viettel, VNG Cloud, FPT Cloud) để giảm ping.
* **Công cụ phụ:** Blender (model 3D), Git + Git LFS, Jira/Trello/Notion, Firebase (analytics, crash report).
* **Nội dung sự kiện:** Lưu bằng JSON hoặc ScriptableObject, hoặc bảng Google Sheets rồi import vào game, để biên kịch thêm nội dung mà không phải sửa code.

---

## 2. Kiến trúc lõi game
### 2.1 Hệ thống nhân vật (Stats)
* **Chỉ số cơ bản:** Sức khỏe, trí tuệ, ngoại hình, hạnh phúc, tâm lý, kỷ luật, tính cách.
* **Chỉ số ẩn:** May mắn, tiềm năng, di truyền từ bố mẹ.
* **Tài chính:** Tiền mặt, nợ, tài sản (nhà, xe, đất), thu nhập, chi phí hàng tháng/năm.
* **Quan hệ:** Gia đình, bạn bè, người yêu, đồng nghiệp, kẻ thù (mỗi NPC có điểm thân thiết riêng).

### 2.2 Hệ thống sự kiện (Event Engine): Trái tim của game
Mỗi sự kiện gồm:
1. **Điều kiện kích hoạt:** Tuổi, chỉ số, nghề, vùng miền, sự kiện trước đó.
2. **Lựa chọn:** Mỗi lựa chọn có xác suất thành công phụ thuộc chỉ số nhân vật.
3. **Hậu quả:** Thay đổi chỉ số, mở hoặc khóa nhánh cuộc đời, tạo NPC mới.

Các cột mốc (tập đi, tiểu học, thi cấp 3, rớt đại học, khởi nghiệp, thất nghiệp, nghiện ngập, cưới vợ/chồng, sinh con, mua nhà) đều là node trong đồ thị cuộc đời. Kết hợp sự kiện bắt buộc theo tuổi với sự kiện ngẫu nhiên có trọng số.

### 2.3 Cơ chế "sống thật" bằng 3D
Điểm khác biệt so với BitLife thuần chữ:
* **Thời gian trôi:** 1 năm game có thể chia theo tháng hoặc chu kỳ thời gian thực, có nút tua nhanh (x1, x5, x30) và tự dừng khi có sự kiện quan trọng.
* **Nhu cầu nhân vật:** Tự hành động theo nhu cầu (ăn, ngủ, học, làm việc, giải trí).
* **Mini-game:** Thi cử, phỏng vấn, đàm phán kinh doanh, lái xe...
* **Thế giới mở thu nhỏ (Diorama):** Nhà ở, trường học, công ty, chợ/quán cà phê, bệnh viện.

### 2.4 Nhân vật theo độ tuổi
Model và animation modular cho các giai đoạn: Sơ sinh, Trẻ nhỏ, Thiếu niên, Trưởng thành, Trung niên, Về già.

### 2.5 Dữ liệu và lưu game
Lưu cục bộ (Local Persistent Storage) trước, đồng bộ Cloud (Game Center / Google Play Games / Backend) sau. Đảm bảo save file có schema versioning.

---

## 3. Hoàn cảnh xuất phát và kinh tế
| Hoàn cảnh | Đặc điểm |
| :--- | :--- |
| **Mồ côi** | Khởi đầu 0 đồng, khó khăn, sự kiện nhận nuôi, học bổng vượt khó |
| **Bình dân / Đủ đầy** | Bố mẹ lao động/công chức, tài chính cân bằng |
| **Gia đình khá giả / Trâm anh** | Vốn khởi điểm cao, quan hệ rộng, áp lực kỳ vọng |
| **Ngẫu nhiên (Gacha RNG)** | Tung xúc xắc chỉ số & gia cảnh ngẫu nhiên |
| **VIP (Supporter)** | Ưu đãi ngoại trang, lượt quay lại thời gian (Time Machine), không Pay-to-Win |

---

## 4. Lộ trình phát triển 6 giai đoạn
* **Giai đoạn 1: Prototype 2D (1–2 tháng)** - Kiểm chứng Core Loop & Event Engine.
* **Giai đoạn 2: Vertical Slice 3D (3–4 tháng)** - 1 giai đoạn hoàn chỉnh (0 - 18 tuổi) với đồ họa 3D Stylized.
* **Giai đoạn 3: Alpha Đơn người chơi (5–6 tháng)** - Vòng đời đầy đủ (0 - 80+ tuổi), 20-30 nghề nghiệp, hệ thống gia phả/thừa kế.
* **Giai đoạn 4: Beta & Phát hành Đơn người chơi (2–3 tháng)** - Cân bằng, IAP, TestFlight, Soft Launch.
* **Giai đoạn 5: Multiplayer & Xã hội (6–12 tháng sau)** - Bất đồng bộ -> Server chung -> Kinh tế người chơi.
* **Giai đoạn 6: Mở rộng quốc gia** - Gói nội dung văn hóa mới (Thái Lan, Hàn Quốc, Nhật Bản, Mỹ...).

---

## 5. Rủi ro & Điểm khác biệt cốt lõi
* **Bản sắc văn hóa Việt:** Thi tốt nghiệp THPT, áp lực họ hàng dịp Tết, lập nghiệp thành phố, mua đất nền, trà đá vỉa hè.
* **Hệ thống Nghiệp quả & Thừa kế:** Cuộc đời sau chịu ảnh hưởng từ di chúc, nợ nần, gia tài và danh tiếng của đời trước.
