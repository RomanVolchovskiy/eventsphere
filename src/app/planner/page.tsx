import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  CONFIRMED: "text-green-400 bg-green-400/10",
  COMPLETED: "text-green-400 bg-green-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

const statusLabels: Record<string, string> = {
  CONFIRMED: "Підтверджено",
  COMPLETED: "Завершено",
  PENDING: "Очікує",
  CANCELLED: "Скасовано",
};

const rsvpConfig: Record<string, { label: string; color: string }> = {
  yes: { label: "Підтвердив", color: "text-green-400 bg-green-400/10" },
  no: { label: "Відмовив", color: "text-red-400 bg-red-400/10" },
  pending: { label: "Очікує", color: "text-yellow-400 bg-yellow-400/10" },
};

/** Оболонка сторінки — спільна для всіх станів (гість / без подій / з подією). */
function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm">Планувальник</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-[var(--text-muted)] text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}

function EmptyState({
  text,
  ctaHref,
  ctaLabel,
}: {
  text: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-10 text-center">
      <div className="w-14 h-14 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-7 h-7 text-[var(--gold)]" />
      </div>
      <p className="text-[var(--text-muted)] text-sm mb-6 max-w-md mx-auto">{text}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-medium px-5 py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm"
      >
        {ctaLabel}
        <Plus className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Shell title="Ваш планувальник">
        <EmptyState
          text="Увійдіть, щоб бачити свої заходи: бюджет, бронювання, список гостей і завдання підготовки."
          ctaHref="/login"
          ctaLabel="Увійти"
        />
      </Shell>
    );
  }

  const db = getDb();
  // Найближчий майбутній захід; якщо всі вже минули — найсвіжіший з минулих.
  const events = await db.event.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
    include: {
      bookings: {
        include: { vendor: { select: { businessName: true } }, service: { select: { name: true } } },
        orderBy: { date: "asc" },
      },
      guests: { orderBy: { name: "asc" } },
      timeline: { orderBy: { dueDate: "asc" } },
    },
  });

  if (events.length === 0) {
    return (
      <Shell title="Ваш планувальник">
        <EmptyState
          text="У вас поки немає запланованих заходів. Створіть перший — і тут з'являться бюджет, бронювання, гості та завдання підготовки."
          ctaHref="/dashboard"
          ctaLabel="Створити захід"
        />
      </Shell>
    );
  }

  const now = new Date();
  const event = events.find((e) => e.date >= now) ?? events[events.length - 1];

  const timeline = event.timeline;
  const bookings = event.bookings;
  const guests = event.guests;

  const spent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const guestsConfirmed = guests.filter((g) => g.rsvp === "yes").length;
  const doneTasks = timeline.filter((t) => t.isDone).length;

  // Знаменники можуть бути нулем на щойно створеному заході — ділення захищене.
  const budgetPercent = event.budget > 0 ? Math.round((spent / event.budget) * 100) : 0;
  const guestsPercent = guests.length > 0 ? Math.round((guestsConfirmed / guests.length) * 100) : 0;
  const tasksPercent = timeline.length > 0 ? Math.round((doneTasks / timeline.length) * 100) : 0;

  const daysLeft = Math.ceil((event.date.getTime() - now.getTime()) / 86_400_000);
  const formattedDate = event.date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-[var(--gold)] text-sm">Планувальник</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                {formattedDate}
                {daysLeft > 0 ? (
                  <>
                    {" · Залишилось "}
                    <span className="text-[var(--gold)] font-semibold">
                      {daysLeft} {daysLeft === 1 ? "день" : "днів"}
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--text-muted)]"> · захід уже відбувся</span>
                )}
                {events.length > 1 && (
                  <span className="text-[var(--text-muted)]">
                    {" · "}
                    {events.length} заходів усього
                  </span>
                )}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-medium px-4 py-2.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Новий захід
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Підказка про незакриті ролі — рахується з фактичних бронювань,
            а не вигадується. Показується, лише поки бронювань зовсім немає. */}
        {bookings.length === 0 && (
          <div className="flex items-start gap-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-2xl p-4 mb-8">
            <div className="w-8 h-8 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90">
                Під цей захід ще немає жодного бронювання. Smart Match підбере команду
                виконавців під ваш бюджет і кількість гостей.
              </p>
            </div>
            <Link
              href="/smart-match"
              className="flex-shrink-0 text-[var(--gold)] text-sm hover:underline whitespace-nowrap"
            >
              Підібрати →
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Budget */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Бюджет</span>
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {spent.toLocaleString("uk-UA")} ₴
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              з {event.budget.toLocaleString("uk-UA")} ₴ · залишок{" "}
              {(event.budget - spent).toLocaleString("uk-UA")} ₴
            </p>
            <div className="w-full bg-[var(--dark)] rounded-full h-2">
              <div
                className={`rounded-full h-2 transition-all ${
                  budgetPercent > 100 ? "bg-red-400" : "bg-[var(--gold)]"
                }`}
                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
              />
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-2">{budgetPercent}% використано</p>
          </div>

          {/* Guests */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Гості</span>
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {guestsConfirmed} / {guests.length}
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              {guests.length > 0 ? "підтвердили присутність" : "список гостей порожній"}
            </p>
            <div className="w-full bg-[var(--dark)] rounded-full h-2">
              <div
                className="bg-green-400 rounded-full h-2 transition-all"
                style={{ width: `${guestsPercent}%` }}
              />
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-2">{guestsPercent}% підтверджень</p>
          </div>

          {/* Timeline */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Завдання</span>
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {doneTasks} / {timeline.length}
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              {timeline.length > 0 ? "завдань виконано" : "завдань ще немає"}
            </p>
            <div className="w-full bg-[var(--dark)] rounded-full h-2">
              <div
                className="bg-blue-400 rounded-full h-2 transition-all"
                style={{ width: `${tasksPercent}%` }}
              />
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-2">{tasksPercent}% готовності</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--gold)]" />
                Timeline підготовки
              </h2>
            </div>

            {timeline.length === 0 ? (
              <p className="text-[var(--text-muted)] text-sm py-6 text-center">
                Завдань підготовки ще немає.
              </p>
            ) : (
              <div className="space-y-2">
                {timeline.map((task) => {
                  const overdue = !task.isDone && task.dueDate < now;
                  const formattedDue = task.dueDate.toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                  });
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${task.isDone ? "opacity-50" : ""} hover:bg-[var(--dark)] transition-colors`}
                    >
                      {task.isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle
                          className={`w-5 h-5 flex-shrink-0 ${overdue ? "text-red-400" : "text-[var(--text-muted)]"}`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${task.isDone ? "line-through text-[var(--text-muted)]" : "text-white"}`}
                        >
                          {task.title}
                        </p>
                      </div>
                      <span
                        className={`text-xs flex-shrink-0 ${overdue ? "text-red-400" : "text-[var(--text-muted)]"}`}
                      >
                        {formattedDue}
                      </span>
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
              <Link href="/catalog" className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Додати
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-[var(--text-muted)] text-sm py-6 text-center">
                Бронювань під цей захід ще немає.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--dark)] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {b.vendor.businessName}
                        </p>
                        <p className="text-[var(--text-muted)] text-xs">
                          {b.service?.name ? `${b.service.name} · ` : ""}
                          {b.date.toLocaleDateString("uk-UA")}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white text-sm font-medium">
                          {b.totalPrice.toLocaleString("uk-UA")} ₴
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status] ?? ""}`}
                        >
                          {statusLabels[b.status] ?? b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--dark-border)] mt-4 pt-4 flex justify-between">
                  <span className="text-[var(--text-muted)] text-sm">
                    Разом (без скасованих)
                  </span>
                  <span className="text-white font-semibold">
                    {spent.toLocaleString("uk-UA")} ₴
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Guest list */}
        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              Список гостей
            </h2>
            <span className="text-[var(--text-muted)] text-sm">
              {guests.length > 0 && `${guestsConfirmed} з ${guests.length} підтвердили`}
            </span>
          </div>

          {guests.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm py-6 text-center">
              Список гостей порожній.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {guests.map((g) => {
                const rsvp = rsvpConfig[g.rsvp ?? "pending"] ?? rsvpConfig.pending;
                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--dark)] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center text-xs font-semibold text-[var(--gold)] flex-shrink-0">
                        {g.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm truncate">{g.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${rsvp.color}`}
                    >
                      {rsvp.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
