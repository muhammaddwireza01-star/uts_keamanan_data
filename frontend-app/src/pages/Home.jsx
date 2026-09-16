import React from "react";
import {
  ShieldCheck,
  Send,
  LockOpen,
  ArrowRight,
  Lock,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    // PERUBAHAN DI SINI: Menggunakan calc(100vh - 73px) agar pas dengan Navbar
    <div className="min-h-[calc(100vh-73px)] bg-bg-base text-text-main font-sans overflow-hidden flex items-center relative">
      {/* Efek Cahaya Latar Belakang (Glow) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-main/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full z-10">
        {/* =========================================
            KOLOM KIRI: TEKS & TOMBOL (COPYWRITING)
        ========================================= */}
        <div className="flex flex-col gap-2 md:gap-4 text-center lg:text-left">
          {/* Badge Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-sm font-semibold w-fit mx-auto lg:mx-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Tingkat Keamanan Maksimal</span>
          </div>

          {/* Headline Utama */}
          <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Sembunyikan Pesan Anda di Balik{" "}
            <span className="text-primary-main">Sebuah Gambar.</span>
          </h1>

          {/* Sub-headline (Deskripsi) */}
          <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
            StegSecure menggabungkan kekuatan enkripsi militer{" "}
            <strong>AES-256</strong> dan teknik{" "}
            <strong>LSB Steganography</strong>. Kirim pesan rahasia tanpa
            mengundang kecurigaan, karena secara visual gambar Anda tidak akan
            berubah sedikit pun.
          </p>

          {/* Tombol Aksi (Call to Action) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center lg:justify-start">
            {/* Tombol ke Halaman Pengirim */}
            <Link
              to="/pengirim"
              className="w-full sm:w-auto bg-primary-main hover:bg-primary-hover text-bg-base font-bold py-4 px-8 rounded-button transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_var(--color-primary-glow)] hover:shadow-[0_0_30px_var(--color-primary-glow)] hover:-translate-y-1">
              <Send className="w-5 h-5" />
              <span>Mulai Enkripsi</span>
            </Link>

            {/* Tombol ke Halaman Penerima */}
            <Link
              to="/penerima"
              className="w-full sm:w-auto bg-bg-surface hover:bg-bg-input border border-border-subtle hover:border-primary-main text-text-main font-bold py-4 px-8 rounded-button transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1">
              <LockOpen className="w-5 h-5" />
              <span>Dekripsi Pesan</span>
            </Link>
          </div>

          {/* Fitur Singkat */}
          <div className="flex items-center gap-6 mt-4 justify-center lg:justify-start text-sm text-text-muted font-medium">
            <div className="flex items-center gap-2">
              <CheckIcon /> 100% Client-Server Secure
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon /> Lossless Format (PNG/BMP)
            </div>
          </div>
        </div>

        {/* =========================================
            KOLOM KANAN: ILUSTRASI VISUAL (HERO IMAGE)
        ========================================= */}
        <div className="relative flex items-center justify-center h-[350px] md:h-[450px]">
          {/* Lingkaran Dekoratif Utama */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 border border-border-subtle rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
            <div className="w-4 h-4 bg-primary-main rounded-full absolute -top-2 shadow-[0_0_10px_var(--color-primary-main)]"></div>
            <div className="w-3 h-3 bg-[#8B5CF6] rounded-full absolute -bottom-1.5 shadow-[0_0_10px_#8B5CF6]"></div>
          </div>

          {/* Kartu Gambar (Latar) */}
          <div className="absolute z-10 w-64 h-48 md:w-72 md:h-56 bg-bg-surface border border-border-subtle rounded-card flex items-center justify-center shadow-2xl -rotate-6 transform hover:rotate-0 transition-transform duration-500">
            <ImageIcon className="w-20 h-20 text-border-subtle opacity-50" />
          </div>

          {/* Elemen Binary Data yang Mengalir */}
          <div className="absolute z-20 top-1/4 right-10 flex flex-col gap-1 opacity-60">
            <span className="text-xs font-mono text-primary-main tracking-widest animate-pulse">
              01001000
            </span>
            <span className="text-xs font-mono text-primary-main tracking-widest animate-pulse delay-75">
              01100001
            </span>
            <span className="text-xs font-mono text-primary-main tracking-widest animate-pulse delay-150">
              01101100
            </span>
          </div>

          {/* Kartu Gembok (Depan) */}
          <div className="absolute z-30 w-24 h-24 md:w-28 md:h-28 bg-primary-main/10 backdrop-blur-md border border-primary-main rounded-2xl flex items-center justify-center shadow-[0_0_30px_var(--color-primary-glow)] translate-x-16 translate-y-16">
            <Lock
              className="w-10 h-10 md:w-12 md:h-12 text-primary-main"
              fill="currentColor"
            />
          </div>

          {/* Panah Proses */}
          <div className="absolute z-30 translate-x-28 -translate-y-16 bg-bg-surface border border-border-subtle p-3 rounded-full shadow-lg">
            <ArrowRight className="w-6 h-6 text-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen kecil untuk icon centang
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="8"
      cy="8"
      r="8"
      fill="var(--color-primary-main)"
      fillOpacity="0.2"
    />
    <path
      d="M4.5 8.5L7 11L11.5 5"
      stroke="var(--color-primary-main)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Home;
