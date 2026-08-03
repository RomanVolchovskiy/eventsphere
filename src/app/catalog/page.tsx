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
import { getDb } from "@/lib/db";

// `id` — значення для ?cat=…, `enum` — відповідник у EventCategory (prisma/schema.prisma)
const categories = [
  { id: "all", label: "Всі", icon: null, enum: null },
  { id: "venue", label: "Локації", icon: MapPin, enum: "VENUE" },
  { id: "entertainment", label: "Шоу-програма", icon: Music, enum: "ENTERTAINMENT" },
  { id: "catering", label: "Кейтеринг", icon: UtensilsCrossed, enum: "CATERING" },
  { id: "photo", label: "Фото/Відео", icon: Camera, enum: "PHOTO_VIDEO" },
  { id: "decor", label: "Декор", icon: Flower2, enum: "DECOR" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  VENUE: "Локація",
  ENTERTAINMENT: "Шоу-програма",
  CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео",
  DECOR: "Декор",
};

// Кольори підпису категорії на картці — ключі збігаються з EventCategory
const CATEGORY_COLORS: Record<string, string> = {
  VENUE: "text-blue-400",
  ENTERTAINMENT: "text-purple-400",
  CATERING: "text-orange-400",
  PHOTO_VIDEO: "text-pink-400",
  DECOR: "text-green-400",
};

const tagsByCategory: Record<string, string[]> = {
  VENUE: ["Весілля", "Корпоратив", "Банкет"],
  ENTERTAINMENT: ["Ведучий", "DJ", "Музика"],
  CATERING: ["Фуршет", "Банкет", "Кейтеринг"],
  PHOTO_VIDEO: ["Фотозйомка", "Відеозйомка", "360°"],
  DECOR: ["Квіти", "Декор", "Оформлення"],
};

// «1 виконавця / 2 виконавців / 5 виконавців» — українська форма множини
function declineVendors(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "виконавця";
  return "виконавців";
}

type VendorCardData = {
  id: string;
  businessName: string;
  category: string;
  city: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number | null;
  isVerified: boolean;
  panoramaUrl: string | null;
  photos: string[];
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCat = categories.find((c) => c.id === cat) ?? categories[0];

  const db = getDb();
  const vendors: VendorCardData[] = await db.vendor.findMany({
    where: activeCat.enum ? { category: activeCat.enum } : undefined,
    orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
    select: {
      id: true,
      businessName: true,
      category: true,
      city: true,
      rating: true,
      reviewsCount: true,
      priceFrom: true,
      isVerified: true,
      panoramaUrl: true,
      photos: true,
    },
  });

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
            {categories.map((c) => {
              const isActive = c.id === activeCat.id;
              return (
                <Link
                  key={c.id}
                  href={c.id === "all" ? "/catalog" : `/catalog?cat=${c.id}`}
                  className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-[var(--gold)] text-[var(--gold)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {c.icon && <c.icon className="w-4 h-4" />}
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--text-muted)] text-sm">
            Знайдено{" "}
            <span className="text-white font-medium">{vendors.length}</span>{" "}
            {declineVendors(vendors.length)}
            {activeCat.enum && (
              <span className="text-[var(--text-muted)]">
                {" "}
                у категорії «{activeCat.label}»
              </span>
            )}
          </p>
          <select className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]">
            <option>За рейтингом</option>
            <option>Ціна: від низької</option>
            <option>Ціна: від високої</option>
            <option>Найновіші</option>
          </select>
        </div>

        {vendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl opacity-20 mb-4">🔍</div>
            <p className="text-white font-medium mb-1">Поки що порожньо</p>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              У цій категорії ще немає виконавців.
            </p>
            <Link
              href="/catalog"
              className="text-[var(--gold)] text-sm hover:underline"
            >
              Переглянути всі категорії →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: VendorCardData }) {
  const tags = tagsByCategory[vendor.category] ?? [];
  const has360 = Boolean(vendor.panoramaUrl);
  const cover = vendor.photos[0];

  return (
    <Link
      href={`/catalog/${vendor.id}`}
      className="group bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl overflow-hidden hover:border-[var(--gold)]/50 transition-all hover:-translate-y-1"
    >
      {/* Photo placeholder */}
      <div className="h-48 bg-gradient-to-br from-[var(--dark)] to-[var(--dark-border)] flex items-center justify-center relative">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl opacity-20">📸</div>
        )}
        {has360 && (
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
            {vendor.businessName}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-white text-sm font-medium">
              {vendor.rating.toFixed(1)}
            </span>
            <span className="text-[var(--text-muted)] text-xs">
              ({vendor.reviewsCount})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs font-medium ${
              CATEGORY_COLORS[vendor.category] ?? "text-gray-400"
            }`}
          >
            {CATEGORY_LABELS[vendor.category] ?? vendor.category}
          </span>
          <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs">
            <MapPin className="w-3 h-3" />
            {vendor.city}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag) => (
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
            {vendor.priceFrom !== null ? (
              <>
                <span className="text-[var(--text-muted)] text-xs">від </span>
                <span className="text-white font-semibold">
                  {vendor.priceFrom.toLocaleString("uk-UA")} ₴
                </span>
              </>
            ) : (
              <span className="text-[var(--text-muted)] text-sm">
                Ціна за запитом
              </span>
            )}
          </div>
          <span className="text-[var(--gold)] text-sm group-hover:underline">Деталі →</span>
        </div>
      </div>
    </Link>
  );
}
