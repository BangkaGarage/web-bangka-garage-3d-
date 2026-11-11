# 🏍️ Bangka Garage — 3D Virtual Tour & Interactive Experience

**Satu Kawasan, Banyak Cerita.**  
Website resmi berbasis **Immersive 3D Web** untuk kawasan terpadu **Bangka Garage** (Jl. Solihin GP No.7, Pangkal Pinang). Pengunjung dapat menjelajahi kelima unit usaha secara interaktif dengan dipandu langsung oleh pemandu tur virtual bernama **Lyla**.

---

## ✨ Fitur Utama

- **Pemandu Virtual "Lyla":** Karakter 3D interaktif yang menyambut pengunjung di gerbang masuk, bergerak alami, dan memberikan panduan suara beserta *subtitle* di setiap pos tujuan.
- **5 Pos Petualangan Interaktif:**
  1. **Robotic Carwash:** Teknologi cuci mobil dan motor robotik tanpa sentuh.
  2. **Rebel House:** Coffeeshop, bar, meja billiard, dan suasana *live music* malam hari.
  3. **Rebel:** Area kafe, *Barbertopia*, dan *Mini Cinema*.
  4. **Kampoeng Garage:** Bengkel spesialis Harley-Davidson dan penyedia suku cadang.
  5. **Scudetto:** Studio *coating* dan *auto detailing* profesional.
- **Atmosfer 3D Hidup:** Pencahayaan sinematik bernuansa *Golden Hour* menuju malam, efek pantulan aspal (*reflector*), partikel cahaya melayang, dan transisi kamera mulus menggunakan **GSAP**.
- **Integrasi Layanan Bisnis:** Dilengkapi informasi jam operasional, menu andalan, tombol reservasi langsung ke WhatsApp Admin, dan petunjuk arah Google Maps.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [React](https://react.dev) + [Vite](https://vitejs.dev)
- **3D Engine:** [Three.js](https://threejs.org) & [React Three Fiber](https://pmnd.rs)
- **3D Helpers & Effects:** `@react-three/drei` & `@react-three/postprocessing`
- **Animasi Kamera:** [GSAP (GreenSock)](https://gsap.com)
- **Styling & Ikon:** [Tailwind CSS](https://tailwindcss.com) & [Lucide React](https://lucide.dev)

---

## 📂 Struktur Folder Aset

Untuk mengganti karakter atau suara bawaan dengan aset kustom, letakkan file ke dalam direktori `public/` berikut:

```text
public/
├── models/
│   ├── lyla.glb            # Model 3D karakter pemandu Lyla
│   └── kawasan.glb         # Model 3D lingkungan/bangunan kawasan
└── audio/
    ├── ambience.mp3        # Musik latar suasana kawasan
    ├── 00_intro.mp3        # Suara sapaan pembuka Lyla
    ├── 01_carwash.mp3      # Penjelasan Pos Robotic Carwash
    ├── 02_rebelhouse.mp3   # Penjelasan Pos Rebel House
    ├── 03_rebel.mp3        # Penjelasan Pos Rebel Cafe & Barber
    ├── 04_kampoeng.mp3     # Penjelasan Pos Kampoeng Garage
    └── 05_scudetto.mp3     # Penjelasan Pos Scudetto Detailing
```

---

## 🚀 Cara Menjalankan di Lokal (Komputer)

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com
   cd web-bangka-garage-3d-
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**  
   Akses alamat `http://localhost:5173` yang muncul di terminal.

---

## 📍 Lokasi Kawasan

**Bangka Garage**  
Jl. Solihin GP No.7, Melintang, Kec. Rangkui, Kota Pangkal Pinang, Kepulauan Bangka Belitung 33684  
*One For All, All For One.*
# web-bangka-garage-3d-
