import axios from "axios";

// URL dasar untuk mengarah ke server Flask Anda
// (Bisa disesuaikan nanti jika aplikasi sudah di-hosting/online)
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Fungsi untuk memanggil rute /api/encrypt di backend
 * Mengirim teks asli, gambar asli, dan kunci rahasia.
 * Menerima file Stego Image (.png)
 */
export const encryptMessage = async (plaintext, secretKey, imageFile) => {
  // 1. Membungkus data menggunakan FormData (wajib untuk pengiriman file)
  const formData = new FormData();
  formData.append("plaintext", plaintext);
  formData.append("secret_key", secretKey);
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/encrypt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // SANGAT PENTING: Karena backend mengembalikan file gambar (send_file),
      // kita harus memberi tahu Axios untuk memproses responsnya sebagai Blob (data biner), bukan teks/JSON.
      responseType: "blob",
    });

    return response.data; // Mengembalikan file Blob gambar
  } catch (error) {
    // Menangkap error dari server (misal: "File gambar tidak ditemukan")
    if (error.response && error.response.data instanceof Blob) {
      // Jika error juga terbungkus Blob (karena responseType: 'blob'), kita ubah dulu ke text
      const errorText = await error.response.data.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || "Terjadi kesalahan pada server");
    }
    throw new Error(error.message || "Gagal terhubung ke server backend");
  }
};

/**
 * Fungsi untuk memanggil rute /api/decrypt di backend
 * Mengirim Stego Image dan kunci rahasia.
 * Menerima respons JSON berisi pesan asli.
 */
export const decryptMessage = async (secretKey, imageFile) => {
  const formData = new FormData();
  formData.append("secret_key", secretKey);
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/decrypt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Tidak perlu responseType: 'blob' di sini karena backend mengembalikan JSON
    });

    return response.data; // Mengembalikan JSON { status: "success", plaintext: "..." }
  } catch (error) {
    // Menangkap pesan error spesifik dari Flask (misal: "Secret Key salah")
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Gagal mengekstrak pesan");
    }
    throw new Error(error.message || "Gagal terhubung ke server backend");
  }
};
