import Link from "next/link";
import {
  MapPin,
  Music,
  UtensilsCrossed,
  Camera,
  Flower2,
  Star,
  BadgeCheck,
  SlidersHorizontal,
  Search,
} from "lucide-react";

const categories = [
  { id: "all", label: "Всі", icon: null },
  { id: "venue", label: "Локації", icon: MapPin },
  { id: "entertainment", label: "Шоу-програма", icon: Music },
  { id: "catering", label: "Кейтеринг", icon: UtensilsCrossed },
  { id: "photo", label: "Фото/Відео", icon: Camera },
  { id: "decor", label: "Декор", icon: Flower2 },
];

const vendors = [
  {
    id: "1",
    name: "Crystal Hall",
    category: "venue",
    categoryLabel: "Локація",
    city: "Київ",
    rating: 4.9,
    reviews: 128,
    priceFrom: 15000,
    isVerified: true,
    has360: true,
    tags: ["Весілля", "Корпоратив", "Банкет"],
    image: null,
  },
  {
    id: "2",
    name: "Артем Мороз — Ведучий",
    category: "entertainment",
    categoryLabel: "Шоу-програма",
    city: "Київ",
    rating: 5.0,
    reviews: 87,
    priceFrom: 8000,
    isVerified: true,
    has360: false,
    tags: ["Весілля", "День народження", "Корпоратив"],
    image: null,
  },
  {
    id: "3",
    name: "Catering Pro",
    category: "catering",
    categoryLabel: "Кейтеринг",
    city: "Харків",
    rating: 4.8,
    reviews: 54,
    priceFrom: 450,
    isVerified: true,
    has360: false,
    tags: ["Фуршет", "Банкет", "Виїзна кухня"],
    image: null,
  },
  {
    id: "4",
    name: "Студія Lumière",
    category: "photo",
    categoryLabel: "Фото/Відео",
    city: "Київ",
    rating: 4.9,
    reviews: 211,
    priceFrom: 5000,
    isVerified: true,
    has360: false,
    tags: ["Фотозйомка", "Відеозйомка", "Аерозйомка"],
    image: null,
  },
  {
    id: "5",
    name: "FlowerBox Studio",
    category: "decor",
    categoryLabel: "Декор",
    city: "Одеса",
    rating: 4.7,
    reviews: 93,
    priceFrom: 3000,
    isVerified: false,
    has360: false,
    tags: ["Квіти", "Архи", "Живі стіни"],
    image: null,
  },
  {
    id: "6",
    name: "Ресторан Panorama",
    category: "venue",
    categoryLabel: "Локація",
    city: "Львів",
    rating: 4.8,
    reviews: 76,
    priceFrom: 12000,
    isVerified: true,
    has360: true,
    tags: ["Весілля", "День народження", "Романтик"],
    image: null,
  },
];

export default function CatalogPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-white mb-2">Енциклопедія свят</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Знайдіть ідеального виконавця для вашого заходу серед верифікованих партнерів
          </p>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Пошук за назвою, містом, послугою..."
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
              />
            </div>
            <button className="flex items-center gap-2 bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Фільтри
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/catalog" : `/catalog?cat=${cat.id}`}
                className="flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 border-transparent hover:text-white text-[var(--text-muted)] transition-colors"
              >
                {cat.icon && <cat.icon className="w-4 h-4" />}
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--text-muted)] text-sm">
            Знайдено <span className="text-white font-medium">{vendors.length}</span> виконавців
          </p>
          <select className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]">
            <option>За рейтингом</option>
            <option>Ціна: від низької</option>
            <option>Ціна: від високої</option>
            <option>Найновіші</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: (typeof vendors)[0] }) {
  const categoryColors: Record<string, string> = {
    venue: "text-blue-400",
    entertainment: "text-purple-400",
    catering: "text-orange-400",
    photo: "text-pink-400",
    decor: "text-green-400",
  };

  return (
    <Link
      href={`/catalog/${vendor.id}`}
      className="group bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl overflow-hidden hover:border-[var(--gold)]/50 transition-all hover:-translate-y-1"
    >
      {/* Photo placeholder */}
      <div className="h-48 bg-gradient-to-br from-[var(--dark)] to-[var(--dark-border)] flex items-center justify-center relative">
        <div className="text-4xl opacity-20">📸</div>
        {vendor.has360 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[var(--gold)] text-xs px-2 py-1 rounded-full border border-[var(--gold)]/30">
            360°
          </div>
        )}
        {vendor.isVerified && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Верифіковано
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold group-hover:text-[var(--gold)] transition-colors">
            {vendor.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-white text-sm font-medium">{vendor.rating}</span>
            <span className="text-[var(--text-muted)] text-xs">({vendor.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-medium ${categoryColors[vendor.category] || "text-gray-400"}`}>
            {vendor.categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs">
            <MapPin className="w-3 h-3" />
            {vendor.city}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {vendor.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--dark)] text-[var(--text-muted)] text-xs px-2 py-0.5 rounded-full border border-[var(--dark-border)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[var(--text-muted)] text-xs">від </span>
            <span className="text-white font-semibold">
              {vendor.priceFrom.toLocaleString("uk-UA")} ₴
            </span>
          </div>
          <span className="text-[var(--gold)] text-sm group-hover:underline">Деталі →</span>
        </div>
      </div>
    </Link>
  );
}
