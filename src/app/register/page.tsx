"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Eye, EyeOff, ArrowRight, User, Briefcase } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Role = "CLIENT" | "VENDOR";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const businessName =
      role === "VENDOR"
        ? (form.elements.namedItem("businessName") as HTMLInputElement).value
        : undefined;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        phone,
        role,
        businessName,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Помилка реєстрації");
      setLoading(false);
      return;
    }

    // Auto login after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-semibold text-xl">
              Event<span className="text-[var(--gold)]">Sphere</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Створіть акаунт</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Приєднуйтесь до тисяч організаторів та виконавців
          </p>
        </div>

        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-8">
          {/* Role switcher */}
          <div className="flex bg-[var(--dark)] rounded-xl p-1 mb-6">
            {(
              [
                { value: "CLIENT", label: "Я організатор", icon: User },
                { value: "VENDOR", label: "Я виконавець", icon: Briefcase },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  role === value
                    ? "bg-[var(--gold)] text-black"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Ім&apos;я</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  placeholder="Марія"
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Прізвище</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  placeholder="Коваленко"
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
              </div>
            </div>

            {role === "VENDOR" && (
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Назва бізнесу</label>
                <input
                  name="businessName"
                  type="text"
                  required
                  placeholder="Crystal Hall"
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
              </div>
            )}

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
              <label className="block text-sm text-[var(--text-muted)] mb-2">Номер телефону</label>
              <input
                name="phone"
                type="tel"
                placeholder="+380 00 000 00 00"
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Пароль</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Мінімум 8 символів"
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

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 accent-[var(--gold)]"
              />
              <label htmlFor="terms" className="text-xs text-[var(--text-muted)] leading-relaxed">
                Я погоджуюсь з{" "}
                <Link href="/terms" className="text-[var(--gold)] hover:underline">
                  Умовами використання
                </Link>{" "}
                та{" "}
                <Link href="/privacy" className="text-[var(--gold)] hover:underline">
                  Політикою конфіденційності
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {role === "VENDOR" ? "Зареєструватись як виконавець" : "Створити акаунт"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="text-[var(--gold)] hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
