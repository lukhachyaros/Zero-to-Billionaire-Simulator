# Hướng dẫn & Tiêu chuẩn Kỹ thuật 3D Art Pipeline (iOS Mobile)
## Dự án: Zero to Billionaire Simulator (Life Sim 3D)

---

## 1. Định hướng Phong cách Nghệ thuật (Art Direction)
* **Phong cách:** **Stylized Low-poly / Cozy Isometric** (tương tự phong cách của *Crossy Road*, *Synty Studios*, *Pocket City* và *Animal Crossing*).
* **Bảng màu:** Tươi sáng, ấm áp, độ tương phản cao, mang lại cảm giác thân thiện, thư giãn (cozy) nhưng hiện đại.
* **Tỷ lệ nhân vật:** Chibi cách điệu (tỷ lệ 1:2.5 hoặc 1:3), đầu to mắt sáng để dễ dàng biểu đạt cảm xúc trên màn hình điện thoại di động nhỏ.

---

## 2. Tiêu chuẩn Kỹ thuật Model 3D (Poly Budget & Topology)

### 2.1 Ngân sách Polygon cho Mobile (iOS Metal URP)
| Đối tượng 3D | Số Polygons (Tris) tối đa | Số Bones (Xương) | Số Material tối đa |
| :--- | :--- | :--- | :--- |
| **Nhân vật chính (Full Body)** | 1.800 – 2.500 tris | 28 – 34 bones (Humanoid) | 1 Material (Texture Atlas) |
| **NPC / Người thân** | 1.200 – 1.800 tris | 24 – 28 bones | 1 Material |
| **Căn phòng Diorama (Tường, sàn)**| 800 – 1.200 tris | Static | 1 – 2 Materials |
| **Nội thất lớn (Giường, Sofa, Tủ)** | 200 – 400 tris / món | Static | Chung Palette Atlas |
| **Đồ decor nhỏ (Laptop, Cây, Sách)**| 50 – 120 tris / món | Static | Chung Palette Atlas |
| **Tổng toàn cảnh (Toàn bộ Scene)** | **< 30.000 tris** | **< 100 draw calls** | Tối ưu tối đa cho iPhone 11 |

### 2.2 Texture & Color Palette (Kỹ thuật Color Paletting)
* **Không dùng Texture riêng lẻ:** Không sử dụng texture 2048x2048 cho từng chiếc ghế hay cái bàn.
* **Palette Texture Atlasing:** Toàn bộ nội thất và đồ trang trí chia sẻ chung một dải màu **Color Palette Atlas (256x256 pixel hoặc 512x512 pixel)**.
  - UV của từng model chỉ cần thu nhỏ thành 1 điểm và đặt vào ô màu tương ứng trên bảng màu.
  - **Lợi ích:** Cho phép Unity tự động gộp tất cả nội thất trong phòng lại thành **1 Draw Call duy nhất (Static Batching / GPU Instancing)**, giúp game chạy 60 FPS mượt mà không nóng máy.

---

## 3. Hệ thống Nhân vật Modular (Modular Character System)

Nhân vật được chia làm 5 phần độc lập để có thể tùy biến linh hoạt theo độ tuổi và nghề nghiệp:
1. **Head (Khuôn mặt & Đầu):** Chứa các biểu cảm mắt chớp, miệng cười/mếu (dùng Blend Shapes hoặc UV Offset).
2. **Hair (Kiểu tóc):** Tóc trẻ thơ, tóc học sinh, tóc undercut thời thượng, tóc hói tuổi trung niên, tóc bạc tuổi già.
3. **Torso (Thân trên & Áo):** Áo thun mầm non, áo đồng phục trắng khăn quàng đỏ, áo sơ mi văn phòng, vest giám đốc, áo công nhân...
4. **Legs (Thân dưới & Quần):** Quần đùi, quần âu, váy công sở, quần jean rách.
5. **Accessories (Phụ kiện):** Kính cận, đồng hồ Rolex, cà vạt, mũ bảo hiểm, cặp táp...

---

## 4. Bộ Hoạt ảnh Cốt lõi (Core Animation Set)
Toàn bộ nhân vật sử dụng chung bộ xương chuẩn **Unity Humanoid Avatar**, tương thích 100% với kho hoạt ảnh của **Mixamo**:

1. `Idle_Normal`: Thở nhẹ nhàng, chớp mắt, quan sát xung quanh.
2. `Idle_Typing`: Ngồi gõ phím trên máy tính (khi làm việc/học tập).
3. `Idle_Thinking`: Đưa tay lên cằm suy nghĩ (khi có hộp thoại sự kiện rẽ nhánh).
4. `Action_Celebrate`: Nhảy cẫng lên ăn mừng, giơ 2 tay chiến thắng (khi thăng chức, đỗ đại học, trúng số).
5. `Action_Sad`: Cúi đầu thất vọng, lau nước mắt (khi thất tình, phá sản, thi trượt).
6. `Action_Sleeping`: Nằm ngủ trên giường (chu kỳ ban đêm / hồi phục năng lượng).

---

## 5. Quy trình Xuất khẩu từ Blender sang Unity (Blender to Unity Export Pipeline)
1. **Đơn vị (Units):** Metric, Unit Scale = 1.0 (1 unit = 1 mét trong Unity).
2. **Gốc tọa độ (Origin Point):** Đặt tại đáy bàn chân nhân vật `(0, 0, 0)` hoặc chính giữa đáy đồ nội thất.
3. **Áp dụng Transform:** Luôn bấm `Ctrl + A` -> `Apply All Transforms` (Location, Rotation, Scale) trong Blender trước khi export.
4. **Định dạng Export:**
   - Định dạng khuyên dùng: **FBX (.fbx)** hoặc **glTF 2.0 (.glb)**.
   - Forward: `-Z Forward`, Up: `Y Up`.
   - Bỏ chọn Export Cameras & Lights.
