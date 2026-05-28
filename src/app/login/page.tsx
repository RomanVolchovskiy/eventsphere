"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      setError("Будь ласка, заповніть усі поля");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Невірний email або пароль");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Помилка входу. Спробуйте ще раз");
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-semibold text-xl">
              Event<span className="text-[var(--gold)]">Sphere</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">З поверненням</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Увійдіть, щоб продовжити планування
          </p>
        </div>

        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-[var(--text-muted)]">Пароль</label>
                <Link href="/forgot-password" className="text-xs text-[var(--gold)] hover:underline">
                  Забули пароль?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 pr-11 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Увійти <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--dark-border)]" />
            </div>
            <div className="relative text-center">
              <span className="bg-[var(--dark-card)] px-3 text-xs text-[var(--text-muted)]">або</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-[var(--dark)] border border-[var(--dark-border)] text-white font-medium py-3 rounded-xl hover:border-[var(--gold)] transition-colors flex items-center justify-center gap-3 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Продовжити з Google
          </button>

          <p className="text-center text-xs text-[var(--text-muted)] mt-4">
            Тест: test@eventsphere.com / password123
          </p>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Немає акаунту?{" "}
          <Link href="/register" className="text-[var(--gold)] hover:underline">
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  );
}
