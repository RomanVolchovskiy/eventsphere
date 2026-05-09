"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, MessageSquare, User, LogOut } from "lucide-react";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/daily", label: "Щодня" },
  { href: "/smart-match", label: "Smart Match" },
  { href: "/planner", label: "Планувальник" },
  { href: "/pro", label: "Pro" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[rgba(13,4,32,0.7)] border-b border-[var(--line)]"
          : "py-4 border-b border-transparent"
      }`}
      style={{ backdropFilter: scrolled ? "blur(18px)" : undefined }}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 md:px-9">
        {/* Logo */}
        <Link href="/" className="brand inline-flex items-center gap-2.5 justify-self-start">
          <span className="bm" style={{ filter: "drop-shadow(0 0 8px rgba(255,200,87,.5))" }}>
            <svg viewBox="0 0 32 32" width="28" height="28">
              <defs>
                <linearGradient id="bmg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFC857" />
                  <stop offset="1" stopColor="#FF3D80" />
                </linearGradient>
              </defs>
              <path
                d="M16 2 L20 12 L30 13 L22 20 L25 30 L16 24 L7 30 L10 20 L2 13 L12 12 Z"
                fill="url(#bmg)"
              />
            </svg>
          </span>
          <span style={{ fontFamily: "var(--display)", fontSize: 22 }}>EventSphere</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-7 justify-self-center">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-1.5"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex gap-3 items-center justify-self-end">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-1)] animate-pulse" />
          ) : session ? (
            <>
              <Link href="/messages" className="p-2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[rgba(255,245,230,0.04)] border border-[var(--line-2)] hover:border-[var(--gold)] transition-colors text-sm"
                >
                  <div className="w-6 h-6 rounded-full" style={{ background: "linear-gradient(135deg, var(--gold), var(--magenta))" }}>
                    <User className="w-3.5 h-3.5 text-[var(--bg-0)] m-1" />
                  </div>
                  <span className="text-[var(--ink)]">{session.user.name?.split(" ")[0] || "Я"}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-[var(--bg-1)] border border-[var(--line-2)] rounded-xl shadow-2xl py-2 min-w-[180px] backdrop-blur-xl">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> Кабінет
                    </Link>
                    <Link href="/messages" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/5 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Повідомлення
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--magenta)] hover:bg-white/5 transition-colors">
                      <LogOut className="w-4 h-4" /> Вийти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)] px-3 py-1.5 transition-colors">
                увійти
              </Link>
              <Link href="/register" className="btn-pop sm">
                <span>Створити</span><span>→</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--ink)] p-2 justify-self-end"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--bg-1)] px-4 pb-4 mt-3">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] py-2.5 text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-[var(--line)] mt-2 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-center text-[var(--ink)] py-2 text-sm">Кабінет</Link>
                  <Link href="/messages" onClick={() => setOpen(false)} className="text-center text-[var(--muted)] py-2 text-sm">Повідомлення</Link>
                  <button onClick={() => { setOpen(false); signOut(); }} className="text-center text-[var(--magenta)] py-2 text-sm">Вийти</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="text-center text-[var(--muted)] py-2 text-sm">Увійти</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-pop sm justify-center">
                    <span>Створити</span><span>→</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
