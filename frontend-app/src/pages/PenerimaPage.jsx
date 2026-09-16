import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Image as ImageIcon,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MessageSquare,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Maximize,
} from "lucide-react";
// Sesuaikan jalur import ini dengan lokasi file api.js Anda
import { decryptMessage } from "../services/api";

const Penerima = () => {
  // 1. Kumpulan State untuk Form dan UI
  // Mengambil nilai awal dari localStorage (jika ada), jika tidak, gunakan string kosong ""
  const [secretKey, setSecretKey] = useState(() => {
    return localStorage.getItem("steg_penerima_secretKey") || "";
  });

  // Menyimpan hasil ekstraksi agar tidak hilang jika ter-refresh
  const [extractedMessage, setExtractedMessage] = useState(() => {
    return localStorage.getItem("steg_penerima_extractedMessage") || "";
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
    localStorage.setItem("steg_penerima_secretKey", secretKey);
  }, [secretKey]);

  useEffect(() => {
    localStorage.setItem("steg_penerima_extractedMessage", extractedMessage);
  }, [extractedMessage]);
  // ==========================================

  const StepBadge = ({ number }) => (
    <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-primary-main text-bg-base font-bold flex items-center justify-center shadow-[0_0_15px_var(--color-primary-glow)]">
      {number}
    </div>
  );

  const handleFile = (file) => {
    setErrorMsg("");
    setSuccessMsg("");
    setExtractedMessage(""); // Reset hasil ekstraksi sebelumnya (otomatis membersihkan localStorage juga)

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
          "Format tidak didukung. Harap gunakan gambar PNG atau BMP asli dari pengirim.",
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
    setExtractedMessage("");

    if (!imageFile) {
      setErrorMsg("Mohon unggah gambar stego terlebih dahulu!");
      return;
    }

    if (!secretKey) {
      setErrorMsg("Password (Kunci Rahasia) wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await decryptMessage(secretKey, imageFile);

      // Jika berhasil, masukkan teks ke dalam kotak hasil
      // (Ini akan memicu useEffect untuk menyimpannya ke localStorage)
      setExtractedMessage(response.plaintext);
      setSuccessMsg("Berhasil! Pesan rahasia telah diekstrak.");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = imageFile && secretKey.length > 0;

  return (
    <div className="min-h-screen bg-bg-base text-text-main p-4 md:p-8 lg:p-12 font-sans">
      <div className="mb-8 max-w-7xl mx-auto flex items-start gap-4 md:gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center bg-bg-surface border border-border-subtle rounded-xl shrink-0 overflow-hidden">
          <Maximize
            className="absolute w-12 h-12 text-primary-main/40"
            strokeWidth={1}
          />
          <Lock
            className="w-6 h-6 text-primary-main relative z-10"
            strokeWidth={2.5}
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Terima <span className="text-primary-main">Pesan Rahasia</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
            Ekstrak pesan yang tersembunyi dari gambar, lalu dekripsi
            menggunakan password yang benar dengan algoritma AES-256.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-card p-6 md:p-8 flex flex-col gap-8 md:gap-10">
          <div className="flex gap-4">
            <StepBadge number="1" />
            <div className="w-full">
              <h2 className="text-lg font-bold mb-1">Unggah Gambar Stego</h2>
              <p className="text-text-muted text-sm mb-4">
                Pilih atau drag & drop gambar yang berisi pesan tersembunyi.
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

          <div className="flex gap-4">
            <StepBadge number="2" />
            <div className="w-full">
              <h2 className="text-lg font-bold mb-1">Masukkan Password</h2>
              <p className="text-text-muted text-sm mb-4">
                Gunakan password yang sama seperti saat pesan dikirim.
              </p>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-bg-input border border-border-subtle focus:border-primary-main rounded-input py-4 pl-12 pr-12 text-text-main placeholder-text-muted outline-none transition-colors"
                  placeholder="Masukkan password"
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
              <h2 className="text-lg font-bold mb-1">
                Proses Dekripsi & Ekstraksi
              </h2>
              <p className="text-text-muted text-sm mb-4">
                Setelah gambar dan password valid, pesan akan diekstrak dan
                didekripsi secara otomatis.
              </p>

              {errorMsg && (
                <div className="flex items-center gap-2 text-[#ef4444] bg-[#ef4444]/10 p-4 rounded-lg border border-[#ef4444]/20 mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 text-primary-main bg-primary-main/10 p-4 rounded-lg border border-primary-main/20 mb-4">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{successMsg}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                className={`w-full font-bold py-4 px-6 rounded-button transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    isLoading
                      ? "bg-primary-main/50 text-bg-base cursor-not-allowed"
                      : isFormValid
                        ? "bg-primary-main hover:bg-primary-hover text-bg-base shadow-lg shadow-primary-main/20"
                        : "bg-bg-input border border-border-subtle text-text-muted cursor-not-allowed"
                  }`}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengekstrak Pesan...</span>
                  </>
                ) : (
                  <>
                    {isFormValid ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    <span>Ekstrak Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 h-full">
          <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
            <h3 className="text-lg font-bold mb-6 text-text-main">
              Cara Kerja
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    1. Ekstraksi LSB
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Gambar dibaca untuk mengambil data tersembunyi (LSB).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    2. Dekripsi AES-256
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Data hasil ekstraksi didekripsi menggunakan password Anda.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">
                    3. Tampilkan Pesan
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Pesan asli akan ditampilkan setelah proses berhasil.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-card p-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center shrink-0 border border-primary-main/20">
              <ShieldCheck className="w-6 h-6 text-primary-main" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main mb-1">
                Keamanan Terjamin
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Gabungan AES-256 dan LSB Steganography memberikan perlindungan
                ganda untuk pesan Anda.
              </p>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-card p-6 flex-grow flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-text-main">
              Hasil Ekstraksi
            </h3>

            <div
              className={`flex-grow border rounded-input p-4 relative ${extractedMessage ? "border-primary-main bg-primary-main/5" : "border-border-subtle bg-bg-input"}`}>
              {extractedMessage ? (
                <div className="h-full min-h-[150px]">
                  <p className="text-text-main text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {extractedMessage}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[150px] flex gap-3 opacity-50">
                  <FileText className="w-5 h-5 shrink-0 text-text-muted" />
                  <p className="text-sm text-text-muted mt-0.5">
                    Pesan yang diekstrak akan muncul di sini setelah proses
                    berhasil.
                  </p>
                </div>
              )}
            </div>

            <div className="text-right mt-2 text-xs text-text-muted">
              {extractedMessage.length}/500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Penerima;
