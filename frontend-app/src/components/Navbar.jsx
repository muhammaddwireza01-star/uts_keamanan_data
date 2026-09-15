import { ShieldCheck, Home, Send, LockOpen, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  // Menggunakan useLocation untuk membaca URL browser secara real-time
  // Ini memastikan status aktif (highlight) tidak akan hilang saat halaman di-refresh
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="w-full bg-bg-base px-4 md:px-12 py-4 flex items-center justify-between border-b border-border-subtle font-sans sticky top-0 z-50">
      {/* =========================================
          BAGIAN KIRI: BRANDING & LOGO
      ========================================= */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Logo Icon & Text - Sekarang bisa diklik untuk ke halaman utama */}
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck
            className="w-7 h-7 md:w-8 md:h-8 text-primary-main shrink-0"
            strokeWidth={2.5}
          />
          {/* Teks disembunyikan di layar super kecil (di bawah 360px) agar tidak sesak */}
          <span className="text-lg md:text-xl font-bold text-text-main tracking-wide hidden min-[360px]:block">
            Steg<span className="font-medium">Secure</span>
          </span>
        </Link>

        {/* Divider & Subtitle (Disembunyikan di layar HP/Tablet kecil agar tidak sempit) */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="w-[1px] h-6 bg-border-subtle"></span>
          <span className="text-sm text-text-muted whitespace-nowrap">
            AES-256 <span className="mx-1">+</span> LSB Steganography
          </span>
        </div>
      </div>

      {/* =========================================
          BAGIAN KANAN: NAVIGASI & TEMA
      ========================================= */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Menu: Home */}
        <Link
          to="/"
          className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}>
          <Home className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="hidden sm:block">Home</span>
        </Link>

        {/* Menu: Pengirim */}
        <Link
          to="/pengirim"
          className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/pengirim"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}>
          <Send className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="hidden sm:block">Pengirim</span>
        </Link>

        {/* Menu: Penerima */}
        <Link
          to="/penerima"
          className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/penerima"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}>
          <LockOpen className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="hidden sm:block">Penerima</span>
        </Link>

        {/* Divider antara menu dan tombol tema */}
        <span className="hidden md:block w-[1px] h-6 bg-border-subtle mx-1"></span>

        {/* Tombol Tema (Light/Dark Mode) */}
        <button className="p-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-bg-surface shrink-0">
          <Sun className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
