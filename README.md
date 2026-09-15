# StegSecure: Aplikasi Pesan Rahasia Ganda

Selamat datang di **StegSecure**! Ini adalah aplikasi keamanan data yang berfungsi seperti agen rahasia digital. Aplikasi ini memungkinkan Anda mengirim pesan rahasia kepada teman Anda dengan keamanan berlapis. 

**Bagaimana cara kerjanya?**
1. **Kriptografi (AES-256):** Pesan teks Anda akan diacak (dienkripsi) menggunakan *password* rahasia, sehingga pesannya berubah menjadi sandi yang tidak bisa dibaca.
2. **Steganografi (LSB):** Sandi tersebut kemudian disuntikkan/disembunyikan ke dalam sebuah gambar biasa tanpa mengubah bentuk gambarnya secara kasat mata.

Hasil akhirnya? Orang lain hanya akan melihat Anda mengirim gambar kucing biasa, padahal di dalam gambar kucing tersebut terdapat pesan rahasia!

---

## PERSIAPAN AWAL (WAJIB DIBACA)
Sebelum bisa menjalankan aplikasi ini, komputer Anda harus memiliki 2 program wajib di bawah ini. Jika belum punya, silakan *download* dan *install* terlebih dahulu:

1. **Python (Untuk Mesin/Backend)**
   - Download di: [python.org/downloads](https://www.python.org/downloads/)
   - **SANGAT PENTING:** Saat proses *install* Python, pastikan Anda **mencentang kotak berbunyi "Add Python to PATH"** di bagian bawah layar sebelum mengklik *Install Now*.
2. **Node.js (Untuk Tampilan/Frontend)**
   - Download versi LTS (Recommended for Most Users) di: [nodejs.org](https://nodejs.org/)
   - Install seperti biasa (Tinggal klik Next terus sampai selesai).
3. **Visual Studio Code (VS Code)**
   - Aplikasi untuk membuka folder proyek ini. Download di: [code.visualstudio.com](https://code.visualstudio.com/)

---

## CARA MENGUNDUH APLIKASI (TANPA GIT)
Jika Anda melihat halaman ini di GitHub:
1. Cari tombol hijau bertuliskan **`<> Code`** di kanan atas halaman.
2. Klik tombol tersebut, lalu pilih **`Download ZIP`**.
3. Setelah ter-download, **Extract** (Keluarkan) isi file ZIP tersebut ke sebuah folder di komputer Anda (Misalnya di folder *Documents*).

Di dalam folder hasil ekstrak tersebut, Anda akan melihat dua folder utama: `backend_app` dan `frontend_app`.

---

## CARA MENJALANKAN APLIKASI

Karena aplikasi ini terdiri dari "Mesin" (Backend) dan "Tampilan" (Frontend), Anda harus menyalakan keduanya. Ikuti langkah ini pelan-pelan:

### TAHAP 1
1. Buka aplikasi **VS Code**.
2. Klik menu `File` > `Open Folder...` > Pilih folder **`backend_app`**.
3. Di VS Code, klik menu `Terminal` (di bagian atas layar) > `New Terminal`. Akan muncul kotak hitam di bagian bawah.
4. Ketik perintah ini di terminal dan tekan **Enter**:
   ```bash
   pip install -r requirements.txt
(Tunggu sampai proses download selesai, butuh koneksi internet).

5. Setelah selesai, ketik perintah ini dan tekan Enter:
   python app.py
   note: Jika muncul tulisan Running on http://127.0.0.1:5000, tandanya backend sudah berhasil.
   PENTING: Jangan tutup VS Code ini! Biarkan saja menyala di latar belakang.

### TAHAP 2
1. Buka jendela VS Code baru (Klik File > New Window).
2. Di VS Code yang baru ini, klik File > Open Folder... > Pilih folder frontend_app.
3. Buka Terminal lagi (Terminal > New Terminal).
4. Ketik perintah ini dan tekan Enter:
   npm install
5. Setelah selesai, ketik perintah ini dan tekan Enter:
   npm run dev
6. Terminal akan memunculkan tulisan ➜  Local:   http://localhost:5173/.
7. Arahkan mouse ke tulisan http://localhost:5173/ tersebut, lalu tekan tombol Ctrl di keyboard dan Klik tulisannya. Aplikasi akan terbuka di browser.

## CARA MENGGUNAKAN APLIKASI
### PENGIRIM
1. Siapkan sebuah gambar berformat .PNG atau .BMP (Jangan gunakan .JPG/.JPEG).

2. Di website aplikasi, masuk ke halaman Pengirim.

3. Tulis pesan rahasia Anda.

4. Masukkan password (kunci) yang kuat. Jangan sampai lupa password ini!

5. Masukkan gambar .PNG Anda tadi ke dalam kotak yang disediakan.

6. Klik Kirim & Sisipkan Pesan.

7. Gambar baru (Stego Image) akan otomatis ter-download ke komputer Anda. Kirimkan gambar hasil ini ke teman Anda.

   NOTE: Jika kamu mengirim gambar ini lewat WhatsApp, WAJIB dikirim sebagai "Document / Dokumen". Jika dikirim sebagai foto galeri biasa, WhatsApp akan mengecilkan (compress) gambar tersebut dan pesan rahasia di dalamnya akan HANCUR. Cara paling aman adalah mengirimnya lewat Email atau Telegram (sebagai File).

   
### PENERIMA
1. Download gambar dari teman Anda dan simpan di komputer.

2. Di website aplikasi, masuk ke halaman Penerima.

3. Masukkan gambar yang baru saja Anda download.

4. Masukkan password rahasia yang sudah disepakati dengan pengirim.

5. Klik Ekstrak Pesan.

6. Baca pesan rahasia Anda di kotak sebelah kanan!
