PHẠM QUỐC TUẤN · 23735301 · https://github.com/quoctuan242005-oss/23735301.git · #972910

# BÀI THI THỰC HÀNH 1 - REACT NATIVE (CLO 1, 2, 3)

## 📌 Thông tin sinh viên & Đề bài
- **Họ và tên:** PHẠM QUỐC TUẤN
- **MSSV:** 23735301
- **Mã đề / Stamp Hash:** `#972910`
- **Số cuối MSSV:** `1` (Lẻ)
- **GitHub Repository (HTTPS Clone):** `https://github.com/quoctuan242005-oss/23735301.git`

---

## ⚙️ Cấu hình Variant theo MSSV (`23735301`)
- **Watermark:** `VARIANT.watermarkAtTop = false` (Vị trí ở **DƯỚI** màn hình)
- **Theme Control:** `VARIANT.themeControl = 'pressable'` (Nút bấm chuyển giao diện Sáng / Tối)
- **Modal Animation:** `VARIANT.modalAnimation = 'fade'` (Hiệu ứng mở mờ dần)
- **Chips Order:** `VARIANT.chipsReversed = true` (Đảo thứ tự danh mục: `Học tập` -> `Nước` -> `Đồ ăn` -> `Tất cả`)
- **Banner Image ID:** `201` (`BANNER_IMAGE_ID = 100 + (301 % 200) = 201`)
- **Flash Sale Timer:** `181 giây` (`FLASH_SECONDS = 60 + (301 % 180) = 181`)
- **Price Multiplier:** `20.100` (`PRICE_MULTIPLIER = 20000 + (301 % 50) * 100 = 20100`)

---

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng

### 1. Cài đặt thư viện dependencies
```bash
npm install
```

### 2. Khởi động Metro Bundler
```bash
npm start
```

### 3. Chạy trên Android Emulator / Thiết bị thật
```bash
npm run android
```

---

## 📂 Cấu trúc thư mục nguồn (`src/`)
```
CampusMart_23735301/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
└── src/
    ├── constants/student.ts
    ├── constants/theme.ts
    ├── contexts/ThemeContext.tsx
    ├── hooks/useCountdown.ts
    ├── services/productApi.ts
    ├── components/ui/Typography.tsx
    ├── components/ui/ShopInput.tsx
    ├── components/ui/ShopButton.tsx
    └── screens/HomeScreen.tsx
```
