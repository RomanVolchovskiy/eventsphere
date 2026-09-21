"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar, Users, Star, TrendingUp, Plus, Clock, CheckCircle2, LogOut,
  Settings, X, ArrowRight, ExternalLink, MessageSquare, Briefcase, User as UserIcon,
  LayoutGrid, PartyPopper, Loader2, Check, AlertCircle, Phone, MapPin, Pencil,
} from "lucide-react";
import { addToGoogleCalendarUrl } from "@/lib/google-calendar";
import { VENDOR_CATEGORIES } from "@/lib/categories";

/* ── Типи ────────────────────────────────────────────────────────────────── */

type Profile = {
  user: {
    id: string; email: string; name: string | null; phone: string | null;
    avatar: string | null; role: string; createdAt: string;
  };
  vendor: {
    id: string; businessName: string; description: string | null; category: string;
    city: string; photos: string[]; priceFrom: number | null; priceTo: number | null;
    isVerified: boolean; rating: number; reviewsCount: number; subscription: string;
  } | null;
  stats: { events: number; bookings: number; vendorOrders: number; unreadMessages: number };
};

type EventItem = {
  id: string; title: string; date: string;
  budget: number; spent: number; bookingsCount: number;
};

type BookingItem = {
  id: string; status: string; totalPrice: number; date: string;
  vendor: { businessName: string; category: string };
  service: { name: string } | null;
};

type VendorOrder = {
  id: string; status: string; totalPrice: number; date: string; notes: string | null;
  createdAt: string;
  user: { id: string; name: string | null; phone: string | null; avatar: string | null };
  service: { name: string } | null;
};

type Tab = "overview" | "client" | "vendor" | "settings";

/* ── Довідники ───────────────────────────────────────────────────────────── */

const statusColors: Record<string, string> = {
  CONFIRMED: "text-green-400 bg-green-400/10 border-green-400/20",
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
  COMPLETED: "text-[var(--text-muted)] bg-white/5 border-white/10",
};

const statusLabels: Record<string, string> = {
  CONFIRMED: "Підтверджено", PENDING: "Очікує",
  CANCELLED: "Скасовано", COMPLETED: "Завершено",
};

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  VENDOR_CATEGORIES.map((c) => [c.value, c.label]),
);

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Огляд", icon: LayoutGrid },
  { id: "client", label: "Мої свята", icon: PartyPopper },
  { id: "vendor", label: "Я виконавець", icon: Briefcase },
  { id: "settings", label: "Налаштування", icon: Settings },
];

const card = "bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl";
const input =
  "w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm";
const label = "block text-sm text-[var(--text-muted)] mb-2";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

/* ── Сторінка ────────────────────────────────────────────────────────────── */

// Початкова вкладка з ?tab= (без useSearchParams, щоб не тягнути Suspense).
// Читається в ініціалізаторі стану, а не в ефекті: поки дані вантажаться,
// сторінка рендерить лише спінер, тож розбіжності з SSR тут не виникає.
function initialTab(): Tab {
  if (typeof window === "undefined") return "overview";
  const t = new URLSearchParams(window.location.search).get("tab");
  return t === "client" || t === "vendor" || t === "settings" || t === "overview" ? t : "overview";
}

