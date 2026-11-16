# Danh Mục Nghiên Cứu & Tuyển Chọn 3D Models Tối Ưu Cho Game
## Dự án: Zero to Billionaire Simulator (Life Sim 3D - iOS)

---

## 1. Kết quả Nghiên cứu & Định hướng Nguồn Asset 3D

Để đảm bảo hiệu năng 60 FPS mượt mà trên iPhone (từ chip Apple A13 Bionic trở lên), dung lượng tải nhẹ (< 150 MB) và phong cách thẩm mỹ đồng nhất, dự án tuyển chọn các bộ 3D Asset theo phong cách **Cozy Stylized Low-poly** với bản quyền miễn phí thương mại (**CC0 / Public Domain / MIT**):

### 1.1 Bộ Thư viện 3D Miễn phí & Mã nguồn mở Chất lượng Cao nhất
| Nguồn Asset | Tác giả | Giấy phép | Mô tả chi tiết & Đường dẫn |
| :--- | :--- | :--- | :--- |
| **Quaternius Modular Characters** | Quaternius | **CC0 (Miễn phí thương mại)** | Hơn 50+ mẫu nhân vật modular nam/nữ, chia sẵn Head, Hair, Torso, Legs, Rigged sẵn chuẩn Humanoid. [quaternius.com](https://quaternius.com/) |
| **Quaternius Ultimate Interior** | Quaternius | **CC0** | 300+ đồ nội thất phòng ngủ, bàn làm việc, PC, TV, sofa, cây cảnh, nhà bếp. Chuẩn tỷ lệ. |
| **KayKit Character & Furniture** | Kay Lousberg | **CC0** | Phong cách bo tròn siêu dễ thương (Cozy & Charming), cực kỳ phù hợp thị hiếu casual mobile. [kaylousberg.com](https://kaylousberg.com/) |
| **Kenney Furniture & City Kit** | Kenney.nl | **CC0** | Trùm asset game indie, hàng ngàn vật phẩm phòng ở và thành phố đã tối ưu hóa UV Palette. [kenney.nl](https://kenney.nl/assets) |
| **Mixamo Humanoid Animations** | Adobe Mixamo | **Miễn phí** | Kho 2.000+ animation chuẩn Humanoid: Ngồi gõ phím, nhảy múa, biểu cảm, đi lại, ngủ... [mixamo.com](https://www.mixamo.com/) |

### 1.2 Gói Asset Thương Mại Khuyến nghị Nâng cấp (Khi bước vào Alpha/Beta)
* **Synty Studios - POLYGON City & Living:** Bộ tiêu chuẩn công nghiệp về đồ họa Low-poly với hàng nghìn căn phòng và nhân vật đậm chất đời sống hiện đại.
* **Low Poly Interior Pack (Unity Asset Store):** Tối ưu sẵn cho URP trên iOS.

---

## 2. Tiêu chuẩn Kỹ thuật Nhập Model vào Unity iOS

### 2.1 Định dạng và Cấu trúc File
* Sử dụng định dạng **`.fbx`** hoặc **`.glb / .gltf`**.
* Toàn bộ đồ đạc dùng chung **1 Color Palette Texture duy nhất** kích thước `256 x 256 px` (giảm 95% bộ nhớ texture).
* Kích hoạt **Static Batching** và **GPU Instancing** trên Material URP.

### 2.2 Quy tắc Tối ưu LOD & Draw Calls
```
Toàn bộ phòng Diorama:
├── Khung tường + Sàn: 1 Draw call (Static batch)
├── Toàn bộ bàn, ghế, tủ, giường, decor: 1 Draw call (GPU Instancing qua chung Palette)
├── Màn hình PC / Cửa sổ phát sáng: 1 Draw call (Unlit / Emissive)
└── Nhân vật chính (Skinned Mesh): 1 Draw call (Humanoid Rig)
-------------------------------------------------------------------
TỔNG CỘNG: CHỈ ~ 4 ĐẾN 8 DRAW CALLS CHO TOÀN BỘ CẢNH 3D TRÊN IPHONE!
```

---

## 3. Quy trình Tích hợp Asset vào Project (`/unity/Assets/Models/`)

1. **Thư mục lưu trữ:**
   - `unity/Assets/Models/Characters/`: Chứa model base và các part quần áo, tóc.
   - `unity/Assets/Models/Furniture/`: Chứa bàn ghế, máy tính, giường tủ.
   - `unity/Assets/Models/Rooms/`: Chứa khung phòng theo từng cấp độ (Phòng trọ, Chung cư, Penthouse).
   - `unity/Assets/Textures/`: Chứa file `Palette_Master_256.png`.
2. **Animation Controller:**
   - Tích hợp Rig chuẩn `Humanoid` để tái sử dụng hoạt ảnh giữa tất cả các nhân vật mà không cần tạo xương lại.
