import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
// Sesuaikan jalur import ini dengan lokasi file api.js Anda
import { encryptMessage } from "../services/api";

const Pengirim = () => {
  // 1. Kumpulan State untuk Form dan UI
  // Mengambil nilai awal dari localStorage (jika ada), jika tidak, gunakan string kosong ""
  const [message, setMessage] = useState(() => {
    return localStorage.getItem("steg_message") || "";
  });
  const [secretKey, setSecretKey] = useState(() => {
    return localStorage.getItem("steg_secretKey") || "";
  });

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);

  // ==========================================
  // FITUR BARU: Menyimpan ke localStorage secara otomatis
  // ==========================================
  useEffect(() => {
    localStorage.setItem("steg_message", message);
  }, [message]);

  useEffect(() => {
    localStorage.setItem("steg_secretKey", secretKey);
  }, [secretKey]);
  // ==========================================

  const StepBadge = ({ number }) => (
    <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-primary-main text-bg-base font-bold flex items-center justify-center shadow-[0_0_15px_var(--color-primary-glow)]">
      {number}
    </div>
  );

  const handleFile = (file) => {
    setErrorMsg("");
    setSuccessMsg("");

    if (file) {
      if (file.type === "image/png" || file.type === "image/bmp") {
        if (file.size > 5 * 1024 * 1024) {
          setErrorMsg("Ukuran file terlalu besar. Maksimal 5 MB.");
          setImageFile(null);
        } else {
          setImageFile(file);
        }
      } else {
        setErrorMsg(
          "Format file tidak didukung. Harap gunakan format .PNG atau .BMP",
        );
        setImageFile(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!message || !secretKey || !imageFile) {
      setErrorMsg("Mohon lengkapi Pesan, Kunci Rahasia, dan Gambar!");
      return;
    }

    if (secretKey.length < 8) {
      setErrorMsg("Kunci rahasia minimal 8 karakter!");
      return;
    }

    setIsLoading(true);

    try {
      const blob = await encryptMessage(message, secretKey, imageFile);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `stego_${imageFile.name}`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMsg("Berhasil! Gambar berisi pesan rahasia telah diunduh.");

      // Reset form setelah sukses
      setMessage("");
      setSecretKey("");
      setImageFile(null);

      // Bersihkan localStorage agar data pengguna tidak tertinggal selamanya
      localStorage.removeItem("steg_message");
      localStorage.removeItem("steg_secretKey");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-main p-4 md:p-8 lg:p-12 font-sans">
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Send
            className="text-primary-main w-8 h-8 md:w-10 md:h-10"
            strokeWidth={2.5}
          />
          Halaman <span className="text-primary-main">Pengirim</span>
        </h1>
        <p className="text-text-muted mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
          Enkripsi pesan menggunakan AES-256, lalu sisipkan ke dalam gambar
          dengan teknik LSB steganography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-card p-6 md:p-8 flex flex-col gap-8 md:gap-10">
          <div className="flex gap-4">
            <StepBadge number="1" />
            <div className="w-full">
              <h2 className="text-lg font-bold mb-1">Masukkan Pesan</h2>
              <p className="text-text-muted text-sm mb-4">
                Tulis pesan yang ingin Anda kirim. Pesan akan dienkripsi
                menggunakan algoritma AES-256 sebelum disisipkan ke dalam
                gambar.
              </p>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  className="w-full bg-bg-input border border-border-subtle focus:border-primary-main rounded-input p-4 pb-8 text-text-main placeholder-text-muted resize-none outline-none transition-colors h-32 md:h-40"
                  placeholder="Contoh: Halo, ini pesan rahasia!"></textarea>
                <span className="absolute bottom-3 right-4 text-xs text-text-muted font-medium">
                  {message.length}/500
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <StepBadge number="2" />
            <div className="w-full">
              <h2 className="text-lg font-bold mb-1">
                Masukkan Kunci (Password)
              </h2>
              <p className="text-text-muted text-sm mb-4">
                Gunakan kunci yang kuat untuk proses enkripsi. Kunci ini harus
                sama dengan kunci yang digunakan di halaman penerima.
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-bg-input border border-border-subtle focus:border-primary-main rounded-input p-4 pr-12 text-text-main placeholder-text-muted outline-none transition-colors"
                  placeholder="Masukkan kunci (minimal 8 karakter)"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <StepBadge number="3" />
            <div className="w-full">
              <h2 className="text-lg font-bold mb-1">Pilih Gambar</h2>
              <p className="text-text-muted text-sm mb-4">
                Unggah gambar yang akan digunakan sebagai media penyimpanan
                pesan.
              </p>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`bg-bg-input border-2 border-dashed ${imageFile ? "border-primary-main" : "border-border-subtle"} focus-within:border-primary-main hover:border-primary-main rounded-input p-8 md:p-10 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group`}>
                <ImageIcon
                  className={`w-10 h-10 mb-3 transition-colors ${imageFile ? "text-primary-main" : "text-text-muted group-hover:text-primary-main"}`}
                  strokeWidth={1.5}
                />

                {imageFile ? (
                  <div className="text-primary-main font-semibold mb-1 break-all">
                    {imageFile.name}
                  </div>
                ) : (
                  <>
                    <p className="text-text-main font-semibold mb-1">
                      Drag & drop gambar di sini
                    </p>
                    <p className="text-text-muted text-xs mb-4">
                      atau klik untuk memilih file
                    </p>
                  </>
                )}

                <p className="text-text-muted text-[11px] bg-bg-base/50 py-1 px-3 rounded-full mt-2">
                  Format yang didukung: PNG, BMP | Maksimal ukuran: 5 MB
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="hidden"
                  accept=".png, .bmp"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-[#ef4444] bg-[#ef4444]/10 p-4 rounded-lg border border-[#ef4444]/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 text-primary-main bg-primary-main/10 p-4 rounded-lg border border-primary-main/20">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full font-bold py-4 px-6 rounded-button transition-all duration-200 flex items-center justify-center gap-2 mt-2 
              ${
                isLoading
                  ? "bg-primary-main/50 text-bg-base cursor-not-allowed"
                  : "bg-primary-main hover:bg-primary-hover text-bg-base shadow-lg shadow-primary-main/20"
              }`}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses Enkripsi...</span>
              </>
            ) : (
              <>
                <Send
                  className="w-5 h-5"
                  strokeWidth={2.5}
                  fill="currentColor"
                />
                <span>Kirim & Sisipkan Pesan</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-1 h-fit flex flex-col gap-6">
          <div className="bg-bg-surface border border-border-subtle rounded-card p-6 md:p-8">
            <h3 className="text-lg font-bold mb-6 text-text-main">Informasi</h3>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-main/10 border border-primary-main/20 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    AES-256 Encryption
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Pesan Anda akan dienkripsi menggunakan algoritma AES-256,
                    standar keamanan tertinggi di dunia.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    LSB Steganography
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Pesan terenkripsi akan disisipkan ke dalam gambar
                    menggunakan teknik Least Significant Bit (LSB).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-main/10 border border-primary-main/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    Keamanan Ganda
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Kombinasi enkripsi dan steganografi membuat pesan Anda lebih
                    aman dan sulit dideteksi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Alur Proses (Diperbarui dengan Detail Algoritma) */}
          <div className="bg-bg-surface border border-border-subtle rounded-card p-6 md:p-8">
            <h3 className="text-lg font-bold mb-5 text-text-main">
              Alur Proses Algoritma
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Key Derivation & Expansion",
                  desc: "Membangkitkan kunci AES 256-bit dari password menggunakan KDF (PBKDF2) untuk digunakan pada setiap putaran enkripsi.",
                },
                {
                  title: "Data Padding (PKCS7)",
                  desc: "Menambahkan byte pad pada pesan asli agar panjang data habis dibagi dalam ukuran blok 128-bit.",
                },
                {
                  title: "Enkripsi AES-256 (14 Rounds)",
                  desc: "Transformasi blok data melalui operasi SubBytes, ShiftRows, MixColumns, dan AddRoundKey.",
                },
                {
                  title: "Konversi ke Bitstream",
                  desc: "Mengubah ciphertext (hasil enkripsi) menjadi deretan bit biner tunggal (0 dan 1).",
                },
                {
                  title: "Injeksi Bit LSB",
                  desc: "Menyisipkan bitstream ke Least Significant Bit pada channel warna (R,G,B) dari piksel gambar.",
                },
                {
                  title: "Generate Stego Image",
                  desc: "Menyimpan gambar hasil secara lossless (PNG/BMP) agar manipulasi piksel tidak rusak oleh kompresi.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-bg-input border border-border-subtle flex items-center justify-center text-xs font-bold text-text-muted shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-main">
                      {item.title}
                    </span>
                    <span className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ilustrasi Dekoratif Sederhana */}
            <div className="mt-8 bg-bg-input border border-border-subtle rounded-lg p-6 flex items-center justify-center relative overflow-hidden h-32">
              <ImageIcon className="w-16 h-16 text-border-subtle opacity-50 absolute left-8" />
              <Lock
                className="w-12 h-12 text-primary-main absolute z-10 drop-shadow-[0_0_10px_rgba(0,208,156,0.3)]"
                fill="currentColor"
              />
              <div className="absolute right-6 flex flex-col gap-1 opacity-40">
                <span className="text-[10px] font-mono text-primary-main tracking-widest">
                  010101
                </span>
                <span className="text-[10px] font-mono text-primary-main tracking-widest">
                  010010
                </span>
                <span className="text-[10px] font-mono text-primary-main tracking-widest">
                  010101
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengirim;
