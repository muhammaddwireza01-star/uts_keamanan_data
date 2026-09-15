import { ShieldCheck, Home, Send, LockOpen, Sun } from "lucide-react";
// Jika Anda menggunakan react-router-dom, aktifkan import di bawah ini:
// import { Link, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

const Navbar = () => {
  // Simulasi state halaman aktif (Jika pakai react-router, gunakan useLocation().pathname)
  const currentPath = "/";

  return (
    <nav className="w-full bg-bg-base px-6 md:px-12 py-4 flex items-center justify-between border-b border-border-subtle font-sans">
      {/* =========================================
          BAGIAN KIRI: BRANDING & LOGO
      ========================================= */}
      <div className="flex items-center gap-4">
        {/* Logo Icon & Text */}
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="w-8 h-8 text-primary-main"
            strokeWidth={2.5}
          />
          <span className="text-xl font-bold text-text-main tracking-wide">
            Steg<span className="font-medium">Secure</span>
          </span>
        </div>

        {/* Divider & Subtitle (Disembunyikan di layar HP agar tidak sempit) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="w-[1px] h-6 bg-border-subtle"></span>
          <span className="text-sm text-text-muted">
            AES-256 <span className="mx-1">+</span> LSB Steganography
          </span>
        </div>
      </div>

      {/* =========================================
          BAGIAN KANAN: NAVIGASI & TEMA
      ========================================= */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Menu: Home */}
        {/* Ganti <button> menjadi <Link to="/"> jika memakai react-router-dom */}
        <Link
          className={`flex items-center gap-2 px-4 py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}
          to={"/"}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:block">Home</span>
        </Link>

        {/* Menu: Pengirim (Kondisi Aktif sesuai desain gambar) */}
        <Link
          to={"pengirim"}
          className={`flex items-center gap-2 px-4 py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/pengirim"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}>
          <Send className="w-4 h-4" />
          <span className="hidden sm:block">Pengirim</span>
        </Link>

        {/* Menu: Penerima */}
        <Link
          to={"/penerima"}
          className={`flex items-center gap-2 px-4 py-2 rounded-button transition-colors text-sm font-medium
            ${
              currentPath === "/penerima"
                ? "bg-primary-main/10 border border-primary-main text-primary-main"
                : "text-text-muted hover:text-text-main border border-transparent"
            }`}>
          <LockOpen className="w-4 h-4" />
          <span className="hidden sm:block">Penerima</span>
        </Link>

        {/* Divider antara menu dan tombol tema */}
        <span className="hidden sm:block w-[1px] h-6 bg-border-subtle mx-2"></span>

        {/* Tombol Tema (Light/Dark Mode) */}
        <button className="p-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-bg-surface">
          <Sun className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
