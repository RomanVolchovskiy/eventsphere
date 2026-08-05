"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ExternalLink, Check, AlertCircle } from "lucide-react";
import { VENDOR_CATEGORIES } from "@/lib/categories";

type Vendor = {
  id: string;
  businessName: string;
  description: string | null;
  category: string;
  city: string;
  address: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  photos: string[];
  priceFrom: number | null;
  priceTo: number | null;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
};

const input =
  "w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm";
const label = "block text-sm text-[var(--text-muted)] mb-2";

/** Профіль потрапляє в каталог лише коли є місто, опис і напрям. */
function isListed(v: Vendor): boolean {
  return Boolean(v.city.trim() && v.description?.trim());
}

export default function VendorCabinet() {
  const { status } = useSession();
  const router = useRouter();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [photosText, setPhotosText] = useState("");

  // Запит відокремлений від застосування стану, щоб ефект не викликав
  // setState синхронно (той самий підхід, що в /dashboard).
  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/vendors/me");
    const data = await res.json();
    return res.ok
      ? { vendor: data.vendor as Vendor, error: null }
      : { vendor: null, error: (data.error as string) ?? "Не вдалося завантажити профіль" };
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    let alive = true;
    fetchProfile()
      .then((res) => {
        if (!alive) return;
        if (res.vendor) {
          setVendor(res.vendor);
          setPhotosText((res.vendor.photos ?? []).join("\n"));
        } else {
          setError(res.error);
        }
      })
      .catch(() => {
        if (alive) setError("Немає зв'язку з сервером");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [status, router, fetchProfile]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vendor) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const photos = photosText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/vendors/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...vendor, photos }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося зберегти");
        return;
      }
      setVendor(data.vendor);
      setSaved(true);
    } catch {
      setError("Немає зв'язку з сервером");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof Vendor>(key: K, value: Vendor[K]) {
    setVendor((v) => (v ? { ...v, [key]: value } : v));
    setSaved(false);
  }

  if (status === "loading" || loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="pt-16 min-h-screen max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-3">Кабінет виконавця</h1>
        <p className="text-[var(--text-muted)] text-sm mb-6">
          {error ??
            "У вашого акаунта немає профілю виконавця. Він створюється при реєстрації з роллю «Я виконавець»."}
        </p>
        <Link href="/dashboard" className="text-[var(--gold)] text-sm hover:underline">
          Перейти в кабінет →
        </Link>
      </div>
    );
  }

  const listed = isListed(vendor);

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Мій профіль виконавця</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Те, що тут заповните, побачать клієнти в каталозі.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Статус показу в каталозі — головне, що виконавець має розуміти */}
        <div
          className={`flex items-start gap-3 rounded-2xl p-4 mb-8 border ${
            listed
              ? "bg-green-400/5 border-green-400/20"
              : "bg-yellow-400/5 border-yellow-400/20"
          }`}
        >
          {listed ? (
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${listed ? "text-green-400" : "text-yellow-400"}`}>
              {listed ? "Профіль показується в каталозі" : "Профіль ще не в каталозі"}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-1">
              {listed
                ? "Клієнти можуть знайти вас у пошуку й через підбір команди."
                : "Щоб з'явитись у каталозі, заповніть місто й опис — за ними клієнт розуміє, чим ви займаєтесь."}
            </p>
          </div>
          {listed && (
            <Link
              href={`/catalog/${vendor.id}`}
              className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1 flex-shrink-0"
            >
              Глянути <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>

        <form onSubmit={save} className="space-y-6">
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Основне</h2>

            <div>
              <label className={label}>Назва бізнесу</label>
              <input
                className={input}
                value={vendor.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                required
                maxLength={120}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Що ви робите</label>
                <select
                  className={input}
                  value={vendor.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                >
                  {VENDOR_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Місто</label>
                <input
                  className={input}
                  value={vendor.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Київ"
                  required
                  maxLength={80}
                />
              </div>
            </div>

            <div>
              <label className={label}>
                Опис — чим ви займаєтесь і що входить у послугу
              </label>
              <textarea
                className={`${input} min-h-[120px] resize-y`}
                value={vendor.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Наприклад: фотографую весілля й сімейні свята. Репортажна зйомка, 8 годин, 300 оброблених фото."
                maxLength={2000}
              />
              <p className="text-[var(--text-muted)] text-xs mt-1">
                За цим текстом підбір розуміє, під які свята вас пропонувати.
              </p>
            </div>

            <div>
              <label className={label}>Адреса (якщо є)</label>
              <input
                className={input}
                value={vendor.address ?? ""}
                onChange={(e) => set("address", e.target.value)}
                placeholder="вул. Хрещатик, 22"
                maxLength={200}
              />
            </div>
          </div>

          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Ціни</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Від, ₴</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={vendor.priceFrom ?? ""}
                  onChange={(e) =>
                    set("priceFrom", e.target.value === "" ? null : Number(e.target.value))
                  }
                  placeholder="5000"
                />
              </div>
              <div>
                <label className={label}>До, ₴ (необов&apos;язково)</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={vendor.priceTo ?? ""}
                  onChange={(e) =>
                    set("priceTo", e.target.value === "" ? null : Number(e.target.value))
                  }
                  placeholder="40000"
                />
              </div>
            </div>
            <p className="text-[var(--text-muted)] text-xs">
              Залиште порожнім — у каталозі буде «Ціна за запитом». Для кейтерингу
              вказуйте ціну за одного гостя.
            </p>
          </div>

          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Фото і посилання</h2>

            <div>
              <label className={label}>Фото — по одному посиланню в рядок</label>
              <textarea
                className={`${input} min-h-[90px] resize-y font-mono text-xs`}
                value={photosText}
                onChange={(e) => {
                  setPhotosText(e.target.value);
                  setSaved(false);
                }}
                placeholder="https://..."
              />
              <p className="text-[var(--text-muted)] text-xs mt-1">
                Перше фото стає обкладинкою картки. До 10 штук.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={label}>Сайт</label>
                <input
                  className={input}
                  value={vendor.website ?? ""}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={label}>Instagram</label>
                <input
                  className={input}
                  value={vendor.instagram ?? ""}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="username"
                />
              </div>
              <div>
                <label className={label}>TikTok</label>
                <input
                  className={input}
                  value={vendor.tiktok ?? ""}
                  onChange={(e) => set("tiktok", e.target.value)}
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
          {saved && !error && (
            <p className="text-sm text-green-400 bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-3">
              Збережено.
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[var(--gold)] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm disabled:opacity-70 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Зберегти
            </button>
            <span className="text-[var(--text-muted)] text-xs">
              Рейтинг і відгуки формуються з оцінок клієнтів — їх не можна вписати самому.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
