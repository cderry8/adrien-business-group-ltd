"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Projects", href: "/admin/projects" },
    { name: "News", href: "/admin/news" },
    { name: "Animation", href: "/admin/animation" },
  ];

  // 🔐 Logout function
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn"); 
    router.push("/admin/login"); 
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative h-16 flex items-center justify-between">

          {/* LEFT: BRAND */}
          <Link
            href="/admin/projects"
            className="text-lg font-semibold text-gray-900 tracking-wide"
          >
            Admin Dashboard
          </Link>

          {/* CENTER NAV (DESKTOP) */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${
                    isActive
                      ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: DESKTOP ACTION */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-2 text-sm text-red-500 hover:text-red-700 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white border-t`}
      >
        <nav className="flex flex-col items-center gap-6 py-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* MOBILE LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 text-sm text-red-500 hover:text-red-700"
          >
            <FiLogOut />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
