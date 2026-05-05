import Link from "next/link";
import {
  TrendingUp,
  Star,
  BadgeCheck,
  BarChart3,
  FileText,
  Camera,
  Globe,
  Sparkles,
  ChevronRight,
  Check,
  Zap,
  Crown,
} from "lucide-react";

const plans = [
  {
    id: "standard",
    name: "Standard",
    price: 0,
    period: "безкоштовно",
    icon: Zap,
    features: [
      "Базове розміщення у каталозі",
      "До 10 фото у портфоліо",
      "Прийом запитів від клієнтів",
      "Відгуки та рейтинг",
      "Базова статистика",
    ],
    notIncluded: ["Пріоритет у пошуку", "360° тур", "CRM-система", "Прямі запити клієнтів"],
    cta: "Розпочати безкоштовно",
    highlighted: false,
  },
  {
    id: "pro",
    name: "PRO",
    price: 990,
    period: "/ місяць",
    icon: Star,
    features: [
      "Пріоритет у пошуку каталогу",
      "До 50 фото у портфоліо",
      "Підтримка 360° панорам",
      "CRM-система",
      "Генерація договорів",
      "Детальна аналітика",
      "Бейдж «PRO» у профілі",
    ],
    notIncluded: ["Топ-1 позиція", "Прямі запити без комісії"],
    cta: "Обрати PRO",
    highlighted: true,
  },
  {
    id: "max",
    name: "MAX",
    price: 2490,
    period: "/ місяць",
    icon: Crown,
    features: [
      "Топ-позиції у всіх розділах",
      "Необмежена кількість фото",
      "360° тур включено",
      "CRM + Виставлення рахунків",
      "Прямі запити від клієнтів",
      "Нульова комісія з угод",
      "Менеджер акаунту",
      "Пріоритетна підтримка 24/7",
    ],
    notIncluded: [],
    cta: "Обрати MAX",
    highlighted: false,
  },
];

const devCenterServices = [
  {
    icon: Camera,
    title: "Зйомка 3D-туру",
    desc: "Панорамний тур по вашому закладу для розміщення на платформі та Google Maps.",
    price: "від 3 500 ₴",
    tag: "Популярне",
  },
  {
    icon: Globe,
    title: "SMM-пакет",
    desc: "Ведення Instagram та TikTok: контент-план, дизайн, публікації, сторіс.",
    price: "від 5 900 ₴/міс",
    tag: null,
  },
  {
    icon: TrendingUp,
    title: "Таргетована реклама",
    desc: "Налаштування та ведення рекламних кампаній у Meta та Google Ads.",
    price: "від 4 500 ₴/міс",
    tag: null,
  },
  {
    icon: BarChart3,
    title: "Консультація стратега",
    desc: "1 година з маркетинговим стратегом — розбираємо позиціонування та зростання.",
    price: "2 500 ₴ / год",
    tag: "Хіт",
  },
];

const crmFeatures = [
  { icon: FileText, title: "База клієнтів", desc: "Вся історія взаємодій в одному місці" },
  { icon: FileText, title: "Генерація договорів", desc: "Готові шаблони з автозаповненням" },
  { icon: FileText, title: "Виставлення рахунків", desc: "PDF-рахунки в один клік" },
  { icon: BarChart3, title: "Аналітика дохідності", desc: "Графіки та звіти за будь-який період" },
];

export default function ProPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm">Для виконавців та бізнесу</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Ваша операційна система для івент-бізнесу
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-8">
            Pro-портфоліо, CRM, маркетинг і технології — все, щоб залучати більше клієнтів
            і будувати бездоганну репутацію.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=vendor"
              className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[var(--gold-light)] transition-colors"
            >
              Зареєструватись як виконавець
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center border border-[var(--dark-border)] text-white px-8 py-4 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
            >
              Переглянути тарифи
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Pro Portfolio preview */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[var(--gold)] text-sm mb-4">
                <BadgeCheck className="w-4 h-4" />
                Pro-портфоліо
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ваш персональний сайт всередині платформи
              </h2>
              <p className="text-[var(--text-muted)] mb-6 leading-relaxed">
                Pro-профіль замінює окремий сайт. Панорамні фото 360°, відгуки, календар
                зайнятості, прайс і контакти — все в одному місці, з трафіком EventSphere.
              </p>
              <ul className="space-y-3">
                {[
                  "Панорамні тури 360° по ваших локаціях",
                  "Верифікований бейдж і рейтинг",
                  "Інтерактивний календар зайнятості",
                  "Вбудована форма запиту ціни",
                  "SEO-оптимізована сторінка",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--text-muted)] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-3xl p-6 space-y-4">
              {/* Vendor card mockup */}
              <div className="h-40 bg-gradient-to-br from-[var(--dark)] to-[var(--dark-border)] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏛️</div>
                  <span className="text-[var(--gold)] text-xs px-2 py-1 bg-[var(--gold)]/10 rounded-full">360° Тур</span>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">Crystal Hall</h3>
                    <BadgeCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Банкетна зала · Київ</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-white text-sm font-medium">4.9</span>
                </div>
              </div>
              <div className="flex gap-2">
                {["Весілля", "Корпоратив", "Банкет"].map((t) => (
                  <span key={t} className="text-xs bg-[var(--dark)] border border-[var(--dark-border)] text-[var(--text-muted)] px-2 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[var(--gold)] text-black text-sm font-medium py-2.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors">
                  Запросити ціну
                </button>
                <button className="px-4 border border-[var(--dark-border)] text-[var(--text-muted)] rounded-xl hover:border-[var(--gold)] transition-colors text-sm">
                  360°
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CRM */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">CRM-система</h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Ведіть клієнтів, генеруйте договори та виставляйте рахунки прямо з платформи
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crmFeatures.map((f) => (
              <div key={f.title} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 hover:border-[var(--gold)]/50 transition-colors">
                <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <h3 className="text-white font-medium mb-1">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dev Center */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Центр розвитку</h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Замовте маркетингові послуги від нашої команди — від 3D-туру до SMM-стратегії
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {devCenterServices.map((s) => (
              <div key={s.title} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 hover:border-[var(--gold)]/50 transition-colors flex gap-4">
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{s.title}</h3>
                    {s.tag && (
                      <span className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mb-3">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--gold)] font-semibold text-sm">{s.price}</span>
                    <button className="text-[var(--text-muted)] hover:text-white text-sm transition-colors flex items-center gap-1">
                      Замовити <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Тарифи</h2>
            <p className="text-[var(--text-muted)]">Оберіть план, що підходить для вашого бізнесу</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-[var(--dark-card)] rounded-2xl p-7 border transition-colors ${
                  plan.highlighted
                    ? "border-[var(--gold)] shadow-[0_0_40px_rgba(201,168,76,0.1)]"
                    : "border-[var(--dark-border)]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--gold)] text-black text-xs font-semibold px-3 py-1 rounded-full">
                      Найпопулярніший
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlighted ? "bg-[var(--gold)]" : "bg-[var(--gold)]/10"}`}>
                    <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-black" : "text-[var(--gold)]"}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">
                    {plan.price === 0 ? "Безкоштовно" : `${plan.price.toLocaleString("uk-UA")} ₴`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[var(--text-muted)] text-sm">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--text-muted)]">{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 opacity-40">
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✕</span>
                      <span className="text-sm text-[var(--text-muted)] line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlighted
                      ? "bg-[var(--gold)] text-black hover:bg-[var(--gold-light)]"
                      : "border border-[var(--dark-border)] text-white hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
