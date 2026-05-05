"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, LogOut, User, MessageSquare } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/daily", label: "Щодня" },
  { href: "/smart-match", label: "Smart Match" },
  { href: "/planner", label: "Планувальник" },
  { href: "/pro", label: "Для бізнесу" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--dark-border)] bg-[var(--dark)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Event<span className="text-[var(--gold)]">Sphere</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[var(--text-muted)] hover:text-white text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-[var(--dark-card)] animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-3 py-2 hover:border-[var(--gold)] transition-colors ml-1"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-black" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.split(" ")[0] || session.user.email}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl shadow-xl py-2 min-w-[160px]">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Мій кабінет
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Повідомлення
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/messages"
                  className="relative p-2 text-[var(--text-muted)] hover:text-white transition-colors"
                  title="Повідомлення"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-[var(--text-muted)] hover:text-white transition-colors px-4 py-2"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-[var(--gold)] text-black font-medium px-4 py-2 rounded-lg hover:bg-[var(--gold-light)] transition-colors"
                >
                  Зареєструватись
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--dark-border)] bg-[var(--dark-card)] px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[var(--text-muted)] hover:text-white py-2 text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-[var(--dark-border)] mt-2 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-sm text-center text-white py-2"
                  >
                    Мій кабінет
                  </Link>
                  <button
                    onClick={() => { setOpen(false); signOut(); }}
                    className="text-sm text-center text-red-400 py-2"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-center text-[var(--text-muted)] py-2">
                    Увійти
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm text-center bg-[var(--gold)] text-black font-medium py-2 rounded-lg"
                  >
                    Зареєструватись
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
