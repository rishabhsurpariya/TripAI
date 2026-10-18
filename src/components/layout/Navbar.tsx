"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Compass, ChevronDown, User, Bookmark, Settings, LogOut } from "lucide-react";
import { useCurrentUser, logoutUser } from "@/lib/data/auth";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  onLogout?: () => void;
}

export function Navbar({ user: propUser, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const user = propUser || currentUser || {
    name: "Elena Rostova",
    email: "elena@tripai.travel",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logoutUser();
    setIsDropdownOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Explore", href: "/explore" },
    { label: "My Trips", href: "/trips" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#fef9f2]/90 backdrop-blur-md border-b border-[#d3c4b9]/50 shadow-[0_10px_30px_-10px_rgba(110,79,50,0.06)]">
      <div className="h-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#6e4f32] text-white flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:rotate-45">
            <Compass className="w-4 h-4 text-[#ffd9b7]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#54381d]">
            TripAi
          </span>
        </Link>

        {/* Center Nav Links & Profile */}
        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-1.5 px-3 sm:px-4 rounded-full transition-colors ${
                    isActive
                      ? "text-[#54381d] font-semibold bg-[#ffd9b7]/60"
                      : "text-[#4f453c] hover:text-[#1d1b18] hover:bg-[#f2ede7]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f2ede7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6e4f32]"
              aria-expanded={isDropdownOpen}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#d3c4b9]">
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#4f453c] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-white rounded-2xl border border-[#d3c4b9]/60 shadow-[0_10px_30px_-10px_rgba(110,79,50,0.12)] z-50">
                <div className="px-4 py-2 border-b border-[#d3c4b9]/30">
                  <p className="text-xs font-semibold text-[#1d1b18] truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#81756b] truncate">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/trips"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#4f453c] hover:bg-[#f8f3ed] hover:text-[#54381d] transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#81756b]" />
                    <span>My Trips & Saved</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#4f453c] hover:bg-[#f8f3ed] hover:text-[#54381d] transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[#81756b]" />
                    <span>Profile Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#4f453c] hover:bg-[#f8f3ed] hover:text-[#54381d] transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#81756b]" />
                    <span>Preferences</span>
                  </button>
                </div>

                <div className="my-1 border-t border-[#d3c4b9]/30"></div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
