"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-white/70 backdrop-blur-md border-b border-black/5"
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="flex h-[88px] items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-28 w-28">
              <Image
                src="/logo.png"
                alt="ADRIEN BUSINESS GROUP logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="hidden sm:block text-[18px] font-bold text-[#7a7a7a] tracking-[0.02em] group-hover:text-[#5f5f5f] transition">
              ADRIEN BUSINESS GROUP
            </span>
          </Link>

          {/* DESKTOP NAV (pushed right) */}
          <div className="ml-auto hidden md:flex items-center gap-[48px] pr-6">
            <NavLink href="/projects">PROJECTS</NavLink>
            <NavLink href="/about">ABOUT</NavLink>
            <NavLink href="/news">NEWS</NavLink>
             <NavLink href="/contact">CONTACT</NavLink>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-auto md:hidden text-2xl text-[#6f6f6f] hover:text-[#4f4f4f]"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white/90 backdrop-blur-md border-t border-black/5`}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          <NavLink href="/projects">PROJECTS</NavLink>
          <NavLink href="/about">ABOUT</NavLink>
          <NavLink href="/news">NEWS</NavLink>
           <NavLink href="/contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}

/* Reusable Nav Link */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[14px] font-normal tracking-[0.14em] text-[#6f6f6f] hover:text-[#4f4f4f] transition"
    >
      {children}
    </Link>
  );
}
