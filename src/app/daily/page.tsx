import Link from "next/link";
import { Clock, ArrowRight, Star, MapPin, Phone } from "lucide-react";

const quickServices = [
  { emoji: "🍽️", label: "Столик у ресторані", desc: "Бронювання за 2 хвилини", href: "#restaurants", count: "48 ресторанів" },
  { emoji: "💐", label: "Квіти на зараз", desc: "Доставка за 30–60 хвилин", href: "#flowers", count: "12 магазинів" },
  { emoji: "🎁", label: "Подарунковий сертифікат", desc: "Миттєва відправка на email", href: "#gifts", count: "35+ варіантів" },
  { emoji: "📸", label: "Фотограф на годину", desc: "Виїзд протягом 2 годин", href: "#photo", count: "22 фотографи" },
  { emoji: "🎂", label: "Торт на замовлення", desc: "Готово за 4–6 годин", href: "#cake", count: "18 кондитерів" },
  { emoji: "🎵", label: "Музикант на вечір", desc: "Живе виконання", href: "#music", count: "15 музикантів" },
];

const restaurants = [
  {
    id: "r1",
    name: "Sky Lounge",
    cuisine: "Авторська кухня",
    city: "Київ, Поділ",
    rating: 4.8,
    reviews: 234,
    openUntil: "23:00",
    tableFor: [2, 4, 6, 8],
    priceLevel: "₴₴₴",
    isOpen: true,
  },
  {
    id: "r2",
    name: "Barbecue Nation",
    cuisine: "Гриль · М'ясо",
    city: "Київ, Хрещатик",
    rating: 4.6,
    reviews: 187,
    openUntil: "00:00",
    tableFor: [2, 4, 6],
    priceLevel: "₴₴",
    isOpen: true,
  },
  {
    id: "r3",
    name: "Saffron",
    cuisine: "Індійська · Азійська",
    city: "Київ, Оболонь",
    rating: 4.9,
    reviews: 312,
    openUntil: "22:00",
    tableFor: [2, 4],
    priceLevel: "₴₴₴₴",
    isOpen: false,
  },
];

const flowers = [
  { id: "f1", name: "Троянди 25 шт. Преміум", price: 850, delivery: "35 хв", isAvailable: true },
  { id: "f2", name: "Мікс букет «Весна»", price: 650, delivery: "40 хв", isAvailable: true },
  { id: "f3", name: "Піонії 15 шт.", price: 1200, delivery: "50 хв", isAvailable: true },
  { id: "f4", name: "Сухоцвіти «Бохо»", price: 450, delivery: "30 хв", isAvailable: false },
];

export default function DailyPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Доступно прямо зараз</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Щодня</h1>
          <p className="text-[var(--text-muted)]">
            Швидке бронювання без зайвих кроків — обирайте і замовляйте за лічені хвилини
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* Quick buttons */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">Що потрібно зараз?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickServices.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="group bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-4 hover:border-[var(--gold)] transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-2"
              >
                <span className="text-3xl">{s.emoji}</span>
                <p className="text-white text-xs font-medium group-hover:text-[var(--gold)] transition-colors">
                  {s.label}
                </p>
                <p className="text-[var(--text-muted)] text-xs">{s.count}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Restaurants */}
        <section id="restaurants">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">🍽️ Столик у ресторані</h2>
              <p className="text-[var(--text-muted)] text-sm">Оберіть ресторан і заброньте стіл прямо зараз</p>
            </div>
            <Link href="/catalog?cat=catering" className="text-[var(--gold)] text-sm hover:underline">
              Всі ресторани →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 hover:border-[var(--gold)]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{r.name}</h3>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">{r.cuisine}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.isOpen ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                    {r.isOpen ? "Відкрито" : "Закрито"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {r.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    до {r.openUntil}
                  </div>
                  <span>{r.priceLevel}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-white text-sm font-medium">{r.rating}</span>
                  <span className="text-[var(--text-muted)] text-xs">({r.reviews} відгуків)</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[var(--text-muted)] text-xs">Столик для:</span>
                  {r.tableFor.map((n) => (
                    <button
                      key={n}
                      className="w-7 h-7 border border-[var(--dark-border)] rounded-lg text-xs text-white hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!r.isOpen}
                  className="w-full bg-[var(--gold)] disabled:bg-[var(--dark-border)] disabled:text-[var(--text-muted)] text-black font-medium py-2.5 rounded-xl text-sm hover:bg-[var(--gold-light)] transition-colors disabled:cursor-not-allowed"
                >
                  {r.isOpen ? "Забронювати" : "Зачинено"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Flowers */}
        <section id="flowers">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">💐 Квіти на зараз</h2>
              <p className="text-[var(--text-muted)] text-sm">Доставка протягом 30–60 хвилин по місту</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flowers.map((f) => (
              <div
                key={f.id}
                className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 hover:border-[var(--gold)]/50 transition-colors"
              >
                <div className="h-32 bg-gradient-to-br from-[var(--dark)] to-[var(--dark-border)] rounded-xl mb-4 flex items-center justify-center text-4xl">
                  💐
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{f.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4">
                  <Clock className="w-3 h-3" />
                  Доставка {f.delivery}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--gold)] font-semibold">{f.price} ₴</span>
                  <button
                    disabled={!f.isAvailable}
                    className="flex items-center gap-1 text-xs bg-[var(--gold)] disabled:bg-[var(--dark-border)] text-black disabled:text-[var(--text-muted)] px-3 py-1.5 rounded-lg hover:bg-[var(--gold-light)] transition-colors disabled:cursor-not-allowed"
                  >
                    {f.isAvailable ? (
                      <>Замовити <ArrowRight className="w-3 h-3" /></>
                    ) : (
                      "Немає в наявності"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency CTA */}
        <section>
          <div className="bg-[var(--dark-card)] border border-[var(--gold)]/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Потрібно терміново?</h3>
                <p className="text-[var(--text-muted)] text-sm">
                  Зателефонуйте нашому консьєржу — знайдемо рішення за 10 хвилин
                </p>
              </div>
            </div>
            <button className="flex-shrink-0 bg-[var(--gold)] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors">
              Зателефонувати зараз
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
