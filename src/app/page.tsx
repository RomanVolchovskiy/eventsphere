import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Music,
  UtensilsCrossed,
  Camera,
  Flower2,
  ArrowRight,
  Star,
  Shield,
  Cpu,
  Calendar,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const categories = [
  { icon: MapPin, label: "Локації", count: "240+", href: "/catalog?cat=venue" },
  { icon: Music, label: "Шоу-програма", count: "180+", href: "/catalog?cat=entertainment" },
  { icon: UtensilsCrossed, label: "Кейтеринг", count: "95+", href: "/catalog?cat=catering" },
  { icon: Camera, label: "Фото/Відео", count: "320+", href: "/catalog?cat=photo" },
  { icon: Flower2, label: "Декор", count: "150+", href: "/catalog?cat=decor" },
];

const dailyServices = [
  { label: "Столик у ресторані", emoji: "🍽️", href: "/daily?type=restaurant" },
  { label: "Квіти на зараз", emoji: "💐", href: "/daily?type=flowers" },
  { label: "Подарунковий сертифікат", emoji: "🎁", href: "/daily?type=gift" },
  { label: "Фотограф на годину", emoji: "📸", href: "/daily?type=photo" },
];

const features = [
  {
    icon: Cpu,
    title: "Smart Match AI",
    description: "Алгоритм підбирає ідеальну команду виконавців під ваш бюджет та стиль.",
  },
  {
    icon: MapPin,
    title: "Тури 360°",
    description: "Віртуально пройдіться локацією перед бронюванням — без зайвих поїздок.",
  },
  {
    icon: Shield,
    title: "Безпечна угода",
    description: "Гроші надходять виконавцю лише після підтвердження якості послуги.",
  },
  {
    icon: Calendar,
    title: "QR RSVP",
    description: "Кожен гість отримує QR-код. Сканування на вході — автоматична відмітка.",
  },
];

const stats = [
  { value: "2 400+", label: "Верифікованих виконавців" },
  { value: "18 000+", label: "Успішних заходів" },
  { value: "4.9", label: "Середня оцінка платформи" },
  { value: "98%", label: "Задоволених клієнтів" },
];

const testimonials = [
  {
    name: "Марія Коваленко",
    event: "Весілля",
    text: "EventSphere зекономив мені 3 тижні пошуків. AI підібрав команду — і всі вони вже працювали разом раніше. Результат перевершив очікування.",
    rating: 5,
  },
  {
    name: "Олег Петренко",
    event: "Корпоратив на 200 осіб",
    text: "360° тур по залу зекономив 5 поїздок. Побачив все онлайн, одразу забронював. Логістика через CRM — просто вогонь.",
    rating: 5,
  },
  {
    name: "Аліна Шевченко",
    event: "День народження",
    text: "Замовила квіти через «Щодня» за 10 хвилин. Доставили за 40 хв. Ще й торт знайшли через каталог того ж дня!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#111111] to-[#0D0D0D]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 75% 20%, #C9A84C 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-sm text-[var(--text-muted)]">
                Платформа №1 для організації заходів в Україні
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Від ранкової{" "}
              <span className="text-[var(--gold)]">кави</span>
              <br />
              до весілля{" "}
              <span className="text-[var(--gold)]">мрії</span>
            </h1>

            <p className="text-xl text-[var(--text-muted)] mb-10 leading-relaxed max-w-2xl">
              EventSphere — інтелектуальний помічник, що поєднує маркетплейс святкових послуг,
              щоденне бронювання та інструменти для розвитку івент-бізнесу.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-lg"
              >
                Знайти виконавця
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/planner"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-[var(--dark-border)] text-white font-semibold px-8 py-4 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-lg"
              >
                Спланувати захід
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-[var(--dark-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Енциклопедія свят</h2>
              <p className="text-[var(--text-muted)]">Оберіть категорію — знайдіть ідеального виконавця</p>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1 text-[var(--gold)] hover:text-[var(--gold-light)] text-sm transition-colors"
            >
              Всі категорії <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl p-6 hover:border-[var(--gold)] transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-[var(--dark-card)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--gold)]/10 transition-colors">
                  <cat.icon className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <p className="text-white font-medium mb-1">{cat.label}</p>
                <p className="text-[var(--text-muted)] text-sm">{cat.count} виконавців</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DAILY */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Щодня</h2>
              <p className="text-[var(--text-muted)]">Швидке бронювання без зайвих кліків</p>
            </div>
            <Link
              href="/daily"
              className="hidden sm:inline-flex items-center gap-1 text-[var(--gold)] hover:text-[var(--gold-light)] text-sm transition-colors"
            >
              Всі послуги <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyServices.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 hover:border-[var(--gold)] transition-all hover:-translate-y-1 flex flex-col gap-3"
              >
                <span className="text-4xl">{s.emoji}</span>
                <p className="text-white font-medium group-hover:text-[var(--gold)] transition-colors">
                  {s.label}
                </p>
                <div className="flex items-center gap-1 text-[var(--gold)] text-sm mt-auto">
                  Замовити зараз <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-[var(--dark-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">
              Технологічна перевага
            </h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Унікальні модулі, які роблять EventSphere більш ніж просто довідником
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl p-6 hover:border-[var(--gold)]/50 transition-colors"
              >
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-[var(--gold)] mb-2">{s.value}</p>
                <p className="text-[var(--text-muted)] text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[var(--dark-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Відгуки клієнтів</h2>
            <p className="text-[var(--text-muted)]">Реальні історії, реальні результати</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-[var(--text-muted)] text-xs">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOR VENDORS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-[var(--gold)] text-sm">Для виконавців та бізнесу</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Розвивайте свій івент-бізнес разом з нами
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Pro-портфоліо, CRM-система, модуль 360° та маркетингові інструменти — все, щоб
                отримувати більше замовлень і будувати репутацію.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[var(--gold-light)] transition-colors"
              >
                <Users className="w-5 h-5" />
                Стати партнером
              </Link>
              <Link
                href="/pro/pricing"
                className="inline-flex items-center justify-center gap-2 border border-[var(--dark-border)] text-white px-8 py-4 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                Переглянути тарифи
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