export default function PersonalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    const meRes = await fetch("/api/users/me");
    if (!meRes.ok) throw new Error("me");
    const me = (await meRes.json()) as Profile;

    const [evRes, bkRes, ordRes] = await Promise.all([
      fetch("/api/events"),
      fetch("/api/bookings"),
      me.vendor ? fetch("/api/vendors/me/bookings") : Promise.resolve(null),
    ]);

    return {
      me,
      events: evRes.ok ? ((await evRes.json()).events as EventItem[]) : [],
      bookings: bkRes.ok ? ((await bkRes.json()).bookings as BookingItem[]) : [],
      orders: ordRes?.ok ? ((await ordRes.json()).bookings as VendorOrder[]) : [],
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await loadAll();
      setProfile(data.me);
      setEvents(data.events);
      setBookings(data.bookings);
      setOrders(data.orders);
      setLoadedAt(Date.now());
      setLoadError(null);
    } catch {
      setLoadError("Не вдалося завантажити сторінку. Оновіть її або спробуйте пізніше.");
    }
  }, [loadAll]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;
    let alive = true;
    (async () => {
      try {
        const data = await loadAll();
        if (!alive) return;
        setProfile(data.me);
        setEvents(data.events);
        setBookings(data.bookings);
        setOrders(data.orders);
        setLoadedAt(Date.now());
      } catch {
        if (alive) setLoadError("Не вдалося завантажити сторінку. Оновіть її або спробуйте пізніше.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [status, router, loadAll]);

  function openTab(t: Tab) {
    setTab(t);
    window.history.replaceState(null, "", `/me?tab=${t}`);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) return null;

  if (loadError || !profile) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <p className="text-[var(--text-muted)] text-sm">{loadError ?? "Щось пішло не так."}</p>
      </div>
    );
  }

  const { user, vendor, stats } = profile;

  // «Днів до події» рахуємо від миті завантаження даних, а не від Date.now()
  // під час рендеру — інакше значення пливе на кожному перемальовуванні.
  const daysToNext = loadedAt === null ? null : (events
    .map((e) => Math.ceil((new Date(e.date).getTime() - loadedAt) / 86400000))
    .filter((d) => d > 0)
    .sort((a, b) => a - b)[0] ?? null);
  const firstLetter = (user.name ?? user.email)[0]?.toUpperCase() ?? "Є";
  const memberSince = new Date(user.createdAt).toLocaleDateString("uk-UA", {
    month: "long", year: "numeric",
  });
  const visibleTabs = TABS;

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-0)]">
      {/* ── Обкладинка + шапка профілю ── */}
      <div
        className="h-44 sm:h-56 relative"
        style={{
          background:
            "radial-gradient(ellipse 60% 120% at 20% 0%, rgba(200,16,46,0.35), transparent 60%)," +
            "radial-gradient(ellipse 50% 100% at 80% 10%, rgba(201,162,76,0.28), transparent 60%)," +
            "linear-gradient(180deg, #1B1B20, #0A0A0B)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(245,241,234,0.03) 0 1px, transparent 1px 8px)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 relative z-10">
          {/* Аватар */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--bg-0)] bg-[var(--bg-2)] overflow-hidden grid place-items-center flex-shrink-0">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-4xl"
                style={{ fontFamily: "var(--display)", color: "var(--brand-gold-light)" }}
              >
                {firstLetter}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 sm:pb-1">
            <h1 className="text-2xl font-bold text-white truncate">
              {user.name ?? "Без імені"}
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--dark-border)] text-[var(--text-muted)] flex items-center gap-1.5">
                <UserIcon className="w-3 h-3" /> Замовник
              </span>
              {vendor ? (
                <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" /> Виконавець · {CATEGORY_LABELS[vendor.category] ?? vendor.category}
                </span>
              ) : (
                <button
                  onClick={() => openTab("vendor")}
                  className="text-xs px-2.5 py-1 rounded-full border border-dashed border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> Стати виконавцем
                </button>
              )}
              <span className="text-xs text-[var(--text-muted)]">на ЄСвято з {memberSince}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:pb-1">
            <Link
              href="/messages"
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--dark-border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--gold)] transition-colors text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Повідомлення
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--crimson)] text-white text-[10px] grid place-items-center font-bold">
                  {stats.unreadMessages > 99 ? "99+" : stats.unreadMessages}
                </span>
              )}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--dark-border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Вийти
            </button>
          </div>
        </div>

        {/* ── Вкладки ── */}
        <div
          className="flex gap-1 mt-8 border-b border-[var(--dark-border)] overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {visibleTabs.map(({ id, label: l, icon: Icon }) => (
            <button
              key={id}
              onClick={() => openTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === id
                  ? "border-[var(--gold)] text-white"
                  : "border-transparent text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {l}
              {id === "vendor" && !vendor && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                  нове
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Вміст вкладок ── */}
        <div className="mt-8">
          {tab === "overview" && (
            <OverviewTab
              profile={profile}
              orders={orders}
              daysToNext={daysToNext}
              openTab={openTab}
            />
          )}
          {tab === "client" && (
            <ClientTab events={events} bookings={bookings} onChanged={refresh} />
          )}
          {tab === "vendor" && (
            <VendorTab profile={profile} orders={orders} setOrders={setOrders} onCreated={refresh} />
          )}
          {tab === "settings" && <SettingsTab profile={profile} onSaved={refresh} />}
        </div>
      </div>
    </div>
  );
}

