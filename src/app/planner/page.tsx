import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";

const event = {
  title: "Весілля Марії & Олексія",
  date: "2025-08-15",
  daysLeft: 103,
  budget: 150000,
  spent: 87500,
  guestsTotal: 80,
  guestsConfirmed: 54,
};

const timeline = [
  { id: "1", title: "Обрати весільне плаття", dueDate: "2025-05-10", isDone: true, priority: "high" },
  { id: "2", title: "Забронювати ресторан", dueDate: "2025-05-15", isDone: true, priority: "high" },
  { id: "3", title: "Замовити торт", dueDate: "2025-06-01", isDone: false, priority: "high" },
  { id: "4", title: "Узгодити меню з кейтерингом", dueDate: "2025-06-10", isDone: false, priority: "medium" },
  { id: "5", title: "Розіслати запрошення", dueDate: "2025-06-15", isDone: false, priority: "medium" },
  { id: "6", title: "Підтвердити фотографа", dueDate: "2025-06-20", isDone: false, priority: "high" },
  { id: "7", title: "Оренда авто для молодят", dueDate: "2025-07-01", isDone: false, priority: "low" },
  { id: "8", title: "Репетиція першого танцю", dueDate: "2025-07-15", isDone: false, priority: "medium" },
];

const bookings = [
  { vendor: "Crystal Hall", service: "Банкетний зал", date: "15.08.2025", price: 45000, status: "confirmed" },
  { vendor: "Студія Lumière", service: "Фото + Відео", date: "15.08.2025", price: 18000, status: "confirmed" },
  { vendor: "FlowerBox Studio", service: "Декор залу", date: "14.08.2025", price: 12000, status: "pending" },
  { vendor: "DJ Maxim", service: "DJ сет 6 годин", date: "15.08.2025", price: 8500, status: "confirmed" },
  { vendor: "Catering Pro", service: "Виїзне меню", date: "15.08.2025", price: 4000, status: "pending" },
];

const guests = [
  { name: "Іван Петров", rsvp: "yes", attended: false },
  { name: "Оксана Мельник", rsvp: "yes", attended: false },
  { name: "Дмитро Коваль", rsvp: "pending", attended: false },
  { name: "Юлія Бондар", rsvp: "no", attended: false },
  { name: "Сергій Ткач", rsvp: "yes", attended: false },
];

const aiSuggestions = [
  {
    type: "match",
    text: "Smart Match знайшов ведучого Артема Мороза, який вже працював з DJ Maxim — 94% збіг зі стилем вашого весілля.",
    action: "Переглянути профіль",
  },
  {
    type: "alert",
    text: "До весілля 103 дні. Пора підтвердити репертуар у музикантів — більшість бронює за 3 місяці.",
    action: "Знайти ведучого",
  },
];

const statusColors = {
  confirmed: "text-green-400 bg-green-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const statusLabels = {
  confirmed: "Підтверджено",
  pending: "Очікує",
  cancelled: "Скасовано",
};

const priorityColors = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-[var(--text-muted)]",
};

export default function PlannerPage() {
  const budgetPercent = Math.round((event.spent / event.budget) * 100);
  const guestsPercent = Math.round((event.guestsConfirmed / event.guestsTotal) * 100);
  const doneTasks = timeline.filter((t) => t.isDone).length;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("uk-UA", {
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
                <span className="text-[var(--gold)] text-sm">AI-Планувальник</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                {formattedDate} · Залишилось{" "}
                <span className="text-[var(--gold)] font-semibold">{event.daysLeft} днів</span>
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-medium px-4 py-2.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm">
              <Plus className="w-4 h-4" />
              Новий захід
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Suggestions */}
        <div className="space-y-3 mb-8">
          {aiSuggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-2xl p-4"
            >
              <div className="w-8 h-8 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {s.type === "match" ? (
                  <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                ) : (
                  <Bell className="w-4 h-4 text-[var(--gold)]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/90">{s.text}</p>
              </div>
              <button className="flex-shrink-0 text-[var(--gold)] text-sm hover:underline whitespace-nowrap">
                {s.action} →
              </button>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Budget */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Бюджет</span>
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {event.spent.toLocaleString("uk-UA")} ₴
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              з {event.budget.toLocaleString("uk-UA")} ₴ · залишок{" "}
              {(event.budget - event.spent).toLocaleString("uk-UA")} ₴
            </p>
            <div className="w-full bg-[var(--dark)] rounded-full h-2">
              <div
                className="bg-[var(--gold)] rounded-full h-2 transition-all"
                style={{ width: `${budgetPercent}%` }}
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
              {event.guestsConfirmed} / {event.guestsTotal}
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-3">підтвердили присутність</p>
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
            <p className="text-[var(--text-muted)] text-xs mb-3">завдань виконано</p>
            <div className="w-full bg-[var(--dark)] rounded-full h-2">
              <div
                className="bg-blue-400 rounded-full h-2 transition-all"
                style={{ width: `${Math.round((doneTasks / timeline.length) * 100)}%` }}
              />
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-2">
              {Math.round((doneTasks / timeline.length) * 100)}% готовності
            </p>
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
              <button className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Додати
              </button>
            </div>

            <div className="space-y-2">
              {timeline.map((task) => {
                const due = new Date(task.dueDate);
                const formattedDue = due.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${task.isDone ? "opacity-50" : ""} hover:bg-[var(--dark)] transition-colors`}
                  >
                    {task.isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className={`w-5 h-5 flex-shrink-0 ${priorityColors[task.priority as keyof typeof priorityColors]}`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.isDone ? "line-through text-[var(--text-muted)]" : "text-white"}`}>
                        {task.title}
                      </p>
                    </div>
                    <span className="text-[var(--text-muted)] text-xs flex-shrink-0">{formattedDue}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Бронювання</h2>
              <Link href="/catalog" className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Додати
              </Link>
            </div>

            <div className="space-y-3">
              {bookings.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--dark)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.vendor}</p>
                    <p className="text-[var(--text-muted)] text-xs">{b.service} · {b.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-medium">{b.price.toLocaleString("uk-UA")} ₴</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status as keyof typeof statusColors]}`}>
                      {statusLabels[b.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--dark-border)] mt-4 pt-4 flex justify-between">
              <span className="text-[var(--text-muted)] text-sm">Разом оплачено</span>
              <span className="text-white font-semibold">
                {bookings.reduce((a, b) => a + b.price, 0).toLocaleString("uk-UA")} ₴
              </span>
            </div>
          </div>
        </div>

        {/* Guest list */}
        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              Список гостей
            </h2>
            <div className="flex gap-3">
              <button className="text-[var(--text-muted)] text-sm hover:text-white transition-colors">
                Розіслати запрошення
              </button>
              <button className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Додати гостя
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {guests.map((g, i) => {
              const rsvpConfig = {
                yes: { label: "Підтвердив", color: "text-green-400 bg-green-400/10" },
                no: { label: "Відмовив", color: "text-red-400 bg-red-400/10" },
                pending: { label: "Очікує", color: "text-yellow-400 bg-yellow-400/10" },
              };
              const rsvp = rsvpConfig[g.rsvp as keyof typeof rsvpConfig];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--dark)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center text-xs font-semibold text-[var(--gold)]">
                      {g.name.charAt(0)}
                    </div>
                    <span className="text-white text-sm">{g.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rsvp.color}`}>
                    {rsvp.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
