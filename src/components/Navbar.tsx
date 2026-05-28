"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, MessageSquare, User, LogOut } from "lucide-react";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "#constructor", label: "Конструктор" },
  { href: "/smart-match", label: "Smart Match" },
  { href: "/daily", label: "Щодня" },
  { href: "/pro", label: "Pro" },
];

function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span className="bm">
      <svg viewBox="0 0 32 32" width={size} height={size}>
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
  );
}

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
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="brand">
        <BrandMark />
        <span className="bn">EventSphere</span>
      </Link>

      <nav className="nav-links hidden md:flex">
        {links.map(l => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions hidden md:flex">
        {status === "loading" ? (
          <div className="w-7 h-7 rounded-full bg-[var(--bg-2)] animate-pulse" />
        ) : session ? (
          <>
            <Link href="/messages" className="nav-link" aria-label="Повідомлення">
              <MessageSquare className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px]"
                style={{
                  background: "rgba(255,245,230,0.04)",
                  border: "1px solid var(--line-2)",
                  color: "var(--ink)",
                }}
              >
                <span
                  className="w-5 h-5 rounded-full grid place-items-center"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--magenta))" }}
                >
                  <User className="w-3 h-3" strokeWidth={2} color="#1B0A36" />
                </span>
                <span>{session.user.name?.split(" ")[0] || "Я"}</span>
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-11 py-2 min-w-[200px]"
                  style={{
                    background: "rgba(27, 10, 54, 0.95)",
                    border: "1px solid var(--line-2)",
                    borderRadius: 12,
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 18px 50px -10px rgba(0,0,0,0.6)",
                  }}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" strokeWidth={1.5} /> Кабінет
                  </Link>
                  <Link
                    href="/messages"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} /> Повідомлення
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--magenta)] hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Вийти
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">
              увійти
            </Link>
            <Link href="/register" className="btn-pop sm">
              <span>Створити</span>
              <span className="bp-arrow">→</span>
            </Link>
          </>
        )}
      </div>

      <button
        className="md:hidden text-[var(--ink)] p-2 justify-self-end"
        onClick={() => setOpen(!open)}
        aria-label="Меню"
      >
        {open ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
      </button>

      {open && (
        <div
          className="md:hidden"
          style={{
            gridColumn: "1 / -1",
            marginTop: 12,
            borderTop: "1px solid var(--line)",
            paddingTop: 16,
          }}
        >
          <nav className="flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] py-2.5 text-sm"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-[var(--line)] mt-2 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-[var(--ink)] py-2 text-sm">
                    Кабінет
                  </Link>
                  <Link href="/messages" onClick={() => setOpen(false)} className="text-[var(--muted)] py-2 text-sm">
                    Повідомлення
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="text-left text-[var(--magenta)] py-2 text-sm"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="text-[var(--muted)] py-2 text-sm">
                    Увійти
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-pop sm inline-flex w-fit">
                    <span>Створити</span>
                    <span className="bp-arrow">→</span>
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