/* ── Огляд ───────────────────────────────────────────────────────────────── */

function OverviewTab({
  profile, orders, daysToNext, openTab,
}: {
  profile: Profile; orders: VendorOrder[];
  daysToNext: number | null; openTab: (t: Tab) => void;
}) {
  const { vendor, stats } = profile;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Моїх подій", value: stats.events, color: "text-[var(--gold)]", tab: "client" as Tab },
          { icon: CheckCircle2, label: "Моїх бронювань", value: stats.bookings, color: "text-green-400", tab: "client" as Tab },
          vendor
            ? { icon: Briefcase, label: "Замовлень на мене", value: stats.vendorOrders, color: "text-blue-400", tab: "vendor" as Tab }
            : { icon: Star, label: "Днів до події", value: daysToNext ?? "—", color: "text-purple-400", tab: "client" as Tab },
          { icon: MessageSquare, label: "Непрочитаних", value: stats.unreadMessages, color: "text-[var(--crimson-soft)]", href: "/messages" },
        ].map((s) => {
          const inner = (
            <>
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-[var(--text-muted)] text-xs mt-1">{s.label}</div>
            </>
          );
          return "href" in s && s.href ? (
            <Link key={s.label} href={s.href} className={`${card} p-5 hover:border-[var(--gold)] transition-colors`}>
              {inner}
            </Link>
          ) : (
            <button
              key={s.label}
              onClick={() => "tab" in s && s.tab && openTab(s.tab)}
              className={`${card} p-5 text-left hover:border-[var(--gold)] transition-colors`}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {/* Сигнали, що потребують уваги */}
      {vendor && pendingOrders > 0 && (
        <button
          onClick={() => openTab("vendor")}
          className="w-full flex items-center gap-3 rounded-2xl p-4 border bg-yellow-400/5 border-yellow-400/20 text-left hover:border-yellow-400/40 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="text-sm text-yellow-400 font-medium">
            {pendingOrders} {pendingOrders === 1 ? "нове замовлення чекає" : "нових замовлення чекають"} на вашу відповідь
          </span>
          <ArrowRight className="w-4 h-4 text-yellow-400 ml-auto" />
        </button>
      )}

      {daysToNext !== null && (
        <div className={`${card} p-5 flex items-center gap-4`}>
          <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 grid place-items-center flex-shrink-0">
            <PartyPopper className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <div>
            <div className="text-white font-semibold">
              До найближчого свята — {daysToNext} {daysToNext === 1 ? "день" : daysToNext < 5 ? "дні" : "днів"}
            </div>
            <div className="text-[var(--text-muted)] text-xs mt-0.5">
              Перевірте, чи всі виконавці підтвердили бронювання.
            </div>
          </div>
          <button onClick={() => openTab("client")} className="ml-auto text-xs text-[var(--gold)] hover:underline flex-shrink-0">
            До подій →
          </button>
        </div>
      )}

      {/* Швидкі дії */}
      <div>
        <h2 className="text-white font-semibold mb-4">Інструменти</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Підібрати команду", desc: "Smart Match за 1 хвилину", href: "/smart-match", icon: Star },
            { label: "Каталог виконавців", desc: "Зал, кейтеринг, фото, декор", href: "/catalog", icon: Users },
            { label: "Планувальник", desc: "Гості, таймлайн, бюджет", href: "/planner", icon: Calendar },
            { label: "На щодень", desc: "Столик, квіти, торт", href: "/daily", icon: Clock },
            { label: "Повідомлення", desc: "Чати з виконавцями", href: "/messages", icon: MessageSquare },
            vendor
              ? { label: "Профіль виконавця", desc: "Опис, ціни, фото в каталозі", href: "/vendor", icon: Pencil }
              : { label: "Стати виконавцем", desc: "Отримуйте замовлення", action: () => openTab("vendor"), icon: Briefcase },
          ].map((a) =>
            "href" in a && a.href ? (
              <Link key={a.label} href={a.href} className={`${card} p-4 hover:border-[var(--gold)] transition-colors group`}>
                <a.icon className="w-5 h-5 text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-white text-sm font-medium">{a.label}</div>
                <div className="text-[var(--text-muted)] text-xs mt-0.5">{a.desc}</div>
              </Link>
            ) : (
              <button key={a.label} onClick={a.action} className={`${card} p-4 text-left hover:border-[var(--gold)] transition-colors group`}>
                <a.icon className="w-5 h-5 text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-white text-sm font-medium">{a.label}</div>
                <div className="text-[var(--text-muted)] text-xs mt-0.5">{a.desc}</div>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Мої свята (роль замовника) ──────────────────────────────────────────── */

function ClientTab({
  events, bookings, onChanged,
}: {
  events: EventItem[]; bookings: BookingItem[]; onChanged: () => Promise<void>;
}) {
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", budget: "" });

  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((s, b) => s + b.totalPrice, 0);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      setShowNewEvent(false);
      setNewEvent({ title: "", date: "", budget: "" });
      await onChanged();
    }
    setCreating(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Події */}
      <div className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Мої події</h2>
          <button
            onClick={() => setShowNewEvent(true)}
            className="flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Додати
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-muted)] text-sm">Подій поки немає</p>
            <button
              onClick={() => setShowNewEvent(true)}
              className="mt-3 text-xs text-[var(--gold)] hover:underline flex items-center gap-1 mx-auto"
            >
              <Plus className="w-3 h-3" /> Створити першу подію
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => {
              const progress = ev.budget > 0 ? Math.round((ev.spent / ev.budget) * 100) : 0;
              return (
                <div key={ev.id} className="p-4 bg-[var(--dark)] rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white text-sm font-medium">{ev.title}</div>
                      <div className="text-[var(--text-muted)] text-xs mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {fmtDate(ev.date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={addToGoogleCalendarUrl({
                          title: ev.title,
                          date: new Date(ev.date),
                          description: `Бюджет: ${ev.budget.toLocaleString("uk")} ₴`,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Додати до Google Calendar"
                        className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link href="/planner" className="text-xs text-[var(--gold)] hover:underline">
                        Деталі
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>{ev.spent.toLocaleString("uk")} / {ev.budget.toLocaleString("uk")} ₴</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progress > 90 ? "bg-red-500" : "bg-[var(--gold)]"}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Бронювання */}
      <div className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Мої бронювання</h2>
          <Link href="/catalog" className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Знайти виконавця
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-muted)] text-sm">Бронювань поки немає</p>
            <Link href="/catalog" className="mt-3 text-xs text-[var(--gold)] hover:underline flex items-center gap-1 mx-auto justify-center">
              <ArrowRight className="w-3 h-3" /> Перейти до каталогу
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-[var(--dark)] rounded-xl">
                  <div>
                    <div className="text-white text-sm font-medium">{b.vendor.businessName}</div>
                    <div className="text-[var(--text-muted)] text-xs mt-0.5">
                      {b.service?.name ?? CATEGORY_LABELS[b.vendor.category] ?? b.vendor.category} · {fmtDate(b.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{b.totalPrice.toLocaleString("uk")} ₴</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${statusColors[b.status]}`}>
                      {statusLabels[b.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--dark-border)] flex justify-between items-center">
              <span className="text-[var(--text-muted)] text-sm">Разом (активних)</span>
              <span className="text-white font-semibold">{totalSpent.toLocaleString("uk")} ₴</span>
            </div>
          </>
        )}
      </div>

      {/* Модалка нової події */}
      {showNewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className={`${card} p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Нова подія</h3>
              <button onClick={() => setShowNewEvent(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className={label}>Назва події</label>
                <input
                  type="text" required placeholder="Весілля Марії та Олексія"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={input}
                />
              </div>
              <div>
                <label className={label}>Дата події</label>
                <input
                  type="date" required value={newEvent.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className={`${input} [color-scheme:dark]`}
                />
              </div>
              <div>
                <label className={label}>Бюджет (₴)</label>
                <input
                  type="number" required min="1000" placeholder="100000"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                  className={input}
                />
              </div>
              <button
                type="submit" disabled={creating}
                className="w-full bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {creating ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <><Plus className="w-4 h-4" /> Створити подію</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Я виконавець ────────────────────────────────────────────────────────── */

function VendorTab({
  profile, orders, setOrders, onCreated,
}: {
  profile: Profile;
  orders: VendorOrder[];
  setOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>;
  onCreated: () => Promise<void>;
}) {
  const { vendor } = profile;
  const [form, setForm] = useState({ businessName: "", category: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);

  async function becomeVendor(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/vendors/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося створити профіль");
        return;
      }
      await onCreated();
    } catch {
      setError("Немає зв'язку з сервером");
    } finally {
      setSaving(false);
    }
  }

  async function setOrderStatus(id: string, nextStatus: string) {
    setBusyOrder(id);
    try {
      const res = await fetch(`/api/vendors/me/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.booking.status } : o)));
      }
    } finally {
      setBusyOrder(null);
    }
  }

  /* Онбординг: профілю виконавця ще немає */
  if (!vendor) {
    return (
      <div className="max-w-xl">
        <div className={`${card} p-8`}>
          <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 grid place-items-center mb-5">
            <Briefcase className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <h2 className="text-white font-semibold text-xl mb-2">Станьте виконавцем</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
            Ваш акаунт лишається той самий — додається профіль виконавця. Клієнти
            знаходитимуть вас у каталозі й через підбір команди, а замовлення
            з&apos;являтимуться тут. Почати — безкоштовно.
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <form onSubmit={becomeVendor} className="space-y-4">
            <div>
              <label className={label}>Назва бізнесу</label>
              <input
                className={input} required maxLength={120}
                placeholder="Наприклад: Студія Промінь"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Що ви робите</label>
                <select
                  className={input} required value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="" disabled>Оберіть</option>
                  {VENDOR_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Місто</label>
                <input
                  className={input} required maxLength={80} placeholder="Київ"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit" disabled={saving}
              className="bg-[var(--gold)] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm disabled:opacity-70 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Створити профіль виконавця
            </button>
            <p className="text-[var(--text-muted)] text-xs">
              Опис, ціни та фото додасте наступним кроком — без них профіль не
              показується в каталозі.
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* Кабінет виконавця */
  const listed = Boolean(vendor.city.trim() && vendor.description?.trim());
  const pending = orders.filter((o) => o.status === "PENDING");
  const active = orders.filter((o) => o.status === "CONFIRMED");
  const earned = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Статус у каталозі */}
      <div
        className={`flex items-start gap-3 rounded-2xl p-4 border ${
          listed ? "bg-green-400/5 border-green-400/20" : "bg-yellow-400/5 border-yellow-400/20"
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
              : "Заповніть опис і місто в профілі — за ними клієнт розуміє, чим ви займаєтесь."}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {listed && (
            <Link href={`/catalog/${vendor.id}`} className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
              Моя сторінка <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          <Link href="/vendor" className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
            <Pencil className="w-3 h-3" /> Редагувати
          </Link>
        </div>
      </div>

      {/* Показники */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: AlertCircle, label: "Нових запитів", value: pending.length, color: "text-yellow-400" },
          { icon: CheckCircle2, label: "Підтверджених", value: active.length, color: "text-green-400" },
          { icon: TrendingUp, label: "Зароблено (₴)", value: earned.toLocaleString("uk"), color: "text-blue-400" },
          {
            icon: Star,
            label: `Рейтинг · ${vendor.reviewsCount} відгук${vendor.reviewsCount === 1 ? "" : "ів"}`,
            value: vendor.reviewsCount > 0 ? vendor.rating.toFixed(1) : "—",
            color: "text-[var(--gold)]",
          },
        ].map(({ icon: Icon, label: l, value, color }) => (
          <div key={l} className={`${card} p-5`}>
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-[var(--text-muted)] text-xs mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Замовлення клієнтів */}
      <div className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Замовлення клієнтів</h2>
          <span className="text-[var(--text-muted)] text-xs">{orders.length} всього</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-muted)] text-sm">Замовлень поки немає</p>
            <p className="text-[var(--text-muted)] text-xs mt-2 max-w-sm mx-auto">
              {listed
                ? "Коли клієнт забронює вас через каталог або підбір, запит з'явиться тут."
                : "Заповніть профіль, щоб потрапити в каталог — тоді клієнти зможуть вас бронювати."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-4 bg-[var(--dark)] rounded-xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-2)] grid place-items-center flex-shrink-0 overflow-hidden">
                      {o.user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={o.user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[var(--gold)] text-sm font-semibold">
                          {(o.user.name ?? "?")[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {o.user.name ?? "Клієнт"}
                      </div>
                      <div className="text-[var(--text-muted)] text-xs mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(o.date)}</span>
                        {o.service && <span>{o.service.name}</span>}
                        {o.user.phone && (
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {o.user.phone}</span>
                        )}
                      </div>
                      {o.notes && (
                        <div className="text-[var(--text-muted)] text-xs mt-1 italic">«{o.notes}»</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white text-sm font-medium">{o.totalPrice.toLocaleString("uk")} ₴</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </div>
                </div>

                {(o.status === "PENDING" || o.status === "CONFIRMED") && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--dark-border)]">
                    {o.status === "PENDING" && (
                      <button
                        onClick={() => setOrderStatus(o.id, "CONFIRMED")}
                        disabled={busyOrder === o.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3" /> Підтвердити
                      </button>
                    )}
                    {o.status === "CONFIRMED" && (
                      <button
                        onClick={() => setOrderStatus(o.id, "COMPLETED")}
                        disabled={busyOrder === o.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Завершено
                      </button>
                    )}
                    <button
                      onClick={() => setOrderStatus(o.id, "CANCELLED")}
                      disabled={busyOrder === o.id}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <X className="w-3 h-3" /> Відхилити
                    </button>
                    {busyOrder === o.id && <Loader2 className="w-4 h-4 text-[var(--text-muted)] animate-spin" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Куди рости */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/vendor" className={`${card} p-4 hover:border-[var(--gold)] transition-colors group`}>
          <MapPin className="w-5 h-5 text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform" />
          <div className="text-white text-sm font-medium">Профіль у каталозі</div>
          <div className="text-[var(--text-muted)] text-xs mt-0.5">
            Опис, ціни, фото, соцмережі — {vendor.businessName}
          </div>
        </Link>
        <Link href="/pro" className={`${card} p-4 hover:border-[var(--gold)] transition-colors group`}>
          <TrendingUp className="w-5 h-5 text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform" />
          <div className="text-white text-sm font-medium">Тариф: {vendor.subscription}</div>
          <div className="text-[var(--text-muted)] text-xs mt-0.5">
            PRO і MAX піднімають вас вище в пошуку
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ── Налаштування ────────────────────────────────────────────────────────── */

function SettingsTab({ profile, onSaved }: { profile: Profile; onSaved: () => Promise<void> }) {
  const { user } = profile;
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    avatar: user.avatar ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося зберегти");
        return;
      }
      setSaved(true);
      await onSaved();
    } catch {
      setError("Немає зв'язку з сервером");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={save} className={`${card} p-6 space-y-5`}>
        <h2 className="text-white font-semibold">Особисті дані</h2>

        <div>
          <label className={label}>Ім&apos;я та прізвище</label>
          <input
            className={input} required maxLength={120}
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setSaved(false); }}
          />
        </div>

        <div>
          <label className={label}>Телефон</label>
          <input
            className={input} type="tel" maxLength={30} placeholder="+380 00 000 00 00"
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setSaved(false); }}
          />
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Виконавці бачать телефон у ваших замовленнях, щоб швидко зв&apos;язатись.
          </p>
        </div>

        <div>
          <label className={label}>Аватар — посилання на фото</label>
          <input
            className={input} placeholder="https://..."
            value={form.avatar}
            onChange={(e) => { setForm({ ...form, avatar: e.target.value }); setSaved(false); }}
          />
        </div>

        <div>
          <label className={label}>Email</label>
          <input className={`${input} opacity-60`} value={user.email} disabled readOnly />
          <p className="text-[var(--text-muted)] text-xs mt-1">Email змінити не можна — це логін акаунта.</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
        )}
        {saved && !error && (
          <p className="text-sm text-green-400 bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-3">Збережено.</p>
        )}

        <button
          type="submit" disabled={saving}
          className="bg-[var(--gold)] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm disabled:opacity-70 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Зберегти
        </button>
      </form>

      <div className={`${card} p-6`}>
        <h2 className="text-white font-semibold mb-2">Вихід</h2>
        <p className="text-[var(--text-muted)] text-xs mb-4">
          Вийти з акаунта на цьому пристрої. Дані та бронювання нікуди не зникнуть.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--dark-border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" /> Вийти з акаунта
        </button>
      </div>
    </div>
  );
}
