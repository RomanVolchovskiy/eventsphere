import Link from "next/link";
import {
  MapPin,
  Star,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  Globe,
  Phone,
  Clock,
  Users,
  MessageSquare,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import BookingPanel from "./BookingPanel";

const vendor = {
  id: "1",
  businessName: "Crystal Hall",
  category: "Локація",
  city: "Київ, Поділ",
  address: "вул. Контрактова площа, 4",
  rating: 4.9,
  reviewsCount: 128,
  priceFrom: 15000,
  priceTo: 80000,
  isVerified: true,
  has360: true,
  subscription: "MAX",
  description:
    "Crystal Hall — преміальний банкетний зал у самому серці Подолу. 800 м² простору, висота стелі 6 метрів, власна кухня та унікальні інтер'єрні рішення. Ідеально підходить для весіль, корпоративів та ювілеїв будь-якого масштабу.",
  tags: ["Весілля", "Корпоратив", "Банкет", "Ювілей", "Презентація"],
  capacity: { min: 50, max: 500 },
  workingHours: "10:00–24:00",
  phone: "+380 44 123 45 67",
  website: "crystalhall.ua",
  instagram: "@crystalhall_kyiv",
  photos: ["", "", "", "", ""],
  services: [
    { name: "Оренда залу (будній день)", price: 15000, unit: "день" },
    { name: "Оренда залу (вихідний)", price: 25000, unit: "день" },
    { name: "Банкетне меню", price: 850, unit: "особа" },
    { name: "Фуршетне меню", price: 550, unit: "особа" },
    { name: "Декорування залу (базове)", price: 8000, unit: "захід" },
    { name: "Звукове обладнання", price: 3500, unit: "день" },
  ],
  bookedDates: ["2025-05-10", "2025-05-17", "2025-05-24", "2025-06-07"],
  reviews: [
    {
      id: "1",
      userName: "Марія К.",
      rating: 5,
      date: "2025-04-12",
      event: "Весілля",
      text: "Неймовірний зал! Персонал — просто супер. Всі деталі узгодили заздалегідь, жодних сюрпризів у день заходу. Гості були в захваті від інтер'єру.",
    },
    {
      id: "2",
      userName: "Олексій Т.",
      rating: 5,
      date: "2025-03-28",
      event: "Корпоратив на 150 осіб",
      text: "Чудова локація для корпоративних заходів. Зручне розташування в центрі міста, великий паркінг поруч. Кухня на висоті — гості їли з апетитом до кінця вечора.",
    },
    {
      id: "3",
      userName: "Юлія В.",
      rating: 4,
      date: "2025-02-14",
      event: "Ювілей",
      text: "Дуже гарний зал, хороша акустика. Єдиний мінус — паркінг платний і не завжди є місця. Але сам захід пройшов бездоганно.",
    },
  ],
  teamMatches: [
    { name: "Артем Мороз", role: "Ведучий", rating: 5.0, matchScore: 97 },
    { name: "DJ Maxim", role: "DJ", rating: 4.9, matchScore: 94 },
    { name: "FlowerBox Studio", role: "Декор", rating: 4.7, matchScore: 91 },
  ],
};

export default function VendorPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--dark-border)] bg-[var(--dark-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link href="/catalog" className="flex items-center gap-1 text-[var(--text-muted)] hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Каталог
          </Link>
          <span className="text-[var(--dark-border)]">/</span>
          <span className="text-white">{vendor.businessName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Photo gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-[var(--dark-card)] to-[var(--dark-border)] flex items-center justify-center relative group cursor-pointer">
                <span className="text-6xl opacity-20">🏛️</span>
                {vendor.has360 && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-[var(--gold)] text-sm px-3 py-1.5 rounded-full border border-[var(--gold)]/30 backdrop-blur-sm">
                      Переглянути 360°
                    </span>
                  </div>
                )}
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-[var(--dark-card)] to-[var(--dark-border)] flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <span className="text-2xl opacity-30">🏛️</span>
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-white">{vendor.businessName}</h1>
                  {vendor.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-green-400" />
                  )}
                  {vendor.subscription === "MAX" && (
                    <span className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 px-2 py-0.5 rounded-full">
                      MAX
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--gold)] font-medium">{vendor.category}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
                    <span className="text-white font-medium">{vendor.rating}</span>
                    <span>({vendor.reviewsCount} відгуків)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {vendor.capacity.min}–{vendor.capacity.max} гостей
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="w-9 h-9 border border-[var(--dark-border)] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 border border-[var(--dark-border)] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--text-muted)] text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">Про локацію</h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                {vendor.description}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "Графік роботи", value: vendor.workingHours },
                { icon: Phone, label: "Телефон", value: vendor.phone },
                { icon: Globe, label: "Сайт", value: vendor.website },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-4 h-4 text-[var(--gold)]" />
                    <span className="text-[var(--text-muted)] text-xs">{item.label}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Послуги та ціни</h2>
              <div className="space-y-2">
                {vendor.services.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between py-3 border-b border-[var(--dark-border)] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                      <span className="text-sm text-[var(--text-muted)]">{s.name}</span>
                    </div>
                    <span className="text-white text-sm font-medium flex-shrink-0">
                      {s.price.toLocaleString("uk-UA")} ₴
                      <span className="text-[var(--text-muted)] font-normal"> / {s.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Match team */}
            <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[var(--gold)]" />
                <h2 className="text-white font-semibold">Smart Match — команда мрії</h2>
              </div>
              <p className="text-[var(--text-muted)] text-sm mb-5">
                AI підібрав виконавців, які вже працювали з Crystal Hall і отримали найвищі оцінки
              </p>
              <div className="space-y-3">
                {vendor.teamMatches.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between bg-[var(--dark-card)] rounded-xl p-4 border border-[var(--dark-border)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-sm font-semibold text-[var(--gold)]">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <p className="text-[var(--text-muted)] text-xs">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                        <span className="text-white text-sm">{m.rating}</span>
                      </div>
                      <div className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5 rounded-full">
                        {m.matchScore}% збіг
                      </div>
                      <Link
                        href={`/catalog/${m.name}`}
                        className="text-[var(--gold)] text-xs hover:underline"
                      >
                        Профіль →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[var(--gold)]" />
                  Відгуки ({vendor.reviewsCount})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-white font-bold text-lg">{vendor.rating}</span>
                </div>
              </div>
              <div className="space-y-4">
                {vendor.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-sm font-semibold text-[var(--gold)]">
                          {r.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{r.userName}</p>
                          <p className="text-[var(--text-muted)] text-xs">{r.event} · {r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: booking panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingPanel
                vendorId={vendor.id}
                priceFrom={vendor.priceFrom}
                priceTo={vendor.priceTo}
                bookedDates={vendor.bookedDates}
                vendorName={vendor.businessName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
