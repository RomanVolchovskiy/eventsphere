"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Calendar, Users, Star, TrendingUp, Plus, Clock,
  CheckCircle2, LogOut, Settings, X, ArrowRight, ExternalLink,
} from "lucide-react";
import { addToGoogleCalendarUrl } from "@/lib/google-calendar";

type Event = {
  id: string; title: string; date: string;
  budget: number; spent: number; bookingsCount: number;
};

type Booking = {
  id: string; status: string; totalPrice: number; date: string;
  vendor: { businessName: string; category: string };
  service: { name: string } | null;
};

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", budget: "" });
  const [daysToNext, setDaysToNext] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [evRes, bkRes] = await Promise.all([
      fetch("/api/events"),
      fetch("/api/bookings"),
    ]);
    if (evRes.ok) {
      const data = await evRes.json();
      setEvents(data.events);
      const next = data.events
        .map((e: Event) => Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000))
        .filter((d: number) => d > 0)
        .sort((a: number, b: number) => a - b)[0] ?? null;
      setDaysToNext(next);
    }
    if (bkRes.ok) {
      const data = await bkRes.json();
      setBookings(data.bookings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") fetchData();
  }, [status, router, fetchData]);

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
      await fetchData();
    }
    setCreating(false);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Вітаємо, {session.user.name?.split(" ")[0] || "Користувач"} 👋
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-[var(--dark-border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--gold)] transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--dark-border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Вийти
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Активних подій", value: events.length, color: "text-[var(--gold)]" },
            { icon: CheckCircle2, label: "Бронювань", value: bookings.length, color: "text-green-400" },
            { icon: TrendingUp, label: "Витрачено (₴)", value: totalSpent.toLocaleString("uk"), color: "text-blue-400" },
            { icon: Star, label: "Днів до події", value: daysToNext ?? "—", color: "text-purple-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-[var(--text-muted)] text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Events */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Мої події</h2>
              <button
                onClick={() => setShowNewEvent(true)}
                className="flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Додати
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
                            <Clock className="w-3 h-3" />
                            {new Date(ev.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
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

          {/* Bookings */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Бронювання</h2>
              <Link href="/catalog" className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Знайти виконавця
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
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-[var(--dark)] rounded-xl">
                      <div>
                        <div className="text-white text-sm font-medium">{b.vendor.businessName}</div>
                        <div className="text-[var(--text-muted)] text-xs mt-0.5">
                          {b.service?.name ?? b.vendor.category}
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
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Каталог виконавців", href: "/catalog", icon: Users },
            { label: "Smart Match", href: "/smart-match", icon: Star },
            { label: "Планувальник", href: "/planner", icon: Calendar },
            { label: "Швидке бронювання", href: "/daily", icon: Clock },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl hover:border-[var(--gold)] transition-colors group"
            >
              <Icon className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Нова подія</h3>
              <button
                onClick={() => setShowNewEvent(false)}
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Назва події</label>
                <input
                  type="text"
                  required
                  placeholder="Весілля Марії та Олексія"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Дата події</label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--gold)] transition-colors text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Бюджет (₴)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="100000"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
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
