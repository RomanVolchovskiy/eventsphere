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

function BrandMark({ size = 52 }: { size?: number }) {
  return (
    <span className="bm">
      <svg viewBox="0 0 40 44" width={size} height={(size * 44) / 40} aria-hidden>
        <defs>
          <linearGradient id="navGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0D080" />
            <stop offset="45%" stopColor="#C9A24C" />
            <stop offset="100%" stopColor="#8C6E2F" />
          </linearGradient>
        </defs>

        {/* Star above crown */}
        <path
          d="M20 1 L20.6 3 L22.5 3.6 L20.6 4.2 L20 6.2 L19.4 4.2 L17.5 3.6 L19.4 3 Z"
          fill="url(#navGold)"
        />

        {/* Crown */}
        <path
          d="M11 14 L12.5 8 L16 11.5 L20 6.5 L24 11.5 L27.5 8 L29 14 Z"
          fill="url(#navGold)"
        />
        <circle cx="12.5" cy="8" r="1.1" fill="url(#navGold)" />
        <circle cx="27.5" cy="8" r="1.1" fill="url(#navGold)" />

        {/* Letter Є */}
        <text
          x="20" y="30"
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Fraunces, Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="500"
          fill="url(#navGold)"
        >
          Є
        </text>

        {/* Ribbon flourish below */}
        <path
          d="M9 38 Q14 33 20 37 Q26 41 31 38 Q26 35 20 39 Q14 43 9 38 Z"
          fill="url(#navGold)"
          opacity="0.95"
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
        <span className="bn">
          <span className="bn-gold">Є</span>Свято
        </span>
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
                className="flex items-center gap-2 px-3 py-1.5 text-[11px]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--line-2)",
                  color: "var(--bone)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  className="w-4 h-4 grid place-items-center"
                  style={{ background: "var(--crimson)" }}
                >
                  <User className="w-2.5 h-2.5" strokeWidth={2} color="#F5F1EA" />
                </span>
                <span>{session.user.name?.split(" ")[0] || "Я"}</span>
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-11 py-2 min-w-[220px]"
                  style={{
                    background: "rgba(19, 19, 22, 0.96)",
                    border: "1px solid var(--line-2)",
                    borderRadius: 0,
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 18px 50px -10px rgba(0,0,0,0.8)",
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
            <Link href="/register" className="btn-elegant sm">
              <span>Створити</span>
              <span className="arr">→</span>
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
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-elegant sm inline-flex w-fit">
                    <span>Створити</span>
                    <span className="arr">→</span>
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
